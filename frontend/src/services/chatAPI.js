import api from './api';

export const chatAPI = {
  // Chat Rooms
  getChatRooms: () => api.get('/api/chat/api/rooms/'),
  
  getChatRoom: (roomId) => api.get(`/api/chat/api/rooms/${roomId}/`),
  
  createChatRoom: (vendorId) => api.post('/api/chat/api/rooms/', { vendor_id: vendorId }),
  
  markRoomAsRead: (roomId) => api.post(`/api/chat/api/rooms/${roomId}/mark_read/`),
  
  getUnreadCount: () => api.get('/api/chat/api/rooms/unread_count/'),

  // Chat Messages
  getChatMessages: (chatRoomId, page = 1) => 
    api.get(`/api/chat/api/messages/?chat_room=${chatRoomId}&page=${page}`),
  
  getMessages: (roomId, page = 1) => 
    api.get(`/api/chat/api/messages/?chat_room=${roomId}&page=${page}`),
  
  sendMessage: (chatRoomId, messageData) => 
    api.post('/api/chat/api/messages/', {
      chat_room: chatRoomId,
      content: messageData.content || messageData,
      sender_type: messageData.sender_type || 'customer'
    }),

  // Chat Participants
  getChatParticipants: (chatRoomId) => 
    api.get(`/api/chat/api/participants/?chat_room=${chatRoomId}`),
  
  getOnlineStatus: (chatRoomId) => 
    api.get(`/api/chat/api/participants/online_status/?chat_room=${chatRoomId}`),
};

export default chatAPI;
