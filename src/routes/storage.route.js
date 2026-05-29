const express = require("express");

const {
  createBucket,
  uploadImages,
  getImageUrl,
  deleteImage,
} = require("../controller/storage.controller");
const { upload } = require("../util/multer");
const route = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

route.post("/createBucket", createBucket);
route.post("/uploadImage", upload.single("image"), uploadImages);
route.get("/getUrl/:fileName", getImageUrl);
route.delete("/deleteImage/:fileName", authMiddleware, deleteImage);

module.exports = route;
