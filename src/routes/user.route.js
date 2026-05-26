const express = require("express");
const {
  getUsers,
  updateUser,
  deleteUser,
  getSingleUser,
} = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const route = express.Router();

route.get("/getAllUser", authMiddleware, getUsers);
route.get("/getSingleUser/:userId", authMiddleware, getSingleUser);
route.patch("/updateUser/:userId", authMiddleware, updateUser);
route.delete("/deleteUser/:userId", authMiddleware, deleteUser);

module.exports = route;
