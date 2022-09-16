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
    type: String
  },
  netMass:{
    type: Number
  },
  countryOfOrigin:{
    type:String
  },
  countryOfDestination:{
    type:String
  },
  countryOfConsignment:{ //expedition country
    type:String
  },
  partnerCountryCode:{
    type:String
  },
  partnerVat:{
    type:String
  },
  supplyUnitCode:{
    type:String
  },
  quantityInSupplyUnits:{
    type:String
  }
});
module.exports = mongoose.model("InvoiceEntry", invoiceEntrySchema);
