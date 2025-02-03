import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      {user
        ? <button onClick={logout}>Logout</button>
        : <Link to="/login">Login</Link>
      }
    </nav>
  )
}