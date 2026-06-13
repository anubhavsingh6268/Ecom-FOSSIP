import { Product } from "../models/Product.js";
import { SellerProfile } from "../models/SellerProfile.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    images,
    category,
    subCategory,
    gender,
    brand,
    price,
    discountedPrice,
    quantity,
    lowStockThreshold,
    size,
    color,
    fabric,
    deliveryTime,
    isFeatured,
  } = req.body;

  const seller = await User.findById(req.user.id);

  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  const sellerProfile = await SellerProfile.findOne({ user: seller._id });

  if (!sellerProfile) {
    throw new ApiError(
      400,
      "Please complete your seller profile before creating products.",
    );
  }

  if (!seller.phoneNumber) {
    throw new ApiError(
      400,
      "Please complete your profile by adding a phone number before creating products.",
    );
  }

  if (
    !seller.address ||
    !seller.address.street ||
    !seller.address.city ||
    !seller.address.state ||
    !seller.address.country ||
    !seller.address.pincode
  ) {
    throw new ApiError(
      400,
      "Please complete your address before creating products.",
    );
  }

  if (
    !sellerProfile.storeName ||
    !sellerProfile.bankAccountNumber ||
    !sellerProfile.upiId
  ) {
    throw new ApiError(
      400,
      "Please complete all required seller profile details before creating products.",
    );
  }

  const product = await Product.create({
    seller: req.user._id,
    name,
    description,
    images,
    category,
    subCategory,
    gender,
    brand,
    price,
    discountedPrice,
    quantity,
    lowStockThreshold,
    size,
    color,
    fabric,
    deliveryTime,
    isFeatured,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = req.product;

  if (product.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this product");
  }

  await product.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    images,
    category,
    subCategory,
    brand,
    price,
    discountedPrice,
    quantity,
    lowStockThreshold,
    size,
    color,
    fabric,
    deliveryTime,
    isFeatured,
  } = req.body;

  const product = req.product;

  if (product.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this product");
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (images) product.images = images;
  if (category) product.category = category;
  if (subCategory) product.subCategory = subCategory;
  if (brand) product.brand = brand;
  if (price) product.price = price;
  if (discountedPrice) product.discountedPrice = discountedPrice;
  if (quantity !== undefined) product.quantity = quantity;
  if (lowStockThreshold !== undefined)
    product.lowStockThreshold = lowStockThreshold;
  if (size) product.size = size;
  if (color) product.color = color;
  if (fabric) product.fabric = fabric;
  if (deliveryTime) product.deliveryTime = deliveryTime;
  if (isFeatured !== undefined) product.isFeatured = isFeatured;

  await product.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, product, "product updated successfully"));
});

const getProducts = asyncHandler(async (req, res) => {
  const { gender } = req.query;

  let query = {
    isPublished: true,
    isDeleted: false,
  };

  if (gender) {
    query.gender = gender;
  }

  const products = await Product.find(query);

  const filters = {
    categories: await Product.distinct("category", query),
    brands: await Product.distinct("brand", query),
    colors: await Product.distinct("color", query),
    fabrics: await Product.distinct("fabric", query),
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        filters,
      },
      "Products fetched successfully",
    ),
  );
});

const SingleProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

export {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  SingleProductById,
};
