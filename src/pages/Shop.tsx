import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Filter } from 'lucide-react';
import { listProducts, listCategories, formatPrice } from '../data/catalog';
import { useCart } from '../context/CartContext';
import type { Product, Category } from '../types/database';

const ProductSkeleton: React.FC = () => (
  <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[3/4] bg-dark-border"></div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-dark-border rounded w-3/4"></div>
      <div className="h-4 bg-dark-border rounded w-1/2"></div>
    </div>
  </div>
);

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const { addItem } = useCart();
  const primaryImage = product.images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/p/${product.slug}`} className="block">
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-electric-400/50 transition-all duration-300">
          {/* Product Image */}
          <div className="aspect-[3/4] relative overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-electric-500/20 to-neon-500/20 flex items-center justify-center">
                <ShoppingBag size={48} className="text-dark-muted" />
              </div>
            )}
            
            {/* Quick Add Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              onClick={handleAddToCart}
              className="absolute bottom-4 right-4 bg-dark-card/90 backdrop-blur-sm border border-dark-border rounded-full p-2 text-dark-muted hover:text-electric-400 hover:border-electric-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ShoppingBag size={18} />
            </motion.button>

            {/* Sale Badge */}
            {product.compare_at_cents && product.compare_at_cents > product.price_cents && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-electric-500 to-neon-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Sale
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-dark-text font-semibold text-lg mb-2 group-hover:text-electric-400 transition-colors duration-200">
              {product.name}
            </h3>
            
            <div className="flex items-center space-x-2">
              <span className="text-electric-400 font-bold text-lg">
                {formatPrice(product.price_cents)}
              </span>
              {product.compare_at_cents && product.compare_at_cents > product.price_cents && (
                <span className="text-dark-muted line-through text-sm">
                  {formatPrice(product.compare_at_cents)}
                </span>
              )}
            </div>

            {product.category && (
              <p className="text-dark-muted text-sm mt-1">{product.category.name}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam || '');
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        listProducts({ categorySlug: selectedCategory || undefined }),
        listCategories(),
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-space text-dark-text mb-4">
            {selectedCategory ? 
              categories.find(c => c.slug === selectedCategory)?.name || 'Shop Collection' 
              : 'Shop Collection'
            }
          </h1>
          <p className="text-dark-muted text-lg max-w-2xl mx-auto">
            Discover pieces that define your rebellion. Each item is crafted for those who dare to be different.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Filter className="text-dark-muted" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-electric-400"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <p className="text-dark-muted">
            {loading ? 'Loading...' : `${products.length} products`}
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Show skeleton cards while loading
            Array.from({ length: 12 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            // Empty state
            <div className="col-span-full text-center py-12">
              <ShoppingBag size={64} className="text-dark-muted mx-auto mb-4" />
              <h3 className="text-dark-text text-xl font-semibold mb-2">No products found</h3>
              <p className="text-dark-muted">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;