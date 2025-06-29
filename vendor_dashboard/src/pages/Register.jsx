import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerVendor, getCategories, checkEmailAvailability } from '../services/api';
import { setToken, setVendorId } from '../utils/auth';
import { useVendor } from '../contexts/VendorContext';
import './Register.css';

export default function Register() {
    const { fetchVendorProfile } = useVendor();
    const [currentStep, setCurrentStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        // Personal Information
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        
        // Store Information
        store_name: '',
        contact_email: '',
        phone: '',
        description: '',
        address: '',
        business_category: '',
        business_type: '',
        
        // Additional Details
        logo: null,
        website: '',
        social_media: {
            facebook: '',
            instagram: '',
            twitter: ''
        },
        
        // Terms and Agreements
        terms_accepted: false,
        marketing_emails: false
    });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailChecking, setEmailChecking] = useState(false);
    const [emailAvailable, setEmailAvailable] = useState(null);
    const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);
    const navigate = useNavigate();

    // Business types for dropdown
    const businessTypes = [
        { value: 'individual', label: 'Individual Seller' },
        { value: 'small_business', label: 'Small Business' },
        { value: 'corporation', label: 'Corporation' },
        { value: 'manufacturer', label: 'Manufacturer' },
        { value: 'wholesaler', label: 'Wholesaler' },
        { value: 'retailer', label: 'Retailer' }
    ];

    // Load categories on component mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData || []);
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        loadCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        // Handle different input types
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else if (name.includes('.')) {
            // Handle nested object properties (e.g., social_media.facebook)
            const [parentKey, childKey] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parentKey]: {
                    ...prev[parentKey],
                    [childKey]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Auto-fill contact_email if not set and we're changing email
        if (name === 'email' && !formData.contact_email) {
            setFormData(prev => ({
                ...prev,
                contact_email: value
            }));
        }

        // Reset email availability status when email changes and debounce check
        if (name === 'email') {
            setEmailAvailable(null);
            
            // Clear existing timeout
            if (emailCheckTimeout) {
                clearTimeout(emailCheckTimeout);
            }
            
            // Set new timeout for email checking (500ms delay)
            if (value && /\S+@\S+\.\S+/.test(value)) {
                const timeout = setTimeout(() => {
                    checkEmailAvailabilityAsync(value);
                }, 500);
                setEmailCheckTimeout(timeout);
            }
        }
        
        // Clear field-specific errors when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const checkEmailAvailabilityAsync = async (email) => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return false;
        }

        setEmailChecking(true);
        try {
            const result = await checkEmailAvailability(email);
            setEmailAvailable(result.available);
            return result.available;
        } catch (error) {
            console.error('Error checking email availability:', error);
            setFieldErrors(prev => ({
                ...prev,
                email: 'Unable to verify email availability. Please try again.'
            }));
            return false;
        } finally {
            setEmailChecking(false);
        }
    };

    const validateStep = async (step) => {
        const errors = {};
        
        switch (step) {
            case 1: // Personal Information
                if (!formData.first_name) errors.first_name = 'First name is required';
                if (!formData.last_name) errors.last_name = 'Last name is required';
                if (!formData.email) {
                    errors.email = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    errors.email = 'Please enter a valid email address';
                } else {
                    // Check email availability
                    const available = await checkEmailAvailabilityAsync(formData.email);
                    if (!available) {
                        errors.email = 'This email is already registered. Please use a different email.';
                    }
                }
                if (!formData.password) {
                    errors.password = 'Password is required';
                } else if (formData.password.length < 8) {
                    errors.password = 'Password must be at least 8 characters long';
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                }
                if (formData.password !== formData.confirmPassword) {
                    errors.confirmPassword = 'Passwords do not match';
                }
                break;
                
            case 2: // Store Information
                if (!formData.store_name) errors.store_name = 'Store name is required';
                if (!formData.business_type) errors.business_type = 'Business type is required';
                if (!formData.description) errors.description = 'Store description is required';
                if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
                    errors.phone = 'Please enter a valid phone number';
                }
                break;
                
            case 3: // Additional Details (optional validation)
                if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
                    errors.website = 'Please enter a valid website URL (starting with http:// or https://)';
                }
                break;
                
            case 4: // Terms and Agreements
                if (!formData.terms_accepted) {
                    errors.terms_accepted = 'You must accept the terms and conditions';
                }
                break;
        }
        
        setFieldErrors(errors);
        
        // If there are errors, scroll to the first error field
        if (Object.keys(errors).length > 0) {
            setTimeout(() => {
                const firstErrorField = document.querySelector('.error');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstErrorField.focus();
                }
            }, 100);
        }
        
        return Object.keys(errors).length === 0;
    };

    const nextStep = async () => {
        const isValid = await validateStep(currentStep);
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
            setError('');
            // Scroll to top of form on step change
            const loginBox = document.querySelector('.login-box');
            if (loginBox) {
                loginBox.scrollTop = 0;
            }
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        setError('');
        // Scroll to top of form on step change
        const loginBox = document.querySelector('.login-box');
        if (loginBox) {
            loginBox.scrollTop = 0;
        }
    };

    const validateForm = async () => {
        // Validate all steps
        for (let step = 1; step <= 4; step++) {
            const isValid = await validateStep(step);
            if (!isValid) {
                setCurrentStep(step);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Prepare registration data
            const registrationData = new FormData();
            
            // Basic user info
            registrationData.append('email', formData.email);
            registrationData.append('password', formData.password);
            registrationData.append('first_name', formData.first_name);
            registrationData.append('last_name', formData.last_name);
            
            // Store info
            registrationData.append('store_name', formData.store_name);
            registrationData.append('contact_email', formData.contact_email || formData.email);
            registrationData.append('phone', formData.phone || '');
            registrationData.append('description', formData.description);
            registrationData.append('address', formData.address || '');
            registrationData.append('business_category', formData.business_category || '');
            registrationData.append('business_type', formData.business_type);
            
            // Additional details
            registrationData.append('website', formData.website || '');
            registrationData.append('facebook', formData.social_media.facebook || '');
            registrationData.append('instagram', formData.social_media.instagram || '');
            registrationData.append('twitter', formData.social_media.twitter || '');
            
            // Logo upload
            if (formData.logo) {
                registrationData.append('logo', formData.logo);
            }
            
            // Preferences
            registrationData.append('marketing_emails', formData.marketing_emails);

            const response = await registerVendor(registrationData);
            
            // Store authentication tokens and user data
            setToken(
                response.access,
                response.refresh,
                {
                    username: response.user.username,
                    email: response.user.email,
                    firstName: response.user.first_name,
                    lastName: response.user.last_name,
                    profile: response.profile,
                    vendor: response.vendor
                }
            );

            // Store vendor ID and fetch full vendor profile
            if (response.vendor && response.vendor.id) {
                setVendorId(response.vendor.id);
                try {
                    await fetchVendorProfile();
                    console.log('Vendor profile set up successfully');
                } catch (vendorError) {
                    console.error('Failed to fetch vendor profile after registration:', vendorError);
                    // Continue anyway, the vendor context will handle this
                }
            }

            // Redirect to dashboard
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
            
            // If it's a validation error, try to extract field-specific errors
            if (err.response && err.response.data) {
                const backendErrors = err.response.data;
                const newFieldErrors = {};
                
                Object.keys(backendErrors).forEach(field => {
                    if (Array.isArray(backendErrors[field])) {
                        newFieldErrors[field] = backendErrors[field][0];
                    } else {
                        newFieldErrors[field] = backendErrors[field];
                    }
                });
                
                setFieldErrors(newFieldErrors);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Step 1: Personal Information
    const renderPersonalInfoStep = () => (
        <>
            <div className="form-row">
                <fieldset className="first-name">
                    <div className="body-title mb-10 text-white">
                        First Name <span className="tf-color-1">*</span>
                    </div>
                    <input
                        className={`flex-grow ${fieldErrors.first_name ? 'error' : ''}`}
                        type="text"
                        placeholder="Enter your first name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                    />
                    {fieldErrors.first_name && (
                        <div className="error-text">{fieldErrors.first_name}</div>
                    )}
                </fieldset>
                <fieldset className="last-name">
                    <div className="body-title mb-10 text-white">
                        Last Name <span className="tf-color-1">*</span>
                    </div>
                    <input
                        className={`flex-grow ${fieldErrors.last_name ? 'error' : ''}`}
                        type="text"
                        placeholder="Enter your last name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                    />
                    {fieldErrors.last_name && (
                        <div className="error-text">{fieldErrors.last_name}</div>
                    )}
                </fieldset>
            </div>

            <fieldset className="email">
                <div className="body-title mb-10 text-white">
                    Email Address <span className="tf-color-1">*</span>
                </div>
                <div className="email-input-container" style={{ position: 'relative' }}>
                    <input
                        className={`flex-grow ${fieldErrors.email ? 'error' : ''} ${emailAvailable === true ? 'success' : ''}`}
                        type="email"
                        placeholder="Enter your email address"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    {emailChecking && (
                        <div className="email-checking" style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#2196F3'
                        }}>
                            Checking...
                        </div>
                    )}
                    {!emailChecking && emailAvailable === true && formData.email && (
                        <div className="email-available" style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#4CAF50'
                        }}>
                            ✓ Available
                        </div>
                    )}
                    {!emailChecking && emailAvailable === false && formData.email && (
                        <div className="email-unavailable" style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#ff4757'
                        }}>
                            ✗ Taken
                        </div>
                    )}
                </div>
                {fieldErrors.email && (
                    <div className="error-text">{fieldErrors.email}</div>
                )}
                {!fieldErrors.email && emailAvailable === false && formData.email && (
                    <div className="error-text">This email is already registered. Please use a different email.</div>
                )}
            </fieldset>

            <fieldset className="password">
                <div className="body-title mb-10 text-white">
                    Password <span className="tf-color-1">*</span>
                </div>
                <input
                    className={`password-input ${fieldErrors.password ? 'error' : ''}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <span className="show-pass" onClick={toggleShowPassword}>
                    <i className={`icon-eye ${!showPassword ? "view" : "hide"}`} />
                    <i className={`icon-eye-off ${showPassword ? "view" : "hide"}`} />
                </span>
                {fieldErrors.password && (
                    <div className="error-text">{fieldErrors.password}</div>
                )}
            </fieldset>

            <fieldset className="password">
                <div className="body-title mb-10 text-white">
                    Confirm Password <span className="tf-color-1">*</span>
                </div>
                <input
                    className={`password-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                />
                <span className="show-pass" onClick={toggleShowConfirmPassword}>
                    <i className={`icon-eye ${!showConfirmPassword ? "view" : "hide"}`} />
                    <i className={`icon-eye-off ${showConfirmPassword ? "view" : "hide"}`} />
                </span>
                {fieldErrors.confirmPassword && (
                    <div className="error-text">{fieldErrors.confirmPassword}</div>
                )}
            </fieldset>
        </>
    );

    // Step 2: Store Information
    const renderStoreInfoStep = () => (
        <>
            <fieldset className="store-name">
                <div className="body-title mb-10 text-white">
                    Store Name <span className="tf-color-1">*</span>
                </div>
                <input
                    className={`flex-grow ${fieldErrors.store_name ? 'error' : ''}`}
                    type="text"
                    placeholder="Enter your store name"
                    name="store_name"
                    value={formData.store_name}
                    onChange={handleInputChange}
                    required
                />
                {fieldErrors.store_name && (
                    <div className="error-text">{fieldErrors.store_name}</div>
                )}
            </fieldset>

            <fieldset className="business-type">
                <div className="body-title mb-10 text-white">
                    Business Type <span className="tf-color-1">*</span>
                </div>
                <select
                    className={`flex-grow ${fieldErrors.business_type ? 'error' : ''}`}
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select your business type</option>
                    {businessTypes.map(type => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
                {fieldErrors.business_type && (
                    <div className="error-text">{fieldErrors.business_type}</div>
                )}
            </fieldset>

            {categories.length > 0 && (
                <fieldset className="business-category">
                    <div className="body-title mb-10 text-white">
                        Primary Business Category
                    </div>
                    <select
                        className="flex-grow"
                        name="business_category"
                        value={formData.business_category}
                        onChange={handleInputChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </fieldset>
            )}

            <fieldset className="description">
                <div className="body-title mb-10 text-white">
                    Store Description <span className="tf-color-1">*</span>
                </div>
                <textarea
                    className={`flex-grow ${fieldErrors.description ? 'error' : ''}`}
                    placeholder="Tell customers about your store, what you sell, and what makes you unique"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    style={{ resize: 'vertical' }}
                    required
                />
                {fieldErrors.description && (
                    <div className="error-text">{fieldErrors.description}</div>
                )}
            </fieldset>

            <div className="form-row">
                <fieldset className="phone">
                    <div className="body-title mb-10 text-white">
                        Phone Number
                    </div>
                    <input
                        className={`flex-grow ${fieldErrors.phone ? 'error' : ''}`}
                        type="tel"
                        placeholder="Enter your phone number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    {fieldErrors.phone && (
                        <div className="error-text">{fieldErrors.phone}</div>
                    )}
                </fieldset>
                <fieldset className="contact-email">
                    <div className="body-title mb-10 text-white">
                        Store Contact Email
                    </div>
                    <input
                        className="flex-grow"
                        type="email"
                        placeholder="Store contact email (defaults to your email)"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                    />
                </fieldset>
            </div>

            <fieldset className="address">
                <div className="body-title mb-10 text-white">
                    Store Address
                </div>
                <textarea
                    className="flex-grow"
                    placeholder="Enter your store address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    style={{ resize: 'vertical' }}
                />
            </fieldset>
        </>
    );

    // Step 3: Additional Details
    const renderAdditionalDetailsStep = () => (
        <>
            <fieldset className="logo">
                <div className="body-title mb-10 text-white">
                    Store Logo
                </div>
                <input
                    className="flex-grow"
                    type="file"
                    accept="image/*"
                    name="logo"
                    onChange={handleInputChange}
                />
                <div className="body-text text-white mt-5">
                    Upload your store logo (JPG, PNG, GIF - Max 2MB)
                </div>
            </fieldset>

            <fieldset className="website">
                <div className="body-title mb-10 text-white">
                    Website URL
                </div>
                <input
                    className={`flex-grow ${fieldErrors.website ? 'error' : ''}`}
                    type="url"
                    placeholder="https://your-website.com"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                />
                {fieldErrors.website && (
                    <div className="error-text">{fieldErrors.website}</div>
                )}
            </fieldset>

            <div className="social-media-section">
                <div className="body-title mb-10 text-white">
                    Social Media (Optional)
                </div>
                
                <fieldset className="facebook">
                    <input
                        className="flex-grow"
                        type="url"
                        placeholder="Facebook page URL"
                        name="social_media.facebook"
                        value={formData.social_media.facebook}
                        onChange={handleInputChange}
                    />
                </fieldset>

                <fieldset className="instagram">
                    <input
                        className="flex-grow"
                        type="url"
                        placeholder="Instagram profile URL"
                        name="social_media.instagram"
                        value={formData.social_media.instagram}
                        onChange={handleInputChange}
                    />
                </fieldset>

                <fieldset className="twitter">
                    <input
                        className="flex-grow"
                        type="url"
                        placeholder="Twitter profile URL"
                        name="social_media.twitter"
                        value={formData.social_media.twitter}
                        onChange={handleInputChange}
                    />
                </fieldset>
            </div>
        </>
    );

    // Step 4: Terms and Agreements
    const renderTermsStep = () => (
        <>
            <div className="terms-section">
                <div className="body-title mb-10 text-white">
                    Terms and Agreements
                </div>
                
                <div className="terms-content" style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    <div className="text-white">
                        <h4>Vendor Terms and Conditions</h4>
                        <p>By registering as a vendor, you agree to:</p>
                        <ul>
                            <li>Provide accurate and up-to-date information about your products</li>
                            <li>Maintain quality standards for all products sold</li>
                            <li>Process orders in a timely manner</li>
                            <li>Provide excellent customer service</li>
                            <li>Comply with our marketplace policies and guidelines</li>
                            <li>Pay applicable fees and commissions</li>
                            <li>Handle returns and refunds according to our policy</li>
                        </ul>
                    </div>
                </div>

                <fieldset className="terms-checkbox">
                    <label className="checkbox-container text-white">
                        <input
                            type="checkbox"
                            name="terms_accepted"
                            checked={formData.terms_accepted}
                            onChange={handleInputChange}
                            required
                        />
                        <span className="checkmark"></span>
                        I accept the <Link to="/terms" className="tf-color">Terms and Conditions</Link> <span className="tf-color-1">*</span>
                    </label>
                    {fieldErrors.terms_accepted && (
                        <div className="error-text">{fieldErrors.terms_accepted}</div>
                    )}
                </fieldset>

                <fieldset className="marketing-checkbox">
                    <label className="checkbox-container text-white">
                        <input
                            type="checkbox"
                            name="marketing_emails"
                            checked={formData.marketing_emails}
                            onChange={handleInputChange}
                        />
                        <span className="checkmark"></span>
                        I would like to receive marketing emails and updates
                    </label>
                </fieldset>
            </div>
        </>
    );

    return (
        <div id="wrapper">
            <div id="page" className="">
                <div className="login-page">
                    <div className="left">
                        <div className="login-box">
                            {/* Progress Indicator */}
                            <div className="registration-progress mb-20">
                                <div className="progress-steps">
                                    {[1, 2, 3, 4].map(step => (
                                        <div 
                                            key={step} 
                                            className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                                        >
                                            <div className="step-number">{step}</div>
                                            <div className="step-label">
                                                {step === 1 && 'Personal'}
                                                {step === 2 && 'Store Info'}
                                                {step === 3 && 'Details'}
                                                {step === 4 && 'Terms'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${(currentStep - 1) * 33.33}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-white">
                                    {currentStep === 1 && 'Personal Information'}
                                    {currentStep === 2 && 'Store Information'}
                                    {currentStep === 3 && 'Additional Details'}
                                    {currentStep === 4 && 'Terms & Agreements'}
                                </h3>
                                <div className="body-text text-white">
                                    {currentStep === 1 && 'Enter your personal details to get started'}
                                    {currentStep === 2 && 'Tell us about your store and business'}
                                    {currentStep === 3 && 'Add your logo and social media (optional)'}
                                    {currentStep === 4 && 'Review and accept our terms'}
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

                            <form
                                className="form-login flex flex-column gap22 w-full"
                                onSubmit={currentStep === 4 ? handleSubmit : (e) => e.preventDefault()}
                            >
                                {currentStep === 1 && renderPersonalInfoStep()}
                                {currentStep === 2 && renderStoreInfoStep()}
                                {currentStep === 3 && renderAdditionalDetailsStep()}
                                {currentStep === 4 && renderTermsStep()}

                                {/* Navigation Buttons */}
                                <div className="form-navigation">
                                    {currentStep > 1 && (
                                        <button 
                                            type="button" 
                                            className="tf-button secondary"
                                            onClick={prevStep}
                                            disabled={loading}
                                        >
                                            Previous
                                        </button>
                                    )}
                                    
                                    {currentStep < 4 ? (
                                        <button 
                                            type="button" 
                                            className="tf-button w-full"
                                            onClick={nextStep}
                                            disabled={loading || (currentStep === 1 && emailChecking)}
                                        >
                                            {currentStep === 1 && emailChecking ? 'Checking Email...' : 'Next Step'}
                                        </button>
                                    ) : (
                                        <button 
                                            type="submit" 
                                            className="tf-button w-full"
                                            disabled={loading || !formData.terms_accepted}
                                        >
                                            {loading ? 'Creating Account...' : 'Create Vendor Account'}
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className="bottom body-text text-center text-white w-full">
                                Already have an account?
                                <Link to="/login" className="body-text tf-color">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <img src="images/images-section/Sign in.jpg" alt="Vendor Registration" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                :root {
                    --tf-color: #2196F3;
                    --tf-color-1: #ff4757;
                }
                
                .flex-grow.success {
                    border-color: #4CAF50 !important;
                    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
                }
                
                .email-input-container {
                    position: relative;
                }
                
                .email-checking,
                .email-available,
                .email-unavailable {
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                
                .tf-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
