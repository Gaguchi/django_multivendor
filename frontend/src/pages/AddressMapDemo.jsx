import { useState } from 'react';
import AddressManager from '../components/Address/AddressManager';
import { useAuth } from '../contexts/AuthContext';

export default function AddressMapDemo() {
  const { user } = useAuth();
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone_number: '',
    email: '',
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
    is_default: false,
    latitude: null,
    longitude: null
  });
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState('');

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'full_form_data') {
      // Handle bulk data update from editing
      setAddressForm(value);
    } else {
      setAddressForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAddressError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Address submitted:', addressForm);
      alert('Address saved successfully! (This is a demo)');
      
      // Reset form
      setAddressForm({
        full_name: '',
        phone_number: '',
        email: '',
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
        is_default: false,
        latitude: null,
        longitude: null
      });
      
    } catch (error) {
      setAddressError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelection = (e) => {
    setSelectedAddress(e.target.value);
    setShowNewAddressForm(e.target.value === '-1');
  };

  const refreshAddresses = async () => {
    // Simulate refresh
    console.log('Refreshing addresses...');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                <i className="fas fa-map-marker-alt me-2"></i>
                Map-Based Address Entry Demo
              </h3>
            </div>
            <div className="card-body">
              <div className="alert alert-info mb-4">
                <h5 className="alert-heading">
                  <i className="fas fa-info-circle"></i> Demo Features
                </h5>
                <ul className="mb-0">
                  <li>Toggle between manual address entry and map-based selection</li>
                  <li>Search for addresses using Google Places autocomplete</li>
                  <li>Click anywhere on the map to select a location</li>
                  <li>Use "My Location" to get your current position</li>
                  <li>Drag the marker to fine-tune the location</li>
                  <li>Automatic address parsing and form filling</li>
                </ul>
              </div>

              <AddressManager
                user={user}
                addresses={addresses}
                selectedAddress={selectedAddress}
                showNewAddressForm={showNewAddressForm}
                addressForm={addressForm}
                handleAddressInputChange={handleAddressInputChange}
                handleAddressSubmit={handleAddressSubmit}
                handleAddressSelection={handleAddressSelection}
                addressError={addressError}
                loading={loading}
                setShowNewAddressForm={setShowNewAddressForm}
                refreshAddresses={refreshAddresses}
                useMapPicker={true} // Enable map picker
              />
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-code"></i> Form Data Preview
              </h5>
            </div>
            <div className="card-body">
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(addressForm, null, 2)}
              </pre>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-cog"></i> Setup Instructions
              </h5>
            </div>
            <div className="card-body">
              <div className="alert alert-warning">
                <h6><i className="fas fa-exclamation-triangle"></i> Google Maps API Key Required</h6>
                <p>To use the map functionality, you need to:</p>
                <ol>
                  <li>Get a Google Maps API key from the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                  <li>Enable the following APIs:
                    <ul>
                      <li>Maps JavaScript API</li>
                      <li>Places API</li>
                      <li>Geocoding API</li>
                    </ul>
                  </li>
                  <li>Replace <code>YOUR_GOOGLE_MAPS_API_KEY</code> in <code>MapAddressPicker.jsx</code> with your actual API key</li>
                  <li>Configure API restrictions as needed for security</li>
                </ol>
              </div>

              <div className="alert alert-info">
                <h6><i className="fas fa-lightbulb"></i> Usage Tips</h6>
                <ul className="mb-0">
                  <li>For production, store the API key in environment variables</li>
                  <li>Consider implementing address validation on the backend</li>
                  <li>Add error handling for map loading failures</li>
                  <li>Customize the map styles to match your brand</li>
                  <li>Add support for additional countries in the country dropdown</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          border: none;
          border-radius: 12px;
        }
        
        .card-header {
          border-radius: 12px 12px 0 0 !important;
          border: none;
        }
        
        .alert {
          border-radius: 8px;
        }
        
        pre {
          max-height: 300px;
          overflow-y: auto;
          font-size: 12px;
        }
        
        .btn {
          border-radius: 6px;
        }
        
        code {
          background-color: #f8f9fa;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
}
