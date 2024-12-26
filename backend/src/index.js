import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import cors from 'cors';
import connectDB from './config/db.js';
import schema from './schema/schema.js';

// Initialize MongoDB connection
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Add middleware for handling file uploads before Apollo Server middleware
app.use(graphqlUploadExpress({
  maxFileSize: 10000000, // 10 MB
  maxFiles: 10
}));

// Apollo Server Setup
const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { req, token };
  },
  uploads: false // Disable built-in upload handling
});

await apolloServer.start();
apolloServer.applyMiddleware({ app });

// HTTP Server
const httpServer = http.createServer(app);

// WebSocket Server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

useServer({ schema, execute, subscribe }, wsServer);

// Server Port
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
});