import { useState, useEffect } from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';

export default function RealTimeNotifications() {
  const { orderUpdates, clearOrderUpdates } = useWebSocket();
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Process new order updates into notifications
  useEffect(() => {
    if (orderUpdates.length > 0) {
      const latestUpdate = orderUpdates[0];
      
      let message = '';
      let type = 'info';
      
      if (latestUpdate.type === 'new_order') {
        message = `New order received: ${latestUpdate.orderNumber}`;
        type = 'success';
      } else if (latestUpdate.orderNumber && latestUpdate.status) {
        message = `Order ${latestUpdate.orderNumber} status updated to ${latestUpdate.status}`;
        type = 'info';
      }
      
      if (message) {
        const notification = {
          id: Date.now() + Math.random(),
          message,
          type,
          timestamp: new Date(),
          orderNumber: latestUpdate.orderNumber
        };
        
        setNotifications(prev => [notification, ...prev].slice(0, 5)); // Keep last 5
        setIsVisible(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
      }
    }
  }, [orderUpdates]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="position-fixed" style={{ top: '80px', right: '20px', zIndex: 1050 }}>
      {/* Toggle button */}
      <button
        className="btn btn-primary btn-sm mb-2 shadow"
        onClick={toggleVisibility}
        title={isVisible ? 'Hide notifications' : 'Show notifications'}
      >
        <i className={`bi ${isVisible ? 'bi-bell-slash' : 'bi-bell'} me-1`}></i>
        {notifications.length}
      </button>

      {/* Notifications */}
      {isVisible && (
        <div className="card shadow" style={{ minWidth: '300px', maxWidth: '400px' }}>
          <div className="card-header d-flex justify-content-between align-items-center py-2">
            <small className="fw-bold">Real-time Updates</small>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setNotifications([]);
                clearOrderUpdates();
              }}
              title="Clear all"
            >
              <i className="bi bi-trash3"></i>
            </button>
          </div>
          <div className="card-body p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`alert alert-${notification.type === 'success' ? 'success' : 'info'} alert-dismissible mb-0 rounded-0 border-0`}
                style={{ fontSize: '0.875rem' }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="fw-bold">{notification.message}</div>
                    <small className="text-muted">
                      {notification.timestamp.toLocaleTimeString()}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-sm"
                    onClick={() => dismissNotification(notification.id)}
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
