const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');



// GET /api/onboarding/hosted - Returns test redirect URL
router.get('/hosted', async (req, res) => {
  try {
    const settings = Settings.getSettings("default");
  
    const stripe = require("stripe")(
      settings.general.secretKey
    ); 

    // Create an empty account 
    const account = await stripe.accounts.create({
      type: settings.onboarding.accountType,
      country: 'AU',
    });  

   // Create an account link to begin onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      return_url: `${req.headers.origin}/return/${account.id}`,
      refresh_url: `${req.headers.origin}/refresh/${account.id}`,
      type: "account_onboarding",
    });

    res.json({
      success: true,
      redirectUrl: accountLink
    });
  } catch (error) {
    console.error('Error generating hosted onboarding URL:', error);
    res.status(500).json({
      success: false, 
      error: 'Failed to generate onboarding URL'
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

    // Create an empty account
    const account = await stripe.accounts.create({
      type: settings.onboarding.accountType,
      country: 'AU',
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

    const accountSession = await stripe.accountSessions.create({
      account: account.id, 

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

    res.json({
      client_secret: accountSession.client_secret,
      account: accountSession.account,
    });

  } catch (error) {
    // TODO - better error message
    console.error('Failed to generate emebeded onboarding:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate emebeded onboarding'
    });
  }
  });

module.exports = router;
