const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    firstname:{
        type:String,
        required:[true,'Please enter your first name'],
        maxlength:[30, 'Your first name can not exceed 30 characters']
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


module.exports = mongoose.model('Users', userSchema);

