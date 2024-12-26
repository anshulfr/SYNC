import queryResolvers from './queries.js';
import mutationResolvers from './mutations.js';
import subscriptionResolvers from './subscriptions.js';

const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Subscription: subscriptionResolvers
};

export default resolvers;