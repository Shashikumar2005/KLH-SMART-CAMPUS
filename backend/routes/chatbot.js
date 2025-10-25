const express = require('express');
const {
  chat,
  getSuggestions,
  getFAQs,
} = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/suggestions', getSuggestions);
router.get('/faqs', getFAQs);

// Protected routes
router.post('/query', protect, chat);

module.exports = router;
