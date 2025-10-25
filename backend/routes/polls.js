const express = require('express');
const router = express.Router();
const {
  getAllPolls,
  getPoll,
  createPoll,
  votePoll,
  updatePoll,
  closePoll,
  deletePoll,
  getPendingPolls,
  approvePoll,
  rejectPoll,
} = require('../controllers/pollController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// Admin only routes - must be before /:id routes
router.get('/pending', protect, isAdmin, getPendingPolls);
router.put('/:id/approve', protect, isAdmin, approvePoll);
router.put('/:id/reject', protect, isAdmin, rejectPoll);

router.route('/')
  .get(getAllPolls)
  .post(protect, createPoll);

router.route('/:id')
  .get(getPoll)
  .put(protect, updatePoll)
  .delete(protect, deletePoll);

router.post('/:id/vote', protect, votePoll);
router.put('/:id/close', protect, closePoll);

module.exports = router;
