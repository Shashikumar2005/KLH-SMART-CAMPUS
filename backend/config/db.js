const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove deprecated options for Mongoose 8.x
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('\n📝 Please update MONGODB_URI in backend/.env file');
    console.log('Get free MongoDB Atlas at: https://www.mongodb.com/cloud/atlas/register\n');
    process.exit(1);
  }
};

module.exports = connectDB;
