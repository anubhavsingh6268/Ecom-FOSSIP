import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change if needed
  withCredentials: true,
});

// GET SELLER PROFILE
export const getSellerProfile = async () => {
  const res = await API.get("/seller/profile");
  return res.data.data;
};

// CREATE / UPDATE SELLER PROFILE
export const updateSellerProfile = async (payload) => {
  const res = await API.post("/seller/profile", payload);
  return res.data.data;
};

// DELETE SELLER PROFILE
export const deleteSellerProfile = async () => {
  const res = await API.delete("/seller/profile");
  return res.data.data;
};
