const express = require('express');

const {register_User, login_User, logOut_User, reset_password} = require('../controller/userController');


const router = express.Router();

router.route("/register").post(register_User);

router.route("/password/forgot").post(reset_password);

router.route("/login").post(login_User);

router.route("/logout").get(logOut_User);

module.exports = router
