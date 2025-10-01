import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Plus, 
  Minus, 
  ChevronDown,
  ChevronUp,
  Truck,
  Shield,
  RotateCcw,
  Star
} from 'lucide-react';
import { getProductBySlug, formatPrice, listProducts } from '../data/catalog';
import { useCart } from '../context/CartContext';
import type { Product, Variant } from '../types/database';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    materials: false,
    care: false,
    shipping: false
  });

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2X', '3X', '4X', '5X', '6X'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow'];

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

      // Load related products from same category
      if (productData?.category_id) {
        const related = await listProducts({ 
          categorySlug: productData.category?.slug,
          limit: 4 
        });
        setRelatedProducts(related.filter(p => p.id !== productData.id));
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

  const handleBuyNow = async () => {
    if (!product) return;
    
    await addItem(product, selectedVariant || undefined, quantity);
    navigate('/checkout');
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const currentPrice = selectedVariant?.price_cents || product?.price_cents || 0;
  const comparePrice = product?.compare_at_cents;
  const isOnSale = comparePrice && comparePrice > currentPrice;

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-dark-card border border-dark-border">
              {product.images && product.images.length > 0 ? (
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
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
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <motion.button
                    key={image.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
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
            {/* Category & Reviews */}
            <div className="flex items-center justify-between">
              {product.category && (
                <span className="text-electric-400 font-medium text-sm uppercase tracking-wide">
                  {product.category.name}
                </span>
              )}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
                <span className="text-dark-muted text-sm ml-2">(127 reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold font-space text-dark-text">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-electric-400">
                {formatPrice(currentPrice)}
              </span>
              {isOnSale && (
                <>
                  <span className="text-xl text-dark-muted line-through">
                    {formatPrice(comparePrice)}
                  </span>
                  <span className="bg-gradient-to-r from-electric-500 to-neon-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Save {Math.round(((comparePrice - currentPrice) / comparePrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="text-dark-text font-semibold mb-3 flex items-center justify-between">
                <span>Size: {selectedSize && <span className="text-electric-400">{selectedSize}</span>}</span>
                <button className="text-electric-400 text-sm hover:text-electric-300 transition-colors duration-200">
                  Size Guide
                </button>
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-electric-400 bg-electric-500/10 text-electric-400'
                        : 'border-dark-border text-dark-muted hover:border-electric-400/50 hover:text-electric-400'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <h3 className="text-dark-text font-semibold mb-3">
                Color: {selectedColor && <span className="text-electric-400">{selectedColor}</span>}
              </h3>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-electric-400 ring-2 ring-electric-400/30'
                        : 'border-dark-border hover:border-electric-400/50'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-sm font-medium">In Stock - Ready to Ship</span>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-dark-text font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-dark-border rounded-lg">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-dark-muted hover:text-electric-400 transition-colors duration-200"
                  >
                    <Minus size={18} />
                  </motion.button>
                  <span className="px-4 py-3 text-dark-text font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-dark-muted hover:text-electric-400 transition-colors duration-200"
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="py-4 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={20} />
                  <span>Add to Cart</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="py-4 bg-dark-text text-dark-bg rounded-lg font-semibold hover:bg-dark-muted transition-all duration-200"
                >
                  Buy Now
                </motion.button>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 border border-dark-border bg-dark-card text-dark-text rounded-lg font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Heart size={18} />
                  <span>Add to Wishlist</span>
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

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-dark-border">
              <div className="text-center">
                <Truck className="text-electric-400 mx-auto mb-2" size={24} />
                <p className="text-dark-text text-sm font-medium">Free Shipping</p>
                <p className="text-dark-muted text-xs">On orders over $150</p>
              </div>
              <div className="text-center">
                <RotateCcw className="text-electric-400 mx-auto mb-2" size={24} />
                <p className="text-dark-text text-sm font-medium">Easy Returns</p>
                <p className="text-dark-muted text-xs">30-day return policy</p>
              </div>
              <div className="text-center">
                <Shield className="text-electric-400 mx-auto mb-2" size={24} />
                <p className="text-dark-text text-sm font-medium">Secure Payment</p>
                <p className="text-dark-muted text-xs">SSL encrypted checkout</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-16"
        >
          <h2 className="text-2xl font-bold text-dark-text mb-6">Product Details</h2>
          
          <div className="space-y-4">
            {/* Description */}
            <div className="border-b border-dark-border pb-4">
              <button
                onClick={() => toggleSection('description')}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-dark-text font-semibold text-lg">Description</h3>
                {expandedSections.description ? (
                  <ChevronUp className="text-dark-muted" size={20} />
                ) : (
                  <ChevronDown className="text-dark-muted" size={20} />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.description && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      <p className="text-dark-muted leading-relaxed">
                        {product.description || 'This stunning piece embodies the MANIC VANITY aesthetic with its bold design and premium materials. Crafted for those who dare to be different, it combines rebellious style with uncompromising quality.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Materials */}
            <div className="border-b border-dark-border pb-4">
              <button
                onClick={() => toggleSection('materials')}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-dark-text font-semibold text-lg">Materials & Construction</h3>
                {expandedSections.materials ? (
                  <ChevronUp className="text-dark-muted" size={20} />
                ) : (
                  <ChevronDown className="text-dark-muted" size={20} />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.materials && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      <ul className="text-dark-muted space-y-2">
                        <li>• 100% Premium Cotton with reinforced stitching</li>
                        <li>• Heavyweight 280gsm fabric for durability</li>
                        <li>• Pre-shrunk to maintain fit after washing</li>
                        <li>• Double-needle hemmed sleeves and bottom</li>
                        <li>• Tagless label for comfort</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Care Instructions */}
            <div className="border-b border-dark-border pb-4">
              <button
                onClick={() => toggleSection('care')}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-dark-text font-semibold text-lg">Care Instructions</h3>
                {expandedSections.care ? (
                  <ChevronUp className="text-dark-muted" size={20} />
                ) : (
                  <ChevronDown className="text-dark-muted" size={20} />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.care && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      <ul className="text-dark-muted space-y-2">
                        <li>• Machine wash cold with like colors</li>
                        <li>• Use mild detergent, avoid bleach</li>
                        <li>• Tumble dry low or hang dry</li>
                        <li>• Iron inside out on low heat if needed</li>
                        <li>• Do not dry clean</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shipping */}
            <div>
              <button
                onClick={() => toggleSection('shipping')}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-dark-text font-semibold text-lg">Shipping & Returns</h3>
                {expandedSections.shipping ? (
                  <ChevronUp className="text-dark-muted" size={20} />
                ) : (
                  <ChevronDown className="text-dark-muted" size={20} />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.shipping && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-dark-text font-medium mb-2">Shipping</h4>
                          <ul className="text-dark-muted text-sm space-y-1">
                            <li>• Free shipping on orders over $150</li>
                            <li>• Standard shipping: 5-7 business days</li>
                            <li>• Express shipping: 2-3 business days</li>
                            <li>• International shipping available</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-dark-text font-medium mb-2">Returns</h4>
                          <ul className="text-dark-muted text-sm space-y-1">
                            <li>• 30-day return policy</li>
                            <li>• Items must be unworn and tagged</li>
                            <li>• Free return shipping</li>
                            <li>• Refunds processed within 5-7 days</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-dark-text mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link to={`/p/${relatedProduct.slug}`} className="block">
                    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-electric-400/50 transition-all duration-300">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        {relatedProduct.images?.[0] ? (
                          <img
                            src={relatedProduct.images[0].url}
                            alt={relatedProduct.images[0].alt || relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-electric-500/20 to-neon-500/20 flex items-center justify-center">
                            <ShoppingBag size={32} className="text-dark-muted" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-dark-text font-semibold mb-2 group-hover:text-electric-400 transition-colors duration-200 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-electric-400 font-bold">
                          {formatPrice(relatedProduct.price_cents)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;