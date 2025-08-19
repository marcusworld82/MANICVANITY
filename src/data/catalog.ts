import { supabase } from '../lib/supabase';
import type { Category, Product } from '../types/database';

export interface ListProductsParams {
  categorySlug?: string;
  limit?: number;
  offset?: number;
}

export const listCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
};

export const listProducts = async (params: ListProductsParams = {}): Promise<Product[]> => {
  const { categorySlug, limit = 50, offset = 0 } = params;

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:variants(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:variants(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  // Sort images by position
  if (data.images) {
    data.images.sort((a, b) => a.position - b.position);
  }

  return data;
};

export const formatPrice = (cents: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
};