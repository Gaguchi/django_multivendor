import { useState, useEffect } from 'react';
import api from '../../services/api';
import AddressForm from './AddressForm';
import LeafletAddressFormWithMap from '../Address/LeafletAddressFormWithMap';

export default function AddressesList({ filter = 'all' }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State for map-enabled address forms
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    apartment_number: '',
    entrance_number: '',
    floor: '',
    door_code: '',
    delivery_instructions: '',
    address_type: 'shipping',
    is_default: false
  });

  // Handler for address form input changes
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle special case for bulk data update
    if (name === 'full_form_data') {
      setAddressForm(value);
      return;
    }
    
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
      resetAddressForm();
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for map-enabled address form submission
  const handleMapAddressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const dataToSubmit = {
        ...addressForm,
        address_type: filter !== 'all' ? filter : addressForm.address_type || 'shipping'
      };

      if (editAddress && editAddress.id) {
        // Update existing address
        await api.put(`/api/users/addresses/${editAddress.id}/`, {
          ...dataToSubmit,
          id: editAddress.id
        });
      } else {
        // Create new address
        await api.post('/api/users/addresses/', dataToSubmit);
      }
      
      // Refresh the address list
      await fetchAddresses();
      
      // Reset form state
      setEditAddress(null);
      setShowAddForm(false);
      resetAddressForm();
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset address form to initial state
  const resetAddressForm = () => {
    setAddressForm({
      full_name: '',
      phone_number: '',
      email: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
      apartment_number: '',
      entrance_number: '',
      floor: '',
      door_code: '',
      delivery_instructions: '',
      address_type: filter !== 'all' ? filter : 'shipping',
      is_default: addresses.length === 0
    });
  };

  const handleEditAddress = (address) => {
    setEditAddress(address);
    setShowAddForm(false);
    // Populate the address form with the selected address data
    setAddressForm({
      ...address,
      address_type: address.address_type || 'shipping'
    });
  };

  if (loading && !addresses.length) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading addresses...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
          }
          .loading-spinner {
            margin-bottom: 20px;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f4f6;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          p {
            color: #6b7280;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="addresses-container">
      {error && (
        <div className="error-alert">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h4>Something went wrong</h4>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <div className="addresses-header">
        <div className="header-text">
          <h2>
            {filter === 'shipping' ? 'Shipping Addresses' : 
             filter === 'billing' ? 'Billing Addresses' : 
             'My Addresses'}
          </h2>
          <p>Manage your saved addresses for faster checkout</p>
        </div>
        <button 
          className="add-btn"
          onClick={() => {
            setShowAddForm(true);
            setEditAddress(null);
            resetAddressForm();
          }}
          disabled={loading}
        >
          <span className="add-icon">+</span>
          <span>Add Address</span>
        </button>
      </div>
      
      {showAddForm && (
        <div className="form-card">
          <div className="form-header">
            <h3>
              <i className="icon-plus"></i>
              Add New Address
            </h3>
            <button 
              className="close-btn"
              onClick={() => setShowAddForm(false)}
              aria-label="Close form"
            >
              <i className="icon-close"></i>
            </button>
          </div>
          <div className="form-body">
            <LeafletAddressFormWithMap 
              addressForm={{
                ...addressForm,
                address_type: filter !== 'all' ? filter : 'shipping',
                is_default: addresses.length === 0
              }}
              handleAddressInputChange={handleAddressInputChange}
              handleAddressSubmit={handleMapAddressSubmit}
              loading={loading}
              user={null}
              showNewAddressForm={true}
              setShowNewAddressForm={() => setShowAddForm(false)}
              selectedAddress={null}
            />
          </div>
        </div>
      )}
      
      {editAddress && (
        <div className="form-card">
          <div className="form-header">
            <h3>
              <i className="icon-pencil"></i>
              Edit Address
            </h3>
            <button 
              className="close-btn"
              onClick={() => setEditAddress(null)}
              aria-label="Close form"
            >
              <i className="icon-close"></i>
            </button>
          </div>
          <div className="form-body">
            <LeafletAddressFormWithMap 
              addressForm={addressForm}
              handleAddressInputChange={handleAddressInputChange}
              handleAddressSubmit={handleMapAddressSubmit}
              loading={loading}
              user={null}
              showNewAddressForm={true}
              setShowNewAddressForm={() => setEditAddress(null)}
              selectedAddress={editAddress?.id}
            />
          </div>
        </div>
      )}
      
      {loading && !addresses.length ? (
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading addresses...</p>
        </div>
      ) : !addresses.length && !showAddForm && !editAddress ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="icon-location-pin"></i>
          </div>
          <h3>No addresses found</h3>
          <p>You don't have any saved addresses yet. Add your first address to get started.</p>
          <button 
            className="primary-btn"
            onClick={() => setShowAddForm(true)}
          >
            <i className="icon-plus"></i>
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <div className="address-card" key={address.id}>
              <div className="address-header">
                <div className="address-type">
                  <div className={`type-badge ${address.address_type}`}>
                    <i className={address.address_type === 'shipping' ? 'icon-truck' : address.address_type === 'billing' ? 'icon-credit-card' : 'icon-location-pin'}></i>
                    <span>
                      {address.address_type === 'both' ? 'Shipping & Billing' : 
                       address.address_type === 'shipping' ? 'Shipping' : 'Billing'}
                    </span>
                  </div>
                  {address.is_default && (
                    <span className="default-badge">
                      <i className="icon-star"></i>
                      Default
                    </span>
                  )}
                </div>
              </div>
              
              <div className="address-body">
                <h4>{address.full_name}</h4>
                <div className="address-details">
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>{address.city}, {address.state} {address.postal_code}</p>
                  <p className="country">{address.country}</p>
                  <div className="phone">
                    <i className="icon-phone"></i>
                    <span>{address.phone_number}</span>
                  </div>
                </div>
              </div>
              
              <div className="address-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => handleEditAddress(address)}
                  disabled={loading}
                  title="Edit address"
                >
                  <i className="icon-pencil"></i>
                  <span>Edit</span>
                </button>
                
                {!address.is_default && (
                  <button 
                    className="action-btn default"
                    onClick={() => handleSetDefaultAddress(address)}
                    disabled={loading}
                    title="Set as default"
                  >
                    <i className="icon-star"></i>
                    <span>Set Default</span>
                  </button>
                )}
                
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteAddress(address.id)}
                  disabled={loading}
                  title="Delete address"
                >
                  <i className="icon-trash"></i>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Component Styles */}
      <style jsx>{`
        .addresses-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .alert {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          border-radius: 12px;
          border: none;
        }

        .alert-error {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #dc2626;
        }

        .alert i {
          font-size: 20px;
          margin-top: 2px;
        }

        .alert-content h4 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .alert-content p {
          margin: 0;
          font-size: 14px;
        }

        .addresses-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-content h2 {
          margin: 0 0 8px 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .header-content p {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
        }

        .add-address-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .add-address-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .add-address-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .form-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%);
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .form-header h3 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .close-btn {
          background: none;
          border: none;
          color: #6b7280;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .form-body {
          padding: 24px;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          margin-bottom: 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 16px;
          border: 2px dashed #e5e7eb;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto;
          font-size: 32px;
          color: #9ca3af;
        }

        .empty-state h3 {
          margin: 0 0 12px 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
        }

        .empty-state p {
          margin: 0 0 32px 0;
          color: #6b7280;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .address-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .address-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .address-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%);
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .address-type {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .type-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .type-badge.shipping {
          background: #dbeafe;
          color: #1e40af;
        }

        .type-badge.billing {
          background: #fef3c7;
          color: #92400e;
        }

        .type-badge.both {
          background: #d1fae5;
          color: #065f46;
        }

        .default-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .address-body {
          padding: 24px;
        }

        .address-body h4 {
          margin: 0 0 16px 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .address-details p {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 14px;
          line-height: 1.5;
        }

        .address-details .country {
          font-weight: 600;
          color: #1f2937;
        }

        .phone {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 14px;
          color: #374151;
        }

        .phone i {
          color: #6b7280;
        }

        .address-actions {
          display: flex;
          padding: 16px 24px;
          gap: 8px;
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          justify-content: center;
        }

        .action-btn.edit {
          background: #e0e7ff;
          color: #3730a3;
        }

        .action-btn.edit:hover:not(:disabled) {
          background: #c7d2fe;
        }

        .action-btn.default {
          background: #fef3c7;
          color: #92400e;
        }

        .action-btn.default:hover:not(:disabled) {
          background: #fde68a;
        }

        .action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn.delete:hover:not(:disabled) {
          background: #fecaca;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .addresses-header {
            flex-direction: column;
            align-items: stretch;
          }

          .add-address-btn {
            align-self: center;
          }

          .addresses-grid {
            grid-template-columns: 1fr;
          }

          .address-actions {
            flex-direction: column;
          }

          .action-btn span {
            display: none;
          }

          .action-btn {
            padding: 12px;
          }
        }

        @media (max-width: 576px) {
          .header-content h2 {
            font-size: 1.5rem;
          }

          .form-header {
            padding: 16px;
          }

          .form-body {
            padding: 16px;
          }

          .address-body {
            padding: 16px;
          }

          .address-actions {
            padding: 12px 16px;
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}
