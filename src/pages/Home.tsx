import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Star } from 'lucide-react';

const Home: React.FC = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Midnight Rebellion Jacket',
      price: '$299',
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800',
      badge: 'New'
    },
    {
      id: 2,
      name: 'Neon Dreams Hoodie',
      price: '$189',
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
      badge: 'Trending'
    },
    {
      id: 3,
      name: 'Electric Pulse Sneakers',
      price: '$259',
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
      badge: 'Limited'
    }
  ];

  const collections = [
    {
      name: 'ELECTRIC NIGHTS',
      description: 'Bold pieces for the fearless',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200',
      color: 'from-electric-500 to-electric-700'
    },
    {
      name: 'NEON DREAMS',
      description: 'Vibrant styles that glow',
      image: 'https://images.pexels.com/photos/1006202/pexels-photo-1006202.jpeg?auto=compress&cs=tinysrgb&w=1200',
      color: 'from-neon-500 to-neon-700'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-full px-6 py-2 mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="text-electric-400" size={16} />
              <span className="text-dark-muted text-sm">New Collection Available</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-space mb-6">
              <span className="bg-gradient-to-r from-electric-400 via-neon-400 to-emerald-400 bg-clip-text text-transparent">
                MANIC
              </span>
              <br />
              <span className="text-dark-text">VANITY</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-dark-muted mb-12 max-w-3xl mx-auto leading-relaxed">
              Where rebellion meets elegance. Discover fashion that defies convention and celebrates your unique vision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-full font-semibold flex items-center justify-center space-x-2 hover:from-electric-600 hover:to-neon-600 transition-all duration-200"
              >
                <span>Explore Collection</span>
                <ArrowRight size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-dark-border bg-dark-card/50 backdrop-blur-sm text-dark-text rounded-full font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200"
              >
                Watch Lookbook
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space text-dark-text mb-4">
              Featured Pieces
            </h2>
            <p className="text-dark-muted text-lg max-w-2xl mx-auto">
              Handpicked items that embody our philosophy of fearless fashion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-dark-card border border-dark-border">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gradient-to-r from-electric-500 to-neon-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.badge}
                    </span>
                  </div>
                  
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="p-6">
                    <h3 className="text-dark-text font-semibold text-lg mb-2 group-hover:text-electric-400 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-dark-muted text-xl font-bold">{product.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="relative h-96 rounded-3xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-60`}></div>
                <div className="absolute inset-0 flex items-end">
                  <div className="p-8 w-full">
                    <h3 className="text-white text-3xl font-bold font-space mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-white/80 text-lg mb-4">{collection.description}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-dark-bg px-6 py-2 rounded-full font-semibold hover:bg-dark-text transition-colors duration-200"
                    >
                      Discover Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-dark-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast Shipping',
                description: 'Express delivery on all orders over $150'
              },
              {
                icon: Star,
                title: 'Premium Quality',
                description: 'Crafted with the finest materials and attention to detail'
              },
              {
                icon: Sparkles,
                title: 'Exclusive Designs',
                description: 'Limited edition pieces you won\'t find anywhere else'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-electric-500 to-neon-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-dark-text font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-dark-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;