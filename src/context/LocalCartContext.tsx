import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalAuth } from './LocalAuthContext';

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: any, options?: { size?: string; color?: string; quantity?: number }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearAllItems: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useLocalAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const getStorageKey = () => user ? `cart_${user.id}` : 'cart_guest';

  useEffect(() => {
    const key = getStorageKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, [user]);

  const saveCart = (newItems: CartItem[]) => {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(newItems));
    setItems(newItems);
  };

  const addToCart = (product: any, options: { size?: string; color?: string; quantity?: number } = {}) => {
    const newItem: CartItem = {
      id: `${product.id}_${options.size || ''}_${options.color || ''}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image1_url || '',
      size: options.size,
      color: options.color,
      quantity: options.quantity || 1
    };

    const existing = items.find(item => item.id === newItem.id);
    if (existing) {
      updateQuantity(existing.id, existing.quantity + newItem.quantity);
    } else {
      saveCart([...items, newItem]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    const newItems = items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    saveCart(newItems);
  };

  const removeItem = (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    saveCart(newItems);
  };

  const clearAllItems = () => {
    saveCart([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart,
      updateQuantity,
      removeItem,
      clearAllItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}