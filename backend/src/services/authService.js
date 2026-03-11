const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * AuthService
 * Handles the logic for Registering and Logging in users.
 */
class AuthService {
  // Logic to create a new staff member
  async register(userData) {
    const { name, email, password, role } = userData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error('User already exists with this email');

    // Create user (The 'beforeCreate' hook in our Model will hash the password)
    const user = await User.create({ name, email, password, role });
    return user;
  }

  // Logic to verify credentials and issue a JWT
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.active) throw new Error('Invalid credentials or inactive account');

    // Compare plain-text password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    // Generate JWT Token (Valid for 1 day)
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { user, token };
  }
}

module.exports = new AuthService();