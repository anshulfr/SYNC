import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './typeDefs.js';
import resolvers from '../resolvers/index.js';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;