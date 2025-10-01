import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, ShoppingBag, Calendar } from 'lucide-react';
import { formatPrice } from '../data/localCatalog';
import { useAuth } from '../context/LocalAuthContext';

interface OrderItem {
  product_name: string;
  size?: string;
  color?: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  shipping_address: any;
  billing_address: any;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
}

const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/shop');
      return;
    }

    loadOrder(id);
  }, [id, navigate]);

  const loadOrder = (orderId: string) => {
    try {
      const stored = localStorage.getItem(`order-${orderId}`);
      if (stored) {
        const orderData = JSON.parse(stored);
        
        // Verify order belongs to current user
        if (!user || orderData.user_id !== user.id) {
          navigate('/shop');
          return;
        }
        
        setOrder(orderData);
      } else {
        navigate('/shop');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order?.created_at || new Date());
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 business days
    
    return deliveryDate.toLocaleDateString('en-US', {
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
            className="text-electric-400 hover:text-electric-300"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="text-white" size={40} />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-space text-dark-text mb-4">
              Order Confirmed!
            </h1>
            <p className="text-dark-muted text-lg mb-2">
              Thank you for your order. We've received your purchase and it's being processed.
            </p>
            <p className="text-electric-400 font-semibold text-lg">
              Order #{order.id}
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Order Items */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h3 className="text-dark-text font-semibold text-lg mb-4 flex items-center space-x-2">
                <Package size={20} />
                <span>Order Items</span>
              </h3>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex space-x-4 p-4 bg-dark-bg/50 rounded-lg">
                    <div className="w-16 h-16 bg-dark-border rounded-lg flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-electric-500/20 to-neon-500/20 flex items-center justify-center">
                        <ShoppingBag size={20} className="text-dark-muted" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-dark-text font-semibold">{item.product_name}</h4>
                      <p className="text-dark-muted text-sm">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-dark-muted text-sm">Qty: {item.quantity}</span>
                        <span className="text-electric-400 font-semibold">
                          {formatPrice(item.unit_price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h3 className="text-dark-text font-semibold text-lg mb-4 flex items-center space-x-2">
                <Truck size={20} />
                <span>Shipping Address</span>
              </h3>
              
              <div className="text-dark-muted space-y-1">
                <p className="text-dark-text font-medium">{order.shipping_address.fullName}</p>
                <p>{order.shipping_address.address1}</p>
                {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                <p>{order.shipping_address.country}</p>
                {order.shipping_address.phone && <p>Phone: {order.shipping_address.phone}</p>}
              </div>
            </div>
          </motion.div>

          {/* Order Summary & Delivery */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h3 className="text-dark-text font-semibold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-2 text-sm">
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
                  <span>Total Paid</span>
                  <span className="text-electric-400">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h3 className="text-dark-text font-semibold text-lg mb-4 flex items-center space-x-2">
                <Calendar size={20} />
                <span>Delivery Information</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div>
                    <p className="text-emerald-400 font-medium text-sm">Order Confirmed</p>
                    <p className="text-dark-muted text-xs">We've received your order</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-dark-bg/50 rounded-lg">
                  <div className="w-2 h-2 bg-dark-border rounded-full"></div>
                  <div>
                    <p className="text-dark-text font-medium text-sm">Processing</p>
                    <p className="text-dark-muted text-xs">1-2 business days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-dark-bg/50 rounded-lg">
                  <div className="w-2 h-2 bg-dark-border rounded-full"></div>
                  <div>
                    <p className="text-dark-text font-medium text-sm">Estimated Delivery</p>
                    <p className="text-electric-400 text-xs font-medium">{getEstimatedDelivery()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-electric-500/10 border border-electric-500/20 rounded-2xl p-6">
              <h3 className="text-electric-400 font-semibold text-lg mb-3">What's Next?</h3>
              <ul className="text-dark-muted text-sm space-y-2">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• We'll send tracking information when your order ships</li>
                <li>• Your items will be carefully packaged and shipped</li>
                <li>• Contact us if you have any questions</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <Link
            to="/account/orders"
            className="px-6 py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Package size={18} />
            <span>View All Orders</span>
          </Link>
          
          <Link
            to="/shop"
            className="px-6 py-3 border border-dark-border bg-dark-card text-dark-text rounded-lg font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200 flex items-center justify-center space-x-2"
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