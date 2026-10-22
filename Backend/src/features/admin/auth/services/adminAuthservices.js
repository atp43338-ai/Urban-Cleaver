const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT Token for authenticated administrator
const generateToken = (userId, role = 'admin') => {
  const secret = process.env.JWT_SECRET || 'urbancleaver_super_secret_jwt_key_2026_secure!';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

// Helper to normalize Indian phone number (+91 format)
const normalizePhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+91')) return cleaned;
  if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
  if (cleaned.length === 10) return `+91${cleaned}`;
  return cleaned;
};

class AdminAuthService {
  /**
   * Authenticate Administrator with email/phone & password
   */
  async login({ identifier, email, phone, password }) {
    const rawTarget = (email || identifier || phone || '').trim();

    if (!rawTarget) {
      const error = new Error('Admin email or registered phone number is required');
      error.statusCode = 400;
      throw error;
    }

    if (!password) {
      const error = new Error('Password is required');
      error.statusCode = 400;
      throw error;
    }

    const isEmail = rawTarget.includes('@');
    const lookupQuery = isEmail
      ? { email: rawTarget.toLowerCase() }
      : { phone: normalizePhone(rawTarget) };

    const adminUser = await User.findOne(lookupQuery).select('+password');

    if (!adminUser) {
      const error = new Error('Invalid credentials or account does not exist');
      error.statusCode = 401;
      throw error;
    }

    // Verify role is strictly 'admin'
    if (adminUser.role !== 'admin') {
      const error = new Error('Access denied: You do not have administrator permissions');
      error.statusCode = 403;
      throw error;
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email, phone, or password');
      error.statusCode = 401;
      throw error;
    }

    if (adminUser.isBlocked) {
      const error = new Error('Your administrative account is currently suspended');
      error.statusCode = 403;
      throw error;
    }

    const token = generateToken(adminUser._id, adminUser.role);

    return {
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
        role: adminUser.role,
      },
      token,
    };
  }
}

module.exports = new AdminAuthService();
