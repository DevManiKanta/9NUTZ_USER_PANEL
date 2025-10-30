
// "use client";

// import React, { useMemo, useCallback, useState } from "react";
// import { useProducts } from "@/contexts/ProductContext";
// import { useCart } from "@/contexts/CartContext";

// export default function ProductClient({ id, onAddToCart: externalAddToCart }) {
//   // Read products safely from context
//   const productsCtx = useProducts?.() || {};
//   const products = Array.isArray(productsCtx.products) ? productsCtx.products : [];

//   // Try to read cart context if present
//   const cartCtx = useCart?.();
//   const ctxAddItem = cartCtx?.addItem ?? cartCtx?.addToCart ?? null;
//   const ctxOpenCart = cartCtx?.openCart ?? null;

//   // Local qty state used for the add-to-cart loop logic
//   const [quantities, setQuantities] = useState({});

//   // Helper: quantity for a product id
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

//   // Find product by id robustly
//   const product = useMemo(() => {
//     if (!Array.isArray(products) || products.length === 0) return null;
//     const target = String(id ?? "").toLowerCase();
//     return (
//       products.find((p) => {
//         if (!p) return false;
//         const pid = String(p.id ?? p._id ?? "").toLowerCase();
//         return pid === target;
//       }) || null
//     );
//   }, [products, id]);

//   // Unified add-to-cart routine with fallbacks
//   const callAddToCart = useCallback(
//     (productToAdd, qty = 1) => {
//       if (!productToAdd) return;
//       const finalQty = Math.max(1, Math.trunc(qty || 1));

//       // 1) CartContext (preferred)
//       if (typeof ctxAddItem === "function") {
//         try {
//           // many context APIs accept (product, qty) or product with quantity
//           // provide a product shaped item with quantity
//           const item = { ...productToAdd, quantity: finalQty };
//           ctxAddItem(item);
//           return;
//         } catch (err) {
//           // continue to fallback
//           // eslint-disable-next-line no-console
//           console.warn("CartContext add failed, falling back:", err);
//         }
//       }

//       // 2) external handler prop
//       if (typeof externalAddToCart === "function") {
//         try {
//           externalAddToCart(productToAdd, finalQty);
//           return;
//         } catch (err) {
//           // eslint-disable-next-line no-console
//           console.warn("externalAddToCart threw, falling back:", err);
//         }
//       }

//       // 3) Event dispatch fallback (Home listens)
//       try {
//         window.dispatchEvent(new CustomEvent("productAddToCart", { detail: { product: productToAdd, quantity: finalQty } }));
//       } catch (err) {
//         // eslint-disable-next-line no-console
//         console.warn("productAddToCart dispatch failed", err);
//       }
//     },
//     [ctxAddItem, externalAddToCart]
//   );

//   // Unified open-cart helper
//   const callOpenCart = useCallback(() => {
//     if (typeof ctxOpenCart === "function") {
//       try {
//         ctxOpenCart();
//         return;
//       } catch (err) {
//         // fallback to event
//         // eslint-disable-next-line no-console
//         console.warn("ctxOpenCart threw, falling back to event", err);
//       }
//     }
//     try {
//       window.dispatchEvent(new CustomEvent("openCart"));
//     } catch (err) {
//       // eslint-disable-next-line no-console
//       console.warn("openCart dispatch failed", err);
//     }
//   }, [ctxOpenCart]);

//   // Main handler used by Add button
//   const handleAddToCart = useCallback(
//     (productToAdd) => {
//       if (!productToAdd) return;

//       // guard for stock
//       const stockVal = Number(productToAdd && productToAdd.stock != null ? productToAdd.stock : Infinity);
//       if (!Number.isNaN(stockVal) && stockVal <= 0) return;

//       // determine qty using id/_id
//       const idForQty = productToAdd && (productToAdd.id ?? productToAdd._id);
//       const qty = Math.max(1, qtyOf(idForQty));

//       // perform the add and open cart
//       callAddToCart(productToAdd, qty);
//       callOpenCart();

//       // reset local quantity for product
//       setQuantities((prev) => {
//         const copy = { ...prev };
//         const key = String(idForQty ?? "");
//         delete copy[key];
//         return copy;
//       });
//     },
//     [qtyOf, callAddToCart, callOpenCart]
//   );

