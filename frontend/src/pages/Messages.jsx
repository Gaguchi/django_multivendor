import React, { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import { useChatWebSocket } from '../contexts/ChatWebSocketContext';
import { chatAPI } from '../services/chatAPI';
import './Messages.css';

// WhatsApp-like messaging interface for customers

const Messages = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    const { 
        chatRooms, 
        isLoading, 
        error, 
        refresh, 
        markRoomAsRead,
        addNewMessage 
    } = useChatContext();
    
    const { 
        activeRooms,
        isRoomConnected,
        sendMessage: sendWebSocketMessage,
        connectToRoom,
        disconnectFromRoom 
    } = useChatWebSocket();

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);
            markRoomAsRead(selectedChat.id);
            connectToRoom(selectedChat.id);
        }
        return () => {
            if (selectedChat) {
                disconnectFromRoom(selectedChat.id);
            }
        };
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async (roomId) => {
        try {
            setMessagesLoading(true);
            const response = await chatAPI.getMessages(roomId);
            setMessages(response.data.results || response.data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setMessagesLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleChatSelect = (room) => {
        setSelectedChat(room);
    };

    // Filter chat rooms based on search term
    const filteredRooms = chatRooms.filter(room => {
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        const vendorName = getVendorName(room);
        const lastMessage = room.last_message_text || '';
        
        return vendorName.toLowerCase().includes(searchLower) || 
               lastMessage.toLowerCase().includes(searchLower);
    });

    const handleRoomSelect = async (room) => {
        setSelectedChat(room);
        await markRoomAsRead(room.id);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const messageData = {
            content: newMessage.trim(),
            room_id: selectedChat.id,
            sender_type: 'customer'
        };

        try {
            // Send via API
            const response = await chatAPI.sendMessage(selectedChat.id, messageData);
            
            // Add to local state
            setMessages(prev => [...prev, response.data]);
            
            // Send via WebSocket for real-time updates
            sendWebSocketMessage(selectedChat.id, messageData);
            
            // Update room in context
            addNewMessage(selectedChat.id, response.data);
            
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const handleBackToList = () => {
        setSelectedChat(null);
        if (selectedChat) {
            disconnectFromRoom(selectedChat.id);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatLastSeen = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    const getVendorName = (room) => {
        return room.vendor?.business_name || room.vendor?.user?.username || 'Unknown Vendor';
    };

    const getVendorAvatar = (room) => {
        return room.vendor?.logo || room.vendor?.user?.profile_picture || null;
    };

    if (isLoading) {
        return (
            <div className="messages-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading conversations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="messages-container">
                <div className="error-state">
                    <p>Error loading conversations: {error}</p>
                    <button onClick={refresh} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="messages-container">
            {/* Sidebar - Chat List */}
            <div className="messages-sidebar">
                {/* Header */}
                <div className="sidebar-header">
                    <div className="header-content">
                        <h2>Messages</h2>
                        <div className="header-actions">
                            <button className="icon-btn">
                                <i className="fas fa-ellipsis-v"></i>
                            </button>
                        </div>
                    </div>
                    
                    {/* Search */}
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Chat List */}
                <div className="chat-list">
                    {filteredRooms.length === 0 ? (
                        <div className="no-chats">
                            {searchTerm ? 'No conversations match your search' : 'No conversations yet'}
                        </div>
                    ) : (
                        filteredRooms.map((room) => (
                            <div
                                key={room.id}
                                className={`chat-item ${selectedChat?.id === room.id ? 'active' : ''}`}
                                onClick={() => handleChatSelect(room)}
                            >
                                <div className="chat-avatar">
                                    {getVendorAvatar(room) ? (
                                        <img src={getVendorAvatar(room)} alt={getVendorName(room)} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {getVendorName(room).charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="online-indicator"></div>
                                </div>
                                
                                <div className="chat-info">
                                    <div className="chat-header">
                                        <h3 className="chat-name">{getVendorName(room)}</h3>
                                        <span className="chat-time">
                                            {room.last_message_timestamp && formatLastSeen(room.last_message_timestamp)}
                                        </span>
                                    </div>
                                    <div className="chat-preview">
                                        <p className="last-message">
                                            {room.last_message_text || 'No messages yet'}
                                        </p>
                                        {room.unread_by_customer > 0 && (
                                            <span className="unread-count">
                                                {room.unread_by_customer}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="chat-main">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="chat-avatar">
                                    {getVendorAvatar(selectedChat) ? (
                                        <img src={getVendorAvatar(selectedChat)} alt={getVendorName(selectedChat)} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {getVendorName(selectedChat).charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="header-text">
                                    <h3>{getVendorName(selectedChat)}</h3>
                                    <p className="status">
                                        {selectedChat && isRoomConnected(selectedChat.id) ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className="chat-header-actions">
                                <button className="icon-btn">
                                    <i className="fas fa-phone"></i>
                                </button>
                                <button className="icon-btn">
                                    <i className="fas fa-video"></i>
                                </button>
                                <button className="icon-btn">
                                    <i className="fas fa-ellipsis-v"></i>
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="messages-area">
                            {messagesLoading ? (
                                <div className="messages-loading">
                                    <div className="loading-spinner"></div>
                                </div>
                            ) : (
                                <div className="messages-list">
                                    {messages.map((message, index) => (
                                        <div
                                            key={message.id || index}
                                            className={`message ${message.sender_type === 'customer' ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-content">
                                                <div className="message-bubble">
                                                    <p>{message.content}</p>
                                                    <div className="message-meta">
                                                        <span className="message-time">
                                                            {formatTime(message.timestamp)}
                                                        </span>
                                                        {message.sender_type === 'customer' && (
                                                            <div className="message-status">
                                                                <i className="fas fa-check-double"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="message-input-container">
                            <form onSubmit={handleSendMessage} className="message-form">
                                <button type="button" className="attachment-btn">
                                    <i className="fas fa-paperclip"></i>
                                </button>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="message-input"
                                    />
                                    <button type="button" className="emoji-btn">
                                        <i className="fas fa-smile"></i>
                                    </button>
                                </div>
                                <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <div className="welcome-content">
                            <div className="welcome-icon">
                                <i className="fas fa-comments"></i>
                            </div>
                            <h2>Welcome to Messages</h2>
                            <p>Select a conversation to start messaging with vendors</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
