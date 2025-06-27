import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function OrdersList({ filter }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construct query parameters based on filter
        let endpoint = '/api/orders/';
        if (filter === 'recent') {
          endpoint += '?limit=5';
        } else if (filter === 'returns') {
          endpoint += '?status=returned';
        }
        
        const response = await api.get(endpoint);
        
        // Handle different response formats
        const ordersList = Array.isArray(response.data) 
          ? response.data 
          : (response.data.results || []);
        
        setOrders(ordersList);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter]);

  // Helper function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge badge-success';
      case 'processing':
        return 'badge badge-primary';
      case 'pending':
        return 'badge badge-warning';
      case 'shipped':
        return 'badge badge-info';
      case 'cancelled':
        return 'badge badge-danger';
      case 'returned':
        return 'badge badge-secondary';
      default:
        return 'badge badge-light';
    }
  };

  // Format date to localized string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <i className="icon-exclamation-triangle"></i>
        <div className="alert-content">
          <h4>Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <i className="icon-bag"></i>
        </div>
        <h3>No orders found</h3>
        <p>
          {filter === 'returns' 
            ? "You haven't made any returns yet." 
            : "You haven't placed any orders yet."}
        </p>
        <Link to="/shop" className="primary-btn">
          <i className="icon-handbag"></i>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-list">
      <div className="orders-header">
        <h2>
          {filter === 'recent' ? 'Recent Orders' : 
           filter === 'returns' ? 'Returns & Refunds' : 'My Orders'}
        </h2>
        <p>
          {filter === 'recent' ? 'Your 5 most recent orders' :
           filter === 'returns' ? 'Track your returns and refund status' : 
           'All your order history'}
        </p>
      </div>

      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order {order.order_number || `#${order.id}`}</h3>
                <p className="order-date">{formatDate(order.created_at)}</p>
              </div>
              <div className={`status-badge ${order.status.toLowerCase()}`}>
                <i className={getStatusIcon(order.status)}></i>
                <span>{order.status}</span>
              </div>
            </div>
            
            <div className="order-body">
              <div className="order-total">
                <span className="label">Total Amount</span>
                <span className="amount">${parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
              
              {order.items && order.items.length > 0 && (
                <div className="order-items">
                  <span className="label">Items ({order.items.length})</span>
                  <div className="items-preview">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="item-preview">
                        {item.product_image ? (
                          <img src={item.product_image} alt={item.product_name} />
                        ) : (
                          <div className="item-placeholder">
                            <i className="icon-image"></i>
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="order-actions">
              <Link 
                to={`/account/orders/${order.id}`} 
                className="view-btn"
              >
                <i className="icon-eye"></i>
                <span>View Details</span>
              </Link>
              
              {order.status.toLowerCase() === 'delivered' && (
                <button className="action-btn secondary">
                  <i className="icon-refresh"></i>
                  <span>Reorder</span>
                </button>
              )}
              
              {['pending', 'processing'].includes(order.status.toLowerCase()) && (
                <button className="action-btn danger">
                  <i className="icon-close"></i>
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Orders List Styles */}
      <style jsx>{`
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
          text-decoration: none;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
          text-decoration: none;
          color: white;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .orders-header h2 {
          margin: 0 0 8px 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .orders-header p {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
        }

        .orders-grid {
          display: grid;
          gap: 20px;
        }

        .order-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .order-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%);
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .order-info h3 {
          margin: 0 0 4px 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }

        .order-date {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.processing {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.shipped {
          background: #e0e7ff;
          color: #3730a3;
        }

        .status-badge.cancelled {
          background: #fee2e2;
          color: #dc2626;
        }

        .status-badge.returned {
          background: #f3f4f6;
          color: #374151;
        }

        .order-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-total .label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .order-total .amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }

        .order-items .label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 12px;
          display: block;
        }

        .items-preview {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .item-preview {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          overflow: hidden;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-placeholder {
          color: #9ca3af;
          font-size: 16px;
        }

        .more-items {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
        }

        .order-actions {
          padding: 16px 24px;
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 12px;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          justify-content: center;
        }

        .view-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          text-decoration: none;
          color: white;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          justify-content: center;
        }

        .action-btn.secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .action-btn.secondary:hover {
          background: #e5e7eb;
        }

        .action-btn.danger {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn.danger:hover {
          background: #fecaca;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .orders-header h2 {
            font-size: 1.5rem;
          }

          .order-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .order-body {
            padding: 16px;
          }

          .order-actions {
            padding: 12px 16px;
            flex-direction: column;
          }

          .action-btn span,
          .view-btn span {
            display: none;
          }

          .action-btn,
          .view-btn {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );

  // Helper function to get status icon
  function getStatusIcon(status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'icon-check';
      case 'processing':
        return 'icon-cog';
      case 'pending':
        return 'icon-clock';
      case 'shipped':
        return 'icon-truck';
      case 'cancelled':
        return 'icon-close';
      case 'returned':
        return 'icon-refresh';
      default:
        return 'icon-info';
    }
  }
}
