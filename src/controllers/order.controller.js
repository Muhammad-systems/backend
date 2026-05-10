import { orderModel } from "../models/order.model.js";
import jwt from "jsonwebtoken";
import { placeOrderValidation } from "../validations/validation.js";

export const placeOrder = (req, res) => {
  try {
    const result = placeOrderValidation.safeParse(req.body);
    if (!result.success)
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
    });

    

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error " + error.message,
    });
  }
};
