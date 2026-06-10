import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const createOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const cartItems = await Cart.find({
    user: req.user._id,
  }).populate("product");

  if (!cartItems.length) {
    throw new ApiError(400, "Cart is empty");
  }

  // Phone number check
  if (!user.phoneNumber) {
    throw new ApiError(
      400,
      "Please add your phone number before placing an order",
    );
  }

  // Address check
  if (
    !user.address ||
    !user.address.street ||
    !user.address.city ||
    !user.address.state ||
    !user.address.country ||
    !user.address.pincode
  ) {
    throw new ApiError(
      400,
      "Please complete your address before placing an order",
    );
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of cartItems) {
    orderItems.push({
      product: item.product._id,
      seller: item.product.seller,
      quantity: item.quantity,
      price: item.product.price,
      size: item.size,
      color: item.color,
    });

    totalAmount += item.product.price * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,

    items: orderItems,

    totalAmount,

    shippingAddress: user.address,
  });

  await Cart.deleteMany({
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  })
    .populate("items.product")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});
export { createOrder, getMyOrders, getOrderById };
