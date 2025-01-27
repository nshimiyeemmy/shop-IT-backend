const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
require('dotenv').config({ path: 'back_end/config/config.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//PROCESSING THE STRIPE PAYMENTS => /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',

    metadata: { integration_check: 'accept_a_payment' },
  });
  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

//Send Stripe API KEY to the front end => /api/v1/stripeapi
exports.sendStripeApi = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    StripeApiKey: process.env.STRIPE_API_KEY,
  });
});
