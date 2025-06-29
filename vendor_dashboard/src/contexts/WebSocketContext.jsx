import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { vendorWebSocketService } from '../services/websocket';
import { useVendor } from './VendorContext';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export function WebSocketProvider({ children }) {
  const { vendorId, isVendorLoaded } = useVendor();
  const [connectionState, setConnectionState] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const [orderUpdates, setOrderUpdates] = useState([]);

  // Event handlers
  const handleConnected = useCallback(() => {
    console.log('[WebSocket Context] Connected');
    setConnectionState('connected');
  }, []);

  const handleDisconnected = useCallback((data) => {
    console.log('[WebSocket Context] Disconnected:', data);
    setConnectionState('disconnected');
  }, []);

  const handleError = useCallback((error) => {
    console.error('[WebSocket Context] Error:', error);
    setConnectionState('error');
  }, []);

  const handleOrderStatusUpdate = useCallback((data) => {
    console.log('[WebSocket Context] Order status update:', data);
    setLastMessage({
      type: 'order_status_update',
      data,
      timestamp: new Date()
    });
    
    // Add to updates list (keep last 50)
    setOrderUpdates(prev => {
      const newUpdates = [data, ...prev].slice(0, 50);
      return newUpdates;
    });
  }, []);

  const handleNewOrder = useCallback((data) => {
    console.log('[WebSocket Context] New order:', data);
    setLastMessage({
      type: 'new_order',
      data,
      timestamp: new Date()
    });
    
    // Add to updates list
    setOrderUpdates(prev => {
      const newUpdate = { ...data, type: 'new_order' };
      const newUpdates = [newUpdate, ...prev].slice(0, 50);
      return newUpdates;
    });
  }, []);

  // Setup WebSocket connection when vendor is loaded
  useEffect(() => {
    if (isVendorLoaded && vendorId) {
      console.log('[WebSocket Context] Setting up connection for vendor:', vendorId);
      
      // Register event listeners
      vendorWebSocketService.on('connected', handleConnected);
      vendorWebSocketService.on('disconnected', handleDisconnected);
      vendorWebSocketService.on('error', handleError);
      vendorWebSocketService.on('orderStatusUpdate', handleOrderStatusUpdate);
      vendorWebSocketService.on('newOrder', handleNewOrder);

      // Connect
      vendorWebSocketService.connect(vendorId);
      setConnectionState('connecting');

      // Cleanup function
      return () => {
        console.log('[WebSocket Context] Cleaning up WebSocket connection');
        vendorWebSocketService.off('connected', handleConnected);
        vendorWebSocketService.off('disconnected', handleDisconnected);
        vendorWebSocketService.off('error', handleError);
        vendorWebSocketService.off('orderStatusUpdate', handleOrderStatusUpdate);
        vendorWebSocketService.off('newOrder', handleNewOrder);
        vendorWebSocketService.disconnect();
      };
    }
  }, [isVendorLoaded, vendorId, handleConnected, handleDisconnected, handleError, handleOrderStatusUpdate, handleNewOrder]);

  // Manually connect/disconnect
  const connect = useCallback(() => {
    if (vendorId) {
      vendorWebSocketService.connect(vendorId);
      setConnectionState('connecting');
    }
  }, [vendorId]);

  const disconnect = useCallback(() => {
    vendorWebSocketService.disconnect();
    setConnectionState('disconnected');
  }, []);

  // Clear order updates
  const clearOrderUpdates = useCallback(() => {
    setOrderUpdates([]);
  }, []);

  const value = {
    connectionState,
    isConnected: connectionState === 'connected',
    lastMessage,
    orderUpdates,
    connect,
    disconnect,
    clearOrderUpdates,
    vendorId
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
