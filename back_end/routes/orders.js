const express = require('express');
const router = express.Router();

const { newOrder,allOrders,getSingleOrder,myOrders,updateOrder} = require('../controllers/orderController');
const {isUserAuthenticated,authorizeRole} = require('../middlewares/authenticate');

router.route('/order/new').post(isUserAuthenticated,newOrder);
router.route('/admin/orders').get(isUserAuthenticated,authorizeRole('admin'),allOrders);
router.route('/orders/me').get(isUserAuthenticated,myOrders);
router.route('/admin/order/:id').get(isUserAuthenticated,authorizeRole('admin'),getSingleOrder)
router.route('/admin/order/:id').put(isUserAuthenticated,authorizeRole('admin'),updateOrder)

module.exports = router
