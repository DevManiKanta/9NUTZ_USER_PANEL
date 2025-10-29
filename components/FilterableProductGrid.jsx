

// "use client";
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { Plus, Minus, Star } from "lucide-react";
// import { useProducts } from "@/contexts/ProductContext";
// import { useCategoryDataContext } from "@/contexts/CategoryDataContext";
// import { useRouter } from "next/navigation";
// export default function FilterableProductGrid({ onAddToCart, selectedCategory, isAnimating = false }) {
//   const [quantities, setQuantities] = useState({});
//   const [displayedProducts, setDisplayedProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const { products } = useProducts() || { products: [] };
//   const { categories } = useCategoryDataContext() || { categories: [] };

//   // Fallback product in case product array empty
//   const staticFallbackProduct = {
//     id: "static-001",
//     name: "Sample Product (Static)",
//     price: 499.0,
//     discountPrice: 399.0,
//     discountAmount: 100,
//     stock: 10,
//     imageUrl: "/placeholder.png",
//   };
   
//   const router = useRouter();

//   // Listen to global "siteSearch" events dispatched by Header
//   useEffect(() => {
//     const handleSearch = (e) => {
//       // event may be a CustomEvent with detail string
//       const detail = e && e.detail ? e.detail : "";
//       const term = String(detail || "").toString().trim().toLowerCase();
//       setSearchTerm(term);
//     };
//     window.addEventListener("siteSearch", handleSearch);
//     return () => window.removeEventListener("siteSearch", handleSearch);
//   }, []);

//   // Helper: normalize product category to string id and string name
//   const getProductCategoryIdAndName = useCallback((p) => {
//     const cat = p && p.category;
//     if (!cat && typeof cat !== "string") return { id: undefined, name: undefined };
//     if (typeof cat === "string") {
//       const s = String(cat);
//       return { id: s, name: s };
//     }
//     const id = String(cat.id ?? cat._id ?? cat.category_id ?? cat.categoryId ?? "").trim() || undefined;
//     const name = String(cat.name ?? cat.title ?? cat.category_name ?? "").trim() || undefined;
//     return { id, name };
//   }, []);

//   // Determine which category ids correspond to the "cobopack" / "combopack"
//   const combopackCategoryIds = useMemo(() => {
//     if (!Array.isArray(categories)) return new Set();
//     const set = new Set();
//     categories.forEach((c) => {
//       const nm = String((c && c.name) || "").toLowerCase();
//       if (!nm) return;
//       if (nm.includes("cobopack") || nm.includes("combopack")) {
//         set.add(String(c.id));
//       }
//     });
//     return set;
//   }, [categories]);

//   // Build filtered product list (search + category). Safeguards for missing fields.
//   const filteredProducts = useMemo(() => {
//     if (!products || (Array.isArray(products) && products.length === 0)) return [staticFallbackProduct];

//     let result = Array.isArray(products) ? [...products] : [];

//     // Category filter (if provided)
//     if (selectedCategory && selectedCategory !== "all") {
//       const catLower = String(selectedCategory).toLowerCase();
//       result = result.filter((p) => {
//         const { id, name } = getProductCategoryIdAndName(p || {});
//         return (
//           (id && String(id).toLowerCase().includes(catLower)) ||
//           (name && String(name).toLowerCase().includes(catLower)) ||
//           (typeof (p && p.category) === "string" && String(p.category).toLowerCase().includes(catLower))
//         );
//       });
//     }

//     // Search filter (name, description, category)
//     if (searchTerm) {
//       result = result.filter((p) => {
//         const name = String((p && p.name) || "").toLowerCase();
//         const desc = String((p && (p.description || p.short_description)) || "").toLowerCase();
//         const catInfo = getProductCategoryIdAndName(p || {});
//         const categoryStr = String(catInfo.name ?? catInfo.id ?? (p && p.category) ?? "").toLowerCase();

//         return (
//           name.includes(searchTerm) ||
//           desc.includes(searchTerm) ||
//           categoryStr.includes(searchTerm)
//         );
//       });
//     }

//     return result;
//   }, [products, selectedCategory, searchTerm, getProductCategoryIdAndName]);

//   // Update displayedProducts whenever filter changes
//   useEffect(() => {
//     setDisplayedProducts(filteredProducts);
//   }, [filteredProducts]);

//   const qtyOf = useCallback((id) => {
//     const key = String(id ?? "");
//     return Math.max(0, Math.trunc(quantities[key] ?? 0));
//   }, [quantities]);

