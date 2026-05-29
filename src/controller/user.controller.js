const { supabase } = require("../config/supabase.config");
const { errorResponse, successResponse } = require("../util/res.util");

exports.getUsers = async (req, res) => {
  try {
    const { data } = await supabase.from("users").select();

    const users = data.map((user) => {
      const profileUrl = user.profile_image
        ? supabase.storage
            .from("profile-images")
            .getPublicUrl(user.profile_image).data.publicUrl
        : null;

      return { ...user, profileUrl };
    });

    return successResponse(res, 200, "Users get successfuly", users);
  } catch (error) {
    console.log("Error at getUsers API:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;
    const { data } = await supabase
      .from("users")
      .update({ name, email })
      .eq("id", userId)
      .select()
      .single();

    if (!data) {
      return errorResponse(res, 400, "User not updated");
    }
    await supabase.auth.admin.updateUserById(userId, { email });
    return successResponse(res, 200, "User updated successfully", data);
  } catch (error) {
    console.log("Error at updateUser API:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId);

    if (!existingUser) {
      return errorResponse(res, 404, "User not found");
    }

    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      console.log("inside error", error);
      return errorResponse(res, 400, error.message);
    }
    await supabase.auth.admin.deleteUser(userId);
    return successResponse(res, 200, "User deleted successfully");
  } catch (error) {
    console.log("Error at deleteUser API:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.uploadProfileImages = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id;
    if (!file) {
      return errorResponse(res, 400, "Image is require");
    }
    const fileName = `${Date.now()}_${file.originalname}`;
    const { error } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });
    if (error) {
      return errorResponse(res, 400, error.message);
    }
    await supabase
      .from("users")
      .update({
        profile_image: fileName,
      })
      .eq("id", userId);

    const { data } = await supabase.storage
      .from("profile-images")
      .getPublicUrl(fileName);
    return successResponse(res, 200, "Image uploaded sucessfully", {
      profile_url: data.publicUrl,
    });
  } catch (error) {
    console.log("Error at uploadImages API", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: user } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    let profileUrl = null;
    if (user.profile_image) {
      profileUrl = await supabase.storage
        .from("profile-images")
        .getPublicUrl(user.profile_image).data.publicUrl;
    }
    return successResponse(res, 200, "Users get successfuly", {
      ...user,
      profileUrl,
    });
  } catch (error) {
    console.log("Error at getUsers API:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
