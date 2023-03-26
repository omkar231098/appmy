const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: String,
  
  price: Number,
  userID:String
});

const ProductModel = mongoose.model("product", ProductSchema);
module.exports = { ProductModel };
