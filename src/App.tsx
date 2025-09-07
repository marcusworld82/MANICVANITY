import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './lib/stripe';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CartDrawer from './components/Cart/CartDrawer';
import SignInForm from './components/Auth/SignInForm';
import SignUpForm from './components/Auth/SignUpForm';

// Lazy load page components for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const Shop = React.lazy(() => import('./pages/Shop'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
const Account = React.lazy(() => import('./pages/Account'));
const CommandCenter = React.lazy(() => import('./pages/CommandCenter'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <div className="dark">
      <Elements stripe={stripePromise}>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Routes>
                {/* Auth Routes */}
                <Route path="/auth/sign-in" element={<SignInForm />} />
                <Route path="/auth/sign-up" element={<SignUpForm />} />
                
                {/* Main App Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<React.Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-electric"></div></div>}><Home /></React.Suspense>} />
                  <Route path="shop" element={<React.Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-electric"></div></div>}><Shop /></React.Suspense>} />
                  <Route path="p/:slug" element={<React.Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-electric"></div></div>}><ProductDetail /></React.Suspense>} />
                  <Route path="collections" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Collections Page Coming Soon</p></div>} />
                  <Route path="command-center" element={<React.Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-electric"></div></div>}><CommandCenter /></React.Suspense>} />
                  <Route path="about" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">About Page Coming Soon</p></div>} />
                  <Route path="contact" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Contact Page Coming Soon</p></div>} />
                  
                  {/* Protected Routes */}
                  <Route path="checkout" element={
                    <ProtectedRoute>
                      <React.Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-electric"></div></div>}>
                        <Checkout />
                      </React.Suspense>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="checkout/success" element={<CheckoutSuccess />} />
                  <Route path="checkout/cancel" element={<CheckoutCancel />} />
                  
                  <Route path="account/*" element={
                    <ProtectedRoute>
                      <Routes>
                        <Route index element={<React.Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-electric"></div></div>}><Account /></React.Suspense>} />
                        <Route path="orders" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Orders Page Coming Soon</p></div>} />
                        <Route path="addresses" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Addresses Page Coming Soon</p></div>} />
                        <Route path="wishlist" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Wishlist Page Coming Soon</p></div>} />
                        <Route path="settings" element={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><p className="text-dark-text text-2xl">Settings Page Coming Soon</p></div>} />
                      </Routes>
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Panel */}
                  <Route path="admin" element={<React.Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-electric"></div></div>}><AdminPanel /></React.Suspense>} />
                </Route>
              </Routes>
              
              {/* Global Components */}
              <CartDrawer />
            </Router>
          </CartProvider>
        </AuthProvider>
      </Elements>
    </div>
  );
}

export default App;