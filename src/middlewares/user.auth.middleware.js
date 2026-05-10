import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../configs/config.js";

export const isUser = async (req, res, next) => {
  try {
    const accesstoken = req.cookies.accessToken;
    if (!accesstoken) {
      return res.status(400).json({
        success: false,
        message: "Login or create an account first",
      });
    }
    const decoded = jwt.verify(accesstoken, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error " + error.message,
    });
  }
};
