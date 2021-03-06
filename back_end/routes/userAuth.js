const express = require('express');
const router = express.Router();


const {registerUser,loginUser,forgotPassword,resetPassword,getUserProfile,logoutUser} = require('../controllers/usersAuthController');
const {isUserAuthenticated} = require('../middlewares/authenticate');

router.route('/me').get(isUserAuthenticated,getUserProfile);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logoutUser);


module.exports = router;