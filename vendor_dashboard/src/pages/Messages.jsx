import React, { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { getChatMessages, sendMessage as sendMessageAPI, markMessagesAsRead } from '../services/chatAPI';
import './Messages.css';

// WhatsApp-like messaging component

const Messages = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    const { 
        chatRooms, 
        isLoading, 
        fetchChatRooms, 
        markRoomAsRead 
    } = useChatContext();
    
    const { 
        isConnected, 
        sendMessage: sendWebSocketMessage 
    } = useWebSocket();

    useEffect(() => {
        fetchChatRooms();
    }, [fetchChatRooms]);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);
            markRoomAsRead(selectedChat.id);
        }
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async (roomId) => {
        try {
            setMessagesLoading(true);
            const response = await getChatMessages(roomId);
            setMessages(response.results || []);
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

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            setIsConnecting(true);
            const messageData = {
                chat_id: selectedChat.id,
                content: newMessage.trim(),
                sender_id: 'current_user' // Replace with actual user ID
            };

            // Send via WebSocket if connected
            if (isConnected) {
                sendWebSocketMessage('new_message', messageData);
            }

            // Send via API
            await sendMessageAPI(selectedChat.id, newMessage.trim());
            
            // Refresh messages after sending
            await fetchMessages(selectedChat.id);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const filteredChats = chatRooms.filter(chat =>
        (chat.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.customer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getCustomerDisplayName = (room) => {
        return room.customer?.first_name && room.customer?.last_name 
            ? `${room.customer.first_name} ${room.customer.last_name}`
            : room.customer?.username || room.customer?.email || 'Unknown Customer';
    };

    const formatLastSeen = (timestamp) => {
        if (!timestamp) return 'Offline';
        const now = new Date();
        const lastSeen = new Date(timestamp);
        const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Online';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return lastSeen.toLocaleDateString();
    };

    return (
        <div className="messages-container">
            {/* Sidebar */}
            <div className="messages-sidebar">
                <div className="sidebar-header">
                    <div className="header-content">
                        <h2>Messages</h2>
                        <div className="header-actions">
                            <button className="icon-btn" title="New chat">
                                <i className="icon-edit"></i>
                            </button>
                            <button className="icon-btn" title="Settings">
                                <i className="icon-settings"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <i className="icon-search"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="chat-list">
                    {isLoading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading conversations...</p>
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="empty-state">
                            <i className="icon-message-circle"></i>
                            <h3>No conversations</h3>
                            <p>Start a new conversation to begin messaging</p>
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                                onClick={() => handleChatSelect(chat)}
                            >
                                <div className="chat-avatar">
                                    <img 
                                        src={chat.customer?.avatar || '/api/placeholder/48/48'} 
                                        alt={getCustomerDisplayName(chat)}
                                    />
                                    {chat.customer?.is_online && <div className="online-indicator"></div>}
                                </div>
                                
                                <div className="chat-content">
                                    <div className="chat-header">
                                        <h3 className="chat-name">{getCustomerDisplayName(chat)}</h3>
                                        <span className="chat-time">
                                            {chat.last_message_timestamp && formatTime(chat.last_message_timestamp)}
                                        </span>
                                    </div>
                                    
                                    <div className="chat-preview">
                                        <p className="last-message">
                                            {chat.last_message || 'No messages yet'}
                                        </p>
                                        {chat.unread_by_vendor > 0 && (
                                            <span className="unread-badge">{chat.unread_by_vendor}</span>
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
                        <div className="chat-header-bar">
                            <div className="chat-info">
                                <div className="chat-avatar">
                                    <img 
                                        src={selectedChat.customer?.avatar || '/api/placeholder/48/48'} 
                                        alt={getCustomerDisplayName(selectedChat)}
                                    />
                                    {selectedChat.customer?.is_online && <div className="online-indicator"></div>}
                                </div>
                                <div className="chat-details">
                                    <h3>{getCustomerDisplayName(selectedChat)}</h3>
                                    <div className="status">
                                        {selectedChat.customer?.is_online ? 'Online' : formatLastSeen(selectedChat.customer?.last_seen)}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="chat-actions">
                                <button className="icon-btn" title="Search in chat">
                                    <i className="icon-search"></i>
                                </button>
                                <button className="icon-btn" title="Chat info">
                                    <i className="icon-info"></i>
                                </button>
                                <button className="icon-btn" title="More options">
                                    <i className="icon-more-vertical"></i>
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="messages-area">
                            <div className="messages-list">
                                {messages.length === 0 ? (
                                    <div className="empty-state">
                                        <i className="icon-message-circle"></i>
                                        <h3>Start the conversation</h3>
                                        <p>Send a message to begin your chat with {getCustomerDisplayName(selectedChat)}</p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`message ${message.is_sent ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-content">
                                                <p>{message.content}</p>
                                                <div className="message-meta">
                                                    <span className="message-time">
                                                        {formatTime(message.timestamp)}
                                                    </span>
                                                    {message.is_sent && (
                                                        <div className={`message-status ${message.is_read ? 'read' : 'delivered'}`}>
                                                            <i className={message.is_read ? 'icon-check-double' : 'icon-check'}></i>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="message-input-area">
                                <form onSubmit={handleSendMessage} className="input-container">
                                    <button type="button" className="icon-btn attachment-btn" title="Attach file">
                                        <i className="icon-paperclip"></i>
                                    </button>
                                    
                                    <div className="message-input-wrapper">
                                        <textarea
                                            className="message-input"
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                            rows="1"
                                        />
                                        <button type="button" className="icon-btn emoji-btn" title="Emoji">
                                            <i className="icon-smile"></i>
                                        </button>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="send-btn"
                                        disabled={!newMessage.trim() || isConnecting}
                                        title="Send message"
                                    >
                                        <i className="icon-send"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Welcome Screen */
                    <div className="chat-welcome">
                        <div className="welcome-content">
                            <div className="welcome-icon">
                                <i className="icon-message-circle"></i>
                            </div>
                            <h2>Welcome to Messages</h2>
                            <p>Select a conversation from the sidebar to start messaging with your customers and vendors.</p>
                            
                            <div className="welcome-features">
                                <div className="feature">
                                    <i className="icon-zap"></i>
                                    <span>Real-time messaging</span>
                                </div>
                                <div className="feature">
                                    <i className="icon-bell"></i>
                                    <span>Instant notifications</span>
                                </div>
                                <div className="feature">
                                    <i className="icon-shield"></i>
                                    <span>Secure communication</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Connection Status */}
            {!isConnected && (
                <div className="connection-status">
                    <i className="icon-wifi-off"></i>
                    <span>Connecting...</span>
                </div>
            )}
        </div>
    );
};

export default Messages;
