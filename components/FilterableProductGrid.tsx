
// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { Plus, Minus, Star, Heart } from "lucide-react";
// import { useProducts, Product as NormalizedProduct } from "@/contexts/ProductContext";

// interface ProductGridProps {
//   onAddToCart: (product: NormalizedProduct) => void;
//   selectedCategory?: string; // kept for compatibility but ignored (show all)
//   isAnimating?: boolean;
// }

// export default function FilterableProductGrid({
//   onAddToCart,
//   selectedCategory, // ignored
//   isAnimating = false
// }: ProductGridProps) {
//   const [quantities, setQuantities] = useState<Record<string, number>>({});
//   const [displayedProducts, setDisplayedProducts] = useState<NormalizedProduct[]>([]);

//   // pull products from provider - show all products
//   const { products } = useProducts();

//   const updateDisplayedProducts = useCallback(() => {
//     setDisplayedProducts(Array.isArray(products) ? products : []);
//   }, [products]);

//   useEffect(() => {
//     updateDisplayedProducts();
//   }, [updateDisplayedProducts]);

//   // listen to external updates
//   useEffect(() => {
//     const handler = () => updateDisplayedProducts();
//     window.addEventListener("productsUpdated", handler);
//     return () => window.removeEventListener("productsUpdated", handler);
//   }, [updateDisplayedProducts]);

//   const qtyOf = (id: string) => Math.max(0, Math.trunc(quantities[id] ?? 0));

//   const handleQuantityChange = (productId: string, newQuantity: number) => {
//     if (newQuantity < 0) return;
//     setQuantities(prev => ({ ...prev, [productId]: Math.trunc(newQuantity) }));
//   };

//   const handleAddToCart = (product: NormalizedProduct) => {
//     if (product.stock <= 0) return;
//     const qty = Math.max(1, qtyOf(product.id));
//     // call handler qty times to preserve existing contract
//     for (let i = 0; i < qty; i++) onAddToCart(product);
//     setQuantities(prev => ({ ...prev, [product.id]: 0 }));
//   };

//   const formatPrice = (n: number) => {
//     // show two decimals like screenshot
//     return n.toFixed(2);
//   };

//   const computeDisplayPrice = (p: NormalizedProduct) => {
//     if (typeof p.discountPrice === "number" && p.discountPrice > 0) return p.discountPrice;
//     if (typeof p.discountAmount === "number" && p.discountAmount > 0) return Math.max(0, p.price - p.discountAmount);
//     return p.price;
//   };

//   const computeDiscountPercent = (p: NormalizedProduct) => {
//     const original = p.price || 0;
//     const shown = computeDisplayPrice(p);
//     if (!original || original <= 0 || shown >= original) return 0;
//     return Math.round(((original - shown) / original) * 100);
//   };

//   return (
//     <div className="mb-12">
//       {/* Grid: responsive to match screenshot proportions */}
//       <div
//         className={`grid gap-6 
//           grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
//           transition-all duration-300 ease-in-out ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
//       >
//         {displayedProducts.map((product, idx) => {
//           const currentQuantity = qtyOf(product.id);
//           const displayPrice = computeDisplayPrice(product);
//           const discountPercent = computeDiscountPercent(product);
//           const outOfStock = product.stock <= 0;

//           // Try to use normalized image fields if present
//           // support .images array, .imageUrl, fallback to /placeholder.png
//           // @ts-ignore
//           const imgFromImages = Array.isArray((product as any).images) && (product as any).images.length ? (product as any).images[0] : null;
//           const imageSrc = (product.imageUrl || imgFromImages) ?? "/placeholder.png";

//           return (
//             <article
//               key={product.id}
//               className="bg-white rounded-2xl shadow-[0_6px_18px_rgba(13,18,25,0.08)] border border-transparent hover:border-gray-100 overflow-hidden flex flex-col"
//               style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}
//             >
//               {/* image area */}
//               <div className="relative p-4">
//                 <div className="rounded-xl overflow-hidden bg-gray-50">
//                   <img
//                     src={imageSrc}
//                     alt={product.name}
//                     onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.png"; }}
//                     className="w-full h-56 object-cover block"
//                   />
//                 </div>

