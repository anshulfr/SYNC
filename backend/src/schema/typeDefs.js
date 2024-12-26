import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Upload
  scalar Date

  type User {
    id: ID!
    username: String!
    email: String!
    profilePicture: String
    createdAt: Date!
  }

  type File {
    url: String!
    filename: String!
    contentType: String!
    size: Int!
    isImage: Boolean!
  }

  type ReadReceipt {
    user: User!
    readAt: Date!
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    chatRoom: ChatRoom!
    sentAt: Date!
    file: File
    readBy: [ReadReceipt!]!
  }

  type ChatRoom {
    id: ID!
    name: String!
    owner: User!
    participants: [User!]!
    messages: [Message!]!
    joinLink: String!
  }

  type Query {
    getChatRooms: [ChatRoom!]!
    getMessages(chatRoomId: ID!, limit: Int, offset: Int): [Message!]!
    getChatRoom(chatRoomId: ID!): ChatRoom!
  }

  type Mutation {
    sendMessage(chatRoomId: ID!, content: String!, senderId: ID!, file: Upload): Message!
    createChatRoom(name: String!, ownerId: ID!): ChatRoom!
    joinChatRoom(chatRoomId: ID!, userId: ID!): ChatRoom!
    joinChatRoomByLink(joinLink: String!, userId: ID!): ChatRoom!
    signup(username: String!, email: String!, password: String!, profilePicture: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    markMessageAsRead(messageId: ID!, userId: ID!): Message!
  }

  type Subscription {
    messageAdded(chatRoomId: ID!): Message
    messageRead(chatRoomId: ID!): Message!
  }

  type AuthPayload {
    user: User!
    token: String!
  }
`;

export default typeDefs;
