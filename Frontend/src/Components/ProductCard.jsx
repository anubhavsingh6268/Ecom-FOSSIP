import axios from "axios";
import "./ProductCard.css";

function ProductCard({ product }) {
  // The function to send this specific product to the database
  const addToWishlist = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Check if your React app saved the token to localStorage
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";

      await axios.post(
        `${API_URL}/v1/wishlist/add`,
        { productId: product._id },
        { 
          withCredentials: true, // Sends the cookie
          headers: {
            Authorization: `Bearer ${token}` // Sends the header token
          }
        }
      );
      
      alert("Added to Wishlist! ❤️"); 
    } catch (error) {
      console.error("Failed to add to wishlist", error);
      alert("Please log in to add items to your wishlist.");
    }
  };

  return (
    <article className="product-card">
      <div className="image-wrap" style={{ position: "relative" }}>
        <img src={product.imageUrl} alt={product.name} />

        <span className="age-badge">{product.age}</span>
        
        {/* The new Add to Wishlist Button */}
        <button 
          className="wishlist-btn" 
          onClick={addToWishlist} 
          style={{ 
            position: "absolute", top: "10px", right: "10px", 
            background: "white", border: "none", borderRadius: "50%", 
            width: "30px", height: "30px", cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}
          title="Add to Wishlist"
        >
          ❤️
        </button>
      </div>

      <div className="product-details">
        <h3>{product.brand}</h3>
        <p>{product.name}</p>
        <strong>Rs. {product.price}</strong>

        <span className="rating">
          {product.rating}
          <span className="rating-star">★</span>
        </span>
      </div>
    </article>
  );
}

export default ProductCard;