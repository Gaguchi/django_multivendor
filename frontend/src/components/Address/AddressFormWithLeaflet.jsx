import { useState } from 'react';
import LeafletMapPicker from './LeafletMapPicker';
import { COUNTRIES } from '../../config/maps';

export default function AddressFormWithLeaflet({ 
  addressForm,
  handleAddressInputChange,
  handleAddressSubmit,
  loading,
  user,
  showNewAddressForm,
  setShowNewAddressForm,
  selectedAddress
}) {
  const [useMapPicker, setUseMapPicker] = useState(false);
  const [mapSelectedAddress, setMapSelectedAddress] = useState(null);

  // Handle address selection from map
  const handleMapAddressSelect = (addressData) => {
    setMapSelectedAddress(addressData);
    
    // Update form with map data
    const updatedForm = {
      ...addressForm,
      address_line1: addressData.address_line1 || '',
      city: addressData.city || '',
      state: addressData.state || '',
      postal_code: addressData.postal_code || '',
      country: addressData.country || 'US',
      latitude: addressData.latitude,
      longitude: addressData.longitude
    };
    
    // Update each field individually
    Object.keys(updatedForm).forEach(key => {
      handleAddressInputChange({
        target: {
          name: key,
          value: updatedForm[key],
          type: 'text'
        }
      });
    });
  };

  const toggleMapPicker = () => {
    setUseMapPicker(!useMapPicker);
    setMapSelectedAddress(null);
  };

  return (
    <div className="address-form-with-leaflet">
      {/* Map Toggle */}
      <div className="map-toggle-section">
        <div className="form-group">
          <div className="custom-control custom-switch">
            <input 
              type="checkbox" 
              className="custom-control-input" 
              id="use-map-picker"
              checked={useMapPicker}
              onChange={toggleMapPicker}
            />
            <label className="custom-control-label" htmlFor="use-map-picker">
              <i className="icon-map"></i>
              Use Map to Select Address
            </label>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {useMapPicker && (
        <div className="map-section">
          <div className="map-instructions">
            <p>
              <i className="icon-info"></i>
              Click on the map or search for an address to automatically fill the form below.
              You can also drag the marker to adjust the location.
            </p>
          </div>
          
          <LeafletMapPicker
            onAddressSelect={handleMapAddressSelect}
            initialLat={addressForm.latitude || 41.7151}
            initialLng={addressForm.longitude || 44.8271}
            height="350px"
          />
          
          {mapSelectedAddress && (
            <div className="map-selected-info">
              <i className="icon-check-circle text-success"></i>
              <span>Address automatically filled from map selection</span>
            </div>
          )}
        </div>
      )}

      {/* Manual Address Form */}
      <form onSubmit={handleAddressSubmit} id="address-form">
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
                value={addressForm.full_name || ''}
                onChange={handleAddressInputChange}
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
                value={addressForm.phone_number || ''}
                onChange={handleAddressInputChange}
                required 
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Email address</label>
          <input 
            type="email" 
            className="form-control" 
            name="email"
            value={addressForm.email || ''}
            onChange={handleAddressInputChange}
          />
        </div>

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
            value={addressForm.address_line1 || ''}
            onChange={handleAddressInputChange}
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
            value={addressForm.address_line2 || ''}
            onChange={handleAddressInputChange}
          />
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>Apartment Number</label>
              <input 
                type="text" 
                className="form-control" 
                name="apartment_number"
                value={addressForm.apartment_number || ''}
                onChange={handleAddressInputChange}
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
                value={addressForm.entrance_number || ''}
                onChange={handleAddressInputChange}
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
                value={addressForm.floor || ''}
                onChange={handleAddressInputChange}
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
            value={addressForm.door_code || ''}
            onChange={handleAddressInputChange}
          />
        </div>

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
                value={addressForm.city || ''}
                onChange={handleAddressInputChange}
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
                value={addressForm.state || ''}
                onChange={handleAddressInputChange}
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
                value={addressForm.postal_code || ''}
                onChange={handleAddressInputChange}
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
                value={addressForm.country || 'US'}
                onChange={handleAddressInputChange}
                required
              >
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Delivery Instructions (optional)</label>
          <textarea 
            className="form-control" 
            placeholder="Notes about your order, e.g. special notes for delivery." 
            name="delivery_instructions"
            value={addressForm.delivery_instructions || ''}
            onChange={handleAddressInputChange}
            rows="3"
          />
        </div>

        {user && (
          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input 
                type="checkbox" 
                className="custom-control-input" 
                id="save-address"
                name="is_default"
                checked={addressForm.is_default || false}
                onChange={handleAddressInputChange}
              />
              <label className="custom-control-label" htmlFor="save-address">
                Save as default shipping address
              </label>
            </div>
          </div>
        )}

        {user && (
          <div className="form-group d-flex justify-content-end">
            {showNewAddressForm && selectedAddress !== -1 && (
              <button 
                type="button" 
                className="btn btn-outline-secondary mr-2"
                onClick={() => {
                  setShowNewAddressForm(false);
                }}
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        )}
      </form>

      {/* Styles */}
      <style jsx>{`
        .address-form-with-leaflet {
          width: 100%;
        }

        .map-toggle-section {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
        }

        .custom-control {
          position: relative;
          display: block;
          min-height: 1.5rem;
          padding-left: 1.5rem;
        }

        .custom-control-input {
          position: absolute;
          z-index: -1;
          opacity: 0;
        }

        .custom-control-label {
          position: relative;
          margin-bottom: 0;
          vertical-align: top;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #495057;
        }

        .custom-control-label::before {
          position: absolute;
          top: 0.25rem;
          left: -1.5rem;
          display: block;
          width: 1rem;
          height: 1rem;
          pointer-events: none;
          content: "";
          background-color: #fff;
          border: 1px solid #adb5bd;
          border-radius: 0.25rem;
        }

        .custom-control-label::after {
          position: absolute;
          top: 0.25rem;
          left: -1.5rem;
          display: block;
          width: 1rem;
          height: 1rem;
          content: "";
          background: no-repeat 50%/50% 50%;
        }

        .custom-control-input:checked ~ .custom-control-label::before {
          color: #fff;
          border-color: #667eea;
          background-color: #667eea;
        }

        .custom-control-input:checked ~ .custom-control-label::after {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='m6.564.75-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
        }

        .map-section {
          margin-bottom: 25px;
          padding: 20px;
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .map-instructions {
          margin-bottom: 15px;
          padding: 12px;
          background: #e3f2fd;
          border: 1px solid #bbdefb;
          border-radius: 4px;
        }

        .map-instructions p {
          margin: 0;
          font-size: 14px;
          color: #1976d2;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .map-instructions i {
          margin-top: 2px;
          color: #1976d2;
        }

        .map-selected-info {
          margin-top: 12px;
          padding: 8px 12px;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #155724;
        }

        .text-success {
          color: #28a745;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #495057;
        }

        .required {
          color: #dc3545;
          text-decoration: none;
        }

        .form-control {
          display: block;
          width: 100%;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #495057;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid #ced4da;
          border-radius: 0.25rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .form-control:focus {
          color: #495057;
          background-color: #fff;
          border-color: #667eea;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .btn {
          display: inline-block;
          font-weight: 400;
          color: #212529;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          background-color: transparent;
          border: 1px solid transparent;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          line-height: 1.5;
          border-radius: 0.25rem;
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          text-decoration: none;
        }

        .btn-primary {
          color: #fff;
          background-color: #667eea;
          border-color: #667eea;
        }

        .btn-primary:hover {
          color: #fff;
          background-color: #5a67d8;
          border-color: #5a67d8;
        }

        .btn-primary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-outline-secondary {
          color: #6c757d;
          border-color: #6c757d;
        }

        .btn-outline-secondary:hover {
          color: #fff;
          background-color: #6c757d;
          border-color: #6c757d;
        }

        .d-flex {
          display: flex;
        }

        .justify-content-end {
          justify-content: flex-end;
        }

        .mr-2 {
          margin-right: 0.5rem;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
        }

        .col-md-4, .col-md-6 {
          position: relative;
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
        }

        @media (min-width: 768px) {
          .col-md-4 {
            flex: 0 0 33.333333%;
            max-width: 33.333333%;
          }

          .col-md-6 {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }
      `}</style>
    </div>
  );
}
