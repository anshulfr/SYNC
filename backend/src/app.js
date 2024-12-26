import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema/typeDefs.js';
import resolvers from './resolvers/index.js';
import connectDB from './config/db.js';

const app = express();

// Connect to MongoDB
connectDB();

// Setup Apollo Server
const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) });
await server.start();
server.applyMiddleware({ app });

export default app;
