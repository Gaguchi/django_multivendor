import React, { useState } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const ChatButton = ({ vendorId, vendorName }) => {
  const authValue = useAuth();
  const { user, isAuthenticated } = authValue;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  console.log('ChatButton: Auth value debug', { 
    authValue,
    user: user ? 'present' : 'null', 
    isAuthenticated,
    typeof_isAuthenticated: typeof isAuthenticated,
    userId: user?.id,
    vendorId,
    vendorName 
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bazro.ge';

  // Get auth token for API calls
  const getAuthHeaders = () => {
    const authTokensStr = localStorage.getItem('authTokens');
    let token = null;
    
    if (authTokensStr) {
      try {
        const authTokens = JSON.parse(authTokensStr);
        token = authTokens.access;
      } catch (e) {
        console.error('ChatButton: Error parsing auth tokens:', e);
      }
    }
    
    console.log('ChatButton: Getting auth headers', { token: token ? 'present' : 'missing' });
    return token ? { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  };

  const openChat = async () => {
    console.log('ChatButton: openChat called', { isAuthenticated, vendorId, vendorName });
    
    if (!isAuthenticated) {
      setError('Please login to start a chat');
      console.log('ChatButton: User not authenticated');
      return;
    }

    if (!vendorId) {
      setError('Vendor ID is required');
      console.log('ChatButton: No vendor ID provided');
      return;
    }

    setIsLoading(true);
    setError('');
    
    console.log('ChatButton: Making API call to create chat room');
    
    try {
      // Create or get existing chat room using fetch
      const url = `${API_BASE_URL}/api/chat/api/rooms/`;
      const headers = getAuthHeaders();
      const body = JSON.stringify({ vendor_id: vendorId });
      
      console.log('ChatButton: API request details', { url, headers, body });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
      });
      
      console.log('ChatButton: Response status', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('ChatButton: API error', { status: response.status, errorText });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const roomData = await response.json();
      console.log('ChatButton: Room data received', roomData);
      setChatRoom(roomData);
      
      // Load existing messages
      console.log('ChatButton: Loading messages for room', roomData.id);
      const messagesResponse = await fetch(
        `${API_BASE_URL}/api/chat/api/messages/?chat_room=${roomData.id}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );
      
      console.log('ChatButton: Messages response status', messagesResponse.status);
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        console.log('ChatButton: Messages data received', messagesData);
        setMessages(messagesData.results || messagesData || []);
      } else {
        console.log('ChatButton: Failed to load messages, but continuing');
      }
      
      setIsOpen(true);
      console.log('ChatButton: Chat opened successfully');
    } catch (error) {
      console.error('ChatButton: Error opening chat:', error);
      setError(`Failed to open chat: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatRoom) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/api/messages/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          chat_room: chatRoom.id,
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
      setError('Failed to send message. Please try again.');
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setChatRoom(null);
    setMessages([]);
    setError('');
  };

  if (!isOpen) {
    return (
      <div className="relative">
        <button
          onClick={() => {
            console.log('ChatButton: Button clicked!', { vendorId, vendorName, isAuthenticated });
            openChat();
          }}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiMessageCircle className="w-4 h-4 mr-2" />
          {isLoading ? 'Opening...' : 'Chat with Vendor'}
        </button>
        {error && (
          <div className="absolute top-full left-0 mt-2 p-2 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <div>
          <h3 className="font-medium">Chat with {vendorName}</h3>
          <p className="text-xs text-blue-100">
            {chatRoom ? 'Connected' : 'Connecting...'}
          </p>
        </div>
        <button
          onClick={closeChat}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-100 border-b border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <FiMessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-xs p-2 rounded-lg ${
                  message.is_own_message
                    ? 'ml-auto bg-blue-500 text-white'
                    : 'mr-auto bg-white border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.is_own_message ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="border-t border-gray-200 p-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!chatRoom}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !chatRoom}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatButton;
