import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Package, ShoppingCart, AlertTriangle } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<string>('');

  const isAdminEnabled = import.meta.env.VITE_ENABLE_ADMIN === 'true';

  if (!isAdminEnabled) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-dark-text mb-2">Admin Panel Disabled</h2>
          <p className="text-dark-muted">Set VITE_ENABLE_ADMIN=true to access admin tools</p>
        </div>
      </div>
    );
  }

  const handleReseed = async () => {
    setLoading('reseed');
    setResults('');

    try {
      const response = await fetch('/.netlify/functions/admin-reseed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': import.meta.env.VITE_NETLIFY_ADMIN_SECRET || '',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setResults(`✅ Reseed completed: ${data.productsAdded} products added, ${data.imagesAdded} images added`);
      } else {
        setResults(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResults(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateOrders = async () => {
    setLoading('orders');
    setResults('');

    try {
      const response = await fetch('/.netlify/functions/admin-generate-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Secret': import.meta.env.VITE_NETLIFY_ADMIN_SECRET || '',
        },
        body: JSON.stringify({ count: 15 }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResults(`✅ Generated ${data.ordersCreated} demo orders with ${data.itemsCreated} items for ${data.testUser}`);
      } else {
        setResults(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResults(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="text-white" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-space text-dark-text mb-2">
            Admin Panel
          </h1>
          <p className="text-dark-muted">
            Development tools for seeding and testing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Reseed Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Package className="text-electric-400" size={24} />
              <h3 className="text-dark-text font-semibold text-lg">Reseed Products</h3>
            </div>
            <p className="text-dark-muted text-sm mb-6">
              Add more products with random images and restock low-quantity variants
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReseed}
              disabled={loading === 'reseed'}
              className="w-full py-3 bg-gradient-to-r from-electric-500 to-electric-600 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-electric-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading === 'reseed' ? 'Reseeding...' : 'Reseed Products'}
            </motion.button>
          </motion.div>

          {/* Generate Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <ShoppingCart className="text-neon-400" size={24} />
              <h3 className="text-dark-text font-semibold text-lg">Generate Demo Orders</h3>
            </div>
            <p className="text-dark-muted text-sm mb-6">
              Create fake orders for testing the order management system
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateOrders}
              disabled={loading === 'orders'}
              className="w-full py-3 bg-gradient-to-r from-neon-500 to-neon-600 text-white rounded-lg font-semibold hover:from-neon-600 hover:to-neon-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading === 'orders' ? 'Generating...' : 'Generate 15 Orders'}
            </motion.button>
          </motion.div>
        </div>

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6"
          >
            <h3 className="text-dark-text font-semibold text-lg mb-4">Results</h3>
            <pre className="text-dark-muted text-sm whitespace-pre-wrap font-mono bg-dark-bg rounded-lg p-4">
              {results}
            </pre>
          </motion.div>
        )}

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mt-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <AlertTriangle className="text-red-400" size={20} />
            <h4 className="text-red-400 font-semibold">Development Only</h4>
          </div>
          <p className="text-red-300 text-sm">
            These tools are for development and testing purposes only. 
            Do not use in production environments.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;