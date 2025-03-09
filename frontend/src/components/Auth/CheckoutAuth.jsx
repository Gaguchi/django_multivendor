import { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function CheckoutAuth({ onAuthenticated }) {
  const { login } = useAuth(); // Import login function from AuthContext
  const [activeTab, setActiveTab] = useState('signin');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Authentication form state
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    rememberMe: false,
    agreePolicy: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAuthForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const endpoint = activeTab === 'signin'
        ? `/api/users/login/`
        : `/api/users/register/`;
        
      const payload = activeTab === 'signin'
        ? { 
            username: authForm.email,
            password: authForm.password 
          }
        : {
            username: authForm.email,
            email: authForm.email,
            password: authForm.password,
            firstName: authForm.firstName,
            lastName: authForm.lastName,
            phone: authForm.phone,
            userprofile: {
              first_name: authForm.firstName,
              last_name: authForm.lastName,
              phone: authForm.phone
            }
          };

      // Password validation for registration
      if (activeTab === 'register') {
        if (authForm.password !== authForm.confirmPassword) {
          setAuthError("Passwords don't match");
          return;
        }
        if (authForm.password.length < 8) {
          setAuthError("Password must be at least 8 characters");
          return;
        }
      }

      setLoading(true);
      const response = await api.post(endpoint, payload);
      
      // Login the user with the received tokens
      await login(response.data);
      
      // Notify parent component about successful authentication
      onAuthenticated(response.data);
      
    } catch (error) {
      setAuthError(error.response?.data?.detail || 
                  error.response?.data?.email?.[0] || 
                  error.response?.data?.password?.[0] ||
                  'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="step-title">Sign In or Register</h2>
      
      {authError && (
        <div className="alert alert-danger" role="alert">
          {authError}
        </div>
      )}
      
      <div className="form-tab">
        <ul className="nav nav-tabs">
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
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="signin-email">Email address *</label>
                <input
                  type="email"
                  className="form-control"
                  id="signin-email"
                  name="email"
                  required
                  value={authForm.email}
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
                  value={authForm.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-footer d-flex align-items-center justify-content-between">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="signin-remember"
                    name="rememberMe"
                    checked={authForm.rememberMe}
                    onChange={handleInputChange}
                  />
                  <label className="custom-control-label" htmlFor="signin-remember">
                    Remember Me
                  </label>
                </div>
              </div>
            </form>
          </div>

          <div className={`tab-pane ${activeTab === 'register' ? 'active show' : 'fade'}`}>
            <form onSubmit={handleSubmit}>
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
                      value={authForm.firstName}
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
                      value={authForm.lastName}
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
                  value={authForm.email}
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
                  value={authForm.phone}
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
                      value={authForm.password}
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
                      value={authForm.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>

                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="register-policy"
                    name="agreePolicy"
                    required
                    checked={authForm.agreePolicy}
                    onChange={handleInputChange}
                  />
                  <label className="custom-control-label" htmlFor="register-policy">
                    I agree to the <a href="#">privacy policy</a> *
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