//   const handleQuantityChange = useCallback((productId, newQuantity) => {
//     if (newQuantity < 0) return;
//     const key = String(productId);
//     setQuantities((prev) => ({ ...prev, [key]: Math.trunc(newQuantity) }));
//   }, []);

//   const handleAddToCart = useCallback((product) => {
//     // guard for stock: if stock is 0 or negative, do nothing
//     const stockVal = Number(product && product.stock != null ? product.stock : Infinity);
//     if (!isNaN(stockVal) && stockVal <= 0) return;

//     const qty = Math.max(1, qtyOf(product && product.id));
//     for (let i = 0; i < qty; i++) {
//       onAddToCart(product);
//     }
//     // reset qty for that product back to 0
//     setQuantities((prev) => {
//       const copy = { ...prev };
//       delete copy[String(product && product.id ? product.id : "")];
//       return copy;
//     });
//   }, [onAddToCart, qtyOf]);

//   const formatPrice = useCallback((n) => {
//     const v = typeof n === "string" ? Number(n) : Number(n ?? 0);
//     if (Number.isNaN(v)) return "0.00";
//     return v.toFixed(2);
//   }, []);

//   const computeDisplayPrice = useCallback((p) => {
//     const discountPrice = p && (p.discountPrice ?? p.discount_price);
//     const discountAmount = p && (p.discountAmount ?? p.discount_amount);
//     const original = Number(p && p.price ? p.price : 0);

//     if (typeof discountPrice === "number" && discountPrice > 0) return discountPrice;
//     if (typeof discountAmount === "number" && discountAmount > 0) return Math.max(0, original - discountAmount);
//     return original;
//   }, []);

//   const computeDiscountPercent = useCallback((p) => {
//     const original = Number(p && p.price ? p.price : 0);
//     const shown = Number(computeDisplayPrice(p) || 0);
//     if (!original || shown >= original) return 0;
//     return Math.round(((original - shown) / original) * 100);
//   }, [computeDisplayPrice]);

//   // Split combopack products and others
//   const { combopackProducts, otherProducts } = useMemo(() => {
//     const combo = [];
//     const others = [];

//     const comboIds = combopackCategoryIds;

//     for (const p of displayedProducts) {
//       const catInfo = getProductCategoryIdAndName(p || {});
//       const pCatId = catInfo.id;
//       const pCatName = catInfo.name;
//       const matchedById = pCatId ? comboIds.has(String(pCatId)) : false;
//       const lowerName = String(pCatName || "").toLowerCase();
//       const matchedByName = lowerName.includes("cobopack") || lowerName.includes("combopack");
//       const matchedByFallbackString = typeof (p && p.category) === "string" && String(p.category).toLowerCase().includes("cobopack");

//       if (matchedById || matchedByName || matchedByFallbackString) combo.push(p);
//       else others.push(p);
//     }
//     return { combopackProducts: combo, otherProducts: others };
//   }, [displayedProducts, combopackCategoryIds, getProductCategoryIdAndName]);

//   // Render helpers
//   const renderProductCard = (product, idx) => {
//     const productId = String(product && product.id ? product.id : `tmp-${idx}`);
//     const currentQuantity = qtyOf(productId);
//     const displayPrice = computeDisplayPrice(product);
//     const discountPercent = computeDiscountPercent(product);
//     const outOfStock = Number(product && product.stock != null ? product.stock : Infinity) <= 0;

//     const img = (product && product.imageUrl) ||
//                 (Array.isArray(product && product.images) && product.images[0]) ||
//                 (product && product.image) ||
//                 "/placeholder.png";

//     const descriptionText = String((product && (product.description || product.short_description)) || "").trim();
//     return (
//       <article
//         key={productId}
//         className="bg-white rounded-2xl shadow-[0_6px_18px_rgba(13,18,25,0.08)] border border-transparent hover:border-gray-100 overflow-hidden flex flex-col"
//         style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}
//       >
//         <div className="relative p-4">
//           <div className="rounded-xl overflow-hidden bg-gray-50">
//             <img
//               src={img}
//                  onClick={() => { if (productId && !productId.startsWith('tmp-')) router.push(`/product/${productId}`); }}
//               alt={(product && product.name) || "product"}
//               onError={(e) => {
//                 try {
//                   e.currentTarget.src = "/placeholder.png";
//                 } catch (err) {
//                   /* ignore */
//                 }
//               }}
//               className="w-full h-56 object-cover block"
//             />
//           </div>
//         </div>

