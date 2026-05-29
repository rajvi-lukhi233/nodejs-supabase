const express = require("express");
const {
  getUsers,
  updateUser,
  deleteUser,
  getSingleUser,
  uploadProfileImages,
} = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { upload } = require("../util/multer");
const route = express.Router();

route.get("/getAllUser", authMiddleware, getUsers);
route.get("/getSingleUser", authMiddleware, getSingleUser);
route.patch("/updateUser/:userId", authMiddleware, updateUser);
route.delete("/deleteUser/:userId", authMiddleware, deleteUser);
route.post(
  "/uploadImage",
  authMiddleware,
  upload.single("image"),
  uploadProfileImages,
);

module.exports = route;
