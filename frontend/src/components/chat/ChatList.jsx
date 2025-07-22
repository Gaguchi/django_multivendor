import React, { useState, useEffect } from 'react';
import { chatAPI } from '../../services/chatAPI';
import { FiUser, FiSearch, FiMessageCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const ChatList = ({ onRoomSelect, selectedRoomId, className = '' }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Load chat rooms
  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        setLoading(true);
        const [roomsResponse, unreadResponse] = await Promise.all([
          chatAPI.getChatRooms(),
          chatAPI.getUnreadCount()
        ]);

        setChatRooms(roomsResponse.data.results || roomsResponse.data);
        setUnreadCount(unreadResponse.data.unread_count);
      } catch (error) {
        console.error('Error loading chat rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatRooms();
  }, []);

  // Listen for new messages to update chat list
  useEffect(() => {
    const handleNewMessage = (event) => {
      const { roomId, message } = event.detail;
      
      // Update the chat room's last message
      setChatRooms(prev => prev.map(room => {
        if (room.id === parseInt(roomId)) {
          return {
            ...room,
            last_message_text: message.content,
            last_message_timestamp: message.timestamp,
            last_message_sender_type: message.sender_type,
            // Increment unread count if not the current room
            unread_by_customer: room.id === selectedRoomId 
              ? room.unread_by_customer 
              : room.unread_by_customer + (message.sender_type === 'vendor' ? 1 : 0),
            unread_by_vendor: room.id === selectedRoomId
              ? room.unread_by_vendor
              : room.unread_by_vendor + (message.sender_type === 'customer' ? 1 : 0)
          };
        }
        return room;
      }));

      // Update total unread count
      if (parseInt(roomId) !== selectedRoomId) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleMessagesRead = (event) => {
      const { roomId, readData } = event.detail;
      
      // Update unread counts when messages are read
      setChatRooms(prev => prev.map(room => {
        if (room.id === parseInt(roomId)) {
          return {
            ...room,
            unread_by_customer: readData.reader_type === 'customer' ? 0 : room.unread_by_customer,
            unread_by_vendor: readData.reader_type === 'vendor' ? 0 : room.unread_by_vendor
          };
        }
        return room;
      }));
    };

    window.addEventListener('chatMessage', handleNewMessage);
    window.addEventListener('chatMessagesRead', handleMessagesRead);

    return () => {
      window.removeEventListener('chatMessage', handleNewMessage);
      window.removeEventListener('chatMessagesRead', handleMessagesRead);
    };
  }, [selectedRoomId]);

  // Filter chat rooms based on search
  const filteredRooms = chatRooms.filter(room =>
    room.participant_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoomClick = async (room) => {
    // Mark messages as read when selecting a room
    try {
      await chatAPI.markRoomAsRead(room.id);
      
      // Update local state
      setChatRooms(prev => prev.map(r => {
        if (r.id === room.id) {
          return {
            ...r,
            unread_by_customer: 0,
            unread_by_vendor: 0
          };
        }
        return r;
      }));

      // Update total unread count
      const roomUnread = room.unread_by_customer + room.unread_by_vendor;
      setUnreadCount(prev => Math.max(0, prev - roomUnread));

    } catch (error) {
      console.error('Error marking room as read:', error);
    }

    onRoomSelect(room);
  };

  if (loading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiMessageCircle className="mr-2" />
            Messages
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat Room List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRooms.map((room) => {
              const unreadCount = room.unread_by_customer + room.unread_by_vendor;
              const isActive = selectedRoomId === room.id;

              return (
                <div
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-blue-50 border-r-2 border-blue-600' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {room.participant_avatar ? (
                        <img 
                          src={room.participant_avatar} 
                          alt={room.participant_name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <FiUser className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                      
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium truncate ${
                          unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {room.participant_name}
                        </h3>
                        {room.last_message_timestamp && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatDistanceToNow(new Date(room.last_message_timestamp), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      
                      {room.last_message_text && (
                        <p className={`text-sm truncate mt-1 ${
                          unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                        }`}>
                          {room.last_message_sender_type === 'customer' ? 'You: ' : ''}
                          {room.last_message_text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
