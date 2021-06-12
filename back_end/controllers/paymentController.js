const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//PROCESSING THE STRIPE PAYMENTS => /api/v1/payment/process

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const payment = await stripe.paymentIntent.create({
    amount: req.body.amount,
    currency: 'usd',

    metadata: { integration_check: 'accept_a_payment' },
  });
  res.status(200).json({
    success: true,
    message: 'Payment was successfully',
    client_Secret: paymentIntent.client_Secret,
  });
});
