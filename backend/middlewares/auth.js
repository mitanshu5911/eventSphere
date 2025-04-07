const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

function authenticateUser(req, res, next) {
  const authHeader = req.header('Authorization');
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = { authenticateUser };
