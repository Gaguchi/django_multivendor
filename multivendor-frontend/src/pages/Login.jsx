import React, { useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function LoginPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
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
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const state = 'google-oauth2';
    window.location.href = `${baseURL}/auth/login/google-oauth2/?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  }

  const handleFacebookLogin = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    // Make state parameter clearly indicate Facebook
    const state = encodeURIComponent('facebook-oauth2'); // Don't use btoa() here
    const scope = encodeURIComponent('email,public_profile');
    
    console.log('Initiating Facebook login with state:', state);
    
    window.location.href = `${baseURL}/auth/login/facebook/?` +
      `redirect_uri=${redirectUri}&` +
      `state=${state}&` +
      `scope=${scope}&` +
      `auth_type=reauthenticate`;
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (user) {
    return (
      <div className="logged-in-view">
        <h1>Welcome, {user.firstName || user.username}!</h1>
        <p>You are already logged in.</p>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>

        <style>{`
          .logged-in-view {
            text-align: center;
            padding: 2rem;
          }
          .logout-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 1rem;
          }
          .logout-btn:hover {
            background-color: #c82333;
          }
        `}</style>
      </div>
    )
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
      
      <div className="social-login">
        <button type="button" onClick={handleGoogleLogin} className="google-btn">
          Login with Google
        </button>
        <button type="button" onClick={handleFacebookLogin} className="facebook-btn">
          Login with Facebook
        </button>
      </div>

      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account?' : 'No account? Register'}
      </button>

      <style>{`
        .social-login {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 20px 0;
        }

        .google-btn, .facebook-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .google-btn {
          background-color: #ffffff;
          color: #757575;
          border: 1px solid #dadce0;
        }

        .facebook-btn {
          background-color: #1877f2;
          color: white;
        }

        .google-btn:hover {
          background-color: #f8f9fa;
        }

        .facebook-btn:hover {
          background-color: #166fe5;
        }
      `}</style>
    </div>
  )
}

export default LoginPage