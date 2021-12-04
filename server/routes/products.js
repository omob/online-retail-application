const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

const productServices = require("../services/products");

router.post("/", auth, admin, (req, res) => {
  productServices.addProduct(req, res);
});

router.get("/", (req, res) => {
  productServices.fetchProducts(req, res);
});

router.get("/:id", validateObjectId, (req, res) => {
  productServices.getProduct(req, res);
});

router.put("/:id", auth, admin, validateObjectId, (req, res) => {
  productServices.updatedProduct(req, res);
});

//TODO
// what happens when a product is deleted and a user already subscribed for same? Will the user be unsubscribed automatically?
// delete product
router.delete("/:id", auth, admin, validateObjectId, (req, res) => {
  productServices.deleteProduct(req, res);
});

module.exports = router;
