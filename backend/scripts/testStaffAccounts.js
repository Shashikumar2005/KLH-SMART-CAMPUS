const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const testStaffLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test staff emails
    const staffEmails = [
      'shashi3891@klh.edu.in',
      'hemanth4567@klh.edu.in',
      'suvidh2098@klh.edu.in',
      'pavan6789@klh.edu.in',
      'bhuvana8722@klh.edu.in',
      'sneha2345@klh.edu.in'
    ];

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔍 CHECKING STAFF ACCOUNTS IN DATABASE');
    console.log('═══════════════════════════════════════════════════════════\n');

    for (const email of staffEmails) {
      const user = await User.findOne({ email }).select('+password');
      
      if (user) {
        console.log(`✅ FOUND: ${email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Department: ${user.department}`);
        console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);
        console.log(`   Active: ${user.isActive}\n`);
      } else {
        console.log(`❌ NOT FOUND: ${email}\n`);
      }
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔑 LOGIN TEST CREDENTIALS');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('Use these credentials to login:\n');
    console.log('1. shashi3891@klh.edu.in / 4YvEkt$87@cj');
    console.log('2. hemanth4567@klh.edu.in / BjHC&61mIT9N');
    console.log('3. suvidh2098@klh.edu.in / h0joh$ETkMCm');
    console.log('4. pavan6789@klh.edu.in / Yhd%94EE%@3V');
    console.log('5. bhuvana8722@klh.edu.in / 7%#2ljew9XrL');
    console.log('6. sneha2345@klh.edu.in / vYEpCsb*l3cQ\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testStaffLogin();
