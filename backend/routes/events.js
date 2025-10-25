const express = require('express');
const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  markInterested,
  unmarkInterested,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const { isFacultyOrAdmin } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEvent);

// Protected routes
router.post('/', protect, isFacultyOrAdmin, upload.single('image'), createEvent);
router.put('/:id', protect, isFacultyOrAdmin, upload.single('image'), updateEvent);
router.delete('/:id', protect, isFacultyOrAdmin, deleteEvent);

// Event registration
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/unregister', protect, unregisterFromEvent);

// Event interest
router.post('/:id/interested', protect, markInterested);
router.post('/:id/uninterested', protect, unmarkInterested);

module.exports = router;
