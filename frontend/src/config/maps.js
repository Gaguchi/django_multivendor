// Leaflet Maps Configuration (Free Alternative to Google Maps)
// Leaflet is completely free and doesn't require an API key!

// Default map center (Tbilisi, Georgia)
export const DEFAULT_MAP_CENTER = {
  lat: 41.7151,
  lng: 44.8271
};

// Map configuration for Leaflet
export const MAP_CONFIG = {
  zoom: 13,
  minZoom: 3,
  maxZoom: 18,
  zoomControl: true,
  attributionControl: true
};

// Available tile layer providers (all free)
export const TILE_PROVIDERS = {
  // OpenStreetMap (default, completely free)
  openstreetmap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  
  // CartoDB Positron (light theme, free)
  cartodb_positron: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  },
  
  // CartoDB Dark Matter (dark theme, free)
  cartodb_dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  },
  
  // OpenTopoMap (topographic, free)
  opentopomap: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 17
  }
};

// Default tile provider
export const DEFAULT_TILE_PROVIDER = TILE_PROVIDERS.cartodb_positron;

// Marker configuration
export const MARKER_CONFIG = {
  draggable: true,
  riseOnHover: true
};

// Countries for the dropdown (extend as needed)
export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'GE', name: 'Georgia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'RU', name: 'Russia' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' }
];

// Geocoding service configuration (using free Nominatim service)
export const GEOCODING_CONFIG = {
  // Nominatim is the free geocoding service used by OpenStreetMap
  nominatimUrl: 'https://nominatim.openstreetmap.org',
  // Format for search requests
  searchFormat: 'json',
  // Results limit
  limit: 5,
  // Include detailed address information
  addressdetails: 1,
  // Include extra tags
  extratags: 1
};
