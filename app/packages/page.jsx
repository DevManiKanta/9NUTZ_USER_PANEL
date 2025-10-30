// "use client";
// import { useState } from "react";
// import testImage from "../../assests/LOGO.jpg";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// const PACKAGES = [
//   {
//     id: "sweet-starter",
//     name: "Sweet Starter Box",
//     subtitle: "A delightful sampler of our best sweets",
//     priceOneTime: 299,
//     priceMonthly: 0,
//     savingsPercent: 0,
//     image:testImage, 
//     features: [
//       "6 assorted traditional sweets",
//       "Hand-packed for freshness",
//       "Perfect for gifting & snacking",
//       "Ingredient card included",
//     ],
//   },
//   {
//     id: "nutz-deluxe",
//     name: "9 Nutz Deluxe Jar",
//     subtitle: "Premium mixed nuts — roasted & salted",
//     priceOneTime: 899,
//     priceMonthly: 0,
//     savingsPercent: 10,
//      image:testImage, 
//     features: [
//       "500g mixed premium nuts",
//       "Roasted & lightly salted",
//       "High-protein snack",
//       "Re-sealable premium jar",
//     ],
//   },
//   {
//     id: "festive-combo",
//     name: "Festive Combo",
//     subtitle: "Sweets + Nuts combo for celebrations",
//     priceOneTime: 1299,
//     priceMonthly: 0,
//     savingsPercent: 18,
//    image:testImage, 
//     features: [
//       "10 assorted sweets (medium)",
//       "250g mixed premium nuts",
//       "Attractive gift packaging",
//       "Free greeting card",
//     ],
//   },
//   {
//     id: "party-pack",
//     name: "Party Pack",
//     subtitle: "Shareable pack for small gatherings",
//     priceOneTime: 1999,
//     priceMonthly: 0,
//     savingsPercent: 22,
//     image:testImage, 
//     features: [
//       "20 assorted sweets (large)",
//       "1kg mixed nuts pouch",
//       "Eco-friendly boxes",
//       "Bulk discount applied",
//     ],
//   },
// ];
// const currency = (n) => `Rs.${Number(n).toLocaleString("en-IN")}`;

// export default function Packages() {
//   const [selected, setSelected] = useState(null); // selected package object for details
//   const [chosen, setChosen] = useState(null); // chosen package id (selected by user)

//   const openDetails = (pkg) => setSelected(pkg);
//   const closeDetails = () => setSelected(null);

//   const handleChoose = (pkg) => {
//     setChosen(pkg.id);
//   };
//   return (
//     <>
//     {/* <Header/> */}
//     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <header className="mb-8 text-left">
//         <h1 className="text-3xl sm:text-2xl font-extrabold text-gray-900">Combo Packs</h1>
//       </header>
//       <section
//         aria-label="Combo packages"
//         className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//       >
//         {PACKAGES?.map((pkg) => {
//           const isSelected = chosen === pkg.id;
//           return (
//             <article
//               key={pkg.id}
//               className={`relative bg-white rounded-2xl shadow-md overflow-hidden border transition-transform transform hover:-translate-y-1`}
//             >

//               <div className="h-44 sm:h-48 lg:h-40 xl:h-44 w-full overflow-hidden bg-gray-100">
//                 <img
//                   src={testImage}
//                   alt={`${pkg.name} image`}
//                   onError={(e) => {
//                     e.currentTarget.src = "/placeholder.png";
//                   }}
//                   className="w-full h-full object-cover object-center"
//                 />
//               </div>

//               {/* body */}
//               <div className="p-4 sm:p-5 flex flex-col h-full">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h2 className="text-lg font-semibold text-gray-900">{pkg.name}</h2>
//                     <p className="text-xs sm:text-sm text-gray-500 mt-1">{pkg.subtitle}</p>
//                   </div>

//                   {/* badge */}
//                   <div className="text-right">
//                     {pkg.savingsPercent > 0 ? (
//                       <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
//                         Save {pkg.savingsPercent}%
//                       </div>
//                     ) : (
//                       <div className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
//                         Bestseller
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* price */}
//                 <div className="mt-4 mb-3 flex items-baseline gap-3">
//                   <div>
//                     <div className="text-2xl font-bold text-gray-900">
//                       {pkg.priceMonthly ? currency(pkg.priceMonthly) + "/mo" : currency(pkg.priceOneTime)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {pkg.priceMonthly ? `One-time: ${currency(pkg.priceOneTime)}` : "One-time rate"}
//                     </div>
//                   </div>

