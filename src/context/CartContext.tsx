import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Cart, CartItem, Product, Variant } from '../types/database';

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, variant?: Variant, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface LocalCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  variant?: Variant;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Local storage key for guest cart
  const LOCAL_CART_KEY = 'manic-vanity-cart';

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      loadLocalCart();
    }
  }, [user]);

  const loadUserCart = async () => {
    setLoading(true);
    try {
      // Get or create user cart
      let { data: existingCart } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (!existingCart) {
        const { data: newCart } = await supabase
          .from('carts')
          .insert({ user_id: user!.id })
          .select()
          .single();
        existingCart = newCart;
      }

      setCart(existingCart);

      // Load cart items
      if (existingCart) {
        const { data: cartItems } = await supabase
          .from('cart_items')
          .select(`
            *,
            product:products(*),
            variant:variants(*)
          `)
          .eq('cart_id', existingCart.id);

        setItems(cartItems || []);
      }

      // Migrate local cart if exists
      await migrateLocalCart(existingCart);
    } catch (error) {
      console.error('Error loading user cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem(LOCAL_CART_KEY);
      if (localCart) {
        const localItems: LocalCartItem[] = JSON.parse(localCart);
        const cartItems: CartItem[] = localItems.map((item, index) => ({
          id: `local-${index}`,
          cart_id: 'local',
          product_id: item.productId,
          variant_id: item.variantId || null,
          qty: item.quantity,
          product: item.product,
          variant: item.variant,
        }));
        setItems(cartItems);
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
    }
  };

  const migrateLocalCart = async (userCart: Cart) => {
    try {
      const localCart = localStorage.getItem(LOCAL_CART_KEY);
      if (!localCart) return;

      const localItems: LocalCartItem[] = JSON.parse(localCart);
      
      for (const item of localItems) {
        await supabase.from('cart_items').insert({
          cart_id: userCart.id,
          product_id: item.productId,
          variant_id: item.variantId || null,
          qty: item.quantity,
        });
      }

      // Clear local cart after migration
      localStorage.removeItem(LOCAL_CART_KEY);
      
      // Reload cart to get migrated items
      loadUserCart();
    } catch (error) {
      console.error('Error migrating local cart:', error);
    }
  };

  const saveLocalCart = (cartItems: CartItem[]) => {
    const localItems: LocalCartItem[] = cartItems.map(item => ({
      productId: item.product_id,
      variantId: item.variant_id || undefined,
      quantity: item.qty,
      product: item.product!,
      variant: item.variant,
    }));
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(localItems));
  };

  const addItem = async (product: Product, variant?: Variant, quantity = 1) => {
    if (user && cart) {
      // Add to Supabase cart
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: product.id,
          variant_id: variant?.id || null,
          qty: quantity,
        })
        .select(`
          *,
          product:products(*),
          variant:variants(*)
        `)
        .single();

      if (!error && data) {
        setItems(prev => [...prev, data]);
      }
    } else {
      // Add to local cart
      const newItem: CartItem = {
        id: `local-${Date.now()}`,
        cart_id: 'local',
        product_id: product.id,
        variant_id: variant?.id || null,
        qty: quantity,
        product,
        variant,
      };
      
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      saveLocalCart(updatedItems);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(itemId);
    }

    if (user && cart && !itemId.startsWith('local-')) {
      // Update in Supabase
      const { error } = await supabase
        .from('cart_items')
        .update({ qty: quantity })
        .eq('id', itemId);

      if (!error) {
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, qty: quantity } : item
        ));
      }
    } else {
      // Update local cart
      const updatedItems = items.map(item => 
        item.id === itemId ? { ...item, qty: quantity } : item
      );
      setItems(updatedItems);
      saveLocalCart(updatedItems);
    }
  };

  const removeItem = async (itemId: string) => {
    if (user && cart && !itemId.startsWith('local-')) {
      // Remove from Supabase
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (!error) {
        setItems(prev => prev.filter(item => item.id !== itemId));
      }
    } else {
      // Remove from local cart
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      saveLocalCart(updatedItems);
    }
  };

  const clearCart = async () => {
    if (user && cart) {
      // Clear Supabase cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id);
    } else {
      // Clear local cart
      localStorage.removeItem(LOCAL_CART_KEY);
    }
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Calculate totals
  const itemCount = items.reduce((total, item) => total + item.qty, 0);
  const subtotal = items.reduce((total, item) => {
    const price = item.variant?.price_cents || item.product?.price_cents || 0;
    return total + (price * item.qty);
  }, 0);

  const value = {
    cart,
    items,
    itemCount,
    subtotal,
    loading,
    isOpen,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};