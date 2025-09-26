const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const User = require('../models/User');

// Explicitly load environment variables in this file
require('dotenv').config();

// GET /api/onboarding/hosted - Returns test redirect URL
router.get('/hosted', async (req, res) => {
  try {

    const settings = Settings.getSettings("default");
    const stripe = require("stripe")(
      settings.general.secretKey
    ); 
    
    let accountId = req.query.account_id;

    const baseUrl = process.env.CLIENT_BASE_URL;
    console.log('baseUrl after assignment:', baseUrl);
   // Create an account link to begin onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      return_url: `${baseUrl}/onbaording/${accountId}?status=return`,
      refresh_url: `${baseUrl}/refresh/${accountId}?status=refresh`,
      type: "account_onboarding",
    });

    res.redirect(accountLink.url);

  } catch (error) {
    console.error('Error generating hosted onboarding URL:', error);
    res.status(500).json({
      success: false, 
      error: 'Failed to generate onboarding URL'
    });
  }
});

router.post('/create-account-with-email', async (req, res) => {
  try {
    const settings = Settings.getSettings("default");
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if user already exists
    let user = User.getUserByEmail(email);
    if (user) {
      return res.json({
        success: true,
        id: user.accountId,
        email: user.email,
      });
    }

    const stripe = require("stripe")(settings.general.secretKey);
    
    // Create an empty account
    const account = await stripe.accounts.create({
      type: settings.onboarding.accountType,
      country: settings.general.connectedAccountCountry || 'AU',
      email: email,
      // controller: {
      //   stripe_dashboard: { // TODO: add dashboard type to the settings
      //     type: settings.onboarding.dashboardType,
      //   },
      //   fees: {
      //     payer: "application"
      //   },
      //   losses: {
      //     payments: "application"
      //   },
      // },
    }); 

    console.log(`Created account: ${account.id}`);

    // Save user to database using upsert method
    try {
      const user = User.createOrUpdateUser(email, account.id);
      console.log(`Saved/updated user in database: ${user.id}`);
      return res.json({
        success: true,
        id: user.accountId,
        email: user.email,
      });
    } catch (dbError) {
      console.error('Error saving user to database:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create user account'
      });
    }
  } catch (error) {
    console.error('Error in create-account-with-email:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create account'
    });
  }
});

// TODO: Should this be a POST?
router.get('/embedded', async (req, res) => {
  try {
    const settings = Settings.getSettings("default");
    const stripe = require("stripe")(
      settings.general.secretKey
    ); 
    
    let accountId = req.query.account_id;
    
    const accountSession = await stripe.accountSessions.create({
      account: accountId, 
      components: {
        account_management: {
          enabled: true,  // true | false 
          features: {
            disable_stripe_user_authentication: false,  // true | false 
            external_account_collection: true,  // true | false 
          },
        },
        account_onboarding: {
          enabled: true,  // true | false 
        },
        payments: {
          enabled: true,  // true | false
          features: {
            capture_payments: true,  // true | false 
            dispute_management: true,  // true | false 
            refund_management: true,  // true | false 
          },
        },
      },
    });

    console.log(`Created account session for account: ${accountId}`);

    res.json({
      client_secret: accountSession.client_secret,
      account: accountSession.account,
    });

  } catch (error) {
    console.error('Failed to generate embedded onboarding:', error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = 'Failed to generate embedded onboarding';
    
    if (error.type === 'StripeAuthenticationError') {
      errorMessage = 'Invalid Stripe API keys. Please check your secret key in settings.';
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = 'Invalid request to Stripe. Please check your account type settings.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

module.exports = router;
