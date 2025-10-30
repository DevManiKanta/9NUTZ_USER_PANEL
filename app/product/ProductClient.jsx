

// "use client";

// import React, { useCallback, useMemo, useState } from "react";
// import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
// import { useCart } from "@/contexts/CartContext";
// import { useRouter } from "next/navigation";
// import { useProducts } from "@/contexts/ProductContext";
// export default function ProductClient({ product }) {
//   const { addItem, openCart } = useCart() || {};
//   const [isAdding, setIsAdding] = useState(false);
//   const router = useRouter();
//    const { products } = useProducts() || { products: [] };

//    console.log("Products",products)
//   if (!product) return null;
//   const images = useMemo(() => {
//     const out = [];

//     if (product.imageUrl) out.push(String(product.imageUrl));

//     if (Array.isArray(product.images) && product.images.length > 0) {
//       product.images.forEach((it) => {
//         if (!it) return;
//         if (typeof it === "string") {
//           if (!out.includes(it)) out.push(it);
//         } else if (typeof it === "object") {
//           // prefer image_url field inside object
//           const url = it.image_url ?? it.url ?? it.image ?? null;
//           if (url && !out.includes(url)) out.push(String(url));
//         }
//       });
//     }

//     // fallback to product.image/product.image_url if still empty
//     if (out.length === 0) {
//       const fallback = product.image_url ?? product.image ?? null;
//       if (fallback) out.push(String(fallback));
//     }

//     return out;
//   }, [product]);

//   const [currentIndex, setCurrentIndex] = useState(0);

//   React.useEffect(() => {
//     if (!images || images.length === 0) {
//       setCurrentIndex(0);
//       return;
//     }
//     if (currentIndex >= images.length) setCurrentIndex(0);
//   }, [images, currentIndex]);

//   const currentImage = images && images.length ? images[currentIndex] : "/placeholder.png";

//   const discountPercent =
//     (product.discountPrice && product.price)
//       ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
//       : product.discount_percent ?? 0;

//   const handleAddToCart = useCallback(
//     (productToAdd) => {
//       if (!productToAdd) return;
//       const stockVal = Number(productToAdd?.stock ?? Infinity);
//       if (!Number.isNaN(stockVal) && stockVal <= 0) return;
//       setIsAdding(true);

//       try {
//         if (typeof addItem === "function") {
//           addItem({ ...productToAdd, quantity: 1 });
//         } else {
//           window.dispatchEvent(new CustomEvent("productAddToCart", { detail: { product: productToAdd, quantity: 1 } }));
//         }

//         if (typeof openCart === "function") openCart();
//         else window.dispatchEvent(new CustomEvent("openCart"));
//       } catch (err) {
//         // ignore
//       } finally {
//         setTimeout(() => setIsAdding(false), 600);
//       }
//     },
//     [addItem, openCart]
//   );

//   const handleThumbKey = (e, idx) => {
//     if (e.key === "Enter" || e.key === " ") {
//       e.preventDefault();
//       setCurrentIndex(idx);
//     } else if (e.key === "ArrowLeft") {
//       e.preventDefault();
//       setCurrentIndex((prev) => Math.max(0, prev - 1));
//     } else if (e.key === "ArrowRight") {
//       e.preventDefault();
//       setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));
//     }
//   };
//   return (
//     <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1 mt-5">
//       <button
//         onClick={() => router.push("/")}
//         className="absolute -top-2 left-4 flex items-center gap-2 text-gray-600 hover:text-[#C75B3A] transition-colors duration-200"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         <span className="hidden sm:inline font-medium">Back to Menu</span>
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mt-6">
//         {/* Left: main image + thumbnails */}
//         <div className="w-full flex flex-col items-center">
//           <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-lg bg-gray-50">
//             <img
//               src={currentImage}
//               alt={product.name}
//               className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//             />
//             {discountPercent > 0 && (
//               <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow">
//                 {discountPercent}% OFF
//               </span>
//             )}
//           </div>
//           {images.length > 0 && (
//             <div className="mt-4 w-full max-w-md">
//               <div className="flex items-center gap-3 overflow-x-auto py-2 px-1">
//                 {images.map((src, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentIndex(idx)}
//                     onKeyDown={(e) => handleThumbKey(e, idx)}
//                     aria-label={`View image ${idx + 1}`}
//                     className={`flex-shrink-0 rounded-lg overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
//                       idx === currentIndex ? "ring-2 ring-emerald-600 border-white-600" : "border-gray-200"
//                     }`}
//                     style={{ width: 84, height: 84,borderRadius:10}}
//                     title={`Image ${idx + 1}`}
//                   >
//                     <img
//                       src={src}
//                       alt={`${product.name} ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                       loading={idx === 0 ? "eager" : "lazy"}
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right: product info */}
//         <div className="flex flex-col gap-6">
//           <div>
//             <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
//             <div className="flex items-center gap-1">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
//               ))}
//               <span className="text-sm text-gray-500 ml-1">(4.9 / 120 reviews)</span>
//             </div>
//           </div>

