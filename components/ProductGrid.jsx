// components/ProductGrid.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Plus, Minus } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { useRouter } from "next/navigation";



export default function ProductGrid({ products: propProducts, onAddToCart, categoryFilter, limit, title }) {
  const router = useRouter();
  const { getActiveProducts } = useProducts();
  const productsFromContext = useMemo(() => getActiveProducts(), [getActiveProducts]);

  const products = propProducts && propProducts.length ? propProducts : productsFromContext;

  const filtered = products.filter(p => {
    if (!categoryFilter) return true;
    const cat = (p).categoryId ?? (p).category_id ?? (p).category;
    return String(cat) === String(categoryFilter) || String(p.category) === String(categoryFilter);
  });

  const display = limit ? filtered.slice(0, limit) : filtered;

  const [quantities, setQuantities] = useState({});

  const handleQtyChange = (id, next) => {
    if (next < 0) return;
    setQuantities(prev => ({ ...prev, [String(id)]: next }));
  };

  const handleAdd = (product) => {
    const qty = quantities[String(product.id)] || 1;
    // build minimal add payload
    const payload = {
      id: product.id,
      name: product.name,
      price: product.offerPrice ?? product.price ?? 0,
      image: (product.images && product.images[0]) || product.image,
      weight: product.weight
    };
    for (let i = 0; i < qty; i++) {
      onAddToCart(payload);
    }
    setQuantities(prev => ({ ...prev, [String(product.id)]: 0 }));
  };

  return (
    <div>
      {(title || !categoryFilter) && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title ?? "Products"}</h3>
          {/* <button className="text-green-600 hover:text-green-700 text-sm">see all</button> */}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {display.map(product => {
          const img = (product.images && product.images[0]) || product.image || "/placeholder.png";
          const qty = quantities[String(product.id)] ?? 0;
          const price = product.offerPrice ?? product.price ?? 0;

          return (
            <div key={String(product.id)} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <div
                onClick={() => router.push(`/product/${product.id}`)}
                className="cursor-pointer"
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") router.push(`/product/${product.id}`); }}
              >
                <div className="mb-3">
                  <img src={img} alt={product.name} className="w-full h-32 object-cover rounded-lg" />
                </div>
                <div className="mb-2">
                  <div className="font-medium text-sm text-gray-900 line-clamp-2">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.weight}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-bold">₹{price}</div>
                  {product.offerPrice && product.offerPrice < (product.price ?? 0) && (
                    <div className="text-xs text-gray-400 line-through">₹{product.price}</div>
                  )}
                </div>
              </div>

              <div className="mt-3">
                {qty === 0 ? (
                  <button onClick={() => handleAdd(product)} className="w-full bg-white border-2 border-green-600 text-green-600 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
                    ADD
                  </button>
                ) : (
                  <div className="flex items-center bg-green-600 text-white rounded-lg">
                    <button onClick={() => handleQtyChange(product.id, qty - 1)} className="p-2"> <Minus className="h-4 w-4" /> </button>
                    <span className="px-3 font-medium">{qty}</span>
                    <button onClick={() => handleQtyChange(product.id, qty + 1)} className="p-2"> <Plus className="h-4 w-4" /> </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
