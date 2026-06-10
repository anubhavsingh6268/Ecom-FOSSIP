import { User } from "../models/User.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

// GET CURRENT USER (PROFILE) ------------------------

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// UPDATE PROFILE (NOT PASSWORD) ------------------------

const updateProfile = asyncHandler(async (req, res) => {
  const { username, fullName, phoneNumber, address } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (username) user.username = username;
  if (fullName) user.fullName = fullName;
  if (phoneNumber) user.phoneNumber = phoneNumber;

  if (address) {
    user.address = {
      ...user.address,
      ...address,
    };
  }

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

// DELETE OWN ACCOUNT ------------------------

const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account deleted successfully"));
});

export { getCurrentUser, updateProfile, deleteAccount };
