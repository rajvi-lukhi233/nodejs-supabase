const { supabase } = require("../config/supabase.config");
const { errorResponse, successResponse } = require("../util/res.util");

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const { data, error } = await supabase
      .from("messages")
      .insert({ senderId, receiverId, message })
      .select()
      .single();
    if (error) {
      return errorResponse(res, 400, error.message);
    }
    return successResponse(res, 201, "Message send successfully", data);
  } catch (error) {
    console.log("Error at sendMessage API", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    const { data, error } = await supabase
      .from("messages")
      .select(`* ,sender:senderId(name),receiver:receiverId(name)`)
      .or(
        `and(senderId.eq.${senderId},receiverId.eq.${receiverId}),and(senderId.eq.${receiverId},receiverId.eq.${senderId})`,
      )
      .order("created_at", { ascending: true });

    if (error) {
      return errorResponse(res, 400, error.message);
    }

    return successResponse(res, 200, "Messages retrive successfully", data);
  } catch (error) {
    console.log("Error at getMessage API", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.getSingleMessage = async (req, res) => {
  try {
    const messsages = await supabase
      .from("messages")
      .select(`* ,sender:senderId(name),receiver:receiverId(name)`)
      .or(`(senderId.eq.${req.user.id}),receiverId.eq.${req.user.id}`)
      .order("created_at", { ascending: false });
    return successResponse(res, 200, "Get messages. successfully", messsages);
  } catch (error) {
    console.log("Error at getSingleMessage API", error);
    return errorResponse(res, 400, error.message);
  }
};
