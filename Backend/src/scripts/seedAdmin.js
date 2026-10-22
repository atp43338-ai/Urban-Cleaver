const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const User = require('../features/auth/models/User');

const ADMIN_EMAIL = 'admin@urbancleaver.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_PHONE = '+919876543210';
const ADMIN_NAME = 'System Administrator';

async function seedAdmin() {
  console.log('\n======================================================');
  console.log('   URBAN CLEAVER - DATABASE ADMIN SEEDING UTILITY    ');
  console.log('======================================================\n');

  if (!process.env.MONGO_URI) {
    console.error('❌ Error: MONGO_URI is not defined in Backend/.env');
    process.exit(1);
  }

  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] ✓ Connected to MongoDB successfully.');

    // Generate fresh bcrypt hash
    console.log(`[Seed] Encrypting password "${ADMIN_PASSWORD}" with bcrypt (10 rounds)...`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Look for existing user
    let user = await User.findOne({ email: ADMIN_EMAIL }).select('+password +isVerified +isBlocked');

    if (user) {
      console.log(`[Seed] Existing user found for ${ADMIN_EMAIL}. Updating credentials...`);
      user.name = ADMIN_NAME;
      user.password = hashedPassword;
      user.role = 'admin';
      user.isVerified = true;
      user.isBlocked = false;
      user.otp = undefined;
      user.otpExpires = undefined;
      if (!user.phone) {
        user.phone = ADMIN_PHONE;
      }
      await user.save();
      console.log(`[Seed] ✓ Updated existing user to role="admin" with fresh password.`);
    } else {
      console.log(`[Seed] No account found with email ${ADMIN_EMAIL}. Creating fresh Admin account...`);
      // Check if phone number is already occupied
      const phoneUser = await User.findOne({ phone: ADMIN_PHONE });
      const phoneToUse = phoneUser ? `+9199${Math.floor(10000000 + Math.random() * 90000000)}` : ADMIN_PHONE;

      user = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        phone: phoneToUse,
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        isBlocked: false,
      });
      console.log(`[Seed] ✓ Created brand-new Admin account (ID: ${user._id}).`);
    }

    // Verify Password Hash Integrity
    const verifyMatch = await bcrypt.compare(ADMIN_PASSWORD, user.password);
    console.log(`[Seed] Verifying password encryption match: ${verifyMatch ? 'PASSED ✓' : 'FAILED ❌'}`);

    if (!verifyMatch) {
      throw new Error('Self-test password verification failed.');
    }

    console.log('\n======================================================');
    console.log('   ADMIN CREDENTIALS GUARANTEED IN DATABASE          ');
    console.log('======================================================');
    console.log(` Email:     ${ADMIN_EMAIL}`);
    console.log(` Password:  ${ADMIN_PASSWORD}`);
    console.log(` Role:      ${user.role}`);
    console.log(` Verified:  ${user.isVerified}`);
    console.log(` Blocked:   ${user.isBlocked}`);
    console.log(` Phone:     ${user.phone}`);
    console.log('======================================================\n');
    console.log('You can now log into the Admin portal at:');
    console.log(' >>> http://localhost:5173/admin/login <<<\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding Failed with Error:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedAdmin();
