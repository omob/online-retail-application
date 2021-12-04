const { Product, validateProduct } = require("../models/product");

const addProduct = async (req, res) => {
  const { error } = validateProduct(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const { name, description, price, imageUrl } = req.body;

  const newProduct = new Product({
    name,
    description,
    imageUrl,
    price,
  });

  await newProduct.save();
  res.send("Success");
};

const fetchProducts = async (req, res) => {
  const products = await Product.find({});
  res.send(products);
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.send(product);
};

const updateProduct = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, description, price, imageUrl } = req.body;

  const product = await Product.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name,
      description,
      price,
      imageUrl,
    }
  );

  res.send(product);
};

const deleteProduct = async (req, res) => {
  await Product.deleteOne({ _id: req.params.id });
  res.send("Deleted");
};

module.exports = {
  addProduct,
  fetchProducts,
  getProduct,
  updatedProduct: updateProduct,
  deleteProduct,
};
