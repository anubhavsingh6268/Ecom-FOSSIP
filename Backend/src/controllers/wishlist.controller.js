import { Wishlist } from "../models/Wishlist.js";
import { Product } from "../models/Product.js";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const exists = await Wishlist.findOne({
    user: req.user._id,
    product: productId,
  });

  if (exists) {
    throw new ApiError(400, "Product already in wishlist");
  }

  const wishlistItem = await Wishlist.create({
    user: req.user._id,
    product: productId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, wishlistItem, "Product added to wishlist"));
});

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.find({
    user: req.user._id,
  }).populate("product");

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlistItem = await Wishlist.findOne({
    user: req.user._id,
    product: req.params.productId,
  });

  if (!wishlistItem) {
    throw new ApiError(404, "Wishlist item not found");
  }

  await wishlistItem.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product removed from wishlist"));
});

const clearWishlist = asyncHandler(async (req, res) => {
  await Wishlist.deleteMany({
    user: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Wishlist cleared successfully"));
});

export { addToWishlist, getWishlist, removeFromWishlist, clearWishlist };
