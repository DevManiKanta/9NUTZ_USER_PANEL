// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import { useCart } from "@/contexts/CartContext";
// import { useProducts } from "@/contexts/ProductContext";
// import apiAxios from "@/lib/api"; // Use the centralized axios instance
// import ProductClient from "@/app/product/ProductClient";
// import { LOGIN_API_BASE } from "@/lib/api";
// export default function ProductPageClient({ id }) {
//   const { } = useCart(); // kept for parity with your original file
//   const { products } = useProducts(); // existing product context (fallback)
//   const [product, setProduct] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Helper: find product from context
//   const findFromContext = useCallback(
//     (searchId) => {
//       if (!products || products.length === 0) return null;
//       return products.find((p) => String(p.id) === String(searchId)) || null;
//     },
//     [products]
//   );

//   const doFetchProduct = useCallback(
//     async (productId) => {
//       setLoading(true);
//       setError(null);
//       setProduct(null);

//       // If LOGIN_API_BASE is not set, skip API fetch and fallback directly
//       const base = (LOGIN_API_BASE || "").replace(/\/+$/, "");
//       if (!base) {
//         const ctx = findFromContext(productId);
//         if (ctx) {
//           setProduct(ctx);
//           setLoading(false);
//           return;
//         } else {
//           setError("Product not found (no API base configured).");
//           setLoading(false);
//           return;
//         }
//       }

//       // Grab token from localStorage (if available)
//       let token = null;
//       try {
//         if (typeof window !== "undefined") {
//           token = localStorage.getItem("token") || null;
//         }
//       } catch (err) {
//         // localStorage may be blocked — we'll ignore and continue without token
//         token = null;
//       }

//       const url = `/admin/products/show/${encodeURIComponent(String(productId))}`;

//       try {
//         const headers = { "Content-Type": "application/json" };
//         if (token) headers["Authorization"] = `Bearer ${token}`;

//         const res = await apiAxios.get(url, { headers });
//         const json = res.data;

//         // At this point we have ok response; the API returns data shape you showed
//         // Example: { status: true, data: { ...product fields... } }
//         const apiProduct = json?.data ?? null;
//         console.log("TESTing image",apiProduct)
//         if (!apiProduct) {
//           // fallback to context
//           const fallback = findFromContext(productId);
//           if (fallback) {
//             setProduct(fallback);
//             setLoading(false);
//             return;
//           }
//           // throw new Error("Product data missing in API response");
//           throw new Error("Product data missing in API response");
//         }
//         const normalized = {
//           // prefer camelCase keys used in ProductClient if available; fallback to snake_case from API
//           id: apiProduct.id ?? apiProduct.product_id ?? null,
//           name: apiProduct.name ?? apiProduct.title ?? "",
//           price: apiProduct.price ?? apiProduct.price_inr ?? 0,
//           discountPrice: apiProduct.discount_price ?? apiProduct.discountPrice ?? null,
//           // images: API might have image_url or image or image_url full path
//           imageUrl: apiProduct.image_url ?? apiProduct.image_url_full ?? apiProduct.image ?? null,
//           images: apiProduct.images ?? (apiProduct.image ? [apiProduct.image] : []),
//           stock: apiProduct.stock ?? apiProduct.qty ?? apiProduct.stock_count ?? 0,
//           description: apiProduct.description ?? apiProduct.long_description ?? apiProduct.summary ?? "",
//           // preserve raw data for debugging
//           _raw: apiProduct,
//           // include any other properties onto normalized object
//           ...apiProduct,
//         };
//         setProduct(normalized);
//         setLoading(false);
//       } catch (err) {
//         // Network or parse error: try fallback to context
//         // Axios wraps errors, so we check err.response for API errors
//         const isAuthError = err.response?.status === 401 || err.response?.status === 403;

//         // For any error, try to fall back to the context
//         const fallback = findFromContext(productId);
//         if (fallback) {
//           setProduct(fallback);
//           setLoading(false);
//           return;
//         }
//         setError(err?.message || String(err));

//         // If fallback fails, show the error
//         const errorMessage =
//           err.response?.data?.message || err.message || "Failed to fetch product.";

