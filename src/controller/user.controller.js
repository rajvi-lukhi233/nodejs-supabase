const { supabase } = require("../config/supabase.config");
const { errorResponse, successResponse } = require("../util/res.util");

exports.getUsers = async (req, res) => {
  try {
    const { data } = await supabase.from("users").select();
    return successResponse(res, 200, "Users get successfuly", data);
  } catch (error) {
    console.log("Error at getUsers API:", error);
    return errorResponse(res, 500, "Something want wrong");
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
    return errorResponse(res, 500, "Something want wrong");
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
    return errorResponse(res, 500, "Something want wrong");
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();
    if (!data) {
      return errorResponse(res, 404, "User not found");
    }
    return successResponse(res, 200, "Users get successfuly", data);
  } catch (error) {
    console.log("Error at getUsers API:", error);
    return errorResponse(res, 500, "Something want wrong");
  }
};
