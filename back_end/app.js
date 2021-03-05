const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

const errorMiddlewares = require('./middlewares/errors');

app.use(express.json());
app.use(cookieParser());

//Importing all the routes
const products = require('./routes/products');
const users = require('./routes/userAuth');

// doing routes
app.use('/api/v1', products);
app.use('/api/v1', users);

//Implementing the middleware to handle errors
app.use(errorMiddlewares);

module.exports = app