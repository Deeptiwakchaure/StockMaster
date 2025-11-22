const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User routes
router.route('/').get(protect, authorize('admin'), getUsers);
router
  .route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser);

module.exports = router;