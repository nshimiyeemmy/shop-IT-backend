const express = require('express');
const router = express.Router();

const { newOrder,allOrders,getSingleOrder,myOrders } = require('../controllers/orderController');
const {isUserAuthenticated,authorizeRole} = require('../middlewares/authenticate');

router.route('/order/new').post(isUserAuthenticated,newOrder);
router.route('/admin/orders').get(isUserAuthenticated,authorizeRole('admin'),allOrders);
router.route('/admin/order/:id').get(isUserAuthenticated,authorizeRole('admin'),getSingleOrder);
router.route('/orders/me').get(isUserAuthenticated,myOrders);

module.exports = router
