const express = require("express");
const app = express();

app.use(express.json());

//Importing all the routes
const products = require('./routes/products');

// doing routes
app.use('/api/v1', products);



module.exports = app