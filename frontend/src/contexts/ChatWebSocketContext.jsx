import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { chatWebSocketService } from '../services/chatWebSocket';
import { useAuth } from './AuthContext';

const ChatWebSocketContext = createContext();

export const useChatWebSocket = () => {
  const context = useContext(ChatWebSocketContext);
  if (!context) {
    throw new Error('useChatWebSocket must be used within a ChatWebSocketProvider');
  }
  return context;
};

export function ChatWebSocketProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  
  const [connections, setConnections] = useState(new Map());
  const [activeRooms, setActiveRooms] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  // Connect to a chat room
  const connectToRoom = useCallback(async (roomId) => {
    if (!isAuthenticated || !user || connections.has(roomId)) {
      return;
    }

    console.log(`[Chat WebSocket] Connecting to room ${roomId}`);
    
    try {
      const connection = chatWebSocketService.connectToRoom(roomId, {
        onMessage: (message) => handleChatMessage(roomId, message),
        onUserStatus: (status) => handleUserStatus(roomId, status),
        onTypingStatus: (typing) => handleTypingStatus(roomId, typing),
        onMessagesRead: (readData) => handleMessagesRead(roomId, readData),
        onConnected: () => {
          console.log(`[Chat WebSocket] Connected to room ${roomId}`);
          setActiveRooms(prev => new Set([...prev, roomId]));
        },
        onDisconnected: () => {
          console.log(`[Chat WebSocket] Disconnected from room ${roomId}`);
          setActiveRooms(prev => {
            const newSet = new Set(prev);
            newSet.delete(roomId);
            return newSet;
          });
        },
        onError: (error) => {
          console.error(`[Chat WebSocket] Error in room ${roomId}:`, error);
        }
      });

      setConnections(prev => new Map(prev.set(roomId, connection)));
    } catch (error) {
      console.error(`[Chat WebSocket] Failed to connect to room ${roomId}:`, error);
    }
  }, [isAuthenticated, user]);

  // Disconnect from a chat room
  const disconnectFromRoom = useCallback((roomId) => {
    const connection = connections.get(roomId);
    if (connection) {
      chatWebSocketService.disconnectFromRoom(roomId);
      setConnections(prev => {
        const newMap = new Map(prev);
        newMap.delete(roomId);
        return newMap;
      });
      setActiveRooms(prev => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(roomId);
        return newMap;
      });
    }
  }, [connections]);

  // Send a message to a room
  const sendMessage = useCallback((roomId, content) => {
    chatWebSocketService.sendMessage(roomId, content);
  }, []);

  // Send typing start indicator
  const startTyping = useCallback((roomId) => {
    chatWebSocketService.startTyping(roomId);
  }, []);

  // Send typing stop indicator
  const stopTyping = useCallback((roomId) => {
    chatWebSocketService.stopTyping(roomId);
  }, []);

  // Mark messages as read
  const markMessagesRead = useCallback((roomId) => {
    chatWebSocketService.markMessagesRead(roomId);
  }, []);

  // Event handlers
  const handleChatMessage = useCallback((roomId, message) => {
    console.log(`[Chat WebSocket] New message in room ${roomId}:`, message);
    
    // Emit custom event for components to listen to
    window.dispatchEvent(new CustomEvent('chatMessage', {
      detail: { roomId, message }
    }));
  }, [user]);

  const handleUserStatus = useCallback((roomId, status) => {
    console.log(`[Chat WebSocket] User status in room ${roomId}:`, status);
    
    setOnlineUsers(prev => {
      const newMap = new Map(prev);
      const roomUsers = newMap.get(roomId) || new Map();
      
      if (status.status === 'online') {
        roomUsers.set(status.user_id, {
          userId: status.user_id,
          userType: status.user_type,
          timestamp: status.timestamp
        });
      } else {
        roomUsers.delete(status.user_id);
      }
      
      newMap.set(roomId, roomUsers);
      return newMap;
    });

    // Emit custom event
    window.dispatchEvent(new CustomEvent('chatUserStatus', {
      detail: { roomId, status }
    }));
  }, []);

  const handleTypingStatus = useCallback((roomId, typing) => {
    console.log(`[Chat WebSocket] Typing status in room ${roomId}:`, typing);
    
    setTypingUsers(prev => {
      const newMap = new Map(prev);
      const roomTyping = newMap.get(roomId) || new Map();
      
      if (typing.is_typing) {
        roomTyping.set(typing.user_id, {
          userId: typing.user_id,
          userType: typing.user_type,
          timestamp: typing.timestamp
        });
      } else {
        roomTyping.delete(typing.user_id);
      }
      
      newMap.set(roomId, roomTyping);
      return newMap;
    });

    // Emit custom event
    window.dispatchEvent(new CustomEvent('chatTypingStatus', {
      detail: { roomId, typing }
    }));
  }, []);

  const handleMessagesRead = useCallback((roomId, readData) => {
    console.log(`[Chat WebSocket] Messages read in room ${roomId}:`, readData);
    
    // Emit custom event
    window.dispatchEvent(new CustomEvent('chatMessagesRead', {
      detail: { roomId, readData }
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Disconnect from all rooms on unmount
      connections.forEach((_, roomId) => {
        chatWebSocketService.disconnectFromRoom(roomId);
      });
    };
  }, []);

  const value = {
    // Connection state
    activeRooms,
    isRoomConnected: (roomId) => activeRooms.has(roomId),
    
    // Connection management
    connectToRoom,
    disconnectFromRoom,
    
    // Messaging
    sendMessage,
    
    // Typing indicators
    startTyping,
    stopTyping,
    getTypingUsers: (roomId) => typingUsers.get(roomId) || new Map(),
    
    // User presence
    getOnlineUsers: (roomId) => onlineUsers.get(roomId) || new Map(),
    
    // Read receipts
    markMessagesRead,
  };

  return (
    <ChatWebSocketContext.Provider value={value}>
      {children}
    </ChatWebSocketContext.Provider>
  );
}
