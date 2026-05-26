const { supabase } = require("../config/supabase.config");
const { errorResponse } = require("../util/res.util");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return errorResponse(res, 401, "Unauthorized");
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return errorResponse(res, 401, "Invalid token");
    }

    req.user = data.user;

    next();
  } catch (error) {
    console.log("Auth middleware Error", error);
    return errorResponse(res, 500, "Something went wrong");
  }
};
