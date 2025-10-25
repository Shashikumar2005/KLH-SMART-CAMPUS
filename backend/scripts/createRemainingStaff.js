const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Generate random secure password
const generatePassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@#$%&*';
  const all = uppercase + lowercase + numbers + special;
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Remaining staff with unique names and emails
const remainingStaff = [
  {
    name: 'Shashi Kumar',
    email: 'shashi3891@klh.edu.in',
    password: generatePassword(),
    role: 'faculty',
    department: 'Computer Science',
    phone: '9876543230'
  },
  {
    name: 'Hemanth Reddy',
    email: 'hemanth4567@klh.edu.in',
    password: generatePassword(),
    role: 'faculty',
    department: 'Information Technology',
    phone: '9876543231'
  },
  {
    name: 'Pavan Krishna',
    email: 'pavan6789@klh.edu.in',
    password: generatePassword(),
    role: 'faculty',
    department: 'Computer Science',
    phone: '9876543232'
  },
  {
    name: 'Sneha Sharma',
    email: 'sneha2345@klh.edu.in',
    password: generatePassword(),
    role: 'faculty',
    department: 'Physics',
    phone: '9876543233'
  }
];

const createRemainingStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('👨‍🏫 CREATING REMAINING STAFF ACCOUNTS');
    console.log('═══════════════════════════════════════════════════════════\n');

    const createdAccounts = [];

    for (const staff of remainingStaff) {
      const exists = await User.findOne({ email: staff.email });
      
      if (exists) {
        console.log(`⚠️  ${staff.email} already exists - Skipping\n`);
        continue;
      }

      await User.create(staff);
      createdAccounts.push(staff);
      
      console.log(`✅ Created: ${staff.name}`);
      console.log(`   Email: ${staff.email}`);
      console.log(`   Password: ${staff.password}`);
      console.log(`   Department: ${staff.department}\n`);
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 ALL STAFF CREDENTIALS:');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    createdAccounts.forEach((staff, i) => {
      console.log(`${i + 1}. ${staff.name}`);
      console.log(`   Email: ${staff.email}`);
      console.log(`   Password: ${staff.password}`);
      console.log(`   Department: ${staff.department}\n`);
    });

    // Save to file
    const fs = require('fs');
    const filename = `backend/scripts/STAFF_CREDENTIALS_REMAINING.txt`;
    
    let content = '═══════════════════════════════════════════════════════════\n';
    content += 'REMAINING STAFF CREDENTIALS - CONFIDENTIAL\n';
    content += `Created: ${new Date().toLocaleString()}\n`;
    content += '═══════════════════════════════════════════════════════════\n\n';
    
    createdAccounts.forEach((staff, i) => {
      content += `${i + 1}. ${staff.name}\n`;
      content += `   Email: ${staff.email}\n`;
      content += `   Password: ${staff.password}\n`;
      content += `   Department: ${staff.department}\n\n`;
    });
    
    fs.writeFileSync(filename, content);
    console.log(`💾 Saved to: ${filename}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createRemainingStaff();
