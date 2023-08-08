const express = require("express");

const {
  createProduct,

  fetchProductbyid,
  updateProduct,
  fetchAllProducts,
} = require("../Controller/Product");
const router = express.Router();

router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductbyid)
  .patch("/:id", updateProduct);

exports.router = router;
