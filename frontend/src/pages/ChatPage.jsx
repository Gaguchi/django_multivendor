import React, { useState } from 'react';
import { ChatWebSocketProvider } from '../contexts/ChatWebSocketContext';
import ChatList from '../components/chat/ChatList';
import ChatInterface from '../components/chat/ChatInterface';
import { FiMessageCircle } from 'react-icons/fi';

const ChatPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

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
      <div className="h-screen bg-gray-100 flex">
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
            {selectedRoom ? (
              <ChatInterface 
                roomId={selectedRoom.id}
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
                    Choose a conversation from the sidebar to start messaging
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
            selectedRoom && (
              <ChatInterface 
                roomId={selectedRoom.id}
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

export default ChatPage;
