// // app/product/[id]/ProductClient.jsx
// "use client";

// import React, { useMemo, useCallback, useState } from "react";
// import { useProducts } from "@/contexts/ProductContext";
// import { useCart } from "@/contexts/CartContext";
// import Header from "@/components/Header";
// import { Head } from "next/document";

// export default function ProductClient({ id, onAddToCart: externalAddToCart }) {
//   const { products } = useProducts?.() || { products: [] };
//   const { addToCart, openCart } = useCart();

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

//   // change quantity helper
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

//   // The corrected add-to-cart handler: uses CartContext.addToCart when available,
//   // falls back to externalAddToCart or event dispatch, then opens cart UI.
//   const handleAddToCart = useCallback(
//     (productToAdd) => {
//       // guard for stock: if stock is 0 or negative, do nothing
//       const stockVal = Number(
//         productToAdd && productToAdd.stock != null ? productToAdd.stock : Infinity
//       );
//       if (!isNaN(stockVal) && stockVal <= 0) return;

//       const qty = Math.max(1, qtyOf(productToAdd && (productToAdd.id ?? productToAdd._id)));

//       // Prefer CartContext.addToCart if available
//       if (typeof addToCart === "function") {
//         // add once with quantity param if your addToCart supports qty
//         try {
//           addToCart(productToAdd, qty);
//         } catch (err) {
//           // fallback to looped dispatch if provider addToCart fails
//           for (let i = 0; i < qty; i++) {
//             if (typeof externalAddToCart === "function") {
//               externalAddToCart(productToAdd);
//             } else {
//               try {
//                 window.dispatchEvent(new CustomEvent("productAddToCart", { detail: { product: productToAdd } }));
//               } catch {}
//             }
//           }
//         }
//       } else {
//         // no CartContext: fall back to externalAddToCart or event dispatch
//         for (let i = 0; i < qty; i++) {
//           if (typeof externalAddToCart === "function") {
//             externalAddToCart(productToAdd);
//           } else {
//             try {
//               window.dispatchEvent(new CustomEvent("productAddToCart", { detail: { product: productToAdd } }));
//             } catch (err) {
//               // eslint-disable-next-line no-console
//               console.warn("Dispatch productAddToCart failed", err);
//             }
//           }
//         }
//       }

//       // Open the cart UI if available; otherwise dispatch an event
//       if (typeof openCart === "function") {
//         try {
//           openCart();
//         } catch (err) {
//           try {
//             window.dispatchEvent(new CustomEvent("openCart"));
//           } catch {}
//         }
//       } else {
//         try {
//           window.dispatchEvent(new CustomEvent("openCart"));
//         } catch {}
//       }

//       // reset qty for that product back to 0
//       setQuantities((prev) => {
//         const copy = { ...prev };
//         const key = String(productToAdd && (productToAdd.id ?? productToAdd._id) ? (productToAdd.id ?? productToAdd._id) : "");
//         delete copy[key];
//         return copy;
//       });
//     },
//     [addToCart, openCart, externalAddToCart, qtyOf]
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
//     <>
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
//             <h2 className="text-lg font-semibold mb-3">Product Details</h2>
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
//     </>
//   );
// }


// app/product/[id]/ProductClient.jsx
"use client";

