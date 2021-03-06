//this is an authorization and authentication of the users controllers

const User = require('../models/users');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const sendToken = require('../utils/JWT')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');

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
    sendToken(user ,200 ,res);

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
     sendToken(user ,200 ,res);
})

//Forgot Password   => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req,res,next) =>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler('User with this email does not exist', 404))   
    }
    //get the reset token and save it to the user
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false})

    //Create the reset Password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\n If you have not requested this email, just ignore it`

    try {
        
        await sendEmail({
            email:user.email,
            subject: 'SHOP-IT Password Recovery',
            message:message
        })
        res.status(200).json({
            success:true,
            message:`Email was successfully sent to :  ${user.email}`
        })


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message, 500))   
 

    }
})

//Reset Password  => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req,res,next) =>{

    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
    })
    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400))    
    }
    if(req.body.password !== req.body.comfirmPassword){
        return next(new ErrorHandler('Passwords does not match', 400))    
    }
    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); 
    sendToken(user ,200 ,res);

})

//Getting the currently logged in user profile details  => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        User:user
    })
})

//Update / change Password  => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.user.id).select('+password');

    //check current current password
    const isMarched = await user.comparePassword(req.body.oldPassword);
    if(!isMarched){
        return next(new ErrorHandler('Old Password is incorrect', 400))    
    }
    
    user.password = req.body.password;
    await user.save();
    sendToken(user ,200 ,res);

})
//logout User  => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async (req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:'Logged Out Successfully'
    })
})