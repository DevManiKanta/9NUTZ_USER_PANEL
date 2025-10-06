// "use client";

// import { useState, useEffect } from 'react';
// import { Plus, Minus, Star } from 'lucide-react';
// import { useProducts } from '@/contexts/ProductContext';
// import { useCategories } from '@/contexts/CategoryContext';

// interface FilterableProductGridProps {
//   onAddToCart: (product: any) => void;
//   selectedCategory: string;
//   isAnimating: boolean;
// }

// export default function FilterableProductGrid({ 
//   onAddToCart, 
//   selectedCategory, 
//   isAnimating 
// }: FilterableProductGridProps) {
//   const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
//   const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  
//   const { getActiveProducts, getProductsByCategory } = useProducts();
//   const { getActiveCategories } = useCategories();

//   // Listen for product updates from admin
//   useEffect(() => {
//     const handleProductsUpdate = () => {
//       // Force re-render when products are updated
//       updateDisplayedProducts();
//     };

//     window.addEventListener('productsUpdated', handleProductsUpdate);
//     window.addEventListener('categoriesUpdated', handleProductsUpdate);

//     return () => {
//       window.removeEventListener('productsUpdated', handleProductsUpdate);
//       window.removeEventListener('categoriesUpdated', handleProductsUpdate);
//     };
//   }, [selectedCategory]);

//   const updateDisplayedProducts = () => {
//     const activeCategories = getActiveCategories();
//     let filtered;
    
//     if (selectedCategory === 'all') {
//       filtered = getActiveProducts();
//     } else {
//       const matchingCategory = activeCategories.find(cat => 
//         cat.name === selectedCategory
//       );
//       filtered = matchingCategory ? getProductsByCategory(matchingCategory.id) : [];
//     }
    
//     setDisplayedProducts(filtered);
//   };

//   // Update displayed products when category changes
//   useEffect(() => {
//     updateDisplayedProducts();
//   }, [selectedCategory, getActiveProducts, getProductsByCategory, getActiveCategories]);

//   const handleQuantityChange = (productId: string, newQuantity: number) => {
//     if (newQuantity < 0) return;
//     setQuantities(prev => ({
//       ...prev,
//       [productId]: newQuantity
//     }));
//   };

//   const handleAddToCart = (product: any) => {
//     const quantity = quantities[product.id] || 1;
//     for (let i = 0; i < quantity; i++) {
//       onAddToCart(product);
//     }
//     setQuantities(prev => ({
//       ...prev,
//       [product.id]: 0
//     }));
//   };

//   const calculateDiscount = (originalPrice: number, offerPrice: number) => {
//     return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
//   };

//   return (
//     <div className="mb-12">
//       {/* Products Grid with Smooth Transitions */}
//       <div 
//         className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 transition-all duration-300 ease-in-out ${
//           isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
//         }`}
//       >
//         {displayedProducts.map((product, index) => {
//           const currentQuantity = quantities[product.id] || 0;
//           const hasOffer = product.offerPrice && product.offerPrice < product.price;
//           const displayPrice = hasOffer ? product.offerPrice : product.price;
//           const discount = hasOffer ? calculateDiscount(product.price, product.offerPrice) : null;
          
//           return (
//             <div 
//               key={product.id}
//               className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group border border-gray-100 animate-fadeIn flex flex-col h-full"
//               style={{ 
//                 animationDelay: `${index * 50}ms`,
//                 animationFillMode: 'both'
//               }}
//             >
//               <div 
//                 onClick={() => window.location.href = `/product/${product.id}`}
//                 className="cursor-pointer"
//               >
//                 {/* Product Image */}
//                 <div className="relative mb-3">
//                   <img
//                     src={product.images[0] || product.image}
//                     alt={product.name}
//                     className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
//                   />
//                   {discount && (
//                     <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
//                       {discount}% OFF
//                     </span>
//                   )}
//                 </div>

//                 {/* Product Info */}
//                 <div className="mb-3">
//                   <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2 leading-tight">
//                     {product.name}
//                   </h3>
//                   <div className="flex items-center justify-between mb-1">
//                     <p className="text-xs text-gray-500">{product.weight}</p>
//                     {product.rating && (
//                       <div className="flex items-center space-x-1">
//                         <Star className="h-3 w-3 text-yellow-400 fill-current" />
//                         <span className="text-xs text-gray-600">{product.rating}</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="flex items-center space-x-2">
//                     <span className="font-bold text-gray-900">₹{displayPrice}</span>
//                     {hasOffer && (
//                       <span className="text-xs text-gray-400 line-through">
//                         ₹{product.price}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Add to Cart Section */}
//               <div className="flex items-center justify-between mt-auto">
//                 {currentQuantity === 0 ? (
//                   <button
//                     onClick={() => handleAddToCart(product)}
//                     className="flex-1 bg-white border-2 border-green-600 text-green-600 py-2 px-3 rounded-lg font-medium text-sm hover:bg-green-50 transition-colors flex items-center justify-center space-x-1"
//                   >
//                     <span>ADD</span>
//                   </button>
//                 ) : (
//                   <div className="flex-1 flex items-center justify-between bg-green-600 text-white rounded-lg">
//                     <button
//                       onClick={() => handleQuantityChange(product.id, currentQuantity - 1)}
//                       className="p-2 hover:bg-green-700 rounded-l-lg transition-colors"
//                     >
//                       <Minus className="h-4 w-4" />
//                     </button>
//                     <span className="px-3 font-medium">{currentQuantity}</span>
//                     <button
//                       onClick={() => handleQuantityChange(product.id, currentQuantity + 1)}
//                       className="p-2 hover:bg-green-700 rounded-r-lg transition-colors"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* No Products Found */}
//       {displayedProducts.length === 0 && !isAnimating && (
//         <div className="text-center py-16">
//           <div className="text-gray-400 mb-4">
//             <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 5 9 3" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//           <p className="text-gray-500">Try selecting a different category or check back later.</p>
//         </div>
//       )}

//       {/* Category Stats */}
//       {displayedProducts.length > 0 && (
//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Showing <span className="font-medium">{displayedProducts.length}</span> products
//             {selectedCategory !== 'all' && (
//               <span> in <span className="font-medium">{selectedCategory}</span></span>
//             )}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Minus, Star, Heart } from "lucide-react";
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

  const updateDisplayedProducts = useCallback(() => {
    setDisplayedProducts(Array.isArray(products) ? products : []);
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
          // support .images array, .imageUrl, fallback to /placeholder.png
          // @ts-ignore
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

                {/* wishlist heart - top right */}
                <button
                  aria-label="Add to wishlist"
                  className="absolute top-6 right-6 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm hover:scale-105 transition-transform"
                >
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>
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
                  {/* show 5 small stars filled gold if rating exists; otherwise show empty small outline */}
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
