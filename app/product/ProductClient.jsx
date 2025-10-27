
// "use client";

// import React, { useMemo, useCallback, useState } from "react";
// import { useProducts } from "@/contexts/ProductContext";
// import { useCart } from "@/contexts/CartContext";

// export default function ProductClient({ id, onAddToCart: externalAddToCart }) {
//   // safe product context read
//   const { products } = (useProducts && useProducts()) || { products: [] };

//   // Use CartContext directly
//   const cartCtx = useCart();
//   const ctxAddItem = cartCtx?.addItem;

//   // Debug logging
//   console.log("ProductClient Debug:", {
//     id,
//     productsCount: products?.length || 0,
//     cartCtxAvailable: !!cartCtx,
//     addItemAvailable: !!ctxAddItem
//   });

//   // Local quantities state (so this component can support the add-to-cart loop logic)
//   const [quantities, setQuantities] = useState({});

//   // Helper to get integer qty for a product id
//   const qtyOf = useCallback(
//     (productId) => {
//       const key = String(productId ?? "");
//       return Math.max(0, Math.trunc(quantities[key] ?? 0));
//     },
//     [quantities]
//   );

//   // change quantity helper (used by +/- buttons)
//   const handleQuantityChange = useCallback((productId, newQuantity) => {
//     if (newQuantity < 0) return;
//     const key = String(productId);
//     setQuantities((prev) => ({ ...prev, [key]: Math.trunc(newQuantity) }));
//   }, []);

//   // Find product by id (robust against id/_id)
//   const product = useMemo(() => {
//     if (!Array.isArray(products)) return null;
//     return products.find(
//       (p) =>
//         p &&
//         String(p.id ?? p._id ?? p._id_str ?? "").toLowerCase() ===
//           String(id ?? "").toLowerCase()
//     );
//   }, [products, id]);

//   // Unified add-to-cart helper: prefer context, then external prop, then event dispatch
//   const callAddToCart = useCallback(
//     (productToAdd, qty = 1) => {
//       // qty should be positive integer
//       const finalQty = Math.max(1, Math.trunc(qty || 1));

//       console.log("callAddToCart called:", { productToAdd, finalQty, ctxAddItemAvailable: !!ctxAddItem });

//       // 1) Try context addItem (if available)
//       if (ctxAddItem) {
//         try {
//           // call with qty — many implementations accept (product, qty)
//           const itemToAdd = { ...productToAdd, quantity: finalQty };
//           console.log("Adding to cart via CartContext:", itemToAdd);
//           ctxAddItem(itemToAdd);
//           return;
//         } catch (err) {
//           // swallow and fall back to other methods
//           // eslint-disable-next-line no-console
//           console.warn("ctx addItem failed, falling back", err);
//         }
//       }

//       // 2) Try external prop handler (onAddToCart)
//       if (typeof externalAddToCart === "function") {
//         try {
//           // try single call with qty — if external expects just product, it may ignore second arg
//           externalAddToCart(productToAdd, finalQty);
//           return;
//         } catch (err) {
//           // if it fails, we'll fallback to event-loop calls
//           // eslint-disable-next-line no-console
//           console.warn("externalAddToCart failed, falling back", err);
//         }
//       }

//       // 3) Last resort: dispatch productAddToCart events (Home listens for this)
//       try {
//         for (let i = 0; i < finalQty; i++) {
//           window.dispatchEvent(
//             new CustomEvent("productAddToCart", {
//               detail: { product: productToAdd },
//             })
//           );
//         }
//       } catch (err) {
//         // eslint-disable-next-line no-console
//         console.warn("productAddToCart dispatch failed", err);
//       }
//     },
//     [ctxAddItem, externalAddToCart]
//   );

//   // Unified open-cart helper: dispatch event
//   const callOpenCart = useCallback(() => {
//     try {
//       window.dispatchEvent(new CustomEvent("openCart"));
//     } catch (err) {
//       // eslint-disable-next-line no-console
//       console.warn("openCart dispatch failed", err);
//     }
//   }, []);

