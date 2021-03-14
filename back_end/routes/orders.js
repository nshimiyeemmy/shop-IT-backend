const express = require('express');
const router = express.Router();

const { newOrder } = require('../controllers/orderController');
const {isUserAuthenticated} = require('../middlewares/authenticate');

router.route('/order/new').post(isUserAuthenticated,newOrder);

module.exports = router
