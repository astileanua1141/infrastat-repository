const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  _id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  timeline: {
    type: String, //ex: 2022-06
    required: true,
  },
  number:{
    type: String, 
      required: true,
  },
  totalVal:{
    type: String, //round up
      required: false,
      default:"0"
  },
  totalMass:{
    type: Number, //round up
      required: false,
      default:0

  },
  exchangeRate:{
    type: String, //decimal number
      required: false,
  }, 
  currency:{
    type: String, //decimal number
    required: false,
  },
  deliveryTermsCode:{
    type: String,
      required: true,
  },
  natureOfTransactionCodeA:{ 
    type: String,
      required: true,
  },
  natureOfTransactionCodeB:{
    type: String,
      required: true,
  }
});

module.exports = mongoose.model("Invoice", invoiceSchema);