//                 {/* wishlist heart - top right */}
//                 {/* <button
//                   aria-label="Add to wishlist"
//                   className="absolute top-6 right-6 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm hover:scale-105 transition-transform"
//                 >
//                   <Heart className="w-5 h-5 text-gray-700" />
//                 </button> */}
//               </div>

//               {/* body */}
//               <div className="px-5 pb-5 flex-1 flex flex-col">
//                 <h3
//                   className="text-sm font-medium text-gray-900 mb-2 line-clamp-2"
//                   title={product.name}
//                 >
//                   {product.name}
//                 </h3>

//                 {/* rating row */}
//                 <div className="flex items-center gap-1 mb-3">
//                   {/* show 5 small stars filled gold if rating exists; otherwise show empty small outline */}
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Star key={i} className="w-3 h-3 text-yellow-400" />
//                   ))}
//                 </div>

//                 {/* price row */}
//                 <div className="mt-auto">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-2xl font-bold text-gray-900">Rs.{formatPrice(product.price)}</div>
//                       {discountPercent > 0 && (
//                         <div className="text-xs text-gray-400  mt-1">Disc:Rs.{formatPrice(displayPrice)}</div>
//                       )}
//                     </div>

//                     {/* Add / qty controls */}
//                     <div className="flex items-center space-x-2">
//                       {outOfStock ? (
//                         <div className="text-xs px-3 py-2 rounded-md bg-gray-100 text-gray-500">Out of stock</div>
//                       ) : currentQuantity <= 0 ? (
//                         <button
//                           onClick={() => handleAddToCart(product)}
//                           className="inline-flex items-center justify-center px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
//                         >
//                           ADD
//                         </button>
//                       ) : (
//                         <div className="inline-flex items-center bg-green-600 text-white rounded-lg overflow-hidden">
//                           <button
//                             onClick={() => handleQuantityChange(product.id, Math.max(0, currentQuantity - 1))}
//                             className="p-2"
//                             aria-label="decrease quantity"
//                           >
//                             <Minus className="w-4 h-4" />
//                           </button>
//                           <span className="px-3 text-sm font-semibold">{currentQuantity}</span>
//                           <button
//                             onClick={() => handleQuantityChange(product.id, currentQuantity + 1)}
//                             className="p-2"
//                             aria-label="increase quantity"
//                           >
//                             <Plus className="w-4 h-4" />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* optional discount badge bottom-left */}
//                 {discountPercent > 0 && (
//                   <div className="mt-3">
//                   </div>
//                 )}
//               </div>
//             </article>
//           );
//         })}
//       </div>

//       {/* empty state */}
//       {displayedProducts.length === 0 && !isAnimating && (
//         <div className="text-center py-16">
//           <div className="text-gray-400 mb-4">
//             <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 5 9 3" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//           <p className="text-gray-500">Try again later.</p>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Minus, Star } from "lucide-react";
import { useProducts, Product as NormalizedProduct } from "@/contexts/ProductContext";

interface ProductGridProps {
  onAddToCart: (product: NormalizedProduct) => void;
  selectedCategory?: string; // kept for compatibility but ignored (show all)
  isAnimating?: boolean;
}