//   // The corrected add-to-cart handler uses the unified helpers
//   const handleAddToCart = useCallback(
//     (productToAdd) => {
//       console.log("handleAddToCart called with:", productToAdd);
      
//       if (!productToAdd) {
//         console.log("No product provided to handleAddToCart");
//         return;
//       }

//       // guard for stock: if stock is 0 or negative, do nothing
//       const stockVal = Number(
//         productToAdd && productToAdd.stock != null ? productToAdd.stock : Infinity
//       );
//       if (!isNaN(stockVal) && stockVal <= 0) {
//         console.log("Product out of stock:", stockVal);
//         return;
//       }

//       // compute qty using id (prefer id/_id)
//       const idForQty = productToAdd && (productToAdd.id ?? productToAdd._id);
//       const qty = Math.max(1, qtyOf(idForQty));

//       console.log("About to add to cart:", { productToAdd, qty });

//       // call unified add-to-cart (handles context/prop/event fallbacks)
//       callAddToCart(productToAdd, qty);

//       // open the cart UI (context or event)
//       callOpenCart();

//       // reset qty for that product back to 0 in local quantities state
//       setQuantities((prev) => {
//         const copy = { ...prev };
//         const key = String(idForQty ?? "");
//         delete copy[key];
//         return copy;
//       });
//     },
//     [qtyOf, callAddToCart, callOpenCart]
//   );

//   // Small fallback UI if product not found in context
//   if (!product) {
//     return (
//       <div className="rounded-xl bg-white shadow p-8 text-center">
//         <h1 className="text-2xl font-semibold mb-2">Product not found</h1>
//         <p className="text-gray-600 mb-4">
//           We couldn't find the product with id <strong>{id}</strong>.
//         </p>
//         <p className="text-sm text-gray-500">
//           Consider fetching the product from your API here or pass an `onAddToCart` handler from the parent.
//         </p>
//       </div>
//     );
//   }

//   // Image and content values
//   const imgSrc =
//     product.imageUrl ||
//     (Array.isArray(product.images) && product.images[0]) ||
//     product.image ||
//     "/placeholder-1200x800.png";

//   const title =
//     product.name || product.title || product.productName || `Product ${id}`;
//   const description =
//     product.description || product.short_description || product.summary || "";
//   const price = Number(product.price ?? product.price_in_cents ?? product.amount ?? 0);

//   // Current quantity for this product (use id or _id)
//   const productKey = String(product.id ?? product._id ?? id ?? "");
//   const currentQuantity = qtyOf(productKey);

//   return (
//     <article className="bg-white rounded-xl overflow-hidden shadow-lg p-6 md:p-10">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
//         {/* LEFT: IMAGE */}
//         <div className="w-full flex justify-center">
//           <div className="relative rounded-xl overflow-hidden bg-gray-50 shadow-md w-full max-w-md">
//             <img
//               src={imgSrc}
//               alt={title}
//               onError={(e) => {
//                 try {
//                   e.currentTarget.src = "/placeholder-1200x800.png";
//                 } catch {}
//               }}
//               className="w-full h-[300px] md:h-[400px] object-contain p-4 transition-transform duration-300 hover:scale-105"
//             />
//           </div>
//         </div>

//         {/* RIGHT: DETAILS */}
//         <div className="flex flex-col justify-start">
//           <h1 className="text-2xl md:text-3xl font-extrabold mb-3 text-gray-900">
//             {title}
//           </h1>

//           {description && (
//             <p className="text-gray-600 mb-5 leading-relaxed">{description}</p>
//           )}

//           <div className="flex items-center gap-4 mb-6">
//             <div className="text-3xl font-semibold text-green-700">
//               ₹{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
//             </div>

