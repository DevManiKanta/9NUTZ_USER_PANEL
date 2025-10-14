
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Minus, Star } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";

export default function FilterableProductGrid({
  onAddToCart,
  selectedCategory,
  isAnimating = false,
}) {
  const [quantities, setQuantities] = useState({});
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { products } = useProducts() || {};

  const staticFallbackProduct = {
    id: "static-001",
    name: "Sample Product (Static)",
    price: 499.0,
    discountPrice: 399.0,
    discountAmount: 100,
    stock: 10,
    imageUrl: "/placeholder.png",
  };

  // Listen to global "siteSearch" events dispatched by Header
  useEffect(() => {
    const handleSearch = (e) => {
      // event may be a CustomEvent with detail string
      const detail = e && e.detail ? e.detail : "";
      const term = String(detail || "").toString().trim().toLowerCase();
      setSearchTerm(term);
    };
    window.addEventListener("siteSearch", handleSearch);
    return () => window.removeEventListener("siteSearch", handleSearch);
  }, []);

  // Build filtered product list (search + category). Safe guards for missing fields.
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [staticFallbackProduct];

    let result = [...products];

    // Category filter (if provided)
    if (selectedCategory && selectedCategory !== "all") {
      const catLower = selectedCategory.toLowerCase();
      result = result.filter((p) => {
        const pcat = (p && p.category) || "";
        return String(pcat).toLowerCase().includes(catLower);
      });
    }

    // Search filter (name, description, category)
    if (searchTerm) {
      result = result.filter((p) => {
        const name = String((p && p.name) || "").toLowerCase();
        const desc = String((p && (p.description || p.short_description)) || "")
          .toLowerCase();
        const category = String((p && p.category) || "").toLowerCase();

        return (
          name.includes(searchTerm) ||
          desc.includes(searchTerm) ||
          category.includes(searchTerm)
        );
      });
    }

    return result;
  }, [products, selectedCategory, searchTerm]);

  // Update displayedProducts whenever filter changes
  useEffect(() => {
    setDisplayedProducts(filteredProducts);
  }, [filteredProducts]);

  const qtyOf = (id) => Math.max(0, Math.trunc(quantities[id] ?? 0));

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 0) return;
    setQuantities((prev) => ({ ...prev, [productId]: Math.trunc(newQuantity) }));
  };

  const handleAddToCart = (product) => {
    if ((product && product.stock) <= 0) return;
    const qty = Math.max(1, qtyOf(String(product.id)));
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
  };

  const formatPrice = (n) => Number(n || 0).toFixed(2);

  const computeDisplayPrice = (p) => {
    if (typeof (p && p.discountPrice) === "number" && (p.discountPrice > 0))
      return p.discountPrice;
    if (typeof (p && p.discountAmount) === "number" && (p.discountAmount > 0))
      return Math.max(0, (p.price || 0) - p.discountAmount);
    return p.price || 0;
  };

  const computeDiscountPercent = (p) => {
    const original = (p && p.price) || 0;
    const shown = computeDisplayPrice(p);
    if (!original || shown >= original) return 0;
    return Math.round(((original - shown) / original) * 100);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Shop by Products</h2>
      </div>
      <div
        className={`grid gap-6 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
          transition-all duration-300 ease-in-out ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      >
        {displayedProducts.map((product, idx) => {
          const productId = String(product && product.id);
          const currentQuantity = qtyOf(productId);
          const displayPrice = computeDisplayPrice(product);
          const discountPercent = computeDiscountPercent(product);
          const outOfStock = (product && product.stock) <= 0;

          const img =
            (product && product.imageUrl) ||
            (Array.isArray(product && product.images) && product.images[0]) ||
            "/placeholder.png";

          return (
            <article
              key={productId || `product-${idx}`}
              className="bg-white rounded-2xl shadow-[0_6px_18px_rgba(13,18,25,0.08)] border border-transparent hover:border-gray-100 overflow-hidden flex flex-col"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}
            >
              <div className="relative p-4">
                <div className="rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={img}
                    alt={(product && product.name) || "product"}
                    onError={(e) => {
                      // plain JS fallback for broken images
                      try {
                        e.currentTarget.src = "/placeholder.png";
                      } catch (err) {
                        /* ignore */
                      }
                    }}
                    className="w-full h-56 object-cover block"
                  />
                </div>
              </div>

              <div className="px-5 pb-5 flex-1 flex flex-col">
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2" title={(product && product.name) || ""}>
                  {(product && product.name) || "Unnamed"}
                </h3>

                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400" />
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Rs.{formatPrice((product && product.price) || 0)}</div>
                      {discountPercent > 0 && (
                        <div className="text-xs text-gray-400 mt-1">Disc: Rs.{formatPrice(displayPrice)}</div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {outOfStock ? (
                        <div className="text-xs px-3 py-2 rounded-md bg-gray-100 text-gray-500">Out of stock</div>
                      ) : currentQuantity <= 0 ? (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="inline-flex items-center justify-center px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="inline-flex items-center bg-green-600 text-white rounded-lg overflow-hidden">
                          <button onClick={() => handleQuantityChange(productId, Math.max(0, currentQuantity - 1))} className="p-2" aria-label="decrease quantity">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-sm font-semibold">{currentQuantity}</span>
                          <button onClick={() => handleQuantityChange(productId, currentQuantity + 1)} className="p-2" aria-label="increase quantity">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {displayedProducts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try another keyword.</p>
        </div>
      )}
    </div>
  );
}
