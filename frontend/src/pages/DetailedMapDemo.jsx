import { useState } from 'react';
import LeafletMapAddressPicker from '../components/Address/LeafletMapAddressPicker';
import { useAuth } from '../contexts/AuthContext';

export default function DetailedMapDemo() {
  const { user } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressSelect = (addressData) => {
    setSelectedAddress(addressData);
    console.log('Address selected:', addressData);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">🏘️ High-Detail Street Maps Demo</h2>
              <p className="mb-0 text-muted">See every street name and house number - completely free!</p>
            </div>
            <div className="card-body">
              
              {/* Feature Highlights */}
              <div className="feature-highlights mb-4">
                <div className="row">
                  <div className="col-md-3">
                    <div className="feature-card">
                      <i className="fas fa-search-location text-primary"></i>
                      <h6>Street-Level Detail</h6>
                      <small>Zoom up to level 20 for house numbers</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card">
                      <i className="fas fa-palette text-info"></i>
                      <h6>Multiple Map Styles</h6>
                      <small>Choose the best style for reading</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card">
                      <i className="fas fa-globe text-success"></i>
                      <h6>Global Coverage</h6>
                      <small>Detailed maps worldwide</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="feature-card">
                      <i className="fas fa-dollar-sign text-warning"></i>
                      <h6>100% Free</h6>
                      <small>No API keys or limits</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Component */}
              <div className="map-demo-section">
                <h5 className="mb-3">
                  <i className="fas fa-map-marked-alt"></i> 
                  Interactive High-Detail Map
                </h5>
                <div className="alert alert-info">
                  <strong>💡 Pro Tips:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Try different map styles from the dropdown to see street names more clearly</li>
                    <li>Zoom in close (scroll or use +/- buttons) to see house numbers</li>
                    <li>Click anywhere to get the exact address with coordinates</li>
                    <li>Search for your address to see local detail level</li>
                  </ul>
                </div>
                <LeafletMapAddressPicker 
                  onAddressSelect={handleAddressSelect}
                  height="600px" // Taller for better detail viewing
                />
              </div>

              {/* Selected Address Display */}
              {selectedAddress && (
                <div className="mt-4">
                  <h5>
                    <i className="fas fa-map-pin"></i> 
                    Selected Address Details:
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">📍 Address Components</h6>
                          <table className="table table-sm table-borderless">
                            <tbody>
                              <tr>
                                <td><strong>Street:</strong></td>
                                <td>{selectedAddress.address_line1 || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td><strong>City:</strong></td>
                                <td>{selectedAddress.city || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td><strong>State/Region:</strong></td>
                                <td>{selectedAddress.state || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td><strong>Postal Code:</strong></td>
                                <td>{selectedAddress.postal_code || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td><strong>Country:</strong></td>
                                <td>{selectedAddress.country || 'N/A'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">🌍 Coordinates</h6>
                          <table className="table table-sm table-borderless">
                            <tbody>
                              <tr>
                                <td><strong>Latitude:</strong></td>
                                <td>{selectedAddress.latitude?.toFixed(6) || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td><strong>Longitude:</strong></td>
                                <td>{selectedAddress.longitude?.toFixed(6) || 'N/A'}</td>
                              </tr>
                            </tbody>
                          </table>
                          <small className="text-muted">
                            These precise coordinates can be used for delivery routing, geofencing, and location-based services.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison Section */}
              <div className="comparison-section mt-5">
                <h5>📊 Detailed Maps Comparison</h5>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Feature</th>
                        <th>Google Maps</th>
                        <th>Our Leaflet Maps</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Street Names Visibility</td>
                        <td>✅ Excellent</td>
                        <td>✅ Excellent (Multiple styles)</td>
                      </tr>
                      <tr>
                        <td>House Numbers</td>
                        <td>✅ Yes (at high zoom)</td>
                        <td>✅ Yes (zoom level 18-20)</td>
                      </tr>
                      <tr>
                        <td>API Key Required</td>
                        <td>❌ Yes</td>
                        <td>✅ No</td>
                      </tr>
                      <tr>
                        <td>Usage Limits</td>
                        <td>❌ $200/month then paid</td>
                        <td>✅ Unlimited free</td>
                      </tr>
                      <tr>
                        <td>Map Style Options</td>
                        <td>Limited</td>
                        <td>✅ Multiple high-detail styles</td>
                      </tr>
                      <tr>
                        <td>Offline Capabilities</td>
                        <td>❌ No</td>
                        <td>✅ Possible with caching</td>
                      </tr>
                      <tr>
                        <td>Global Coverage</td>
                        <td>✅ Excellent</td>
                        <td>✅ Excellent (OpenStreetMap)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-4">
                <h5>🔗 Test in Production Applications:</h5>
                <div className="d-flex gap-2 flex-wrap">
                  <a href="/checkout" className="btn btn-primary">
                    <i className="fas fa-shopping-cart me-1"></i>
                    Checkout Process
                  </a>
                  <a href="/account#addresses" className="btn btn-secondary">
                    <i className="fas fa-user me-1"></i>
                    Account Dashboard
                  </a>
                  <a href="/leaflet-demo" className="btn btn-info">
                    <i className="fas fa-form me-1"></i>
                    Full Address Form
                  </a>
                  <a href="/test-leaflet" className="btn btn-success">
                    <i className="fas fa-test-tube me-1"></i>
                    Basic Map Test
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
          background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
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

        .feature-highlights {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .feature-card {
          text-align: center;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          height: 100%;
        }

        .feature-card i {
          font-size: 2rem;
          margin-bottom: 10px;
          display: block;
        }

        .feature-card h6 {
          font-weight: 600;
          margin-bottom: 5px;
          color: #2d3748;
        }

        .feature-card small {
          color: #718096;
        }

        .map-demo-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .comparison-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .table th {
          background-color: #6c757d;
          color: white;
          border: none;
          font-weight: 600;
        }

        .table td {
          border: none;
          padding: 12px;
          vertical-align: middle;
        }

        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0,0,0,.02);
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

        .alert {
          border-radius: 8px;
          border: none;
        }

        .alert-info {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
        }

        @media (max-width: 768px) {
          .card-header, .card-body {
            padding: 1rem;
          }
          
          .feature-highlights, .map-demo-section, .comparison-section {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}
