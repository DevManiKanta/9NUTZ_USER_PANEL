"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ChevronRight, Clock, Star, ArrowLeft, Heart } from "lucide-react";
import ProductGrid from "./ProductGrid";
import Header from "./Header";
import Footer from "./Footer";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetailContent({ product }) {
  const router = useRouter();
  const { addItem, items, cartCount, cartTotal } = useCart();

  // Normalize images (product.images is preferred)
  const images = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length) return product.images;
    if (product?.image) return [product.image];
    return ["/placeholder.png"]; // optional placeholder
  }, [product]);

  // Normalize units:
  // Accept either product.quantityPrices (JSON string or array) OR fallback to weight + offerPrice/price
  const units = useMemo(() => {
    const qp = product?.quantityPrices ?? product?.quantity_prices ?? null;
    if (qp) {
      try {
        const parsed = typeof qp === "string" ? JSON.parse(qp) : qp;
        if (Array.isArray(parsed) && parsed.length) {
          return parsed.map((u) => {
            const size = u?.size ?? (u?.quantity ?? u?.label ?? String(u?.quantity ?? ""));
            const price = Number(u?.price ?? u?.amount ?? product?.offerPrice ?? product?.offer_price ?? product?.price ?? 0);
            return { size, price };
          });
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    // Fallback: use weight and offerPrice/price
    const basePrice = Number(product?.offerPrice ?? product?.offer_price ?? product?.price ?? 0);
    const baseSize = product?.weight ?? "1 kg";
    const secondPrice = Math.round(basePrice * 2); // simple fallback for 2x
    return [
      { size: baseSize, price: basePrice },
      { size: `2 x ${baseSize}`, price: secondPrice },
    ];
  }, [product]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const selectedUnit = units[selectedUnitIndex] ?? units[0] ?? { size: "1", price: 0 };

  const addToCart = () => {
    if (!product) return;
    
    const item = {
      id: product.id,
      name: product.name,
      price: selectedUnit.price,
      image: images[0],
      weight: selectedUnit.size,
      quantity,
    };
    
    addItem(item);
    
    // Dispatch event to open cart
    try {
      window.dispatchEvent(new CustomEvent("openCart"));
    } catch (err) {
      console.warn("Failed to dispatch openCart event:", err);
    }
  };

  const toggleWishlist = () => setWishlisted((s) => !s);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => {}}
        onLocationClick={() => {}}
        onCartClick={() => {
          try {
            window.dispatchEvent(new CustomEvent("openCart"));
          } catch (err) {
            console.warn("Failed to dispatch openCart event:", err);
          }
        }}
        cartItemCount={cartCount}
        cartTotal={cartTotal}
      />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button onClick={() => router.back()} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square bg-white rounded-2xl p-6 border border-gray-100 flex items-center justify-center">
                <img src={images[selectedImageIndex]} alt={product?.name} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="flex space-x-3 mt-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-20 h-20 rounded-lg border overflow-hidden ${selectedImageIndex === i ? "border-green-500" : "border-gray-200"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
              <div className="flex items-center space-x-3 mb-4">
                {product?.brand && <span className="text-sm text-gray-600">{product.brand}</span>}
                <span className="text-sm text-gray-500">•</span>
                {product?.weight && <span className="text-sm text-gray-500">{product.weight}</span>}
              </div>

              {/* Unit selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Select Unit</h3>
                <div className="flex space-x-3">
                  {units.map((u, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedUnitIndex(idx)}
                      className={`px-4 py-3 rounded-lg border-2 text-center ${selectedUnitIndex === idx ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200"}`}
                    >
                      <div className="font-medium text-sm">{u.size}</div>
                      <div className="font-bold text-lg">₹{u.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-4">
                  <div className="text-2xl font-bold">₹{selectedUnit.price}</div>
                  {product?.price && Number(product.price) !== Number(selectedUnit.price) && (
                    <div className="text-sm text-gray-500 line-through">₹{product.price}</div>
                  )}
                  {product?.discount && <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{product.discount}% OFF</div>}
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-green-600 text-white rounded-lg">
                  <button
                    onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                    className="p-3 hover:bg-green-700 rounded-l-lg disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 font-medium text-lg">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="p-3 hover:bg-green-700 rounded-r-lg">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button onClick={addToCart} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold">
                  Add to Cart
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`px-4 py-3 rounded-lg border-2 transition ${wishlisted ? "border-red-500 bg-red-50 text-red-600" : "border-gray-300 text-gray-600"}`}
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
                <p className="text-gray-700">{product?.description}</p>
              </div>
            </div>
          </div>

          {/* Reviews (sample) */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-3xl font-bold">{product?.rating ?? 4.5}</div>
                <div className="ml-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(product?.rating ?? 4) ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">{product?.reviews ?? 0} reviews</div>
                </div>
              </div>

              {/* sample review */}
              <div className="border-t border-gray-100 pt-4">
                <div className="font-medium">Rajesh K.</div>
                <div className="text-sm text-gray-700">Excellent product. Fresh and well packaged.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
