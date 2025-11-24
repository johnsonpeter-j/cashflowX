const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { uploadProfileImage } = require('../middleware/upload');
const handleMulterError = require('../middleware/uploadErrorHandler');
const {
  updateProfile,
  changePassword,
} = require('../controllers/userController');

// All user routes require authentication
router.use(authenticate);

// Update Profile route (with multer middleware for file upload)
router.put('/profile', uploadProfileImage, handleMulterError, updateProfile);

// Change Password route
router.put('/change-password', changePassword);

module.exports = router;

