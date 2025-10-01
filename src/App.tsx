import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './lib/stripe';
import { LocalAuthProvider } from './context/LocalAuthContext';
import { LocalCartProvider } from './context/LocalCartContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CartDrawer from './components/Cart/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import SignInForm from './components/Auth/SignInForm';
import SignUpForm from './components/Auth/SignUpForm';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import OrderConfirmation from './pages/OrderConfirmation';
import Account from './pages/Account';
import CommandCenter from './pages/CommandCenter';
import AdminPanel from './pages/AdminPanel';
import TestProducts from './pages/TestProducts';

function App() {
  return (
    <div className="dark">
      <Elements stripe={stripePromise}>
        <LocalAuthProvider>
          <LocalCartProvider>
            <Router>
              <Routes>
                {/* Auth Routes */}
                <Route path="/auth/sign-in" element={<SignInForm />} />
                <Route path="/auth/sign-up" element={<SignUpForm />} />
                
                {/* Main App Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="product/:slug" element={<ProductDetail />} />
                  <Route path="collections" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Collections Page Coming Soon</p></div>} />
                  <Route path="command-center" element={<CommandCenter />} />
                  <Route path="about" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">About Page Coming Soon</p></div>} />
                  <Route path="contact" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Contact Page Coming Soon</p></div>} />
                  
                  {/* Protected Routes */}
                  <Route path="checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="checkout/success" element={<CheckoutSuccess />} />
                  <Route path="checkout/cancel" element={<CheckoutCancel />} />
                  <Route path="order/:id" element={<OrderConfirmation />} />
                  
                  <Route path="account/*" element={
                    <ProtectedRoute>
                      <Routes>
                        <Route index element={<Account />} />
                        <Route path="orders" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Orders Page Coming Soon</p></div>} />
                        <Route path="addresses" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Addresses Page Coming Soon</p></div>} />
                        <Route path="wishlist" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Wishlist Page Coming Soon</p></div>} />
                        <Route path="settings" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Settings Page Coming Soon</p></div>} />
                      </Routes>
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Panel */}
                  <Route path="admin" element={<AdminPanel />} />
                  
                  {/* Test Products Page */}
                  <Route path="test-products" element={<TestProducts />} />
                </Route>
              </Routes>
              
              {/* Global Components */}
              <CartDrawer />
            </Router>
          </LocalCartProvider>
        </LocalAuthProvider>
      </Elements>
    </div>
  );
}

export default App;