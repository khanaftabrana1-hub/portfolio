export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'secretKey',
  expiresIn: '1h',
};