import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FiSend, 
  FiPhone, 
  FiMoreVertical, 
  FiUser,
  FiCircle,
  FiArrowLeft
} from 'react-icons/fi';

const ChatInterface = ({ roomId, onClose, className = '' }) => {
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bazro.ge';

  // Get auth token for API calls
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  };

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load chat room and messages
  useEffect(() => {
    const loadChatData = async () => {
      try {
        setLoading(true);
        
        // Load chat room details
        const roomResponse = await fetch(`${API_BASE_URL}/api/chat/api/rooms/${roomId}/`, {
          headers: getAuthHeaders()
        });
        
        if (roomResponse.ok) {
          const roomData = await roomResponse.json();
          setChatRoom(roomData);
        }

        // Load messages
        const messagesResponse = await fetch(
          `${API_BASE_URL}/api/chat/api/messages/?chat_room=${roomId}`,
          { headers: getAuthHeaders() }
        );
        
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData.results || messagesData || []);
        }
        
      } catch (error) {
        console.error('Error loading chat data:', error);
        setError('Failed to load chat data');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      loadChatData();
    }
  }, [roomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/api/messages/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          chat_room: roomId,
          content: messageText
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const messageData = await response.json();
      setMessages(prev => [...prev, messageData]);
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message on error
      setError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUser className="w-5 h-5 text-blue-600" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {chatRoom?.participant_name || 'Chat'}
              </h3>
              <p className="text-xs text-green-600 flex items-center">
                <FiCircle className="w-2 h-2 mr-1 fill-current" />
                Online
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiPhone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiMoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100 border-b border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiUser className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">Start the conversation by sending a message.</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.is_own_message ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.is_own_message
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.is_own_message ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={sendMessage} className="flex space-x-3">
          <input
            ref={messageInputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={sendingMessage}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sendingMessage}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {sendingMessage ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiSend className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
