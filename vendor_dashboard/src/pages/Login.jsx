import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../services/api';
import { setToken, debugTokenStatus } from '../utils/auth';
import { useVendor } from '../contexts/VendorContext';

export default function Login() {
    const { fetchVendorProfile } = useVendor();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [apiEndpoint, setApiEndpoint] = useState('standard'); // 'standard' or 'token'
    const [debugInfo, setDebugInfo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    const API_URL = import.meta.env.VITE_API_URL || 'https://api.bazro.ge'; // Update with production URL

    // Check for error message in location state (from redirect)
    useEffect(() => {
        if (location.state?.error) {
            setError(location.state.error);
        }
    }, [location]);

    // Function to handle Google OAuth login
    const handleGoogleLogin = () => {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const state = `admin-google-auth`;
        
        // Use the right API URL
        const authUrl = `${API_URL}/api/users/auth/google/?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
        window.location.href = authUrl;
    };
    
    // Function to handle Facebook OAuth login
    const handleFacebookLogin = () => {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const state = `admin-facebook-auth`;
        
        // Use the right API URL
        const authUrl = `${API_URL}/api/users/auth/facebook/?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
        window.location.href = authUrl;
    };
    
    // Add function to toggle API endpoint
    const toggleApiEndpoint = () => {
        const newEndpoint = apiEndpoint === 'standard' ? 'token' : 'standard';
        setApiEndpoint(newEndpoint);
        console.log(`Switched API endpoint to: ${newEndpoint}`);
    };
    
    // Add debug check function
    const checkDebugStatus = () => {
        const status = debugTokenStatus();
        setDebugInfo({
            message: "Current token status",
            tokenStatus: status
        });
    };
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setDebugInfo(null);
        
        try {
            // Pass the API endpoint type to the login function via global variable
            window.useTokenEndpoint = apiEndpoint === 'token';
            console.log(`Using ${apiEndpoint} endpoint for login`);
            
            const response = await login(email, password);
            console.log('Login successful, response:', response);
            
            // Check if response has the expected tokens
            if (!response.access || !response.refresh) {
                console.error('Missing tokens in response:', response);
                setError('Invalid response from server (missing tokens)');
                setDebugInfo({
                    message: "Login response format error",
                    response: response
                });
                setLoading(false);
                return;
            }
            
            // Store user info and tokens
            setToken(
                response.access, 
                response.refresh, 
                {
                    username: response.username || email,
                    email: response.email || email,
                    firstName: response.firstName || response.first_name || '',
                    lastName: response.lastName || response.last_name || '',
                    profile: response.userprofile || response.profile || {}
                }
            );
            
            // Debug token info
            const tokenStatus = debugTokenStatus();
            setDebugInfo({
                message: "Login successful!",
                tokenStatus: tokenStatus,
                response: response
            });
              // Check for vendor permissions
            const profile = response.userprofile || response.profile || {};
            const userType = profile.user_type || profile.userType;
            
            console.log('User profile:', profile);
            console.log('User type:', userType);
            
            if (userType === 'vendor') {
                // Fetch vendor profile to get vendor ID
                try {
                    await fetchVendorProfile();
                    console.log('Vendor profile fetched successfully');
                } catch (vendorError) {
                    console.error('Failed to fetch vendor profile:', vendorError);
                    // Continue anyway, the vendor context will handle this
                }
                
                // Redirect to dashboard
                console.log('User is a vendor, redirecting to dashboard');
                navigate('/');
            } else {
                console.error('User is not a vendor, access denied');
                setError('Access denied. Only vendors can access the admin panel.');
                // Clear stored info since this user isn't authorized for admin
                localStorage.clear();
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid email or password');
            setDebugInfo({
                message: "Login failed",
                error: err.message || 'Unknown error'
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div id="wrapper">
          <div id="page" className="">
            <div className="login-page">
              <div className="left">
                <div className="login-box">
                  <div>
                    <h3 className="text-white">Login to Admin Panel</h3>
                    <div className="body-text text-white">
                      Enter your email & password to login
                    </div>
                    {error && (
                        <div className="error-message" style={{
                            color: '#ff3333',
                            background: 'rgba(255, 51, 51, 0.1)',
                            padding: '10px',
                            borderRadius: '5px',
                            marginTop: '10px'
                        }}>
                            {error}
                        </div>
                    )}
                  </div>
                  <div className="flex flex-column gap16 w-full">
                    <button 
                        onClick={handleGoogleLogin}
                        className="tf-button style-2 w-full"
                        type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={23}
                        height={22}
                        viewBox="0 0 23 22"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_604_19993)">
                          <path
                            d="M21.6676 9.08734L12.694 9.08691C12.2978 9.08691 11.9766 9.40806 11.9766 9.80432V12.671C11.9766 13.0672 12.2978 13.3884 12.694 13.3884H17.7474C17.194 14.8244 16.1612 16.0271 14.8435 16.7913L16.9983 20.5213C20.4548 18.5223 22.4983 15.0148 22.4983 11.0884C22.4983 10.5293 22.4571 10.1297 22.3747 9.67967C22.312 9.33777 22.0152 9.08734 21.6676 9.08734Z"
                            fill="#167EE6"
                          />
                          <path
                            d="M11.5019 17.6959C9.02885 17.6959 6.86993 16.3447 5.71041 14.3452L1.98047 16.4951C3.87861 19.7849 7.43445 22.0002 11.5019 22.0002C13.4972 22.0002 15.38 21.463 17.0019 20.5267V20.5216L14.8471 16.7915C13.8615 17.3632 12.7209 17.6959 11.5019 17.6959Z"
                            fill="#12B347"
                          />
                          <path
                            d="M17 20.5267V20.5216L14.8452 16.7915C13.8596 17.3631 12.7192 17.6959 11.5 17.6959V22.0002C13.4953 22.0002 15.3782 21.463 17 20.5267Z"
                            fill="#0F993E"
                          />
                          <path
                            d="M4.80435 10.9998C4.80435 9.78079 5.13702 8.64036 5.70854 7.65478L1.9786 5.50488C1.0372 7.12167 0.5 8.99932 0.5 10.9998C0.5 13.0002 1.0372 14.8779 1.9786 16.4947L5.70854 14.3448C5.13702 13.3592 4.80435 12.2188 4.80435 10.9998Z"
                            fill="#FFD500"
                          />
                          <path
                            d="M11.5019 4.30435C13.1145 4.30435 14.5958 4.87738 15.7529 5.83056C16.0383 6.06568 16.4532 6.04871 16.7146 5.78725L18.7458 3.75611C19.0424 3.45946 19.0213 2.97387 18.7044 2.69895C16.7658 1.0172 14.2436 0 11.5019 0C7.43445 0 3.87861 2.21534 1.98047 5.50511L5.71041 7.65501C6.86993 5.65555 9.02885 4.30435 11.5019 4.30435Z"
                            fill="#FF4B26"
                          />
                          <path
                            d="M15.751 5.83056C16.0364 6.06568 16.4513 6.04871 16.7128 5.78725L18.7439 3.75611C19.0405 3.45946 19.0194 2.97387 18.7025 2.69895C16.764 1.01716 14.2417 0 11.5 0V4.30435C13.1126 4.30435 14.594 4.87738 15.751 5.83056Z"
                            fill="#D93F21"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_604_19993">
                            <rect
                              width={22}
                              height={22}
                              fill="white"
                              transform="translate(0.5)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="">Sign in with Google</span>
                    </button>
                    <button 
                        onClick={handleFacebookLogin}
                        className="tf-button style-2 w-full"
                        type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={23}
                        height={22}
                        viewBox="0 0 23 22"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_604_20003)">
                          <path
                            d="M22.5 11C22.5 16.4905 18.4773 21.0414 13.2188 21.8664V14.1797H15.7818L16.2695 11H13.2188V8.93664C13.2188 8.06652 13.645 7.21875 15.0114 7.21875H16.3984V4.51172C16.3984 4.51172 15.1395 4.29688 13.9359 4.29688C11.4235 4.29688 9.78125 5.81969 9.78125 8.57656V11H6.98828V14.1797H9.78125V21.8664C4.52273 21.0414 0.5 16.4905 0.5 11C0.5 4.92508 5.42508 0 11.5 0C17.5749 0 22.5 4.92508 22.5 11Z"
                            fill="#1877F2"
                          />
                          <path
                            d="M15.7818 14.1797L16.2695 11H13.2188V8.9366C13.2188 8.0667 13.6449 7.21875 15.0114 7.21875H16.3984V4.51172C16.3984 4.51172 15.1396 4.29688 13.9361 4.29688C11.4235 4.29688 9.78125 5.81969 9.78125 8.57656V11H6.98828V14.1797H9.78125V21.8663C10.3413 21.9542 10.9153 22 11.5 22C12.0847 22 12.6587 21.9542 13.2188 21.8663V14.1797H15.7818Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_604_20003">
                            <rect
                              width={22}
                              height={22}
                              fill="white"
                              transform="translate(0.5)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="">Sign in with Facebook</span>
                    </button>
                  </div>
                  <form
                    className="form-login flex flex-column gap22 w-full"
                    onSubmit={handleSubmit}
                  >
                    <fieldset className="email">
                      <div className="body-title mb-10 text-white">
                        Email address <span className="tf-color-1">*</span>
                      </div>
                      <input
                        className="flex-grow"
                        type="email"
                        placeholder="Enter your email address"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        tabIndex={0}
                        aria-required="true"
                        required
                      />
                    </fieldset>
                    <fieldset className="password">
                      <div className="body-title mb-10 text-white">
                        Password <span className="tf-color-1">*</span>
                      </div>
                      <input
                        className="password-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        tabIndex={0}
                        aria-required="true"
                        required
                      />
                      <span className="show-pass" onClick={toggleShowPassword}>
                        <i className={`icon-eye ${!showPassword ? "view" : "hide"}`} />
                        <i className={`icon-eye-off ${showPassword ? "view" : "hide"}`} />
                      </span>
                    </fieldset>
                    <div className="flex justify-between items-center">
                      <div className="flex gap10">
                        <input className="tf-check" type="checkbox" id="signed" />
                        <label className="body-text text-white" htmlFor="signed">
                          Keep me signed in
                        </label>
                      </div>
                      <a href="#" className="body-text tf-color">
                        Forgot password?
                      </a>
                    </div>
                    <button 
                        type="submit" 
                        className="tf-button w-full"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>
                  <div className="bottom body-text text-center text-center text-white w-full">
                    Don't have a vendor account?
                    <Link to="/register" className="body-text tf-color">
                      Register as Vendor
                    </Link>
                  </div>
                </div>
              </div>
              <div className="right">
                <img src="images/images-section/Sign in.jpg" alt="Admin Login" />
              </div>
            </div>
          </div>
        </div>
    )
}