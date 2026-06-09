import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Wishlist.css";
import ProductCard from "../components/wishlistCard.jsx"; // Keeping your exact import name
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Send unauthorized users back to login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 2. Fetch the real wishlist from MongoDB
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${API_URL}/v1/wishlist`, {
          withCredentials: true, // Required to send the secure login cookie!
        });
        // Extract the populated products array from the backend response
        setProducts(res.data.data.products);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  // 3. Delete an item from the database, then remove it from the screen
  const removeProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/v1/wishlist/remove/${id}`, {
        withCredentials: true,
      });
      // Immediately hide the product from the UI
      setProducts(products.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (!user) return null;
  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading Wishlist...</div>;

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>Your Wishlist</h1>
        <button className="move-btn">Move all to Cart</button>
      </div>

      {products.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "40px" }}>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}     // Changed to MongoDB's _id
              product={product}
              onDelete={() => removeProduct(product._id)} // Pass the MongoDB ID to the delete function
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;