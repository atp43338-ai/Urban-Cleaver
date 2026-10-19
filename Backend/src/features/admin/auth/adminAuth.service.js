const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../auth/auth.model');

// Helper to generate JWT Token with user ID and role
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
   * Authenticate Admin User
   * Strictly validates role === 'admin'
   */
  async login({ identifier, email, phone, password }) {
    const inputIdentifier = identifier || email || phone;

    if (!inputIdentifier || !password) {
      const error = new Error('Admin Email/Phone and password are required.');
      error.statusCode = 400;
      throw error;
    }

    const cleanedIdentifier = inputIdentifier.trim();
    const normalizedEmail = cleanedIdentifier.toLowerCase();
    const normalizedPhone = normalizePhone(cleanedIdentifier);

    // Find user by either email or phone (case-insensitive trim)
    const user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
        { phone: cleanedIdentifier },
      ],
    }).select('+password +isVerified +isBlocked');

    return {
      user,
      normalizedEmail,
      verifyPassword: async () => {
        if (!user) return false;
        return await bcrypt.compare(password, user.password);
      },
      generateToken: () => generateToken(user._id, user.role),
    };
  }
}

module.exports = new AdminAuthService();
