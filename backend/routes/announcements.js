const express = require('express');
const {
  getAllAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  togglePinAnnouncement,
} = require('../controllers/announcementController');
const { protect } = require('../middleware/auth');
const { isFacultyOrAdmin, isAdmin } = require('../middleware/roleCheck');

const router = express.Router();

// Public routes (can be accessed without authentication)
router.get('/', getAllAnnouncements);
router.get('/:id', getAnnouncement);

// Faculty/Admin routes
router.post('/', protect, isFacultyOrAdmin, createAnnouncement);
router.put('/:id', protect, isFacultyOrAdmin, updateAnnouncement);
router.delete('/:id', protect, isFacultyOrAdmin, deleteAnnouncement);

// Admin only routes
router.put('/:id/pin', protect, isAdmin, togglePinAnnouncement);

module.exports = router;
