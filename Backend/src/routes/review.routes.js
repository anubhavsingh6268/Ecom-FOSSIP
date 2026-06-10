import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createReview,
  getProductReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const router = Router();

router.post("/", verifyJWT, createReview);

router.get("/:productId", getProductReviews);

router.delete("/:id", verifyJWT, deleteReview);

export default router;
