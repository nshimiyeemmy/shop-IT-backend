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

//Get all orders => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();

    //Calculating the total amount of money for all orders in the database
    let totalAmount = 0
    orders.forEach(order =>{
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success:true,
        TotalAmount:totalAmount,
        Orders:orders
    })
})

//Get Single Order  => /api/v1/admin/order/:id
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate('user','name email');
    if(!order){
        return next(new ErrorHandler(`Order not Found with id ${req.params.id}`, 404)); 
    }
    res.status(200).json({
        success:true,
        Order:order
    })
})

//Get logged in user orders => /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.find({user:req.user.id});
    res.status(200).json({
        success:true,
        Order:order
    })
})