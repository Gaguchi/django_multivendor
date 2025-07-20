import { useState } from 'react';
import LeafletMapAddressPicker from './LeafletMapAddressPicker';
import { COUNTRIES } from '../../config/maps';

export default function LeafletAddressFormWithMap({ 
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

    // Simulate form input change events for each field
    Object.keys(updatedForm).forEach(key => {
      if (updatedForm[key] !== addressForm[key]) {
        handleAddressInputChange({
          target: {
            name: key,
            value: updatedForm[key],
            type: 'text'
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
    <div className="leaflet-address-form-with-map">
      {/* Map/Manual Toggle */}
      <div className="form-group mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <label className="form-label fw-bold mb-0">Address Entry Method</label>
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${!useMapPicker ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={handleManualEntry}
            >
              <i className="fas fa-keyboard me-2"></i>
              Manual Entry
            </button>
            <button
              type="button"
              className={`btn ${useMapPicker ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={handleMapPickerToggle}
            >
              <i className="fas fa-map-marked-alt me-2"></i>
              Use Map
            </button>
          </div>
        </div>
        <small className="text-muted">
          {useMapPicker 
            ? 'Search for addresses or click on the map to select a location'
            : 'Enter your address details manually'
          }
        </small>
      </div>

      {/* Map Picker */}
      {useMapPicker && (
        <div className="map-picker-section mb-4">
          <LeafletMapAddressPicker
            onAddressSelect={handleMapAddressSelect}
            initialLat={addressForm.latitude || 41.7151}
            initialLng={addressForm.longitude || 44.8271}
            height="400px"
          />
          
          {mapSelectedAddress && (
            <div className="alert alert-success mt-3">
              <div className="d-flex align-items-center">
                <i className="fas fa-check-circle me-2"></i>
                <div>
                  <strong>Address selected from map!</strong>
                  <div className="small">
                    {mapSelectedAddress.formatted_address}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Address Form */}
      <form onSubmit={handleAddressSubmit} id="leaflet-address-form">
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
          />
          {useMapPicker && (
            <small className="text-muted">
              <i className="fas fa-map-pin me-1"></i>
              Address automatically filled from map selection
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
              />
              {useMapPicker && (
                <small className="text-muted">
                  <i className="fas fa-map-pin me-1"></i>
                  City automatically filled from map selection
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
              />
              {useMapPicker && (
                <small className="text-muted">
                  <i className="fas fa-map-pin me-1"></i>
                  State automatically filled from map selection
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
              />
              {useMapPicker && (
                <small className="text-muted">
                  <i className="fas fa-map-pin me-1"></i>
                  Postal code automatically filled from map selection
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
                checked={addressForm.is_default}
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

        {/* Hidden fields for coordinates */}
        {addressForm.latitude && (
          <input 
            type="hidden" 
            name="latitude" 
            value={addressForm.latitude} 
          />
        )}
        {addressForm.longitude && (
          <input 
            type="hidden" 
            name="longitude" 
            value={addressForm.longitude} 
          />
        )}
      </form>

      <style jsx>{`
        .leaflet-address-form-with-map {
          background: white;
          border-radius: 8px;
          padding: 20px;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-label {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .required {
          color: #dc3545;
          text-decoration: none;
        }
        
        .btn-group .btn {
          border-radius: 6px;
        }
        
        .btn-group .btn:not(:last-child) {
          margin-right: 0.5rem;
        }
        
        .map-picker-section {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          background: #f8f9fa;
        }
        
        .alert {
          border-radius: 6px;
        }
        
        .custom-control-label {
          font-weight: normal;
        }
        
        .form-control:focus {
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .btn-primary {
          background-color: #007bff;
          border-color: #007bff;
        }
        
        .btn-primary:hover {
          background-color: #0056b3;
          border-color: #004085;
        }
        
        .btn-outline-primary {
          color: #007bff;
          border-color: #007bff;
        }
        
        .btn-outline-primary:hover {
          background-color: #007bff;
          border-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
}
