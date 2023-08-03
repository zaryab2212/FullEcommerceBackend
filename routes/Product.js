const express = require("express");

const {
  createProduct,
  fetchAllProducts,
  fetchProductbyid,
  updateProduct,
} = require("../Controller/Product");
const router = express.Router();

router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductbyid)
  .patch("/:id", updateProduct);

exports.router = router;
