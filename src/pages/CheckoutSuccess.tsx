import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { formatPrice } from '../data/catalog';

interface SessionData {
  id: string;
  amount_total: number;
  currency: string;
  payment_status: string;
  customer_email: string;
  status: string;
}

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionId) {
      fetchSessionData(sessionId);
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [sessionId]);

  const fetchSessionData = async (id: string) => {
    try {
      const response = await fetch('/.netlify/functions/get-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch session data');
      }

      setSessionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Something went wrong</h2>
          <p className="text-dark-muted mb-6">{error}</p>
          <Link
            to="/shop"
            className="text-electric-400 hover:text-electric-300 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="text-white" size={40} />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-space text-dark-text mb-4">
              Order Confirmed!
            </h1>
            <p className="text-dark-muted text-lg mb-8">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </motion.div>

          {/* Order Details */}
          {sessionData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-dark-muted">Order ID</span>
                  <span className="text-dark-text font-mono text-sm">
                    {sessionData.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-dark-muted">Total Paid</span>
                  <span className="text-electric-400 font-bold text-lg">
                    {formatPrice(sessionData.amount_total || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-dark-muted">Payment Status</span>
                  <span className="text-emerald-400 font-medium capitalize">
                    {sessionData.payment_status}
                  </span>
                </div>
                
                {sessionData.customer_email && (
                  <div className="flex justify-between items-center">
                    <span className="text-dark-muted">Email</span>
                    <span className="text-dark-text">{sessionData.customer_email}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-dark-card/50 border border-dark-border rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Package className="text-electric-400" size={24} />
              <h3 className="text-dark-text font-semibold text-lg">What's Next?</h3>
            </div>
            <p className="text-dark-muted text-sm leading-relaxed">
              You'll receive an email confirmation shortly with your order details and tracking information. 
              Your items will be carefully packaged and shipped within 1-2 business days.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/account/orders"
              className="px-6 py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>View Orders</span>
              <ArrowRight size={18} />
            </Link>
            
            <Link
              to="/shop"
              className="px-6 py-3 border border-dark-border bg-dark-card text-dark-text rounded-lg font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;