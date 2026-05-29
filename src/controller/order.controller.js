const { supabase } = require("../config/supabase.config");
const { errorResponse, successResponse } = require("../util/res.util");

exports.createOrder = async (req, res) => {
  try {
    const { productName, price, quantity } = req.body;
    const { data, error } = await supabase
      .from("orders")
      .insert({
        userId: req.user.id,
        productName,
        price,
        quantity,
      })
      .select()
      .single();

    if (error) {
      return errorResponse(res, 400, error.message);
    }

    return successResponse(res, 201, "Order created successfully", data);
  } catch (error) {
    console.log("Error at createOrder API:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { data, error, count } = await supabase
      .from("orders")
      .select("id,productName,price,quantity,userId,users(name, email)", {
        count: "exact",
      })
      .eq("userId", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return errorResponse(res, 400, error.message);
    }
    return successResponse(res, 200, "Order fatched successfully", {
      order: data,
      total: count || 0,
    });
  } catch (error) {
    console.log("Error at getOrders API:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, userId, productName, price, quantity,created_at, users(name, email)",
      )
      .match({ id: orderId, userId: req.user.id })
      .single();

    if (error || !data) {
      return errorResponse(res, 404, "Order not found");
    }

    return successResponse(res, 200, "Order fetched successfully", data);
  } catch (error) {
    console.log("Error at getSingleOrder API:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { productName, price, quantity } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .update({ productName, price, quantity })
      .select("id, userId, productName, price, quantity,created_at")
      .match({ id: orderId, userId: req.user.id })
      .single();

    if (error || !data) {
      return errorResponse(res, 404, "Order not found or not updated");
    }
    return successResponse(res, 200, "Order updated successfully", data);
  } catch (error) {
    console.log("Error at updateOrder API:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .match({ id: orderId, userId: req.user.id })
      .select("*");

    if (error) {
      return errorResponse(res, 400, error.message);
    }

    if (!data.length) {
      return errorResponse(res, 404, "Order not found");
    }

    return successResponse(res, 200, "Order deleted successfully");
  } catch (error) {
    console.log("Error at deleteOrder API:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
