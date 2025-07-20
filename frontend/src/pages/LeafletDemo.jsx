import { useState } from 'react';
import LeafletMapAddressPicker from '../components/Address/LeafletMapAddressPicker';
import LeafletAddressFormWithMap from '../components/Address/LeafletAddressFormWithMap';

export default function LeafletDemo() {
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
    country: 'GE',
    delivery_instructions: '',
    is_default: false,
    latitude: null,
    longitude: null
  });

  const [selectedMapAddress, setSelectedMapAddress] = useState(null);

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle full form data replacement
    if (name === 'full_form_data') {
      setAddressForm(value);
      return;
    }
    
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    console.log('Address form submitted:', addressForm);
    alert('Address form submitted! Check console for details.');
  };

  const handleMapAddressSelect = (addressData) => {
    setSelectedMapAddress(addressData);
    console.log('Address selected from map:', addressData);
  };

  return (
    <div className="leaflet-demo-page">
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">
              <i className="fas fa-map-marked-alt me-3"></i>
              Leaflet Map Integration Demo
            </h1>
            
            <div className="alert alert-info">
              <h5><i className="fas fa-info-circle me-2"></i>Demo Features</h5>
              <ul className="mb-0">
                <li><strong>Free Mapping:</strong> No API keys required - uses OpenStreetMap</li>
                <li><strong>Multiple Tile Providers:</strong> CartoDB, OpenStreetMap, OpenTopoMap</li>
                <li><strong>Geocoding Search:</strong> Free Nominatim service for address search</li>
                <li><strong>Current Location:</strong> Automatic geolocation detection</li>
                <li><strong>Interactive Markers:</strong> Click or drag to select addresses</li>
                <li><strong>Form Integration:</strong> Seamless address form filling</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5><i className="fas fa-map me-2"></i>Standalone Map Picker</h5>
              </div>
              <div className="card-body">
                <LeafletMapAddressPicker
                  onAddressSelect={handleMapAddressSelect}
                  initialLat={41.7151}
                  initialLng={44.8271}
                  height="400px"
                />
                
                {selectedMapAddress && (
                  <div className="alert alert-success mt-3">
                    <h6><i className="fas fa-check-circle me-2"></i>Selected Address:</h6>
                    <div className="small">
                      <strong>Formatted:</strong> {selectedMapAddress.formatted_address}<br/>
                      <strong>Street:</strong> {selectedMapAddress.address_line1}<br/>
                      <strong>City:</strong> {selectedMapAddress.city}<br/>
                      <strong>State:</strong> {selectedMapAddress.state}<br/>
                      <strong>Postal Code:</strong> {selectedMapAddress.postal_code}<br/>
                      <strong>Country:</strong> {selectedMapAddress.country}<br/>
                      <strong>Coordinates:</strong> {selectedMapAddress.latitude}, {selectedMapAddress.longitude}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5><i className="fas fa-edit me-2"></i>Current Form Data</h5>
              </div>
              <div className="card-body">
                <pre className="bg-light p-3 rounded" style={{ fontSize: '12px', maxHeight: '400px', overflow: 'auto' }}>
                  {JSON.stringify(addressForm, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5><i className="fas fa-form me-2"></i>Integrated Address Form with Map</h5>
              </div>
              <div className="card-body">
                <LeafletAddressFormWithMap
                  addressForm={addressForm}
                  handleAddressInputChange={handleAddressInputChange}
                  handleAddressSubmit={handleAddressSubmit}
                  loading={false}
                  user={null}
                  showNewAddressForm={true}
                  setShowNewAddressForm={() => {}}
                  selectedAddress={null}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-success">
              <div className="card-header bg-success text-white">
                <h5><i className="fas fa-check-circle me-2"></i>Migration Complete</h5>
              </div>
              <div className="card-body">
                <h6>✅ Successfully Migrated from Google Maps to Leaflet</h6>
                <ul className="list-unstyled">
                  <li><i className="fas fa-check text-success me-2"></i>No more API key requirements</li>
                  <li><i className="fas fa-check text-success me-2"></i>No usage costs or limits</li>
                  <li><i className="fas fa-check text-success me-2"></i>Full feature parity with Google Maps</li>
                  <li><i className="fas fa-check text-success me-2"></i>Multiple free tile providers</li>
                  <li><i className="fas fa-check text-success me-2"></i>Free geocoding via Nominatim</li>
                  <li><i className="fas fa-check text-success me-2"></i>Better performance and privacy</li>
                </ul>
                
                <div className="alert alert-info mt-3">
                  <strong>Next Steps:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Test the address forms in your checkout process</li>
                    <li>Verify geocoding accuracy in your region</li>
                    <li>Customize tile providers if needed</li>
                    <li>Remove old Google Maps dependencies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .leaflet-demo-page {
          background: #f8f9fa;
          min-height: 100vh;
          padding-bottom: 2rem;
        }
        
        .card {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .card-header {
          background: #fff;
          border-bottom: 1px solid #e9ecef;
          font-weight: 600;
        }
        
        .alert {
          border-radius: 6px;
        }
        
        .list-unstyled li {
          padding: 0.25rem 0;
        }
        
        h1 {
          color: #495057;
          font-weight: 600;
        }
        
        .bg-success {
          background-color: #28a745 !important;
        }
        
        .text-success {
          color: #28a745 !important;
        }
        
        .border-success {
          border-color: #28a745 !important;
        }
      `}</style>
    </div>
  );
}
