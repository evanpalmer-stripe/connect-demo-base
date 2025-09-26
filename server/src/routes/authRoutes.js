const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login - Check if user exists and "log them in"
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if user exists in our database
    const user = User.getUserByEmail(email);
    
    if (user) {
      // User exists - they are "logged in"
      return res.json({
        success: true,
        loggedIn: true,
        user: {
          id: user.id,
          email: user.email,
          accountId: user.accountId,
          createdAt: user.createdAt
        }
      });
    } else {
      // User doesn't exist - they are not logged in
      return res.json({
        success: true,
        loggedIn: false,
        message: 'No Stripe Connect account found for this email'
      });
    }
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check login status'
    });
  }
});

// POST /api/auth/logout - Simple logout (just returns success)
router.post('/logout', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to logout'
    });
  }
});

module.exports = router;
