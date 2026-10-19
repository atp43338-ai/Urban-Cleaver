const adminAuthService = require('./adminAuth.service');

class AdminAuthController {
  /**
   * POST /api/admin/auth/login
   */
  async login(req, res, next) {
    try {
      const { identifier, email, phone, password } = req.body;
      const targetId = (email || identifier || phone || '').trim();

      console.log('\n======================================================');
      console.log(`[Admin Auth] >>> Login attempt received for: "${targetId}"`);

      if (!targetId || !password) {
        console.warn('[Admin Auth] ❌ Missing identifier or password in request body.');
        console.log('======================================================\n');
        return res.status(400).json({
          success: false,
          message: 'Email/Phone and password are required.',
        });
      }

      const authData = await adminAuthService.login({
        identifier: targetId,
        email,
        phone,
        password,
      });

      const { user } = authData;

      // 1. Check if user exists
      if (!user) {
        console.warn(`[Admin Auth] User found: NO (Target: "${targetId}")`);
        console.warn('[Admin Auth] ❌ Result: Authentication failed (401)');
        console.log('======================================================\n');
        return res.status(401).json({
          success: false,
          message: 'Invalid administrative credentials.',
        });
      }

      console.log(`[Admin Auth] User found: YES (ID: ${user._id}, Email: ${user.email}, Phone: ${user.phone})`);

      // 2. Check Password
      const isMatch = await authData.verifyPassword();
      console.log(`[Admin Auth] Password match: ${isMatch ? 'YES' : 'NO'}`);

      if (!isMatch) {
        console.warn(`[Admin Auth] ❌ Result: Password mismatch for ${user.email} (401)`);
        console.log('======================================================\n');
        return res.status(401).json({
          success: false,
          message: 'Invalid administrative credentials.',
        });
      }

      // 3. Check Role
      console.log(`[Admin Auth] Role verification: Current role="${user.role}", Required="admin"`);
      if (user.role !== 'admin') {
        console.warn(`[Admin Auth] ❌ Result: Access denied (403) - user has role "${user.role}", not "admin"`);
        console.log('======================================================\n');
        return res.status(403).json({
          success: false,
          message: 'Access denied: Account does not have administrative privileges.',
        });
      }

      // 4. Check Blocked Status
      if (user.isBlocked) {
        console.warn(`[Admin Auth] ❌ Result: Access denied (403) - account is suspended`);
        console.log('======================================================\n');
        return res.status(403).json({
          success: false,
          message: 'Administrative account is suspended. Please contact system administrator.',
        });
      }

      // 5. Generate and return JWT token
      const token = authData.generateToken();
      console.log(`[Admin Auth] ✓ Result: Login SUCCESSFUL! Token generated for ${user.email}`);
      console.log('======================================================\n');

      return res.status(200).json({
        success: true,
        message: 'Admin authenticated successfully. Welcome to Urban Cleaver Console.',
        token,
        user: user.toSafeObject(),
      });
    } catch (err) {
      console.error(`[Admin Auth] ❌ Server Error: ${err.message}`);
      console.log('======================================================\n');
      next(err);
    }
  }
}

module.exports = new AdminAuthController();
