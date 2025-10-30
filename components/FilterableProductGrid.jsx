
// "use client";
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { Plus, Minus, Star, Heart } from "lucide-react";
// import { useProducts } from "@/contexts/ProductContext";
// import { useCategoryDataContext } from "@/contexts/CategoryDataContext";
// import { useRouter } from "next/navigation";
// import { useWishlist } from "@/contexts/WishlistContext";
// import Viewband from "@/components/ViewBand";

// export default function FilterableProductGrid({ onAddToCart, selectedCategory, isAnimating = false }) {
//   const [quantities, setQuantities] = useState({});
//   const [displayedProducts, setDisplayedProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const { products } = useProducts() || { products: [] };
//   const { categories } = useCategoryDataContext() || { categories: [] };

//   const staticFallbackProduct = {
//     id: "static-001",
//     name: "Sample Product (Static)",
//     price: 499.0,
//     discountPrice: 399.0,
//     discountAmount: 100,
//     stock: 10,
//   };

//   const router = useRouter();

//   // wishlist
//   const { favorites = [], loading: wishlistLoading = false, addFavorite } = useWishlist() || {};

//   // keep a set for quick lookup
//   const [favSet, setFavSet] = useState(() => new Set());
//   useEffect(() => {
//     try {
//       const s = new Set((favorites || []).map((f) => String(f?.product_id ?? f?.id ?? f?.productId ?? f?.product_id)));
//       setFavSet(s);
//     } catch (e) {
//       setFavSet(new Set());
//     }
//   }, [favorites]);

//   useEffect(() => {
//     const handleSearch = (e) => {
//       const detail = e && e.detail ? e.detail : "";
//       const term = String(detail || "").toString().trim().toLowerCase();
//       setSearchTerm(term);
//     };
//     window.addEventListener("siteSearch", handleSearch);
//     return () => window.removeEventListener("siteSearch", handleSearch);
//   }, []);

//   // ===== FIXED: more robust category id/name extraction =====
//   const getProductCategoryIdAndName = useCallback((p) => {
//     const cat = p && p.category;
//     if (cat == null) return { id: undefined, name: undefined };
//     if (typeof cat === "string" || typeof cat === "number") {
//       const id = String(cat).trim() || undefined;
//       return { id, name: undefined };
//     }
//     const id = String(cat.id ?? cat._id ?? cat.category_id ?? cat.categoryId ?? "").trim() || undefined;
//     const name = String(cat.name ?? cat.title ?? cat.category_name ?? cat.categoryName ?? "").trim() || undefined;
//     return { id, name };
//   }, []);
//   // ===========================================================

//   const combopackCategoryIds = useMemo(() => {
//     if (!Array.isArray(categories)) return new Set();
//     const set = new Set();
//     categories.forEach((c) => {
//       const nm = String((c && c.name) || "").toLowerCase();
//       if (nm.includes("cobopack") || nm.includes("combopack")) set.add(String(c.id));
//     });
//     return set;
//   }, [categories]);

//   const filteredProducts = useMemo(() => {
//     if (!products || (Array.isArray(products) && products.length === 0)) return [staticFallbackProduct];
//     let result = [...products];

//     if (selectedCategory && selectedCategory !== "all") {
//       const catLower = String(selectedCategory).toLowerCase();
//       result = result.filter((p) => {
//         const { id, name } = getProductCategoryIdAndName(p || {});
//         return (
//           (id && String(id).toLowerCase().includes(catLower)) ||
//           (name && String(name).toLowerCase().includes(catLower)) ||
//           (typeof p.category === "string" && String(p.category).toLowerCase().includes(catLower))
//         );
//       });
//     }

//     if (searchTerm) {
//       result = result.filter((p) => {
//         const name = String(p?.name || "").toLowerCase();
//         const desc = String(p?.description || p?.short_description || "").toLowerCase();
//         const { name: catName, id: catId } = getProductCategoryIdAndName(p);
//         const categoryStr = String(catName ?? catId ?? p?.category ?? "").toLowerCase();
//         return name.includes(searchTerm) || desc.includes(searchTerm) || categoryStr.includes(searchTerm);
//       });
//     }
//     return result;
//   }, [products, selectedCategory, searchTerm, getProductCategoryIdAndName]);

