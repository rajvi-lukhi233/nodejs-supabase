const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
} = require("../controller/order.controller");

const route = express.Router();

route.use(authMiddleware);

route.post("/", createOrder);
route.get("/", getOrders);
route.get("/:orderId", getSingleOrder);
route.patch("/:orderId", updateOrder);
route.delete("/:orderId", deleteOrder);

module.exports = route;
