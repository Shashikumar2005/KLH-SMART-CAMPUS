const express = require('express');
const {
  getAllGrievances,
  getGrievance,
  createGrievance,
  respondToGrievance,
  updateGrievanceStatus,
  assignGrievance,
  deleteGrievance,
} = require('../controllers/grievanceController');
const { protect } = require('../middleware/auth');
const { isFacultyOrAdmin, isAdmin } = require('../middleware/roleCheck');

const router = express.Router();

// Protected routes
router.get('/', protect, getAllGrievances);
router.get('/:id', protect, getGrievance);
router.post('/', protect, createGrievance);

// Faculty/Admin only routes
router.put('/:id/respond', protect, isFacultyOrAdmin, respondToGrievance);
router.put('/:id/status', protect, isFacultyOrAdmin, updateGrievanceStatus);

// Admin only routes
router.put('/:id/assign', protect, isAdmin, assignGrievance);
router.delete('/:id', protect, isAdmin, deleteGrievance);

module.exports = router;
