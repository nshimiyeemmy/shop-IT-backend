const express = require('express');
const router = express.Router();


const { getSingleProduct,newProducts, getProducts,updateProduct,deleteProduct,createProductReview,getAllProductReviews
    ,deleteProductReview} = require('../controllers/productController');
const {isUserAuthenticated,authorizeRole} = require('../middlewares/authenticate');

router.route('/products').get(isUserAuthenticated,getProducts);
router.route('/admin/products/new').post(isUserAuthenticated,authorizeRole('admin'),newProducts);
router.route('/products/:id').get(getSingleProduct);
router.route('/admin/products/:id').put(isUserAuthenticated,authorizeRole('admin'),updateProduct)
                                    .delete(isUserAuthenticated,authorizeRole('admin'),deleteProduct)

router.route('/review/new').put(isUserAuthenticated,createProductReview);
router.route('/admin/reviews').get(isUserAuthenticated,authorizeRole('admin'),getAllProductReviews);

                          

module.exports = router;