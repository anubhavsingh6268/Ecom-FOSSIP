import React, { useState } from "react";
import "./Wishlist.css";
import ProductCard from "../components/wishlistCard.jsx";
import {useContext, useEffect} from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

import shirt from "../assets/shirt.png";

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If there is no user logged in, send them to login page immediately
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Men’s Polo T shirt",
      price: 699,
      rating: 4.5,
      image: shirt,
    },
    {
      id: 2,
      name: "Men’s Polo T shirt",
      price: 699,
      rating: 4.5,
      image: shirt,
    },
    {
      id: 3,
      name: "Men’s Polo T shirt",
      price: 699,
      rating: 4.5,
      image: shirt,
    },
    {
      id: 4,
      name: "Men’s Polo T shirt",
      price: 699,
      rating: 4.5,
      image: shirt,
    },
    {
      id: 5,
      name: "Men’s Polo T shirt",
      price: 699,
      rating: 4.5,
      image: shirt,
    },
    {
      id: 6,
      name: "Men’s Polo T shirt",
      price: 699,
      rating: 4.5,
      image: shirt,
    },
    {
      id: 7,
      name: "Men’s Polo T shirt",
      price: 699,
      rating: 4.5,
      image: shirt,
    },
    {
      id: 8,
      name: "Men’s Polo T shirt",
      price: 699,
      rating: 4.5,
      image: shirt,
    },
  ]);

  const removeProduct = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>Your Wishlist</h1>

        <button className="move-btn">Move all to Cart</button>
      </div>

      <div className="wishlist-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={removeProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
