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

// get my order  when logged in by user

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

// get All orders by  Admin

exports.getAllOrders = catchAsyncErrors(async(req,res,next) =>{
    const orders = await Order.find();
    
    let totalAmount = 0;
    
    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    })
    
    res.status(200).json({
        success:true,
        totalAmount,
        orders,
        "totalorders":orders.length
        
    })
});


// Update order Status --Admin


exports.updateOrder = catchAsyncErrors( async(req,res,next) =>{
    const order = await Order.findById(req.params.id)

    if(!order){

        return next(new ErrorHandler("order not found", 404));
 
     }

    if(order.orderStatus=== "Delivered"){

        return next(new ErrorHandler(" This order has already been delivered.", 404));
 
     }

     order.orderItems.forEach(async item=>{
        await updateStock(item.product, item.quantity )
     })

     order.orderStatus = req.body.status;

     if(order.orderStatus=== "Delivered"){

        order.deliveredAt = Date.now();
     }

     await order.save({ validateBeforeSave : false })
    res.status(200).json({
        success:true,
    })
});

    async function updateStock(id, quantity){

        const  product = await Product.findById(id);
        product.stock  = product.stock - quantity;
        await product.save({ validateBeforeSave: false})
    }


    
// Delete single order -- Admin

exports.deleteOrder = catchAsyncErrors(async(req,res,next) =>{
    const order = await Order.findById(req.params.id)

    if(!order){

        return next(new ErrorHandler("order not found", 404));
 
     }
     await order.remove();

    res.status(200).json({
        success:true, 
    })
});



