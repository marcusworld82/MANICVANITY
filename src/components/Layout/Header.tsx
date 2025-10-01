import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, ChevronDown, Filter } from 'lucide-react';
import AccountDropdown from '../Auth/AccountDropdown';
import { useCart } from '../../context/LocalCartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { itemCount, openCart } = useCart();

  const navItems = [
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections', hasDropdown: true },
    { name: 'Command Center', href: '/command-center' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const categories = [
    { name: 'Electric Nights', href: '/shop?category=electric-nights' },
    { name: 'Neon Dreams', href: '/shop?category=neon-dreams' },
    { name: 'Emerald Edge', href: '/shop?category=emerald-edge' },
    { name: 'Dark Matter', href: '/shop?category=dark-matter' }
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <motion.h1 
              className="text-xl sm:text-2xl font-bold font-space bg-gradient-to-r from-electric-400 via-neon-400 to-emerald-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              MANIC VANITY
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setShowCategoryMenu(true)}
                    onMouseLeave={() => setShowCategoryMenu(false)}
                  >
                    <button className="flex items-center space-x-1 text-dark-muted hover:text-electric-400 transition-colors duration-200 font-medium">
                      <span>{item.name}</span>
                      <ChevronDown size={16} />
                    </button>
                    
                    {showCategoryMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-dark-card border border-dark-border rounded-xl shadow-xl py-2"
                      >
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            to={category.href}
                            className="block px-4 py-3 text-dark-muted hover:text-electric-400 hover:bg-dark-bg/50 transition-colors duration-200"
                          >
                            {category.name}
                          </Link>
                        ))}
                        <div className="border-t border-dark-border mt-2 pt-2">
                          <Link
                            to="/shop"
                            className="block px-4 py-3 text-electric-400 hover:bg-electric-500/10 transition-colors duration-200 font-medium"
                          >
                            View All Products
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="text-dark-muted hover:text-electric-400 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearchModal(true)}
              className="text-dark-muted hover:text-electric-400 transition-colors duration-200 relative"
            >
              <Search size={20} />
            </motion.button>
            
            <AccountDropdown />
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className="text-dark-muted hover:text-electric-400 transition-colors duration-200 relative"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-neon-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden text-dark-muted hover:text-electric-400 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-dark-border"
          >
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-dark-muted hover:text-electric-400 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;