import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocalAuthProvider } from './context/LocalAuthContext';
import { LocalCartProvider } from './context/LocalCartContext';
import { initializeDatabase, importProductsFromCSV } from './lib/database';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CartDrawer from './components/Cart/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import Account from './pages/Account';
import CommandCenter from './pages/CommandCenter';
import AdminPanel from './pages/AdminPanel';
import TestProducts from './pages/TestProducts';
import OrderConfirmation from './pages/OrderConfirmation';

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let canceled = false
    const run = async () => {
      try {
        await initializeDatabase()
      } catch (error) {
        console.error('Database initialization error:', error)
      } finally {
        if (!canceled) setReady(true)
      }
    }
    run()
    return () => {
      canceled = true
    }
  }, [])

  // CSV upload handler
  const onCSVSelected = async (file: File) => {
    try {
      const text = await file.text()
      const result = await importProductsFromCSV(text)
      console.log('Imported', result.imported, 'errors', result.errors)
    } catch (e) {
      console.error('CSV import failed:', e)
    }
  }

  return (
    <div className="dark">
        <LocalAuthProvider>
          <LocalCartProvider>
            <Router>
              <Routes>
                {/* Main App Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="p/:slug" element={<ProductDetail />} />
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
                  
                  <Route path="order/:id" element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  } />
                  
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
    </div>
  );
}