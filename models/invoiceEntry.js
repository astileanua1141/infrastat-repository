const mongoose = require("mongoose");

const invoiceEntrySchema = new mongoose.Schema({
  _id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  

});
module.exports = mongoose.model("InvoiceEntry", invoiceEntrySchema);
