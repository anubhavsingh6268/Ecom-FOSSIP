import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },

    color: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Cart = mongoose.model("Cart", cartSchema);
