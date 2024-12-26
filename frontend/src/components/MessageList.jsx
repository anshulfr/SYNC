import React, { useEffect, useRef, useState } from 'react';

const MessageList = ({ messages, onUserClick, loggedInUser }) => {
  const messagesEndRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.sentAt) - new Date(b.sentAt)
  );

  const renderProfilePicture = (user) => {
    return user.profilePicture ? (
      <img
        src={user.profilePicture}
        alt={user.username}
        className="w-6 h-6 rounded-full object-cover border border-gray-600"
      />
    ) : (
      <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-semibold">
        {user.username[0].toUpperCase()}
      </div>
    );
  };

  const UserProfileModal = ({ user, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col items-center">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-600 mb-4 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                {user.username[0].toUpperCase()}
              </div>
            )}
            <h4 className="text-2xl font-semibold text-white mb-2">{user.username}</h4>
            <p className="text-gray-300 mb-4">{user.email}</p>
            <button 
              onClick={onClose}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
      <div className="flex flex-col space-y-4 p-4 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-hide">
        {sortedMessages.map((message) => {
          const isOwnMessage = message.sender.username === loggedInUser;
          
          return (
            <div
              key={`${message.id}-${message.sentAt}`}
              className={`flex flex-col w-full ${isOwnMessage ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center mb-0.5">
                {!isOwnMessage && (
                  <div 
                    onClick={() => handleUserClick(message.sender)}
                    className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  >
                    {renderProfilePicture(message.sender)}
                  </div>
                )}
                <span className={`text-xs text-gray-400 ${isOwnMessage ? "mr-1" : "ml-1"}`}>
                  {message.sender.username}
                </span>
                {isOwnMessage && (
                  <div 
                    onClick={() => handleUserClick(message.sender)}
                    className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  >
                    {renderProfilePicture(message.sender)}
                  </div>
                )}
              </div>
              <div
                className={`max-w-xs px-3 py-2 rounded-2xl text-white ${
                  isOwnMessage ? "bg-blue-600 rounded-tr-none" : "bg-gray-700 rounded-tl-none"
                }`}
              >
                <p className="break-words text-sm">{message.content}</p>
                <span className="text-xs text-gray-400 mt-0.5 block">
                  {new Date(message.sentAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {selectedUser && (
        <UserProfileModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </>
  );
};

export default MessageList;