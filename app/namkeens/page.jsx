
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react"; // ✅ add this at the top with other imports
import { useRouter } from "next/navigation"; 

/**
 * OrganicSnacksPage
 * - Client component that shows dummy products for "Organic Snacks"
 * - Uses unoptimized on Image so external URLs work during development
 */
export default function OrganicSnacksPage() {
  const products = [
  {
    id: "nm1",
    title: "Aloo Bhujia",
    slug: "aloo-bhujia",
    price: 149,
    weight: "200g",
    image:
      "https://th.bing.com/th/id/OIP.jXx9YW_Qk_KaMFqY1D8VxQHaE8?w=600&h=400&c=7&r=0&o=7&pid=1.7",
    short:
      "Crispy potato sev blended with tangy spices — a classic Indian favorite.",
  },
  {
    id: "nm2",
    title: "Masala Mixture",
    slug: "masala-mixture",
    price: 179,
    weight: "250g",
    image:
      "https://th.bing.com/th/id/OIP.C5rJ1dIKT1Xr9Tf6uIpr4AHaE7?w=600&h=400&c=7&r=0&o=7&pid=1.7",
    short:
      "Spicy and crunchy mix of sev, peanuts, lentils, and aromatic masala.",
  },
  {
    id: "nm3",
    title: "Moong Dal Namkeen",
    slug: "moong-dal-namkeen",
    price: 159,
    weight: "200g",
    image:
      "https://th.bing.com/th/id/OIP.XXmZYy4z2ySWoQH3U6Su_gHaE7?w=600&h=400&c=7&r=0&o=7&pid=1.7",
    short:
      "Crispy fried moong dal — simple, salty, and perfect for tea time snacking.",
  },
  {
    id: "nm4",
    title: "Chana Jor Garam",
    slug: "chana-jor-garam",
    price: 169,
    weight: "180g",
    image:
      "https://th.bing.com/th/id/OIP.3m-mkW7PfgT97vB86bEjvwHaE8?w=600&h=400&c=7&r=0&o=7&pid=1.7",
    short:
      "Flattened and roasted black gram spiced with chili and tangy masala.",
  },
  {
    id: "nm5",
    title: "Navratan Mix",
    slug: "navratan-mix",
    price: 189,
    weight: "250g",
    image:
      "https://th.bing.com/th/id/OIP.YxD0CN3VBGAmEmuh9GEZXgHaE7?w=600&h=400&c=7&r=0&o=7&pid=1.7",
    short:
      "A royal mix of lentils, nuts, and sev — nine ingredients, nine flavors.",
  },
  {
    id: "nm6",
    title: "Bikaneri Bhujia",
    slug: "bikaneri-bhujia",
    price: 199,
    weight: "250g",
    image:
      "https://th.bing.com/th/id/OIP.Q3MFuU2RMMKTUJxRg_CoFQHaE8?w=600&h=400&c=7&r=0&o=7&pid=1.7",
    short:
      "Traditional Bikaner-style spicy gram flour sev — crunchy and flavorful.",
  },
];

  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-5 pb-12">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
  {/* back arrow */}
  <button
    onClick={() => router.back()}
    className="p-2 rounded-full hover:bg-gray-100 transition"
    aria-label="Go back"
  >
    <ArrowLeft className="w-5 h-5 text-gray-700" />
  </button>

  {/* title + subtitle */}
  <div>
    <h1 className="text-3xl font-extrabold text-gray-900">Namkeens</h1>
    <p className="mt-1 text-gray-600">
      Natural, tasty & healthy snacks made from organic ingredients.
    </p>
  </div>
</div>
            <div className="text-sm text-gray-600">Showing {products.length} products</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group"
                aria-labelledby={`product-${p.id}-title`}
              >
                <div className="relative w-full h-56 sm:h-64">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-500"
                    unoptimized // keep until you configure next.config.js image domains
                  />
                  <div className="absolute left-3 top-3 bg-white/85 px-3 py-1 rounded-full text-xs font-medium text-emerald-800">
                    {p.weight}
                  </div>
                </div>

                <div className="p-5">
                  <h3 id={`product-${p.id}-title`} className="text-lg font-semibold text-gray-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{p.short}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-emerald-700 font-bold text-lg">₹{p.price}</div>
                      <div className="text-xs text-gray-400">Inclusive of taxes</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-full border border-gray-200 hover:bg-gray-100 transition"
                        aria-label={`Add ${p.title} to cart`}
                        onClick={() => alert(`${p.title} added to cart (demo)`)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
