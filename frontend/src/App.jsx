import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { OrderProvider } from './contexts/OrderContext'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Products from './pages/Shop'
import Search from './pages/Search'
import Wishlist from './pages/Wishlist'
import Product from './pages/Product'
import ProductTemplate from './pages/Product_template'
import Account from './pages/Account'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import OrderTracking from './pages/OrderTracking'
import CartMergeNotification from './components/Cart/CartMergeNotification'
import { initializePage } from './utils/jQuerySimple'

function AppContent() {
  const location = useLocation();
  
  // Initialize jQuery plugins once on route changes using only jQuerySimple
  useEffect(() => {
    // Delay initialization to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initializePage();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
  
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<Product />} /> 
        <Route path="/product_template" element={<ProductTemplate />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/orders" element={<Orders />} />
        <Route path="/account/orders/:orderNumber" element={<OrderDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/track/:orderNumber" element={<OrderTracking />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <AppContent />
            <CartMergeNotification />
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App