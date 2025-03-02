import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function AddressManager({ 
  user,
  addresses,
  selectedAddress,
  showNewAddressForm,
  addressForm,
  handleAddressInputChange,
  handleAddressSubmit,
  handleAddressSelection,
  addressError,
  loading,
  setShowNewAddressForm,
  refreshAddresses // Add this prop for refreshing addresses after deletion
}) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Function to handle address deletion
  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      await api.delete(`/api/users/addresses/${addressId}/`);
      
      // Refresh the address list
      if (refreshAddresses) {
        await refreshAddresses();
      }
      
      // If deleted address was selected, reset selection
      if (selectedAddress === addressId) {
        handleAddressSelection({ target: { value: "" } });
      }
      
    } catch (error) {
      console.error("Failed to delete address:", error);
      alert("Failed to delete address. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <h2 className="step-title">Shipping Details</h2>
      {addressError && (
        <div className="alert alert-danger" role="alert">
          {addressError}
        </div>
      )}
      
      {user && addresses && addresses.length > 0 && (
        <div className="form-group mb-4">
          <label htmlFor="address-select">Select Address</label>
          <select 
            className="form-control" 
            id="address-select"
            value={selectedAddress || ''}
            onChange={handleAddressSelection}
            disabled={deleteLoading}
          >
            <option value="">Select an address...</option>
            {addresses.map(address => (
              <option key={address.id} value={address.id}>
                {address.full_name}, {address.address_line1}, {address.city}
              </option>
            ))}
            <option value="-1">+ Add new address</option>
          </select>
        </div>
      )}
      
      {/* Show the selected address */}
      {user && selectedAddress && selectedAddress !== -1 && 
      !showNewAddressForm && addresses && addresses.length > 0 && (
        <div className="selected-address mb-4">
          <div className="card p-3">
            {addresses.find(a => a.id === selectedAddress) && (
              <div>
                <h5>{addresses.find(a => a.id === selectedAddress).full_name}</h5>
                <p className="mb-1">{addresses.find(a => a.id === selectedAddress).address_line1}</p>
                {addresses.find(a => a.id === selectedAddress).address_line2 && (
                  <p className="mb-1">{addresses.find(a => a.id === selectedAddress).address_line2}</p>
                )}
                <p className="mb-1">
                  {addresses.find(a => a.id === selectedAddress).city}, {addresses.find(a => a.id === selectedAddress).state} {addresses.find(a => a.id === selectedAddress).postal_code}
                </p>
                <p className="mb-1">{addresses.find(a => a.id === selectedAddress).country}</p>
                <p className="mb-1">Phone: {addresses.find(a => a.id === selectedAddress).phone_number}</p>
                {addresses.find(a => a.id === selectedAddress).email && (
                  <p className="mb-1">Email: {addresses.find(a => a.id === selectedAddress).email}</p>
                )}
                <div className="d-flex mt-2">
                  <button 
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={() => {
                      // Fill form with selected address data for editing
                      const addr = addresses.find(a => a.id === selectedAddress);
                      handleAddressInputChange({
                        target: {
                          name: 'full_form_data',
                          value: addr
                        }
                      });
                      setShowNewAddressForm(true);
                    }}
                    disabled={deleteLoading}
                  >
                    Edit Address
                  </button>
                  
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteAddress(selectedAddress)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete Address'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Address form */}
      {(showNewAddressForm || !user || !addresses || addresses.length === 0) && (
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

          {/* ... existing form fields ... */}
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
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  {/* Add more countries as needed */}
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
        </form>
      )}
    </>
  );
}