//         <div className="px-5 pb-5 flex-1 flex flex-col">
//           <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2" title={(product && product.name) || ""}>
//             {(product && product.name) || "Unnamed"}
//           </h3>

//           <div className="flex items-center gap-1 mb-3">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <Star key={i} className="w-3 h-3 text-yellow-400" />
//             ))}
//           </div>

//           <div className="mt-auto">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">Rs.{formatPrice(Number(product && (product.price || 0)))}</div>
//                 {discountPercent > 0 && (
//                   <div className="text-xs text-gray-400 mt-1">Disc: Rs.{formatPrice(Number(displayPrice))} ({discountPercent}% off)</div>
//                 )}
//               </div>

//               <div className="flex items-center space-x-2">
//                 {outOfStock ? (
//                   <div className="text-xs px-3 py-2 rounded-md bg-gray-100 text-gray-500">Out of stock</div>
//                 ) : currentQuantity <= 0 ? (
//                   <button
//                     // onClick={() => handleAddToCart(product)}
//                         onClick={() => { if (productId && !productId.startsWith('tmp-')) router.push(`/product/${productId}`); }}
//                     className="inline-flex items-center justify-center px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
//                   >
//                      View
//                   </button>
//                 ) : (
//                   <div className="inline-flex items-center bg-green-600 text-white rounded-lg overflow-hidden">
//                     <button onClick={() => handleQuantityChange(productId, Math.max(0, currentQuantity - 1))} className="p-2" aria-label="decrease quantity">
//                       <Minus className="w-4 h-4" />
//                     </button>
//                     <span className="px-3 text-sm font-semibold">{currentQuantity}</span>
//                     <button onClick={() => handleQuantityChange(productId, currentQuantity + 1)} className="p-2" aria-label="increase quantity">
//                       <Plus className="w-4 h-4" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </article>
//     );
//   };

//   return (
//     <div className="mb-12">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold text-gray-900">Shop by Products</h2>
//         {displayedProducts.length > 0 && <h3 className="text-sm text-gray-600">Searched results</h3>}
//       </div>
//       {/* Other products grid */}
//       <div
//         className={`grid gap-6 
//           grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
//           transition-all duration-300 ease-in-out ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
//       >
//         {otherProducts.map((product, idx) => renderProductCard(product, idx))}
//       </div>

//       {displayedProducts.length === 0 && (
//         <div className="text-center py-16">
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//           <p className="text-gray-500">Try another keyword.</p>
//         </div>
//       )}
//       <div style={{marginTop:"2rem"}}>
//       {combopackProducts.length > 0 && (
//         <section className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-xl font-semibold">Combopack</h3>
//             <div className="text-sm text-gray-500">{combopackProducts.length} items</div>
//           </div>
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
//             {combopackProducts.map((product, idx) => {
//               const productId = String(product && product.id ? product.id : `combo-${idx}`);
//               return (
//                 <div key={productId}>
//                   <div className="bg-white rounded-2xl shadow-[0_6px_18px_rgba(13,18,25,0.08)] border border-transparent hover:border-gray-100 overflow-hidden flex flex-col">
//                     <div className="relative p-4">
//                       <div className="rounded-xl overflow-hidden bg-gray-50">
//                         <img
//                           src={(product && product.imageUrl) || (Array.isArray(product && product.images) && product.images[0]) || (product && product.image) || "/placeholder.png"}
//                           alt={(product && product.name) || "product"}
//                           // onError={(e) => { try { e.currentTarget.src = "/placeholder.png"; } catch {} }}
//                           className="w-full h-56 object-cover block"
//                         />
//                       </div>
//                     </div>
//                     <div className="px-5 pb-5 flex-1 flex flex-col">
//                       <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2" title={(product && product.name) || ""}>
//                         {(product && product.name) || "Unnamed"}
//                       </h3>

//                       {/* DESCRIPTION for combopack products */}
//                       {(product && (product.description || product.short_description)) ? (
//                         <p className="text-sm text-gray-600 mb-3 line-clamp-3">
//                           {product.description || product.short_description}
//                         </p>
//                       ) : null}

