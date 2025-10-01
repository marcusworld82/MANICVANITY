import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
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

function App() {
  // Initialize database on app start
  React.useEffect(() => {
    try {
      initializeDatabase();
      // Auto-import products from CSV data
      const csvData = `product_name,category,description,base_price,material,care_instructions,size,color,stock_quantity,sku
"Arrogance Tee",Apparel,"Bold statement piece with premium cotton construction",29.99,100% Cotton,Machine wash cold,L,Black,5,ARR-L-BLA
"Established Crewnecks",Apparel,"Classic comfort crewneck in multiple colorways",34.99,100% Cotton,Machine wash cold,M,Navy Blue,8,EST-M-NAV
"Lady Diamond Gas Mask Tee",Apparel,"Edgy graphic tee with diamond gas mask design",29.99,100% Cotton,Machine wash cold,S,White,6,LAD-S-WHI
"They Like Me Tee",Apparel,"Confident statement tee in vibrant colors",29.99,100% Cotton,Machine wash cold,M,Neon Green,7,THE-M-NEO
"Victorious Down Jackets",Apparel,"Premium down jacket for ultimate style",89.99,Down Fill,Dry clean only,L,Purple,3,VIC-L-PUR`;
      
      importProductsFromCSV(csvData).then(result => {
        console.log('Products imported:', result.imported, 'errors:', result.errors);
      });
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }, []);

  return (
    <div className="dark">
        <AuthProvider>
          <CartProvider>
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
                  
                  <Route path="checkout/success" element={<CheckoutSuccess />} />
                  <Route path="checkout/cancel" element={<CheckoutCancel />} />
                  
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
          </CartProvider>
        </AuthProvider>
    </div>
  );
}

export default App;