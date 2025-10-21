import React from 'react';
import Link from 'next/link';
import MinimalHeaderClient from '@/components/MinimalHeaderClient';
import Footer from '@/components/Footer';

export async function generateStaticParams() { 
  return [
    { slug: 'nuts', subcategory: 'almonds' },
    { slug: 'nuts', subcategory: 'walnuts' },
    { slug: 'seeds', subcategory: 'sunflower' },
    { slug: 'seeds', subcategory: 'pumpkin' },
    { slug: 'dried-fruits', subcategory: 'raisins' },
    { slug: 'dried-fruits', subcategory: 'dates' },
    { slug: 'snacks', subcategory: 'trail-mix' },
    { slug: 'snacks', subcategory: 'granola' }
  ]; 
}
export const dynamicParams = false;

export default function SubcategoryPage({ params }) {
  const categorySlug = params.slug;
  const subcategorySlug = params.subcategory;

  return (
    <div className="min-h-screen bg-gray-50">
      <MinimalHeaderClient />
      <main className="pt-20">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href={`/category/${categorySlug}`} className="text-gray-500 hover:text-gray-700">{categorySlug}</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{subcategorySlug}</span>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Category coming soon</h1>
            <p className="text-gray-600">This category page will be populated once data is available.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


