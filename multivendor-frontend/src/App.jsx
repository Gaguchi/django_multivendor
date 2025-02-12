import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Products from './pages/Shop'
import Product from './pages/Product'
import Shop2 from './pages/Shop2'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shop" element={<Products />} />
          <Route path="/product" element={<Product />} />
        </Route>
          <Route path="/shop2" element={<Shop2 />} />
      </Routes>
    </AuthProvider>
  )
}

export default App