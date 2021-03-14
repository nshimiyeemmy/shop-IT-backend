const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

const errorMiddlewares = require('./middlewares/errors');


app.use(express.json());
app.use(cookieParser());


//Importing all the routes
const products = require('./routes/products');
const users = require('./routes/userAuth');
const orders = require('./routes/orders');

//Implementing the middleware to handle errors
app.use(errorMiddlewares);

// doing routes
app.use('/api/v1', products);
app.use('/api/v1', users);
app.use('/api/v1', orders);


module.exports = app