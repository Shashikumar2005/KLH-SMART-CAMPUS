require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

// Generate unique event ID
const generateEventId = () => {
  const prefix = 'EVT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const addEventIdsToExistingEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Find all events without eventId
    const eventsWithoutId = await Event.find({ eventId: { $exists: false } });
    
    console.log(`Found ${eventsWithoutId.length} events without eventId`);

    // Update each event
    for (const event of eventsWithoutId) {
      event.eventId = generateEventId();
      await event.save();
      console.log(`✅ Added eventId ${event.eventId} to event: ${event.title}`);
    }

    console.log('\n✅ All events updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addEventIdsToExistingEvents();
