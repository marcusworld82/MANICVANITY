import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check admin secret
  const adminSecret = event.headers['x-admin-secret'];
  if (adminSecret !== process.env.NETLIFY_ADMIN_SECRET) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    const { count = 10 } = JSON.parse(event.body || '{}');

    // Get a test user (create one if needed)
    const testEmail = 'demo@manicvanity.com';
    let { data: user } = await supabase.auth.admin.listUsers();
    let testUser = user?.users.find(u => u.email === testEmail);

    if (!testUser) {
      const { data: newUser } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: 'demo123456',
        email_confirm: true,
      });
      testUser = newUser.user;
    }

    if (!testUser) {
      throw new Error('Failed to create test user');
    }

    // Get some products
    const { data: products } = await supabase
      .from('products')
      .select('id, price_cents')
      .limit(20);

    if (!products || products.length === 0) {
      throw new Error('No products found');
    }

    // Generate fake orders
    const orders = [];
    const statuses = ['paid', 'pending', 'refunded'];

    for (let i = 0; i < count; i++) {
      const orderProducts = products
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);

      const totalCents = orderProducts.reduce((sum, p) => sum + p.price_cents, 0);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Create order 1-30 days ago
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      orders.push({
        user_id: testUser.id,
        total_cents: totalCents + 600 + Math.round(totalCents * 0.085), // Add shipping and tax
        currency: 'usd',
        status,
        stripe_session_id: `demo_session_${Date.now()}_${i}`,
        payment_method: 'stripe',
        created_at: createdAt.toISOString(),
      });
    }

    const { data: newOrders, error: ordersError } = await supabase
      .from('orders')
      .insert(orders)
      .select('id');

    if (ordersError) {
      throw new Error(`Failed to create orders: ${ordersError.message}`);
    }

    // Create order items
    const orderItems = [];
    for (let i = 0; i < newOrders.length; i++) {
      const order = newOrders[i];
      const orderProducts = products
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);

      for (const product of orderProducts) {
        orderItems.push({
          order_id: order.id,
          product_id: product.id,
          variant_id: null,
          qty: Math.floor(Math.random() * 3) + 1,
          unit_cents: product.price_cents,
        });
      }
    }

    if (orderItems.length > 0) {
      await supabase.from('order_items').insert(orderItems);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Demo orders generated',
        ordersCreated: newOrders.length,
        itemsCreated: orderItems.length,
        testUser: testEmail
      }),
    };

  } catch (error) {
    console.error('Generate orders error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};