import React from 'react';
import Link from 'next/link';
import MinimalHeaderClient from '@/components/MinimalHeaderClient';
import Footer from '@/components/Footer';
import { ArrowLeft, Grid, List, Filter, Star } from 'lucide-react';
import { categories, sampleProducts } from '@/lib/categories';
import SubcategoryClient from '@/components/SubcategoryClient';

interface PageProps {
  params: {
    slug: string;
    subcategory: string;
  };
}

export async function generateStaticParams() {
  const paths: { slug: string; subcategory: string }[] = [];
  
  categories.forEach(category => {
    category.subcategories.forEach(subcategory => {
      paths.push({
        slug: category.slug,
        subcategory: subcategory.slug
      });
    });
  });
  
  return paths;
}

export default function SubcategoryPage({ params }: PageProps) {
  const categorySlug = params.slug;
  const subcategorySlug = params.subcategory;
  
  const category = categories.find(cat => cat.slug === categorySlug);
  const subcategory = category?.subcategories.find(sub => sub.slug === subcategorySlug);

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link href="/" className="text-green-600 hover:text-green-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Mock products for this subcategory
  const subcategoryProducts = sampleProducts.filter(p => p.subcategoryId === subcategory.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <MinimalHeaderClient />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href={`/category/${category.slug}`} className="text-gray-500 hover:text-gray-700">
                {category.name}
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{subcategory.name}</span>
            </div>
          </div>
        </div>

        {/* Subcategory Header */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start space-x-6">
              {subcategory.image && (
                <img
                  src={subcategory.image}
                  alt={subcategory.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{subcategory.name}</h1>
                <p className="text-gray-600 mb-4">Fresh and quality {subcategory.name.toLowerCase()} delivered in minutes</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{subcategory.itemCount} products available</span>
                  <span>•</span>
                  <span>Delivery in 8-15 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Items */}
        {subcategory.popularItems && (
          <div className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular in {subcategory.name}</h2>
              <div className="flex flex-wrap gap-2">
                {subcategory.popularItems.map((item, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Client-side Products Section */}
        <SubcategoryClient products={subcategoryProducts} />
      </main>
      
      <Footer />
    </div>
  );
}