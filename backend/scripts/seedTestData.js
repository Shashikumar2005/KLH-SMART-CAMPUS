const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Test Data: Staff/Faculty Members
const testStaffData = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh1234@klh.edu.in',
    password: 'Staff@123',
    role: 'faculty',
    department: 'Computer Science',
    phone: '9876543210'
  },
  {
    name: 'Priya Sharma',
    email: 'priya5678@klh.edu.in',
    password: 'Staff@123',
    role: 'faculty',
    department: 'Electronics',
    phone: '9876543211'
  },
  {
    name: 'Anil Reddy',
    email: 'anil9012@klh.edu.in',
    password: 'Staff@123',
    role: 'faculty',
    department: 'Mechanical',
    phone: '9876543212'
  },
  {
    name: 'Suresh Babu',
    email: 'suresh3456@klh.edu.in',
    password: 'Staff@123',
    role: 'faculty',
    department: 'Civil',
    phone: '9876543213'
  },
  {
    name: 'Kavita Singh',
    email: 'kavita7890@klh.edu.in',
    password: 'Staff@123',
    role: 'faculty',
    department: 'Computer Science',
    phone: '9876543214'
  },
  {
    name: 'Ramesh Patel',
    email: 'ramesh2468@klh.edu.in',
    password: 'Staff@123',
    role: 'faculty',
    department: 'Information Technology',
    phone: '9876543215'
  },
  {
    name: 'Deepa Menon',
    email: 'deepa1357@klh.edu.in',
    password: 'Staff@123',
    role: 'faculty',
    department: 'Electronics',
    phone: '9876543216'
  },
  {
    name: 'Vijay Krishna',
    email: 'vijay8024@klh.edu.in',
    password: 'Staff@123',
    role: 'faculty',
    department: 'Computer Science',
    phone: '9876543217'
  },
  {
    name: 'Lakshmi Devi',
    email: 'lakshmi4680@klh.edu.in',
    password: 'Staff@123',
    role: 'faculty',
    department: 'Mathematics',
    phone: '9876543218'
  },
  {
    name: 'Sandeep Gupta',
    email: 'sandeep1593@klh.edu.in',
    password: 'Staff@123',
    role: 'faculty',
    department: 'Physics',
    phone: '9876543219'
  }
];

// Test Data: Student Accounts
const testStudentData = [
  {
    name: 'Rahul Verma',
    email: '2310080001@klh.edu.in',
    password: 'Student@123',
    role: 'student',
    studentId: '2310080001',
    department: 'Computer Science',
    phone: '9876543220'
  },
  {
    name: 'Sneha Reddy',
    email: '2310080002@klh.edu.in',
    password: 'Student@123',
    role: 'student',
    studentId: '2310080002',
    department: 'Computer Science',
    phone: '9876543221'
  },
  {
    name: 'Arjun Malhotra',
    email: '2310080003@klh.edu.in',
    password: 'Student@123',
    role: 'student',
    studentId: '2310080003',
    department: 'Electronics',
    phone: '9876543222'
  },
  {
    name: 'Pooja Desai',
    email: '2310080004@klh.edu.in',
    password: 'Student@123',
    role: 'student',
    studentId: '2310080004',
    department: 'Information Technology',
    phone: '9876543223'
  },
  {
    name: 'Karthik Nair',
    email: '2310080005@klh.edu.in',
    password: 'Student@123',
    role: 'student',
    studentId: '2310080005',
    department: 'Mechanical',
    phone: '9876543224'
  }
];

// Test Data: Admin Account
const testAdminData = {
  name: 'System Admin',
  email: 'admin@klh.edu.in',
  password: 'Admin@123',
  role: 'admin',
  studentId: 'ADMIN001',
  department: 'Administration',
  phone: '9876543200'
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Connected to MongoDB');

    // Clear existing test users (optional - comment out if you want to keep existing data)
    // await User.deleteMany({ email: { $regex: '@klh.edu.in$' } });
    // console.log('🗑️  Cleared existing test data');

    // Seed Admin
    const adminExists = await User.findOne({ email: testAdminData.email });
    if (!adminExists) {
      await User.create(testAdminData);
      console.log('✅ Admin account created');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // Seed Staff/Faculty
    let staffCreated = 0;
    for (const staff of testStaffData) {
      const exists = await User.findOne({ email: staff.email });
      if (!exists) {
        await User.create(staff);
        staffCreated++;
      }
    }
    console.log(`✅ Created ${staffCreated} staff accounts`);

    // Seed Students
    let studentsCreated = 0;
    for (const student of testStudentData) {
      const exists = await User.findOne({ email: student.email });
      if (!exists) {
        await User.create(student);
        studentsCreated++;
      }
    }
    console.log(`✅ Created ${studentsCreated} student accounts`);

    console.log('\n🎉 Test data seeding complete!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 TEST ACCOUNTS SUMMARY');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('👨‍💼 ADMIN ACCOUNT:');
    console.log('   Email: admin@klh.edu.in');
    console.log('   Password: Admin@123\n');

    console.log('👨‍🏫 STAFF/FACULTY ACCOUNTS (10 accounts):');
    testStaffData.forEach((staff, index) => {
      console.log(`   ${index + 1}. ${staff.name}`);
      console.log(`      Email: ${staff.email}`);
      console.log(`      Password: Staff@123`);
      console.log(`      Department: ${staff.department}\n`);
    });

    console.log('👨‍🎓 STUDENT ACCOUNTS (5 accounts):');
    testStudentData.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.name}`);
      console.log(`      Email: ${student.email}`);
      console.log(`      Student ID: ${student.studentId}`);
      console.log(`      Password: Student@123`);
      console.log(`      Department: ${student.department}\n`);
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📝 NOTES:');
    console.log('   • All passwords are for testing purposes only');
    console.log('   • Staff emails: nameXXXX@klh.edu.in (name + 4 digits)');
    console.log('   • Student emails: 10-digit-number@klh.edu.in');
    console.log('   • Change passwords in production environment');
    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