//                   <div className="ml-auto text-right">
//                     <div className="text-sm text-gray-500">Upfront / One-time</div>
//                   </div>
//                 </div>

//                 {/* features */}
//                 <ul className="mt-2 mb-4 flex-1 space-y-2 text-sm text-gray-600">
//                   {pkg.features.map((f, i) => (
//                     <li key={i} className="flex items-start gap-2">
//                       <svg
//                         className="w-4 h-4 mt-1 text-amber-600 flex-shrink-0"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         aria-hidden
//                       >
//                         <path d="M20 6L9 17l-5-5" />
//                       </svg>
//                       <span>{f}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 {/* actions */}
//                 <div className="mt-3 flex items-center gap-3">
//                   <button
//                     onClick={() => handleChoose(pkg)}
//                     className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium shadow-sm transition
//                       ${isSelected ? "bg-rose-600 text-white" : "bg-white border border-rose-600 text-rose-600 hover:bg-rose-50"}`}
//                     aria-pressed={isSelected}
//                   >
//                     {isSelected ? "Selected" : "Select"}
//                   </button>

//                   <button
//                     onClick={() => openDetails(pkg)}
//                     className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
//                     aria-haspopup="dialog"
//                     aria-controls={`pkg-details-${pkg.id}`}
//                   >
//                     Details
//                   </button>
//                 </div>
//               </div>
//             </article>
//           );
//         })}
//       </section>

//       {/* details drawer (simple inline panel) */}
//       {selected && (
//         <div
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="package-details-title"
//           className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4 sm:p-6"
//         >
//           {/* overlay */}
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//             onClick={closeDetails}
//             aria-hidden="true"
//           />

//           <div
//             id={`pkg-details-${selected.id}`}
//             className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-auto"
//             style={{ maxHeight: "85vh" }}
//           >
//             <div className="flex items-start gap-4 p-4 sm:p-6">
//               <img
//                 src={selected.image}
//                 alt={`${selected.name} preview`}
//                 onError={(e) => (e.currentTarget.src = "/placeholder.png")}
//                 className="w-28 h-20 object-cover rounded-lg flex-shrink-0"
//               />
//               <div className="flex-1">
//                 <h3 id="package-details-title" className="text-xl font-semibold text-gray-900">
//                   {selected.name}
//                 </h3>
//                 <p className="text-sm text-gray-500 mt-1">{selected.subtitle}</p>

//                 <div className="mt-4 flex items-center gap-6">
//                   <div>
//                     <div className="text-2xl font-bold">
//                       {selected.priceMonthly ? currency(selected.priceMonthly) + "/mo" : currency(selected.priceOneTime)}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {selected.priceMonthly ? `One-time: ${currency(selected.priceOneTime)}` : "One-time rate"}
//                     </div>
//                   </div>

//                   <div className="text-sm text-gray-600">
//                     <div><strong>What's inside:</strong></div>
//                     <ul className="mt-2 space-y-1">
//                       {selected.features.map((f, i) => (
//                         <li key={i} className="flex items-start gap-2">
//                           <span className="text-amber-600">•</span>
//                           <span>{f}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//                 <div className="mt-6 flex items-center gap-3">
//                   <button
//                     onClick={() => {
//                       handleChoose(selected);
//                       closeDetails();
//                     }}
//                     className="px-4 py-2 rounded-lg bg-rose-600 text-white font-medium"
//                   >
//                     Choose this pack
//                   </button>
//                   <button
//                     onClick={closeDetails}
//                     className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//     {/* <Footer/> */}
//     </>
//   );
// }
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import testImage from "../../assests/test.jpg";

