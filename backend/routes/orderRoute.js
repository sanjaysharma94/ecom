const express = require("express");
const { newOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post( isAuthenticatedUser,newOrder)


module.exports = router