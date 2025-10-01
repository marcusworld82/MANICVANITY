import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, getCartItems, saveCartItems, addToCart as dbAddToCart, updateCartItemQuantity, removeFromCart, clearCart } from '../lib/database';
import { useLocalAuth } from './LocalAuthContext';
import type { Product } from '../lib/database';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  loading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, options?: { size?: string; color?: string; quantity?: number }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearAllItems: () => Promise<void>;
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
  const { user } = useLocalAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load cart items when user changes
  useEffect(() => {
    loadCartItems();
  }, [user?.id]);

  const loadCartItems = async () => {
    setLoading(true);
    try {
      const cartItems = await getCartItems(user?.id);
      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, options: { size?: string; color?: string; quantity?: number } = {}) => {
    try {
      await dbAddToCart(product, options, user?.id);
      await loadCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartItemQuantity(itemId, quantity, user?.id);
      await loadCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId, user?.id);
      await loadCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearAllItems = async () => {
    try {
      await clearCart(user?.id);
      await loadCartItems();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Calculate totals
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value = {
    items,
    itemCount,
    subtotal,
    isOpen,
    loading,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearAllItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};