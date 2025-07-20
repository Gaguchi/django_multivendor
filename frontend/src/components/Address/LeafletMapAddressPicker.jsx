import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  DEFAULT_MAP_CENTER, 
  MAP_CONFIG, 
  DEFAULT_TILE_PROVIDER, 
  MARKER_CONFIG,
  GEOCODING_CONFIG 
} from '../../config/maps';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom hook for handling map clicks and marker placement
function MapClickHandler({ onLocationSelect, markerPosition, setMarkerPosition }) {
  const map = useMap();

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      handleReverseGeocode(lat, lng, onLocationSelect);
    }
  });

  // Update map view when marker position changes externally
  useEffect(() => {
    if (markerPosition) {
      map.setView(markerPosition, map.getZoom());
    }
  }, [map, markerPosition]);

  return null;
}

// Custom hook for map centering
function MapCenterUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [map, center]);

  return null;
}

// Reverse geocoding function using Nominatim (free)
const handleReverseGeocode = async (lat, lng, onLocationSelect) => {
  try {
    const response = await fetch(
      `${GEOCODING_CONFIG.nominatimUrl}/reverse?` +
      `format=${GEOCODING_CONFIG.searchFormat}&` +
      `lat=${lat}&lon=${lng}&` +
      `addressdetails=${GEOCODING_CONFIG.addressdetails}&` +
      `extratags=${GEOCODING_CONFIG.extratags}`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    
    if (data && data.address) {
      const addressData = parseNominatimAddress(data, lat, lng);
      if (onLocationSelect) {
        onLocationSelect(addressData);
      }
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
  }
};

// Parse Nominatim address response into our format
const parseNominatimAddress = (data, lat, lng) => {
  const addr = data.address;
  
  // Construct address line 1
  let addressLine1 = '';
  if (addr.house_number && addr.road) {
    addressLine1 = `${addr.house_number} ${addr.road}`;
  } else if (addr.road) {
    addressLine1 = addr.road;
  } else if (addr.pedestrian) {
    addressLine1 = addr.pedestrian;
  } else if (addr.suburb) {
    addressLine1 = addr.suburb;
  }

  return {
    formatted_address: data.display_name || '',
    address_line1: addressLine1,
    city: addr.city || addr.town || addr.village || addr.municipality || '',
    state: addr.state || addr.region || addr.province || '',
    postal_code: addr.postcode || '',
    country: addr.country_code ? addr.country_code.toUpperCase() : '',
    latitude: lat,
    longitude: lng
  };
};

// Search function using Nominatim
const searchAddresses = async (query) => {
  try {
    const response = await fetch(
      `${GEOCODING_CONFIG.nominatimUrl}/search?` +
      `format=${GEOCODING_CONFIG.searchFormat}&` +
      `q=${encodeURIComponent(query)}&` +
      `limit=${GEOCODING_CONFIG.limit}&` +
      `addressdetails=${GEOCODING_CONFIG.addressdetails}`
    );

    if (!response.ok) {
      throw new Error('Search request failed');
    }

    const data = await response.json();
    return data.map(item => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      address: item.address
    }));
  } catch (error) {
    console.error('Address search failed:', error);
    return [];
  }
};

