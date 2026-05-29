const { supabase } = require("../config/supabase.config");
const { errorResponse, successResponse } = require("../util/res.util");

exports.createBucket = async (req, res) => {
  try {
    const { data, error } = await supabase.storage.createBucket("images", {
      public: true,
      fileSizeLimit: 1024 * 1024 * 5,
      allowedMimeTypes: ["image/*"],
    });
    if (error) {
      return errorResponse(res, 400, error.message);
    }
    return successResponse(res, 200, "Bucket created successfully", data);
  } catch (error) {
    console.log("Error at createBucket API", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.uploadImages = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return errorResponse(res, 400, "Image is require");
    }
    const fileName = `${Date.now()}_${file.originalname}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file.buffer, { contentType: file.mimetype });
    if (error) {
      return errorResponse(res, 400, error.message);
    }
    return successResponse(res, 200, "Image uploaded sucessfully", {
      filePath: data.path,
    });
  } catch (error) {
    console.log("Error at uploadImages API", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.getImageUrl = async (req, res) => {
  try {
    const { fileName } = req.params;
    const { data } = await supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    return successResponse(
      res,
      200,
      "Image url retrive successfully",
      data.publicUrl,
    );
  } catch (error) {
    console.log("Error at getImageUrl API", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { fileName } = req.params;
    const userId = req.user.id;
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("profile_image")
      .match({
        id: userId,
        profile_image: fileName,
      });
    if (userError) {
      return errorResponse(res, 400, userError.message);
    }
    if (!user[0]?.profile_image) {
      return errorResponse(res, 404, "Image not found or already deleted");
    }
    const { error } = await supabase.storage
      .from("profile-images")
      .remove([fileName]);
    if (error) {
      return errorResponse(res, 400, error.message);
    }
    await supabase
      .from("users")
      .update({ profile_image: null })
      .eq("id", userId);
    return successResponse(res, 200, "Image deleted successfully");
  } catch (error) {
    console.log("Error at deleteImage API", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
