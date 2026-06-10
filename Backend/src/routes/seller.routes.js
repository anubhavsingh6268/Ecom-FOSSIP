import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

import {
  createOrUpdateSellerProfile,
  getSellerProfile,
  deleteSellerProfile,
  getSellerOrders,
  updateOrderStatus,
  getSellerDashboard,
  getSellerProducts,
  getLowStockProducts,
} from "../controllers/seller.controller.js";

const router = Router();

router.post(
  "/profile",
  verifyJWT,
  authorizeRoles("seller"),
  createOrUpdateSellerProfile,
);

router.get("/profile", verifyJWT, authorizeRoles("seller"), getSellerProfile);

router.delete(
  "/profile",
  verifyJWT,
  authorizeRoles("seller"),
  deleteSellerProfile,
);

router.get("/orders", verifyJWT, authorizeRoles("seller"), getSellerOrders);

router.patch(
  "/orders/:id/status",
  verifyJWT,
  authorizeRoles("seller"),
  updateOrderStatus,
);

router.get(
  "/dashboard",
  verifyJWT,
  authorizeRoles("seller"),
  getSellerDashboard,
);

router.get("/products", verifyJWT, authorizeRoles("seller"), getSellerProducts);

router.get(
  "/products/low-stock",
  verifyJWT,
  authorizeRoles("seller"),
  getLowStockProducts,
);

export default router;
