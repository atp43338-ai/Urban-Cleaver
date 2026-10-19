const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('./auth.model');
const { sendEmail, getOtpEmailTemplate } = require('../../utils/sendEmail');

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(googleClientId);

/**
 * Generate a cryptographically secure 6-digit OTP
 */
const generateSecureOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Normalize Indian phone numbers into standard +91 format
 */
const normalizePhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+91')) {
    return cleaned;
  }
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return cleaned;
};

/**
 * Generate JWT Token with user ID and role
 */
const generateToken = (userId, role = 'user') => {
  const secret = process.env.JWT_SECRET || 'urbancleaver_super_secret_jwt_key_2026_secure!';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

class AuthService {
  /**
   * Register a new customer
   * Generates secure 6-digit OTP, hashes OTP into DB, and sends branded verification email via Gmail SMTP
   */
  async register({ name, email, phone, password, confirmPassword }) {
    if (!name || !email || !phone || !password) {
      const error = new Error('All fields are required');
      error.statusCode = 400;
      throw error;
    }

    if (password !== confirmPassword) {
      const error = new Error('Passwords do not match');
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = normalizePhone(phone);

    // Validate phone number format (+91 followed by 10 digits starting 6-9)
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      const error = new Error('Please enter a valid 10-digit Indian phone number (e.g. +919876543210)');
      error.statusCode = 400;
      throw error;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    }).select('+isVerified');

    // Generate secure 6-digit OTP and hash it with bcrypt
    const plainOtp = generateSecureOtp();
    const otpSalt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(plainOtp, otpSalt);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;

    if (existingUser) {
      if (existingUser.isVerified) {
        const error = new Error('An account with this email or phone is already verified. Please log in.');
        error.statusCode = 409;
        throw error;
      }

      // If user registered before but was unverified, update their details and re-issue OTP
      existingUser.name = name.trim();
      existingUser.email = normalizedEmail;
      existingUser.phone = normalizedPhone;
      existingUser.password = hashedPassword;
      existingUser.otp = hashedOtp;
      existingUser.otpExpires = otpExpires;
      user = await existingUser.save();
    } else {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
        isVerified: false,
        otp: hashedOtp,
        otpExpires,
      });
    }

    // Dispatch branded verification email via Gmail SMTP
    await sendEmail({
      to: normalizedEmail,
      subject: 'Verify your Urban Cleaver Account',
      html: getOtpEmailTemplate({
        name: user.name,
        otp: plainOtp,
        purpose: 'Email Verification',
        expiryMinutes: 10,
      }),
      text: `Your Urban Cleaver verification OTP is ${plainOtp}. Valid for 10 minutes.`,
      fallbackOtp: plainOtp,
    });

    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  }

  /**
   * Verify Customer OTP
   */
  async verifyOtp({ email, otp }) {
    if (!email || !otp) {
      const error = new Error('Email and OTP are required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpires');

    if (!user) {
      const error = new Error('No account found associated with this email');
      error.statusCode = 404;
      throw error;
    }

    if (!user.otp || !user.otpExpires) {
      const error = new Error('No pending OTP verification found. Please request a new OTP.');
      error.statusCode = 400;
      throw error;
    }

    if (new Date() > user.otpExpires) {
      const error = new Error('OTP has expired. Please request a new code.');
      error.statusCode = 400;
      throw error;
    }

    // Verify OTP using bcrypt compare (with graceful fallback for legacy plaintext if any)
    let isMatch = false;
    const providedOtp = otp.toString().trim();
    if (user.otp.startsWith('$2a$') || user.otp.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(providedOtp, user.otp);
    } else {
      isMatch = user.otp.toString().trim() === providedOtp;
    }

    if (!isMatch) {
      const error = new Error('Invalid OTP code. Please check and try again.');
      error.statusCode = 400;
      throw error;
    }

    // OTP is valid - mark verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: user.toSafeObject(),
    };
  }

  /**
   * Resend Customer OTP
   */
  async resendOtp({ email }) {
    if (!email) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+isVerified');

    if (!user) {
      const error = new Error('No account found with this email');
      error.statusCode = 404;
      throw error;
    }

    if (user.isVerified) {
      const error = new Error('This account is already verified. Please log in.');
      error.statusCode = 400;
      throw error;
    }

    const plainOtp = generateSecureOtp();
    const otpSalt = await bcrypt.genSalt(10);
    user.otp = await bcrypt.hash(plainOtp, otpSalt);
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: normalizedEmail,
      subject: 'Your New Urban Cleaver Verification OTP',
      html: getOtpEmailTemplate({
        name: user.name,
        otp: plainOtp,
        purpose: 'Email Verification',
        expiryMinutes: 10,
      }),
      text: `Your new Urban Cleaver verification OTP is ${plainOtp}. Valid for 10 minutes.`,
      fallbackOtp: plainOtp,
    });

    return { email: user.email };
  }

  /**
   * Login user with Email or Phone
   */
  async login({ identifier, password }) {
    if (!identifier || !password) {
      const error = new Error('Email/Phone and password are required');
      error.statusCode = 400;
      throw error;
    }

    const cleanedIdentifier = identifier.trim();
    const normalizedEmail = cleanedIdentifier.toLowerCase();
    const normalizedPhone = normalizePhone(cleanedIdentifier);

    // Find by either email or phone
    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }, { phone: cleanedIdentifier }],
    }).select('+password +isVerified +isBlocked');

    if (!user) {
      const error = new Error('Invalid email/phone or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email/phone or password');
      error.statusCode = 401;
      throw error;
    }

    // Check blocked status
    if (user.isBlocked) {
      const error = new Error('Your account has been suspended. Please contact Urban Cleaver support.');
      error.statusCode = 403;
      throw error;
    }

    // Check verification status
    if (!user.isVerified) {
      // Re-issue a fresh secure hashed OTP on unverified login
      const plainOtp = generateSecureOtp();
      const otpSalt = await bcrypt.genSalt(10);
      user.otp = await bcrypt.hash(plainOtp, otpSalt);
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendEmail({
        to: user.email,
        subject: 'Verify your Urban Cleaver Account',
        html: getOtpEmailTemplate({
          name: user.name,
          otp: plainOtp,
          purpose: 'Account Verification',
          expiryMinutes: 10,
        }),
        text: `Your Urban Cleaver verification OTP is ${plainOtp}. Valid for 10 minutes.`,
        fallbackOtp: plainOtp,
      });

      const error = new Error('Account is not verified. A fresh OTP has been sent to your email.');
      error.statusCode = 403;
      error.code = 'UNVERIFIED';
      error.email = user.email;
      throw error;
    }

    const token = generateToken(user._id, user.role);

    return {
      token,
      user: user.toSafeObject(),
    };
  }

  /**
   * Authenticate or register customer via Google OAuth ID token
   */
  async googleLogin({ credential, token }) {
    const idToken = credential || token;
    if (!idToken) {
      const error = new Error('Google credential token is required');
      error.statusCode = 400;
      throw error;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: clientId,
      });
    } catch (err) {
      const error = new Error('Invalid Google credential token: ' + err.message);
      error.statusCode = 401;
      throw error;
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      const error = new Error('Google authentication failed. No verified email provided by Google account.');
      error.statusCode = 400;
      throw error;
    }

    const { sub: googleId, email, name, picture } = payload;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail }).select('+isBlocked');

    if (user) {
      // Check blocked status
      if (user.isBlocked) {
        const error = new Error('Your account has been suspended. Please contact Urban Cleaver support.');
        error.statusCode = 403;
        throw error;
      }

      // Mark verified since Google email is verified
      let modified = false;
      if (!user.isVerified) {
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        modified = true;
      }
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        modified = true;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    } else {
      // Create new customer record with dummy secure password
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: name || 'Google Customer',
        email: normalizedEmail,
        googleId,
        avatar: picture || null,
        password: hashedPassword,
        isVerified: true,
        role: 'user',
        isBlocked: false,
      });
    }

    const appToken = generateToken(user._id, user.role);

    return {
      token: appToken,
      user: user.toSafeObject(),
    };
  }

  /**
   * Request Forgot Password OTP
   */
  async forgotPassword({ email }) {
    if (!email) {
      const error = new Error('Email address is required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const error = new Error('No account found registered with this email address');
      error.statusCode = 404;
      throw error;
    }

    const plainOtp = generateSecureOtp();
    const otpSalt = await bcrypt.genSalt(10);
    user.otp = await bcrypt.hash(plainOtp, otpSalt);
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: normalizedEmail,
      subject: 'Reset your Urban Cleaver Password',
      html: getOtpEmailTemplate({
        name: user.name,
        otp: plainOtp,
        purpose: 'Password Reset',
        expiryMinutes: 10,
      }),
      text: `Your password reset code is ${plainOtp}. Valid for 10 minutes.`,
      fallbackOtp: plainOtp,
    });

    return { email: user.email };
  }

  /**
   * Reset Password with OTP
   */
  async resetPassword({ email, otp, newPassword, confirmPassword }) {
    if (!email || !otp || !newPassword) {
      const error = new Error('Email, OTP code, and new password are required');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword !== confirmPassword) {
      const error = new Error('New password and confirmation do not match');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpires +password');

    if (!user) {
      const error = new Error('No account found with this email');
      error.statusCode = 404;
      throw error;
    }

    if (!user.otp || !user.otpExpires) {
      const error = new Error('No reset request found. Please request a password reset first.');
      error.statusCode = 400;
      throw error;
    }

    if (new Date() > user.otpExpires) {
      const error = new Error('Reset OTP has expired. Please request a new one.');
      error.statusCode = 400;
      throw error;
    }

    // Verify OTP using bcrypt compare (with graceful fallback for legacy plaintext)
    let isMatch = false;
    const providedOtp = otp.toString().trim();
    if (user.otp.startsWith('$2a$') || user.otp.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(providedOtp, user.otp);
    } else {
      isMatch = user.otp.toString().trim() === providedOtp;
    }

    if (!isMatch) {
      const error = new Error('Invalid OTP code. Please verify the code from your email.');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true; // Email is verified as user received and submitted the OTP
    await user.save();

    return { message: 'Password has been reset successfully. You can now log in.' };
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user.toSafeObject();
  }
}

module.exports = new AuthService();
