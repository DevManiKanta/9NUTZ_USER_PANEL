// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import AboutImage from "../../assests/9nutz_about.jpg"
// import { ChevronLeft, ChevronRight } from "lucide-react";
// const CAROUSEL_IMAGES = [
//   {
//     src:AboutImage,
//     alt: "Assorted healthy snacks on a table",
//   },
//   {
//     src: "https://9nutz.com/wp-content/uploads/2025/06/IMG-20250109-WA0010.jpg",
//     alt: "Nuts and millets in bowls",
//   },
//   {
//     src: "https://9nutz.com/wp-content/uploads/2025/06/IMG-20250109-WA0011.jpg",
//     alt: "Handmade traditional sweets",
//   },
// ];

// export default function AboutPage() {
//   // carousel
//   const [index, setIndex] = useState(0);
//   const autoplayRef = useRef<number | null>(null);

//   useEffect(() => {
//     startAutoplay();
//     return stopAutoplay;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [index]);

//   const startAutoplay = () => {
//     stopAutoplay();
//     autoplayRef.current = window.setTimeout(() => {
//       setIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
//     }, 3500);
//   };

//   const stopAutoplay = () => {
//     if (autoplayRef.current) {
//       window.clearTimeout(autoplayRef.current);
//       autoplayRef.current = null;
//     }
//   };

//   const prev = () => {
//     stopAutoplay();
//     setIndex((i) => (i - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
//   };

//   const next = () => {
//     stopAutoplay();
//     setIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
//   };

//   // content
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header
//         onLoginClick={() => {}}
//         onLocationClick={() => {}}
//         onCartClick={() => {}}
//         cartItemCount={0}
//         cartTotal={0}
//       />

//       <main className="pb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//           {/* Hero / top section */}
//           <section className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
//               {/* left: text */}
//               <div className="p-8 sm:p-12">
//                 <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-800 mb-4">
//                  9NUTZ MILLETS
//                 </h1>

//                 <p className="text-gray-700 mb-4">
//                   In 2020, during the global pandemic, we saw people forced into unhealthy choices because healthier options weren't available or convenient.
//                   That sparked a question: <em>why can't traditional, healthier snacks be as accessible as fast food?</em> That's how our entrepreneurial journey began — and 9NUTZ MILLETS was born.
//                 </p>

//                 <p className="text-gray-700 mb-4">
//                   Our mission is to revolutionize snacking habits across India by offering nutritious alternatives that empower families to make healthier choices.
//                   We aim to <strong>un-junk the snacks</strong>, enrich lives with millets, and promote well-being through mindful eating.
//                 </p>

//                 <p className="text-gray-700 mb-4">
//                   I started this journey in 2020 under the name <strong>9NUTZ MILLETS Pvt. Ltd.</strong> — committed to providing value-added foods made with millets that avoid sugar, refined flour (maida), and excessive carbohydrates.
//                 </p>

//                 <div className="mt-6 flex flex-wrap gap-3">
//                   <Link href="/products" className="inline-block bg-emerald-700 text-white px-5 py-3 rounded-lg font-medium hover:bg-emerald-600 transition">
//                     Explore Products
//                   </Link>
//                   <Link href="/contact" className="inline-block border border-emerald-700 text-emerald-700 px-5 py-3 rounded-lg hover:bg-emerald-50 transition">
//                     Contact Us
//                   </Link>
//                 </div>
//               </div>

//               {/* right: small carousel */}
//               <div className="relative h-64 md:h-80 p-4 flex items-center justify-center">
//                 <div
//                   className="w-full h-full rounded-xl overflow-hidden relative"
//                   onMouseEnter={stopAutoplay}
//                   onMouseLeave={startAutoplay}
//                 >
//                   <img
//                     src={AboutImage}
//                     alt={CAROUSEL_IMAGES[index].alt}
//                     className="w-full h-full object-cover block"
//                     loading="lazy"
//                     style={{ display: "block" }}
//                   />

