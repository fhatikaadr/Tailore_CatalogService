require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'default-secret-key-change-this',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
