const jwt = require('jsonwebtoken');

const resolveCartUser = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'urbancleaver_super_secret_jwt_key_2026_secure!'
      );
      req.user = decoded;
      req.userId = decoded.id;
    } catch {
      // Invalid or expired token; fallback to guest identification
    }
  }

  // Fallback to guest session identifier if unauthenticated
  if (!req.userId) {
    req.userId =
      req.headers['x-session-id'] ||
      req.headers['x-guest-id'] ||
      req.body?.guestId ||
      req.query?.guestId ||
      'guest_default_session';
  }

  next();
};

module.exports = { resolveCartUser };
