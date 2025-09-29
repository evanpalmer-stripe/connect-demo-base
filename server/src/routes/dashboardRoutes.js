const Settings = require('../models/Settings');
const express = require('express');
const router = express.Router();

// GET /api/dashboard/embedded - Returns clientSecret and components for embedded dashboard
router.get('/embedded', async (req, res) => {
  try {
    const settings = Settings.getSettings("default");
    const stripe = require("stripe")(settings.general.secretKey);
    
    let accountId = req.query.account_id;

    const accountSession = await stripe.accountSessions.create({
        account: accountId, 
        components: {
            account_onboarding: {
                enabled: true,
            },
            payments: {
                enabled: true,
            },
            payouts: {
                enabled: true,
            },
            balances: {
                enabled: true,
            },
        },
    });

    res.json({
      clientSecret: accountSession.client_secret,
      components: accountSession.components,
    });

  } catch (error) {
    console.error('Error generating embedded dashboard data:', error);
    res.status(500).json({
      success: false, 
      error: 'Failed to generate embedded dashboard data'
    });
  }
});

module.exports = router;
