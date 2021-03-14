const Order = require('../models/orders');
const Product  = require('../models/products');
const User = require('../models/users');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')


//Create a new Order  => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user._id
    })               
    res.status(200).json({
        success:true,
        Order:order
    })
})


