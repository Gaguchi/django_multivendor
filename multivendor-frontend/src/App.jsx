import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home'
import ProductsPage from './pages/Products'
import LoginPage from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App