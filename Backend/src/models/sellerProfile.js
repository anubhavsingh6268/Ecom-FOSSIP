import mongoose from "mongoose";

const sellerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    gstNumber: {
      type: String,
      trim: true,
    },

    governmentIdNumber: {
      type: String,
      trim: true,
    },

    governmentIdType: {
      type: String,
      enum: ["aadhaar", "pan", "passport", "driving_license"],
    },

    governmentIdImage: {
      url: String,
      localPath: String,
    },

    bankAccountHolderName: {
      type: String,
      trim: true,
    },

    bankAccountNumber: {
      type: String,
      trim: true,
    },

    ifscCode: {
      type: String,
      trim: true,
    },

    bankName: {
      type: String,
      trim: true,
    },

    upiId: {
      type: String,
      trim: true,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const SellerProfile = mongoose.model(
  "SellerProfile",
  sellerProfileSchema,
);
