const Order = require("../models/orderModels");
const Product = require("../models/productmodels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsynErrors");
const ApiFeatures = require("../utils/apiFeatures");
const userModels = require("../models/userModels");


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

// get single order 

exports.getSingleOrder = catchAsyncErrors(async(req,res,next) =>{
    const order = await Order.findById(req.params.id).populate({
        path: 'user',
        select: 'name email',
        model: userModels
});

    if(!order){

        return next(new ErrorHandler("order not found", 404));
 
     }
    res.status(200).json({
        success:true,
        order
        
    })
});

// get my order  when logged in

exports.myOrders = catchAsyncErrors(async(req,res,next) =>{
    const orders = await Order.find({user : req.user._id});

    if(!orders){

        return next(new ErrorHandler("No previous orders found", 404));
 
     }
    res.status(200).json({
        success:true,
        orders,
        "totalorders":orders.length
        
    })
});