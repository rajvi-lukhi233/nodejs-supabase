const express = require("express");
const route = express.Router();
const authRoute = require("./auth.route");
const userRoute = require("./user.route");

route.use("/auth", authRoute);
route.use("/user", userRoute);

module.exports = route;
