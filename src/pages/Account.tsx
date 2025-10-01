import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, MapPin, Heart, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Account: React.FC = () => {
  const { user } = useAuth();

  const accountSections = [
    {
      title: 'Orders',
      description: 'View your order history and track shipments',
      icon: Package,
      href: '/account/orders',
      color: 'from-electric-500 to-electric-600'
    },
    {
      title: 'Addresses',
      description: 'Manage your shipping and billing addresses',
      icon: MapPin,
      href: '/account/addresses',
      color: 'from-neon-500 to-neon-600'
    },
    {
      title: 'Wishlist',
      description: 'Save items for later purchase',
      icon: Heart,
      href: '/account/wishlist',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Settings',
      description: 'Update your account preferences',
      icon: Settings,
      href: '/account/settings',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-electric-500 to-neon-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-space text-dark-text mb-2">
            My Account
          </h1>
          <p className="text-dark-muted">
            Welcome back, {user?.email?.split('@')[0]}
          </p>
        </motion.div>

        {/* Account Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accountSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link
                to={section.href}
                className="block bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-electric-400/50 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <section.icon className="text-white" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-dark-text font-semibold text-lg mb-1 group-hover:text-electric-400 transition-colors duration-200">
                      {section.title}
                    </h3>
                    <p className="text-dark-muted text-sm leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-dark-card/50 border border-dark-border rounded-2xl p-6"
        >
          <h3 className="text-dark-text font-semibold text-lg mb-4">Account Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-electric-400 mb-1">0</div>
              <div className="text-dark-muted text-sm">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-400 mb-1">0</div>
              <div className="text-dark-muted text-sm">Wishlist Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">1</div>
              <div className="text-dark-muted text-sm">Saved Addresses</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;