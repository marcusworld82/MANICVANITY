import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Filter, X, ChevronDown, Eye, Heart, Grid2x2 as Grid, List } from 'lucide-react';
import { getProducts, getCategories, formatPrice } from '../data/localCatalog';
import { useCart } from '../context/CartContext';
import type { LocalProduct as Product, LocalCategory as Category } from '../data/localCatalog';

interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2X', '3X', '4X', '5X', '6X'];
const COLORS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Gray', 'Orange'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name A-Z' }
];

const ProductSkeleton: React.FC = () => (
  <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[3/4] bg-dark-border"></div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-dark-border rounded w-3/4"></div>
      <div className="h-4 bg-dark-border rounded w-1/2"></div>
    </div>
  </div>
);

const ProductCard: React.FC<{ product: Product; index: number; viewMode: 'grid' | 'list' }> = ({ 
  product, 
  index, 
  viewMode 
}) => {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    console.log('Quick view:', product.name);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="group"
      >
        <Link to={`/p/${product.slug}`} className="block">
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-electric-400/50 transition-all duration-300 flex">
            {/* Product Image */}
            <div className="w-48 h-48 relative overflow-hidden flex-shrink-0">
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
            </div>

            {/* Product Info */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-dark-text font-semibold text-xl mb-2 group-hover:text-electric-400 transition-colors duration-200">
                  {product.name}
                </h3>
                
                {product.description && (
                  <p className="text-dark-muted text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-electric-400 font-bold text-xl">
                    {formatPrice(product.base_price)}
                  </span>
                  {product.variants && product.variants.length > 0 && (
                    <span className="text-dark-muted line-through text-lg">
                      {formatPrice(product.base_price + 10)}
                    </span>
                  )}
                </div>

                {product.category && (
                  <p className="text-dark-muted text-sm capitalize">{product.category}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-electric-500 to-neon-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleQuickView}
                  className="bg-dark-bg border border-dark-border text-dark-text px-4 py-2 rounded-lg hover:border-electric-400 hover:text-electric-400 transition-all duration-200"
                >
                  <Eye size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/p/${product.slug}`} className="block">
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-electric-400/50 transition-all duration-300">
          {/* Product Image */}
          <div className="aspect-[3/4] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isHovered && secondaryImage ? (
                <motion.img
                  key="secondary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={secondaryImage.url}
                  alt={secondaryImage.alt || product.name}
                  className="w-full h-full object-cover"
                />
              ) : primaryImage ? (
                <motion.img
                  key="primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={primaryImage.url}
                  alt={primaryImage.alt || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-electric-500/20 to-neon-500/20 flex items-center justify-center">
                  <ShoppingBag size={48} className="text-dark-muted" />
                </div>
              )}
            </AnimatePresence>
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 left-4 right-4 flex space-x-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 bg-dark-card/90 backdrop-blur-sm border border-dark-border rounded-lg px-3 py-2 text-dark-text hover:text-electric-400 hover:border-electric-400 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={16} />
                <span className="text-sm font-medium">Add to Cart</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickView}
                className="bg-dark-card/90 backdrop-blur-sm border border-dark-border rounded-lg p-2 text-dark-muted hover:text-electric-400 hover:border-electric-400 transition-all duration-200"
              >
                <Eye size={16} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-dark-card/90 backdrop-blur-sm border border-dark-border rounded-lg p-2 text-dark-muted hover:text-red-400 hover:border-red-400 transition-all duration-200"
              >
                <Heart size={16} />
              </motion.button>
            </motion.div>

            {/* Sale Badge */}
            {product.compare_at_cents && product.compare_at_cents > product.price_cents && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-electric-500 to-neon-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Sale
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-dark-text font-semibold text-lg mb-2 group-hover:text-electric-400 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-electric-400 font-bold text-lg">
                {formatPrice(product.base_price)}
              </span>
              {product.variants && product.variants.length > 0 && (
                <span className="text-dark-muted line-through text-sm">
                  {formatPrice(product.base_price + 10)}
                </span>
              )}
            </div>

            {product.category && (
              <p className="text-dark-muted text-sm capitalize">{product.category}</p>
            )}

            {/* Variants Preview */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex items-center space-x-1 mt-2">
                {product.variants.slice(0, 4).map((variant, idx) => (
                  <div
                    key={variant.id}
                    className="w-4 h-4 rounded-full bg-dark-border border border-dark-muted"
                    title={variant.name}
                  />
                ))}
                {product.variants.length > 4 && (
                  <span className="text-dark-muted text-xs">+{product.variants.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const FilterSidebar: React.FC<{
  categories: Category[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ categories, filters, onFiltersChange, isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    sizes: true,
    colors: true,
    price: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    
    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const handleColorChange = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    
    onFiltersChange({ ...filters, colors: newColors });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 1000]
    });
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-dark-text font-semibold text-lg">Filters</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearAllFilters}
            className="text-electric-400 text-sm hover:text-electric-300 transition-colors duration-200"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="lg:hidden text-dark-muted hover:text-electric-400 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-dark-text font-medium mb-3"
        >
          <span>Categories</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${expandedSections.categories ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.categories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 overflow-hidden"
            >
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.slug)}
                    onChange={() => handleCategoryChange(category.slug)}
                    className="w-4 h-4 text-electric-500 bg-dark-bg border-dark-border rounded focus:ring-electric-500 focus:ring-2"
                  />
                  <span className="text-dark-muted text-sm">{category.name}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sizes */}
      <div>
        <button
          onClick={() => toggleSection('sizes')}
          className="flex items-center justify-between w-full text-dark-text font-medium mb-3"
        >
          <span>Sizes</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${expandedSections.sizes ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.sizes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-3 gap-2 overflow-hidden"
            >
              {SIZES.map((size) => (
                <motion.button
                  key={size}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSizeChange(size)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    filters.sizes.includes(size)
                      ? 'border-electric-400 bg-electric-500/10 text-electric-400'
                      : 'border-dark-border text-dark-muted hover:border-electric-400/50 hover:text-electric-400'
                  }`}
                >
                  {size}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Colors */}
      <div>
        <button
          onClick={() => toggleSection('colors')}
          className="flex items-center justify-between w-full text-dark-text font-medium mb-3"
        >
          <span>Colors</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${expandedSections.colors ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.colors && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-4 gap-2 overflow-hidden"
            >
              {COLORS.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    filters.colors.includes(color)
                      ? 'border-electric-400 ring-2 ring-electric-400/30'
                      : 'border-dark-border hover:border-electric-400/50'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-dark-text font-medium mb-3"
        >
          <span>Price Range</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${expandedSections.price ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    priceRange: [Number(e.target.value), filters.priceRange[1]]
                  })}
                  className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text text-sm"
                />
                <span className="text-dark-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    priceRange: [filters.priceRange[0], Number(e.target.value)]
                  })}
                  className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text text-sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:relative lg:translate-x-0 fixed left-0 top-0 h-full w-80 bg-dark-card border-r border-dark-border z-50 lg:z-0 overflow-y-auto"
      >
        <div className="p-6">
          {sidebarContent}
        </div>
      </motion.div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-dark-card border-r border-dark-border overflow-y-auto">
        <div className="p-6">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 1000]
  });

  const productsPerPage = 12;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, filters, sortBy]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      if (!filters.categories.includes(categoryParam)) {
        setFilters(prev => ({
          ...prev,
          categories: [categoryParam]
        }));
      }
    }
  }, [searchParams, categories, filters.categories]);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = getProducts({ limit: 100 });
      const categoriesData = getCategories();
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Apply price filter
    filtered = filtered.filter(product => {
     const price = product.base_price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.base_price - b.base_price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.base_price - a.base_price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const activeFiltersCount = filters.categories.length + filters.sizes.length + filters.colors.length;

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-space text-dark-text mb-4">
            Shop Collection
          </h1>
          <p className="text-dark-muted text-lg max-w-2xl mx-auto">
            Discover pieces that define your rebellion. Each item is crafted for those who dare to be different.
          </p>
        </motion.div>

        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar
            categories={categories}
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />

          {/* Main Content */}
          <div className="flex-1 lg:ml-6">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-between mb-8 bg-dark-card border border-dark-border rounded-2xl p-4"
            >
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center space-x-2 text-dark-muted hover:text-electric-400 transition-colors duration-200"
                >
                  <Filter size={20} />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-electric-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </motion.button>

                <div className="flex items-center space-x-2">
                  <span className="text-dark-muted text-sm">View:</span>
                  <div className="flex items-center bg-dark-bg border border-dark-border rounded-lg p-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-all duration-200 ${
                        viewMode === 'grid'
                          ? 'bg-electric-500 text-white'
                          : 'text-dark-muted hover:text-electric-400'
                      }`}
                    >
                      <Grid size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-electric-500 text-white'
                          : 'text-dark-muted hover:text-electric-400'
                      }`}
                    >
                      <List size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-electric-400"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <p className="text-dark-muted text-sm">
                  {loading ? 'Loading...' : `${filteredProducts.length} products`}
                </p>
              </div>
            </motion.div>

            {/* Products Grid/List */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-6'
                  }
                >
                  {Array.from({ length: 12 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </motion.div>
              ) : paginatedProducts.length > 0 ? (
                <motion.div
                  key={`${viewMode}-${currentPage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-6'
                  }
                >
                  {paginatedProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index}
                      viewMode={viewMode}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <ShoppingBag size={64} className="text-dark-muted mx-auto mb-4" />
                  <h3 className="text-dark-text text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-dark-muted">Try adjusting your filters or check back later.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilters({
                      categories: [],
                      sizes: [],
                      colors: [],
                      priceRange: [0, 1000]
                    })}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200"
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center space-x-2 mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text hover:border-electric-400 hover:text-electric-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </motion.button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-electric-500 to-neon-500 text-white'
                        : 'bg-dark-card border border-dark-border text-dark-text hover:border-electric-400 hover:text-electric-400'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text hover:border-electric-400 hover:text-electric-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;