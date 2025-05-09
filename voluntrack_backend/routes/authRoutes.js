const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getLoggedInUser, 
  updatePassword, 
  requestPasswordReset, 
  resetPassword 
} = require('../controllers/authController');

const router = express.Router();

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user/me', getLoggedInUser);
router.put('/update-password/:email', updatePassword);

// Forgot Password Routes
router.post('/forgot-password', requestPasswordReset); // Route to request password reset
router.put('/reset-password/:token', resetPassword); // Route to reset password using the token

module.exports = router;
