const express = require('express');
const router = express.Router();

const { newOrder,getSingleOrder,myOrders } = require('../controllers/orderController');
const {isUserAuthenticated} = require('../middlewares/authenticate');

router.route('/order/new').post(isUserAuthenticated,newOrder);
router.route('/order/:id').get(isUserAuthenticated,getSingleOrder);
router.route('/orders/me').get(isUserAuthenticated,myOrders);

module.exports = router
