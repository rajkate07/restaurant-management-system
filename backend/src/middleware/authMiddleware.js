const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * protect - Middleware to verify JWT and attach user to request
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in the "Authorization" header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using our Secret Key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get the user from DB (excluding password for security)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      next(); // Move to the actual Controller logic
    } catch (error) {
      console.error("Token Auth Error:", error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};