const PACKAGES = [
  {
    id: "sweet-starter",
    name: "Sweet Starter Box",
    subtitle: "A delightful sampler of our best sweets",
    priceOneTime: 299,
    priceMonthly: 0,
    savingsPercent: 0,
    image:testImage, 
    features: [
      "6 assorted traditional sweets",
      "Hand-packed for freshness",
      "Perfect for gifting & snacking",
      "Ingredient card included",
    ],
  },
  {
    id: "nutz-deluxe",
    name: "9 Nutz Deluxe Jar",
    subtitle: "Premium mixed nuts — roasted & salted",
    priceOneTime: 899,
    priceMonthly: 0,
    savingsPercent: 10,
    image: testImage,
    features: [
      "500g mixed premium nuts",
      "Roasted & lightly salted",
      "High-protein snack",
      "Re-sealable premium jar",
    ],
  },
  {
    id: "festive-combo",
    name: "Festive Combo",
    subtitle: "Sweets + Nuts combo for celebrations",
    priceOneTime: 1299,
    priceMonthly: 0,
    savingsPercent: 18,
    image:testImage,
    features: [
      "10 assorted sweets (medium)",
      "250g mixed premium nuts",
      "Attractive gift packaging",
      "Free greeting card",
    ],
  },
  {
    id: "party-pack",
    name: "Party Pack",
    subtitle: "Shareable pack for small gatherings",
    priceOneTime: 1999,
    priceMonthly: 0,
    savingsPercent: 22,
    image:testImage,
    features: [
      "20 assorted sweets (large)",
      "1kg mixed nuts pouch",
      "Eco-friendly boxes",
      "Bulk discount applied",
    ],
  },
];

const currency = (n) => `Rs.${Number(n).toLocaleString("en-IN")}`;

export default function Packages() {
  const [selected, setSelected] = useState(null);
  const [chosen, setChosen] = useState(null);

  const openDetails = (pkg) => setSelected(pkg);
  const closeDetails = () => setSelected(null);

  const handleChoose = (pkg) => setChosen(pkg.id);
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-left">
          <h1 className="text-3xl sm:text-2xl font-extrabold text-gray-900">
            Combo Packs
          </h1>
        </header>

        <section
          aria-label="Combo packages"
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {PACKAGES.map((pkg) => {
            const isSelected = chosen === pkg.id;
            return (
              <article
                key={pkg.id}
                className="relative bg-white rounded-2xl shadow-md overflow-hidden border transition-transform transform hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative w-full h-44 sm:h-48 lg:h-40 xl:h-44 bg-gray-100">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={(e) => {
                      const img = e.target;
                      // if (img && img.src !== "/placeholder.png") {
                      //   img.src = "/placeholder.png";
                      // }
                    }}
                  />
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {pkg.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {pkg.subtitle}
                      </p>
                    </div>

                    {/* Badge */}
                    <div className="text-right">
                      {pkg.savingsPercent > 0 ? (
                        <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          Save {pkg.savingsPercent}%
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                          Bestseller
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 mb-3 flex items-baseline gap-3">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {pkg.priceMonthly
                          ? `${currency(pkg.priceMonthly)}/mo`
                          : currency(pkg.priceOneTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {pkg.priceMonthly
                          ? `One-time: ${currency(pkg.priceOneTime)}`
                          : "One-time rate"}
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-sm text-gray-500">Upfront / One-time</div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="mt-2 mb-4 flex-1 space-y-2 text-sm text-gray-600">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 mt-1 text-amber-600 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Buttons */}
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => handleChoose(pkg)}
                      className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium shadow-sm transition ${
                        isSelected
                          ? "bg-rose-600 text-white"
                          : "bg-white border border-rose-600 text-rose-600 hover:bg-rose-50"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>

                    <button
                      onClick={() => openDetails(pkg)}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Details Modal */}
        {selected && (
          <div
            className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeDetails}
              aria-hidden="true"
            />

            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-auto max-h-[85vh]">
              <div className="flex items-start gap-4 p-4 sm:p-6">
                <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={selected.image || "/placeholder.png"}
                    alt={selected.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="140px"
                    onError={(e) => {
                      const img = e.target;
                      if (img && img.src !== "/placeholder.png") {
                        img.src = "/placeholder.png";
                      }
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selected.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{selected.subtitle}</p>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-6">
                    <div>
                      <div className="text-2xl font-bold">
                        {selected.priceMonthly
                          ? `${currency(selected.priceMonthly)}/mo`
                          : currency(selected.priceOneTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {selected.priceMonthly
                          ? `One-time: ${currency(selected.priceOneTime)}`
                          : "One-time rate"}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mt-4 sm:mt-0">
                      <strong>What's inside:</strong>
                      <ul className="mt-2 space-y-1">
                        {selected.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-600">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => {
                        handleChoose(selected);
                        closeDetails();
                      }}
                      className="px-4 py-2 rounded-lg bg-rose-600 text-white font-medium"
                    >
                      Choose this pack
                    </button>
                    <button
                      onClick={closeDetails}
                      className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
