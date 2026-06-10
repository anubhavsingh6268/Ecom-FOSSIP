import { SellerProfile } from "../models/SellerProfile.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

const createOrUpdateSellerProfile = asyncHandler(async (req, res) => {
  const {
    storeName,
    gstNumber,
    governmentIdType,
    governmentIdNumber,
    bankAccountHolderName,
    bankAccountNumber,
    ifscCode,
    bankName,
    upiId,
  } = req.body;

  if (!storeName) {
    throw new ApiError(400, "Store name is required");
  }

  let sellerProfile = await SellerProfile.findOne({
    user: req.user._id,
  });

  if (sellerProfile) {
    // Update existing profile

    sellerProfile.storeName = storeName || sellerProfile.storeName;

    sellerProfile.gstNumber = gstNumber || sellerProfile.gstNumber;

    sellerProfile.governmentIdType =
      governmentIdType || sellerProfile.governmentIdType;

    sellerProfile.governmentIdNumber =
      governmentIdNumber || sellerProfile.governmentIdNumber;

    sellerProfile.bankAccountHolderName =
      bankAccountHolderName || sellerProfile.bankAccountHolderName;

    sellerProfile.bankAccountNumber =
      bankAccountNumber || sellerProfile.bankAccountNumber;

    sellerProfile.ifscCode = ifscCode || sellerProfile.ifscCode;

    sellerProfile.bankName = bankName || sellerProfile.bankName;

    sellerProfile.upiId = upiId || sellerProfile.upiId;

    await sellerProfile.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sellerProfile,
          "Seller profile updated successfully",
        ),
      );
  }

  // Create new profile

  sellerProfile = await SellerProfile.create({
    user: req.user._id,

    storeName,
    gstNumber,

    governmentIdType,
    governmentIdNumber,

    bankAccountHolderName,
    bankAccountNumber,
    ifscCode,
    bankName,

    upiId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        sellerProfile,
        "Seller profile created successfully",
      ),
    );
});

const getSellerProfile = asyncHandler(async (req, res) => {
  const sellerProfile = await SellerProfile.findOne({
    user: req.user._id,
  }).populate("user");

  if (!sellerProfile) {
    throw new ApiError(404, "Seller profile not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        sellerProfile,
        "Seller profile fetched successfully",
      ),
    );
});

const deleteSellerProfile = asyncHandler(async (req, res) => {
  const sellerProfile = await SellerProfile.findOne({
    user: req.user._id,
  });

  if (!sellerProfile) {
    throw new ApiError(404, "Seller profile not found");
  }

  await sellerProfile.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Seller profile deleted successfully"));
});

const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    "items.seller": req.user._id,
  })
    .populate("user", "username email")
    .populate("items.product");

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Seller orders fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "packed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(orderStatus)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const sellerOwnsOrder = order.items.some(
    (item) => item.seller.toString() === req.user._id.toString(),
  );

  if (!sellerOwnsOrder) {
    throw new ApiError(403, "You are not authorized to update this order");
  }

  order.orderStatus = orderStatus;

  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

const getSellerDashboard = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const orders = await Order.find({
    "items.seller": sellerId,
  });

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "pending",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered",
  );

  const totalEarnings = deliveredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  const averageOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalEarnings,
        averageOrderValue,
        pendingOrders,
        totalOrders,
      },
      "Seller dashboard fetched successfully",
    ),
  );
});

const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    seller: req.user._id,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Seller products fetched successfully"),
    );
});

const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    seller: req.user._id,
  });

  const lowStockProducts = products.filter(
    (product) => product.quantity <= product.lowStockThreshold,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        lowStockProducts,
        "Low stock products fetched successfully",
      ),
    );
});

export {
  createOrUpdateSellerProfile,
  getSellerProfile,
  deleteSellerProfile,
  getSellerOrders,
  updateOrderStatus,
  getSellerDashboard,
  getSellerProducts,
  getLowStockProducts,
};
