import React from 'react';
import LeafletMapPicker from './LeafletMapPicker';

// This is a compatibility wrapper that redirects to the new free Leaflet-based map picker
// instead of the old Google Maps implementation
export default function MapAddressPicker({ 
  onAddressSelect, 
  initialLat = 41.7151, 
  initialLng = 44.8271,
  height = '400px' 
}) {
  // Simply render the new Leaflet-based map picker
  return (
    <LeafletMapPicker
      onAddressSelect={onAddressSelect}
      initialLat={initialLat}
      initialLng={initialLng}
      height={height}
    />
  );
}
