// To manage all product related logics or functions, controllers functions

const products = require('../models/products');

exports.newProducts = async (req,res,next)=>{
    const product = await products.create(req.body);
    res.status(201).json({
        success: true,
        message:'Product was successfully saved into the Database.',
        product
    })
}

exports.getProducts = (req,res,next)=>{
    res.status(200).json({
        success: true,
        message:'This route will show all products from the database.'
    })
}