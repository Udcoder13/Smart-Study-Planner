const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  console.log('[AUTH] Token received:', token);
  if (!token) {
    console.warn('[AUTH] No token provided');
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); 
    if (!req.user) {
      console.warn('[AUTH] No user found for token');
      return res.status(401).json({ message: "User not found" });
    }
    console.log('[AUTH] Authenticated user:', req.user._id);
    next();
  } catch (err) {
    console.error('[AUTH] Invalid token:', err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
