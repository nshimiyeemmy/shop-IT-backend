const Product = require('../models/products');
const dotenv = require('dotenv');
const connectToDatabase = require('../config/database');
const products = require('../data/products.json');

//setting up the dotenv file
dotenv.config({path: 'back_end/config/config.env'});
//connecting to the database
connectToDatabase();
const seedProducts= async ()=>{
    try {

        await Product.deleteMany();
        console.log('All Products deleted Successfully');

        await Product.insertMany(products)
        console.log("All Products Inserted Successfully");
        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }y
}
seedProducts();
