const express = require("express");
const {
  fetchOrdersByUser,

  deleteOrder,
  updateOrder,
  createOrder,
} = require("../Controller/Order");
const router = express.Router();

router
  .get("/", fetchOrdersByUser)
  .post("/", createOrder)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder);

exports.router = router;
