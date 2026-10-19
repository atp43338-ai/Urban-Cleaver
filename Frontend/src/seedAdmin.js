require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./features/auth/auth.model');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    const adminEmail = 'admin@urbancleaver.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const adminUser = new User({
      name: 'Super Admin',
      email: adminEmail,
      phone: '+919876543210',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isBlocked: false,
    });

    await adminUser.save();
    console.log('Default Admin Created Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();