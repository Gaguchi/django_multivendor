import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define constants directly to avoid import issues
const DEFAULT_MAP_CENTER = {
  lat: 41.7151,
  lng: 44.8271
};

const MAP_CONFIG = {
  zoom: 13,
  minZoom: 3,
  maxZoom: 18,
  zoomControl: true,
  attributionControl: true
};

const DEFAULT_TILE_PROVIDER = {
  url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 19
};

const GEOCODING_CONFIG = {
  nominatimUrl: 'https://nominatim.openstreetmap.org',
  searchFormat: 'json',
  limit: 5,
  addressdetails: 1,
  extratags: 1
};

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Component to handle marker updates
function MarkerController({ position, onMarkerDrag }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const newPosition = marker.getLatLng();
          onMarkerDrag(newPosition);
        },
      }}
    />
  );
}

export default function LeafletMapPicker({ 
  onAddressSelect, 
  initialLat = DEFAULT_MAP_CENTER.lat, 
  initialLng = DEFAULT_MAP_CENTER.lng,
  height = '400px' 
}) {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Initialize marker at center
  useEffect(() => {
    setMarkerPosition([initialLat, initialLng]);
  }, [initialLat, initialLng]);

  // Handle map click
  const handleMapClick = async (latlng) => {
    setMarkerPosition([latlng.lat, latlng.lng]);
    setIsLoadingAddress(true);
    
    try {
      await reverseGeocode(latlng.lat, latlng.lng);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Handle marker drag
  const handleMarkerDrag = async (latlng) => {
    setMarkerPosition([latlng.lat, latlng.lng]);
    setIsLoadingAddress(true);
    
    try {
      await reverseGeocode(latlng.lat, latlng.lng);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Reverse geocode using Nominatim (free)
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `${GEOCODING_CONFIG.nominatimUrl}/reverse?format=${GEOCODING_CONFIG.searchFormat}&lat=${lat}&lon=${lng}&addressdetails=${GEOCODING_CONFIG.addressdetails}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
      const data = await response.json();
      
      if (data && data.address) {
        const addressData = extractAddressFromNominatim(data, lat, lng);
        setSelectedAddress(addressData);
        
        if (onAddressSelect) {
          onAddressSelect(addressData);
        }
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  // Extract address components from Nominatim response
  const extractAddressFromNominatim = (data, lat, lng) => {
    const address = data.address || {};
    
    return {
      formatted_address: data.display_name || '',
      address_line1: `${address.house_number || ''} ${address.road || ''}`.trim() || address.address29 || address.address27 || '',
      city: address.city || address.town || address.village || address.municipality || '',
      state: address.state || address.region || address.county || '',
      postal_code: address.postcode || '',
      country: address.country_code?.toUpperCase() || 'US',
      latitude: lat,
      longitude: lng
    };
  };

  // Search for addresses using Nominatim
  const searchAddresses = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${GEOCODING_CONFIG.nominatimUrl}/search?format=${GEOCODING_CONFIG.searchFormat}&q=${encodeURIComponent(query)}&limit=${GEOCODING_CONFIG.limit}&addressdetails=${GEOCODING_CONFIG.addressdetails}`
      );
      
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      
      const data = await response.json();
      setSearchResults(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Address search failed:', error);
      setSearchResults([]);
    }
  };

  // Handle search input
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchAddresses(query);
    }, 300);
  };

  // Handle search result selection
  const handleSearchResultSelect = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setMarkerPosition([lat, lng]);
    setSearchQuery(result.display_name);
    setShowResults(false);
    
    const addressData = extractAddressFromNominatim(result, lat, lng);
    setSelectedAddress(addressData);
    
    if (onAddressSelect) {
      onAddressSelect(addressData);
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoadingAddress(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMarkerPosition([lat, lng]);
        
        try {
          await reverseGeocode(lat, lng);
        } catch (error) {
          console.error('Error getting current location address:', error);
        } finally {
          setIsLoadingAddress(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please try searching for an address.');
        setIsLoadingAddress(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  return (
    <div className="leaflet-map-picker">
      {/* Search Controls */}
      <div className="map-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for an address..."
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={() => setShowResults(searchResults.length > 0)}
            className="search-input"
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoadingAddress}
            className="location-btn"
            title="Use my current location"
          >
            {isLoadingAddress ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : (
              <i className="fa fa-location-arrow"></i>
            )}
          </button>
        </div>
        
        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="search-result"
                onClick={() => handleSearchResultSelect(result)}
              >
                <div className="result-name">{result.display_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="map-container" style={{ height }}>
        <MapContainer
          center={[initialLat, initialLng]}
          zoom={MAP_CONFIG.zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={MAP_CONFIG.zoomControl}
        >
          <TileLayer
            url={DEFAULT_TILE_PROVIDER.url}
            attribution={DEFAULT_TILE_PROVIDER.attribution}
            maxZoom={DEFAULT_TILE_PROVIDER.maxZoom}
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <MarkerController 
            position={markerPosition} 
            onMarkerDrag={handleMarkerDrag}
          />
        </MapContainer>
      </div>

      {/* Loading indicator */}
      {isLoadingAddress && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <i className="fa fa-spinner fa-spin"></i>
            <span>Getting address...</span>
          </div>
        </div>
      )}

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="selected-address">
          <h4>Selected Address:</h4>
          <p>{selectedAddress.formatted_address}</p>
          <small>
            Coordinates: {selectedAddress.latitude?.toFixed(6)}, {selectedAddress.longitude?.toFixed(6)}
          </small>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .leaflet-map-picker {
          width: 100%;
          position: relative;
        }

        .map-controls {
          margin-bottom: 10px;
          position: relative;
        }

        .search-container {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .search-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .location-btn {
          padding: 8px 12px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .location-btn:hover:not(:disabled) {
          background: #5a67d8;
        }

        .location-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 4px 4px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .search-result {
          padding: 10px 12px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
        }

        .search-result:hover {
          background-color: #f8f9fa;
        }

        .search-result:last-child {
          border-bottom: none;
        }

        .result-name {
          font-size: 14px;
          color: #333;
        }

        .map-container {
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: white;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .selected-address {
          margin-top: 12px;
          padding: 12px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
        }

        .selected-address h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #495057;
        }

        .selected-address p {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #333;
        }

        .selected-address small {
          color: #6c757d;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