//   useEffect(() => {
//     setDisplayedProducts(filteredProducts);
//   }, [filteredProducts]);

//   const qtyOf = useCallback((id) => Math.max(0, Math.trunc(quantities[String(id)] ?? 0)), [quantities]);
//   const handleQuantityChange = useCallback((productId, newQuantity) => {
//     if (newQuantity < 0) return;
//     setQuantities((prev) => ({ ...prev, [String(productId)]: Math.trunc(newQuantity) }));
//   }, []);

//   const handleAddToCart = useCallback(
//     (product) => {
//       const stockVal = Number(product?.stock ?? Infinity);
//       if (stockVal <= 0) return;
//       const qty = Math.max(1, qtyOf(product.id));
//       for (let i = 0; i < qty; i++) onAddToCart(product);
//       setQuantities((prev) => {
//         const copy = { ...prev };
//         delete copy[String(product.id)];
//         return copy;
//       });
//     },
//     [onAddToCart, qtyOf]
//   );

//   const formatPrice = useCallback((n) => (Number.isNaN(Number(n)) ? "0.00" : Number(n).toFixed(2)), []);
//   const computeDisplayPrice = useCallback((p) => {
//     const dPrice = p?.discountPrice ?? p?.discount_price;
//     const dAmt = p?.discountAmount ?? p?.discount_amount;
//     const orig = Number(p?.price || 0);
//     if (dPrice > 0) return dPrice;
//     if (dAmt > 0) return Math.max(0, orig - dAmt);
//     return orig;
//   }, []);
//   const computeDiscountPercent = useCallback(
//     (p) => {
//       const orig = Number(p?.price || 0);
//       const shown = Number(computeDisplayPrice(p) || 0);
//       if (!orig || shown >= orig) return 0;
//       return Math.round(((orig - shown) / orig) * 100);
//     },
//     [computeDisplayPrice]
//   );

//   const { combopackProducts, otherProducts } = useMemo(() => {
//     const combo = [],
//       others = [];
//     displayedProducts.forEach((p) => {
//       const { id, name } = getProductCategoryIdAndName(p);
//       const lower = (name || "").toLowerCase();
//       if (id && combopackCategoryIds.has(String(id)) || lower.includes("combopack") || lower.includes("cobopack")) combo.push(p);
//       else others.push(p);
//     });
//     return { combopackProducts: combo, otherProducts: others };
//   }, [displayedProducts, combopackCategoryIds, getProductCategoryIdAndName]);

//   // helper when clicking heart
//   const handleAddToWishlist = useCallback(
//     async (e, product) => {
//       e.stopPropagation();
//       e.preventDefault();

//       const productId = String(product?.id ?? product?.product_id ?? product?._id ?? "");
//       if (!productId) return;

//       // if already favourited, do nothing (no remove endpoint available)
//       if (favSet.has(productId)) {
//         // optionally show UI feedback; simple alert for now
//         // You can replace this with a toast.
//         return;
//       }

//       try {
//         await addFavorite(productId);
//         // optimistic state update is handled by context; local favSet will update via effect when favorites change
//       } catch (err) {
//         // optionally show UI feedback here
//       }
//     },
//     [addFavorite, favSet]
//   );

//   const renderProductCard = (product, idx) => {
//     const productId = String(product?.id || `tmp-${idx}`);
//     const currentQuantity = qtyOf(productId);
//     const displayPrice = computeDisplayPrice(product);
//     const discountPercent = computeDiscountPercent(product);
//     const outOfStock = Number(product?.stock ?? Infinity) <= 0;
//     const img =
//       product?.imageUrl || (Array.isArray(product?.images) && product.images[0]) || product?.image || "/placeholder.png";

//     const isFavourited = favSet.has(String(productId));

//     return (
//       <article
//         key={productId}
//         className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 overflow-hidden flex flex-col h-full"
//       >
//         <div className="relative p-4 cursor-pointer">
//           <div className="rounded-xl overflow-hidden bg-gray-50">
//             <img src={img} alt={product?.name || "product"} className="w-full h-56 object-cover" />
//           </div>

