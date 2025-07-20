import { useState, useEffect } from 'react';
import MapAddressPicker from '../components/Address/MapAddressPicker';
import AddressFormWithMap from '../components/Address/AddressFormWithMap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function MapDemo() {
  const { user } = useAuth();
  const [selectedAddressData, setSelectedAddressData] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(true);
  const [showFullForm, setShowFullForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    full_name: user?.profile ? `${user.profile.first_name || ''} ${user.profile.last_name || ''}`.trim() : '',
    phone_number: user?.profile?.phone || '',
    email: user?.email || '',
    address_line1: '',
    address_line2: '',
    apartment_number: '',
    entrance_number: '',
    floor: '',
    door_code: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    delivery_instructions: '',
    address_type: 'shipping',
    is_default: false,
    latitude: null,
    longitude: null
  });

  // Handle address selection from map
  const handleMapAddressSelect = (addressData) => {
    console.log('Selected address data:', addressData);
    setSelectedAddressData(addressData);
    
    // Update form with map data
    setAddressForm(prev => ({
      ...prev,
      address_line1: addressData.address_line1 || '',
      city: addressData.city || '',
      state: addressData.state || '',
      postal_code: addressData.postal_code || '',
      country: addressData.country || 'US',
      latitude: addressData.latitude,
      longitude: addressData.longitude
    }));
  };

  // Handle form input changes
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to save addresses');
      return;
    }

    try {
      setLoading(true);
      
      const response = await api.post('/api/users/addresses/', addressForm);
      
      if (response.data) {
        alert('Address saved successfully!');
        // Reset form
        setAddressForm({
          ...addressForm,
          address_line1: '',
          address_line2: '',
          apartment_number: '',
          entrance_number: '',
          floor: '',
          door_code: '',
          city: '',
          state: '',
          postal_code: '',
          delivery_instructions: '',
          latitude: null,
          longitude: null
        });
        setSelectedAddressData(null);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="demo-header text-center mb-4">
            <h1 className="display-4">🗺️ Interactive Map Address Picker</h1>
            <p className="lead text-muted">
              Demonstrate the map-based address selection functionality
            </p>
          </div>

          {/* Demo Mode Selector */}
          <div className="demo-controls mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Demo Options</h5>
              </div>
              <div className="card-body">
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn ${showMapPicker ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                      setShowMapPicker(true);
                      setShowFullForm(false);
                    }}
                  >
                    <i className="fas fa-map-marker-alt"></i> Map Picker Only
                  </button>
                  <button
                    type="button"
                    className={`btn ${showFullForm ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                      setShowFullForm(true);
                      setShowMapPicker(false);
                    }}
                  >
                    <i className="fas fa-form"></i> Full Address Form with Map
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Map Picker Demo */}
          {showMapPicker && (
            <div className="demo-section">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-map"></i> Interactive Map Address Picker
                  </h5>
                </div>
                <div className="card-body">
                  <p className="text-muted mb-3">
                    This demonstrates the standalone map picker component. 
                    Click on the map, search for an address, or use "My Location" to select an address.
                  </p>
                  
                  <MapAddressPicker
                    onAddressSelect={handleMapAddressSelect}
                    height="400px"
                  />

                  {/* Selected Address Display */}
                  {selectedAddressData && (
                    <div className="selected-data mt-4">
                      <div className="alert alert-success">
                        <h6 className="alert-heading">
                          <i className="fas fa-check-circle"></i> Address Selected!
                        </h6>
                        <div className="row">
                          <div className="col-md-6">
                            <strong>Address:</strong> {selectedAddressData.address_line1}<br/>
                            <strong>City:</strong> {selectedAddressData.city}<br/>
                            <strong>State:</strong> {selectedAddressData.state}
                          </div>
                          <div className="col-md-6">
                            <strong>Postal Code:</strong> {selectedAddressData.postal_code}<br/>
                            <strong>Country:</strong> {selectedAddressData.country}<br/>
                            <strong>Coordinates:</strong> {selectedAddressData.latitude?.toFixed(6)}, {selectedAddressData.longitude?.toFixed(6)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Full Form Demo */}
          {showFullForm && (
            <div className="demo-section">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-edit"></i> Complete Address Form with Map Integration
                  </h5>
                </div>
                <div className="card-body">
                  <p className="text-muted mb-3">
                    This demonstrates the full address form with integrated map picker. 
                    Users can toggle between manual entry and map-based selection.
                  </p>
                  
                  <AddressFormWithMap
                    addressForm={addressForm}
                    handleAddressInputChange={handleAddressInputChange}
                    handleAddressSubmit={handleAddressSubmit}
                    loading={loading}
                    user={user}
                    showNewAddressForm={true}
                    setShowNewAddressForm={() => {}}
                    selectedAddress={null}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="instructions mt-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-info-circle"></i> How to Use the Map
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <h6><i className="fas fa-search"></i> Search</h6>
                    <p>Type an address in the search box to find locations quickly.</p>
                  </div>
                  <div className="col-md-4">
                    <h6><i className="fas fa-mouse-pointer"></i> Click</h6>
                    <p>Click anywhere on the map to place a marker and get that address.</p>
                  </div>
                  <div className="col-md-4">
                    <h6><i className="fas fa-location-arrow"></i> My Location</h6>
                    <p>Click "My Location" to automatically find your current position.</p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <h6><i className="fas fa-hand-rock"></i> Drag</h6>
                    <p>Drag the marker to fine-tune the exact location.</p>
                  </div>
                  <div className="col-md-6">
                    <h6><i className="fas fa-toggle-on"></i> Toggle</h6>
                    <p>In the full form, toggle between manual entry and map selection.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Status */}
          <div className="status mt-4">
            <div className="card border-success">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="fas fa-check-circle"></i> Implementation Status
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>✅ Components Ready:</h6>
                    <ul className="list-unstyled">
                      <li><i className="fas fa-check text-success"></i> MapAddressPicker</li>
                      <li><i className="fas fa-check text-success"></i> AddressFormWithMap</li>
                      <li><i className="fas fa-check text-success"></i> AddressManager</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>✅ Integration Points:</h6>
                    <ul className="list-unstyled">
                      <li><i className="fas fa-check text-success"></i> Checkout Process</li>
                      <li><i className="fas fa-check text-success"></i> Account Dashboard</li>
                      <li><i className="fas fa-check text-success"></i> Google Maps API</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .demo-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 1rem;
          margin-bottom: 2rem;
        }

        .demo-controls .btn-group {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .demo-section {
          margin-bottom: 2rem;
        }

        .card {
          border: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 1rem;
        }

        .card-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%);
          border-bottom: 1px solid #e5e7eb;
          border-radius: 1rem 1rem 0 0 !important;
        }

        .selected-data .alert {
          border-left: 4px solid #28a745;
        }

        .instructions h6 {
          color: #495057;
          margin-bottom: 0.5rem;
        }

        .instructions p {
          color: #6c757d;
          font-size: 0.9rem;
          margin-bottom: 0;
        }

        .status .card-header {
          background: #28a745 !important;
        }

        .list-unstyled li {
          padding: 0.25rem 0;
        }

        .fas {
          margin-right: 0.5rem;
        }

        @media (max-width: 768px) {
          .demo-header {
            padding: 1rem;
          }
          
          .btn-group {
            flex-direction: column;
          }
          
          .btn-group .btn {
            border-radius: 0.375rem !important;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
