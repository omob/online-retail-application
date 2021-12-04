const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  imageUrl: String,
  price: String,
  description: String,
});

const Product = mongoose.model("Product", ProductSchema);

function validateProduct(product) {
  const schema = {
    name: Joi.string().required(),
    imageUrl: Joi.string().allow(""),
    price: Joi.string().required(),
    description: Joi.string().required(),
  };

  return Joi.validate(product, schema);
}
module.exports = { Product, validateProduct };