//           {/* Favourite icon - top right */}
//           <button
//             onClick={(e) => handleAddToWishlist(e, product)}
//             disabled={isFavourited || wishlistLoading}
//             aria-pressed={isFavourited}
//             aria-label={isFavourited ? "Added to wishlist" : "Add to wishlist"}
//             className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-md transition transform scale-100
//               ${isFavourited ? "bg-red-50" : "bg-white/90 hover:scale-105"}
//               ${isFavourited ? "cursor-default" : "cursor-pointer"}`}
//             title={isFavourited ? "Already in wishlist" : "Add to wishlist"}
//             onMouseDown={(e) => e.stopPropagation()}
//             onMouseUp={(e) => e.stopPropagation()}
//           >
//             <Heart
//               className={`w-5 h-5 ${isFavourited ? "text-red-600" : "text-gray-500"}`}
//               fill={isFavourited ? "currentColor" : "none"}
//             />
//           </button>

//           {discountPercent > 0 && (
//             <span className="absolute top-5 left-5 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
//               {discountPercent}% OFF
//             </span>
//           )}
//         </div>
//         <div className="px-5 pb-5 flex-1 flex flex-col">
//           <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{product?.name || "Unnamed"}</h3>
//           <div className="flex items-center gap-1 mb-3">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <Star key={i} className="w-4 h-4 text-yellow-400" />
//             ))}
//           </div>

//           <div className="mt-auto">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-xl font-bold text-gray-900">Rs.{formatPrice(displayPrice)}</div>
//                 {discountPercent > 0 && (
//                   <div className="text-xs text-gray-400 mt-1 line-through">Rs.{formatPrice(product.price)}</div>
//                 )}
//               </div>

//               <div className="flex items-center space-x-2">
//                 {outOfStock ? (
//                   <div className="text-xs  rounded-md bg-gray-100 text-black-500">Out of stock</div>
//                 ) : (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       e.preventDefault();
//                       handleAddToCart(product);
//                     }}
//                     className="px-2 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
//                   >
//                     Add to cart
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </article>
//     );
//   };

//   return (
//     <div className="mb-16 w-full">
//       {/* Put header inside the same centered container so it aligns with categories */}
//       <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 mb-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-gray-900">Shop by Products</h2>
//           {displayedProducts.length > 0 && <span className="text-sm text-gray-500 hidden sm:block">Searched results</span>}
//         </div>
//       </div>

//       {/* Centered product grid container with slightly larger cards */}
//       <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
//         <div
//           className={`grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4
//             transition-all duration-300 ease-in-out ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
//         >
//           {otherProducts.map((p, i) => (
//             <div key={p.id || i} className="transform transition-transform hover:scale-[1.02]">
//               <article
//                 onClick={() => router.push(`/product/${p.id}`)}
//                 className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-full"
//                 style={{
//                   height: "480px",
//                   minWidth: "280px",
//                 }}
//               >
//                 <div className="relative w-full h-[260px] sm:h-[280px] md:h-[300px] overflow-hidden">
//                   <img
//                     src={
//                       p?.imageUrl ||
//                       (Array.isArray(p?.images) && p.images[0]) ||
//                       p?.image ||
//                       "/placeholder.png"
//                     }
//                     alt={p?.name || "product"}
//                     className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                   />

//                   {/* Heart icon for this larger card too */}
//                   <button
//                     onClick={(e) => handleAddToWishlist(e, p)}
//                     disabled={favSet.has(String(p.id)) || wishlistLoading}
//                     aria-pressed={favSet.has(String(p.id))}
//                     aria-label={favSet.has(String(p.id)) ? "Added to wishlist" : "Add to wishlist"}
//                     className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-md transition transform
//                       ${favSet.has(String(p.id)) ? "bg-red-50" : "bg-white/90 hover:scale-105"}
//                       ${favSet.has(String(p.id)) ? "cursor-default" : "cursor-pointer"}`}
//                     title={favSet.has(String(p.id)) ? "Already in wishlist" : "Add to wishlist"}
//                     onMouseDown={(e) => e.stopPropagation()}
//                     onMouseUp={(e) => e.stopPropagation()}
//                   >
//                     <Heart
//                       className={`w-5 h-5 ${favSet.has(String(p.id)) ? "text-red-600" : "text-gray-500"}`}
//                       fill={favSet.has(String(p.id)) ? "currentColor" : "none"}
//                     />
//                   </button>

