// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import {LOGIN_API_BASE} from "@/lib/api"
// import Header from "../components/Header"
// const API_BASE = "https://9nutsapi.nearbydoctors.in/public/api";

// /** helper to turn backend image path into absolute URL */
// function toFullImageUrl(img) {
//   if (!img) return "";
//   if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) return img;
//   const base = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
//   if (!base) return img;
//   if (img.startsWith("/")) return `${base}${img}`;
//   return `${base}/${img}`;
// }
// export default function CategoryProductsClient({ identifier }) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [category, setCategory] = useState(null);

//   useEffect(() => {
//     if (!identifier) {
//       setError("No category identifier provided");
//       setLoading(false);
//       return;
//     }

//     let cancelled = false;
//     (async () => {
//       setLoading(true);
//       setError(null);
//       setCategory(null);

//       // Helper to fetch JSON with error handling
//       async function doFetch(url, opts = {}) {
//         try {
//           const res = await fetch(url, { ...opts, headers: { "Content-Type": "application/json" } });
//           const text = await res.text();
//           // try parse JSON
//           try {
//             const json = JSON.parse(text || "{}");
//             return { ok: res.ok, status: res.status, json };
//           } catch (parseErr) {
//             return { ok: res.ok, status: res.status, json: null, raw: text };
//           }
//         } catch (err) {
//           return { ok: false, error: err };
//         }
//       }

//       try {
//         // 1) First, optimistic attempt: call show-category/{identifier}
//         const tryUrl = `${API_BASE}/online-categories/show-category/${encodeURIComponent(identifier)}`;
//         const attempt = await doFetch(tryUrl);

//         if (cancelled) return;

//         if (attempt.ok && attempt.json && attempt.json.data) {
//           setCategory(attempt.json.data);
//           setLoading(false);
//           return;
//         }

//         // If not ok or no data, fall back to listing categories and searching by slug/name
//         const listUrl = `${API_BASE}/category/show`; // based on your existing getCategoriesPublicAPI pattern
//         const list = await doFetch(listUrl);
//         if (cancelled) return;

//         if (!list.ok || !list.json) {
//           // nothing we can do
//           const msg = list.error?.message || `Failed to load categories (status ${list.status})`;
//           throw new Error(msg);
//         }

//         const rows = Array.isArray(list.json.data) ? list.json.data : [];
//         // Try match by id if identifier numeric
//         const numericId = String(identifier).match(/^\d+$/) ? Number(identifier) : null;
//         let found = null;
//         if (numericId !== null) {
//           found = rows.find((r) => Number(r.id) === numericId);
//         }
//         // Try match by slug or name (case-insensitive)
//         if (!found) {
//           const slugLower = String(identifier).toLowerCase();
//           found = rows.find((r) => {
//             const maybeSlug = (r.slug ?? "").toLowerCase();
//             const name = (r.name ?? r.title ?? "").toLowerCase();
//             return maybeSlug === slugLower || name === slugLower;
//           });
//         }

//         if (found) {
//           // If we found a category in the list, attempt to fetch full detail by id
//           const detailUrl = `${API_BASE}/online-categories/show-category/${found.id}`;
//           const detail = await doFetch(detailUrl);
//           if (cancelled) return;
//           if (detail.ok && detail.json && detail.json.data) {
//             setCategory(detail.json.data);
//             setLoading(false);
//             return;
//           }
//           // else return the found (partial) row from list (may have no products)
//           setCategory(found);
//           setLoading(false);
//           return;
//         }

//         throw new Error("Category not found by identifier");
//       } catch (err) {
//         if (!cancelled) {
//           setError(err?.message || String(err));
//           setLoading(false);
//         }
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [identifier]);

//  if (loading) {
//   return (
//     <div className="flex justify-center items-center py-20">
//       <div className="w-12 h-12 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
//     </div>
//   );
// }

//   if (error) return <div className="py-12 text-center text-red-600">Error: {error}</div>;
//   if (!category) return <div className="py-12 text-center text-gray-500">Category not found</div>;

//   const products = Array.isArray(category.products) ? category.products : [];

//   return (
//     <> 
//     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex items-center gap-6 mb-6">
//         {category.image_url ? (
//           <img src={category.image_url} alt={category.name} className="w-28 h-28 object-cover rounded-md shadow" />
//         ) : category.image ? (
//           <img src={toFullImageUrl(category.image)} alt={category.name} className="w-28 h-28 object-cover rounded-md shadow" />
//         ) : null}
//         <div>
//           <h1 className="text-2xl font-bold">{category.name ?? category.title}</h1>
//           {/* <p className="text-sm text-gray-500 mt-1">Category ID: {category.id ?? "-"}</p> */}
//         </div>
//       </div>

