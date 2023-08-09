const express = require("express");
const {
  fetchOrdersByUser,

  deleteOrder,
  updateOrder,
  createOrder,
  fetchAllOrders,
} = require("../Controller/Order");
const router = express.Router();

router
  .get("/user/:userId", fetchOrdersByUser)
  .get("/", fetchAllOrders )
  .post("/", createOrder)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder);

exports.router = router;
