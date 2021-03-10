// To manage all product related logics or functions, controllers functions
const Products = require('../models/products');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures');


//Get All Products =>   /api//v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req,res,next)=>{
    const resPerPage = 4;
    //In order to implement pagination on front end you have to provide total number of documents in the database like below
    const productCount = await Products.countDocuments();

    const apiFeatures = new APIFeatures(Products.find(), req.query)
                            .search()
                            .filter()
                            .pagination(resPerPage);
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        Count: products.length,
        productCount:productCount,
        data: products
    })
})
//Get single Product =>   /api/v1/products/:id
exports.getSingleProduct = catchAsyncErrors(async (req,res,next) =>{
    const product = await Products.findById(req.params.id);

    if(!product)
         return next(new ErrorHandler('Product not Found', 404));
    

            res.status(200).json({
                success:true,
                data:product
            });
})

//Create new Product =>   /api/v1/admin/products/new
exports.newProducts =catchAsyncErrors(async (req,res,next)=>{
    const products = await Products.create(req.body);
    res.status(201).json({
        success: true,
        message:'Product was successfully saved into the Database.',
        data: products
    })
})

//Update a Product =>   /api//v1/admin/products/:id
exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{
    let product = await Products.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product not Found', 404));

    }
    product = await Products.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        data:product
    })

})

//Delete a Product =>   /api//v1/admin/products/:id
 exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    let product = await Products.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product not Found', 404));

    }
    product = await Products.remove();
    res.status(200).json({
        success:true,
        message:'Product was successfully Deleted from the database'
    })
})



