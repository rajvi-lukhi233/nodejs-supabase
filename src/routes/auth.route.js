const express = require("express");
const { signUp, login } = require("../controller/auth.controller");
const route = express.Router();

route.post("/signUp", signUp);
route.post("/login", login);

module.exports = route;
