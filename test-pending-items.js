// Test script to create pending clubs and polls
// Run this after logging in as a student or faculty member

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// You need to replace this token with an actual student/faculty JWT token
// Get it from: localStorage after logging in, or from the browser's Application tab
const STUDENT_TOKEN = 'YOUR_STUDENT_TOKEN_HERE';

async function createTestClub() {
  try {
    const response = await axios.post(
      `${API_URL}/clubs`,
      {
        name: 'Robotics Club',
        description: 'A club dedicated to robotics and automation projects',
        category: 'Technical',
        logo: 'https://via.placeholder.com/150',
      },
      {
        headers: {
          Authorization: `Bearer ${STUDENT_TOKEN}`,
        },
      }
    );
    console.log('✅ Club created:', response.data);
  } catch (error) {
    console.error('❌ Error creating club:', error.response?.data || error.message);
  }
}

async function createTestPoll() {
  try {
    const response = await axios.post(
      `${API_URL}/polls`,
      {
        question: 'What should be the theme for our annual fest?',
        description: 'Help us decide the theme for the upcoming annual fest',
        category: 'Campus',
        type: 'single',
        options: [
          { text: 'Technology & Innovation' },
          { text: 'Cultural Heritage' },
          { text: 'Environmental Awareness' },
          { text: 'Sports & Fitness' },
        ],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        headers: {
          Authorization: `Bearer ${STUDENT_TOKEN}`,
        },
      }
    );
    console.log('✅ Poll created:', response.data);
  } catch (error) {
    console.error('❌ Error creating poll:', error.response?.data || error.message);
  }
}

// Instructions
console.log(`
==================================================
📝 INSTRUCTIONS TO TEST PENDING ITEMS
==================================================

1. Open your browser and go to: http://localhost:5173
2. Login as a STUDENT or FACULTY (not admin)
3. Open Browser DevTools (F12)
4. Go to Console tab
5. Type: localStorage.getItem('token')
6. Copy the token (without quotes)
7. Replace STUDENT_TOKEN in this file with your token
8. Run: node test-pending-items.js

OR - EASIER METHOD:
==================================================
1. Login as student/faculty on the website
2. Go to Clubs page and create a new club
3. Go to Polls page and create a new poll
4. Logout and login as ADMIN
5. Check the "Pending Approvals" tab

==================================================
`);

// Uncomment these lines after adding your token:
// createTestClub();
// createTestPoll();
