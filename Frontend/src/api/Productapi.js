import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchProducts = async (gender) => {
  try {
    // We will build this exact route in the backend next
    const { data } = await axios.get(`${API_URL}/products/explore`, {
      params: gender ? { gender } : {},
    });
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], filters: {} }; // Safe fallback so Explore.jsx doesn't crash
  }
};