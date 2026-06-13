import axiosInstance from "../api/axiosInstance";

export const getSellerProfile = async () => {
  const response = await axiosInstance.get("/seller/profile");
  return response.data.data;
};

export const saveSellerProfile = async (data) => {
  const response = await axiosInstance.post("/seller/profile", data);
  return response.data.data;
};
