import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChatContext } from '../contexts/ChatContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { formatDistanceToNow } from 'date-fns';
import './Messages.css';

export default function Messages() {
    const {
        chatRooms,
        unreadCount,
        isLoading,
        error,
        fetchChatRooms,
        markRoomAsRead,
        refresh
    } = useChatContext();
    
    const { isConnected } = useWebSocket();
    const [filter, setFilter] = useState('all');
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [newMessageIds, setNewMessageIds] = useState(new Set());

    // Fetch messages on component mount
    useEffect(() => {
        fetchChatRooms();
    }, [fetchChatRooms]);

    // Filter messages based on selected filter
    const filteredRooms = chatRooms.filter(room => {
        if (filter === 'unread') return room.unread_by_vendor > 0;
        if (filter === 'read') return room.unread_by_vendor === 0;
        return true;
    });

    // Handle select all/none
    const handleSelectAll = () => {
        if (selectedRooms.length === filteredRooms.length) {
            setSelectedRooms([]);
        } else {
            setSelectedRooms(filteredRooms.map(room => room.id));
        }
    };

    // Handle individual room selection
    const handleSelectRoom = (roomId) => {
        setSelectedRooms(prev => 
            prev.includes(roomId) 
                ? prev.filter(id => id !== roomId)
                : [...prev, roomId]
        );
    };

    // Handle bulk mark as read
    const handleBulkMarkAsRead = async () => {
        for (const roomId of selectedRooms) {
            await markRoomAsRead(roomId);
        }
        setSelectedRooms([]);
    };

    // Get room status color based on unread messages
    const getRoomStatusColor = (hasUnread) => {
        return hasUnread ? '#28a745' : '#6c757d';
    };

    // Get customer display name
    const getCustomerDisplayName = (room) => {
        return room.customer?.first_name && room.customer?.last_name 
            ? `${room.customer.first_name} ${room.customer.last_name}`
            : room.customer?.username || 'Unknown Customer';
    };

    // Format last message timestamp
    const formatLastMessageTime = (timestamp) => {
        if (!timestamp) return 'No messages';
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };

    // Truncate message for display
    const truncateMessage = (message, maxLength = 60) => {
        if (!message) return 'No messages yet';
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + '...';
    };

    if (isLoading && chatRooms.length === 0) {
        return (
            <div className="messages-page">
                <div className="flex items-center justify-between gap20">
                    <div className="flex items-center gap10">
                        <h3>Messages</h3>
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
                                <div className="text-tiny">Messages</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="messages-loading">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading messages...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="messages-page">
            {/* Header with Breadcrumb */}
            <div className="flex items-center justify-between gap20">
                <div className="flex items-center gap10">
                    <h3>Messages</h3>
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
                            <div className="text-tiny">Messages</div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <div className="messages-title">
                        <div className="flex items-center gap10">
                            <div className="icon">
                                <i className="icon-message-square" />
                            </div>
                            <h5>All Messages</h5>
                            {unreadCount > 0 && (
                                <span className="badge-item badge-blue">{unreadCount}</span>
                            )}
                            {/* WebSocket Status Indicator */}
                            <div className={`websocket-status ${isConnected ? 'connected' : 'disconnected'}`} 
                                 title={isConnected ? 'Real-time messages connected' : 'Real-time messages disconnected'}>
                                <i className={`icon-${isConnected ? 'wifi' : 'wifi-off'}`}></i>
                            </div>
                        </div>
                    </div>
                    
                    <div className="messages-actions">
                        <button 
                            className="tf-button style-1 w208"
                            onClick={() => refresh()}
                            disabled={isLoading}
                        >
                            <i className="icon-refresh-cw"></i>
                            Refresh
                        </button>
                        
                        {unreadCount > 0 && selectedRooms.length === 0 && (
                            <button 
                                className="tf-button style-2 w208"
                                onClick={handleBulkMarkAsRead}
                                disabled={isLoading}
                            >
                                <i className="icon-check"></i>
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
                                <option value="all">All ({chatRooms.length})</option>
                                <option value="unread">Unread ({unreadCount})</option>
                                <option value="read">Read ({chatRooms.length - unreadCount})</option>
                            </select>
                        </div>
                    </div>

                    {selectedRooms.length > 0 && (
                        <div className="bulk-actions flex items-center gap10">
                            <span className="text-tiny">
                                {selectedRooms.length} selected
                            </span>
                            <button 
                                className="tf-button style-3 w150"
                                onClick={handleBulkMarkAsRead}
                            >
                                <i className="icon-check"></i>
                                Mark Read
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

                {/* Messages List */}
                <div className="wg-table table-message-list">
                    {filteredRooms.length === 0 ? (
                        <div className="messages-empty">
                            <div className="empty-icon">
                                <i className="icon-message-circle-off"></i>
                            </div>
                            <h6>No conversations</h6>
                            <p className="text-tiny">
                                {filter === 'unread' 
                                    ? "You don't have any unread conversations."
                                    : filter === 'read'
                                    ? "You don't have any read conversations."
                                    : "You don't have any conversations yet."
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
                                                checked={selectedRooms.length === filteredRooms.length}
                                                onChange={handleSelectAll}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                </li>
                                <li style={{ width: '60px' }}>
                                    <div className="body-title">Avatar</div>
                                </li>
                                <li>
                                    <div className="body-title">Customer</div>
                                </li>
                                <li style={{ width: '200px' }}>
                                    <div className="body-title">Last Message</div>
                                </li>
                                <li style={{ width: '140px' }}>
                                    <div className="body-title">Time</div>
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
                            
                            {filteredRooms.map((room) => (
                                <ul key={room.id} className={`table-list message-row ${room.unread_by_vendor > 0 ? 'unread' : ''} ${newMessageIds.has(room.id) ? 'new-message' : ''}`}>
                                    <li style={{ width: '40px' }}>
                                        <label className="checkbox-container">
                                            <input 
                                                type="checkbox"
                                                checked={selectedRooms.includes(room.id)}
                                                onChange={() => handleSelectRoom(room.id)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </li>
                                    <li style={{ width: '60px' }}>
                                        <div className="customer-avatar">
                                            {room.customer?.avatar ? (
                                                <img 
                                                    src={room.customer.avatar} 
                                                    alt={getCustomerDisplayName(room)}
                                                    className="avatar-img"
                                                />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {getCustomerDisplayName(room).charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                    <li>
                                        <div className="message-content">
                                            <div className="customer-title-row">
                                                <span className="body-title">{getCustomerDisplayName(room)}</span>
                                                {room.unread_by_vendor > 0 && (
                                                    <span className="unread-count">{room.unread_by_vendor}</span>
                                                )}
                                            </div>
                                            <div className="customer-email text-tiny">
                                                {room.customer?.email || 'No email'}
                                            </div>
                                        </div>
                                    </li>
                                    <li style={{ width: '200px' }}>
                                        <div className="last-message text-tiny">
                                            {truncateMessage(room.last_message)}
                                        </div>
                                    </li>
                                    <li style={{ width: '140px' }}>
                                        <div className="text-tiny">
                                            {formatLastMessageTime(room.last_message_timestamp)}
                                        </div>
                                    </li>
                                    <li style={{ width: '80px' }}>
                                        <div className={`block-published ${room.unread_by_vendor > 0 ? 'not-published' : 'published'}`}>
                                            {room.unread_by_vendor > 0 ? 'Unread' : 'Read'}
                                        </div>
                                    </li>
                                    <li style={{ width: '100px' }}>
                                        <div className="list-icon-function">
                                            <div className="item edit">
                                                <Link 
                                                    to={`/messages/${room.id}`}
                                                    title="Open conversation"
                                                    className="icon-btn"
                                                >
                                                    <i className="icon-message-square"></i>
                                                </Link>
                                            </div>
                                            {room.unread_by_vendor > 0 && (
                                                <div className="item edit">
                                                    <button 
                                                        onClick={() => markRoomAsRead(room.id)}
                                                        title="Mark as read"
                                                        className="icon-btn"
                                                    >
                                                        <i className="icon-check"></i>
                                                    </button>
                                                </div>
                                            )}
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