//         setError(errorMessage);
//         setLoading(false);
//       }
//     },
//     [findFromContext]
//   );

//   useEffect(() => {
//     if (!id) {
//       setError("No product id provided");
//       setLoading(false);
//       return;
//     }
//     // Trigger fetch
//     doFetchProduct(id);
//   }, [id, doFetchProduct]);

//   // Retry handler
//   const handleRetry = useCallback(() => {
//     if (!id) return;
//     setError(null);
//     doFetchProduct(id);
//   }, [id, doFetchProduct]);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-1 w-full bg-white">
//         <section className="w-full bg-gray-50">
//           <div className="max-w-6xl mx-auto px-4 py-1">
//             {loading ? (
//               <div className="flex justify-center items-center py-24">
//                 <div className="w-12 h-12 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
//               </div>
//             ) : error ? (
//               <div className="text-center py-12">
//                 <p className="text-red-600 mb-4">Error: {error}</p>
//                 <div className="flex justify-center gap-3">
//                   <button
//                     onClick={handleRetry}
//                     className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               </div>
//             ) : product ? (
//               <ProductClient product={product} />
//             ) : (
//               <p className="text-center text-gray-500">Product not found</p>
//             )}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import apiAxios, { LOGIN_API_BASE } from "@/lib/api"; 
import ProductClient from "@/app/product/ProductClient";

