const mongoose = require("mongoose");


const natureOfTransactionSchema = new mongoose.Schema({
    code :{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    refCode:{
        type:String
    },
    category:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("NatureOfTransactionCode", natureOfTransactionSchema);
