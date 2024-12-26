import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client';
import { toast } from 'react-toastify';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatRoomList from './ChatRoomList';

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

const SEND_MESSAGE = gql`
  mutation SendMessage($chatRoomId: ID!, $content: String!, $senderId: ID!) {
    sendMessage(chatRoomId: $chatRoomId, content: $content, senderId: $senderId) {
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
      Link
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageSent($chatRoomId: ID!) {
    messageSent(chatRoomId: $chatRoomId) {
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

const ChatRoom = () => {
  const { id: chatRoomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const { loading: messagesLoading, data: messagesData, refetch: refetchMessages } = useQuery(GET_MESSAGES, {
    variables: { 
      chatRoomId,
      limit: 50,
      offset: 0
    },
    pollInterval: 1000, // Poll every second
    fetchPolicy: 'network-only',
  });

  const { data: subData } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { chatRoomId },
  });

  const { loading: roomLoading, data: roomData } = useQuery(GET_CHAT_ROOM, {
    variables: { chatRoomId },
  });

  useEffect(() => {
    if (messagesData?.getMessages) {
      setMessages(messagesData.getMessages);
    }
  }, [messagesData]);

  useEffect(() => {
    if (subData?.messageSent) {
      setMessages(prevMessages => [...prevMessages, subData.messageSent]);
      toast.info("New message received!");
    }
  }, [subData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchMessages();
    }, 500); 

    return () => clearInterval(intervalId);
  }, [refetchMessages]);

  useEffect(() => {
    refetchMessages();
  }, [chatRoomId, refetchMessages]);

  const handleSendMessage = async (content) => {
    try {
      const { data } = await sendMessage({
        variables: {
          chatRoomId,
          content,
          senderId: userId,
        },
      });

      if (data?.sendMessage) {
        setMessages(prevMessages => [...prevMessages, data.sendMessage]);
        toast.success("Message sent!");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message.");
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const getUniqueParticipants = (participants) => {
    const uniqueParticipants = [];
    const seen = new Set();
    
    participants.forEach(participant => {
      if (!seen.has(participant.id)) {
        seen.add(participant.id);
        uniqueParticipants.push(participant);
      }
    });
    
    return uniqueParticipants;
  };

  if (messagesLoading || roomLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-white">Loading messages...</div>
      </div>
    );
  }

  const isOwner = roomData?.getChatRoom?.owner?.id === userId;

  return (
    <div className="flex h-screen">
      <div className="flex-grow flex flex-col">
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              {roomData?.getChatRoom?.name || "Chat Room"}
            </h2>
            <div className="flex items-center space-x-2">
              {roomData?.getChatRoom?.participants?.map((participant) => (
                <div 
                  key={participant.id} 
                  onClick={() => handleUserClick(participant)}
                  className="cursor-pointer group relative"
                >
                  {participant.profilePicture ? (
                    <img 
                      src={participant.profilePicture} 
                      alt={participant.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                      {participant.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden group-hover:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                    {participant.username}
                    {isOwner && participant.id === roomData.getChatRoom.owner.id && ' (Owner)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-grow bg-gray-900 overflow-y-auto">
          <MessageList 
            messages={messages} 
            onUserClick={handleUserClick} 
            loggedInUser={username}
          />
        </div>
        <div className="bg-gray-800 p-4">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>

      <div className="w-64 bg-gray-800 border-l border-gray-700">
        <div className="p-0">
          <h3 className="text-lg font-semibold text-white mb-4">Chat Rooms</h3>
          <ChatRoomList />
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-gray-800 p-6 rounded-lg" onClick={e => e.stopPropagation()}>
            <h4 className="text-lg font-semibold text-white mb-4">User Profile</h4>
            <p className="text-white"><strong>Username:</strong> {selectedUser.username}</p>
            <p className="text-white"><strong>Email:</strong> {selectedUser.email}</p>
            <button 
              onClick={handleCloseModal}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;