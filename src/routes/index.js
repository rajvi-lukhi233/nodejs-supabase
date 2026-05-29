const express = require("express");
const route = express.Router();
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const orderRoute = require("./order.route");
const messageRoute = require("./message.route");
const storageRoute = require("./storage.route");

route.use("/auth", authRoute);
route.use("/user", userRoute);
route.use("/orders", orderRoute);
route.use("/message", messageRoute);
route.use("/storage", storageRoute);

module.exports = route;
