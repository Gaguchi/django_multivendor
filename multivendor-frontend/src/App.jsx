import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/Home'
import ProductsPage from './pages/Products'
import LoginPage from './pages/Login'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Update this route to match exactly */}
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </>
  )
}

export default App