// Script to update admin password
// Run this with: node backend/scripts/updateAdminPassword.js

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const updateAdminPassword = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Updating admin password...\n');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@klh.edu.in' });
    
    if (!admin) {
      console.log('❌ Admin user not found with email: admin@klh.edu.in');
      process.exit(1);
    }

    // Update password
    const newPassword = 'Admin@2005';
    admin.password = newPassword;
    await admin.save(); // This will trigger the pre-save hook to hash the password

    console.log('✅ Admin password updated successfully!\n');
    console.log('New Login Credentials:');
    console.log('======================');
    console.log('Email:', admin.email);
    console.log('Password:', newPassword);
    console.log('Role:', admin.role);
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin password:', error.message);
    process.exit(1);
  }
};

// Run the script
updateAdminPassword();
