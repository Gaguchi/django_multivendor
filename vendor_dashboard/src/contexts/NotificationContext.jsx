import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
    getVendorNotifications, 
    getUnreadNotificationCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    dismissNotification,
    getNotificationSummary
} from '../services/notificationApi';

// Initial state
const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    summary: null,
    lastUpdated: null
};

// Action types
const ActionTypes = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
    SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
    SET_SUMMARY: 'SET_SUMMARY',
    MARK_AS_READ: 'MARK_AS_READ',
    MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
    DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
function notificationReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        
        case ActionTypes.SET_ERROR:
            return { ...state, error: action.payload, loading: false };
        
        case ActionTypes.CLEAR_ERROR:
            return { ...state, error: null };
        
        case ActionTypes.SET_NOTIFICATIONS:
            return { 
                ...state, 
                notifications: action.payload.results || action.payload,
                unreadCount: action.payload.unread_count || state.unreadCount,
                loading: false,
                lastUpdated: Date.now()
            };
        
        case ActionTypes.SET_UNREAD_COUNT:
            return { ...state, unreadCount: action.payload };
        
        case ActionTypes.SET_SUMMARY:
            return { ...state, summary: action.payload };
        
        case ActionTypes.MARK_AS_READ:
            return {
                ...state,
                notifications: state.notifications.map(notification =>
                    notification.id === action.payload
                        ? { ...notification, is_read: true, read_at: new Date().toISOString() }
                        : notification
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            };
        
        case ActionTypes.MARK_ALL_AS_READ:
            return {
                ...state,
                notifications: state.notifications.map(notification => ({
                    ...notification,
                    is_read: true,
                    read_at: new Date().toISOString()
                })),
                unreadCount: 0
            };
        
        case ActionTypes.DISMISS_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(
                    notification => notification.id !== action.payload
                ),
                unreadCount: state.notifications.find(n => n.id === action.payload)?.is_read 
                    ? state.unreadCount 
                    : Math.max(0, state.unreadCount - 1)
            };
        
        case ActionTypes.ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                unreadCount: action.payload.is_read ? state.unreadCount : state.unreadCount + 1
            };
        
        case ActionTypes.UPDATE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.map(notification =>
                    notification.id === action.payload.id
                        ? { ...notification, ...action.payload }
                        : notification
                )
            };
        
        default:
            return state;
    }
}

// Context
const NotificationContext = createContext();

// Provider component
export function NotificationProvider({ children }) {
    const [state, dispatch] = useReducer(notificationReducer, initialState);

    // Fetch notifications
    const fetchNotifications = useCallback(async (filters = {}) => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        try {
            const data = await getVendorNotifications(filters);
            dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: data });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        }
    }, []);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        try {
            const data = await getUnreadNotificationCount();
            dispatch({ type: ActionTypes.SET_UNREAD_COUNT, payload: data.unread_count });
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, []);

    // Fetch summary
    const fetchSummary = useCallback(async () => {
        try {
            const data = await getNotificationSummary();
            dispatch({ type: ActionTypes.SET_SUMMARY, payload: data });
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    }, []);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            dispatch({ type: ActionTypes.MARK_AS_READ, payload: notificationId });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            await markAllNotificationsAsRead();
            dispatch({ type: ActionTypes.MARK_ALL_AS_READ });
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        }
    }, []);

    // Dismiss notification
    const dismissNotificationById = useCallback(async (notificationId) => {
        try {
            await dismissNotification(notificationId);
            dispatch({ type: ActionTypes.DISMISS_NOTIFICATION, payload: notificationId });
        } catch (error) {
            console.error('Error dismissing notification:', error);
            dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        }
    }, []);

    // Delete notification (alias for dismiss)
    const deleteNotification = useCallback(async (notificationId) => {
        return await dismissNotificationById(notificationId);
    }, [dismissNotificationById]);

    // Add notification (for real-time updates)
    const addNotification = useCallback((notification) => {
        dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
    }, []);

    // Update notification
    const updateNotification = useCallback((notification) => {
        dispatch({ type: ActionTypes.UPDATE_NOTIFICATION, payload: notification });
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        dispatch({ type: ActionTypes.CLEAR_ERROR });
    }, []);

    // Auto-refresh notifications periodically (reduced frequency since we have WebSocket)
    useEffect(() => {
        const interval = setInterval(() => {
            // Only refresh unread count, as real-time updates handle the rest
            fetchUnreadCount();
        }, 60000); // Refresh every 60 seconds instead of 30

        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    // Initial load
    useEffect(() => {
        fetchNotifications({ limit: 10 });
        fetchUnreadCount();
        fetchSummary();
    }, [fetchNotifications, fetchUnreadCount, fetchSummary]);

    const contextValue = {
        ...state,
        fetchNotifications,
        fetchUnreadCount,
        fetchSummary,
        markAsRead,
        markAllAsRead,
        dismissNotificationById,
        deleteNotification,
        addNotification,
        updateNotification,
        clearError
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
}

// Hook to use the notification context
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

// Hook for getting just the unread count (useful for header badge)
export function useUnreadCount() {
    const { unreadCount, fetchUnreadCount } = useNotifications();
    return { unreadCount, fetchUnreadCount };
}

export default NotificationContext;
