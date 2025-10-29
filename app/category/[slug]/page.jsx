// app/category/[slug]/page.jsx
import React from "react";
// import MinimalHeaderClient from "@/components/MinimalHeaderClient";
import CategoryProductsClient from "@/components/CategoryProductsClient";

export const dynamicParams = true;

export default function CategoryPage({ params }) {
  const slug = params?.slug ?? "";

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Client-side product loader */}
        <CategoryProductsClient identifier={slug} />
      </main>
    </div>
  );
}
