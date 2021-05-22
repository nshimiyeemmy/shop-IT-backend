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

    //updating the quantity of Product items quantity back in products table after a purchase
    order.orderItems.forEach(async item => {
        //function to update product quantity
      await updateQuantity(item.product,item.quantity)
    })




    //updating the order status and the delivered date
    order.orderStatus = req.body.orderStatus,
    order.deliveredAt = Date.now()

   await order.save({ validateBeforeSave:false })
    res.status(200).json({
        success:true,
        message:"Order updated successfully",
        Orders:order
    })
})
//method to update the product quantity when the order is made on that product(this is like reducing it's quantity in db when it has been placed on an order)
  async function updateQuantity(id, quantity) {
    const product = await Product.findById(id)
    product.quantity = product.quantity - quantity;
    await product.save({ validateBeforeSave:false });
}
//Delete an Order  => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    //check if order exists
    if(!order){
        return next(new ErrorHandler(`Order not Found with id ${req.params.id}`, 404));
    }
   // if order exists then remove(delete) it from the database
    await order.remove();
    res.status(200).json({
        success:true,
        message:"Order deleted successfully"
    })
})
