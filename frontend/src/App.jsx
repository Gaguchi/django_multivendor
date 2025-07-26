import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { OrderProvider } from './contexts/OrderContext'
import { ReviewProvider } from './contexts/ReviewContext'
import { ToastProvider } from './contexts/ToastContext'
import { ChatProvider } from './contexts/ChatContext'
import { initModalCleanup } from './utils/modalCleanup'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import ShopPage from './pages/Shop'
import BentoShop from './pages/BentoShop'
import CategoryPage from './pages/CategoryPage'
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
import Reviews from './pages/Reviews'
import ChatPage from './pages/ChatPage'
import Messages from './pages/Messages'
import IsolatedStickyTest from './pages/IsolatedStickyTest'
import AddressMapDemo from './pages/AddressMapDemo'
import MapDemo from './pages/MapDemo'
import LeafletDemo from './pages/LeafletDemo'
import TestLeafletMap from './pages/TestLeafletMap'
import DetailedMapDemo from './pages/DetailedMapDemo'
import CartMergeNotification from './components/Cart/CartMergeNotification'
import { initializePage } from './utils/jQuerySimple'

function AppContent() {
  const location = useLocation();
  
  // Initialize modal cleanup on app start
  useEffect(() => {
    initModalCleanup();
  }, []);
  
  // Initialize jQuery plugins once on route changes using only jQuerySimple
  // Use a stable effect that doesn't interfere with component rendering
  useEffect(() => {
    // Only re-initialize on actual route changes, not on query param changes
    const pathname = location.pathname;
    
    const timeoutId = setTimeout(() => {
      console.log('🎭 App: Initializing jQuery for route:', pathname);
      initializePage();
    }, 100); // Reduced delay to be less intrusive
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]); // Only depend on pathname, not search params
  
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<BentoShop />} />
        <Route path="/shop/browse" element={<ShopPage />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<Product />} /> 
        <Route path="/product_template" element={<ProductTemplate />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/orders" element={<Orders />} />
        <Route path="/account/orders/:orderNumber" element={<OrderDetail />} />
        <Route path="/account/reviews" element={<Reviews />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/track/:orderNumber" element={<OrderTracking />} />
        <Route path="/isolated-sticky-test" element={<IsolatedStickyTest />} />
        <Route path="/address-map-demo" element={<AddressMapDemo />} />
        <Route path="/map-demo" element={<MapDemo />} />
        <Route path="/leaflet-demo" element={<LeafletDemo />} />
        <Route path="/test-leaflet" element={<TestLeafletMap />} />
        <Route path="/detailed-map-demo" element={<DetailedMapDemo />} />
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
            <ReviewProvider>
              <ToastProvider>
                <ChatProvider>
                  <AppContent />
                  <CartMergeNotification />
                </ChatProvider>
              </ToastProvider>
            </ReviewProvider>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App