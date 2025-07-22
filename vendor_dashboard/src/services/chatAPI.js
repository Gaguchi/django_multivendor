// Chat API service for vendor dashboard
import { getToken, getVendorId as getAuthVendorId, ensureValidToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bazro.ge';

function getVendorId() {
    // Use the auth system's vendor ID
    return getAuthVendorId();
}

async function getAuthHeaders() {
    // Ensure token is valid before making request
    await ensureValidToken();
    
    const token = getToken();
    
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        console.warn('ChatAPI: No authentication token available');
    }
    
    const vendorId = getVendorId();
    if (vendorId) {
        headers['X-Vendor-ID'] = vendorId;
    }
    
    return headers;
}

async function handleResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return await response.json();
}

/**
 * Get chat rooms for the vendor
 */
export async function getChatRooms() {
    try {
        const url = `${API_URL}/api/chat/api/rooms/`;
        const headers = await getAuthHeaders();
        const response = await fetch(url, { headers });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        throw error;
    }
}

/**
 * Get messages for a specific chat room
 */
export async function getChatMessages(roomId, page = 1) {
    try {
        const url = `${API_URL}/api/chat/api/messages/?chat_room=${roomId}&page=${page}`;
        const headers = await getAuthHeaders();
        const response = await fetch(url, { headers });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
    }
}

/**
 * Send a message to a chat room
 */
export async function sendMessage(roomId, content, messageType = 'text') {
    try {
        const url = `${API_URL}/api/chat/api/messages/`;
        const headers = await getAuthHeaders();
        
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                chat_room: roomId,
                content,
                message_type: messageType
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

/**
 * Mark messages as read in a chat room
 */
export async function markMessagesAsRead(roomId) {
    try {
        const url = `${API_URL}/api/chat/api/rooms/${roomId}/mark_read/`;
        const headers = await getAuthHeaders();
        const response = await fetch(url, { 
            method: 'POST',
            headers 
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error marking messages as read:', error);
        throw error;
    }
}

/**
 * Get unread message count for vendor
 */
export async function getUnreadMessageCount() {
    try {
        const rooms = await getChatRooms();
        
        let totalUnread = 0;
        rooms.results?.forEach(room => {
            totalUnread += room.unread_by_vendor || 0;
        });
        
        return totalUnread;
    } catch (error) {
        console.error('Error getting unread message count:', error);
        return 0;
    }
}

/**
 * Create or get a chat room with a customer
 */
export async function createChatRoom(customerId) {
    try {
        const url = `${API_URL}/api/chat/api/rooms/`;
        
        const headers = {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        
        const vendorId = getVendorId();
        if (vendorId) {
            headers['X-Vendor-ID'] = vendorId;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                customer_id: customerId
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw error;
    }
}
