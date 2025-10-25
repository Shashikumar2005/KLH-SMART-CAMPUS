const express = require('express');
const router = express.Router();
const {
  getAllClubs,
  getClub,
  createClub,
  updateClub,
  requestJoinClub,
  handleMembershipRequest,
  removeMember,
  addAchievement,
  addResource,
  approveClub,
  getPendingClubs,
  rejectClub,
  deleteClub,
} = require('../controllers/clubController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// Admin only routes - must be before /:id routes
router.get('/pending', protect, isAdmin, getPendingClubs);
router.put('/:id/approve', protect, isAdmin, approveClub);
router.put('/:id/reject', protect, isAdmin, rejectClub);

router.route('/')
  .get(getAllClubs)
  .post(protect, createClub);

router.route('/:id')
  .get(getClub)
  .put(protect, updateClub)
  .delete(protect, isAdmin, deleteClub);

router.post('/:id/join', protect, requestJoinClub);
router.put('/:id/membership/:requestId', protect, handleMembershipRequest);
router.delete('/:id/members/:memberId', protect, removeMember);
router.post('/:id/achievements', protect, addAchievement);
router.post('/:id/resources', protect, addResource);

module.exports = router;
