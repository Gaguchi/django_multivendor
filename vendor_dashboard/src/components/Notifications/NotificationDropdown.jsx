import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useWebSocket } from '../../contexts/WebSocketContext';

const NotificationDropdown = () => {
    const {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        dismissNotificationById,
        clearError
    } = useNotifications();
    
    const { lastMessage, connectionState } = useWebSocket();
    const [hasNewNotification, setHasNewNotification] = useState(false);

    // Debug logging for notifications
    useEffect(() => {
        console.log('[NotificationDropdown] Notifications updated:', notifications.length, 'notifications');
        console.log('[NotificationDropdown] Unread count:', unreadCount);
    }, [notifications, unreadCount]);

    // Watch for new WebSocket notifications
    useEffect(() => {
        console.log('[NotificationDropdown] WebSocket message received:', lastMessage);
        if (lastMessage?.type === 'new_notification') {
            setHasNewNotification(true);
            // Auto-clear the indicator after 5 seconds
            const timer = setTimeout(() => {
                setHasNewNotification(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [lastMessage]);

    // Handle notification click
    const handleNotificationClick = async (notification) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }
        
        // Clear new notification indicator when dropdown is used
        setHasNewNotification(false);
        
        // Navigate to related page if applicable
        if (notification.related_order) {
            // You can add navigation logic here
            console.log('Navigate to order:', notification.related_order);
        }
    };

    // Handle mark all as read
    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    // Handle dismiss notification
    const handleDismissNotification = async (notificationId, event) => {
        event.stopPropagation();
        await dismissNotificationById(notificationId);
    };

    // Get notification icon based on type - using the exact icon classes from your HTML
    const getNotificationIcon = (type) => {
        const iconMap = {
            'order_created': 'icon-noti-1',
            'order_paid': 'icon-noti-2',
            'order_shipped': 'icon-noti-3',
            'order_delivered': 'icon-noti-4',
            'order_cancelled': 'icon-noti-1',
            'payment_cleared': 'icon-noti-2',
            'dispute_raised': 'icon-noti-1',
            'product_low_stock': 'icon-noti-4',
            'product_out_of_stock': 'icon-noti-1',
            'review_received': 'icon-noti-3',
            'system_announcement': 'icon-noti-2'
        };
        return iconMap[type] || 'icon-noti-1';
    };

    // Format time ago
    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInHours = (now - time) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInHours * 60);
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInHours / 24);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        }
    };

    // Filter to show only unread notifications and limit to 5
    const unreadNotifications = notifications
        .filter(notification => !notification.is_read)
        .slice(0, 5);

    return (
        <div className="popup-wrap message type-header">
            <div className="dropdown">
                <button 
                    className="btn btn-secondary dropdown-toggle" 
                    type="button" 
                    id="dropdownMenuButton2" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    onClick={() => setHasNewNotification(false)}
                >
                    <span className="header-item">
                        <span className="text-tiny">{unreadCount}</span>
                        <i className={`icon-bell ${hasNewNotification ? 'animate-pulse' : ''}`}></i>
                        {hasNewNotification && (
                            <span 
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: '#ff6b6b',
                                    borderRadius: '50%',
                                    animation: 'pulse 1s infinite'
                                }}
                            ></span>
                        )}
                        {/* Connection status indicator */}
                        {connectionState === 'connected' && (
                            <span 
                                title="Real-time notifications active"
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: '6px',
                                    height: '6px',
                                    backgroundColor: '#28a745',
                                    borderRadius: '50%'
                                }}
                            ></span>
                        )}
                    </span>
                </button>
                <ul 
                    className="dropdown-menu dropdown-menu-end has-content" 
                    aria-labelledby="dropdownMenuButton2"
                >
                    <li>
                        <h6>Notifications</h6>
                    </li>
                    
                    {/* Loading state */}
                    {loading && (
                        <li>
                            <div className="message-item item-1">
                                <div className="image">
                                    <i className="icon-noti-1"></i>
                                </div>
                                <div>
                                    <div className="body-title-2">Loading notifications</div>
                                    <div className="text-tiny">Fetching your latest notifications</div>
                                </div>
                            </div>
                        </li>
                    )}
                    
                    {/* Error state */}
                    {error && (
                        <li>
                            <div className="message-item item-1">
                                <div className="image">
                                    <i className="icon-noti-1"></i>
                                </div>
                                <div>
                                    <div className="body-title-2">Error loading notifications</div>
                                    <div className="text-tiny">{error}</div>
                                </div>
                            </div>
                        </li>
                    )}
                    
                    {/* Empty state */}
                    {unreadNotifications.length === 0 && !loading && !error && (
                        <li>
                            <div className="message-item item-1">
                                <div className="image">
                                    <i className="icon-noti-1"></i>
                                </div>
                                <div>
                                    <div className="body-title-2">No unread notifications</div>
                                    <div className="text-tiny">You're all caught up!</div>
                                </div>
                            </div>
                        </li>
                    )}
                    
                    {/* Notifications - showing only unread, max 5 */}
                    {unreadNotifications.map((notification, index) => (
                        <li key={notification.id}>
                            <div 
                                className={`message-item item-${(index % 4) + 1}`}
                                onClick={() => handleNotificationClick(notification)}
                                style={{ cursor: 'pointer', position: 'relative' }}
                            >
                                <div className="image">
                                    <i className={getNotificationIcon(notification.notification_type)}></i>
                                </div>
                                <div>
                                    <div className="body-title-2">
                                        {notification.title}
                                        {/* Since we're only showing unread, all will have the blue dot */}
                                        <span style={{ 
                                            display: 'inline-block', 
                                            width: '8px', 
                                            height: '8px', 
                                            backgroundColor: '#007bff', 
                                            borderRadius: '50%', 
                                            marginLeft: '8px' 
                                        }}></span>
                                    </div>
                                    <div className="text-tiny">
                                        {notification.message}
                                    </div>
                                    {/* Time ago */}
                                    <div className="text-tiny" style={{ opacity: 0.7, fontSize: '11px', marginTop: '4px' }}>
                                        {notification.time_ago || formatTimeAgo(notification.created_at)}
                                    </div>
                                </div>
                                
                                {/* Dismiss button */}
                                <button
                                    onClick={(e) => handleDismissNotification(notification.id, e)}
                                    title="Dismiss"
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        padding: '2px 6px',
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: '12px',
                                        opacity: 0.6
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        </li>
                    ))}
                    
                    {/* Mark all as read button */}
                    {unreadCount > 0 && unreadNotifications.length > 0 && (
                        <li>
                            <a href="#" className="tf-button w-full" onClick={(e) => {
                                e.preventDefault();
                                handleMarkAllAsRead();
                            }}>
                                Mark all as read
                            </a>
                        </li>
                    )}
                    
                    {/* View all button - using exact structure from your HTML */}
                    <li>
                        <a href="#" className="tf-button w-full" onClick={(e) => {
                            e.preventDefault();
                            console.log('Navigate to notifications page');
                        }}>
                            View all
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NotificationDropdown;
