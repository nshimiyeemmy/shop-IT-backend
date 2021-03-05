//this is an authorization and authentication of the users controllers

const User = require('../models/users');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

// Registering a user   => /api/v1/register

exports.registerUser = catchAsyncErrors(async (req,res,next)=>{

    const {firstname,lastname,email,password} = req.body;

    const user = await User.create({
        firstname,
        lastname,
        email,
        password,
        avatar:{
            public_id:'users/n3_ac3ohr',
            url:'https://res.cloudinary.com/nshimiye/image/upload/v1614980358/users/n3_ac3ohr.jpg'
        }
    })
    const token = user.getJwtToken();

    res.status(201).json({
        success:true,
        message: 'User registered Successfully',
        token:token,
        // User:user
    })

})


// Login a User  => /api/v1/login

exports.loginUser = catchAsyncErrors(async (req,res,next)=>{
    
    const {email,password} = req.body;

    //check if email and password are entered by the user
    if(!email || !password){
        return next(new ErrorHandler('Please Enter email & password', 400))
    }
    //finding the user in the database
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return next(new ErrorHandler('Invalid email or password', 401)) 
        }
    //Check is the password is correct or not
     const isPasswordMatched = await user.comparePassword(password);
     if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password', 401)) 
     }
      const token = user.getJwtToken();

     res.status(200).json({
         success:true,
         message:'Logged in successfully',
         token:token
     })
})