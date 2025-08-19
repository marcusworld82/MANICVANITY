import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

const CheckoutCancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Cancel Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="text-white" size={40} />
          </motion.div>

          {/* Cancel Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-space text-dark-text mb-4">
              Payment Cancelled
            </h1>
            <p className="text-dark-muted text-lg mb-8">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ShoppingBag className="text-electric-400" size={24} />
              <h3 className="text-dark-text font-semibold text-lg">Your Cart is Safe</h3>
            </div>
            <p className="text-dark-muted text-sm leading-relaxed">
              Don't worry! All items in your cart have been saved. You can continue shopping 
              or try checking out again when you're ready.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/checkout"
              className="px-6 py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Try Again</span>
            </Link>
            
            <Link
              to="/shop"
              className="px-6 py-3 border border-dark-border bg-dark-card text-dark-text rounded-lg font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft size={18} />
              <span>Continue Shopping</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutCancel;