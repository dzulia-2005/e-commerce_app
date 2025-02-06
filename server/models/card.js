const mongoose = require("mongoose");

const cardShchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },

    price : {
        type:String,
        trim:true,
    },

    location : {
        type:String,
        trim:true
    },

    HouseSize : {
        type:String,
        trim:true,
    },

    HouseSquart : {
        type:String,
        trim:true,
    },

    postalCode : {
        type:String,
        trim:true
    },

    TransactionType : {
        type:String,
        trim:true
    },

    caption : {
        type:String,
        trim:true
    },

    image : [{
        type:String,
        required:false
    }],

    favourite : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
})