//                   {/* caption */}
//                   <div className="absolute bottom-4 left-4 bg-black/40 text-white text-sm px-3 py-1 rounded-md">
//                     {CAROUSEL_IMAGES[index].alt}
//                   </div>

//                   {/* Prev / Next controls */}
//                   <button
//                     aria-label="Previous"
//                     onClick={prev}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
//                   >
//                     <ChevronLeft className="w-5 h-5 text-emerald-700" />
//                   </button>
//                   <button
//                     aria-label="Next"
//                     onClick={next}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
//                   >
//                     <ChevronRight className="w-5 h-5 text-emerald-700" />
//                   </button>

//                   {/* indicators */}
//                   <div className="absolute right-4 top-4 flex space-x-2">
//                     {CAROUSEL_IMAGES.map((_, i) => (
//                       <button
//                         key={i}
//                         onClick={() => { stopAutoplay(); setIndex(i); }}
//                         className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/60"}`}
//                         aria-label={`Go to slide ${i + 1}`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Mission + Products description */}
//           <section className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story & Products</h2>

//             <div className="prose max-w-none text-gray-700">
//               <p>
//                 By sticking to our commitment of providing value-added foods made with millets—free from sugar, refined
//                 flour (maida), and high levels of carbohydrates—we offer a wide range of snacks made with 9 types of millets:
//               </p>

//               <ul>
//                 <li>Traditionally made sweets</li>
//                 <li>Biscuits & millet cookies</li>
//                 <li>Millet chocolates</li>
//                 <li>Chikkis (jaggery-based sweet cakes)</li>
//                 <li>Nutri bars & energy bites</li>
//                 <li>Namkeens (savory snacks)</li>
//                 <li>Breakfast premixes & healthy chips</li>
//               </ul>

//               <p>
//                 Our target customers include students (schools & colleges), hospitals, IT companies and any group that wants
//                 to make healthier snack choices. We want to contribute to a healthy future for our youth — enabling better
//                 food choices and healthier lives.
//               </p>
//             </div>
//           </section>

//           {/* What makes us different */}
//           <section className="grid gap-6 md:grid-cols-2 mb-8">
//             <div className="bg-white rounded-2xl shadow-sm border p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">What Makes Us Different</h3>

//               <ul className="space-y-4 text-gray-700">
//                 <li className="flex items-start gap-3">
//                   <div className="w-9 h-9 rounded-md bg-green-50 text-green-700 flex items-center justify-center font-bold">🌱</div>
//                   <div>
//                     <strong>Farm-Fresh Ingredients</strong>
//                     <div className="text-sm text-gray-600">We source directly from trusted farms to ensure the purest millets, nuts, and natural ingredients.</div>
//                   </div>
//                 </li>

//                 <li className="flex items-start gap-3">
//                   <div className="w-9 h-9 rounded-md bg-green-50 text-green-700 flex items-center justify-center font-bold">💪</div>
//                   <div>
//                     <strong>Health-First Recipes</strong>
//                     <div className="text-sm text-gray-600">Products crafted to support healthy lifestyles — high in fiber and nutrients.</div>
//                   </div>
//                 </li>

//                 <li className="flex items-start gap-3">
//                   <div className="w-9 h-9 rounded-md bg-green-50 text-green-700 flex items-center justify-center font-bold">🍯</div>
//                   <div>
//                     <strong>No Compromise on Taste</strong>
//                     <div className="text-sm text-gray-600">Traditional recipes meet modern nutrition — wholesome AND delicious.</div>
//                   </div>
//                 </li>

//                 <li className="flex items-start gap-3">
//                   <div className="w-9 h-9 rounded-md bg-green-50 text-green-700 flex items-center justify-center font-bold">🌾</div>
//                   <div>
//                     <strong>Empowering Indian Agriculture</strong>
//                     <div className="text-sm text-gray-600">We support local farmers and promote millets & superfoods for sustainability.</div>
//                   </div>
//                 </li>

