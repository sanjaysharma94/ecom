const express = require("express");
const { newOrder, getSingleOrder, myOrders } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id").get( isAuthenticatedUser, authorizeRole("admin"), getSingleOrder)
router.route("/orders/me").get( isAuthenticatedUser, myOrders)



module.exports = router