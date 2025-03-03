import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Products from './pages/Shop'
import Product from './pages/Product'
import ProductTemplate from './pages/Product_template'
import Account from './pages/Account'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import { initializeJQueryPlugins } from './utils/jQueryInit'

function AppContent() {
  const location = useLocation();
  
  // Initialize jQuery plugins on route changes
  useEffect(() => {
    // Initialize jQuery plugins
    setTimeout(() => {
      initializeJQueryPlugins();
    }, 0);
  }, [location.pathname]);
  
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<Products />} />
        <Route path="/product/:id" element={<Product />} /> 
        <Route path="/product_template" element={<ProductTemplate />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}

export default App