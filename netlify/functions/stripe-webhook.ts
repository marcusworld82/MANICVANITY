import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return { statusCode: 400, body: 'Missing signature or webhook secret' };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      webhookSecret
    );

    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object as Stripe.Checkout.Session);
        break;
      
      case 'charge.refunded':
        await handleChargeRefunded(stripeEvent.data.object as Stripe.Charge);
        break;
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: 'Webhook processed' };

  } catch (error) {
    console.error('Webhook error:', error);
    return { 
      statusCode: 400, 
      body: `Webhook error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    // Find the order by stripe_session_id
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderError);
      return;
    }

    // Update order status to paid
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      return;
    }

    // Create order items from cart snapshot
    if (order.temp_cart && Array.isArray(order.temp_cart)) {
      const orderItems = order.temp_cart.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId || null,
        qty: item.quantity,
        unit_cents: item.unitPrice,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Failed to create order items:', itemsError);
      }

      // Decrement stock for variants
      for (const item of order.temp_cart) {
        if (item.variantId) {
          await supabase.rpc('decrement_variant_stock', {
            variant_id: item.variantId,
            quantity: item.quantity
          });
        }
      }
    }

    // Clear user's cart
    if (order.user_id) {
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', order.user_id)
        .single();

      if (cart) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id);
      }
    }

    // Log development email
    await supabase
      .from('dev_emails')
      .insert({
        to_email: session.customer_details?.email || 'unknown@example.com',
        subject: `Order Confirmation - MANIC VANITY #${order.id.slice(0, 8)}`,
        body: `Thank you for your order! Your payment of $${(order.total_cents / 100).toFixed(2)} has been processed successfully.`,
      });

    console.log(`Order ${order.id} completed successfully`);

  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    // Find order by payment intent
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', charge.payment_intent);

    if (error || !orders || orders.length === 0) {
      console.error('Order not found for refund:', error);
      return;
    }

    // Update order status to refunded
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'refunded',
        updated_at: new Date().toISOString()
      })
      .eq('id', orders[0].id);

    if (updateError) {
      console.error('Failed to update order status to refunded:', updateError);
    }

    console.log(`Order ${orders[0].id} marked as refunded`);

  } catch (error) {
    console.error('Error handling charge refund:', error);
  }
}