//           <div>
//             <div className="flex items-center gap-3">
//               <span className="text-3xl font-bold text-[#C75B3A]">Rs.{product.discountPrice || product.price}</span>
//               {discountPercent > 0 && <span className="text-lg text-gray-400 line-through">Rs.{product.price}</span>}
//             </div>
//             <p className="mt-2 text-gray-500 text-sm">Inclusive of all taxes. Free delivery on orders above ₹499.</p>
//           </div>

//           {Number(product.stock ?? 0) > 0 ? (
//             <p className="text-green-600 font-semibold">In Stock</p>
//           ) : (
//             <p className="text-red-500 font-semibold">Out of Stock</p>
//           )}

//           <div className="text-gray-700 text-base leading-relaxed">{product.description || "No description available."}</div>

//           <div className="flex flex-col sm:flex-row gap-4 mt-4">
//             <button
//               onClick={() => handleAddToCart(product)}
//               disabled={Number(product.stock ?? 0) <= 0 || isAdding}
//               className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors duration-200 ${
//                 Number(product.stock ?? 0) > 0 ? "bg-[#C75B3A] text-white hover:bg-[#b14e33]" : "bg-gray-300 text-gray-600 cursor-not-allowed"
//               }`}
//             >
//               <ShoppingCart className="w-5 h-5" />
//               {isAdding ? "Adding..." : Number(product.stock ?? 0) > 0 ? "Add to Cart" : "Out of Stock"}
//             </button>
//           </div>
//           <div className="mt-12 border-t pt-8">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
//             <ul className="list-disc list-inside text-gray-700 space-y-2 text-base leading-relaxed">
//               <li>Made from premium-quality ingredients for authentic taste and freshness.</li>
//               <li>Prepared under hygienic conditions following strict food safety standards.</li>
//               <li>Free from harmful preservatives, artificial colors, or flavors.</li>
//               <li>Perfect for everyday meals, festive occasions, and quick snack cravings.</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useProducts } from "@/contexts/ProductContext";