import React, { useMemo, useCallback, useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";

export default function ProductClient({ id, onAddToCart: externalAddToCart }) {
  // safe product context read
  const { products } = (useProducts && useProducts()) || { products: [] };

  // Use CartContext directly
  const cartCtx = useCart();
  const ctxAddItem = cartCtx?.addItem;

  // Debug logging
  console.log("ProductClient Debug:", {
    id,
    productsCount: products?.length || 0,
    cartCtxAvailable: !!cartCtx,
    addItemAvailable: !!ctxAddItem
  });

  // Local quantities state (so this component can support the add-to-cart loop logic)
  const [quantities, setQuantities] = useState({});

  // Helper to get integer qty for a product id
  const qtyOf = useCallback(
    (productId) => {
      const key = String(productId ?? "");
      return Math.max(0, Math.trunc(quantities[key] ?? 0));
    },
    [quantities]
  );

  // change quantity helper (used by +/- buttons)
  const handleQuantityChange = useCallback((productId, newQuantity) => {
    if (newQuantity < 0) return;
    const key = String(productId);
    setQuantities((prev) => ({ ...prev, [key]: Math.trunc(newQuantity) }));
  }, []);

  // Find product by id (robust against id/_id)
  const product = useMemo(() => {
    if (!Array.isArray(products)) return null;
    return products.find(
      (p) =>
        p &&
        String(p.id ?? p._id ?? p._id_str ?? "").toLowerCase() ===
          String(id ?? "").toLowerCase()
    );
  }, [products, id]);

  // Unified add-to-cart helper: prefer context, then external prop, then event dispatch
  const callAddToCart = useCallback(
    (productToAdd, qty = 1) => {
      // qty should be positive integer
      const finalQty = Math.max(1, Math.trunc(qty || 1));

      console.log("callAddToCart called:", { productToAdd, finalQty, ctxAddItemAvailable: !!ctxAddItem });

      // 1) Try context addItem (if available)
      if (ctxAddItem) {
        try {
          // call with qty — many implementations accept (product, qty)
          const itemToAdd = { ...productToAdd, quantity: finalQty };
          console.log("Adding to cart via CartContext:", itemToAdd);
          ctxAddItem(itemToAdd);
          return;
        } catch (err) {
          // swallow and fall back to other methods
          // eslint-disable-next-line no-console
          console.warn("ctx addItem failed, falling back", err);
        }
      }

      // 2) Try external prop handler (onAddToCart)
      if (typeof externalAddToCart === "function") {
        try {
          // try single call with qty — if external expects just product, it may ignore second arg
          externalAddToCart(productToAdd, finalQty);
          return;
        } catch (err) {
          // if it fails, we'll fallback to event-loop calls
          // eslint-disable-next-line no-console
          console.warn("externalAddToCart failed, falling back", err);
        }
      }

      // 3) Last resort: dispatch productAddToCart events (Home listens for this)
      try {
        for (let i = 0; i < finalQty; i++) {
          window.dispatchEvent(
            new CustomEvent("productAddToCart", {
              detail: { product: productToAdd },
            })
          );
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("productAddToCart dispatch failed", err);
      }
    },
    [ctxAddItem, externalAddToCart]
  );

  // Unified open-cart helper: dispatch event
  const callOpenCart = useCallback(() => {
    try {
      window.dispatchEvent(new CustomEvent("openCart"));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("openCart dispatch failed", err);
    }
  }, []);

  // The corrected add-to-cart handler uses the unified helpers
  const handleAddToCart = useCallback(
    (productToAdd) => {
      console.log("handleAddToCart called with:", productToAdd);
      
      if (!productToAdd) {
        console.log("No product provided to handleAddToCart");
        return;
      }

      // guard for stock: if stock is 0 or negative, do nothing
      const stockVal = Number(
        productToAdd && productToAdd.stock != null ? productToAdd.stock : Infinity
      );
      if (!isNaN(stockVal) && stockVal <= 0) {
        console.log("Product out of stock:", stockVal);
        return;
      }

      // compute qty using id (prefer id/_id)
      const idForQty = productToAdd && (productToAdd.id ?? productToAdd._id);
      const qty = Math.max(1, qtyOf(idForQty));

      console.log("About to add to cart:", { productToAdd, qty });

      // call unified add-to-cart (handles context/prop/event fallbacks)
      callAddToCart(productToAdd, qty);

      // open the cart UI (context or event)
      callOpenCart();

      // reset qty for that product back to 0 in local quantities state
      setQuantities((prev) => {
        const copy = { ...prev };
        const key = String(idForQty ?? "");
        delete copy[key];
        return copy;
      });
    },
    [qtyOf, callAddToCart, callOpenCart]
  );

  // Small fallback UI if product not found in context
  if (!product) {
    return (
      <div className="rounded-xl bg-white shadow p-8 text-center">
        <h1 className="text-2xl font-semibold mb-2">Product not found</h1>
        <p className="text-gray-600 mb-4">
          We couldn't find the product with id <strong>{id}</strong>.
        </p>
        <p className="text-sm text-gray-500">
          Consider fetching the product from your API here or pass an `onAddToCart` handler from the parent.
        </p>
      </div>
    );
  }

  // Image and content values
  const imgSrc =
    product.imageUrl ||
    (Array.isArray(product.images) && product.images[0]) ||
    product.image ||
    "/placeholder-1200x800.png";

  const title =
    product.name || product.title || product.productName || `Product ${id}`;
  const description =
    product.description || product.short_description || product.summary || "";
  const price = Number(product.price ?? product.price_in_cents ?? product.amount ?? 0);

  // Current quantity for this product (use id or _id)
  const productKey = String(product.id ?? product._id ?? id ?? "");
  const currentQuantity = qtyOf(productKey);

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-lg p-6 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* LEFT: IMAGE */}
        <div className="w-full flex justify-center">
          <div className="relative rounded-xl overflow-hidden bg-gray-50 shadow-md w-full max-w-md">
            <img
              src={imgSrc}
              alt={title}
              onError={(e) => {
                try {
                  e.currentTarget.src = "/placeholder-1200x800.png";
                } catch {}
              }}
              className="w-full h-[300px] md:h-[400px] object-contain p-4 transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="flex flex-col justify-start">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-3 text-gray-900">
            {title}
          </h1>

          {description && (
            <p className="text-gray-600 mb-5 leading-relaxed">{description}</p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="text-3xl font-semibold text-green-700">
              ₹{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>

            {/* Add / quantity controls */}
            {Number(product.stock != null ? product.stock : Infinity) <= 0 ? (
              <div className="px-4 py-2 rounded-md bg-gray-100 text-gray-500">Out of stock</div>
            ) : currentQuantity <= 0 ? (
              <button
                type="button"
                onClick={() => handleAddToCart(product)}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Add to cart
              </button>
            ) : (
              <div className="inline-flex items-center bg-green-600 text-white rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(productKey, Math.max(0, currentQuantity - 1))}
                  className="p-2"
                  aria-label="decrease quantity"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <rect x="4" y="9" width="12" height="2" rx="1" />
                  </svg>
                </button>
                <span className="px-3 text-sm font-semibold">{currentQuantity}</span>
                <button
                  onClick={() => handleQuantityChange(productKey, currentQuantity + 1)}
                  className="p-2"
                  aria-label="increase quantity"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path d="M10 4c.552 0 1 .448 1 1v4h4c.552 0 1 .448 1 1s-.448 1-1 1h-4v4c0 .552-.448 1-1 1s-1-.448-1-1v-4H5c-.552 0-1-.448-1-1s.448-1 1-1h4V5c0-.552.448-1 1-1z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Extra product details */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-3">Product Details</h2>
            <dl className="space-y-2 text-sm text-gray-700">
              <div className="flex gap-2">
                <dt className="font-medium w-32">Product ID:</dt>
                <dd>{String(product.id ?? product._id ?? "")}</dd>
              </div>

              {product.stock != null && (
                <div className="flex gap-2">
                  <dt className="font-medium w-32">Stock:</dt>
                  <dd>
                    {Number(product.stock) > 0 ? `${product.stock} available` : "Out of stock"}
                  </dd>
                </div>
              )}

              {product.brand && (
                <div className="flex gap-2">
                  <dt className="font-medium w-32">Brand:</dt>
                  <dd>{product.brand}</dd>
                </div>
              )}

              {product.sku && (
                <div className="flex gap-2">
                  <dt className="font-medium w-32">SKU:</dt>
                  <dd>{product.sku}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Long Description */}
          {product.long_description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">More about this product</h3>
              <p className="text-gray-700 leading-relaxed">{product.long_description}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

