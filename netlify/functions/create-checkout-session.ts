import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

interface CheckoutItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface RequestBody {
  items: CheckoutItem[];
  userId?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

  try {
    const { items, userId }: RequestBody = JSON.parse(event.body || '{}');

    if (!items || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No items provided' }),
      };
    }

    // Fetch product and variant data from Supabase
    const productIds = items.map(item => item.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id, name, price_cents,
        variants(id, name, price_cents, sku)
      `)
      .in('id', productIds);

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    // Build line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const cartSnapshot: any[] = [];
    let totalCents = 0;

    for (const item of items) {
      const product = products?.find(p => p.id === item.productId);
      if (!product) continue;

      let price = product.price_cents;
      let name = product.name;
      let sku = product.id;

      if (item.variantId) {
        const variant = product.variants?.find(v => v.id === item.variantId);
        if (variant) {
          price = variant.price_cents || product.price_cents;
          name = `${product.name} - ${variant.name}`;
          sku = variant.sku;
        }
      }

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name,
            metadata: {
              productId: item.productId,
              variantId: item.variantId || '',
            },
          },
          unit_amount: price,
        },
        quantity: item.quantity,
      });

      cartSnapshot.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: price,
        name,
        sku,
      });

      totalCents += price * item.quantity;
    }

    // Add shipping (flat $6.00)
    const shippingCents = 600;
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: shippingCents,
      },
      quantity: 1,
    });

    // Add tax (8.5% on subtotal)
    const taxCents = Math.round(totalCents * 0.085);
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Tax',
        },
        unit_amount: taxCents,
      },
      quantity: 1,
    });

    const finalTotal = totalCents + shippingCents + taxCents;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'http://localhost:5173'}/checkout/cancel`,
      metadata: {
        source: 'manic-vanity-store',
        userId: userId || '',
      },
    });

    // Create pending order in database
    if (userId) {
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_cents: finalTotal,
          currency: 'usd',
          status: 'pending',
          stripe_session_id: session.id,
          temp_cart: cartSnapshot,
          payment_method: 'stripe',
        });

      if (orderError) {
        console.error('Failed to create order:', orderError);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };

  } catch (error) {
    console.error('Checkout error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};