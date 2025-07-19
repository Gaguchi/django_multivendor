import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import './Notifications.css';

export default function Notifications() {
    const { 
        notifications, 
        loading, 
        error, 
        unreadCount,
        markAsRead, 
        markAllAsRead, 
        deleteNotification,
        fetchNotifications 
    } = useNotifications();
    
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [selectedNotifications, setSelectedNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.is_read;
        if (filter === 'read') return notification.is_read;
        return true;
    });

    const handleSelectNotification = (notificationId) => {
        setSelectedNotifications(prev => 
            prev.includes(notificationId) 
                ? prev.filter(id => id !== notificationId)
                : [...prev, notificationId]
        );
    };

    const handleSelectAll = () => {
        if (selectedNotifications.length === filteredNotifications.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(filteredNotifications.map(n => n.id));
        }
    };

    const handleBulkMarkAsRead = async () => {
        for (const notificationId of selectedNotifications) {
            await markAsRead(notificationId);
        }
        setSelectedNotifications([]);
    };

    const handleBulkDelete = async () => {
        for (const notificationId of selectedNotifications) {
            await deleteNotification(notificationId);
        }
        setSelectedNotifications([]);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order_placed': return 'icon-shopping-cart';
            case 'order_shipped': return 'icon-truck';
            case 'order_delivered': return 'icon-check-circle';
            case 'order_cancelled': return 'icon-x-circle';
            case 'payment_received': return 'icon-dollar-sign';
            case 'review_received': return 'icon-star';
            default: return 'icon-bell';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'order_placed': return '#28a745';
            case 'order_shipped': return '#007bff';
            case 'order_delivered': return '#17a2b8';
            case 'order_cancelled': return '#dc3545';
            case 'payment_received': return '#ffc107';
            case 'review_received': return '#fd7e14';
            default: return '#6c757d';
        }
    };

    const breadcrumbItems = [
        { label: 'Dashboard', url: '/' },
        { label: 'Notifications' }
    ];

    if (loading && notifications.length === 0) {
        return (
            <div className="notifications-page">
                <div className="flex items-center justify-between gap20">
                    <div className="flex items-center gap10">
                        <h3>Notifications</h3>
                        <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                            <li>
                                <Link to="/">
                                    <div className="text-tiny">Dashboard</div>
                                </Link>
                            </li>
                            <li>
                                <i className="icon-chevron-right" />
                            </li>
                            <li>
                                <div className="text-tiny">Notifications</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="notifications-loading">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading notifications...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-page">
            {/* Header with Breadcrumb */}
            <div className="flex items-center justify-between gap20">
                <div className="flex items-center gap10">
                    <h3>Notifications</h3>
                    <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                        <li>
                            <Link to="/">
                                <div className="text-tiny">Dashboard</div>
                            </Link>
                        </li>
                        <li>
                            <i className="icon-chevron-right" />
                        </li>
                        <li>
                            <div className="text-tiny">Notifications</div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <div className="notifications-title">
                        <div className="flex items-center gap10">
                            <div className="icon">
                                <i className="icon-bell" />
                            </div>
                            <h5>All Notifications</h5>
                            {unreadCount > 0 && (
                                <span className="badge-item badge-blue">{unreadCount}</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="notifications-actions">
                        <button 
                            className="tf-button style-1 w208"
                            onClick={() => fetchNotifications()}
                            disabled={loading}
                        >
                            <i className="icon-refresh-cw"></i>
                            Refresh
                        </button>
                        
                        {unreadCount > 0 && (
                            <button 
                                className="tf-button style-2 w208"
                                onClick={markAllAsRead}
                                disabled={loading}
                            >
                                Mark All Read
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="wg-filter flex-grow">
                    <div className="show-item">
                        <div className="text-tiny">Filter by:</div>
                        <div className="select">
                            <select 
                                value={filter} 
                                onChange={(e) => setFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All ({notifications.length})</option>
                                <option value="unread">Unread ({unreadCount})</option>
                                <option value="read">Read ({notifications.length - unreadCount})</option>
                            </select>
                        </div>
                    </div>

                    {selectedNotifications.length > 0 && (
                        <div className="bulk-actions flex items-center gap10">
                            <span className="text-tiny">
                                {selectedNotifications.length} selected
                            </span>
                            <button 
                                className="tf-button style-3 w150"
                                onClick={handleBulkMarkAsRead}
                            >
                                <i className="icon-check"></i>
                                Mark Read
                            </button>
                            <button 
                                className="tf-button style-4 w150"
                                onClick={handleBulkDelete}
                            >
                                <i className="icon-trash-2"></i>
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-error">
                        <i className="icon-alert-circle"></i>
                        <span>{error}</span>
                    </div>
                )}

                {/* Notifications List */}
                <div className="wg-table table-notification-list">
                    {filteredNotifications.length === 0 ? (
                        <div className="notifications-empty">
                            <div className="empty-icon">
                                <i className="icon-bell-off"></i>
                            </div>
                            <h6>No notifications</h6>
                            <p className="text-tiny">
                                {filter === 'unread' 
                                    ? "You don't have any unread notifications."
                                    : filter === 'read'
                                    ? "You don't have any read notifications."
                                    : "You don't have any notifications yet."
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <ul className="table-title flex gap20 mb-14">
                                <li style={{ width: '40px' }}>
                                    <div className="body-title">
                                        <label className="checkbox-container">
                                            <input 
                                                type="checkbox"
                                                checked={selectedNotifications.length === filteredNotifications.length}
                                                onChange={handleSelectAll}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                </li>
                                <li style={{ width: '60px' }}>
                                    <div className="body-title">Type</div>
                                </li>
                                <li>
                                    <div className="body-title">Message</div>
                                </li>
                                <li style={{ width: '140px' }}>
                                    <div className="body-title">Time</div>
                                </li>
                                <li style={{ width: '120px' }}>
                                    <div className="body-title">Order</div>
                                </li>
                                <li style={{ width: '80px' }}>
                                    <div className="body-title">Status</div>
                                </li>
                                <li style={{ width: '100px' }}>
                                    <div className="body-title">Action</div>
                                </li>
                            </ul>

                            {/* Table Body */}
                            <div className="divider mb-14"></div>
                            
                            {filteredNotifications.map((notification) => (
                                <ul key={notification.id} className={`table-list notification-row ${!notification.is_read ? 'unread' : ''}`}>
                                    <li style={{ width: '40px' }}>
                                        <label className="checkbox-container">
                                            <input 
                                                type="checkbox"
                                                checked={selectedNotifications.includes(notification.id)}
                                                onChange={() => handleSelectNotification(notification.id)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </li>
                                    <li style={{ width: '60px' }}>
                                        <div className="notification-type-icon">
                                            <i 
                                                className={getNotificationIcon(notification.type)}
                                                style={{ color: getNotificationColor(notification.type) }}
                                            ></i>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="notification-content">
                                            <div className="notification-title-row">
                                                <span className="body-title">{notification.title}</span>
                                                {!notification.is_read && (
                                                    <span className="unread-dot"></span>
                                                )}
                                            </div>
                                            <div className="notification-message text-tiny">
                                                {notification.message}
                                            </div>
                                        </div>
                                    </li>
                                    <li style={{ width: '140px' }}>
                                        <div className="text-tiny">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </div>
                                    </li>
                                    <li style={{ width: '120px' }}>
                                        {notification.order ? (
                                            <Link 
                                                to={`/orders/${notification.order}`}
                                                className="order-link"
                                            >
                                                #{notification.order}
                                            </Link>
                                        ) : (
                                            <span className="text-tiny">-</span>
                                        )}
                                    </li>
                                    <li style={{ width: '80px' }}>
                                        <div className={`block-published ${notification.is_read ? 'published' : 'not-published'}`}>
                                            {notification.is_read ? 'Read' : 'Unread'}
                                        </div>
                                    </li>
                                    <li style={{ width: '100px' }}>
                                        <div className="list-icon-function">
                                            {!notification.is_read && (
                                                <div className="item edit">
                                                    <button 
                                                        onClick={() => markAsRead(notification.id)}
                                                        title="Mark as read"
                                                        className="icon-btn"
                                                    >
                                                        <i className="icon-check"></i>
                                                    </button>
                                                </div>
                                            )}
                                            <div className="item trash">
                                                <button 
                                                    onClick={() => deleteNotification(notification.id)}
                                                    title="Delete notification"
                                                    className="icon-btn"
                                                >
                                                    <i className="icon-trash-2"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
