import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import cors from 'cors';
import connectDB from './config/db.js';
import schema from './schema/schema.js';

// Initialize MongoDB connection
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Apollo Server Setup
const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { req, token };
  },
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