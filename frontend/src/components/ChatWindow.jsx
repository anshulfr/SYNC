import React from 'react';
import ChatToolbar from './ChatToolbar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({ chatName, messages, onSendMessage, onUserClick, loggedInUser, participants, isOwner }) => {
  return (
    <div className="flex h-screen">
      <div className="flex-grow flex flex-col">
        <ChatToolbar chatName={chatName} />
        <div className="flex-grow bg-gray-900 overflow-y-auto">
          <MessageList messages={messages} onUserClick={onUserClick} loggedInUser={loggedInUser} />
        </div>
        <div className="bg-gray-800 fixed bottom-0 p-0 w-full">
          <MessageInput onSendMessage={onSendMessage} />
        </div>
      </div>
      
      {/* Participants sidebar */}
      <div className="w-64 bg-gray-800 border-l border-gray-700">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Participants</h3>
          <ul className="space-y-2">
            {participants?.map((participant) => (
              <li 
                key={participant.id} 
                onClick={() => onUserClick(participant)} 
                className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
              >
                {participant.profilePicture ? (
                  <img 
                    src={participant.profilePicture} 
                    alt={participant.username}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    {participant.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-white">
                  {participant.username}
                  {isOwner && participant.id === participants[0]?.id && ' (Owner)'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;