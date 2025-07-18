import { getVendorId } from '../utils/auth';

// API URL with fallback to local development server if not specified in env
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bazro.ge';

/**
 * Handle API response with error handling
 */
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const error = new Error(errorData?.detail || errorData?.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
    }
    return await response.json();
}

/**
 * Get vendor notifications
 */
export async function getVendorNotifications(filters = {}) {
    try {
        const queryParams = new URLSearchParams();
        
        // Add filters
        if (filters.is_read !== undefined) {
            queryParams.append('is_read', filters.is_read.toString());
        }
        if (filters.type) {
            queryParams.append('type', filters.type);
        }
        if (filters.priority) {
            queryParams.append('priority', filters.priority);
        }
        if (filters.limit) {
            queryParams.append('limit', filters.limit.toString());
        }
        
        const url = `${API_URL}/api/notifications/vendor-notifications/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        const headers = {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
            'Accept': 'application/json'
        };
        
        // Add vendor ID header if available
        const vendorId = getVendorId();
        if (vendorId) {
            headers['X-Vendor-ID'] = vendorId;
        }
        
        const response = await fetch(url, { headers });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching vendor notifications:', error);
        throw error;
    }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount() {
    try {
        const url = `${API_URL}/api/notifications/vendor-notifications/unread_count/`;
        
        const headers = {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
            'Accept': 'application/json'
        };
        
        const vendorId = getVendorId();
        if (vendorId) {
            headers['X-Vendor-ID'] = vendorId;
        }
        
        const response = await fetch(url, { headers });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        throw error;
    }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId) {
    try {
        const url = `${API_URL}/api/notifications/vendor-notifications/${notificationId}/mark_read/`;
        
        const headers = {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        const vendorId = getVendorId();
        if (vendorId) {
            headers['X-Vendor-ID'] = vendorId;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
    try {
        const url = `${API_URL}/api/notifications/vendor-notifications/mark_all_read/`;
        
        const headers = {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        const vendorId = getVendorId();
        if (vendorId) {
            headers['X-Vendor-ID'] = vendorId;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
}

/**
 * Dismiss notification
 */
export async function dismissNotification(notificationId) {
    try {
        const url = `${API_URL}/api/notifications/vendor-notifications/${notificationId}/dismiss/`;
        
        const headers = {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        const vendorId = getVendorId();
        if (vendorId) {
            headers['X-Vendor-ID'] = vendorId;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error dismissing notification:', error);
        throw error;
    }
}

/**
 * Get notification summary
 */
export async function getNotificationSummary() {
    try {
        const url = `${API_URL}/api/notifications/vendor-notifications/summary/`;
        
        const headers = {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
            'Accept': 'application/json'
        };
        
        const vendorId = getVendorId();
        if (vendorId) {
            headers['X-Vendor-ID'] = vendorId;
        }
        
        const response = await fetch(url, { headers });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching notification summary:', error);
        throw error;
    }
}

/**
 * Bulk update notifications
 */
export async function bulkUpdateNotifications(notificationIds, action) {
    try {
        const url = `${API_URL}/api/notifications/vendor-notifications/bulk_update/`;
        
        const headers = {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        const vendorId = getVendorId();
        if (vendorId) {
            headers['X-Vendor-ID'] = vendorId;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                notification_ids: notificationIds,
                action: action
            })
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error bulk updating notifications:', error);
        throw error;
    }
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences() {
    try {
        const url = `${API_URL}/api/notifications/vendor-notification-preferences/my_preferences/`;
        
        const headers = {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
            'Accept': 'application/json'
        };
        
        const vendorId = getVendorId();
        if (vendorId) {
            headers['X-Vendor-ID'] = vendorId;
        }
        
        const response = await fetch(url, { headers });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching notification preferences:', error);
        throw error;
    }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(preferences) {
    try {
        const url = `${API_URL}/api/notifications/vendor-notification-preferences/my_preferences/`;
        
        const headers = {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        const vendorId = getVendorId();
        if (vendorId) {
            headers['X-Vendor-ID'] = vendorId;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(preferences)
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error updating notification preferences:', error);
        throw error;
    }
}
