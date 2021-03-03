// To manage all product related logics or functions, controllers functions
const Products = require('../models/products');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

//Get single Product =>   /api/v1/products/:id
exports.getSingleProduct = async (req,res,next) =>{
    const product = await Products.findById(req.params.id);

    if(!product)
         return next(new ErrorHandler('Product not Found', 404));
    

            res.status(200).json({
                success:true,
                data:product
            });
}



//Create new Product =>   /api/v1/admin/products/new
exports.newProducts =catchAsyncErrors(async (req,res,next)=>{
    const products = await Products.create(req.body);
    res.status(201).json({
        success: true,
        message:'Product was successfully saved into the Database.',
        data: products
    })
})


//Get All Products =>   /api//v1/products
exports.getProducts = async (req,res,next)=>{
    const products = await Products.find();
    res.status(200).json({
        success: true,
        Count: products.length,
        data: products
    })
}

//Update a Product =>   /api//v1/admin/products/:id
exports.updateProduct = async (req,res,next)=>{
    let product = await Products.findById(req.params.id);

    if(!product){
        return res.status(404).json({
            success:false,
            message: 'Product was not Found'
        })
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

}

//Delete a Product =>   /api//v1/admin/products/:id
 exports.deleteProduct = async(req,res,next)=>{
    let product = await Products.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            success:false,
            message: 'Product was not Found'
        })
    }
    product = await Products.remove();
    res.status(200).json({
        success:true,
        message:'Product was successfully Deleted from the database'
    })
}


