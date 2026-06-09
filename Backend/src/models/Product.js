import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true }, // e.g., 'shirts', 'jeans'
    gender: { type: String, required: true },   // 'men', 'women', 'kids'
    age: { type: Number },
    brand: { type: String, required: true },
    color: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    fabric: { type: String },
    origin: { type: String },
    bundle: { type: String },
    trend: { type: String },
    imageUrl: { type: String, default: "https://placehold.co/400x500" } // Fallback image
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);