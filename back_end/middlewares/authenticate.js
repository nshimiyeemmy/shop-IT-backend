//Checking if the user is authenticated or not
const User = require('../models/users')
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require('../utils/errorHandler'); 
 const jwt = require('jsonwebtoken');
 
exports.isUserAuthenticated = catchAsyncErrors(async (req,res,next)=>{

        const {token} = req.cookies;
        
        if(!token){
            return next(new ErrorHandler('Login first to access this resource', 401));
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next()
})