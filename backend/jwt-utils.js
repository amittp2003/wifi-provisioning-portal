const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'wifi-provisioning-portal-secret-key-2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const generateToken = (user) => {
  const payload = {
    id: user.email,
    email: user.email,
    name: user.name,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    return { success: true, payload: jwt.verify(token, JWT_SECRET) };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = { generateToken, verifyToken };