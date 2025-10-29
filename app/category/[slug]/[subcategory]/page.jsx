// app/category/[slug]/[subcategory]/page.jsx
import React from "react";
// import MinimalHeaderClient from "@/components/MinimalHeaderClient";
import Footer from "@/components/Footer";
import CategoryProductsClient from "@/components/CategoryProductsClient";

export const dynamicParams = true;

export default function SubcategoryPage({ params }) {
  const slug = params?.slug ?? "";
  const subcategory = params?.subcategory ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <MinimalHeaderClient /> */}
      <main className="pt-20">
        {/* Breadcrumb top area (optional) */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
            <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
            <span className="text-gray-300">/</span>
            <a href={`/category/${slug}`} className="text-gray-500 hover:text-gray-700">{slug}</a>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{subcategory}</span>
          </div>
        </div>

        {/* Client-side product loader */}
        <CategoryProductsClient identifier={`${slug}/${subcategory}`} />
      </main>
      <Footer />
    </div>
  );
}
