/**
 * Admin Role Verification Middleware
 * Requires that req.user is set (via auth.middleware.js) and role === 'admin'
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required before role verification.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required.',
    });
  }

  next();
};

module.exports = { requireAdmin };
