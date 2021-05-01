const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');

const errorMiddlewares = require('./middlewares/errors');



app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

//setting up our cloudinary config for uploading the images
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//Importing all the routes
const products = require('./routes/products');
const users = require('./routes/userAuth');
const orders = require('./routes/orders');

// doing routes
app.use('/api/v1', products);
app.use('/api/v1', users);
app.use('/api/v1', orders);

//Implementing the middleware to handle errors
app.use(errorMiddlewares);

module.exports = app
