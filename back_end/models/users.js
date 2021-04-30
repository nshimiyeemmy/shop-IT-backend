const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({

    firstname:{
        type:String,
        required:[true,'Please enter your first name'],
        maxlength:[30, 'Your first name can not exceed 30 characters'],
        validate:[validator.isAlpha,'Please enter only String values']
    },
    lastname:{
        type:String,
        required:[true,'Please enter your last name'],
        maxlength:[30, 'Your last name can not exceed 30 characters']
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true,
        validate:[validator.isEmail, 'Please enter valid email address']
    },
    password:{
        type:String,
        required:[true,'Please enter your Password'],
        minlength:[6, 'Your password must be longer than 6 characters'],

        select:false
    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default:'Customer'
    },
    createdAt:{
        type:Date,
        default:Date.now()
        },
        resetPasswordToken:String,
        resetPasswordExpire:Date,
})

// Encrpting the password before saving user in the database
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)

})

//compare user passwords
userSchema.methods.comparePassword = async function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
}

//returning jsonwebtoken when user registers or logins in
userSchema.methods.getJwtToken = function(){
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_TIME
});
}

//Generating the password reset token
userSchema.methods.getResetPasswordToken = function(){
    //generate the token
    const resetToken = crypto.randomBytes(20).toString('hex');
    //hash & send to getResetPasswordToken, this b'se it's not a good idea to send the unencrpted token
this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
     //set the reset token expires time
     this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

     return resetToken;

}
module.exports = mongoose.model('Users', userSchema);