//   if (!product) {
//     return (
//       <div className="rounded-xl bg-white shadow p-8 text-center">
//         <h1 className="text-2xl font-semibold mb-2">Product not found</h1>
//         <p className="text-gray-600">We couldn't find the product with id <strong>{id}</strong>.</p>
//       </div>
//     );
//   }

//   // Visual values
//   const img = product.imageUrl || (Array.isArray(product.images) && product.images[0]) || product.image || "/placeholder-1200x800.png";
//   const title = product.name || product.title || product.productName || `Product ${id}`;
//   const desc = product.description || product.short_description || product.summary || "";
//   const price = Number(product.price ?? product.price_in_cents ?? product.amount ?? 0);
//   const productKey = String(product.id ?? product._id ?? id ?? "");
//   const currentQuantity = qtyOf(productKey);
//   const outOfStock = Number(product.stock != null ? product.stock : Infinity) <= 0;

//   return (
//     <article className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,18,25,0.06)] overflow-hidden">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
//         {/* Left: image */}
//     {/* LEFT: IMAGE WITH ADD BUTTON BELOW */}
// <div className="flex flex-col items-center justify-start">
//   <div className="w-full max-w-sm rounded-xl overflow-hidden bg-gray-50 shadow-inner">
//     <img
//       src={img}
//       alt={title}
//       onError={(e) => {
//         try {
//           // e.currentTarget.src = "/placeholder-1200x800.png";
//         } catch {}
//       }}
//       className="w-full h-[320px] md:h-[420px] object-cover block"
//     />
//   </div>

//   {/* Add to Cart Button - now below the image */}
//   {!outOfStock && (
//     <button
//       type="button"
//       onClick={() => handleAddToCart(product)}
//       className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-300"
//       aria-label="Add to cart"
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="w-5 h-5"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.3a1 1 0 001 1.2h12.6a1 1 0 001-1.2L17 13M7 13l4-8m0 0L9 13m2-8h2m2 8l-4-8" />
//       </svg>
//       <span>Add to Cart</span>
//     </button>
//   )}

//   {outOfStock && (
//     <div className="mt-5 px-5 py-2 rounded-md bg-gray-100 text-gray-500 text-sm">
//       Out of stock
//     </div>
//   )}
// </div>


//         {/* Right: details */}
//         <div className="flex flex-col justify-start">
//           <h1 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight text-gray-900">{title}</h1>

//           {desc ? <p className="text-gray-600 mb-6 leading-relaxed">{desc}</p> : null}

//           <div className="flex items-center justify-between md:justify-start md:gap-8 mb-6">
//             <div>
//               <div className="text-3xl font-bold text-green-700">₹{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
//               {product.discountPrice || product.discount_amount ? (
//                 <div className="text-sm text-gray-400 mt-1">Disc: {product.discountPrice ?? product.discount_amount}</div>
//               ) : null}
//             </div>

//             <div className="ml-auto md:ml-0">
//               {outOfStock ? (
//                 <div className="px-4 py-2 rounded-md bg-gray-100 text-gray-500 text-sm">Out of stock</div>
//               ) : currentQuantity <= 0 ? (
//                 <div></div>
//               ) : (
//                 <div className="inline-flex items-center bg-green-600 text-white rounded-lg overflow-hidden">
//                   <button
//                     onClick={() => handleQuantityChange(productKey, Math.max(0, currentQuantity - 1))}
//                     className="p-2"
//                     aria-label="Decrease quantity"
//                   >
//                     <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
//                       <rect x="4" y="9" width="12" height="2" rx="1" />
//                     </svg>
//                   </button>
//                   <span className="px-4 text-sm font-semibold">{currentQuantity}</span>
//                   <button
//                     onClick={() => handleQuantityChange(productKey, currentQuantity + 1)}
//                     className="p-2"
//                     aria-label="Increase quantity"
//                   >
//                     <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
//                       <path d="M10 4c.552 0 1 .448 1 1v4h4c.552 0 1 .448 1 1s-.448 1-1 1h-4v4c0 .552-.448 1-1 1s-1-.448-1-1v-4H5c-.552 0-1-.448-1-1s.448-1 1-1h4V5c0-.552.448-1 1-1z" />
//                     </svg>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="border-t border-gray-100 pt-6">
//             <h2 className="text-lg font-semibold mb-4">Product Details</h2>

