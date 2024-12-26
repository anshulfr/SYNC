import { verifyToken } from './authHelpers.js';

export const authMiddleware = (resolver) => async (parent, args, context, info) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) throw new Error('Authorization header missing');

  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);

  context.user = user;
  return resolver(parent, args, context, info);
};