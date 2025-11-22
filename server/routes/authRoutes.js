const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Register user
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  handleValidationErrors,
  register
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  handleValidationErrors,
  login
);

// Forgot password
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please include a valid email')],
  handleValidationErrors,
  forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('otp').notEmpty().withMessage('OTP is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  handleValidationErrors,
  resetPassword
);

// Get current user
router.get('/me', protect, getMe);

module.exports = router;