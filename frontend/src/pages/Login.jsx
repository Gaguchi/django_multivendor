import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LoginPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('signin');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    rememberMe: false,
    agreePolicy: false
  });

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = type === 'signin'
        ? `/api/users/login/`
        : `/api/users/register/`;
        
      const payload = type === 'signin'
        ? { 
            username: formData.email,
            password: formData.password 
          }
        : {
            username: formData.email,
            email: formData.email,
            password: formData.password,
            userprofile: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone
            }
          };

      const response = await api.post(endpoint, payload);
      const data = response.data;
      
      // Login will handle token storage
      await login(data);
      
      navigate('/');
      
    } catch (error) {
      setError(error.response?.data?.detail || 'Authentication failed');
    }
  };

  const handleGoogleLogin = () => {
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const state = 'google-oauth2';
    window.location.href = `${baseURL}/auth/login/google-oauth2/?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  };

  const handleFacebookLogin = () => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const state = encodeURIComponent('facebook-oauth2');
    const scope = encodeURIComponent('email,public_profile');
    
    window.location.href = `${baseURL}/auth/login/facebook/?` +
      `redirect_uri=${redirectUri}&` +
      `state=${state}&` +
      `scope=${scope}&` +
      `auth_type=reauthenticate`;
  };

  // Handle logged in state
  if (user) {
    return (
      <div className="logged-in-view">
        <h1>Welcome, {user.firstName || user.username}!</h1>
        <p>You are already logged in.</p>
        <button onClick={() => {
          logout();
          window.location.reload(); // Force page refresh after logout
        }} className="btn btn-danger">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="login-page bg-image" 
         style={{
           backgroundImage: `url('/src/assets/images/backgrounds/login-bg.jpg')`,
           minHeight: 'calc(100vh - var(--header-height))',
           paddingTop: '40px',
           paddingBottom: '40px'
         }}>
      <div className="container">
        <div className="form-box">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="form-tab">
            <ul className="nav nav-pills nav-fill">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'signin' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signin')}
                >
                  Sign In
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => setActiveTab('register')}
                >
                  Register
                </button>
              </li>
            </ul>

            <div className="tab-content">
              <div className={`tab-pane ${activeTab === 'signin' ? 'active show' : 'fade'}`}>
                <form onSubmit={(e) => handleSubmit(e, 'signin')}>
                  <div className="form-group">
                    <label htmlFor="signin-email">Email address *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="signin-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="signin-password">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      id="signin-password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-footer">
                    <button type="submit" className="btn btn-outline-primary-2">
                      <span>LOG IN</span>
                      <i className="icon-long-arrow-right"></i>
                    </button>

                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="signin-remember"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                      />
                      <label className="custom-control-label" htmlFor="signin-remember">
                        Remember Me
                      </label>
                    </div>
                    <a href="#" className="forgot-link">Forgot Your Password?</a>
                  </div>
                </form>

                <div className="form-choice">
                  <div className="separator">
                    <span className="separator-text">or sign in with</span>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <button onClick={handleGoogleLogin} className="btn btn-login btn-g">
                        <i className="icon-google"></i>
                        Login With Google
                      </button>
                    </div>
                    <div className="col-sm-6">
                      <button onClick={handleFacebookLogin} className="btn btn-login btn-f">
                        <i className="icon-facebook-f"></i>
                        Login With Facebook
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane ${activeTab === 'register' ? 'active show' : 'fade'}`}>
                <form onSubmit={(e) => handleSubmit(e, 'register')}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="register-fname">First Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="register-fname"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="register-lname">Last Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="register-lname"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-email">Email address *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="register-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-phone">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="register-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="register-password">Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          id="register-password"
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="register-confirm-password">Confirm Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          id="register-confirm-password"
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-footer">
                    <button type="submit" className="btn btn-outline-primary-2">
                      <span>SIGN UP</span>
                      <i className="icon-long-arrow-right"></i>
                    </button>

                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="register-policy"
                        name="agreePolicy"
                        required
                        checked={formData.agreePolicy}
                        onChange={handleInputChange}
                      />
                      <label className="custom-control-label" htmlFor="register-policy">
                        I agree to the <a href="#">privacy policy</a> *
                      </label>
                    </div>
                  </div>
                </form>

                <div className="form-choice">
                  <p className="text-center">or sign in with</p>
                  <div className="row">
                    <div className="col-sm-6">
                      <button onClick={handleGoogleLogin} className="btn btn-login btn-g">
                        <i className="icon-google"></i>
                        Login With Google
                      </button>  
                    </div>
                    <div className="col-sm-6">
                      <button onClick={handleFacebookLogin} className="btn btn-login btn-f">
                        <i className="icon-facebook-f"></i>
                        Login With Facebook
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          background-color: #f4f4f4;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
        }

        .form-box {
          max-width: 575px;
          margin: 0 auto;
          background: #fff;
          padding: 2rem;
          border-radius: 5px;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        .form-group label {
          color: #777;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .form-control {
          height: 4rem;
          padding: 0.8rem 1.2rem;
          border: 1px solid #e1e1e1;
          border-radius: 3px;
          transition: all 0.3s;
        }

        .form-control:focus {
          border-color: #08C;
          box-shadow: none;
        }

        .nav-pills {
          margin-bottom: 2rem;
        }

        .nav-pills .nav-item {
          position: relative;
        }

        .nav-pills .nav-link {
          font-size: 1.6rem;
          color: #777;
          border: none;
          background: none;
          padding: 1rem;
          width: 100%;
          transition: color 0.3s;
        }

        .nav-pills .nav-item::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background: transparent;
          transition: background-color 0.3s;
        }

        .nav-pills .nav-item:has(.nav-link.active)::after {
          background-color: #08C;
        }

        .nav-pills .nav-link.active {
          color: #08C;
          background: none;
        }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .btn-outline-primary-2 {
          border: 1px solid #08C;
          color: #08C;
          padding: 1rem 2.5rem;
          font-weight: 500;
          transition: all 0.3s;
        }

        .btn-outline-primary-2:hover {
          background-color: #08C;
          color: #fff;
        }

        .custom-control-label {
          color: #777;
          font-size: 1.3rem;
        }

        .forgot-link {
          color: #777;
          font-size: 1.3rem;
          text-decoration: underline;
        }

        .separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.5rem 0;
        }

        .separator::before,
        .separator::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #dee2e6;
        }

        .separator-text {
          padding: 0 1rem;
          color: #777;
          font-size: 1.2rem;
        }

        .btn-login {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          margin-bottom: 0.8rem;
          padding: 0.8rem;
          font-size: 1.4rem;
          font-weight: 500;
          border-radius: 3px;
          transition: opacity 0.3s;
        }

        .btn-login:hover {
          opacity: 0.9;
          color: #fff;
        }

        .btn-g {
          background: #dd4b39;
          color: white;
        }

        .btn-f {
          background: #3b5998;
          color: white;
        }

        @media (max-width: 767px) {
          .form-box {
            padding: 1.5rem;
          }

          .nav-pills .nav-link {
            font-size: 1.6rem;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}