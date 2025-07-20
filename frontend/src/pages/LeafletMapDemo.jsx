import { useState } from 'react';
import AddressFormWithLeaflet from '../components/Address/AddressFormWithLeaflet';
import { useAuth } from '../contexts/AuthContext';

export default function LeafletMapDemo() {
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
  
  const [loading, setLoading] = useState(false);

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Address Form Data:', addressForm);
    
    // Simulate API call
    setTimeout(() => {
      alert('Address saved successfully! (Demo mode)');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="leaflet-map-demo">
      <div className="container">
        <div className="demo-header">
          <h1>🗺️ Free Leaflet Maps Demo</h1>
          <p className="lead">
            This demo showcases our new <strong>completely free</strong> map-based address selection system 
            using Leaflet and OpenStreetMap instead of Google Maps!
          </p>
          
          <div className="features-list">
            <h3>✨ Features:</h3>
            <ul>
              <li>🆓 <strong>100% Free</strong> - No API keys or usage limits</li>
              <li>🗺️ <strong>Interactive Maps</strong> - Click anywhere to select addresses</li>
              <li>🔍 <strong>Address Search</strong> - Search for any location worldwide</li>
              <li>📍 <strong>GPS Location</strong> - Use your current location</li>
              <li>📱 <strong>Mobile Friendly</strong> - Works perfectly on all devices</li>
              <li>🌍 <strong>Global Coverage</strong> - Powered by OpenStreetMap data</li>
            </ul>
          </div>
        </div>

        <div className="demo-content">
          <div className="card">
            <div className="card-header">
              <h3>Try the Address Picker</h3>
              <p>Toggle the map picker and try selecting an address!</p>
            </div>
            <div className="card-body">
              <AddressFormWithLeaflet 
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

          <div className="technical-info">
            <h3>🔧 Technical Details</h3>
            <div className="info-grid">
              <div className="info-card">
                <h4>Map Provider</h4>
                <p>OpenStreetMap (OSM)</p>
                <small>Free, open-source map data</small>
              </div>
              <div className="info-card">
                <h4>Geocoding</h4>
                <p>Nominatim Service</p>
                <small>Free reverse geocoding API</small>
              </div>
              <div className="info-card">
                <h4>Library</h4>
                <p>React Leaflet</p>
                <small>Modern React wrapper for Leaflet</small>
              </div>
              <div className="info-card">
                <h4>Cost</h4>
                <p>$0.00</p>
                <small>No API keys or limits!</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .leaflet-map-demo {
          padding: 20px 0;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .demo-header h1 {
          margin: 0 0 16px 0;
          font-size: 2.5rem;
          color: #2d3748;
          font-weight: 700;
        }

        .lead {
          font-size: 1.2rem;
          color: #4a5568;
          margin-bottom: 30px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .features-list {
          text-align: left;
          max-width: 500px;
          margin: 0 auto;
        }

        .features-list h3 {
          color: #2d3748;
          margin-bottom: 16px;
          text-align: center;
        }

        .features-list ul {
          list-style: none;
          padding: 0;
        }

        .features-list li {
          padding: 8px 0;
          color: #4a5568;
          font-size: 1rem;
        }

        .demo-content {
          display: grid;
          gap: 30px;
        }

        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .card-header {
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }

        .card-header h3 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .card-header p {
          margin: 0;
          opacity: 0.9;
        }

        .card-body {
          padding: 30px;
        }

        .technical-info {
          margin-top: 40px;
          text-align: center;
        }

        .technical-info h3 {
          margin-bottom: 30px;
          color: #2d3748;
          font-size: 1.5rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .info-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .info-card h4 {
          margin: 0 0 12px 0;
          color: #2d3748;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .info-card p {
          margin: 0 0 8px 0;
          color: #667eea;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .info-card small {
          color: #718096;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .demo-header h1 {
            font-size: 2rem;
          }

          .lead {
            font-size: 1.1rem;
          }

          .card-header, .card-body {
            padding: 20px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