//                   {p.discountAmount > 0 && (
//                     <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow">
//                       {Math.round(((p.price - (p.discountPrice || p.price - p.discountAmount)) / p.price) * 100)}% OFF
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex-1 flex flex-col px-6 py-4">
//                   <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
//                     {p?.name || "Unnamed"}
//                   </h3>

//                   <div className="flex items-center gap-1 mb-3">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <Star key={i} className="w-4 h-4 text-yellow-400" />
//                     ))}
//                   </div>

//                   <div className="mt-auto flex items-center justify-between">
//                     <div>
//                       <div className="text-xl font-bold text-gray-900">Rs.{p?.discountPrice || p?.price}</div>
//                       {p?.discountPrice && (
//                         <div className="text-sm text-gray-400 line-through">Rs.{p?.price}</div>
//                       )}
//                     </div>
//                     {Number(p?.stock ?? 0) > 0 ? (
//                       <button
//                         className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           e.preventDefault();
//                           handleAddToCart(p);
//                         }}
//                       >
//                         Add to cart
//                       </button>
//                     ) : (
//                       <div className="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-200 text-gray-600 select-none">
//                         Out of stock
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </article>
//             </div>
//           ))}
//         </div>
//       </div>

//       {displayedProducts.length === 0 && (
//         <div className="text-center py-16">
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//           <p className="text-gray-500">Try another keyword.</p>
//         </div>
//       )}

//       {/* Combopack section */}
//       {combopackProducts.length > 0 && (
//         <section className="mt-12">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
//             <h3 className="text-2xl font-semibold text-gray-900">Exclusive Combopacks</h3>
//             <span className="text-sm text-gray-500">{combopackProducts.length} items</span>
//           </div>

//           <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
//             <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
//               {combopackProducts.map((p, i) => renderProductCard(p, i))}
//             </div>
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Minus, Star, Heart } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { useCategoryDataContext } from "@/contexts/CategoryDataContext";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/contexts/WishlistContext";
import Viewband from "@/components/ViewBand";

