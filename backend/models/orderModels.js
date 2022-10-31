const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    shippingInfo : {
        address:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        country:{type:String,required:true},
        pincode:{type:Number, required:true},
        phoneNo:{type:Number, required:true} 

    },
    orderItems:[
       {
         name:{type:string, required:true},
         price:{type:Number, required:true} ,
         quantity:{type:Number, required:true} ,
         image:{type:Number, required:true} ,
         product:{type:mongoose.Schema.ObjectId , ref: "product", required:true}

        }
    ],
    user:{
        
        type:mongoose.Schema.ObjectId , ref: "user", required:true

    },

    paymentInfo:{
        id:{type:string, required:true},
        status:{type:string, required:true}
    },

    paidAt:{
        type:Date,
        required:true
    },

    itemPrice:{
        type:Number, default:0,
        required:true
    },

    taxPrice:{
        type:Number, default:0,
        required:true
    },

    shippingPrice:{
        type:Number, default:0,
        required:true
    },

    totalPrice:{
        type:Number, default:0,
        required:true
    },

    orderStatus:{
        type:String,
        required:true,
        default:"processing"
    },

    deliveredAt:Date,

    createdAt:{
        type:Date,
        default:Date.now,
    }


})

module.exports = mongoose.model("Order",orderSchema)