//                 <li className="flex items-start gap-3">
//                   <div className="w-9 h-9 rounded-md bg-green-50 text-green-700 flex items-center justify-center font-bold">♻️</div>
//                   <div>
//                     <strong>Sustainable Practices</strong>
//                     <div className="text-sm text-gray-600">From eco-friendly packaging to reduced kitchen waste, we work to protect the planet.</div>
//                   </div>
//                 </li>
//               </ul>
//             </div>

//             {/* Vision / target customers */}
//             <div className="bg-white rounded-2xl shadow-sm border p-8">
//               <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Vision</h3>
//               <p className="text-gray-700 mb-4">
//                 To be the go-to brand for nutritious, tasty snacks across India — empowering families to choose health without sacrificing flavor.
//               </p>

//               <h4 className="font-semibold text-gray-900 mb-2">Target customers</h4>
//               <p className="text-gray-700 mb-4">
//                 Students, schools & colleges, hospitals, corporate offices (IT & others), gifting & events — anyone seeking healthier snacking options.
//               </p>

//               <div>
//                 <h4 className="font-semibold text-gray-900 mb-2">How we help</h4>
//                 <ul className="list-disc pl-5 text-gray-700">
//                   <li>Nutritious alternatives to common snacks</li>
//                   <li>Bulk & event supply</li>
//                   <li>Gifting-ready packaging and combos</li>
//                 </ul>
//               </div>
//             </div>
//           </section>

