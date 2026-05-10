import { success } from "zod";
import { cartModel } from "../models/cart.model.js";
import { cartValidation } from "../validations/validation.js";
import { productModel } from "../models/product.model.js";

/**
 * Function to add items in cart
 * @param {req} req - express
 * @param {res} res - express
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = cartValidation.safeParse(req.body);
    if (!result.success)
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    const productId = req.params.id;
    const { quantity } = result.data;

    const product = await productModel.findById(productId);
    if (!product || product.stock < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Out of stock or invalid product" });
    }

    let cart = await cartModel.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId && item.productId.toString() === productId.toString(),
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    } else {
      cart = new cartModel({
        userId,
        items: [{ productId, quantity }],
      });
    }

    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Function to view Cart
 * @param {req} req - express
 * @param {res} res - express
 */
export const viewCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId");

    if (!cart)
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
      });

    const totalBill = cart.items.reduce((currentTotal, item) => {
      const itemTotal = item.productId.price * item.quantity;
      return currentTotal + itemTotal;
    }, 0);

    res.status(200).json({
      success: true,
      cart,
      totalBill,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error " + error.message,
    });
  }
};

/**
 * Function to update Cart items
 * @param {req} req - express
 * @param {res} res - express
 */
export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    const result = cartValidation.safeParse(req.body);
    if (!result.success)
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    const { quantity } = result.data;

    const cart = await cartModel.findOne({ userId });
    if (!cart)
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });

    const product = await productModel.findById(productId);
    if (!product || product.stock < quantity)
      return res.status(400).json({
        success: false,
        message: "Out of stock or invalid product",
      });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();

      return res
        .status(200)
        .json({ success: true, message: "Quantity updated", cart });
    } else {
      return res.status(404).json({ message: "Item not in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Function to remove Cart items
 * @param {req} req - express
 * @param {res} res - express
 */
export const removeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const cart = await cartModel.findOne({ userId });

    if (!cart)
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
      });

    cart.items = cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error " + error.message,
    });
  }
};
