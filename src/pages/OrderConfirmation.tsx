import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { getOrderById, Order } from '../lib/database';
import { useLocalAuth } from '../context/LocalAuthContext';

const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useLocalAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder(id);
    }
  }, [id]);

  const loadOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const orderData = await getOrderById(orderId, user?.id);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-400"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-text mb-4">Order not found</h2>
          <Link
            to="/shop"
            className="text-electric-400 hover:text-electric-300 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="text-white" size={40} />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold font-space text-dark-text mb-4">
            Order Confirmed!
          </h1>
          <p className="text-dark-muted text-lg mb-2">
            Thank you for your order. We've received your payment and will begin processing your items.
          </p>
          <p className="text-electric-400 font-semibold">
            Order #{order.id.slice(-8).toUpperCase()}
          </p>
        </motion.div>

        {/* Order Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-dark-text mb-6">Order Status</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="text-white" size={20} />
              </div>
              <p className="text-emerald-400 font-medium text-sm">Order Placed</p>
              <p className="text-dark-muted text-xs">Just now</p>
            </div>
            
            <div className="flex-1 h-0.5 bg-dark-border mx-4"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-electric-500 rounded-full flex items-center justify-center mb-2">
                <Package className="text-white" size={20} />
              </div>
              <p className="text-electric-400 font-medium text-sm">Processing</p>
              <p className="text-dark-muted text-xs">1-2 days</p>
            </div>
            
            <div className="flex-1 h-0.5 bg-dark-border mx-4"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-dark-border rounded-full flex items-center justify-center mb-2">
                <Truck className="text-dark-muted" size={20} />
              </div>
              <p className="text-dark-muted font-medium text-sm">Shipped</p>
              <p className="text-dark-muted text-xs">2-3 days</p>
            </div>
            
            <div className="flex-1 h-0.5 bg-dark-border mx-4"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-dark-border rounded-full flex items-center justify-center mb-2">
                <MapPin className="text-dark-muted" size={20} />
              </div>
              <p className="text-dark-muted font-medium text-sm">Delivered</p>
              <p className="text-dark-muted text-xs">5-7 days</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-dark-text mb-6">Order Details</h3>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-dark-bg rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-dark-text font-medium">{item.title}</h4>
                    <div className="text-sm text-dark-muted">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' • '}
                      {item.color && `Color: ${item.color}`}
                    </div>
                    <div className="text-sm text-dark-muted">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-electric-400 font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-dark-border mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-dark-muted">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-dark-muted">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-dark-muted">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-dark-text border-t border-dark-border pt-2">
                <span>Total</span>
                <span className="text-electric-400">{formatPrice(order.total)}</span>
              </div>
            </div>
          </motion.div>

          {/* Shipping & Delivery Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="space-y-6"
          >
            {/* Shipping Address */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center space-x-2">
                <MapPin size={20} />
                <span>Shipping Address</span>
              </h3>
              <div className="text-dark-muted">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center space-x-2">
                <Calendar size={20} />
                <span>Estimated Delivery</span>
              </h3>
              <div className="text-dark-muted">
                <p className="text-electric-400 font-semibold text-lg">
                  {formatDate(order.estimatedDelivery)}
                </p>
                <p className="text-sm mt-2">
                  We'll send you tracking information once your order ships.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-dark-card/50 border border-dark-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-dark-text mb-4">What's Next?</h3>
              <div className="space-y-3 text-dark-muted text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-electric-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>You'll receive an email confirmation with your order details</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-electric-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>We'll notify you when your order ships with tracking information</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-electric-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Your items will be carefully packaged and shipped within 1-2 business days</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="text-center mt-12"
        >
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;