const express = require("express");
const { registerUser, loginUser, logoutUser, forgetPassword } = require("../controllers/userController");
const router = express.Router();

router.route("/registerUser").post(registerUser);
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/password/forget").post(forgetPassword)
module.exports = router;