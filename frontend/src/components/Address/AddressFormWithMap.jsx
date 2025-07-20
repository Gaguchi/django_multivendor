import { useState } from 'react';
import MapAddressPicker from './MapAddressPicker';
import { COUNTRIES } from '../../config/maps';

export default function AddressFormWithMap({ 
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

    // Trigger form update for each field
    Object.keys(updatedForm).forEach(key => {
      if (updatedForm[key] !== addressForm[key]) {
        handleAddressInputChange({
          target: {
            name: key,
            value: updatedForm[key]
          }
        });
      }
    });
  };

  // Handle manual address entry
  const handleManualEntry = () => {
    setUseMapPicker(false);
    setMapSelectedAddress(null);
  };

  // Handle map picker toggle
  const handleMapPickerToggle = () => {
    setUseMapPicker(!useMapPicker);
    if (!useMapPicker) {
      setMapSelectedAddress(null);
    }
  };

  return (
    <div className="address-form-container">
      {/* Address Input Method Selector */}
      <div className="input-method-selector mb-4">
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className={`btn ${!useMapPicker ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={handleManualEntry}
          >
            <i className="fas fa-edit"></i> Manual Entry
          </button>
          <button
            type="button"
            className={`btn ${useMapPicker ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={handleMapPickerToggle}
          >
            <i className="fas fa-map-marker-alt"></i> Select on Map
          </button>
        </div>
      </div>

      {/* Map Address Picker */}
      {useMapPicker && (
        <div className="map-picker-section mb-4">
          <MapAddressPicker
            onAddressSelect={handleMapAddressSelect}
            height="350px"
          />
          
          {mapSelectedAddress && (
            <div className="alert alert-success mt-3">
              <i className="fas fa-check-circle"></i> 
              Address selected from map! You can fine-tune the details below if needed.
            </div>
          )}
        </div>
      )}

      {/* Traditional Form */}
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
                value={addressForm.full_name}
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
                value={addressForm.phone_number}
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
            value={addressForm.email}
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
            value={addressForm.address_line1}
            onChange={handleAddressInputChange}
            required 
            readOnly={useMapPicker && mapSelectedAddress}
            style={useMapPicker && mapSelectedAddress ? { backgroundColor: '#f8f9fa' } : {}}
          />
          {useMapPicker && mapSelectedAddress && (
            <small className="text-muted">
              <i className="fas fa-info-circle"></i> This field was filled from the map selection.
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Street Address Line 2</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Apartment, suite, unit, etc. (optional)"
            name="address_line2"
            value={addressForm.address_line2}
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
                value={addressForm.city}
                onChange={handleAddressInputChange}
                required 
                readOnly={useMapPicker && mapSelectedAddress}
                style={useMapPicker && mapSelectedAddress ? { backgroundColor: '#f8f9fa' } : {}}
              />
              {useMapPicker && mapSelectedAddress && (
                <small className="text-muted">
                  <i className="fas fa-info-circle"></i> This field was filled from the map selection.
                </small>
              )}
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
                value={addressForm.state}
                onChange={handleAddressInputChange}
                required 
                readOnly={useMapPicker && mapSelectedAddress}
                style={useMapPicker && mapSelectedAddress ? { backgroundColor: '#f8f9fa' } : {}}
              />
              {useMapPicker && mapSelectedAddress && (
                <small className="text-muted">
                  <i className="fas fa-info-circle"></i> This field was filled from the map selection.
                </small>
              )}
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
                value={addressForm.postal_code}
                onChange={handleAddressInputChange}
                required 
                readOnly={useMapPicker && mapSelectedAddress}
                style={useMapPicker && mapSelectedAddress ? { backgroundColor: '#f8f9fa' } : {}}
              />
              {useMapPicker && mapSelectedAddress && (
                <small className="text-muted">
                  <i className="fas fa-info-circle"></i> This field was filled from the map selection.
                </small>
              )}
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
                value={addressForm.country}
                onChange={handleAddressInputChange}
                required
                disabled={useMapPicker && mapSelectedAddress}
                style={useMapPicker && mapSelectedAddress ? { backgroundColor: '#f8f9fa' } : {}}
              >
                <option value="">Select a country...</option>
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {useMapPicker && mapSelectedAddress && (
                <small className="text-muted">
                  <i className="fas fa-info-circle"></i> This field was filled from the map selection.
                </small>
              )}
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
            <div className="form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="save-address"
                name="is_default"
                checked={addressForm.is_default}
                onChange={handleAddressInputChange}
              />
              <label className="form-check-label" htmlFor="save-address">
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
                className="btn btn-outline-secondary me-2"
                onClick={() => {
                  setShowNewAddressForm(false);
                  setUseMapPicker(false);
                  setMapSelectedAddress(null);
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

      <style jsx>{`
        .input-method-selector .btn-group {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .input-method-selector .btn {
          border-radius: 0;
          padding: 12px 20px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .input-method-selector .btn:first-child {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }
        
        .input-method-selector .btn:last-child {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        
        .map-picker-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }
        
        .form-control[readonly] {
          background-color: #f8f9fa !important;
          border-color: #28a745;
        }
        
        .alert-success {
          border-left: 4px solid #28a745;
        }
        
        .required {
          color: #dc3545;
          text-decoration: none;
          margin-left: 2px;
        }
        
        .form-group label {
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        .form-control {
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .btn {
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
