import React, { useState } from 'react';
import { chatAPI } from '../../services/chatAPI';
import { FiMessageCircle, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StartChatButton = ({ vendorId, vendorName, className = '', size = 'md' }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!vendorId) {
      console.error('Vendor ID is required to start chat');
      return;
    }

    setLoading(true);

    try {
      // Create or get existing chat room
      const response = await chatAPI.createChatRoom(vendorId);
      const chatRoom = response.data;

      // Navigate to chat page with the room selected
      navigate(`/chat?room=${chatRoom.id}`);

    } catch (error) {
      console.error('Error starting chat:', error);
      
      // Show error message
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to start chat. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={loading}
      className={`
        inline-flex items-center justify-center space-x-2 
        bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]} ${className}
      `}
      title={`Chat with ${vendorName}`}
    >
      {loading ? (
        <FiLoader className={`animate-spin ${iconSizes[size]}`} />
      ) : (
        <FiMessageCircle className={iconSizes[size]} />
      )}
      <span>
        {loading ? 'Starting...' : 'Chat Now'}
      </span>
    </button>
  );
};

export default StartChatButton;
