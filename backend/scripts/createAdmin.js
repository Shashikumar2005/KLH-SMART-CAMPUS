// Script to create the first admin user
// Run this with: node backend/scripts/createAdmin.js

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Creating admin user...\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@klh.edu.in' });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email: admin@klh.edu.in');
      console.log('User details:');
      console.log('- Name:', existingAdmin.name);
      console.log('- Email:', existingAdmin.email);
      console.log('- Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'System Administrator',
      email: 'admin@klh.edu.in',
      password: 'Admin@123', // Change this password after first login!
      role: 'admin',
      department: 'Administration',
      phone: '9999999999',
      isActive: true,
    };

    const admin = await User.create(adminData);

    console.log('✅ Admin user created successfully!\n');
    console.log('Login Credentials:');
    console.log('==================');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123');
    console.log('Role:', admin.role);
    console.log('\n⚠️  IMPORTANT: Please change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

// Run the script
createAdmin();
