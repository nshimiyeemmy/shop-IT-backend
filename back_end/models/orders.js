const mongoose = require('mongoose')
const express = require('express');


const orderSchema = new mongoose.Schema({

    ShippingInfo:{

        address:{
        type:String,
        required:true
        },
        city:{
            type:String,
            required:true
            },
        phoneNumber:{
                type:String,
                required:true
                },
        postalCode:{
                    type:String,
                    required:true
                    },
        country:{
                    type:String,
                    required:true
                    }
                },


        user:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'
            },


        orderItems:[
            {
            name:{
                 type:String,
                  required:true
                },
            quantity:{
                   type:Number,
                    required:true
                 },
            image:{
                type:String,
                required:true
                },
            price:{
                type:String,
                required:true
                },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'Product'
                   }
               }
               ],


           paymentInfo:{
               id:{
                   type:String, 
               },
               status:{
                   type:String
               }
            },
            payedAt:{
                type:Date
            },
        //Below is the calculation of the total price of all items to be purchased
           itemsPrice:{
               type:Number,
               require:true,
               default:0.0
           } , 
         //Below is where we are going to calculate the tax price
         taxPrice:{
            type:Number,
            require:true,
            default:0.0
        },
        /* Below is where we are going to calculate the shipping price depending on what they purchased 
        like if user made an order of $100 then shipping price=0 and when order amount is below $100 then sipping price=$25
        */
        shippingPrice:{
            type:Number,
            require:true,
            default:0.0
        },
        //This is the total amount of money that user has to pay, it's addition of shippingPrice,taxPrice and itemsPrice
        totalPrice:{
            type:Number,
            require:true,
            default:0.0
        },
    //Order status defines the status of the order whether delivered or comfirmed or processing etc
        orderStatus:{
            type:String,
            require:true,
            default:'Processing'
        },
        deliveredAt:{
            type:Date
        },
    createdAt:{
        Date:Date,
        default:Date.now()
    }
});
module.exports = mongoose.model('Orders', productSchema);

