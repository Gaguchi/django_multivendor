import { useState } from 'react';
import LeafletMapAddressPicker from '../components/Address/LeafletMapAddressPicker';
import { useAuth } from '../contexts/AuthContext';

export default function TestLeafletMap() {
  const { user } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressSelect = (addressData) => {
    setSelectedAddress(addressData);
    console.log('Address selected:', addressData);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">🗺️ Free Leaflet Map Test</h2>
              <p className="mb-0 text-muted">No API key required!</p>
            </div>
            <div className="card-body">
              {/* Map Component */}
              <div className="mb-4">
                <h5>Interactive Map Address Picker</h5>
                <p className="text-muted">Click anywhere on the map or search for an address</p>
                <LeafletMapAddressPicker 
                  onAddressSelect={handleAddressSelect}
                  height="500px"
                />
              </div>

              {/* Selected Address Display */}
              {selectedAddress && (
                <div className="mt-4">
                  <h5>Selected Address:</h5>
                  <div className="card bg-light">
                    <div className="card-body">
                      <pre>{JSON.stringify(selectedAddress, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits of Leaflet */}
              <div className="mt-4">
                <h5>✅ Benefits of Leaflet Maps:</h5>
                <ul className="list-group">
                  <li className="list-group-item">
                    <i className="fas fa-check text-success me-2"></i>
                    <strong>Completely Free</strong> - No API keys or usage limits
                  </li>
                  <li className="list-group-item">
                    <i className="fas fa-check text-success me-2"></i>
                    <strong>Open Source</strong> - Based on OpenStreetMap data
                  </li>
                  <li className="list-group-item">
                    <i className="fas fa-check text-success me-2"></i>
                    <strong>Multiple Themes</strong> - Light, dark, and topographic tiles
                  </li>
                  <li className="list-group-item">
                    <i className="fas fa-check text-success me-2"></i>
                    <strong>Reverse Geocoding</strong> - Using free Nominatim service
                  </li>
                  <li className="list-group-item">
                    <i className="fas fa-check text-success me-2"></i>
                    <strong>Search Functionality</strong> - Address search with autocomplete
                  </li>
                  <li className="list-group-item">
                    <i className="fas fa-check text-success me-2"></i>
                    <strong>No Dependencies</strong> - Works without Google Maps API
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="mt-4">
                <h5>🔗 Test in Real Applications:</h5>
                <div className="d-flex gap-2 flex-wrap">
                  <a href="/checkout" className="btn btn-primary">
                    <i className="fas fa-shopping-cart me-1"></i>
                    Test in Checkout
                  </a>
                  <a href="/account#addresses" className="btn btn-secondary">
                    <i className="fas fa-user me-1"></i>
                    Test in Account
                  </a>
                  <a href="/leaflet-demo" className="btn btn-info">
                    <i className="fas fa-map me-1"></i>
                    Full Form Demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          border: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 15px;
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 2rem;
        }

        .card-header h2 {
          font-weight: 700;
        }

        .card-body {
          padding: 2rem;
        }

        .list-group-item {
          border: none;
          padding: 1rem;
          border-radius: 8px !important;
          margin-bottom: 0.5rem;
          background: #f8f9fa;
        }

        .btn {
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        pre {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          font-size: 0.875rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .text-muted {
          color: #6c757d !important;
        }

        .text-success {
          color: #28a745 !important;
        }
      `}</style>
    </div>
  );
}
