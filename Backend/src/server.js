import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import connectDB from "./db/index.js";

import userRouter from "./routes/user.routes.js";
import sellerRouter from "./routes/seller.routes.js";
import authRouter from "./routes/auth.routes.js";
import { razorpay } from "./utils/razorpay.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import reviewRouter from "./routes/review.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import paymentRouter from "./routes/payment.routes.js";

import express from "express";
const app = express();

//middelware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

//Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/payment", paymentRouter);

//connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });
