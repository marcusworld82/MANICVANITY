import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { listProducts, listCategories } from '../data/catalog';
import type { Product, Category } from '../types/database';

const TestProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productsData, categoriesData] = await Promise.all([
        listProducts({ limit: 100 }),
        listCategories()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      
      console.log('Products loaded:', productsData);
      console.log('Categories loaded:', categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
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

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-text mb-4">Product Test Page</h1>
          <p className="text-dark-muted">Testing if products are loaded correctly from Supabase</p>
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
            <h3 className="text-red-400 font-semibold mb-2">Error Loading Data</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Categories Summary */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-dark-text mb-4">Categories ({categories.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-dark-bg rounded-lg p-3">
                <h3 className="text-dark-text font-medium">{category.name}</h3>
                <p className="text-dark-muted text-sm">Slug: {category.slug}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Products Summary */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-dark-text mb-4">Products ({products.length})</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-dark-muted text-lg">No products found</p>
              <p className="text-dark-muted text-sm mt-2">
                This could mean the SQL migration didn't run successfully or there's a connection issue.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="bg-dark-bg rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-dark-text font-semibold">{product.name}</h3>
                    <span className="text-electric-400 font-bold">
                      ${(product.price_cents / 100).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-dark-muted">Slug: {product.slug}</p>
                      <p className="text-dark-muted">Category: {product.category?.name || 'None'}</p>
                    </div>
                    
                    <div>
                      <p className="text-dark-muted">Images: {product.images?.length || 0}</p>
                      <p className="text-dark-muted">Variants: {product.variants?.length || 0}</p>
                    </div>
                    
                    <div>
                      {product.description && (
                        <p className="text-dark-muted text-xs line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Show variants if any */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-dark-border">
                      <p className="text-dark-muted text-sm mb-2">Variants:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.slice(0, 10).map((variant) => (
                          <span
                            key={variant.id}
                            className="bg-electric-500/20 text-electric-400 px-2 py-1 rounded text-xs"
                          >
                            {variant.name} (Stock: {variant.stock})
                          </span>
                        ))}
                        {product.variants.length > 10 && (
                          <span className="text-dark-muted text-xs">
                            +{product.variants.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="px-6 py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200"
          >
            Refresh Data
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TestProducts;