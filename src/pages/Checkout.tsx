import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock, ShoppingBag, MapPin, User, Mail, Phone, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/LocalCartContext';
import { useAuth } from '../context/LocalAuthContext';
import { formatPrice } from '../data/localCatalog';

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BillingAddress extends ShippingAddress {}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveToAccount, setSaveToAccount] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const shippingCost = 6.00;
  const taxRate = 0.085;
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
  }, [items, navigate]);

  useEffect(() => {
    if (sameAsBilling) {
      setBillingAddress(shippingAddress);
    }
  }, [shippingAddress, sameAsBilling]);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          shippingAddress.fullName &&
          shippingAddress.email &&
          shippingAddress.address1 &&
          shippingAddress.city &&
          shippingAddress.state &&
          shippingAddress.zipCode
        );
      case 2:
        return sameAsBilling || !!(
          billingAddress.fullName &&
          billingAddress.email &&
          billingAddress.address1 &&
          billingAddress.city &&
          billingAddress.state &&
          billingAddress.zipCode
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(4, prev + 1));
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    setError('');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/auth/sign-in');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order ID
      const orderId = `MV-${Date.now().toString(36).toUpperCase()}`;
      
      // Store order in localStorage
      const order = {
        id: orderId,
        user_id: user.id,
        items: items.map(item => ({
          product_name: item.product_name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unit_price: item.base_price + (item.price_modifier || 0)
        })),
        shipping_address: shippingAddress,
        billing_address: sameAsBilling ? shippingAddress : billingAddress,
        subtotal,
        shipping: shippingCost,
        tax,
        total,
        status: 'confirmed',
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem(`order-${orderId}`, JSON.stringify(order));
      
      // Clear cart
      await clearCart();
      
      // Navigate to success page
      navigate(`/order/${orderId}`);
    } catch (err) {
      setError('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  const steps = [
    { number: 1, title: 'Shipping', icon: MapPin },
    { number: 2, title: 'Billing', icon: CreditCard },
    { number: 3, title: 'Review', icon: ShoppingBag },
    { number: 4, title: 'Payment', icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-dark-muted hover:text-electric-400 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </motion.button>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  currentStep >= step.number
                    ? 'bg-electric-500 text-white'
                    : 'bg-dark-card border border-dark-border text-dark-muted'
                }`}>
                  <step.icon size={16} />
                  <span className="font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step.number ? 'bg-electric-500' : 'bg-dark-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm mb-6">
                {error}
              </div>
            )}

            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center space-x-2">
                  <MapPin size={24} />
                  <span>Shipping Address</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Country *
                    </label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address1}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address1: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address2}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address2: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                      placeholder="State/Province"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                      placeholder="ZIP/Postal code"
                    />
                  </div>
                </div>

                {user && (
                  <div className="mt-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveToAccount}
                        onChange={(e) => setSaveToAccount(e.target.checked)}
                        className="w-4 h-4 text-electric-500 bg-dark-bg border-dark-border rounded focus:ring-electric-500"
                      />
                      <span className="text-dark-text text-sm">Save this address to my account</span>
                    </label>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Billing Address */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center space-x-2">
                  <CreditCard size={24} />
                  <span>Billing Address</span>
                </h2>

                <div className="mb-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="w-4 h-4 text-electric-500 bg-dark-bg border-dark-border rounded focus:ring-electric-500"
                    />
                    <span className="text-dark-text">Same as shipping address</span>
                  </label>
                </div>

                {!sameAsBilling && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.fullName}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={billingAddress.email}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                        placeholder="Enter email"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.address1}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, address1: e.target.value }))}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                        placeholder="Street address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                        placeholder="State/Province"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={billingAddress.zipCode}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                        placeholder="ZIP/Postal code"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center space-x-2">
                  <ShoppingBag size={24} />
                  <span>Review Your Order</span>
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex space-x-4 p-4 bg-dark-bg/50 rounded-lg">
                      <div className="w-16 h-16 bg-dark-border rounded-lg flex-shrink-0 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-electric-500/20 to-neon-500/20 flex items-center justify-center">
                          <ShoppingBag size={20} className="text-dark-muted" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-dark-text font-semibold">{item.product_name}</h3>
                        <p className="text-dark-muted text-sm">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${item.color}`}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-dark-muted text-sm">Qty: {item.quantity}</span>
                          <span className="text-electric-400 font-semibold">
                            {formatPrice((item.base_price + (item.price_modifier || 0)) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Addresses Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-dark-bg/50 rounded-lg p-4">
                    <h3 className="text-dark-text font-semibold mb-2">Shipping Address</h3>
                    <div className="text-dark-muted text-sm space-y-1">
                      <p>{shippingAddress.fullName}</p>
                      <p>{shippingAddress.address1}</p>
                      {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                    </div>
                  </div>

                  <div className="bg-dark-bg/50 rounded-lg p-4">
                    <h3 className="text-dark-text font-semibold mb-2">Billing Address</h3>
                    <div className="text-dark-muted text-sm space-y-1">
                      {sameAsBilling ? (
                        <p className="text-electric-400">Same as shipping address</p>
                      ) : (
                        <>
                          <p>{billingAddress.fullName}</p>
                          <p>{billingAddress.address1}</p>
                          {billingAddress.address2 && <p>{billingAddress.address2}</p>}
                          <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center space-x-2">
                  <Lock size={24} />
                  <span>Payment</span>
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center space-x-3 text-dark-muted">
                    <Lock size={20} />
                    <span className="text-sm">Your payment information is secure and encrypted</span>
                  </div>

                  {/* Mock Payment Form */}
                  <div className="bg-dark-bg/50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-text mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-text mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-text mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-dark-muted text-xs">
                      By placing your order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="px-6 py-3 border border-dark-border bg-dark-bg text-dark-text rounded-lg font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200"
                >
                  Back
                </motion.button>
              )}

              <div className="ml-auto">
                {currentStep < 4 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200"
                  >
                    Continue
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order</span>
                        <span>{formatPrice(total)}</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 sticky top-8"
            >
              <h3 className="text-xl font-bold text-dark-text mb-6">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <div className="w-12 h-12 bg-dark-border rounded-lg flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-electric-500/20 to-neon-500/20 flex items-center justify-center">
                        <ShoppingBag size={16} className="text-dark-muted" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-dark-text font-medium text-sm truncate">
                        {item.product_name}
                      </h4>
                      <p className="text-dark-muted text-xs">
                        {item.size && `${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `${item.color}`}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-dark-muted text-xs">Qty: {item.quantity}</span>
                        <span className="text-electric-400 font-semibold text-sm">
                          {formatPrice((item.base_price + (item.price_modifier || 0)) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-dark-border pt-4 space-y-2">
                <div className="flex justify-between text-dark-muted text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-dark-muted text-sm">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-dark-muted text-sm">
                  <span>Tax (est.)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-dark-text border-t border-dark-border pt-2">
                  <span>Total</span>
                  <span className="text-electric-400">{formatPrice(total)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;