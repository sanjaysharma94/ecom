const Order = require("../models/orderModels");
const Product = require("../models/productmodels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsynErrors");
const ApiFeatures = require("../utils/apiFeatures");


//create  New   order


exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
})

        res.status(201).json({
            success:true,
            order
        })
})