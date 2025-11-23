const express = require('express');
const router = express.Router();
const {
  signIn,
  signUp,
  forgotPassword,
  verifyToken,
} = require('../controllers/authController');

// Sign In route
router.post('/sign-in', signIn);

// Sign Up route
router.post('/sign-up', signUp);

// Forgot Password route
router.post('/forgot-password', forgotPassword);

// Verify Token route
router.post('/verify-token', verifyToken);

module.exports = router;





