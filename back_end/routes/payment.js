const express = require('express');
const router = express.Router();

const {
  processPayment,
  sendStripeApi,
} = require('../controllers/paymentController');
const { isUserAuthenticated } = require('../middlewares/authenticate');

router.route('/payment/process').post(isUserAuthenticated, processPayment);
router.route('/stripeapi').get(isUserAuthenticated, sendStripeApi);
module.exports = router;
