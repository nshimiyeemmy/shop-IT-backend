const express = require('express');
const router = express.Router();

const { newOrder,allOrders,getSingleOrder,myOrders } = require('../controllers/orderController');
const {isUserAuthenticated} = require('../middlewares/authenticate');

router.route('/order/new').post(isUserAuthenticated,newOrder);
router.route('/admin/orders').get(isUserAuthenticated,allOrders);
router.route('/admin/order/:id').get(isUserAuthenticated,getSingleOrder);
router.route('/orders/me').get(isUserAuthenticated,myOrders);

module.exports = router