export default function FilterableProductGrid({ onAddToCart, selectedCategory, isAnimating = false }) {
  const [quantities, setQuantities] = useState({});
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { products } = useProducts() || { products: [] };
  const { categories } = useCategoryDataContext() || { categories: [] };

  const staticFallbackProduct = {
    id: "static-001",
    name: "Sample Product (Static)",
    price: 499.0,
    discountPrice: 399.0,
    discountAmount: 100,
    stock: 10,
  };

  const router = useRouter();

  // wishlist
  const { favorites = [], loading: wishlistLoading = false, addFavorite } = useWishlist() || {};

  // keep a set for quick lookup
  const [favSet, setFavSet] = useState(() => new Set());
  useEffect(() => {
    try {
      const s = new Set((favorites || []).map((f) => String(f?.product_id ?? f?.id ?? f?.productId ?? f?.product_id)));
      setFavSet(s);
    } catch (e) {
      setFavSet(new Set());
    }
  }, [favorites]);

  useEffect(() => {
    const handleSearch = (e) => {
      const detail = e && e.detail ? e.detail : "";
      const term = String(detail || "").toString().trim().toLowerCase();
      setSearchTerm(term);
    };
    window.addEventListener("siteSearch", handleSearch);
    return () => window.removeEventListener("siteSearch", handleSearch);
  }, []);

  // ====== category id/name extraction helper ======
  const getProductCategoryIdAndName = useCallback((p) => {
    const cat = p && p.category;
    if (cat == null) return { id: undefined, name: undefined };
    if (typeof cat === "string" || typeof cat === "number") {
      const id = String(cat).trim() || undefined;
      return { id, name: undefined };
    }
    const id = String(cat.id ?? cat._id ?? cat.category_id ?? cat.categoryId ?? "").trim() || undefined;
    const name = String(cat.name ?? cat.title ?? cat.category_name ?? cat.categoryName ?? "").trim() || undefined;
    return { id, name };
  }, []);
  // =================================================

  const combopackCategoryIds = useMemo(() => {
    if (!Array.isArray(categories)) return new Set();
    const set = new Set();
    categories.forEach((c) => {
      const nm = String((c && c.name) || "").toLowerCase();
      if (nm.includes("cobopack") || nm.includes("combopack")) set.add(String(c.id));
    });
    return set;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (!products || (Array.isArray(products) && products.length === 0)) return [staticFallbackProduct];
    let result = [...products];

    if (selectedCategory && selectedCategory !== "all") {
      const catLower = String(selectedCategory).toLowerCase();
      result = result.filter((p) => {
        const { id, name } = getProductCategoryIdAndName(p || {});
        return (
          (id && String(id).toLowerCase().includes(catLower)) ||
          (name && String(name).toLowerCase().includes(catLower)) ||
          (typeof p.category === "string" && String(p.category).toLowerCase().includes(catLower))
        );
      });
    }

    if (searchTerm) {
      result = result.filter((p) => {
        const name = String(p?.name || "").toLowerCase();
        const desc = String(p?.description || p?.short_description || "").toLowerCase();
        const { name: catName, id: catId } = getProductCategoryIdAndName(p);
        const categoryStr = String(catName ?? catId ?? p?.category ?? "").toLowerCase();
        return name.includes(searchTerm) || desc.includes(searchTerm) || categoryStr.includes(searchTerm);
      });
    }
    return result;
  }, [products, selectedCategory, searchTerm, getProductCategoryIdAndName]);

  useEffect(() => {
    setDisplayedProducts(filteredProducts);
  }, [filteredProducts]);

  const qtyOf = useCallback((id) => Math.max(0, Math.trunc(quantities[String(id)] ?? 0)), [quantities]);
  const handleQuantityChange = useCallback((productId, newQuantity) => {
    if (newQuantity < 0) return;
    setQuantities((prev) => ({ ...prev, [String(productId)]: Math.trunc(newQuantity) }));
  }, []);

  // ------------------ NEW: normalized add-to-cart ------------------
  const normalizeForCart = useCallback((raw) => {
    if (!raw) return raw;
    const id = raw.id ?? raw.product_id ?? raw._id ?? raw.slug ?? null;
    const product_id = raw.product_id ?? raw.id ?? raw._id ?? null;
    const price = typeof raw.price !== "undefined" ? raw.price : raw.cost ?? raw.amount ?? 0;
    const discountPrice = raw.discountPrice ?? raw.discount_price ?? raw.discount ?? null;
    const name = raw.name ?? raw.title ?? "Untitled";
    const stock = typeof raw.stock !== "undefined" ? raw.stock : raw.qty ?? raw.quantity ?? 0;

    // Keep all original fields but ensure stable id/product_id and price fields exist
    return {
      ...raw,
      id,
      product_id,
      price,
      discountPrice,
      name,
      stock,
    };
  }, []);

  const handleAddToCart = useCallback(
    (product) => {
      try {
        if (!product) {
          console.warn("handleAddToCart called with falsy product");
          return;
        }

        const normalized = normalizeForCart(product);

        // ensure id exists (cart implementations often reject without id)
        const idToCheck = normalized.id ?? normalized.product_id ?? null;
        if (!idToCheck) {
          console.warn("Product missing id/product_id — not adding to cart:", normalized);
          return;
        }

        const stockVal = Number(normalized?.stock ?? Infinity);
        if (!Number.isFinite(stockVal) || stockVal <= 0) {
          console.warn("addToCart prevented — out of stock:", normalized);
          return;
        }

        const qty = Math.max(1, qtyOf(idToCheck));

        console.debug("Adding to cart:", { id: idToCheck, qty, normalized });

        // call onAddToCart the requested number of times to keep compatibility with current app behavior
        for (let i = 0; i < qty; i++) {
          try {
            // pass normalized product so cart always receives consistent shape
            if (typeof onAddToCart === "function") {
              onAddToCart(normalized);
            } else {
              console.warn("onAddToCart is not a function — cannot add to cart", onAddToCart);
            }
            console.debug("onAddToCart invoked for", idToCheck, "iteration", i + 1);
          } catch (err) {
            console.error("onAddToCart threw:", err);
          }
        }

        // clear quantity input for this product
        setQuantities((prev) => {
          const copy = { ...prev };
          delete copy[String(idToCheck)];
          return copy;
        });

        // Signal cart UI to open (matches your app's openCart event approach)
        // small delay ensures the cart state has a chance to update in many setups
        try {
          // Fire event immediately; most drawers will re-render on store change anyway.
          window.dispatchEvent(new CustomEvent("openCart"));
          console.debug("Dispatched openCart event");
        } catch (err) {
          console.warn("Failed to dispatch openCart event", err);
        }
      } catch (err) {
        console.error("handleAddToCart unexpected error:", err);
      }
    },
    [normalizeForCart, onAddToCart, qtyOf]
  );
  // ---------------------------------------------------------------

  const formatPrice = useCallback((n) => (Number.isNaN(Number(n)) ? "0.00" : Number(n).toFixed(2)), []);
  const computeDisplayPrice = useCallback((p) => {
    const dPrice = p?.discountPrice ?? p?.discount_price;
    const dAmt = p?.discountAmount ?? p?.discount_amount;
    const orig = Number(p?.price || 0);
    if (dPrice > 0) return dPrice;
    if (dAmt > 0) return Math.max(0, orig - dAmt);
    return orig;
  }, []);
  const computeDiscountPercent = useCallback(
    (p) => {
      const orig = Number(p?.price || 0);
      const shown = Number(computeDisplayPrice(p) || 0);
      if (!orig || shown >= orig) return 0;
      return Math.round(((orig - shown) / orig) * 100);
    },
    [computeDisplayPrice]
  );

  const { combopackProducts, otherProducts } = useMemo(() => {
    const combo = [],
      others = [];
    displayedProducts.forEach((p) => {
      const { id, name } = getProductCategoryIdAndName(p);
      const lower = (name || "").toLowerCase();
      if (id && combopackCategoryIds.has(String(id)) || lower.includes("combopack") || lower.includes("cobopack")) combo.push(p);
      else others.push(p);
    });
    return { combopackProducts: combo, otherProducts: others };
  }, [displayedProducts, combopackCategoryIds, getProductCategoryIdAndName]);

  // helper when clicking heart
  const handleAddToWishlist = useCallback(
    async (e, product) => {
      e.stopPropagation();
      e.preventDefault();

      const productId = String(product?.id ?? product?.product_id ?? product?._id ?? "");
      if (!productId) return;

      if (favSet.has(productId)) return;

      try {
        await addFavorite(productId);
      } catch (err) {
        // ignore or show toast
      }
    },
    [addFavorite, favSet]
  );

  const renderProductCard = (product, idx) => {
    const productId = String(product?.id || `tmp-${idx}`);
    const currentQuantity = qtyOf(productId);
    const displayPrice = computeDisplayPrice(product);
    const discountPercent = computeDiscountPercent(product);
    const outOfStock = Number(product?.stock ?? Infinity) <= 0;
    const img =
      product?.imageUrl || (Array.isArray(product?.images) && product.images[0]) || product?.image || "/placeholder.png";

    const isFavourited = favSet.has(String(productId));

    return (
      <article
        key={productId}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 overflow-hidden flex flex-col h-full"
      >
        <div className="relative p-4 cursor-pointer">
          <div className="rounded-xl overflow-hidden bg-gray-50">
            <img src={img} alt={product?.name || "product"} className="w-full h-56 object-cover" />
          </div>

          {/* Favourite icon - top right */}
          <button
            onClick={(e) => handleAddToWishlist(e, product)}
            disabled={isFavourited || wishlistLoading}
            aria-pressed={isFavourited}
            aria-label={isFavourited ? "Added to wishlist" : "Add to wishlist"}
            className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-md transition transform scale-100
              ${isFavourited ? "bg-red-50" : "bg-white/90 hover:scale-105"}
              ${isFavourited ? "cursor-default" : "cursor-pointer"}`}
            title={isFavourited ? "Already in wishlist" : "Add to wishlist"}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          >
            <Heart
              className={`w-5 h-5 ${isFavourited ? "text-red-600" : "text-gray-500"}`}
              fill={isFavourited ? "currentColor" : "none"}
            />
          </button>

          {discountPercent > 0 && (
            <span className="absolute top-5 left-5 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
              {discountPercent}% OFF
            </span>
          )}
        </div>
        <div className="px-5 pb-5 flex-1 flex flex-col">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{product?.name || "Unnamed"}</h3>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400" />
            ))}
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-gray-900">Rs.{formatPrice(displayPrice)}</div>
                {discountPercent > 0 && (
                  <div className="text-xs text-gray-400 mt-1 line-through">Rs.{formatPrice(product.price)}</div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {outOfStock ? (
                  <div className="text-xs  rounded-md bg-gray-100 text-black-500">Out of stock</div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="px-2 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
                  >
                    Add to cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="mb-16 w-full">
      {/* Put header inside the same centered container so it aligns with categories */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Products</h2>
          {displayedProducts.length > 0 && <span className="text-sm text-gray-500 hidden sm:block">Searched results</span>}
        </div>
      </div>

      {/* Centered product grid container with slightly larger cards */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div
          className={`grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4
            transition-all duration-300 ease-in-out ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        >
          {otherProducts.map((p, i) => (
            <div key={p.id || i} className="transform transition-transform hover:scale-[1.02]">
              <article
                onClick={() => router.push(`/product/${p.id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-full"
                style={{
                  height: "480px",
                  minWidth: "280px",
                }}
              >
                <div className="relative w-full h-[260px] sm:h-[280px] md:h-[300px] overflow-hidden">
                  <img
                    src={
                      p?.imageUrl ||
                      (Array.isArray(p?.images) && p.images[0]) ||
                      p?.image ||
                      "/placeholder.png"
                    }
                    alt={p?.name || "product"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />

                  {/* Heart icon for this larger card too */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(e, p);
                    }}
                    disabled={favSet.has(String(p.id)) || wishlistLoading}
                    aria-pressed={favSet.has(String(p.id))}
                    aria-label={favSet.has(String(p.id)) ? "Added to wishlist" : "Add to wishlist"}
                    className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-md transition transform
                      ${favSet.has(String(p.id)) ? "bg-red-50" : "bg-white/90 hover:scale-105"}
                      ${favSet.has(String(p.id)) ? "cursor-default" : "cursor-pointer"}`}
                    title={favSet.has(String(p.id)) ? "Already in wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`w-5 h-5 ${favSet.has(String(p.id)) ? "text-red-600" : "text-gray-500"}`}
                      fill={favSet.has(String(p.id)) ? "currentColor" : "none"}
                    />
                  </button>

                  {p.discountAmount > 0 && (
                    <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow">
                      {Math.round(((p.price - (p.discountPrice || p.price - p.discountAmount)) / p.price) * 100)}% OFF
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col px-6 py-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {p?.name || "Unnamed"}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-gray-900">Rs.{p?.discountPrice || p?.price}</div>
                      {p?.discountPrice && (
                        <div className="text-sm text-gray-400 line-through">Rs.{p?.price}</div>
                      )}
                    </div>
                    {Number(p?.stock ?? 0) > 0 ? (
                      <button
                        className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleAddToCart(p);
                        }}
                      >
                        Add to cart
                      </button>
                    ) : (
                      <div className="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-200 text-gray-600 select-none">
                        Out of stock
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {displayedProducts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try another keyword.</p>
        </div>
      )}

      {/* Combopack section */}
      {combopackProducts.length > 0 && (
        <section className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
            <h3 className="text-2xl font-semibold text-gray-900">Exclusive Combopacks</h3>
            <span className="text-sm text-gray-500">{combopackProducts.length} items</span>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {combopackProducts.map((p, i) => renderProductCard(p, i))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
