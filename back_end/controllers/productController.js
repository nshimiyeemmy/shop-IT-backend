// To manage all product related logics or functions, controllers functions
const Products = require('../models/products');


//Create new Product =>   /api//v1/products/new
exports.newProducts = async (req,res,next)=>{
    const Products = await Products.create(req.body);
    res.status(201).json({
        success: true,
        message:'Product was successfully saved into the Database.',
        data: product
    })
}

//Get All Products =>   /api//v1/products
exports.getProducts = async (req,res,next)=>{
    const products = await Products.find();
    res.status(200).json({
        success: true,
        Count: products.length,
        data: products
    })
}

//Get single Product =>   /api//v1/products/:id
exports.getSingleProduct = async (req,res,next) =>{
    const product = await Products.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            success:false,
            message: 'Product was not Found'
        })
    }
    res.status(200).json({
        success:true,
        data:product
    })
}

