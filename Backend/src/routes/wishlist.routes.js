import { Router } from "express";
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// CRITICAL: This middleware forces the user to be logged in to use ANY of these routes
router.use(verifyJWT); 

router.route("/").get(getWishlist);         // GET /api/v1/wishlist
router.route("/add").post(addToWishlist);   // POST /api/v1/wishlist/add
router.route("/remove/:productId").delete(removeFromWishlist); // DELETE /api/v1/wishlist/remove/12345

export default router;