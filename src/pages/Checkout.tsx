import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/LocalAuthContext';
import { formatPrice } from '../data/localCatalog';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shippingCents = 600; // $6.00 flat shipping
  const taxRate = 0.085; // 8.5% tax
  const tax = subtotal * taxRate;
  const total = subtotal + 6.00 + tax;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
  }, [items, navigate]);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth/sign-in');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const checkoutItems = items.map(item => ({
        productId: item.product_id,
        variantId: item.variant_id || undefined,
        quantity: item.qty,
      }));

      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-dark-muted hover:text-electric-400 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-dark-text mb-6">Order Summary</h2>
            
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex space-x-4">
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

                  <div className="flex-1 min-w-0">
                    <h3 className="text-dark-text font-medium truncate">
                      {item.product?.name}
                    </h3>
                    {item.variant && (
                      <p className="text-dark-muted text-sm">{item.variant.name}</p>
                    )}
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-dark-muted text-sm">Qty: {item.quantity}</span>
                      <span className="text-electric-400 font-semibold">
                        {formatPrice((item.base_price + (item.price_modifier || 0)) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t border-dark-border pt-4 space-y-2">
                <div className="flex justify-between text-dark-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-dark-muted">
                  <span>Shipping</span>
                  <span>{formatPrice(6.00)}</span>
                </div>
                <div className="flex justify-between text-dark-muted">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-dark-text border-t border-dark-border pt-2">
                  <span>Total</span>
                  <span className="text-electric-400">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-dark-text mb-6">Payment</h2>
            
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm mb-6">
                  {error}
                </div>
              )}

              {!user && (
                <div className="bg-electric-500/10 border border-electric-500/20 rounded-lg p-4 mb-6">
                  <p className="text-electric-400 text-sm">
                    Please sign in to continue with checkout.
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-dark-muted">
                  <Lock size={20} />
                  <span className="text-sm">Secure checkout powered by Stripe</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={loading || !user}
                  className="w-full py-4 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <CreditCard size={20} />
                  <span>{loading ? 'Processing...' : 'Pay with Card'}</span>
                </motion.button>

                <div className="text-center">
                  <p className="text-dark-muted text-xs">
                    By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;