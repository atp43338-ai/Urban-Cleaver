const jwt = require('jsonwebtoken');

/**
 * Admin Authentication & Authorization Middleware
 * Verifies Bearer JWT and guarantees role === 'admin'
 */
const requireAdmin = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No authentication token provided.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'urbancleaver_super_secret_jwt_key_2026_secure!'
    );

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator privileges required.',
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Invalid or expired authentication token.',
    });
  }
};

module.exports = {
  requireAdmin,
  protect: requireAdmin,
};
