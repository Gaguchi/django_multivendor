import { Routes, Route } from 'react-router-dom'
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
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
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
      </CartProvider>
    </AuthProvider>
  )
}

export default App