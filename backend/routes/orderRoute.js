const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/:id").get( isAuthenticatedUser, getSingleOrder)
router.route("/orders/me").get( isAuthenticatedUser, myOrders)

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRole("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRole("admin"), updateOrder);
router.route("/admin/order/:id").delete(isAuthenticatedUser, authorizeRole("admin"), deleteOrder);






module.exports = router