//             {/* Add / quantity controls */}
//             {Number(product.stock != null ? product.stock : Infinity) <= 0 ? (
//               <div className="px-4 py-2 rounded-md bg-gray-100 text-gray-500">Out of stock</div>
//             ) : currentQuantity <= 0 ? (
//               <button
//                 type="button"
//                 onClick={() => handleAddToCart(product)}
//                 className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-300"
//               >
//                 Add to cart
//               </button>
//             ) : (
//               <div className="inline-flex items-center bg-green-600 text-white rounded-lg overflow-hidden">
//                 <button
//                   onClick={() => handleQuantityChange(productKey, Math.max(0, currentQuantity - 1))}
//                   className="p-2"
//                   aria-label="decrease quantity"
//                 >
//                   <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
//                     <rect x="4" y="9" width="12" height="2" rx="1" />
//                   </svg>
//                 </button>
//                 <span className="px-3 text-sm font-semibold">{currentQuantity}</span>
//                 <button
//                   onClick={() => handleQuantityChange(productKey, currentQuantity + 1)}
//                   className="p-2"
//                   aria-label="increase quantity"
//                 >
//                   <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
//                     <path d="M10 4c.552 0 1 .448 1 1v4h4c.552 0 1 .448 1 1s-.448 1-1 1h-4v4c0 .552-.448 1-1 1s-1-.448-1-1v-4H5c-.552 0-1-.448-1-1s.448-1 1-1h4V5c0-.552.448-1 1-1z" />
//                   </svg>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Extra product details */}
//           <div className="border-t border-gray-200 pt-6">
//             <h2 className="text-lg font-semibold mb-3">Product Detailss</h2>
//             <dl className="space-y-2 text-sm text-gray-700">
//               <div className="flex gap-2">
//                 <dt className="font-medium w-32">Product ID:</dt>
//                 <dd>{String(product.id ?? product._id ?? "")}</dd>
//               </div>

//               {product.stock != null && (
//                 <div className="flex gap-2">
//                   <dt className="font-medium w-32">Stock:</dt>
//                   <dd>
//                     {Number(product.stock) > 0 ? `${product.stock} available` : "Out of stock"}
//                   </dd>
//                 </div>
//               )}

//               {product.brand && (
//                 <div className="flex gap-2">
//                   <dt className="font-medium w-32">Brand:</dt>
//                   <dd>{product.brand}</dd>
//                 </div>
//               )}

//               {product.sku && (
//                 <div className="flex gap-2">
//                   <dt className="font-medium w-32">SKU:</dt>
//                   <dd>{product.sku}</dd>
//                 </div>
//               )}
//             </dl>
//           </div>

//           {/* Long Description */}
//           {product.long_description && (
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold mb-2">More about this product</h3>
//               <p className="text-gray-700 leading-relaxed">{product.long_description}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }

// app/product/ProductClient.jsx
"use client";

