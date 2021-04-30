let tokens = require('../models/tokens');
//create, send and save the JWT token in the cookie
const sendToken = (user, statusCode,res)=>{
    //create JWT token
    const token = user.getJwtToken();
    //create Options for the cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly:true
    }
    tokens.create({token:token});

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token:token,
        User:user
    })
}
module.exports = sendToken
