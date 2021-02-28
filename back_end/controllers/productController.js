// To manage all product related logics or functions, controllers functions

exports.getProducts = (req,res,next)=>{
    res.status(200).json({
        success: true,
        message:'This route will show all products from the database.'
    })
}