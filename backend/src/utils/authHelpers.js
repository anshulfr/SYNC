import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const payload = { id: user._id, username: user.username };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};
  