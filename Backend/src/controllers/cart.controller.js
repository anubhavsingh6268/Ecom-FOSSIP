import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const existingItem = await Cart.findOne({
    user: req.user._id,
    product: productId,
    size,
    color,
  });

  if (existingItem) {
    existingItem.quantity += quantity || 1;

    await existingItem.save();

    return res
      .status(200)
      .json(new ApiResponse(200, existingItem, "Cart updated successfully"));
  }

  const cartItem = await Cart.create({
    user: req.user._id,
    product: productId,
    quantity: quantity || 1,
    size,
    color,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, cartItem, "Product added to cart"));
});

const getCart = asyncHandler(async (req, res) => {
  const cartItems = await Cart.find({
    user: req.user._id,
  }).populate("product");

  return res
    .status(200)
    .json(new ApiResponse(200, cartItems, "Cart fetched successfully"));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cartItem = await Cart.findById(req.params.id);

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  if (cartItem.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  await cartItem.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product removed from cart"));
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.deleteMany({
    user: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Cart cleared successfully"));
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity, size, color } = req.body;

  const cartItem = await Cart.findById(req.params.id);

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  if (cartItem.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  cartItem.quantity = quantity;
  cartItem.size = size;
  cartItem.color = color;

  await cartItem.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cartItem, "Cart updated successfully"));
});

export { addToCart, getCart, updateCartItem, removeFromCart, clearCart };
