const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateUserProfile,
  logoutUser,
  getAllUsers,
  getUserDetails,
  updateUserDetails,
  deleteUser,
} = require('../controllers/usersAuthController');
const {
  isUserAuthenticated,
  authorizeRole,
} = require('../middlewares/authenticate');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isUserAuthenticated, getUserProfile);
router.route('/password/update').put(isUserAuthenticated, updatePassword);
router.route('/me/update').put(isUserAuthenticated, updateUserProfile);
router.route('/logout').get(logoutUser);

router.route('/admin/users').get(isUserAuthenticated, getAllUsers);
router
  .route('/admin/user/:id')
  .get(isUserAuthenticated, authorizeRole('admin'), getUserDetails)
  .put(isUserAuthenticated, authorizeRole('admin'), updateUserDetails)
  .delete(isUserAuthenticated, authorizeRole('admin'), deleteUser);

module.exports = router;
