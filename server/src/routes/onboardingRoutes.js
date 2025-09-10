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
    }); 
    
  } catch (error) {
    // TODO - better error message
    console.error('Error generating embedded onboarding URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate onboarding URL'
    });
  }
});

module.exports = router;
