
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
      id: "os1",
      title: "Organic Trail Mix",
      slug: "organic-trail-mix",
      price: 249,
      weight: "250g",
      image: "https://th.bing.com/th/id/OIP.zfK8jwkbjqaKu1qwsMWsCAHaEK?w=321&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
      short: "A wholesome mix of nuts & dried fruits — no added sugar.",
    },
    {
      id: "os2",
      title: "Kale Chips",
      slug: "kale-chips",
      price: 199,
      weight: "100g",
      image: "https://th.bing.com/th/id/OIP.iWjEdBxKtCnjv6A02Zik4AHaE7?w=272&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
      short: "Crispy oven-baked kale chips seasoned with sea salt.",
    },
    {
      id: "os3",
      title: "Roasted Chickpeas",
      slug: "roasted-chickpeas",
      price: 179,
      weight: "200g",
      image: "https://9nutz.com/wp-content/uploads/2025/06/Moringa-300x300.jpg",
      short: "High-protein roasted chickpeas with a delightful crunch.",
    },
    {
      id: "os4",
      title: "Quinoa Puffs",
      slug: "quinoa-puffs",
      price: 159,
      weight: "120g",
      image: "https://9nutz.com/wp-content/uploads/2025/06/Screenshot_2024-07-04_135850_869x-300x-1.webp",
      short: "Light, airy puffs made from quinoa — perfect for munching.",
    },
    {
      id: "os5",
      title: "Moringa Energy Bites",
      slug: "moringa-energy-bites",
      price: 299,
      weight: "180g",
      image: "https://9nutz.com/wp-content/uploads/2025/06/Moringa-300x300.jpg",
      short: "Energy bites packed with moringa and seeds for a natural boost.",
    },
    {
      id: "os6",
      title: "Roasted Almonds (Honey)",
      slug: "roasted-almonds-honey",
      price: 399,
      weight: "250g",
      image: "https://9nutz.com/wp-content/uploads/2025/06/Screenshot_2024-07-04_135850_869x-300x300.webp",
      short: "Lightly honey-roasted almonds — crunchy and naturally sweet.",
    },
  ];
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
    <h1 className="text-3xl font-extrabold text-gray-900">Healthy-nuts</h1>
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
      <Footer />
    </div>
  );
}
