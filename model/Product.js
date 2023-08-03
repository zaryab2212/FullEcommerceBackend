const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: { require: true, type: String, unique: true },
  description: { require: true, type: String },
  price: {
    require: true,
    type: Number,
    min: [0, "Product price can't be 0"],
    max: [10000, "product price is too high"],
  },
  discountPercentage: {
    type: Number,
    min: [0, "Product discount can't be 0"],
    max: [100, "product price is too high"],
  },
  rating: {
    type: Number,
    min: [0, "Minimum ratings can be 0 "],
    max: [5, "product rating can't be more than 5"],
    default: 0,
  },
  stock: { type: Number, min: [0, "Minimum stock can be 0 "], default: 0 },
  brand: { require: true, type: String },
  thumbnail: { require: true, type: String },
  images: { require: true, type: [String] },
  category: { require: true, type: String },
  deleted: { require: true, type: Boolean },
});

const virtual = ProductSchema.virtual("id")
virtual.get(function(){
    return this._id;
})
ProductSchema.set("toJSON",{
    virtuals: true,
    versionKey:false,
    transform:function(doc,ret){ delete ret._id}
})

exports.Product = mongoose.model("Product", ProductSchema);
