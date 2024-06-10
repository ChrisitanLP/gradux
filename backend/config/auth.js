// auth.js

require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, email: user.email, rol: user.rol }, jwtSecret, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = { generateAccessToken, verifyToken };
