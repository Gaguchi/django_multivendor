import React, { useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const location = useLocation()

  const baseURL = import.meta.env.VITE_API_BASE_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = isRegister
        ? `${baseURL}/api/users/register/`
        : `${baseURL}/api/users/login/`
      const payload = isRegister
        ? { username, password, email }
        : { username, password }

      const response = await axios.post(endpoint, payload)
      const data = response.data
      // Save tokens or do something with data
      localStorage.setItem('token', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      alert(`Welcome, ${data.username}`)
      window.location.href = '/'
    } catch (error) {
      alert('Login/Registration failed')
    }
  }

  const handleGoogleLogin = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const redirectUri = encodeURIComponent('http://localhost:5173/auth/callback');
    window.location.href = `${baseURL}/auth/login/google-oauth2/?redirect_uri=${redirectUri}`;
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">
          {isRegister ? 'Register' : 'Sign In'}
        </button>
      </form>
      <button type="button" onClick={handleGoogleLogin}>
        Login with Google
      </button>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account?' : 'No account? Register'}
      </button>
    </div>
  )
}

export default LoginPage