const express = require('express');
const router = express.Router();

const { processPayment } = require('../controllers/paymentController');
const { isUserAuthenticated } = require('../middlewares/authenticate');

router.route('/payment/process').post(isUserAuthenticated, processPayment);
module.exports = router;
