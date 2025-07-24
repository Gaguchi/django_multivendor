import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chatAPI } from '../services/chatAPI';

const ChatContext = createContext();

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchChatRooms = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await chatAPI.getChatRooms();
            setChatRooms(response.data.results || response.data || []);
            
            // Calculate unread count
            let totalUnread = 0;
            const rooms = response.data.results || response.data || [];
            rooms.forEach(room => {
                totalUnread += room.unread_by_customer || 0;
            });
            setUnreadCount(totalUnread);
        } catch (err) {
            console.error('Error fetching chat rooms:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await chatAPI.getUnreadCount();
            setUnreadCount(response.data.unread_count || 0);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    }, []);

    const updateUnreadCount = useCallback((roomId, hasUnread) => {
        setChatRooms(prevRooms => 
            prevRooms.map(room => {
                if (room.id === roomId) {
                    const updatedRoom = { ...room };
                    if (hasUnread && updatedRoom.unread_by_customer === 0) {
                        updatedRoom.unread_by_customer = 1;
                        setUnreadCount(prev => prev + 1);
                    } else if (!hasUnread && updatedRoom.unread_by_customer > 0) {
                        setUnreadCount(prev => prev - updatedRoom.unread_by_customer);
                        updatedRoom.unread_by_customer = 0;
                    }
                    return updatedRoom;
                }
                return room;
            })
        );
    }, []);

    const addNewMessage = useCallback((roomId, message) => {
        setChatRooms(prevRooms => 
            prevRooms.map(room => {
                if (room.id === roomId) {
                    const updatedRoom = { 
                        ...room, 
                        last_message_text: message.content,
                        last_message_timestamp: message.timestamp,
                        updated_at: message.timestamp
                    };
                    
                    // If message is from vendor, increment unread count
                    if (message.sender_type === 'vendor') {
                        updatedRoom.unread_by_customer = (updatedRoom.unread_by_customer || 0) + 1;
                        setUnreadCount(prev => prev + 1);
                    }
                    
                    return updatedRoom;
                }
                return room;
            })
        );
    }, []);

    const markRoomAsRead = useCallback((roomId) => {
        setChatRooms(prevRooms => 
            prevRooms.map(room => {
                if (room.id === roomId && room.unread_by_customer > 0) {
                    setUnreadCount(prev => prev - room.unread_by_customer);
                    return { ...room, unread_by_customer: 0 };
                }
                return room;
            })
        );
    }, []);

    // Initial load
    useEffect(() => {
        fetchChatRooms();
    }, [fetchChatRooms]);

    // Refresh data periodically
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    const value = {
        chatRooms,
        unreadCount,
        isLoading,
        error,
        fetchChatRooms,
        fetchUnreadCount,
        updateUnreadCount,
        addNewMessage,
        markRoomAsRead,
        refresh: fetchChatRooms
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
