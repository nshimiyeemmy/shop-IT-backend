const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({

    firstname:{
        type:String,
        required:[true,'Please enter your first name'],
        maxLength:[30, 'Your first name can not exceed 30 characters'],
        validate:[validator.isString, 'Please enter valid first name']
    },
    lastname:{
        type:[true,String],
        required:[true,'Please enter your last name'],
        maxLength:[30, 'Your last name can not exceed 30 characters'],
        validate:[validator.isString, 'Please enter valid last name']
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
        minLength:[6, 'Your password must be longer than 6 characters'],
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
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now()
        },
        resetPasswordToken:String,
        resetPasswordExpire:Date,
})
module.exports = mongoose.model('Users', userSchema);