//           {/* CTA & closing */}
//           <section className="bg-white rounded-2xl shadow-sm border p-8 mb-8 text-center">
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">Join us in making snacking healthier</h3>
//             <p className="text-gray-700 mb-6">
//               Whether you’re a customer, a retailer, or someone interested in partnering — we’d love to hear from you.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/products" className="inline-block bg-emerald-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition">
//                 Shop Now
//               </Link>
//               <Link href="/franchise" className="inline-block border border-emerald-700 text-emerald-700 px-6 py-3 rounded-lg hover:bg-emerald-50 transition">
//                 Franchise With Us
//               </Link>
//               <Link href="/contact" className="inline-block bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
//                 Contact Team
//               </Link>
//             </div>
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }
"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutImage from "../../assests/9nutz_about.jpg";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => {}}
        onLocationClick={() => {}}
        onCartClick={() => {}}
        cartItemCount={0}
        cartTotal={0}
      />

      <main className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero / top section */}
          <section className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* left: text */}
              <div className="p-8 sm:p-12">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-800 mb-4">
                  9NUTZ MILLETS
                </h1>

                <p className="text-gray-700 mb-4">
                  In 2020, during the global pandemic, we saw people forced into unhealthy choices because healthier options weren't available or convenient.
                  That sparked a question: <em>why can't traditional, healthier snacks be as accessible as fast food?</em> That's how our entrepreneurial journey began — and 9NUTZ MILLETS was born.
                </p>

                <p className="text-gray-700 mb-4">
                  Our mission is to revolutionize snacking habits across India by offering nutritious alternatives that empower families to make healthier choices.
                  We aim to <strong>un-junk the snacks</strong>, enrich lives with millets, and promote well-being through mindful eating.
                </p>

                <p className="text-gray-700 mb-4">
                  I started this journey in 2020 under the name <strong>9NUTZ MILLETS Pvt. Ltd.</strong> — committed to providing value-added foods made with millets that avoid sugar, refined flour (maida), and excessive carbohydrates.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/products" className="inline-block bg-emerald-700 text-white px-5 py-3 rounded-lg font-medium hover:bg-emerald-600 transition">
                    Explore Products
                  </Link>
                  <Link href="/contact" className="inline-block border border-emerald-700 text-emerald-700 px-5 py-3 rounded-lg hover:bg-emerald-50 transition">
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* right: single image */}
              <div className="relative h-64 md:h-80 p-4 flex items-center justify-center">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src={"https://9nutz.com/wp-content/uploads/2025/06/Millet_Murukku_19-1000x1000.webp"}
                    alt="About 9Nutz: assorted healthy snacks"
                    className="w-full h-full object-cover block"
                    // loading="lazy"
                    style={{ display: "block" }}
                  />

                  {/* caption */}
                  <div className="absolute bottom-4 left-4 bg-black/40 text-white text-sm px-3 py-1 rounded-md">
                    About 9Nutz
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission + Products description */}
          <section className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story & Products</h2>

            <div className="prose max-w-none text-gray-700">
              <p>
                By sticking to our commitment of providing value-added foods made with millets—free from sugar, refined
                flour (maida), and high levels of carbohydrates—we offer a wide range of snacks made with 9 types of millets:
              </p>

              <ul>
                <li>Traditionally made sweets</li>
                <li>Biscuits & millet cookies</li>
                <li>Millet chocolates</li>
                <li>Chikkis (jaggery-based sweet cakes)</li>
                <li>Nutri bars & energy bites</li>
                <li>Namkeens (savory snacks)</li>
                <li>Breakfast premixes & healthy chips</li>
              </ul>

              <p>
                Our target customers include students (schools & colleges), hospitals, IT companies and any group that wants
                to make healthier snack choices. We want to contribute to a healthy future for our youth — enabling better
                food choices and healthier lives.
              </p>
            </div>
          </section>

          {/* What makes us different */}
          <section className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What Makes Us Different</h3>

              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-green-50 text-green-700 flex items-center justify-center font-bold">🌱</div>
                  <div>
                    <strong>Farm-Fresh Ingredients</strong>
                    <div className="text-sm text-gray-600">We source directly from trusted farms to ensure the purest millets, nuts, and natural ingredients.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-green-50 text-green-700 flex items-center justify-center font-bold">💪</div>
                  <div>
                    <strong>Health-First Recipes</strong>
                    <div className="text-sm text-gray-600">Products crafted to support healthy lifestyles — high in fiber and nutrients.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-green-50 text-green-700 flex items-center justify-center font-bold">🍯</div>
                  <div>
                    <strong>No Compromise on Taste</strong>
                    <div className="text-sm text-gray-600">Traditional recipes meet modern nutrition — wholesome AND delicious.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-green-50 text-green-700 flex items-center justify-center font-bold">🌾</div>
                  <div>
                    <strong>Empowering Indian Agriculture</strong>
                    <div className="text-sm text-gray-600">We support local farmers and promote millets & superfoods for sustainability.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-green-50 text-green-700 flex items-center justify-center font-bold">♻️</div>
                  <div>
                    <strong>Sustainable Practices</strong>
                    <div className="text-sm text-gray-600">From eco-friendly packaging to reduced kitchen waste, we work to protect the planet.</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Vision / target customers */}
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-700 mb-4">
                To be the go-to brand for nutritious, tasty snacks across India — empowering families to choose health without sacrificing flavor.
              </p>

              <h4 className="font-semibold text-gray-900 mb-2">Target customers</h4>
              <p className="text-gray-700 mb-4">
                Students, schools & colleges, hospitals, corporate offices (IT & others), gifting & events — anyone seeking healthier snacking options.
              </p>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How we help</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>Nutritious alternatives to common snacks</li>
                  <li>Bulk & event supply</li>
                  <li>Gifting-ready packaging and combos</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA & closing */}
          <section className="bg-white rounded-2xl shadow-sm border p-8 mb-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Join us in making snacking healthier</h3>
            <p className="text-gray-700 mb-6">
              Whether you’re a customer, a retailer, or someone interested in partnering — we’d love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="inline-block bg-emerald-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition">
                Shop Now
              </Link>
              <Link href="/franchise" className="inline-block border border-emerald-700 text-emerald-700 px-6 py-3 rounded-lg hover:bg-emerald-50 transition">
                Franchise With Us
              </Link>
              <Link href="/contact" className="inline-block bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
                Contact Team
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
