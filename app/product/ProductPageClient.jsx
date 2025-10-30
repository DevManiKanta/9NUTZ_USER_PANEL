"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import apiAxios from "@/lib/api"; // Use the centralized axios instance
import ProductClient from "@/app/product/ProductClient";
import { LOGIN_API_BASE } from "@/lib/api";

/**
 * ProductPageClient
 * - Props: { id } (string)
 *
 * Behavior:
 * 1. Try to fetch product detail from API: `${LOGIN_API_BASE}/admin/products/show/${id}`
 *    - Uses token from localStorage as `Authorization: Bearer <token>` if available.
 * 2. While fetching, show a loader.
 * 3. If API call succeeds and returns a product, use it.
 * 4. If API call fails (network/401/parse), fallback to context `products` lookup (existing behavior).
 * 5. Show an error UI + Retry button when both API fetch and context lookup fail.
 *
 * This preserves your original UX and only enhances with a server-backed authoritative fetch.
 */
export default function ProductPageClient({ id }) {
  const { } = useCart(); // kept for parity with your original file
  const { products } = useProducts(); // existing product context (fallback)
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: find product from context
  const findFromContext = useCallback(
    (searchId) => {
      if (!products || products.length === 0) return null;
      return products.find((p) => String(p.id) === String(searchId)) || null;
    },
    [products]
  );

  const doFetchProduct = useCallback(
    async (productId) => {
      setLoading(true);
      setError(null);
      setProduct(null);

      // If LOGIN_API_BASE is not set, skip API fetch and fallback directly
      const base = (LOGIN_API_BASE || "").replace(/\/+$/, "");
      if (!base) {
        const ctx = findFromContext(productId);
        if (ctx) {
          setProduct(ctx);
          setLoading(false);
          return;
        } else {
          setError("Product not found (no API base configured).");
          setLoading(false);
          return;
        }
      }

      // Grab token from localStorage (if available)
      let token = null;
      try {
        if (typeof window !== "undefined") {
          token = localStorage.getItem("token") || null;
        }
      } catch (err) {
        // localStorage may be blocked — we'll ignore and continue without token
        token = null;
      }

      const url = `/admin/products/show/${encodeURIComponent(String(productId))}`;

      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await apiAxios.get(url, { headers });
        const json = res.data;

        // At this point we have ok response; the API returns data shape you showed
        // Example: { status: true, data: { ...product fields... } }
        const apiProduct = json?.data ?? null;
        if (!apiProduct) {
          // fallback to context
          const fallback = findFromContext(productId);
          if (fallback) {
            setProduct(fallback);
            setLoading(false);
            return;
          }
          // throw new Error("Product data missing in API response");
          throw new Error("Product data missing in API response");
        }
        const normalized = {
          // prefer camelCase keys used in ProductClient if available; fallback to snake_case from API
          id: apiProduct.id ?? apiProduct.product_id ?? null,
          name: apiProduct.name ?? apiProduct.title ?? "",
          price: apiProduct.price ?? apiProduct.price_inr ?? 0,
          discountPrice: apiProduct.discount_price ?? apiProduct.discountPrice ?? null,
          // images: API might have image_url or image or image_url full path
          imageUrl: apiProduct.image_url ?? apiProduct.image_url_full ?? apiProduct.image ?? null,
          images: apiProduct.images ?? (apiProduct.image ? [apiProduct.image] : []),
          stock: apiProduct.stock ?? apiProduct.qty ?? apiProduct.stock_count ?? 0,
          description: apiProduct.description ?? apiProduct.long_description ?? apiProduct.summary ?? "",
          // preserve raw data for debugging
          _raw: apiProduct,
          // include any other properties onto normalized object
          ...apiProduct,
        };
        setProduct(normalized);
        setLoading(false);
      } catch (err) {
        // Network or parse error: try fallback to context
        // Axios wraps errors, so we check err.response for API errors
        const isAuthError = err.response?.status === 401 || err.response?.status === 403;

        // For any error, try to fall back to the context
        const fallback = findFromContext(productId);
        if (fallback) {
          setProduct(fallback);
          setLoading(false);
          return;
        }
        setError(err?.message || String(err));

        // If fallback fails, show the error
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to fetch product.";

        setError(errorMessage);
        setLoading(false);
      }
    },
    [findFromContext]
  );

  useEffect(() => {
    if (!id) {
      setError("No product id provided");
      setLoading(false);
      return;
    }
    // Trigger fetch
    doFetchProduct(id);
  }, [id, doFetchProduct]);

  // Retry handler
  const handleRetry = useCallback(() => {
    if (!id) return;
    setError(null);
    doFetchProduct(id);
  }, [id, doFetchProduct]);

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
