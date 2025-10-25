const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Generate random 4-digit number for email
const generateRandomDigits = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Generate random secure password
const generatePassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@#$%&*';
  const all = uppercase + lowercase + numbers + special;
  
  let password = '';
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Specific staff members to create
const specificStaffData = [
  {
    name: 'Shashi Kumar',
    emailPrefix: 'shashi',
    department: 'Computer Science'
  },
  {
    name: 'Hemanth Reddy',
    emailPrefix: 'hemanth',
    department: 'Information Technology'
  },
  {
    name: 'Suvidh Patel',
    emailPrefix: 'suvidh',
    department: 'Electronics'
  },
  {
    name: 'Pavan Krishna',
    emailPrefix: 'pavan',
    department: 'Computer Science'
  },
  {
    name: 'Bhuvana Singh',
    emailPrefix: 'bhuvana',
    department: 'Mathematics'
  },
  {
    name: 'Sneha Sharma',
    emailPrefix: 'sneha',
    department: 'Physics'
  }
];

// Generate staff accounts with random 4-digit numbers and passwords
const staffAccounts = specificStaffData.map(staff => {
  const digits = generateRandomDigits();
  const password = generatePassword(12);
  
  return {
    name: staff.name,
    email: `${staff.emailPrefix}${digits}@klh.edu.in`,
    password: password,
    role: 'faculty',
    department: staff.department,
    phone: `98765${Math.floor(10000 + Math.random() * 90000)}` // Random phone
  };
});

const createSpecificStaff = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Connected to MongoDB\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('👨‍🏫 CREATING SPECIFIC STAFF ACCOUNTS');
    console.log('═══════════════════════════════════════════════════════════\n');

    const createdAccounts = [];

    for (const staff of staffAccounts) {
      // Check if user with similar name already exists
      const existingUser = await User.findOne({ 
        name: { $regex: new RegExp(staff.name.split(' ')[0], 'i') } 
      });
      
      if (existingUser) {
        console.log(`⚠️  ${staff.name} already exists (${existingUser.email})`);
        console.log(`   Skipping creation...\n`);
        continue;
      }

      // Create the staff account
      const newUser = await User.create(staff);
      createdAccounts.push(staff);
      
      console.log(`✅ Created: ${staff.name}`);
      console.log(`   Email: ${staff.email}`);
      console.log(`   Password: ${staff.password}`);
      console.log(`   Department: ${staff.department}\n`);
    }

    if (createdAccounts.length === 0) {
      console.log('ℹ️  No new accounts created (all already exist)\n');
    } else {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('🎉 STAFF ACCOUNT CREATION COMPLETE!');
      console.log('═══════════════════════════════════════════════════════════\n');
      
      console.log('📋 SAVE THESE CREDENTIALS SECURELY:\n');
      console.log('| Name | Email | Password | Department |');
      console.log('|------|-------|----------|------------|');
      createdAccounts.forEach(staff => {
        console.log(`| ${staff.name} | ${staff.email} | ${staff.password} | ${staff.department} |`);
      });
      console.log('\n');

      console.log('⚠️  IMPORTANT SECURITY NOTES:');
      console.log('   • Save these passwords in a secure password manager');
      console.log('   • Share credentials with staff members securely');
      console.log('   • Advise staff to change passwords after first login');
      console.log('   • These passwords will NOT be shown again!');
      console.log('═══════════════════════════════════════════════════════════\n');
    }

    // Save to file for reference
    const fs = require('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `STAFF_CREDENTIALS_${timestamp}.txt`;
    
    let fileContent = '═══════════════════════════════════════════════════════════\n';
    fileContent += 'STAFF ACCOUNT CREDENTIALS - CONFIDENTIAL\n';
    fileContent += `Generated: ${new Date().toLocaleString()}\n`;
    fileContent += '═══════════════════════════════════════════════════════════\n\n';
    
    createdAccounts.forEach((staff, index) => {
      fileContent += `${index + 1}. ${staff.name}\n`;
      fileContent += `   Email: ${staff.email}\n`;
      fileContent += `   Password: ${staff.password}\n`;
      fileContent += `   Department: ${staff.department}\n`;
      fileContent += `   Phone: ${staff.phone}\n\n`;
    });
    
    fileContent += '═══════════════════════════════════════════════════════════\n';
    fileContent += 'SECURITY INSTRUCTIONS:\n';
    fileContent += '• Store this file securely\n';
    fileContent += '• Share credentials individually with staff members\n';
    fileContent += '• Delete this file after distributing credentials\n';
    fileContent += '• Advise staff to change passwords on first login\n';
    fileContent += '═══════════════════════════════════════════════════════════\n';
    
    fs.writeFileSync(filename, fileContent);
    console.log(`💾 Credentials saved to: ${filename}`);
    console.log(`   Location: ${__dirname}/${filename}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating staff accounts:', error);
    process.exit(1);
  }
};

// Run the script
createSpecificStaff();
