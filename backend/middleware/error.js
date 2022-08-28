const ErrorHandler = require("../utils/errorhandler")
module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error";

    if(err.name==="CastError"){
        const message = `resource not found invalid: ${err.path} `;

        err = new ErrorHandler(message,400)
    }

    // Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400)
    }

    // Wrong JWT error
    if(err.name==="JsonWebTokenError"){
        const message = `json web token is invalid try Again `;

        err = new ErrorHandler(message,400)
    }

    // Jwt expire
    if(err.name==="JsonWebTokenError"){
        const message = `json web token is expired try Again `;

        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success :false,
        message :err.message
    });
};