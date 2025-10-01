import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './LocalAuthContext';
import { getCartItems, addToCart, updateCartQuantity, clearCart as clearDbCart } from '../data/localCatalog';
import type { LocalProduct, LocalVariant } from '../data/localCatalog';

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  product_name: string;
  base_price: number;
  size?: string;
  color?: string;
  price_modifier: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: LocalProduct, variant?: LocalVariant, quantity?: number) => Promise<void>;
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

export const LocalCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Local storage key for guest cart
  const LOCAL_CART_KEY = 'manicvanity-local-cart';

  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      loadLocalCart();
    }
  }, [user]);

  const loadUserCart = () => {
    if (!user) return;
    
    try {
      const cartItems = getCartItems(user.id);
      setItems(cartItems as CartItem[]);
      
      // Migrate local cart if exists
      migrateLocalCart();
    } catch (error) {
      console.error('Error loading user cart:', error);
    }
  };

  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem(LOCAL_CART_KEY);
      if (localCart) {
        const localItems = JSON.parse(localCart);
        setItems(localItems);
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
    }
  };

  const migrateLocalCart = () => {
    if (!user) return;
    
    try {
      const localCart = localStorage.getItem(LOCAL_CART_KEY);
      if (!localCart) return;

      const localItems = JSON.parse(localCart);
      
      localItems.forEach((item: CartItem) => {
        addToCart(user.id, item.product_id, item.variant_id, item.quantity);
      });

      localStorage.removeItem(LOCAL_CART_KEY);
      loadUserCart();
    } catch (error) {
      console.error('Error migrating local cart:', error);
    }
  };

  const saveLocalCart = (cartItems: CartItem[]) => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
  };

  const addItem = async (product: LocalProduct, variant?: LocalVariant, quantity = 1) => {
    if (user) {
      // Add to database
      try {
        addToCart(user.id, product.id, variant?.id || null, quantity);
        loadUserCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      // Add to local storage
      const newItem: CartItem = {
        id: `local-${Date.now()}`,
        user_id: 'guest',
        product_id: product.id,
        variant_id: variant?.id || null,
        quantity,
        created_at: new Date().toISOString(),
        product_name: product.name,
        base_price: product.base_price,
        size: variant?.size,
        color: variant?.color,
        price_modifier: variant?.price_modifier || 0
      };
      
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      saveLocalCart(updatedItems);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (user && !itemId.startsWith('local-')) {
      updateCartQuantity(itemId, quantity);
      loadUserCart();
    } else {
      const updatedItems = items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0);
      
      setItems(updatedItems);
      saveLocalCart(updatedItems);
    }
  };

  const removeItem = async (itemId: string) => {
    if (user && !itemId.startsWith('local-')) {
      updateCartQuantity(itemId, 0);
      loadUserCart();
    } else {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      saveLocalCart(updatedItems);
    }
  };

  const clearCart = async () => {
    if (user) {
      clearDbCart(user.id);
    } else {
      localStorage.removeItem(LOCAL_CART_KEY);
    }
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Calculate totals
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => {
    const price = item.base_price + (item.price_modifier || 0);
    return total + (price * item.quantity);
  }, 0);

  const value = {
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