export default function ProductClient({ product }) {
  const { addItem, openCart } = useCart() || {};
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();
  const { products } = useProducts() || { products: [] };

  console.log("Products", products);

  if (!product) return null;

  const images = useMemo(() => {
    const out = [];

    if (product.imageUrl) out.push(String(product.imageUrl));

    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((it) => {
        if (!it) return;
        if (typeof it === "string") {
          if (!out.includes(it)) out.push(it);
        } else if (typeof it === "object") {
          // prefer image_url field inside object
          const url = it.image_url ?? it.url ?? it.image ?? null;
          if (url && !out.includes(url)) out.push(String(url));
        }
      });
    }

    // fallback to product.image/product.image_url if still empty
    if (out.length === 0) {
      const fallback = product.image_url ?? product.image ?? null;
      if (fallback) out.push(String(fallback));
    }

    return out;
  }, [product]);

  // Video source: prefer product-provided video fields, otherwise use a static sample video.
  const videoSrc = useMemo(() => {
    // try common product fields
    const candidate =
      product.video_url ??
      product.video ??
      (Array.isArray(product.videos) && product.videos.length ? product.videos[0] : null);

    // Ensure candidate is a string and non-empty
    if (candidate && typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }

    // fallback static sample (public sample from MDN — reliable small clip)
    return "https://www.youtube.com/shorts/G--NLgSNCmE?feature=share.mp4"
    // "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
  }, [product]);

  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    if (!images || images.length === 0) {
      setCurrentIndex(0);
      return;
    }
    if (currentIndex >= images.length) setCurrentIndex(0);
  }, [images, currentIndex]);

  const currentImage = images && images.length ? images[currentIndex] : "";

  const discountPercent =
    product.discountPrice && product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : product.discount_percent ?? 0;

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
          window.dispatchEvent(new CustomEvent("productAddToCart", { detail: { product: productToAdd, quantity: 1 } }));
        }

        if (typeof openCart === "function") openCart();
        else window.dispatchEvent(new CustomEvent("openCart"));
      } catch (err) {
        // ignore
      } finally {
        setTimeout(() => setIsAdding(false), 600);
      }
    },
    [addItem, openCart]
  );

  const handleThumbKey = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCurrentIndex(idx);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));
    }
  };

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1 mt-5">
      <button
        onClick={() => router.push("/")}
        className="absolute -top-2 left-4 flex items-center gap-2 text-gray-600 hover:text-[#C75B3A] transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Back to Menu</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mt-6">
        {/* Left: main image + thumbnails */}
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-lg bg-gray-50">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {images.length > 0 && (
            <div className="mt-4 w-full max-w-md">
              <div className="flex items-center gap-3 overflow-x-auto py-2 px-1">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    onKeyDown={(e) => handleThumbKey(e, idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`flex-shrink-0 rounded-lg overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                      idx === currentIndex ? "ring-2 ring-emerald-600 border-white-600" : "border-gray-200"
                    }`}
                    style={{ width: 84, height: 84, borderRadius: 10 }}
                    title={`Image ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- NEW: Video block below images (static fallback if product has no video) --- */}
          <div className="mt-4 w-full max-w-md">
            <div className="rounded-md overflow-hidden border bg-black/5">
              <video
                src={videoSrc}
                controls
                poster={currentImage}
                className="w-full h-48 object-cover bg-black"
              >
                {/* fallback text */}
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Right: product info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
              ))}
              <span className="text-sm text-gray-500 ml-1">(4.9 / 120 reviews)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#C75B3A]">Rs.{product.discountPrice || product.price}</span>
              {discountPercent > 0 && <span className="text-lg text-gray-400 line-through">Rs.{product.price}</span>}
            </div>
            <p className="mt-2 text-gray-500 text-sm">Inclusive of all taxes. Free delivery on orders above ₹499.</p>
          </div>

          {Number(product.stock ?? 0) > 0 ? (
            <p className="text-green-600 font-semibold">In Stock</p>
          ) : (
            <p className="text-red-500 font-semibold">Out of Stock</p>
          )}

          <div className="text-gray-700 text-base leading-relaxed">{product.description || "No description available."}</div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={() => handleAddToCart(product)}
              disabled={Number(product.stock ?? 0) <= 0 || isAdding}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors duration-200 ${
                Number(product.stock ?? 0) > 0 ? "bg-[#C75B3A] text-white hover:bg-[#b14e33]" : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {isAdding ? "Adding..." : Number(product.stock ?? 0) > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-base leading-relaxed">
              <li>Made from premium-quality ingredients for authentic taste and freshness.</li>
              <li>Prepared under hygienic conditions following strict food safety standards.</li>
              <li>Free from harmful preservatives, artificial colors, or flavors.</li>
              <li>Perfect for everyday meals, festive occasions, and quick snack cravings.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}


