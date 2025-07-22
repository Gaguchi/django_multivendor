import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getChatRooms, getUnreadMessageCount } from '../services/chatAPI';

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
            const response = await getChatRooms();
            setChatRooms(response.results || []);
            
            // Calculate unread count
            let totalUnread = 0;
            response.results?.forEach(room => {
                totalUnread += room.unread_by_vendor || 0;
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
            const count = await getUnreadMessageCount();
            setUnreadCount(count);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    }, []);

    const updateUnreadCount = useCallback((roomId, hasUnread) => {
        setChatRooms(prevRooms => 
            prevRooms.map(room => {
                if (room.id === roomId) {
                    const updatedRoom = { ...room };
                    if (hasUnread && updatedRoom.unread_by_vendor === 0) {
                        updatedRoom.unread_by_vendor = 1;
                        setUnreadCount(prev => prev + 1);
                    } else if (!hasUnread && updatedRoom.unread_by_vendor > 0) {
                        setUnreadCount(prev => prev - updatedRoom.unread_by_vendor);
                        updatedRoom.unread_by_vendor = 0;
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
                        last_message: message.content,
                        last_message_timestamp: message.timestamp,
                        updated_at: message.timestamp
                    };
                    
                    // If message is from customer, increment unread count
                    if (message.sender_type === 'customer') {
                        updatedRoom.unread_by_vendor = (updatedRoom.unread_by_vendor || 0) + 1;
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
                if (room.id === roomId && room.unread_by_vendor > 0) {
                    setUnreadCount(prev => prev - room.unread_by_vendor);
                    return { ...room, unread_by_vendor: 0 };
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
