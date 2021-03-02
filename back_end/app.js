const express = require("express");
const app = express();
const errorMiddleware = require('./middlewares/errors');

app.use(express.json());
//Importing all the routes
const products = require('./routes/products');

// doing routes
app.use('/api/v1', products);

//Implementing the middleware to handle errors
app.use(errorMiddleware);

module.exports = app