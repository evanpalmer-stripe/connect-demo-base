const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = User.getAllUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = User.getUserById(parseInt(id));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// GET /api/users/email/:email - Get user by email
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = User.getUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// GET /api/users/account/:accountId - Get user by account ID
router.get('/account/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const user = User.getUserByAccountId(accountId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user by account ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// POST /api/users - Create new user
router.post('/', async (req, res) => {
  try {
    const { email, accountId } = req.body;

    // Validate required fields
    if (!email || !accountId) {
      return res.status(400).json({
        success: false,
        error: 'Email and account ID are required'
      });
    }

    // Check if email already exists
    if (User.emailExists(email)) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Check if account ID already exists
    if (User.accountIdExists(accountId)) {
      return res.status(409).json({
        success: false,
        error: 'Account ID already exists'
      });
    }

    const user = User.createUser(email, accountId);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    // Check if user exists
    const existingUser = User.getUserById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if email is being updated and already exists
    if (updates.email && updates.email !== existingUser.email && User.emailExists(updates.email)) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Check if account ID is being updated and already exists
    if (updates.accountId && updates.accountId !== existingUser.accountId && User.accountIdExists(updates.accountId)) {
      return res.status(409).json({
        success: false,
        error: 'Account ID already exists'
      });
    }

    const updatedUser = User.updateUser(parseInt(id), updates);
    
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update user'
      });
    }

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    // Check if user exists
    const existingUser = User.getUserById(parseInt(id));
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const deleted = User.deleteUser(parseInt(id));
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete user'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

module.exports = router;
