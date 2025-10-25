const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['student', 'faculty', 'admin'])
    .withMessage('Invalid role'),
];

// User login validation
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Event creation validation
const eventValidation = [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('description').trim().notEmpty().withMessage('Event description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').notEmpty().withMessage('Event time is required'),
  body('venue').trim().notEmpty().withMessage('Event venue is required'),
];

// Lost item validation
const lostItemValidation = [
  body('title').trim().notEmpty().withMessage('Item title is required'),
  body('description').trim().notEmpty().withMessage('Item description is required'),
  body('type').isIn(['lost', 'found']).withMessage('Type must be either lost or found'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
];

// Feedback validation
const feedbackValidation = [
  body('title').trim().notEmpty().withMessage('Feedback title is required'),
  body('description').trim().notEmpty().withMessage('Feedback description is required'),
  body('category')
    .optional()
    .isIn(['infrastructure', 'teaching', 'facilities', 'administration', 'other'])
    .withMessage('Invalid category'),
];

// Announcement validation
const announcementValidation = [
  body('title').trim().notEmpty().withMessage('Announcement title is required'),
  body('content').trim().notEmpty().withMessage('Announcement content is required'),
  body('category')
    .optional()
    .isIn(['general', 'academic', 'urgent', 'event', 'holiday'])
    .withMessage('Invalid category'),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  eventValidation,
  lostItemValidation,
  feedbackValidation,
  announcementValidation,
};