import React, { useMemo, useCallback, useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";

/**
 * ProductClient
 *
 * Props:
 *  - id: string (product id from the route)
 *  - onAddToCart?: function(product, qty) - optional external handler
 *
 * Behavior:
 *  - Reads product from ProductContext (useProducts).
 *  - Tries CartContext.addItem first (if present).
 *  - Falls back to external onAddToCart prop.
 *  - Last fallback: dispatches "productAddToCart" events that Home listens to.
 *  - After adding, dispatches "openCart" event (or relies on CartContext if it exposes open)
 *
 * Layout:
 *  - Responsive: side-by-side on lg+, stacked on smaller screens.
 *  - Smaller image (keeps aspect), neat spacing, accessible controls.
 */
export default function ProductClient({ id, onAddToCart: externalAddToCart }) {
  // Read products safely from context
  const productsCtx = useProducts?.() || {};
  const products = Array.isArray(productsCtx.products) ? productsCtx.products : [];

  // Try to read cart context if present
  const cartCtx = useCart?.();
  const ctxAddItem = cartCtx?.addItem ?? cartCtx?.addToCart ?? null;
  const ctxOpenCart = cartCtx?.openCart ?? null;

  // Local qty state used for the add-to-cart loop logic
  const [quantities, setQuantities] = useState({});

  // Helper: quantity for a product id
  const qtyOf = useCallback(
    (productId) => {
      const key = String(productId ?? "");
      return Math.max(0, Math.trunc(quantities[key] ?? 0));
    },
    [quantities]
  );

  // change quantity helper
  const handleQuantityChange = useCallback((productId, newQuantity) => {
    if (newQuantity < 0) return;
    const key = String(productId);
    setQuantities((prev) => ({ ...prev, [key]: Math.trunc(newQuantity) }));
  }, []);

  // Find product by id robustly
  const product = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return null;
    const target = String(id ?? "").toLowerCase();
    return (
      products.find((p) => {
        if (!p) return false;
        const pid = String(p.id ?? p._id ?? "").toLowerCase();
        return pid === target;
      }) || null
    );
  }, [products, id]);

  // Unified add-to-cart routine with fallbacks
  const callAddToCart = useCallback(
    (productToAdd, qty = 1) => {
      if (!productToAdd) return;
      const finalQty = Math.max(1, Math.trunc(qty || 1));

      // 1) CartContext (preferred)
      if (typeof ctxAddItem === "function") {
        try {
          // many context APIs accept (product, qty) or product with quantity
          // provide a product shaped item with quantity
          const item = { ...productToAdd, quantity: finalQty };
          ctxAddItem(item);
          return;
        } catch (err) {
          // continue to fallback
          // eslint-disable-next-line no-console
          console.warn("CartContext add failed, falling back:", err);
        }
      }

      // 2) external handler prop
      if (typeof externalAddToCart === "function") {
        try {
          externalAddToCart(productToAdd, finalQty);
          return;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("externalAddToCart threw, falling back:", err);
        }
      }

      // 3) Event dispatch fallback (Home listens)
      try {
        window.dispatchEvent(new CustomEvent("productAddToCart", { detail: { product: productToAdd, quantity: finalQty } }));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("productAddToCart dispatch failed", err);
      }
    },
    [ctxAddItem, externalAddToCart]
  );

  // Unified open-cart helper
  const callOpenCart = useCallback(() => {
    if (typeof ctxOpenCart === "function") {
      try {
        ctxOpenCart();
        return;
      } catch (err) {
        // fallback to event
        // eslint-disable-next-line no-console
        console.warn("ctxOpenCart threw, falling back to event", err);
      }
    }
    try {
      window.dispatchEvent(new CustomEvent("openCart"));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("openCart dispatch failed", err);
    }
  }, [ctxOpenCart]);

  // Main handler used by Add button
  const handleAddToCart = useCallback(
    (productToAdd) => {
      if (!productToAdd) return;

      // guard for stock
      const stockVal = Number(productToAdd && productToAdd.stock != null ? productToAdd.stock : Infinity);
      if (!Number.isNaN(stockVal) && stockVal <= 0) return;

      // determine qty using id/_id
      const idForQty = productToAdd && (productToAdd.id ?? productToAdd._id);
      const qty = Math.max(1, qtyOf(idForQty));

      // perform the add and open cart
      callAddToCart(productToAdd, qty);
      callOpenCart();

      // reset local quantity for product
      setQuantities((prev) => {
        const copy = { ...prev };
        const key = String(idForQty ?? "");
        delete copy[key];
        return copy;
      });
    },
    [qtyOf, callAddToCart, callOpenCart]
  );

  if (!product) {
    return (
      <div className="rounded-xl bg-white shadow p-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">Product not found</h1>
        <p className="text-gray-600">We couldn't find the product with id <strong>{id}</strong>.</p>
      </div>
    );
  }

  // Visual values
  const img = product.imageUrl || (Array.isArray(product.images) && product.images[0]) || product.image || "/placeholder-1200x800.png";
  const title = product.name || product.title || product.productName || `Product ${id}`;
  const desc = product.description || product.short_description || product.summary || "";
  const price = Number(product.price ?? product.price_in_cents ?? product.amount ?? 0);
  const productKey = String(product.id ?? product._id ?? id ?? "");
  const currentQuantity = qtyOf(productKey);
  const outOfStock = Number(product.stock != null ? product.stock : Infinity) <= 0;

  return (
    <article className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,18,25,0.06)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
        {/* Left: image */}
    {/* LEFT: IMAGE WITH ADD BUTTON BELOW */}
