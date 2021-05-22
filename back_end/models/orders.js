const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
//Below we are going to first be handling the shipping info of the order.
    shippingInfo:{
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

//We are also gonna be getting the Info of User who placed an order
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User',
            },

/*
This is getting all the products that the user want to buy in this order.
 So this will be array of all order items
 Each product in order contains name,quantity,image,price
*/
        orderItems:[
            {
            name:{
                 type:String,
                  required:true
                },
            //Quantity of that product that, that user want to purchase{order}
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
            //reference of that product
            product:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'Product'
                   },
               },
               ],

           /*Information about order payment, in this case  we are going to be using stripe payment
           So we need ID of Stripe{Stripe gives us ID of the transaction},
            and also the status of that transaction
           */
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
        /*itemsPrice is like total price of items only, like if you want to purchase apple watch & it's price is $3
        and you want to purchase apple watch of quantity 1, then price is $3
        */
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
        like if user has purchased products of price greater than $100 then shipping price=0 and when purchase price is below $100 then sipping price=$25
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
        type:Date,
        default:Date.now()
    }
});
module.exports = mongoose.model('Order', orderSchema);