//             <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
//               <div className="flex gap-2">
//                 <dt className="font-medium w-28">Product ID:</dt>
//                 <dd>{String(product.id ?? product._id ?? "")}</dd>
//               </div>

//               {product.stock != null && (
//                 <div className="flex gap-2">
//                   <dt className="font-medium w-28">Stock:</dt>
//                   <dd>{Number(product.stock) > 0 ? `${product.stock} available` : "Out of stock"}</dd>
//                 </div>
//               )}

//               {product.brand && (
//                 <div className="flex gap-2">
//                   <dt className="font-medium w-28">Brand:</dt>
//                   <dd>{product.brand}</dd>
//                 </div>
//               )}

//               {product.sku && (
//                 <div className="flex gap-2">
//                   <dt className="font-medium w-28">SKU:</dt>
//                   <dd>{product.sku}</dd>
//                 </div>
//               )}
//             </dl>
//           </div>

//           {/* Long description */}
//           {product.long_description && (
//             <div className="mt-6 text-gray-700 leading-relaxed">
//               <h3 className="text-lg font-semibold mb-2">More about this product</h3>
//               <div>{product.long_description}</div>
//             </div>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }


"use client";

import React, { useCallback, useState } from "react";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function ProductClient({ product }) {
  const { addItem, openCart } = useCart() || {};
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  if (!product) return null;

  const discountPercent =
    product.discountPrice && product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  /** ✅ Add to Cart logic with context + fallback event **/
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
      } finally {
        setTimeout(() => setIsAdding(false), 600);
      }
    },
    [addItem, openCart]
  );

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
      <button
        onClick={() => router.push("/")}
        className="absolute -top-2 left-4 flex items-center gap-2 text-gray-600 hover:text-[#C75B3A] transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Back to Menu</span>
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mt-6">
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-lg bg-gray-50">
            <img
              src={
                product.imageUrl ||
                (Array.isArray(product.images) && product.images[0]) ||
                "/placeholder.png"
              }
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* 🧾 Product Details Section */}
        <div className="flex flex-col gap-6">
          {/* Product Name */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
              ))}
              <span className="text-sm text-gray-500 ml-1">(4.9 / 120 reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#C75B3A]">
                Rs.{product.discountPrice || product.price}
              </span>
              {discountPercent > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  Rs.{product.price}
                </span>
              )}
            </div>
            <p className="mt-2 text-gray-500 text-sm">
              Inclusive of all taxes. Free delivery on orders above ₹499.
            </p>
          </div>

          {/* Stock Status */}
          {Number(product.stock ?? 0) > 0 ? (
            <p className="text-green-600 font-semibold">In Stock</p>
          ) : (
            <p className="text-red-500 font-semibold">Out of Stock</p>
          )}

          {/* Description */}
          <div className="text-gray-700 text-base leading-relaxed">
            {product.description || "No description available."}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={() => handleAddToCart(product)}
              disabled={Number(product.stock ?? 0) <= 0 || isAdding}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors duration-200 ${
                Number(product.stock ?? 0) > 0
                  ? "bg-[#C75B3A] text-white hover:bg-[#b14e33]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {isAdding
                ? "Adding..."
                : Number(product.stock ?? 0) > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          </div>

          {/* 🍴 Additional Section */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Product Details
            </h2>

            <ul className="list-disc list-inside text-gray-700 space-y-2 text-base leading-relaxed">
              <li>Made from premium-quality ingredients for authentic taste and freshness.</li>
              <li>Prepared under hygienic conditions following strict food safety standards.</li>
              <li>Free from harmful preservatives, artificial colors, or flavors.</li>
              <li>Perfect for everyday meals, festive occasions, and quick snack cravings.</li>
              <li>Rich in natural flavors, nutrients, and wholesome goodness.</li>
              <li>Packed carefully to preserve freshness and aroma during delivery.</li>
              <li>Ideal for gifting and sharing with family and friends.</li>
              <li>Delivered safely to your doorstep with freshness guaranteed.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}


