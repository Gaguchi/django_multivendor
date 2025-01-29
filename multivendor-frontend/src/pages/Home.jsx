import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Our Multivendor Store</h1>
      <nav>
        <Link to="/products">Browse Products</Link>
        <Link to="/login">Vendor Login</Link>
      </nav>
    </div>
  )
}