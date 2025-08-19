import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Share2, Plus, Minus } from 'lucide-react';
import { getProductBySlug, formatPrice } from '../data/catalog';
import { useCart } from '../context/CartContext';
import type { Product, Variant } from '../types/database';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadProduct(slug);
    }
  }, [slug]);

  const loadProduct = async (productSlug: string) => {
    setLoading(true);
    try {
      const productData = await getProductBySlug(productSlug);
      setProduct(productData);
      
      // Set first variant as default if available
      if (productData?.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0]);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    await addItem(product, selectedVariant || undefined, quantity);
    // TODO: Show success toast
  };

  const currentPrice = selectedVariant?.price_cents || product?.price_cents || 0;
  const comparePrice = product?.compare_at_cents;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-400"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="text-electric-400 hover:text-electric-300"
          >
            Return to shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/shop')}
          className="flex items-center space-x-2 text-dark-muted hover:text-electric-400 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Shop</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]?.url}
                  alt={product.images[selectedImageIndex]?.alt || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-electric-500/20 to-neon-500/20 flex items-center justify-center">
                  <ShoppingBag size={64} className="text-dark-muted" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <motion.button
                    key={image.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                      selectedImageIndex === index
                        ? 'border-electric-400'
                        : 'border-dark-border hover:border-electric-400/50'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            {product.category && (
              <p className="text-electric-400 font-medium">{product.category.name}</p>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold font-space text-dark-text">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-electric-400">
                {formatPrice(currentPrice)}
              </span>
              {comparePrice && comparePrice > currentPrice && (
                <span className="text-lg text-dark-muted line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-invert max-w-none">
                <p className="text-dark-muted leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-dark-text font-semibold mb-3">
                  {product.variants[0].name.includes('Size') ? 'Size' : 'Options'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <motion.button
                      key={variant.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                        selectedVariant?.id === variant.id
                          ? 'border-electric-400 bg-electric-400/10 text-electric-400'
                          : 'border-dark-border text-dark-muted hover:border-electric-400/50 hover:text-electric-400'
                      }`}
                    >
                      {variant.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-dark-text font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-dark-border rounded-lg">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-dark-muted hover:text-electric-400 transition-colors duration-200"
                  >
                    <Minus size={18} />
                  </motion.button>
                  <span className="px-4 py-2 text-dark-text font-medium">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-dark-muted hover:text-electric-400 transition-colors duration-200"
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full py-4 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </motion.button>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 border border-dark-border bg-dark-card text-dark-text rounded-lg font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Heart size={18} />
                  <span>Wishlist</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 border border-dark-border bg-dark-card text-dark-text rounded-lg font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;