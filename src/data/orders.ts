import { supabase } from '../lib/supabase';
import type { Order, OrderItem } from '../types/database';

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(name, slug, images:product_images(url, alt)),
        variant:variants(name)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
};

export const getOrderById = async (orderId: string, userId: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(name, slug, images:product_images(url, alt)),
        variant:variants(name)
      )
    `)
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
};

export const reorderItems = async (orderId: string, userId: string): Promise<OrderItem[]> => {
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      *,
      product:products(*),
      variant:variants(*)
    `)
    .eq('order_id', orderId)
    .eq('orders.user_id', userId);

  if (error) {
    console.error('Error fetching order items for reorder:', error);
    return [];
  }

  return data || [];
};