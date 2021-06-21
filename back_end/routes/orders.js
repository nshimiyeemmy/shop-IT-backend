const express = require('express');
const router = express.Router();

const { newOrder,allOrders,getSingleOrder,myOrders,updateOrder,deleteOrder} = require('../controllers/orderController');
const {isUserAuthenticated,authorizeRole} = require('../middlewares/authenticate');

router.route('/order/new').post(isUserAuthenticated,newOrder);
router.route('/admin/orders').get(isUserAuthenticated,authorizeRole('admin'),allOrders);
router.route('/orders/me').get(isUserAuthenticated,myOrders);
router.route('/order/:id').get(isUserAuthenticated,getSingleOrder);
router.route('/admin/orders/:id').put(isUserAuthenticated,authorizeRole('admin'),updateOrder)
                                .delete(isUserAuthenticated,authorizeRole('admin'),deleteOrder);


module.exports = router
