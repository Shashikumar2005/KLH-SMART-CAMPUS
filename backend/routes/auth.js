const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  getAllUsers,
  updateUserRole,
  deactivateUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin only routes
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);
router.put('/users/:id/deactivate', protect, isAdmin, deactivateUser);

module.exports = router;
