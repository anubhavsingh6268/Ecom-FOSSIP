import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", verifyJWT, addToCart);

router.get("/", verifyJWT, getCart);

router.patch("/:id", verifyJWT, updateCartItem);

router.delete("/:id", verifyJWT, removeFromCart);

router.delete("/", verifyJWT, clearCart);

export default router;
