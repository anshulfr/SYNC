import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import ChatRoomList from './ChatRoomList';
import ChatWindow from './ChatWindow';

const GET_MESSAGES = gql`
  query GetMessages($chatRoomId: ID!, $limit: Int, $offset: Int) {
    getMessages(chatRoomId: $chatRoomId, limit: $limit, offset: $offset) {
      id
      content
      sender {
        id
        username
        email
        profilePicture
      }
      sentAt
    }
  }
`;

const GET_CHAT_ROOM = gql`
  query GetChatRoom($chatRoomId: ID!) {
    getChatRoom(chatRoomId: $chatRoomId) {
      id
      name
      owner {
        id
        username
        email
        profilePicture
      }
      participants {
        id
        username
        email
        profilePicture
      }
      joinLink
    }
  }
`;

const ChatDashboard = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  // Query for messages
  const { loading: messagesLoading, data: messagesData } = useQuery(GET_MESSAGES, {
    variables: { 
      chatRoomId: roomId,
      limit: 50,
      offset: 0
    },
    skip: !roomId,
  });

  // Query for chat room details
  const { loading: roomLoading, data: roomData } = useQuery(GET_CHAT_ROOM, {
    variables: { chatRoomId: roomId },
    skip: !roomId,
  });

  useEffect(() => {
    if (messagesData?.getMessages) {
      setMessages(messagesData.getMessages);
    }
  }, [messagesData]);

  const handleSendMessage = (content) => {
    const newMessage = {
      id: Date.now(),
      content,
      sender: {
        id: userId,
        username,
        profilePicture: null
      },
      sentAt: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  const handleUserClick = (user) => {
    // Handle user profile click
    console.log('User clicked:', user);
  };

  const isOwner = roomData?.getChatRoom?.owner?.id === userId;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex flex-grow mt-0 overflow-hidden">
        <aside className="w-1/4 border-r border-gray-700 p-4">
          <h2 className="text-lg font-semibold mb-4">Chat Rooms</h2>
          <ChatRoomList />
        </aside>
        <main className="flex-grow bg-gray-800 flex flex-col">
          {roomId ? (
            <ChatWindow 
              chatName={roomData?.getChatRoom?.name || "Chat Room"}
              messages={messages}
              onSendMessage={handleSendMessage}
              onUserClick={handleUserClick}
              loggedInUser={username}
              participants={roomData?.getChatRoom?.participants || []}
              isOwner={isOwner}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a chat room to start messaging</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatDashboard;