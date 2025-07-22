import React, { useState } from 'react';
import { useChatContext } from '../contexts/ChatContext';

const MessageDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { chatRooms, unreadCount, isLoading, error, fetchChatRooms } = useChatContext();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Refresh messages when opening dropdown
            fetchChatRooms();
        }
    };

    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return messageTime.toLocaleDateString();
    };

    const truncateMessage = (message, maxLength = 50) => {
        if (!message) return 'No messages yet';
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + '...';
    };

    const getCustomerDisplayName = (room) => {
        return room.customer?.first_name && room.customer?.last_name 
            ? `${room.customer.first_name} ${room.customer.last_name}`
            : room.customer?.username || 'Unknown Customer';
    };

    return (
        <div className="popup-wrap message type-header">
            <div className="dropdown">
                <button 
                    className="btn btn-secondary dropdown-toggle" 
                    type="button" 
                    id="dropdownMenuButton2" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="header-item">
                        <span className="text-tiny">{unreadCount}</span>
                        <i className="icon-message-square"></i>
                    </span>
                </button>
                
                <ul 
                    className="dropdown-menu dropdown-menu-end has-content" 
                    aria-labelledby="dropdownMenuButton2"
                >
                    <li>
                        <h6>Messages</h6>
                    </li>
                    
                    {/* Loading state */}
                    {isLoading && (
                        <li>
                            <div className="message-item item-1">
                                <div className="image">
                                    <i className="icon-message-square"></i>
                                </div>
                                <div>
                                    <div className="body-title-2">Loading messages</div>
                                    <div className="text-tiny">Fetching your latest messages</div>
                                </div>
                            </div>
                        </li>
                    )}
                    
                    {/* Error state */}
                    {error && (
                        <li>
                            <div className="message-item item-1">
                                <div className="image">
                                    <i className="icon-alert-circle"></i>
                                </div>
                                <div>
                                    <div className="body-title-2">Error loading messages</div>
                                    <div className="text-tiny">{error}</div>
                                </div>
                            </div>
                        </li>
                    )}
                    
                    {/* Empty state */}
                    {chatRooms.length === 0 && !isLoading && !error && (
                        <li>
                            <div className="message-item item-1">
                                <div className="image">
                                    <i className="icon-message-square"></i>
                                </div>
                                <div>
                                    <div className="body-title-2">No messages yet</div>
                                    <div className="text-tiny">Customer messages will appear here</div>
                                </div>
                            </div>
                        </li>
                    )}
                    
                    {/* Messages - showing only rooms with unread messages, max 5 */}
                    {chatRooms.filter(room => room.unread_by_vendor > 0).slice(0, 5).map((room, index) => (
                        <li key={room.id}>
                            <div 
                                className={`message-item item-${(index % 4) + 1}`}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="image">
                                    {room.customer?.avatar ? (
                                        <img src={room.customer.avatar} alt={getCustomerDisplayName(room)} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {getCustomerDisplayName(room).charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="body-title-2">
                                        {getCustomerDisplayName(room)}
                                        {/* Unread count indicator */}
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
                                        {truncateMessage(room.last_message)}
                                    </div>
                                    {/* Time ago */}
                                    <div className="text-tiny" style={{ opacity: 0.7, fontSize: '11px', marginTop: '4px' }}>
                                        {formatTimeAgo(room.last_message_timestamp)}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    
                    {/* View all button */}
                    <li>
                        <a href="/messages" className="tf-button w-full">
                            View all
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MessageDropdown;
