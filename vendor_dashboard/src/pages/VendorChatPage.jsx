import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatWebSocketProvider } from '../contexts/ChatWebSocketContext';
import ChatList from '../../../frontend/src/components/chat/ChatList';
import ChatInterface from '../../../frontend/src/components/chat/ChatInterface';
import { FiMessageCircle } from 'react-icons/fi';

const VendorChatPage = () => {
  const { roomId } = useParams();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Set selected room based on URL parameter
  useEffect(() => {
    if (roomId) {
      setSelectedRoom({ id: parseInt(roomId) });
      setIsMobileView(true);
    }
  }, [roomId]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setIsMobileView(true);
  };

  const handleCloseMobileChat = () => {
    setIsMobileView(false);
    setSelectedRoom(null);
  };

  return (
    <ChatWebSocketProvider>
      <div className="h-full bg-gray-100 flex">
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full">
          {/* Chat List - Left Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <ChatList 
              onRoomSelect={handleRoomSelect}
              selectedRoomId={selectedRoom?.id}
            />
          </div>

          {/* Chat Interface - Main Area */}
          <div className="flex-1 flex flex-col">
            {selectedRoom || roomId ? (
              <ChatInterface 
                roomId={roomId || selectedRoom.id}
                onClose={() => setSelectedRoom(null)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FiMessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the sidebar to start messaging with customers
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden w-full">
          {!isMobileView ? (
            /* Show Chat List on Mobile */
            <ChatList 
              onRoomSelect={handleRoomSelect}
              selectedRoomId={selectedRoom?.id}
              className="h-full"
            />
          ) : (
            /* Show Chat Interface on Mobile */
            (selectedRoom || roomId) && (
              <ChatInterface 
                roomId={roomId || selectedRoom.id}
                onClose={handleCloseMobileChat}
                className="h-full"
              />
            )
          )}
        </div>
      </div>
    </ChatWebSocketProvider>
  );
};

export default VendorChatPage;
