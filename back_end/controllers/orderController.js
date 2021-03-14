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

//update / Process orders => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    //Checking if the orderStatus if not delivered and then update
    if(order.orderStatus === 'Delivered'){
   return next(new ErrorHandler('You have already delivered this order',400))
    }

    order.orderItems.forEach(async item => {
      await updateQuantity(item.product,item.quantity)
    })
    
    //updating the order status and the delivered date
    order.orderStatus = req.body.orderStatus,
    order.deliveredAt = Date.now()

     await order.save()

    res.status(200).json({
        success:true
        // message:"Order updated successfully",
        // Orders:order
    })
})
  async function updateQuantity(id, quantity) {
    const product = await Product.findById(id)
    console.log(product);       
    product.quantity = product.quantity - quantity;
    console.log(product);    
    await product.save({ validateBeforeSave:false });
}