export default function FilterableProductGrid({
  onAddToCart,
  selectedCategory, // ignored
  isAnimating = false
}: ProductGridProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [displayedProducts, setDisplayedProducts] = useState<NormalizedProduct[]>([]);

  // pull products from provider - show all products
  const { products } = useProducts();

  // --- Static fallback product used when APIs fail / products empty ---
  const staticFallbackProduct: NormalizedProduct = {
    // Cast to NormalizedProduct to avoid strict TS errors if your type has many optional fields
    id: "static-001",
    name: "Sample Product (Static)",
    price: 499.00,
    discountPrice: 399.00,
    discountAmount: 100,
    stock: 10,
    imageUrl: "/placeholder.png",
    // any other fields in your NormalizedProduct can be added here
  } as NormalizedProduct;

  const updateDisplayedProducts = useCallback(() => {
    // if provider returned a valid non-empty array, use it
    if (Array.isArray(products) && products.length > 0) {
      setDisplayedProducts(products);
      return;
    }

    // otherwise use static fallback single product
    setDisplayedProducts([staticFallbackProduct]);
  }, [products]);

  useEffect(() => {
    updateDisplayedProducts();
  }, [updateDisplayedProducts]);

  // listen to external updates
  useEffect(() => {
    const handler = () => updateDisplayedProducts();
    window.addEventListener("productsUpdated", handler);
    return () => window.removeEventListener("productsUpdated", handler);
  }, [updateDisplayedProducts]);

  const qtyOf = (id: string) => Math.max(0, Math.trunc(quantities[id] ?? 0));

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setQuantities(prev => ({ ...prev, [productId]: Math.trunc(newQuantity) }));
  };

  const handleAddToCart = (product: NormalizedProduct) => {
    if (product.stock <= 0) return;
    const qty = Math.max(1, qtyOf(product.id));
    // call handler qty times to preserve existing contract
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
  };

  const formatPrice = (n: number) => {
    // show two decimals like screenshot
    return n.toFixed(2);
  };

  const computeDisplayPrice = (p: NormalizedProduct) => {
    if (typeof p.discountPrice === "number" && p.discountPrice > 0) return p.discountPrice;
    if (typeof p.discountAmount === "number" && p.discountAmount > 0) return Math.max(0, p.price - p.discountAmount);
    return p.price;
  };

  const computeDiscountPercent = (p: NormalizedProduct) => {
    const original = p.price || 0;
    const shown = computeDisplayPrice(p);
    if (!original || original <= 0 || shown >= original) return 0;
    return Math.round(((original - shown) / original) * 100);
  };

  return (
    <div className="mb-12">
      {/* Grid: responsive to match screenshot proportions */}
      <div
        className={`grid gap-6 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
          transition-all duration-300 ease-in-out ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      >
        {displayedProducts.map((product, idx) => {
          const currentQuantity = qtyOf(product.id);
          const displayPrice = computeDisplayPrice(product);
          const discountPercent = computeDiscountPercent(product);
          const outOfStock = product.stock <= 0;

          // Try to use normalized image fields if present
          const imgFromImages = Array.isArray((product as any).images) && (product as any).images.length ? (product as any).images[0] : null;
          const imageSrc = (product.imageUrl || imgFromImages) ?? "/placeholder.png";

          return (
            <article
              key={product.id}
              className="bg-white rounded-2xl shadow-[0_6px_18px_rgba(13,18,25,0.08)] border border-transparent hover:border-gray-100 overflow-hidden flex flex-col"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}
            >
              {/* image area */}
              <div className="relative p-4">
                <div className="rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={imageSrc}
                    alt={product.name}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.png"; }}
                    className="w-full h-56 object-cover block"
                  />
                </div>
              </div>

              {/* body */}
              <div className="px-5 pb-5 flex-1 flex flex-col">
                <h3
                  className="text-sm font-medium text-gray-900 mb-2 line-clamp-2"
                  title={product.name}
                >
                  {product.name}
                </h3>

                {/* rating row */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400" />
                  ))}
                </div>

                {/* price row */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Rs.{formatPrice(product.price)}</div>
                      {discountPercent > 0 && (
                        <div className="text-xs text-gray-400  mt-1">Disc:Rs.{formatPrice(displayPrice)}</div>
                      )}
                    </div>

                    {/* Add / qty controls */}
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
                          <button
                            onClick={() => handleQuantityChange(product.id, Math.max(0, currentQuantity - 1))}
                            className="p-2"
                            aria-label="decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-sm font-semibold">{currentQuantity}</span>
                          <button
                            onClick={() => handleQuantityChange(product.id, currentQuantity + 1)}
                            className="p-2"
                            aria-label="increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* optional discount badge bottom-left */}
                {discountPercent > 0 && (
                  <div className="mt-3">
                    {/* you can add a badge here if you want */}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* empty state */}
      {displayedProducts.length === 0 && !isAnimating && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 5 9 3" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try again later.</p>
        </div>
      )}
    </div>
  );
}
