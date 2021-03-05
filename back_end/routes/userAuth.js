const express = require('express');
const router = express.Router();


const {registerUser,loginUser} = require('../controllers/usersAuthController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

loginUser

module.exports = router;