export default function ProductPageClient({ id }) {
  const { } = useCart();
  const { products } = useProducts() || { products: [] };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ASSET_BASE = (LOGIN_API_BASE || "https://9nutsapi.nearbydoctors.in/public").replace(/\/+$/, "");

  // fallback search in context
  const findFromContext = useCallback(
    (searchId) => {
      if (!products || products.length === 0) return null;
      return products.find((p) => String(p.id) === String(searchId)) || null;
    },
    [products]
  );

  // Normalize a single entry (string or object) -> full URL or null
  const normalizeImageEntry = useCallback(
    (entry) => {
      if (!entry) return null;

      // If string (could be a full URL or a relative path like "products/abc.jpg")
      if (typeof entry === "string") {
        const s = entry.trim();
        if (!s) return null;
        if (/^https?:\/\//i.test(s)) return s;
        // assume relative path under storage
        return `${ASSET_BASE}/storage/${s.replace(/^\/+/, "")}`;
      }

      // If object (image object from API)
      if (typeof entry === "object") {
        // Prefer explicit full URL fields first (image_url)
        const url = entry.image_url ?? entry.url ?? entry.imageUrl ?? entry.image ?? entry.path ?? null;
        if (!url) return null;
        if (typeof url === "string" && /^https?:\/\//i.test(url)) return url;
        // relative => convert
        return `${ASSET_BASE}/storage/${String(url).replace(/^\/+/, "")}`;
      }

      return null;
    },
    [ASSET_BASE]
  );

  const doFetchProduct = useCallback(
    async (productId) => {
      setLoading(true);
      setError(null);
      setProduct(null);

      // if no LOGIN_API_BASE configured, fall back to context product
      const baseConfigured = Boolean(LOGIN_API_BASE);
      if (!baseConfigured) {
        const ctx = findFromContext(productId);
        if (ctx) {
          // minimal normalization
          const imagesArr = Array.isArray(ctx.images)
            ? ctx.images.map((it) => (typeof it === "string" ? it : it.image_url ?? it.image)).filter(Boolean)
            : ctx.image
            ? [ctx.image]
            : [];
          setProduct({
            ...ctx,
            id: ctx.id,
            name: ctx.name,
            price: Number(ctx.price || 0),
            discountPrice: ctx.discount_price ?? ctx.discountPrice ?? null,
            imageUrl: ctx.image_url ?? ctx.image ?? imagesArr[0] ?? null,
            images: imagesArr,
            stock: Number(ctx.stock ?? 0),
            description: ctx.description ?? "",
            _raw: ctx,
          });
          setLoading(false);
          return;
        } else {
          setError("Product not found (no API base configured).");
          setLoading(false);
          return;
        }
      }

      // fetch from API
      let token = localStorage.getItem("token");
      try {
        if (typeof window !== "undefined") token = localStorage.getItem("token") || null;
      } catch (e) {
        token = null;
      }

      const url = `/admin/products/show/${encodeURIComponent(String(productId))}`;

      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await apiAxios.get(url, { headers });
        const json = res?.data ?? res;

        // Locate the product object in response (shapes vary)
        let apiProduct = null;
        if (json && typeof json === "object") {
          if (Array.isArray(json.data) && json.data.length === 1 && (json.data[0].id || json.data[0].product_id)) {
            apiProduct = json.data[0];
          } else if (json.data && typeof json.data === "object" && (json.data.id || json.data.product_id)) {
            apiProduct = json.data;
          } else if (Array.isArray(json.data) && json.data.length > 0) {
            // try to find by id
            const found = json.data.find((p) => String(p.id) === String(productId) || String(p.product_id) === String(productId));
            apiProduct = found || null;
          } else if (json.id || json.product_id) {
            apiProduct = json;
          }
        }

        if (!apiProduct) {
          const fallback = findFromContext(productId);
          if (fallback) {
            setProduct(fallback);
            setLoading(false);
            return;
          }
          throw new Error("Product data missing in API response");
        }

        // Normalize images array (prefer image_url inside each image object)
        const rawImages = Array.isArray(apiProduct.images) ? apiProduct.images : [];
        const imagesUrls = rawImages
          .map((it) => normalizeImageEntry(it?.image_url ?? it ?? it))
          .filter(Boolean);

        // Top-level image candidates (prefer image_url)
        const topImageCandidates = [
          apiProduct.image_url,
          apiProduct.imageUrl,
          apiProduct.image,
          apiProduct.url,
        ]
          .map((v) => (v ? normalizeImageEntry(v) : null))
          .filter(Boolean);

        // Final images: if images array present, use it; otherwise include top candidates (de-duplicated)
        const finalImages = imagesUrls.length ? imagesUrls : [...new Set(topImageCandidates)];

        const primaryImage =
          (apiProduct.image_url ? normalizeImageEntry(apiProduct.image_url) : null) ||
          finalImages[0] ||
          (apiProduct.image ? normalizeImageEntry(apiProduct.image) : null) ||
          null;

        const normalized = {
          id: apiProduct.id ?? apiProduct.product_id ?? null,
          name: apiProduct.name ?? apiProduct.title ?? "",
          price: Number(apiProduct.price ?? apiProduct.price_inr ?? 0),
          discountPrice: apiProduct.discount_price ?? apiProduct.discountPrice ?? null,
          discountAmount: apiProduct.discount_amount ?? apiProduct.discountAmount ?? null,
          discountPercent: apiProduct.discount_percent ?? apiProduct.discountPercent ?? null,
          imageUrl: primaryImage,
          images: finalImages, // array of full URLs (may be empty)
          stock: Number(apiProduct.stock ?? apiProduct.qty ?? 0),
          description: apiProduct.description ?? "",
          grams: apiProduct.grams ?? null,
          category: apiProduct.category ?? null,
          _raw: apiProduct,
          ...apiProduct,
        };

        setProduct(normalized);
        setLoading(false);
      } catch (err) {
        // try fallback context
        const fallback = findFromContext(productId);
        if (fallback) {
          setProduct(fallback);
          setLoading(false);
          return;
        }
        const msg = err?.response?.data?.message || err.message || String(err);
        setError(msg);
        setLoading(false);
      }
    },
    [findFromContext, normalizeImageEntry]
  );

  useEffect(() => {
    if (!id) {
      setError("No product id provided");
      setLoading(false);
      return;
    }
    void doFetchProduct(id);
  }, [id, doFetchProduct]);

  const handleRetry = useCallback(() => {
    if (!id) return;
    setError(null);
    void doFetchProduct(id);
  }, [id, doFetchProduct]);
  console.log("Products",product)
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full bg-white">
        <section className="w-full bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-1">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : product ? (
              <ProductClient product={product} />
            ) : (
              <p className="text-center text-gray-500">Product not found</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

