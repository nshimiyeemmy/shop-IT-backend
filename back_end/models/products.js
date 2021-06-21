const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [200, 'Product name cannot exceed 200 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter product Price'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0.0,
    },
    description: {
        type: String,
        required: [true, 'Please enter product Description'],
    },
    manufacturer: {
        type: String,
        required: [true, 'Please enter Manufacturer name'],
        maxLength: [20, 'Manufacturer name cannot exceed 20 characters'],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, 'Please select the category for this product'],
        //I defined product Categories an enum values
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Clothes/Shoes',
                'Education/Books',
                'Beauty/Health',
                'Sports',
                'Outdoor',
            ],
            message: 'Please select the correct category for Product',
        },
    },
    quantity: {
        type: Number,
        required: [true, 'Please Enter Product Quantity in Stock'],
        maxLength: [5, 'Product Quantity can not exceed 5 characters'],
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    // user:{
    //     type:mongoose.Schema.ObjectId,
    //     ref:'User',
    //     required:true
    // },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
module.exports = mongoose.model('Products', productSchema);
