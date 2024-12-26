import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import { generateToken } from '../utils/authHelpers.js';
import ChatRoom from '../models/ChatRoom.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { pubsub } from './subscriptions.js';
import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { finished } from 'stream/promises';


const mutationResolvers = {
  sendMessage: async (_, { chatRoomId, content, senderId, file }) => {
    try {
      const sender = await User.findById(senderId);
      const chatRoom = await ChatRoom.findById(chatRoomId);
  
      if (!sender || !chatRoom) {
        throw new Error('Invalid sender or chat room');
      }
  
      let fileData = null;
      if (file) {
        try {
          // Get file details
          const { createReadStream, filename, mimetype } = await file;
          const stream = createReadStream();
          
          // Convert stream to buffer
          const chunks = [];
          for await (const chunk of stream) {
            chunks.push(chunk);
          }
          const buffer = Buffer.concat(chunks);
          
          // Create unique filename
          const timestamp = Date.now();
          const uniqueFilename = `${timestamp}-${filename}`;
          
          // Create Firebase storage reference
          const storageRef = ref(storage, `files/${chatRoomId}/${uniqueFilename}`);
          
          // Upload to Firebase Storage
          await uploadBytes(storageRef, buffer, {
            contentType: mimetype
          });
  
          // Get download URL
          const downloadURL = await getDownloadURL(storageRef);
  
          fileData = {
            url: downloadURL,
            filename: filename,
            contentType: mimetype,
            size: buffer.length,
            isImage: mimetype.startsWith('image/')
          };
        } catch (error) {
          console.error('File upload error:', error);
          throw new Error('Error uploading file');
        }
      }
  
      const message = await Message.create({
        content: content || " ",
        sender: senderId,
        chatRoom: chatRoomId,
        sentAt: new Date().toISOString(),
        file: fileData
      });
  
      await chatRoom.messages.push(message._id);
      await chatRoom.save();
  
      const populatedMessage = await message.populate('sender chatRoom');
      await pubsub.publish(`MESSAGE_ADDED.${chatRoomId}`, {
        messageAdded: populatedMessage,
      });
  
      return populatedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Error sending message');
    }
  },

  createChatRoom: async (_, { name, ownerId }) => {
    try {
      const owner = await User.findById(ownerId);
      if (!owner) {
        throw new Error('Owner not found');
      }
  
      const joinLink = uuidv4(); // Generate a unique link
  
      const chatRoom = await ChatRoom.create({
        name,
        owner: ownerId,
        participants: [ownerId], // Ensure owner is added as participant
        messages: [],
        joinLink,
      });
  
      // Populate the chat room with participant and owner details
      await chatRoom.populate([
        {
          path: 'participants',
          select: 'id username email'
        },
        {
          path: 'owner',
          select: 'id username email'
        }
      ]);
  
      return chatRoom;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw new Error('Error creating chat room');
    }
  },

  joinChatRoomByLink: async (_, { joinLink, userId }) => {
    try {
      const chatRoom = await ChatRoom.findOne({ joinLink });
      const user = await User.findById(userId);

      if (!chatRoom || !user) {
        throw new Error('Chat room or user not found');
      }

      if (!chatRoom.participants.includes(userId)) {
        chatRoom.participants.push(userId);
        await chatRoom.save();
      }

      await chatRoom.populate('participants');

      return chatRoom;
    } catch (error) {
      console.error('Error joining chat room:', error.message);
      throw new Error('Error joining chat room');
    }
  },

  signup: async (_, { username, email, password, profilePicture }) => {
    try {
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) throw new Error('User with this email already exists');
  
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername) throw new Error('Username already taken');
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        profilePicture: profilePicture || null, // Handle null case
      });
  
      const token = generateToken(user);
      return { 
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
        }, 
        token 
      };
    } catch (error) {
      console.error('Signup Error:', error.message);
      throw new Error('Error signing up');
    }
  },

  login: async (_, { email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user);
      return { user, token };
    } catch (error) {
      console.error('Login Error:', error.message);
      throw new Error('Error logging in');
    }
  },

  markMessageAsRead: async (_, { messageId, userId }) => {
    try {
      const message = await Message.findById(messageId);
      const user = await User.findById(userId);

      if (!message || !user) {
        throw new Error('Message or user not found');
      }

      // Check if user hasn't already read the message
      if (!message.readBy.some(receipt => receipt.user.toString() === userId)) {
        message.readBy.push({
          user: userId,
          readAt: new Date()
        });
        await message.save();

        // Populate the message data
        const populatedMessage = await message.populate([
          { path: 'sender' },
          { path: 'chatRoom' },
          { path: 'readBy.user' }
        ]);

        // Publish the read receipt
        await pubsub.publish(`MESSAGE_READ.${message.chatRoom}`, {
          messageRead: populatedMessage
        });

        return populatedMessage;
      }

      return message;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw new Error('Error marking message as read');
    }
  }
};

export default mutationResolvers;