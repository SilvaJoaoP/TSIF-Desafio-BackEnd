const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password
      });

      // Don't send password in response
      user.password = undefined;

      return res.status(201).json({
        user,
        token: this.generateToken(user)
      });
    } catch (error) {
      return res.status(500).json({ error: 'Registration failed', details: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Check if password matches
      const passwordValid = await user.checkPassword(password);
      if (!passwordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Don't send password in response
      user.password = undefined;

      return res.json({
        user,
        token: this.generateToken(user)
      });
    } catch (error) {
      return res.status(500).json({ error: 'Authentication failed', details: error.message });
    }
  }

  generateToken(user) {
    // JWT_SECRET should be defined in your environment variables
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d' // Token expires in 7 days
    });
  }
}

module.exports = new AuthController();