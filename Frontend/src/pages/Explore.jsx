import { useState, useEffect } from "react";
import "./Explore.css";
import ProductGrid from "../components/ProductGrid.jsx";
import FilterSidebar from "../components/sidebarFilter.jsx";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../api/ProductApi";
import { useProductFilters } from "../hooks/useProductFilters.js";
import { useExploreControls } from "../hooks/useExploreControls.js";

const MIN_PRICE = 200;
const MAX_PRICE = 10000;

function Explore() {
  const { gender } = useParams();

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    selectedFilters,
    appliedFilters,
    sortBy,
    setSortBy,
    toggleListFilter,
    changePrice,
    applyFilters,
    clearAll,
  } = useExploreControls();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await fetchProducts(gender);

        setProducts(data?.products || []);
        setFilters(data?.filters || {});
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [gender]);

  const filteredProducts = useProductFilters(products, appliedFilters);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-to-high") return a.price - b.price;

    if (sortBy === "high-to-low") return b.price - a.price;

    if (sortBy === "rating") return b.averageRating - a.averageRating;

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const categories = filters?.categories ?? [];
  const brands = filters?.brands ?? [];
  const colors = filters?.colors ?? [];

  const [minPrice, maxPrice] = selectedFilters.price;

  if (loading) return <h2>Loading Products...</h2>;

  return (
    <div className="explore-page">
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <FilterSidebar
          categories={categories}
          brands={brands}
          colors={colors}
          selectedFilters={selectedFilters}
          toggleListFilter={toggleListFilter}
          changePrice={changePrice}
          MIN_PRICE={MIN_PRICE}
          MAX_PRICE={MAX_PRICE}
          minPrice={minPrice}
          maxPrice={maxPrice}
          clearAll={clearAll}
          applyFilters={applyFilters}
          products={products}
        />
      </div>

      {showFilters && (
        <div className="filter-overlay" onClick={() => setShowFilters(false)}>
          <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Filters</h2>

              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>

            <FilterSidebar
              categories={categories}
              brands={brands}
              colors={colors}
              selectedFilters={selectedFilters}
              toggleListFilter={toggleListFilter}
              changePrice={changePrice}
              MIN_PRICE={MIN_PRICE}
              MAX_PRICE={MAX_PRICE}
              minPrice={minPrice}
              maxPrice={maxPrice}
              clearAll={clearAll}
              applyFilters={() => {
                applyFilters();
                setShowFilters(false);
              }}
              products={products}
            />
          </div>
        </div>
      )}

      <main className="products-panel">
        <div className="top-row">
          <button
            className="mobile-filter-btn"
            onClick={() => setShowFilters(true)}
          >
            Filters
          </button>

          <button
            className={`sort-btn ${sortBy === "recommended" ? "active" : ""}`}
            onClick={() => setSortBy("recommended")}
          >
            Recommended
          </button>

          <button
            className={`sort-btn ${sortBy === "low-to-high" ? "active" : ""}`}
            onClick={() => setSortBy("low-to-high")}
          >
            Price ↑
          </button>

          <button
            className={`sort-btn ${sortBy === "high-to-low" ? "active" : ""}`}
            onClick={() => setSortBy("high-to-low")}
          >
            Price ↓
          </button>

          <button
            className={`sort-btn ${sortBy === "rating" ? "active" : ""}`}
            onClick={() => setSortBy("rating")}
          >
            Rating
          </button>
        </div>

        <div className="chip-row">
          {appliedFilters.categories.map((item) => (
            <button key={item}>{item} ×</button>
          ))}
        </div>

        <ProductGrid products={sortedProducts} />
      </main>
    </div>
  );
}

export default Explore;
