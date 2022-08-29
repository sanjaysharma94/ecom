const express = require("express");
const { registerUser, loginUser, logoutUser, forgetPassword, resetPassword,
     getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser ,updateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser , authorizeRole} = require("../middleware/auth");
const router = express.Router();

router.route("/registerUser").post(registerUser);
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/password/forget").post(forgetPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/password/update").put( isAuthenticatedUser,updatePassword)
router.route("/me/update").put( isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizeRole("admin"), getAllUsers)
router.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizeRole("admin"), getSingleUser)
.put(isAuthenticatedUser,authorizeRole("admin"),updateUserRole)
.delete(isAuthenticatedUser,authorizeRole("admin"),deleteUser)


module.exports = router;