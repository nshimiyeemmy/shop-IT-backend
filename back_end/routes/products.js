const express = require('express');
const router = express.Router();

const {updateProduct,getSingleProduct,newProducts, getProducts } = require('../controllers/productController');

router.route('/products').get(getProducts);
router.route('/admin/products/new').post(newProducts);
router.route('/products/:id').get(getSingleProduct);
router.route('/admin/products/:id').put(updateProduct);



module.exports = router;