//       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.length === 0 ? (
//           <div className="col-span-full text-center text-gray-500 py-6">No products in this category.</div>
//         ) : (
//           products.map((p) => (
//             <article key={p.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
//               <Link href={`/product/${p.id}`} className="block">
//                 <div className="w-full h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
//                   <img
//                     src={p.image_url || (p.image ? toFullImageUrl(p.image) : "")}
//                     alt={p.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
//                   <p className="text-xs text-gray-500 mt-1">{p.grams} g</p>
//                   <div className="mt-2 flex items-baseline justify-between">
//                     <span className="text-lg font-bold">₹{p.discount_price ?? p.price}</span>
//                   </div>
//                 </div>
//               </Link>
//             </article>
//           ))
//         )}
//       </div>
//     </section>
//       </>
//   );
// }
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LOGIN_API_BASE } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
const API_BASE = "https://9nutsapi.nearbydoctors.in/public/api";

/** helper to turn backend image path into full URL */
function toFullImageUrl(img) {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) return img;
  const base = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
  if (!base) return img;
  if (img.startsWith("/")) return `${base}${img}`;
  return `${base}/${img}`;
}

export default function CategoryProductsClient({ identifier }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);

  // missing isAdding state — add it here
  const [isAdding, setIsAdding] = useState(false);

  // call custom hook at top-level (unchanged)
  const { addItem, openCart } = useCart() || {};

  // Move handler to top-level so hooks are always called in the same order
  const handleAddToCart = useCallback(
    (productToAdd) => {
      if (!productToAdd) return;
      const stockVal = Number(productToAdd?.stock ?? Infinity);
      if (!Number.isNaN(stockVal) && stockVal <= 0) return;
      setIsAdding(true);

      try {
        if (typeof addItem === "function") {
          addItem({ ...productToAdd, quantity: 1 });
        } else {
          window.dispatchEvent(
            new CustomEvent("productAddToCart", {
              detail: { product: productToAdd, quantity: 1 },
            })
          );
        }

        if (typeof openCart === "function") openCart();
        else window.dispatchEvent(new CustomEvent("openCart"));
      } catch (err) {
        console.error("Error adding product:", err);
      } finally {
        setTimeout(() => setIsAdding(false), 600);
      }
    },
    [addItem, openCart, setIsAdding]
  );

  useEffect(() => {
    if (!identifier) {
      setError("No category identifier provided");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setCategory(null);

      async function doFetch(url, opts = {}) {
        try {
          const res = await fetch(url, { ...opts, headers: { "Content-Type": "application/json" } });
          const text = await res.text();
          try {
            const json = JSON.parse(text || "{}");
            return { ok: res.ok, status: res.status, json };
          } catch {
            return { ok: res.ok, status: res.status, json: null, raw: text };
          }
        } catch (err) {
          return { ok: false, error: err };
        }
      }

      try {
        const tryUrl = `${API_BASE}/online-categories/show-category/${encodeURIComponent(identifier)}`;
        const attempt = await doFetch(tryUrl);
        if (cancelled) return;

        if (attempt.ok && attempt.json && attempt.json.data) {
          setCategory(attempt.json.data);
          setLoading(false);
          return;
        }

        const listUrl = `${API_BASE}/category/show`;
        const list = await doFetch(listUrl);
        if (cancelled) return;

        const rows = Array.isArray(list.json?.data) ? list.json.data : [];
        const numericId = String(identifier).match(/^\d+$/) ? Number(identifier) : null;
        let found = null;

        if (numericId !== null) found = rows.find((r) => Number(r.id) === numericId);
        if (!found) {
          const slugLower = String(identifier).toLowerCase();
          found = rows.find((r) => {
            const maybeSlug = (r.slug ?? "").toLowerCase();
            const name = (r.name ?? r.title ?? "").toLowerCase();
            return maybeSlug === slugLower || name === slugLower;
          });
        }

        if (found) {
          const detailUrl = `${API_BASE}/online-categories/show-category/${found.id}`;
          const detail = await doFetch(detailUrl);
          if (cancelled) return;
          if (detail.ok && detail.json && detail.json.data) {
            setCategory(detail.json.data);
            setLoading(false);
            return;
          }
          setCategory(found);
          setLoading(false);
          return;
        }

        throw new Error("Category not found by identifier");
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || String(err));
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [identifier]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error)
    return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  if (!category)
    return <div className="py-12 text-center text-gray-500">Category not found</div>;

  const products = Array.isArray(category.products) ? category.products : [];

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center gap-6 mb-6">
          {category.image_url ? (
            <img
              src={category.image_url}
              alt={category.name}
              className="w-28 h-28 object-cover rounded-md shadow"
            />
          ) : category.image ? (
            <img
              src={toFullImageUrl(category.image)}
              alt={category.name}
              className="w-28 h-28 object-cover rounded-md shadow"
            />
          ) : null}
          <div>
            <h1 className="text-2xl font-bold">
              {category.name ?? category.title}
            </h1>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-6">
              No products in this category.
            </div>
          ) : (
            products.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <Link href={`/product/${p.id}`} className="block">
                  <div className="w-full h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={
                        p.image_url ||
                        (p.image ? toFullImageUrl(p.image) : "")
                      }
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{p.grams} g</p>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-lg font-bold">
                        ₹{p.discount_price ?? p.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(p);
                      }}
                      className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 rounded-md transition"
                    >
                      {isAdding ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}


