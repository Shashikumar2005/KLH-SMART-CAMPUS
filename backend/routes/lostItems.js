const express = require('express');
const {
  getAllLostItems,
  getLostItem,
  createLostItem,
  updateLostItem,
  deleteLostItem,
  claimLostItem,
  approveClaim,
  rejectClaim,
} = require('../controllers/lostItemController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getAllLostItems);
router.get('/:id', getLostItem);

// Protected routes
router.post('/', protect, upload.single('image'), createLostItem);
router.put('/:id', protect, upload.single('image'), updateLostItem);
router.delete('/:id', protect, deleteLostItem);
router.post('/:id/claim', protect, claimLostItem);
router.post('/:id/approve', protect, approveClaim);
router.post('/:id/reject', protect, rejectClaim);

module.exports = router;
