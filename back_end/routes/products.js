const express = require('express');
const router = express.Router();

const { getSingleProduct,newProducts, getProducts } = require('../controllers/productController');

router.route('/products').get(getProducts);
router.route('/products/new').post(newProducts);
router.route('/products/:id').get(getSingleProduct);



module.exports = router;