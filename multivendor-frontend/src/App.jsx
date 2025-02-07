import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import NavbarMobile from './components/NavbarMobile'
import Footer from './components/Footer'
import HomePage from './pages/Home'
import ProductsPage from './pages/Products'
import LoginPage from './pages/Login'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <AuthProvider>
      <div className="page-wrapper">
        <Navbar />
        <Footer />
        <NavbarMobile />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App