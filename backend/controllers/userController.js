const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsynErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")




//register user

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"this is a dp url"
        }
    });

    sendToken(user,201,res)
 });


 //login user

 exports.loginUser = catchAsyncErrors( async (req,res,next)=>{

    const {email,password}=req.body

    if(!email || !password){
        return next( new ErrorHandler("please Enter email and password",400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next( new ErrorHandler("Invalid user or password",401))
    }

    const isPasswordMatched = user.comparePassword(password);
    if(!isPasswordMatched){
        return next( new ErrorHandler("Invalid user or password",401))
    }

   sendToken(user,200,res)
 })


 //logoutUser

 exports.logoutUser = catchAsyncErrors(async(req,res,next)=>{
res.cookie("token",null,{
    expires: new Date(Date.now()),
    httpOnly:true
}); 

    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
 })

 //forget password
 
 exports.forgetPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("user not found",404))
    }

    //get reset password token
    const resetToken = user.getResetPasswordToken()

    await user.save({ valideBeforeSave :false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message = `your password reset link is :- \n\n ${resetPasswordUrl} \n\n if you have not requested it kindly ignore it `
    try{
      await sendEmail({
            email:user.email,
            subject:`password recovery`,
            message
      }); 
      res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully`
      }) 
    }
    catch(err){
        user.resetPasswordToken= undefined;
        user.resetPasswordExpire = undefined;
        await user.save({valideBeforeSave:false})
        return next(new ErrorHandler(err.message,500))
    }
 })