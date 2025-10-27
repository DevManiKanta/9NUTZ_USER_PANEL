// components/ProductDetailClient.jsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useProducts } from "@/contexts/ProductContext";
export default function ProductDetailClient({
  product: productProp = null,
  id = null,
  onAddToCart = null,
}) {
  // read products from ProductContext if present (safe default)
  const productsContext = useProducts?.() || {};
  const products = Array.isArray(productsContext.products) ? productsContext.products : [];

  // resolve product: prefer prop, otherwise lookup by id
  const product = useMemo(() => {
    if (productProp) return productProp;
    if (!id) return null;
    return (
      products.find((p) => {
        if (!p) return false;
        const pid = String(p.id ?? p._id ?? "");
        return pid === String(id) || pid.toLowerCase() === String(id).toLowerCase();
      }) || null
    );
  }, [productProp, id, products]);

  // local quantity state
  const [qty, setQty] = useState(1);

  const qtySafe = Math.max(1, Math.trunc(Number(qty) || 1));

  const handleQtyDecrease = useCallback(() => {
    setQty((q) => Math.max(1, Math.trunc(Number(q || 1)) - 1));
  }, []);

  const handleQtyIncrease = useCallback(() => {
    setQty((q) => Math.max(1, Math.trunc(Number(q || 1)) + 1));
  }, []);

  const handleQtyChange = useCallback((val) => {
    const n = Number(val);
    if (Number.isNaN(n)) return;
    setQty(Math.max(1, Math.trunc(n)));
  }, []);

  // core add to cart logic
  const performAddToCart = useCallback(
    (prod, quantity = 1) => {
      if (!prod) {
        console.warn("performAddToCart: no product provided");
        return;
      }

      // stock guard
      const stockVal = Number(prod.stock != null ? prod.stock : Infinity);
      if (!Number.isNaN(stockVal) && stockVal <= 0) {
        console.warn("performAddToCart: product out of stock", prod);
        return;
      }

      // attempt to call parent handler in two possible signatures
      if (typeof onAddToCart === "function") {
        try {
          // first try (product, qty)
          onAddToCart(prod, quantity);
        } catch (err1) {
          try {
            // fallback to (product)
            onAddToCart(prod);
          } catch (err2) {
            console.warn("onAddToCart threw errors; falling back to event dispatch", err1, err2);
            try {
              window.dispatchEvent(new CustomEvent("productAddToCart", { detail: { product: prod, quantity } }));
            } catch (err3) {
              console.warn("productAddToCart dispatch failed", err3);
            }
          }
        }
      } else {
        // fallback event dispatch — Home listens for this
        try {
          window.dispatchEvent(new CustomEvent("productAddToCart", { detail: { product: prod, quantity } }));
        } catch (err) {
          console.warn("productAddToCart dispatch failed", err);
        }
      }

      // open cart UI
      try {
        window.dispatchEvent(new CustomEvent("openCart"));
      } catch (err) {
        // ignore
      }
    },
    [onAddToCart]
  );

  const handleAdd = useCallback(() => {
    if (!product) return;
    performAddToCart(product, qtySafe);
    setQty(1);
  }, [product, qtySafe, performAddToCart]);

  if (!product) {
    return (
      <div className="rounded-xl bg-white shadow p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Product not available</h2>
        <p className="text-sm text-gray-600">
          We couldn't find the product details. Try again or open the product page.
        </p>
      </div>
    );
  }

  const imgSrc =
    product.imageUrl ||
    (Array.isArray(product.images) && product.images[0]) ||
    product.image ||
    "/placeholder-1200x800.png";

  const title = product.name || product.title || product.productName || `Product ${product.id ?? id}`;
  const description = product.description || product.short_description || product.summary || "";
  const price = Number(product.price ?? product.price_in_cents ?? product.amount ?? 0);
  const outOfStock = Number(product.stock != null ? product.stock : Infinity) <= 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* IMAGE */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm rounded-lg overflow-hidden bg-gray-50">
            <img
              src={imgSrc}
              alt={title}
              onError={(e) => {
                try {
                  e.currentTarget.src = "/placeholder-1200x800.png";
                } catch {}
              }}
              className="w-full h-[260px] md:h-[320px] object-contain p-4"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          {description ? <p className="text-gray-600 mb-4 leading-relaxed">{description}</p> : null}

          <div className="flex items-center gap-4 mb-4">
            <div className="text-2xl font-semibold text-green-700">
              ₹{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-500">
              {outOfStock ? "Out of stock" : `${product.stock ?? "—"} in stock`}
            </div>
          </div>

          {/* Quantity + Add button */}
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={handleQtyDecrease}
                className="px-3 py-2 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                aria-label="Quantity"
                className="w-14 text-center py-2 outline-none"
                value={qty}
                onChange={(e) => handleQtyChange(e.target.value)}
                inputMode="numeric"
              />
              <button
                type="button"
                onClick={handleQtyIncrease}
                className="px-3 py-2 hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div>
              {!outOfStock ? (
                <button
                  onClick={handleAdd}
                  className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                >
                  Add to carts
                </button>
              ) : (
                <div className="px-4 py-2 rounded-md bg-gray-100 text-gray-500">Out of stock</div>
              )}
            </div>
          </div>
           <div>Hello</div>
          {/* meta / details */}
          <div className="pt-4 border-t border-gray-100 text-sm text-gray-700">
            <div className="flex gap-2 mb-2">
              <div className="font-medium w-36">Product ID:</div>
              <div>{String(product.id ?? product._id ?? id ?? "")}</div>
            </div>

            {product.brand && (
              <div className="flex gap-2 mb-2">
                <div className="font-medium w-36">Brand:</div>
                <div>{product.brand}</div>
              </div>
            )}

            {product.sku && (
              <div className="flex gap-2 mb-2">
                <div className="font-medium w-36">SKU:</div>
                <div>{product.sku}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
