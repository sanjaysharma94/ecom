const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsynErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")




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

    
    const isPasswordMatched = await user.comparePassword(password);
    
    
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
            message:message,
            
            
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

//resetPassword
 exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
            //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")



    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });

    if(!user){
        return next(new ErrorHandler("reset password token is invalid or has been expired",400))
    }

    if(req.body.password !== req.body.confirmPassword){{
        return next(new ErrorHandler("password does not match ",400))
    }}

    user.password = req.body.password; 
    user.resetPasswordToken= undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user,200,res);
 }) ;

 // Get user details

 exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user =  await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user,
    });
 });

 // update user password 

 exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user =  await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldpassword);

    if(!isPasswordMatched){
        return next( new ErrorHandler("old password is incorrect",401))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next( new ErrorHandler("passwords does not match ",401))
    }


     user.password = req.body.newPassword
     await user.save();
    sendToken(user,200,res)
 });

  // update user profile 

  exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    // we will add cluodinary later 

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{new:true,
        runValidators:true,
        useFindAndModify:false 
        })

    res.status(200).json({
        success:true
    })
 });


 // get all users 

 exports.getAllUsers =  catchAsyncErrors(async(req,res,next)=>{

        const users = await User.find()

        res.status(200).json({
            success:true,
            users,
        })
 })


// get single user details by admin
 
 exports.getSingleUser =  catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id)

    if(!user) return next(new ErrorHandler(`user does not exist with id ${req.params.id}`))

    res.status(200).json({
        success:true,
        user,
    })
})
