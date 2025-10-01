import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, Package, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/LocalAuthContext';

const AccountDropdown: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) {
    return (
      <Link
        to="/auth/sign-in"
        className="text-dark-muted hover:text-electric-400 transition-colors duration-200 flex items-center space-x-1"
      >
        <User size={20} />
        <span className="hidden sm:inline text-sm">Sign In</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="text-dark-muted hover:text-electric-400 transition-colors duration-200 flex items-center space-x-2"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-electric-500 to-neon-500 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <span className="hidden sm:inline text-sm max-w-24 truncate">
          {user.email?.split('@')[0]}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-dark-card border border-dark-border rounded-xl shadow-xl z-50"
          >
            <div className="p-4 border-b border-dark-border">
              <p className="text-dark-text font-medium truncate">{user.email}</p>
              <p className="text-dark-muted text-sm">MANIC VANITY Member</p>
            </div>

            <div className="py-2">
              <Link
                to="/account/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-dark-muted hover:text-electric-400 hover:bg-dark-bg/50 transition-colors duration-200"
              >
                <Package size={18} />
                <span>My Orders</span>
              </Link>

              <Link
                to="/account/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-dark-muted hover:text-electric-400 hover:bg-dark-bg/50 transition-colors duration-200"
              >
                <Heart size={18} />
                <span>Wishlist</span>
              </Link>

              <Link
                to="/account/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-dark-muted hover:text-electric-400 hover:bg-dark-bg/50 transition-colors duration-200"
              >
                <Settings size={18} />
                <span>Account Settings</span>
              </Link>
            </div>

            <div className="border-t border-dark-border py-2">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors duration-200 w-full text-left"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountDropdown;