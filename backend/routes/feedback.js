const express = require('express');
const {
  getAllFeedback,
  getFeedback,
  createFeedback,
  respondToFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');
const { isFacultyOrAdmin } = require('../middleware/roleCheck');

const router = express.Router();

// Protected routes
router.get('/', protect, getAllFeedback);
router.get('/:id', protect, getFeedback);
router.post('/', protect, createFeedback);
router.delete('/:id', protect, deleteFeedback);

// Faculty/Admin only routes
router.put('/:id/respond', protect, isFacultyOrAdmin, respondToFeedback);
router.put('/:id/status', protect, isFacultyOrAdmin, updateFeedbackStatus);

module.exports = router;
