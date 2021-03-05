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

    res.status(201).json({
        success:true,
        message: 'User registered Successfully',
        User:user
    })

})