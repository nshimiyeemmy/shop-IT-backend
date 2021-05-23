//this is an authorization and authentication of the users controllers

const User = require('../models/users');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/JWT');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Registering a user   => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'users',
    width: 150,
    crop: 'scale',
  });
  const { firstname, lastname, email, password } = req.body;
  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url, // secure url is as to obey http protocol
    },
  });
  sendToken(user, 200, res);
});

// Login a User  => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password are entered by the user
  if (!email || !password) {
    return next(new ErrorHandler('Please Enter email & password', 400));
  }
  //finding the user in the database
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  //Check is the password is correct or not
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  sendToken(user, 200, res);
});
//Forgot Password   => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler('User with this email does not exist', 404));
  }
  //get the reset token and save it to the user
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //Create the reset Password url   => /api/v1/password/reset
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\n If you have not requested this email, just ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'SHOP-IT Password Recovery',
      message: message,
    });
    res.status(200).json({
      success: true,
      message: `Email was successfully sent to :  ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
//Reset Password  => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Hash URL token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler('Password reset token is invalid or has expired', 400)
    );
  }
  if (req.body.password !== req.body.comfirmPassword) {
    return next(new ErrorHandler('Passwords does not match', 400));
  }
  //setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

//Getting the currently logged in user profile details  => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
//Update / change Password  => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  //check current current password
  const isMarched = await user.comparePassword(req.body.oldPassword);
  if (!isMarched) {
    return next(new ErrorHandler('Old Password is incorrect', 400));
  }
  user.password = req.body.password;
  await user.save();
  sendToken(user, 200, res);
});
//Update loggedin user profile    => /api/v1/me/update
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
  };
  //updated the avatar
  if (req.body.avatar !== '') {
    const user = await User.findById(req.user.id);
    const image_id = user.avatar.public_id;
    const res = await cloudinary.v2.uploader.destroy(image_id);
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'users',
      width: 150,
      crop: 'scale',
    });
    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: 'updated successfully Successfully',
    user,
  });
});
//logout User  => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logged Out Successfully',
  });
});
//Admin routes
//Get all Users  => /api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    Users: users,
  });
});

//Get user details  => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    User: user,
  });
});

//Update  user profile    => /api/v1/admin/user/:id
exports.updateUserDetails = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: 'updated successfully Successfully',
    User: user,
  });
});

//Delete User  => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id ${req.params.id}`, 400)
    );
  }
  //Remove avatar from Cloudinary:TODO

  await user.remove();
  res.status(200).json({
    success: true,
    message: 'User Deleted Successfully',
  });
});
