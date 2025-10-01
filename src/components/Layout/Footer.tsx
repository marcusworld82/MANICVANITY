import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Twitter, Facebook, Youtube, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const helpLinks = [
    { name: 'Customer Service', href: '/help/customer-service' },
    { name: 'Size Guide', href: '/help/size-guide' },
    { name: 'Shipping & Returns', href: '/help/shipping' },
    { name: 'FAQ', href: '/help/faq' }
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Sustainability', href: '/sustainability' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookies', href: '/cookies' }
  ];

  return (
    <footer className="bg-dark-card border-t border-dark-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold font-space bg-gradient-to-r from-electric-400 via-neon-400 to-emerald-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              MANIC VANITY
            </motion.h2>
            <p className="text-dark-muted mb-6 max-w-md leading-relaxed">
              Discover the extraordinary. Embrace the unconventional. Express your unique style with our curated collection of avant-garde fashion.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <h3 className="text-dark-text font-semibold mb-3">Stay Connected</h3>
              <div className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-l-lg focus:outline-none focus:border-electric-400 text-dark-text"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-r-lg hover:from-electric-600 hover:to-neon-600 transition-all duration-200"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[Instagram, Twitter, Facebook, Youtube, Linkedin, Mail].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-dark-bg border border-dark-border rounded-full flex items-center justify-center text-dark-muted hover:text-electric-400 hover:border-electric-400 transition-all duration-200"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-dark-text font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-dark-muted hover:text-electric-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-dark-text font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-dark-muted hover:text-electric-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-dark-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center md:justify-start space-x-6 mb-4 md:mb-0">
            {legalLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-dark-muted hover:text-electric-400 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>
          <p className="text-sm text-dark-muted">
            © {new Date().getFullYear()} MANIC VANITÉ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;