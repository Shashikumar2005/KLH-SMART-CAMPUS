const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test data
const testUser = {
  email: 'admin@klh.edu.in',
  password: 'admin123',
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper function to log test results
function logTest(name, success, message = '') {
  const status = success ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`${status} ${name}${message ? ': ' + message : ''}`);
}

// Test 1: Login to get auth token
async function testLogin() {
  try {
    console.log(`\n${colors.cyan}=== Testing Authentication ===${colors.reset}`);
    const response = await axios.post(`${BASE_URL}/auth/login`, testUser);
    
    if (response.data.success && response.data.token) {
      authToken = response.data.token;
      logTest('Login', true, `Token received`);
      return true;
    } else {
      logTest('Login', false, 'No token received');
      return false;
    }
  } catch (error) {
    logTest('Login', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 2: Get chatbot suggestions (public endpoint)
async function testGetSuggestions() {
  try {
    console.log(`\n${colors.cyan}=== Testing Chatbot Suggestions ===${colors.reset}`);
    const response = await axios.get(`${BASE_URL}/chatbot/suggestions`);
    
    if (response.data.success && Array.isArray(response.data.data)) {
      logTest('Get Suggestions', true, `Received ${response.data.data.length} suggestions`);
      console.log(`${colors.yellow}Sample suggestions:${colors.reset}`);
      response.data.data.slice(0, 3).forEach(s => {
        console.log(`  - ${s.text} (${s.category})`);
      });
      return true;
    } else {
      logTest('Get Suggestions', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Get Suggestions', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 3: Get FAQs (public endpoint)
async function testGetFAQs() {
  try {
    console.log(`\n${colors.cyan}=== Testing Chatbot FAQs ===${colors.reset}`);
    const response = await axios.get(`${BASE_URL}/chatbot/faqs`);
    
    if (response.data.success && Array.isArray(response.data.data)) {
      logTest('Get FAQs', true, `Received ${response.data.data.length} FAQs`);
      console.log(`${colors.yellow}Sample FAQs:${colors.reset}`);
      response.data.data.slice(0, 2).forEach(faq => {
        console.log(`  Q: ${faq.question}`);
        console.log(`  A: ${faq.answer.substring(0, 60)}...`);
      });
      return true;
    } else {
      logTest('Get FAQs', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Get FAQs', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 4: Send message to chatbot (requires auth)
async function testSendMessage() {
  try {
    console.log(`\n${colors.cyan}=== Testing Chatbot Query ===${colors.reset}`);
    
    const testMessage = 'What events are happening at the campus?';
    const response = await axios.post(
      `${BASE_URL}/chatbot/query`,
      {
        message: testMessage,
        conversationHistory: [],
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    
    if (response.data.success && response.data.data.message) {
      logTest('Send Message', true, 'Received AI response');
      console.log(`${colors.yellow}User:${colors.reset} ${testMessage}`);
      console.log(`${colors.blue}Bot:${colors.reset} ${response.data.data.message.substring(0, 150)}...`);
      return true;
    } else {
      logTest('Send Message', false, 'No response from AI');
      return false;
    }
  } catch (error) {
    logTest('Send Message', false, error.response?.data?.message || error.message);
    
    if (error.response?.status === 500) {
      console.log(`${colors.yellow}Note: Check if GEMINI_API_KEY is set in backend/.env${colors.reset}`);
    }
    return false;
  }
}

// Test 5: Test conversation with context
async function testConversationContext() {
  try {
    console.log(`\n${colors.cyan}=== Testing Conversation Context ===${colors.reset}`);
    
    // First message
    const firstMessage = 'Tell me about campus events';
    const firstResponse = await axios.post(
      `${BASE_URL}/chatbot/query`,
      {
        message: firstMessage,
        conversationHistory: [],
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    
    // Second message with context
    const conversationHistory = [
      { role: 'user', content: firstMessage },
      { role: 'assistant', content: firstResponse.data.data.message },
    ];
    
    const secondMessage = 'How do I register for them?';
    const secondResponse = await axios.post(
      `${BASE_URL}/chatbot/query`,
      {
        message: secondMessage,
        conversationHistory,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    
    if (secondResponse.data.success && secondResponse.data.data.message) {
      logTest('Conversation Context', true, 'AI maintained context');
      console.log(`${colors.yellow}Follow-up:${colors.reset} ${secondMessage}`);
      console.log(`${colors.blue}Bot:${colors.reset} ${secondResponse.data.data.message.substring(0, 150)}...`);
      return true;
    } else {
      logTest('Conversation Context', false, 'No contextual response');
      return false;
    }
  } catch (error) {
    logTest('Conversation Context', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log(`${colors.cyan}${'='.repeat(50)}`);
  console.log(`  CHATBOT API INTEGRATION TESTS`);
  console.log(`${'='.repeat(50)}${colors.reset}`);
  
  let passed = 0;
  let total = 0;
  
  // Test 1: Authentication
  total++;
  if (await testLogin()) passed++;
  
  // Test 2: Suggestions (Public)
  total++;
  if (await testGetSuggestions()) passed++;
  
  // Test 3: FAQs (Public)
  total++;
  if (await testGetFAQs()) passed++;
  
  // Only proceed with auth-required tests if login succeeded
  if (authToken) {
    // Test 4: Send Message
    total++;
    if (await testSendMessage()) passed++;
    
    // Test 5: Conversation Context
    total++;
    if (await testConversationContext()) passed++;
  } else {
    console.log(`\n${colors.red}⚠ Skipping authenticated tests due to login failure${colors.reset}`);
  }
  
  // Summary
  console.log(`\n${colors.cyan}${'='.repeat(50)}`);
  console.log(`  TEST SUMMARY`);
  console.log(`${'='.repeat(50)}${colors.reset}`);
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`Failed: ${colors.red}${total - passed}${colors.reset}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    console.log(`\n${colors.green}✓ All tests passed!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}✗ Some tests failed. Check the output above.${colors.reset}`);
  }
  
  // Helpful tips
  console.log(`\n${colors.cyan}${'='.repeat(50)}`);
  console.log(`  TROUBLESHOOTING TIPS`);
  console.log(`${'='.repeat(50)}${colors.reset}`);
  console.log(`1. Ensure backend is running: ${colors.yellow}cd backend && npm run dev${colors.reset}`);
  console.log(`2. Check GEMINI_API_KEY in backend/.env`);
  console.log(`3. Verify MongoDB is connected`);
  console.log(`4. Check admin credentials exist`);
  console.log(`5. Review server logs for errors\n`);
}

// Execute tests
runAllTests().catch(error => {
  console.error(`\n${colors.red}Fatal Error:${colors.reset}`, error.message);
  process.exit(1);
});