<div className="flex flex-col items-center justify-start">
  <div className="w-full max-w-sm rounded-xl overflow-hidden bg-gray-50 shadow-inner">
    <img
      src={img}
      alt={title}
      onError={(e) => {
        try {
          e.currentTarget.src = "/placeholder-1200x800.png";
        } catch {}
      }}
      className="w-full h-[320px] md:h-[420px] object-cover block"
    />
  </div>

  {/* Add to Cart Button - now below the image */}
  {!outOfStock && (
    <button
      type="button"
      onClick={() => handleAddToCart(product)}
      className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-300"
      aria-label="Add to cart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.3a1 1 0 001 1.2h12.6a1 1 0 001-1.2L17 13M7 13l4-8m0 0L9 13m2-8h2m2 8l-4-8" />
      </svg>
      <span>Add to Cart</span>
    </button>
  )}

  {outOfStock && (
    <div className="mt-5 px-5 py-2 rounded-md bg-gray-100 text-gray-500 text-sm">
      Out of stock
    </div>
  )}
</div>


        {/* Right: details */}
        <div className="flex flex-col justify-start">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight text-gray-900">{title}</h1>

          {desc ? <p className="text-gray-600 mb-6 leading-relaxed">{desc}</p> : null}

          <div className="flex items-center justify-between md:justify-start md:gap-8 mb-6">
            <div>
              <div className="text-3xl font-bold text-green-700">₹{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              {product.discountPrice || product.discount_amount ? (
                <div className="text-sm text-gray-400 mt-1">Disc: {product.discountPrice ?? product.discount_amount}</div>
              ) : null}
            </div>

            <div className="ml-auto md:ml-0">
              {outOfStock ? (
                <div className="px-4 py-2 rounded-md bg-gray-100 text-gray-500 text-sm">Out of stock</div>
              ) : currentQuantity <= 0 ? (
                <div></div>
              ) : (
                <div className="inline-flex items-center bg-green-600 text-white rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(productKey, Math.max(0, currentQuantity - 1))}
                    className="p-2"
                    aria-label="Decrease quantity"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <rect x="4" y="9" width="12" height="2" rx="1" />
                    </svg>
                  </button>
                  <span className="px-4 text-sm font-semibold">{currentQuantity}</span>
                  <button
                    onClick={() => handleQuantityChange(productKey, currentQuantity + 1)}
                    className="p-2"
                    aria-label="Increase quantity"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path d="M10 4c.552 0 1 .448 1 1v4h4c.552 0 1 .448 1 1s-.448 1-1 1h-4v4c0 .552-.448 1-1 1s-1-.448-1-1v-4H5c-.552 0-1-.448-1-1s.448-1 1-1h4V5c0-.552.448-1 1-1z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold mb-4">Product Details</h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
              <div className="flex gap-2">
                <dt className="font-medium w-28">Product ID:</dt>
                <dd>{String(product.id ?? product._id ?? "")}</dd>
              </div>

              {product.stock != null && (
                <div className="flex gap-2">
                  <dt className="font-medium w-28">Stock:</dt>
                  <dd>{Number(product.stock) > 0 ? `${product.stock} available` : "Out of stock"}</dd>
                </div>
              )}

              {product.brand && (
                <div className="flex gap-2">
                  <dt className="font-medium w-28">Brand:</dt>
                  <dd>{product.brand}</dd>
                </div>
              )}

              {product.sku && (
                <div className="flex gap-2">
                  <dt className="font-medium w-28">SKU:</dt>
                  <dd>{product.sku}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Long description */}
          {product.long_description && (
            <div className="mt-6 text-gray-700 leading-relaxed">
              <h3 className="text-lg font-semibold mb-2">More about this product</h3>
              <div>{product.long_description}</div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
