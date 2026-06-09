import "./Home.css";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import {useNavigate} from "react-router-dom";

import heroModel from "../Assets/character.png";
import star from "../Assets/star.png";
import tag from "../Assets/Tag.png";
import clock from "../Assets/Clock.png";
import shipping from "../Assets/Shipping.png";
import wallet from "../Assets/wallet.png";
import customersupport from "../Assets/customersupport.png";
import dressImg from "../Assets/dress.png";
import shirtImg from "../Assets/shirt.png";
import pantsImg from "../Assets/pants.png";
import jean1 from "../Assets/jean10.png";
import jean2 from "../Assets/jean2.png";
import jean3 from "../Assets/jean3.png";
import heart from "../Assets/heart.png";
import cartIcon from "../Assets/shopping cart.png";
import heartRed from "../Assets/red-heart.png";

const LOCAL_PRODUCTS = [
  {
    id: 1,
    name: "Baggie Jeans",
    image: jean1,
    category: "Latest Product",
    discount: "30% OFF",
  },
  { id: 2, name: "Straight Jeans", image: jean2, category: "Best Sellers" },
  { id: 3, name: "Baggie Jeans", image: jean3, category: "Trendy" },
];

const features = [
  {
    icon: shipping,
    title: "Free Shipping",
    description: "Free shipping for orders above ₹1500",
  },
  {
    icon: wallet,
    title: "Flexible Payment",
    description: "Multiple secure payment options",
  },
  {
    icon: customersupport,
    title: "24x7 Support",
    description: "We support online all day",
  },
];

const clothingCategories = [
  {
    count: "+1500",
    title: "Dress",
    image: dressImg,
    large: true,
    subtitle: "Free shipping for orders above ₹1500",
    items: [
      "Casual Dresses",
      "Party & Cocktail",
      "Formal & Evening",
      "Work & Office",
      "Vacation & Resort",
      "Ethnic / Traditional",
      "Bodycon",
      "Wrap & Faux-Wrap",
      "Skater",
    ],
  },
  {
    count: "+850",
    title: "Shirts",
    image: shirtImg,
    items: [
      "Casual Shirts",
      "T-Shirts & Polos",
      "Casual & Crop Tops",
      "Tunics & Over-sized",
    ],
  },
  {
    count: "+450",
    title: "Pants",
    image: pantsImg,
    items: [
      "Athleisure & Lounge",
      "Trousers & Formal",
      "Jeans / Denim",
      "Cargo Pants",
    ],
  },
];

const tabs = ["All Products", "Latest Product", "Best Sellers", "Trendy"];

