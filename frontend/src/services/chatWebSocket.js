class ChatWebSocketService {
  constructor() {
    this.connections = new Map();
    this.reconnectAttempts = new Map();
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatIntervals = new Map();
    this.isManuallyDisconnected = new Set();
  }

  connectToRoom(roomId, handlers = {}) {
    if (this.connections.has(roomId)) {
      console.log(`[Chat WebSocket] Already connected to room ${roomId}`);
      return this.connections.get(roomId);
    }

    const {
      onMessage = () => {},
      onUserStatus = () => {},
      onTypingStatus = () => {},
      onMessagesRead = () => {},
      onConnected = () => {},
      onDisconnected = () => {},
      onError = () => {}
    } = handlers;

    try {
      // Use secure WebSocket for HTTPS sites, regular for HTTP
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = 'api.bazro.ge'; // Your backend host
      const ws = new WebSocket(`${protocol}//${host}/ws/chat/${roomId}/`);

      const connection = {
        ws,
        roomId,
        handlers,
        isConnected: false
      };

      ws.onopen = () => {
        console.log(`[Chat WebSocket] Connected to room ${roomId}`);
        connection.isConnected = true;
        this.reconnectAttempts.set(roomId, 0);
        this.isManuallyDisconnected.delete(roomId);
        this.startHeartbeat(roomId);
        onConnected();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(`[Chat WebSocket] Message in room ${roomId}:`, data);

          switch (data.type) {
            case 'chat_message':
              onMessage(data);
              break;
            case 'user_status':
              onUserStatus(data);
              break;
            case 'typing_status':
              onTypingStatus(data);
              break;
            case 'messages_read':
              onMessagesRead(data);
              break;
            case 'pong':
              // Heartbeat response
              break;
            default:
              console.log(`[Chat WebSocket] Unknown message type: ${data.type}`);
          }
        } catch (error) {
          console.error(`[Chat WebSocket] Error parsing message in room ${roomId}:`, error);
        }
      };

      ws.onclose = (event) => {
        console.log(`[Chat WebSocket] Disconnected from room ${roomId}`, event);
        connection.isConnected = false;
        this.stopHeartbeat(roomId);
        
        // Only attempt reconnection if not manually disconnected
        if (!this.isManuallyDisconnected.has(roomId)) {
          this.attemptReconnect(roomId, handlers);
        }
        
        onDisconnected(event);
      };

      ws.onerror = (error) => {
        console.error(`[Chat WebSocket] Error in room ${roomId}:`, error);
        onError(error);
      };

      this.connections.set(roomId, connection);
      return connection;

    } catch (error) {
      console.error(`[Chat WebSocket] Failed to create connection to room ${roomId}:`, error);
      onError(error);
      return null;
    }
  }

  disconnectFromRoom(roomId) {
    console.log(`[Chat WebSocket] Manually disconnecting from room ${roomId}`);
    this.isManuallyDisconnected.add(roomId);
    this.stopHeartbeat(roomId);
    
    const connection = this.connections.get(roomId);
    if (connection && connection.ws) {
      connection.ws.close();
    }
    
    this.connections.delete(roomId);
    this.reconnectAttempts.delete(roomId);
  }

  sendMessage(roomId, content) {
    const connection = this.connections.get(roomId);
    if (connection && connection.isConnected) {
      const message = {
        type: 'chat_message',
        content: content.trim()
      };
      
      connection.ws.send(JSON.stringify(message));
      console.log(`[Chat WebSocket] Sent message to room ${roomId}:`, content);
    } else {
      console.error(`[Chat WebSocket] Cannot send message to room ${roomId} - not connected`);
    }
  }

  startTyping(roomId) {
    const connection = this.connections.get(roomId);
    if (connection && connection.isConnected) {
      connection.ws.send(JSON.stringify({ type: 'typing_start' }));
    }
  }

  stopTyping(roomId) {
    const connection = this.connections.get(roomId);
    if (connection && connection.isConnected) {
      connection.ws.send(JSON.stringify({ type: 'typing_stop' }));
    }
  }

  markMessagesRead(roomId) {
    const connection = this.connections.get(roomId);
    if (connection && connection.isConnected) {
      connection.ws.send(JSON.stringify({ type: 'mark_read' }));
    }
  }

  ping(roomId) {
    const connection = this.connections.get(roomId);
    if (connection && connection.isConnected) {
      connection.ws.send(JSON.stringify({ type: 'ping' }));
    }
  }

  startHeartbeat(roomId) {
    this.stopHeartbeat(roomId);
    
    const interval = setInterval(() => {
      this.ping(roomId);
    }, 30000); // Ping every 30 seconds
    
    this.heartbeatIntervals.set(roomId, interval);
  }

  stopHeartbeat(roomId) {
    const interval = this.heartbeatIntervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      this.heartbeatIntervals.delete(roomId);
    }
  }

  attemptReconnect(roomId, handlers) {
    const attempts = this.reconnectAttempts.get(roomId) || 0;
    
    if (attempts >= this.maxReconnectAttempts) {
      console.log(`[Chat WebSocket] Max reconnection attempts reached for room ${roomId}`);
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, attempts); // Exponential backoff
    console.log(`[Chat WebSocket] Attempting to reconnect to room ${roomId} in ${delay}ms (attempt ${attempts + 1})`);
    
    setTimeout(() => {
      if (!this.isManuallyDisconnected.has(roomId)) {
        this.reconnectAttempts.set(roomId, attempts + 1);
        this.connections.delete(roomId); // Remove old connection
        this.connectToRoom(roomId, handlers);
      }
    }, delay);
  }

  isConnectedToRoom(roomId) {
    const connection = this.connections.get(roomId);
    return connection && connection.isConnected;
  }

  getActiveRooms() {
    return Array.from(this.connections.keys()).filter(roomId => 
      this.isConnectedToRoom(roomId)
    );
  }

  disconnectAll() {
    console.log('[Chat WebSocket] Disconnecting from all rooms');
    this.connections.forEach((_, roomId) => {
      this.disconnectFromRoom(roomId);
    });
  }
}

// Create singleton instance
export const chatWebSocketService = new ChatWebSocketService();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  chatWebSocketService.disconnectAll();
});
