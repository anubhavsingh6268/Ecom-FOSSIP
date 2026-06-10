import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/", verifyJWT, createOrder);

router.get("/", verifyJWT, getMyOrders);

router.get("/:id", verifyJWT, getOrderById);

export default router;
