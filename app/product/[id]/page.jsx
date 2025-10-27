// // app/product/[id]/page.jsx
// // Server component (no "use client")
// import React from "react";
// import Link from "next/link";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { useProducts } from "@/contexts/ProductContext";

// // Required by `output: "export"` for dynamic routes.
// // Returning an empty array is acceptable if you don't want to pre-generate any product pages.
//   // const { products } = useProducts() || { products: [] };

//   // console.log("Products",products)
// export async function generateStaticParams() {
//   return [
//     { id: "42" },
//     { id: "40" },
//     { id: "43" }, 
//   ];
// }
// export default function ProductPage({ params }) {
//   const { id } = params;
//   const product = {
//     id,
//     title: `Product ${id}`,
//     price: 999,
//     shortDesc: "This is a static placeholder product page. Replace with real data when ready.",
//     image: "/placeholder-1200x800.png",
//   };

//   return (
//     <div>
//       <Header/>
//     <main className="min-h-screen w-full bg-white">
//       {/* Simple hero */}
//       <section className="w-full bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 py-12">
//           <div className="rounded-xl overflow-hidden shadow-lg">
//             <div className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] relative bg-gray-200">
//               <img
//                 src={product.image}
//                 alt={product.title}
//                 className="w-full h-full object-cover"
//                 // onError={(e) => (e.currentTarget.src = "/placeholder-1200x800.png")}
//               />
//             </div>

//             <div className="p-6 md:p-8 bg-white">
//               <div className="max-w-3xl mx-auto text-center">
//                 <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3">{product.title}</h1>
//                 <p className="text-gray-600 mb-4">{product.shortDesc}</p>

//                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                   <div className="text-2xl font-semibold">₹{Number(product.price).toLocaleString()}</div>
//                   <Link href="/" className="inline-block px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
//                     Back to shop
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Basic details area */}
//       <section className="max-w-6xl mx-auto px-4 py-12">
//         <div className="prose max-w-none">
//           <h2>About this product</h2>
//           <p>
//             This page displays static data and a static image for product <strong>{product.id}</strong>. Replace the `product` object
//             with real data or wire it to your context / API when you're ready.
//           </p>
//         </div>
//       </section>
//     </main>
//     <Footer/>
//     </div>
//   );
// }


// app/product/[id]/page.jsx
// app/product/[id]/page.jsx
import React from "react";
import ProductPageClient from "@/app/product/ProductPageClient";

export async function generateStaticParams() {
  // Provide a minimal set so Next can statically export dynamic route
  return [
    { id: "51" },
    { id: "46" },
    { id: "48" },
  ];
}

export default function ProductPage({ params }) {
  const { id } = params || {};
  return <ProductPageClient id={String(id || "")} />;
}

