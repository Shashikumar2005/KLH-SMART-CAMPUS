const mongoose = require('mongoose');
require('dotenv').config();

const fixStudentIdIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Get existing indexes
    const indexes = await usersCollection.indexes();
    console.log('\n📋 Current indexes:', JSON.stringify(indexes, null, 2));

    // Drop the old studentId index if it exists
    try {
      await usersCollection.dropIndex('studentId_1');
      console.log('✅ Dropped old studentId_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  studentId_1 index does not exist (already dropped or never created)');
      } else {
        console.log('⚠️  Error dropping index:', error.message);
      }
    }

    // Remove studentId from faculty users (set to undefined)
    const result = await usersCollection.updateMany(
      { role: 'faculty', studentId: { $exists: true } },
      { $unset: { studentId: '' } }
    );
    console.log(`✅ Cleaned up ${result.modifiedCount} faculty users (removed studentId field)`);

    // Create a new sparse unique index for studentId
    // Sparse index means: only include documents that have the field
    // This allows multiple documents without the field
    await usersCollection.createIndex(
      { studentId: 1 },
      { 
        unique: true, 
        sparse: true,
        name: 'studentId_sparse_unique'
      }
    );
    console.log('✅ Created new sparse unique index for studentId');

    // Verify the new indexes
    const newIndexes = await usersCollection.indexes();
    console.log('\n📋 Updated indexes:', JSON.stringify(newIndexes, null, 2));

    // Show user statistics
    const studentCount = await usersCollection.countDocuments({ role: 'student' });
    const facultyCount = await usersCollection.countDocuments({ role: 'faculty' });
    const adminCount = await usersCollection.countDocuments({ role: 'admin' });
    
    console.log('\n📊 User Statistics:');
    console.log(`   Students: ${studentCount}`);
    console.log(`   Faculty: ${facultyCount}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Total: ${studentCount + facultyCount + adminCount}`);

    console.log('\n✅ Index fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixStudentIdIndex();
