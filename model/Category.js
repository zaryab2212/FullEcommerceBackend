const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  label: { require: true, type: String },
  value: { require: true, type: String },

})
const virtual = CategorySchema.virtual("id")
virtual.get(function(){
    return this._id;
})
CategorySchema.set("toJSON",{
    virtuals: true,
    versionKey:false,
    transform:function(doc,ret){ delete ret._id}
})

exports.Category = mongoose.model("Category", CategorySchema);