//                       <div className="flex items-center gap-1 mb-3">
//                         {Array.from({ length: 5 }).map((_, i) => (
//                           <Star key={i} className="w-3 h-3 text-yellow-400" />
//                         ))}
//                       </div>
//                       <div className="mt-auto">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <div className="text-2xl font-bold text-gray-900">Rs.{formatPrice(Number(product && (product.price || 0)))}</div>
//                           </div>

//                           <div className="flex items-center space-x-2">
//                             {Number(product && product.stock != null ? product.stock : Infinity) <= 0 ? (
//                               <div className="text-xs px-3 py-2 rounded-md bg-gray-100 text-gray-500">Out of stock</div>
//                             ) : qtyOf(productId) <= 0 ? (
//                               <button
//                                 onClick={() => handleAddToCart(product)}
//                                 className="inline-flex items-center justify-center px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
//                               >
//                                 View
//                               </button>
//                             ) : (
//                               <div className="inline-flex items-center bg-green-600 text-white rounded-lg overflow-hidden">
//                                 <button onClick={() => handleQuantityChange(productId, Math.max(0, qtyOf(productId) - 1))} className="p-2" aria-label="decrease quantity">
//                                   <Minus className="w-4 h-4" />
//                                 </button>
//                                 <span className="px-3 text-sm font-semibold">{qtyOf(productId)}</span>
//                                 <button onClick={() => handleQuantityChange(productId, qtyOf(productId) + 1)} className="p-2" aria-label="increase quantity">
//                                   <Plus className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>
//       )}
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Minus, Star } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { useCategoryDataContext } from "@/contexts/CategoryDataContext";
import { useRouter } from "next/navigation";
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
    imageUrl: "/placeholder.png",
  };

  const router = useRouter();

  useEffect(() => {
    const handleSearch = (e) => {
      const detail = e && e.detail ? e.detail : "";
      const term = String(detail || "").toString().trim().toLowerCase();
      setSearchTerm(term);
    };
    window.addEventListener("siteSearch", handleSearch);
    return () => window.removeEventListener("siteSearch", handleSearch);
  }, []);

  // ===== FIXED: more robust category id/name extraction =====
  const getProductCategoryIdAndName = useCallback((p) => {
    const cat = p && p.category;

    // no category provided
    if (cat == null) return { id: undefined, name: undefined };

    // category provided as a primitive id (string or number)
    if (typeof cat === "string" || typeof cat === "number") {
      const id = String(cat).trim() || undefined;
      return { id, name: undefined };
    }

    // category provided as an object -> try common keys
    const id = String(cat.id ?? cat._id ?? cat.category_id ?? cat.categoryId ?? "").trim() || undefined;
    const name = String(cat.name ?? cat.title ?? cat.category_name ?? cat.categoryName ?? "").trim() || undefined;
    return { id, name };
  }, []);
  // ===========================================================

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

  const handleAddToCart = useCallback(
    (product) => {
      const stockVal = Number(product?.stock ?? Infinity);
      if (stockVal <= 0) return;
      const qty = Math.max(1, qtyOf(product.id));
      for (let i = 0; i < qty; i++) onAddToCart(product);
      setQuantities((prev) => {
        const copy = { ...prev };
        delete copy[String(product.id)];
        return copy;
      });
    },
    [onAddToCart, qtyOf]
  );

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
      // compare id as string to match combopackCategoryIds entries
      if (id && combopackCategoryIds.has(String(id)) || lower.includes("combopack") || lower.includes("cobopack")) combo.push(p);
      else others.push(p);
    });
    return { combopackProducts: combo, otherProducts: others };
  }, [displayedProducts, combopackCategoryIds, getProductCategoryIdAndName]);

  const renderProductCard = (product, idx) => {
    const productId = String(product?.id || `tmp-${idx}`);
    const currentQuantity = qtyOf(productId);
    const displayPrice = computeDisplayPrice(product);
    const discountPercent = computeDiscountPercent(product);
    const outOfStock = Number(product?.stock ?? Infinity) <= 0;
    const img =
      product?.imageUrl || (Array.isArray(product?.images) && product.images[0]) || product?.image || "/placeholder.png";

    return (
      <article
        key={productId}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 overflow-hidden flex flex-col h-full"
      >
        <div className="relative p-4 cursor-pointer">
          <div className="rounded-xl overflow-hidden bg-gray-50">
            <img src={img} alt={product?.name || "product"} className="w-full h-56 object-cover" />
          </div>
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
                    onClick={() => router.push(`/product/${productId}`)}
                    className="px-2 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
                  >
                    View
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
