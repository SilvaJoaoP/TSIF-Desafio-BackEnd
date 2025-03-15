const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Check if the authorization header contains the Bearer format
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token format is invalid' });
  }

  // Get the token from "Bearer {token}"
  const token = authHeader.substring(7);

  try {
    // JWT_SECRET should be defined in your environment variables
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user ID to the request for use in routes
    req.userId = decoded.id;
    
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};