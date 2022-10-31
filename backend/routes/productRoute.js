const express = require("express");
const { getAllProducts,
        createProduct,
        productUpdate,
        deleteProduct,
        getSingleProduct,
        createProductReview,
        getProductReviews, 
        deleteReview
    } = require("../controllers/productcontroller");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get( isAuthenticatedUser,getAllProducts)
router.route("/product").post(isAuthenticatedUser,authorizeRole("admin"),createProduct)
router.route("/product/:id").put(isAuthenticatedUser,authorizeRole("admin"),productUpdate)
router.route("/product/:id").delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct)
router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(isAuthenticatedUser,createProductReview)
router.route("/review").get(getProductReviews).delete(isAuthenticatedUser,deleteReview)

module.exports = router;