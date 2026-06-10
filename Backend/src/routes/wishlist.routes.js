import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";

const router = Router();

router.post("/", verifyJWT, addToWishlist);

router.get("/", verifyJWT, getWishlist);

router.delete("/:productId", verifyJWT, removeFromWishlist);

router.delete("/", verifyJWT, clearWishlist);

export default router;
