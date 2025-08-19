export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  compare_at_cents: number | null;
  currency: string;
  created_at: string;
  category?: Category;
  images?: ProductImage[];
  variants?: Variant[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  position: number;
}

export interface Variant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price_cents: number | null;
  stock: number;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  qty: number;
  product?: Product;
  variant?: Variant;
}

export interface Order {
  id: string;
  user_id: string;
  total_cents: number;
  currency: string;
  status: string;
  stripe_session_id: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  qty: number;
  unit_cents: number;
  product?: Product;
  variant?: Variant;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
}

export interface Wishlist {
  id: string;
  user_id: string;
  created_at: string;
  items?: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  product?: Product;
}