
const Product = require("../models/productmodels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsynErrors");
const ApiFeatures = require("../utils/apiFeatures");




exports.createProduct = catchAsyncErrors(async(req,res,next)=>{
    req.body.user = req.user.id
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    });
    
});


exports.getAllProducts = catchAsyncErrors(async(req,res) =>{
    const resultPerpage = 3;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerpage);
    const products = await apiFeature.query;
    res.status(200).json({
        success:true,
        products,
        productCount
    })
});

exports.productUpdate = catchAsyncErrors(async(req,res,next) =>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("product not found", 404));
    }
    product  = await Product.findByIdAndUpdate(req.params.id,req.body, {new:true,
            runValidators:true,
            useFindAndModify:false 
            })
            res.status(200).json({
            success:true,
            product 
         })
     
});

exports.deleteProduct = catchAsyncErrors(async(req,res,next) =>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("product not found", 404));
     }

     await product.remove();
    res.status(200).json({
        success:true,
        message :"product deleted successfully"
    })
});


exports.getSingleProduct = catchAsyncErrors(async(req,res,next) =>{
    const product = await Product.findById(req.params.id);

    if(!product){

        return next(new ErrorHandler("product not found", 404));
 
     }
    res.status(200).json({
        success:true,
        product
        
    })
});


// create new review or update the review
exports.createProductReview = catchAsyncErrors(async(req,res,next) =>{
        const review = {
            user:req.user._id,
            name:req.user.name,
            rating:Number(req.body.rating),
            comment : req.body.comment,
            
        }

        const product = await Product.findById(req.body.productId);

        const isReviewed = product.review.find(rev=>rev.user.toString()===req.user._id.toString());

        if(isReviewed){

            product.review.forEach(rev=>{
                if(rev=>rev.user.toString()===req.user._id.toString())
                    (rev.rating=Number(req.body.rating)),(rev.comment=req.body.comment)
            })
            
        }
        else {
            product.review.push(review)
            product.numOfReviews=product.reviews.length

        }

        let avg = 0;

        product.ratings = product.reviews.forEach(rev=>{
            avg += rev.rating
        })/product.reviews.length

        await product.save({ validateBeforeSave:false});

        res.status(200).json({
            success:true,
        
        })
})

