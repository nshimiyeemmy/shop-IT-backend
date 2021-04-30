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
                            .filter();
    let products = await apiFeatures.query;
    let filteredProductsCount = products.length
    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        productCount:productCount,
        resPerPage:resPerPage,
        FilteredProductsCount:filteredProductsCount,
        data: products,
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

//Create new review  => /api/v1/review/new
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{
    const {rating, comment, productId} = req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
     //finding the product, a user wants to review
    let product =await Products.findById(productId);
    //checking if the product is already reviewed by that logged in user
    const isReviewed = product.reviews.find(
    //checking if this review matches current user, to mean that this user has already reviewed this product
      r => r.user.toString() === req.user._id.toString()
    )
    if(isReviewed){
        //if product is already reviewed by that user, that means that i simply have to update that review
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment,
                review.rating = rating
            }
        });

    }else{

     // if user has not reviewed the product before, we are going to push the review to the product
      product.reviews.push(review);
      //And then update the numberOfReviews on product
      product.numberOfReviews = product.reviews.length;
    }
    //Updating the total ratings using reduce() that will reduce the multiple values{many reviews} to one single value {ratings}
    product.ratings = product.reviews.reduce((acdc,item) =>item.rating + acc, 0) / product.reviews.length

    //then save the product
    await product.save({validateBeforeSave:false})
    //retun response
    res.status(200).json({
        success:true,
        message:'Reviews updated successfully',
        Product:product
    })

})

//Get all product reviews  => /api/v1/admin/reviews
exports.getAllProductReviews = catchAsyncErrors(async(req,res,next)=>{
    //getting the product by it's ID
    const product = await Products.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler('Product not Found', 404));
    }
    res.status(200).json({
        success:true,
    // return the reviews of that product
        Reviews:product.reviews,
    })
    })


//Delete product review  => /api/v1/admin/review
exports.deleteProductReview = catchAsyncErrors(async(req,res,next)=>{
    //getting the product by it's ID
    let product = await Products.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler('Product not Found',404));
    }

    //Filtering reviews of product from the product
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    //updating the number of reviews
    const numberOfReviews = reviews.length

    //Updating the total ratings using reduce() that will reduce the multiple values{many reviews} to one single value {ratings}
    const ratings = product.reviews.reduce((acc,item) =>item.rating + acc, 0) / reviews.length

    //updating the product
     product =  await Products.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numberOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    //sending the response
    res.status(200).json({
        success:true,
        message:'Review Deleted successfully',
        Product:product
    })
    })
