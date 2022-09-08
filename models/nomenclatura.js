const mongoose = require("mongoose");

const nomenclatorSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: false,
    },
    refCode: {
      type: String,
      required: false,
    },
    parentCode: {
      type: String,
      ref: "Nomenclatura",
      autopopulate: true,
    },
    children:[{
        type:String,
        ref:"Nomenclatura",
        strict:false
    }]
  }
);

nomenclatorSchema.plugin(
  require("mongoose-autopopulate")
);

nomenclatorSchema.statics.findSimilarText = function(text){
    return this.find({ lName: new RegExp(text, 'i') }).then();
};


nomenclatorSchema.statics.getChildren = function(nodeId) {
    return this.where({parentCode : nodeId})
  }


module.exports = mongoose.model("Nomenclatura", nomenclatorSchema);
