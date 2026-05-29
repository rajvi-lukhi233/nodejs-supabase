const { supabase } = require("../config/supabase.config");
const { errorResponse, successResponse } = require("../util/res.util");

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // supabase.auth.signUp() //user direct signup
    const { data, error } = await supabase.auth.admin.createUser({
      // admin manually create user
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return errorResponse(res, 400, error.message);
    }
    await supabase
      .from("users")
      .insert({
        id: data.user.id,
        name,
        email,
      })
      .select();
    return successResponse(res, 201, "User registered successfully", data);
  } catch (error) {
    console.log("Error at createUser API:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return errorResponse(res, 400, "Invalid email or password");
    }
    return successResponse(res, 200, "User login successfully", {
      user: data.user,
      token: data.session.access_token,
    });
  } catch (error) {
    console.log("Login Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};


