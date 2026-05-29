const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controller/message.controller");
const authMiddleware = require("../middleware/auth.middleware");
const route = express.Router();

route.post("/sendMessage", sendMessage);
route.get("/getMessages", getMessages);

module.exports = route;
