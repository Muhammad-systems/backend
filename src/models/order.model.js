import mongoose from "mongoose";
import { string } from "zod";

/** Order schema - stores purchase orders with items and payment details */
const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        title: { type: String },
      },
    ],
    fullname: {
      firstname: {
        type: String,
        required: [true, "firstname is required"],
      },
      lastname: {
        type: String,
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Online"],
    },
    paymentStatus:{
      type:String,
      required:true,
      enum: ["pending", "paid", "failed", "refunded"],
      default:"pending"
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered","cancelled"],
      default: "pending",
    },
    bill: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

/** Auto-calculates total bill before saving */
orderSchema.pre("save", function (next) {
  this.bill = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  next();
});

export const orderModel = mongoose.model("Order", orderSchema);
