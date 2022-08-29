const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name : { type:String, required: [true, "please Enter product name"], trim: true},
    description  : { type:String, required: [true, "please Enter product description"]},
    price : { type:Number, required: [true, "please Enter product price"], maxlength :[6, "price cannot exced 8 digits"]},
    ratings : { type:Number, default:0 },
    images :[
        {
            public_id:{ type: String , required:true},
            url:{ type: String , required:true}

        }
    ],

    category :{ type:String , required : [true, "please Enter product category"]},

    stock : { type:Number, required : [true, "please Enter product stock"] , default: 1 , maxlength :[6, "stock cannot exced 6 digits"]},

    numOfReviews : { type:Number, default:0 },

    reviews : [

        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"user",
                required:true
            },
            name:{type:String, required: true},
            rating : { type:Number, default:1, required : true },

            comment : {type:String, required: true}

        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    },

    createdAt : { type: Date, default: Date.now}


})

module.exports = mongoose.model("Product", productSchema);