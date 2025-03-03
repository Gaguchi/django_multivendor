import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function AddressForm({ onSubmit, initialData, loading, addressType }) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    apartment_number: '',
    entrance_number: '',
    floor: '',
    door_code: '',
    delivery_instructions: '',
    address_type: addressType || 'shipping',
    is_default: false
  });
  
  // Initialize with user data and any passed initialData
  useEffect(() => {
    // Start with user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: `${user.profile?.first_name || ''} ${user.profile?.last_name || ''}`.trim(),
        email: user.email || '',
        phone_number: user.profile?.phone || ''
      }));
    }
    
    // If we have initial data (for editing), use that
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [user, initialData]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label>
              Full Name
              <abbr className="required" title="required">*</abbr>
            </label>
            <input 
              type="text" 
              className="form-control" 
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label>
              Phone Number
              <abbr className="required" title="required">*</abbr>
            </label>
            <input 
              type="tel" 
              className="form-control" 
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
      </div>

      {/* ... email field */}
      <div className="form-group">
        <label>Email address</label>
        <input 
          type="email" 
          className="form-control" 
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      {/* ... address fields */}
      <div className="form-group">
        <label>
          Street Address Line 1
          <abbr className="required" title="required">*</abbr>
        </label>
        <input 
          type="text" 
          className="form-control" 
          placeholder="House number and street name" 
          name="address_line1"
          value={formData.address_line1}
          onChange={handleInputChange}
          required 
        />
      </div>

      <div className="form-group">
        <label>Street Address Line 2</label>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Apartment, suite, unit, etc. (optional)"
          name="address_line2"
          value={formData.address_line2 || ''}
          onChange={handleInputChange}
        />
      </div>

      {/* ... apartment details */}
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label>Apartment Number</label>
            <input 
              type="text" 
              className="form-control" 
              name="apartment_number"
              value={formData.apartment_number || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label>Entrance Number</label>
            <input 
              type="text" 
              className="form-control" 
              name="entrance_number"
              value={formData.entrance_number || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label>Floor</label>
            <input 
              type="text" 
              className="form-control" 
              name="floor"
              value={formData.floor || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Door Code</label>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Code to access the building (if any)"
          name="door_code"
          value={formData.door_code || ''}
          onChange={handleInputChange}
        />
      </div>

      {/* ... city, state, postal code */}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label>
              City
              <abbr className="required" title="required">*</abbr>
            </label>
            <input 
              type="text" 
              className="form-control" 
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label>
              State/Province
              <abbr className="required" title="required">*</abbr>
            </label>
            <input 
              type="text" 
              className="form-control" 
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label>
              Postal Code
              <abbr className="required" title="required">*</abbr>
            </label>
            <input 
              type="text" 
              className="form-control" 
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              required 
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label>
              Country
              <abbr className="required" title="required">*</abbr>
            </label>
            <select 
              className="form-control"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Delivery Instructions (optional)</label>
        <textarea 
          className="form-control" 
          placeholder="Notes about delivery like specific delivery times, where to leave the package, etc." 
          name="delivery_instructions"
          value={formData.delivery_instructions || ''}
          onChange={handleInputChange}
          rows="3"
        />
      </div>

      {/* ... address type selection if not specified */}
      {!addressType && (
        <div className="form-group">
          <label>Address Type</label>
          <div className="form-check">
            <input
              type="radio"
              name="address_type"
              id="shipping-type"
              value="shipping"
              checked={formData.address_type === 'shipping'}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label className="form-check-label" htmlFor="shipping-type">
              Shipping Address
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              name="address_type"
              id="billing-type"
              value="billing"
              checked={formData.address_type === 'billing'}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label className="form-check-label" htmlFor="billing-type">
              Billing Address
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              name="address_type"
              id="both-type"
              value="both"
              checked={formData.address_type === 'both'}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label className="form-check-label" htmlFor="both-type">
              Both Shipping & Billing
            </label>
          </div>
        </div>
      )}

      {/* ... default address option */}
      <div className="form-group">
        <div className="custom-control custom-checkbox">
          <input 
            type="checkbox" 
            className="custom-control-input" 
            id="default-address"
            name="is_default"
            checked={formData.is_default}
            onChange={handleInputChange}
          />
          <label className="custom-control-label" htmlFor="default-address">
            {formData.address_type === 'shipping' ? 'Make this my default shipping address' :
             formData.address_type === 'billing' ? 'Make this my default billing address' :
             'Make this my default shipping and billing address'}
          </label>
        </div>
      </div>

      <div className="form-group text-right">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            'Save Address'
          )}
        </button>
      </div>
    </form>
  );
}