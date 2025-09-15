const express = require('express');
const Settings = require('../models/Settings');
const router = express.Router();

// GET /api/settings - Get all settings for user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default';
    const settings = Settings.getSettings(userId);
    
    if (!settings) {
      return res.json({
        general: {},
        onboarding: {},
        payment: {},
        logs: {},
        ui: {}
      });
    }

    res.json({
      general: settings.general,
      onboarding: settings.onboarding,
      payment: settings.payment,
      logs: settings.logs,
      ui: settings.ui
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// POST /api/settings - Save all settings for user
router.post('/', async (req, res) => { 
  try {
    const userId = req.body.userId || 'default';
    const settingsData = req.body.settings;
    
    if (!settingsData) {
      return res.status(400).json({ error: 'Settings data is required' });
    }

    const savedSettings = Settings.saveSettings(settingsData, userId);
    
    res.json({
      message: 'Settings saved successfully',
      settings: {
        general: savedSettings.general,
        onboarding: savedSettings.onboarding,
        payment: savedSettings.payment,
        logs: savedSettings.logs,
        ui: savedSettings.ui
      }
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// PUT /api/settings/:category - Update specific setting category
router.put('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.body.userId || 'default';
    const updates = req.body.updates;
    
    if (!updates) {
      return res.status(400).json({ error: 'Updates data is required' });
    }

    const validCategories = ['general', 'onboarding', 'payment', 'logs', 'ui'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const updatedSettings = Settings.updateSettings(category, updates, userId);
    
    res.json({
      message: `${category} settings updated successfully`,
      settings: {
        general: updatedSettings.general,
        onboarding: updatedSettings.onboarding,
        payment: updatedSettings.payment,
        logs: updatedSettings.logs,
        ui: updatedSettings.ui
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// POST /api/settings/verify - Verify account credentials
router.post('/verify', async (req, res) => {
  try {
    const userId = req.body.userId || 'default';
    
    // Get current settings from database
    const settings = Settings.getSettings(userId);
    
    if (!settings || !settings.general.publishableKey || !settings.general.secretKey) {
      return res.status(400).json({ error: 'Both publishable key and secret key are required' });
    }

    const stripe = require('stripe')(settings.general.secretKey);

    // Get the current account
    const account = await stripe.accounts.retrieve();
    
    // if we found the account, consider it verified
    const isVerified = account && account.id ? true : false;

    // Find connected accounts to see if this is a platform account. Wish there was a better way!
    const connectedAccounts = await stripe.accounts.list({
      limit: 100, // Maximum 100 per page
    });
    const isPlatform = connectedAccounts.data.length > 0;
    
    res.json({ 
      isVerified,
      message: isVerified ? 'Account verified successfully' : 'Account verification failed',
      accountId: isVerified ? account.id : 'unknown',
      isPlatform: isPlatform,
    });

  } catch (error) {
    console.error('Error verifying account:', error);
    res.status(500).json({ error: 'Failed to verify account' });
  }
});

// DELETE /api/settings - Delete all settings for user
router.delete('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default';
    const deleted = Settings.deleteSettings(userId);
    
    if (deleted) {
      res.json({ message: 'Settings deleted successfully' });
    } else {
      res.status(404).json({ error: 'Settings not found' });
    }
  } catch (error) {
    console.error('Error deleting settings:', error);
    res.status(500).json({ error: 'Failed to delete settings' });
  }
});

module.exports = router;