function Home() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const { user } = useContext(AuthContext); // Get the user state
  const navigate = useNavigate();

  const [products, setProducts] = useState(LOCAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState("All Products");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // ── Data fetching ()────────────────────────────────────────────────────────

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await axios.get(`${API_URL}/products`);
      if (data?.length) setProducts(data);
    } catch (err) {
      console.warn("Using local products:", err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/wishlist`);
      if (Array.isArray(data)) {
        setWishlist(
          data.map((w) => (typeof w === "object" ? (w.productId ?? w.id) : w)),
        );
      }
    } catch (err) {
      console.warn("Using local wishlist:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  // ── Wishlist ──────────────────────────────────────────────────────────

  const handleWishlist = async (productId) => {

    // 1. SECURITY CHECK: Is the user logged in?
    if (!user) {
      alert("Please login to add items to your wishlist!");
      navigate("/login");
      return; 
    }

    if (wishlistLoading) return;

    const isWishlisted = wishlist.includes(productId);
    const previous = wishlist;

    setWishlist((prev) =>
      isWishlisted
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );

    try {
      setWishlistLoading(true);
      if (isWishlisted) {
        await axios.delete(`${API_URL}/wishlist/${productId}`);
      } else {
        await axios.post(`${API_URL}/wishlist`, { productId });
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      setWishlist(previous);
    } finally {
      setWishlistLoading(false);
    }
  };

  // ── Add to Cart ──────────────────────────────────────────────────────────────────────────────────

  const handleAddToCart = async (product) => {
    if (cartLoading) return;

    const currentQty =
      cart.find((item) => item.id === product.id)?.quantity ?? 0;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    try {
      setCartLoading(true);
      await axios.post(`${API_URL}/cart`, {
        productId: product.id,
        quantity: currentQty + 1,
      });
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setCartLoading(false);
    }
  };

  // ── Filtering ───────────────────────────────────────────────────────────────────────────

  const filteredProducts =
    activeTab === "All Products"
      ? products
      : products.filter((p) => p.category === activeTab);

  // ── Render ─────────────────────────────────────────────────────────────────────────

  return (
    <div id="home-lay">
      {/* ── Hero ── */}
      <div className="hero-section">
        <p className="small-hero-text" id="Own-the">
          OWN THE{" "}
        </p>
        <p className="large-hero-text" id="edge">
          {" "}
          EDGE
        </p>

        <img src={heroModel} alt="Hero model" />

        <p className="small-hero-text" id="keep-the">
          KEEP THE{" "}
        </p>
        <p className="large-hero-text" id="vibe">
          {" "}
          VIBE
        </p>

        <div id="back-color" />

        <div className="left-content">
          <h2>
            WHERE ART
            <br />
            MEETS YOUR
            <br />
            STYLE
          </h2>
          <p>
            Wear that speaks for you.
            <br />
            Comfort. Style. Confidence.
          </p>
          <button className="drops-btn">NEW DROPS →</button>
        </div>

        <div className="rating-card">
          <div className="avatars">
            <div />
            <div />
            <div />
            <div className="plus">+1</div>
          </div>
          <p>⭐ Rated 5 star by the vibe tribe</p>
        </div>

        <div className="right-content">
          <div className="benefits">
            <div id="best-upper">
              <img src={tag} alt="" />
              <p>BEST PRICES</p>
            </div>
            <div>
              {" "}
              <img src={star} alt="" />
              <p>BEST DEALS</p>
            </div>
            <div id="best-upper">
              <img src={clock} alt="" />
              <p>TIMELY OFFERS</p>
            </div>
          </div>
          <div className="summer-card">
            <h3>Summer Wear</h3>
            <h1>2026</h1>
            <p>Discover the collection</p>
            <button aria-label="Go to collection">→</button>
          </div>
        </div>
      </div>

      {/* ───────────────────── Scroller ────────────── */}
      <div className="scroller">
        <p>
          own the edge keep the vibe own the edge keep the vibe own the edge
          keep the vibe own the edge keep the vibe
        </p>
      </div>

      {/* ── Features ── */}
      <div className="feat">
        <section className="features-section">
          {features.map((item, index) => (
            <div className="feature-card" key={index}>
              <img src={item.icon} alt={item.title} />
              <div className="feature-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ── Categories ── */}
      <section className="categories-section">
        <div className="categories-grid">
          <div className="category-card large-card">
            <div className="category-content">
              <span className="category-badge">
                {clothingCategories[0].count} {clothingCategories[0].title}
              </span>
              <h4>{clothingCategories[0].subtitle}</h4>
              <ul>
                {clothingCategories[0].items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <img src={clothingCategories[0].image} alt="Dress" />
          </div>

          <div className="right-column">
            {clothingCategories.slice(1).map((category, index) => (
              <div className="category-card" key={index}>
                <div className="category-content">
                  <span className="category-badge">
                    {category.count} {category.title}
                  </span>
                  <ul>
                    {category.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <img src={category.image} alt={category.title} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── Products ───────────────────────── */}
      <section className="products-section">
        <div className="section-heading">
          <span className="heading-line" />
          <h4>Our Products</h4>
        </div>
        <h2>Fashion Collection</h2>

        <div className="product-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loadingProducts ? (
          <div className="products-loading">Loading products…</div>
        ) : filteredProducts.length === 0 ? (
          /* WARN 4 FIXED: empty state */
          <div className="products-empty">
            No products found in this category.
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                {product.discount && (
                  <div className="discount-badge">{product.discount}</div>
                )}
                <div className="product-actions">
                  <button
                    className={`action-btn ${wishlist.includes(product.id) ? "active" : ""}`}
                    onClick={() => handleWishlist(product.id)}
                    disabled={wishlistLoading}
                    aria-label="Toggle wishlist"
                  >
                    <img
                      src={wishlist.includes(product.id) ? heartRed : heart}
                      alt="wishlist"
                    />
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={cartLoading}
                    aria-label="Add to cart"
                  >
                    <img src={cartIcon} alt="cart" />
                  </button>
                </div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
