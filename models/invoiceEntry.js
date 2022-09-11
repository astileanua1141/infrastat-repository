const mongoose = require("mongoose");

const invoiceEntrySchema = new mongoose.Schema({
  invoiceNo:{
    type:String,
    required:true
  },
  nc8Code:{
    type:String,
    required:true
  },
  invoiceValue: {
    type: Number,
    required: true
  },
  statisticalValue: {
    type: Number,
    required: false
  },
  netMass:{
    type: Number,
    required: true
  },
  countryOfOrigin:{
    type:String, 
    required: false
  },
  countryOfDestination:{
    type:String, 
    required: false
  },
  countryOfConsignment:{ //expedition country
    type:String, 
    required: false
  },
  partnerCountryCode:{
    type:String, 
    required: false
  },
  partnerVat:{
    type:String, 
    required: false
  },
  supplyUnitCode:{
    type:String, 
    required: false
  },
  quantityInSupplyUnits:{
    type:String, 
    required: false
  }
});
module.exports = mongoose.model("InvoiceEntry", invoiceEntrySchema);