export default function LeafletMapAddressPicker({ 
  onAddressSelect, 
  initialLat = DEFAULT_MAP_CENTER.lat, 
  initialLng = DEFAULT_MAP_CENTER.lng,
  height = '400px' 
}) {
  const [markerPosition, setMarkerPosition] = useState([initialLat, initialLng]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Handle location selection
  const handleLocationSelect = useCallback((addressData) => {
    setSelectedAddress(addressData);
    if (onAddressSelect) {
      onAddressSelect(addressData);
    }
  }, [onAddressSelect]);

  // Handle search input changes with debounce
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    if (value.trim().length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await searchAddresses(value);
          setSearchResults(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, []);

  // Handle search result selection
  const handleSearchResultSelect = useCallback((result) => {
    const lat = result.lat;
    const lng = result.lng;
    
    setMarkerPosition([lat, lng]);
    setSearchQuery(result.display_name);
    setShowSearchResults(false);
    
    // Parse the result into our address format
    const addressData = parseNominatimAddress(result, lat, lng);
    handleLocationSelect(addressData);
  }, [handleLocationSelect]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoadingAddress(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setMarkerPosition([lat, lng]);
        handleReverseGeocode(lat, lng, handleLocationSelect);
        setIsLoadingAddress(false);
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('Unable to get your current location. Please search for your address or click on the map.');
        setIsLoadingAddress(false);
      }
    );
  }, [handleLocationSelect]);

  // Handle marker drag
  const handleMarkerDrag = useCallback((e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPosition([lat, lng]);
    setIsLoadingAddress(true);
    handleReverseGeocode(lat, lng, (addressData) => {
      handleLocationSelect(addressData);
      setIsLoadingAddress(false);
    });
  }, [handleLocationSelect]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="leaflet-map-address-picker">
      {/* Search Controls */}
      <div className="map-controls mb-3">
        <div className="row">
          <div className="col-md-8">
            <div className="search-container position-relative" ref={searchInputRef}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for an address..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={getCurrentLocation}
                    disabled={isLoadingAddress}
                  >
                    <i className="fas fa-location-arrow"></i> My Location
                  </button>
                </div>
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="search-results">
                  {isSearching ? (
                    <div className="search-result-item">
                      <i className="fas fa-spinner fa-spin"></i> Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="search-result-item"
                        onClick={() => handleSearchResultSelect(result)}
                      >
                        <i className="fas fa-map-marker-alt text-primary"></i>
                        <span>{result.display_name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="search-result-item text-muted">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            {isLoadingAddress && (
              <div className="text-muted">
                <i className="fas fa-spinner fa-spin"></i> Getting address...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ height, width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}>
        <MapContainer
          center={markerPosition}
          zoom={MAP_CONFIG.zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={MAP_CONFIG.zoomControl}
        >
          <TileLayer
            url={DEFAULT_TILE_PROVIDER.url}
            attribution={DEFAULT_TILE_PROVIDER.attribution}
            maxZoom={DEFAULT_TILE_PROVIDER.maxZoom}
          />
          
          <MapClickHandler 
            onLocationSelect={handleLocationSelect}
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
          />
          
          <MapCenterUpdater center={markerPosition} />
          
          {markerPosition && (
            <Marker 
              position={markerPosition}
              draggable={MARKER_CONFIG.draggable}
              eventHandlers={{
                dragend: handleMarkerDrag
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Instructions */}
      <div className="map-instructions mt-2">
        <small className="text-muted">
          <i className="fas fa-info-circle"></i> 
          Search for an address above, click "My Location" to use your current location, or click anywhere on the map to select an address. You can also drag the marker to fine-tune the location.
        </small>
      </div>

      {/* Selected Address Preview */}
      {selectedAddress && (
        <div className="selected-address-preview mt-3">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Selected Address:</h6>
              <p className="card-text mb-1">{selectedAddress.address_line1}</p>
              <p className="card-text mb-1">
                {selectedAddress.city}
                {selectedAddress.state && `, ${selectedAddress.state}`}
                {selectedAddress.postal_code && ` ${selectedAddress.postal_code}`}
              </p>
              {selectedAddress.country && (
                <p className="card-text mb-0">{selectedAddress.country}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .leaflet-map-address-picker {
          margin: 20px 0;
        }
        
        .map-controls .input-group {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .search-container {
          position: relative;
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-height: 200px;
          overflow-y: auto;
          z-index: 1000;
        }
        
        .search-result-item {
          padding: 10px 15px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .search-result-item:hover {
          background-color: #f8f9fa;
        }
        
        .search-result-item:last-child {
          border-bottom: none;
        }
        
        .selected-address-preview .card {
          border-left: 4px solid #007bff;
        }
        
        .map-instructions {
          font-size: 0.9em;
        }
        
        /* Override Leaflet popup z-index to prevent conflicts */
        :global(.leaflet-popup) {
          z-index: 10000 !important;
        }
        
        :global(.leaflet-tooltip) {
          z-index: 10000 !important;
        }
      `}</style>
    </div>
  );
}
