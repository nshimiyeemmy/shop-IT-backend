const express = require('express');
const router = express.Router();


const { getSingleProduct,newProducts, getProducts,updateProduct,deleteProduct } = require('../controllers/productController');
const {isUserAuthenticated} = require('../middlewares/authenticate');
router.route('/products').get(isUserAuthenticated,getProducts);
router.route('/admin/products/new').post(newProducts);
router.route('/products/:id').get(getSingleProduct);
router.route('/admin/products/:id').put(updateProduct)
                                    .delete(deleteProduct)

module.exports = router;