const jwt = require('jsonwebtoken');

// checks if a valid JWT token exists in the request header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // token is sent as "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // verify decodes the token and throws if it's invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to the request
    next();             // move on to the next middleware or controller
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// checks if the verified user has the required role
const roleGuard = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: `Access denied. ${role}s only.` });
  }
  next();
};

module.exports = { verifyToken, roleGuard };