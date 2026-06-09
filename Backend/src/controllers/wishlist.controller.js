import { Wishlist } from "../models/Whishlist.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

// 1. GET: Fetch the user's wishlist
const getWishlist = asyncHandler(async (req, res) => {
  // Find the wishlist and 'populate' the products array with the actual product data (names, prices, images)
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

  // If the user doesn't have a wishlist yet, create an empty one for them
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  return res.status(200).json(
    new ApiResponse(200, wishlist, "Wishlist fetched successfully")
  );
});

// 2. POST: Add an item to the wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    // Create new wishlist with this product
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  } else {
    // Only add it if it isn't already in the list
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Product added to wishlist")
  );
});

// 3. DELETE: Remove an item from the wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Use MongoDB $pull to instantly remove that specific product ID from the array
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: productId } },
    { new: true } // Returns the updated document
  ).populate("products");

  return res.status(200).json(
    new ApiResponse(200, wishlist, "Product removed from wishlist")
  );
});

export { getWishlist, addToWishlist, removeFromWishlist };