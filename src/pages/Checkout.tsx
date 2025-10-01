import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CreditCard, Lock, MapPin, Package, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/LocalCartContext';
import { useLocalAuth } from '../context/LocalAuthContext';
import { createOrder, ShippingAddress } from '../lib/database';

type CheckoutStep = 'shipping' | 'billing' | 'review' | 'payment';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearAllItems } = useCart();
  const { user } = useLocalAuth();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  
  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({ ...shippingAddress });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [saveToAccount, setSaveToAccount] = useState(false);

  const shipping = 6.00;
  const taxRate = 0.085;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
  }, [items, navigate]);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress({ ...shippingAddress });
    }
  }, [shippingAddress, sameAsShipping]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const validateStep = (step: CheckoutStep): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 'shipping') {
      const required = ['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'state', 'zipCode'];
      required.forEach(field => {
        if (!shippingAddress[field as keyof ShippingAddress]) {
          newErrors[field] = 'This field is required';
        }
      });
      
      if (shippingAddress.email && !/\S+@\S+\.\S+/.test(shippingAddress.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (step === 'billing' && !sameAsShipping) {
      const required = ['firstName', 'lastName', 'address1', 'city', 'state', 'zipCode'];
      required.forEach(field => {
        if (!billingAddress[field as keyof ShippingAddress]) {
          newErrors[`billing_${field}`] = 'This field is required';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    const steps: CheckoutStep[] = ['shipping', 'billing', 'review', 'payment'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: CheckoutStep[] = ['shipping', 'billing', 'review', 'payment'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    } else {
      navigate(-1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep('payment')) return;
    
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const order = await createOrder({
        userId: user?.id,
        items,
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        subtotal,
        shipping,
        tax,
        total,
        status: 'confirmed'
      });
      
      await clearAllItems();
      navigate(`/order/${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'shipping', title: 'Shipping', icon: MapPin },
    { id: 'billing', title: 'Billing', icon: CreditCard },
    { id: 'review', title: 'Review', icon: Package },
    { id: 'payment', title: 'Payment', icon: Lock }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="flex items-center space-x-2 text-dark-muted hover:text-electric-400 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </motion.button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  index <= currentStepIndex ? 'text-electric-400' : 'text-dark-muted'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index < currentStepIndex 
                      ? 'bg-electric-500 border-electric-500 text-white'
                      : index === currentStepIndex
                      ? 'border-electric-400 text-electric-400'
                      : 'border-dark-border text-dark-muted'
                  }`}>
                    {index < currentStepIndex ? (
                      <Check size={16} />
                    ) : (
                      <step.icon size={16} />
                    )}
                  </div>
                  <span className="hidden md:block font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-2 md:mx-4 ${
                    index < currentStepIndex ? 'bg-electric-500' : 'bg-dark-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-6"
            >
              {/* Shipping Address */}
              {currentStep === 'shipping' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center space-x-2">
                    <MapPin size={24} />
                    <span>Shipping Address</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">First Name</label>
                      <input
                        type="text"
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text ${
                          errors.firstName ? 'border-red-500' : 'border-dark-border'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">Last Name</label>
                      <input
                        type="text"
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text ${
                          errors.lastName ? 'border-red-500' : 'border-dark-border'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">Email</label>
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text ${
                          errors.email ? 'border-red-500' : 'border-dark-border'
                        }`}
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">Phone</label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text ${
                          errors.phone ? 'border-red-500' : 'border-dark-border'
                        }`}
                      />
                      {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-dark-text mb-2">Address Line 1</label>
                      <input
                        type="text"
                        value={shippingAddress.address1}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address1: e.target.value }))}
                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text ${
                          errors.address1 ? 'border-red-500' : 'border-dark-border'
                        }`}
                      />
                      {errors.address1 && <p className="text-red-400 text-sm mt-1">{errors.address1}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-dark-text mb-2">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        value={shippingAddress.address2}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, address2: e.target.value }))}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text ${
                          errors.city ? 'border-red-500' : 'border-dark-border'
                        }`}
                      />
                      {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">State</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text ${
                          errors.state ? 'border-red-500' : 'border-dark-border'
                        }`}
                      />
                      {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text ${
                          errors.zipCode ? 'border-red-500' : 'border-dark-border'
                        }`}
                      />
                      {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">Country</label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                      </select>
                    </div>
                  </div>
                  
                  {user && (
                    <div className="mt-6">
                      <label className="flex items-center space-x-2">
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
                </div>
              )}

              {/* Billing Address */}
              {currentStep === 'billing' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center space-x-2">
                    <CreditCard size={24} />
                    <span>Billing Address</span>
                  </h2>
                  
                  <div className="mb-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="w-4 h-4 text-electric-500 bg-dark-bg border-dark-border rounded focus:ring-electric-500"
                      />
                      <span className="text-dark-text">Same as shipping address</span>
                    </label>
                  </div>
                  
                  {!sameAsShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Billing form fields (similar to shipping) */}
                      <div>
                        <label className="block text-sm font-medium text-dark-text mb-2">First Name</label>
                        <input
                          type="text"
                          value={billingAddress.firstName}
                          onChange={(e) => setBillingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                          className={`w-full px-4 py-3 bg-dark-bg border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text ${
                            errors.billing_firstName ? 'border-red-500' : 'border-dark-border'
                          }`}
                        />
                        {errors.billing_firstName && <p className="text-red-400 text-sm mt-1">{errors.billing_firstName}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-text mb-2">Last Name</label>
                        <input
                          type="text"
                          value={billingAddress.lastName}
                          onChange={(e) => setBillingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                          className={`w-full px-4 py-3 bg-dark-bg border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text ${
                            errors.billing_lastName ? 'border-red-500' : 'border-dark-border'
                          }`}
                        />
                        {errors.billing_lastName && <p className="text-red-400 text-sm mt-1">{errors.billing_lastName}</p>}
                      </div>
                      
                      {/* Add other billing fields as needed */}
                    </div>
                  )}
                </div>
              )}

              {/* Order Review */}
              {currentStep === 'review' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center space-x-2">
                    <Package size={24} />
                    <span>Review Order</span>
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-semibold text-dark-text mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {items.map((item) => (
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
                    </div>
                    
                    {/* Addresses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-dark-text mb-4">Shipping Address</h3>
                        <div className="p-4 bg-dark-bg rounded-lg text-dark-muted text-sm">
                          <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                          <p>{shippingAddress.address1}</p>
                          {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                          <p>{shippingAddress.country}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-dark-text mb-4">Billing Address</h3>
                        <div className="p-4 bg-dark-bg rounded-lg text-dark-muted text-sm">
                          {sameAsShipping ? (
                            <p className="text-electric-400">Same as shipping address</p>
                          ) : (
                            <>
                              <p>{billingAddress.firstName} {billingAddress.lastName}</p>
                              <p>{billingAddress.address1}</p>
                              {billingAddress.address2 && <p>{billingAddress.address2}</p>}
                              <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}</p>
                              <p>{billingAddress.country}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment */}
              {currentStep === 'payment' && (
                <div>
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
                    <div className="p-6 bg-dark-bg rounded-lg border border-dark-border">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-dark-text mb-2">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-dark-text mb-2">Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg focus:outline-none focus:border-electric-400 text-dark-text"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-dark-muted text-xs">
                        By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="px-6 py-3 border border-dark-border bg-dark-bg text-dark-text rounded-lg font-semibold hover:border-electric-400 hover:text-electric-400 transition-all duration-200"
                >
                  Back
                </motion.button>
                
                {currentStep === 'payment' ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order</span>
                        <span>{formatPrice(total)}</span>
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-electric-500 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-600 hover:to-neon-600 transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>Continue</span>
                    <ArrowRight size={18} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-dark-text mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-dark-text text-sm font-medium truncate">{item.title}</p>
                      <p className="text-dark-muted text-xs">
                        {item.size && `${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `${item.color}`}
                        {' • '}Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-electric-400 text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 border-t border-dark-border pt-4">
                <div className="flex justify-between text-dark-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-dark-muted">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-dark-muted">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-dark-text border-t border-dark-border pt-2">
                  <span>Total</span>
                  <span className="text-electric-400">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;