class VendorWebSocketService {
  constructor() {
    this.ws = null;
    this.vendorId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnecting = false;
    this.isManuallyDisconnected = false;
    this.listeners = new Map();
    this.heartbeatInterval = null;
    this.heartbeatTimeout = null;
  }

  connect(vendorId) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.vendorId = vendorId;
    this.isConnecting = true;
    this.isManuallyDisconnected = false;

    try {
      // Use secure WebSocket for HTTPS sites, regular for HTTP
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = 'api.bazro.ge'; // Your backend host
      this.ws = new WebSocket(`${protocol}//${host}/ws/vendor/${vendorId}/orders/`);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);

      console.log(`[WebSocket] Connecting to vendor ${vendorId}...`);
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.isConnecting = false;
    }
  }

  disconnect() {
    this.isManuallyDisconnected = true;
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.reconnectAttempts = 0;
    console.log('[WebSocket] Manually disconnected');
  }

  handleOpen() {
    console.log('[WebSocket] Connected successfully');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    this.emit('connected', { vendorId: this.vendorId });
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      console.log('[WebSocket] Received message:', data);

      switch (data.type) {
        case 'order_status_update':
          this.emit('orderStatusUpdate', {
            orderNumber: data.order_number,
            status: data.status,
            vendorId: data.vendor_id,
            timestamp: data.timestamp
          });
          break;

        case 'order_created':
          this.emit('newOrder', {
            orderNumber: data.order_number,
            vendorId: data.vendor_id,
            timestamp: data.timestamp
          });
          break;

        case 'new_notification':
          this.emit('newNotification', {
            notification: data.notification,
            timestamp: data.timestamp
          });
          break;

        case 'notification_update':
          this.emit('notificationUpdate', {
            notification: data.notification,
            timestamp: data.timestamp
          });
          break;

        case 'pong':
          // Heartbeat response
          if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
          }
          break;

        default:
          console.log('[WebSocket] Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('[WebSocket] Error parsing message:', error);
    }
  }

  handleClose(event) {
    console.log('[WebSocket] Connection closed:', event.code, event.reason);
    this.isConnecting = false;
    this.stopHeartbeat();
    this.emit('disconnected', { code: event.code, reason: event.reason });

    // Attempt to reconnect if not manually disconnected
    if (!this.isManuallyDisconnected && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  handleError(error) {
    console.error('[WebSocket] Error:', error);
    this.emit('error', error);
  }

  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
    
    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isManuallyDisconnected && this.vendorId) {
        this.connect(this.vendorId);
      }
    }, delay);
  }

  startHeartbeat() {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'ping',
          timestamp: new Date().toISOString()
        }));

        // Set timeout for pong response
        this.heartbeatTimeout = setTimeout(() => {
          console.warn('[WebSocket] Heartbeat timeout, closing connection');
          this.ws.close();
        }, 5000);
      }
    }, 30000); // Send ping every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  // Event listener methods
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WebSocket] Error in event callback for ${event}:`, error);
        }
      });
    }
  }

  // Connection status
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  getConnectionState() {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }
}

// Export singleton instance
export const vendorWebSocketService = new VendorWebSocketService();
