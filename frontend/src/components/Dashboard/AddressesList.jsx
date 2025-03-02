import { useState, useEffect } from 'react';
import api from '../../services/api';
import AddressForm from './AddressForm';

export default function AddressesList({ filter = 'all' }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [filter]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/users/addresses/');
      
      // Handle different response formats
      let addressesList = Array.isArray(response.data) 
        ? response.data 
        : (response.data.results || []);
      
      // Apply filter if needed
      if (filter !== 'all') {
        addressesList = addressesList.filter(address => 
          address.address_type === filter || address.address_type === 'both'
        );
      }
      
      setAddresses(addressesList);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/api/users/addresses/${addressId}/`);
      
      // Refresh the list
      await fetchAddresses();
      
      // Close edit form if deleting the address being edited
      if (editAddress && editAddress.id === addressId) {
        setEditAddress(null);
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      alert('Failed to delete address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (address) => {
    try {
      setLoading(true);
      
      // Update the address is_default field
      await api.patch(`/api/users/addresses/${address.id}/`, {
        is_default: true,
        address_type: address.address_type
      });
      
      // Refresh the list
      await fetchAddresses();
    } catch (err) {
      console.error('Error setting default address:', err);
      alert('Failed to set default address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (addressData) => {
    try {
      setLoading(true);
      
      if (addressData.id) {
        // Update existing address
        await api.put(`/api/users/addresses/${addressData.id}/`, addressData);
      } else {
        // Create new address
        await api.post('/api/users/addresses/', addressData);
      }
      
      // Refresh the address list
      await fetchAddresses();
      
      // Reset form state
      setEditAddress(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditAddress(address);
    setShowAddForm(false);
  };

  if (loading && !addresses.length) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading addresses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="addresses-container">
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          {filter === 'shipping' ? 'Shipping Addresses' : 
           filter === 'billing' ? 'Billing Addresses' : 
           'All Addresses'}
        </h3>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(true);
            setEditAddress(null);
          }}
          disabled={loading}
        >
          Add New Address
        </button>
      </div>
      
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            <h5>Add New Address</h5>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
          <div className="card-body">
            <AddressForm 
              onSubmit={handleFormSubmit} 
              initialData={{ 
                address_type: filter !== 'all' ? filter : 'shipping',
                is_default: addresses.length === 0
              }}
              loading={loading}
              addressType={filter !== 'all' ? filter : null}
            />
          </div>
        </div>
      )}
      
      {editAddress && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            <h5>Edit Address</h5>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setEditAddress(null)}
            >
              Cancel
            </button>
          </div>
          <div className="card-body">
            <AddressForm 
              onSubmit={handleFormSubmit} 
              initialData={editAddress}
              loading={loading}
            />
          </div>
        </div>
      )}
      
      {!addresses.length && !showAddForm && !editAddress ? (
        <div className="card">
          <div className="card-body text-center p-5">
            <p>You don't have any saved addresses yet.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Address
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          {addresses.map((address) => (
            <div className="col-md-6" key={address.id}>
              <div className="card mb-4">
                <div className="card-body">
                  <div className={`address-badge ${address.is_default ? 'address-badge-default' : ''}`}>
                    {address.address_type === 'both' ? 'Shipping & Billing' : 
                     address.address_type === 'shipping' ? 'Shipping' : 'Billing'}
                    {address.is_default && <span className="default-badge">Default</span>}
                  </div>
                  
                  <h5 className="mt-2">{address.full_name}</h5>
                  <p className="mb-1">{address.address_line1}</p>
                  {address.address_line2 && (
                    <p className="mb-1">{address.address_line2}</p>
                  )}
                  <p className="mb-1">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p className="mb-1">{address.country}</p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {address.phone_number}
                  </p>
                  
                  <div className="address-actions mt-3">
                    <button 
                      className="btn btn-sm btn-outline-primary mr-2"
                      onClick={() => handleEditAddress(address)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger mr-2"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                    {!address.is_default && (
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleSetDefaultAddress(address)}
                        disabled={loading}
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
