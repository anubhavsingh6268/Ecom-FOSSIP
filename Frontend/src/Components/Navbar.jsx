import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import loc from "../Assets/location_on.png";
import profile from "../Assets/profile.png";
import heart from "../Assets/Heart.png";
import cart from "../Assets/Shopping cart.png";
import menu from "../Assets/menu.png";

import Searchbar from "./Searchbar";
import { getCurrentUser } from "../api/user"; // ✅ API call

const menuItems = [
  { name: "HOME", path: "/" },
  { name: "MEN", path: "/explore/men" },
  { name: "WOMEN", path: "/explore/women" },
  { name: "KIDS", path: "/explore/kids" },
  { name: "HOME DECOR", path: "/explore/men" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser(token);
        setUser(res.data?.data || null);
      } catch (err) {
        console.log("User not logged in");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <div className="top">
        <div className="top-content">
          <p>🚚 FREE SHIPPING ON ORDERS OVER ₹999</p>
          <span>|</span>
          <p>EASY 30-DAY RETURNS</p>
          <span>|</span>
          <p>NEW ARRIVALS EVERY WEEK</p>
        </div>
      </div>

      <nav className="navline">
        <div className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <img src={menu} alt="menu" />
        </div>

        <div className="logo">
          <Link to="/">Urban Fashion</Link>
        </div>

        <div className="nav-items">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path}>
              {item.name}
            </Link>
          ))}
        </div>

        <div className="search">
          <Searchbar />
        </div>

        <div className="user-details">
          <Link
            to={user ? "/profile" : "/login"}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div className="profile">
              <img src={profile} alt="profile" />
              <p>{user ? user.username : "Profile"}</p>
            </div>
          </Link>

          <Link to="/wishlist">
            <div className="profile">
              <img src={heart} alt="wishlist" />
              <p>Wishlist</p>
            </div>
          </Link>

          <div className="profile">
            <img src={cart} alt="cart" />
            <p>Cart</p>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-nav">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path}>
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
