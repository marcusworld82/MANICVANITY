import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/localCatalog';

const CartDrawer: React.FC = () => {
  const { isOpen, closeCart, items, itemCount, subtotal, updateQuantity, removeItem } = useCart();

  const handleCheckout = async () => {
    // Navigate to checkout page instead of direct Stripe
    window.location.href = '/checkout';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-card border-l border-dark-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <h2 className="text-xl font-semibold text-dark-text flex items-center space-x-2">
                <ShoppingBag size={20} />
                <span>Cart ({itemCount})</span>
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCart}
                className="text-dark-muted hover:text-electric-400 transition-colors duration-200"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="text-dark-muted mx-auto mb-4" />
                  <p className="text-dark-muted text-lg mb-2">Your cart is empty</p>
                  <p className="text-dark-muted text-sm">Add some items to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex space-x-4 bg-dark-bg/50 rounded-lg p-4"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-dark-border rounded-lg flex-shrink-0 overflow-hidden">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.images[0].alt || item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-electric-500/20 to-neon-500/20 flex items-center justify-center">
                            <ShoppingBag size={20} className="text-dark-muted" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-dark-text font-medium truncate">
                          {item.product?.name}
                        </h3>
                        {item.variant && (
                          <p className="text-dark-muted text-sm">{item.variant.name}</p>
                        )}
                        <p className="text-electric-400 font-semibold">
                          {formatPrice((item.base_price + (item.price_modifier || 0)))}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.qty - 1)}
                            className="w-8 h-8 bg-dark-border rounded-full flex items-center justify-center text-dark-muted hover:text-electric-400 hover:bg-electric-500/20 transition-colors duration-200"
                          >
                            <Minus size={14} />
                          </motion.button>
                          
                          <span className="text-dark-text font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-dark-border rounded-full flex items-center justify-center text-dark-muted hover:text-electric-400 hover:bg-electric-500/20 transition-colors duration-200"
                          >
                            <Plus size={14} />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.id)}
                            className="ml-2 text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-dark-border p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-dark-text">Subtotal:</span>
                  <span className="text-electric-400">{formatPrice(subtotal)}</span>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Checkout</span>
                    <ArrowRight size={18} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeCart}
                    className="w-full py-3 border border-dark-border bg-dark-bg/50 text-dark-text rounded-lg font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200"
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;