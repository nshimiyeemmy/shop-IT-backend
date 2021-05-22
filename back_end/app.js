const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const errorMiddlewares = require('./middlewares/errors');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

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

module.exports = app;
