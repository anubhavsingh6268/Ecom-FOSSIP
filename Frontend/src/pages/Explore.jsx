import { useState, useEffect } from "react";
import "./Explore.css";
import ProductGrid from "../components/ProductGrid.jsx";
import FilterSidebar from "../components/sidebarFilter.jsx";
import { fetchProducts } from "../api/Productapi.js";
import { useParams } from "react-router-dom";
import { useProductFilters } from "../hooks/useProductFilters.js";
import { useExploreControls } from "../hooks/useExploreControls.js";

const MIN_PRICE = 200;
const MAX_PRICE = 10000;

function Explore() {
  const { gender } = useParams();

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ ONLY THIS PART MOVED OUT
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

  // API CALL (UNCHANGED)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(gender);

        const normalize = (item) => ({
          ...item,
          category:
            typeof item.category === "object"
              ? item.category.name
              : item.category,
          brand: typeof item.brand === "object" ? item.brand.name : item.brand,
          color: typeof item.color === "object" ? item.color.name : item.color,
        });

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

  // YOUR EXISTING FILTER HOOK (UNCHANGED)
  const filteredProducts = useProductFilters(products, appliedFilters);

  // SORTING (NOW MOVED OUT)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-to-high") return a.price - b.price;
    if (sortBy === "high-to-low") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return a.id - b.id;
  });

  const categories = filters?.categories ?? [];
  const brands = filters?.brands ?? [];
  const colors = filters?.colors ?? [];

  const [minPrice, maxPrice] = selectedFilters.price;

  if (loading) return <h2>Loading Products...</h2>;

  return (
    <div className="explore-page">
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

      <main className="products-panel">
        <div className="top-row">
          <select
            className="sort-box"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recommended">Sort by : Recommended</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
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
