const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  firmName: {
    type: String, //todo Reference to object
    required: true,
  },
  timeline: {
    type: String, //ex: 2022-06
    required: true,
  },
  createdAt:{
    type:Date,
    required:true,
    default:Date.now
  },
  invoiceNo: {
    type: String,
    required: true,
  },
  totalVal: {
    type: Number, //round up
    default: 0
  },
  totalMass: {
    type: Number, //round up
    default: 0

  },
  exchangeRate: {
    type: String //decimal number
  },
  currency: {
    type: String //EUR, GBP, RON
  },
  deliveryTermsCode: {
    type: String,
    required: true
  },
  natureOfTransactionCodeA: {
    type: String,
    required: true
  },
  natureOfTransactionCodeB: {
    type: String,
    required: true
  },
  partnerCountryCode: {
    type: String
  },
  partnerVatNr: {
    type: String
  },

  entries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InvoiceEntry',
    autoPopulate:true
  }]
});


module.exports = mongoose.model("Invoice", invoiceSchema);

