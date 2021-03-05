const express = require('express');
const router = express.Router();


const { getSingleProduct,newProducts, getProducts,updateProduct,deleteProduct } = require('../controllers/productController');
const {isUserAuthenticated} = require('../middlewares/authenticate');

router.route('/products').get(getProducts);
router.route('/admin/products/new').post(isUserAuthenticated,newProducts);
router.route('/products/:id').get(getSingleProduct);
router.route('/admin/products/:id').put(isUserAuthenticated,updateProduct)
                                    .delete(isUserAuthenticated,deleteProduct)

module.exports = router;