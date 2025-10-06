'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Package, TrendingUp } from 'lucide-react';
import { categories } from '@/lib/categories';

export default function AllCategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => {}}
        onLocationClick={() => {}}
        onCartClick={() => {}}
        cartItemCount={0}
        cartTotal={0}
      />
      
      <main className="pt-20">
        {/* Header */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">All Categories</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse through our wide range of categories. From fresh produce to household essentials, 
                we have everything you need delivered in minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.filter(cat => cat.featured).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{category.itemCount} products</span>
                      <span className="text-green-600 font-medium group-hover:underline">
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* All Categories */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{category.itemCount} products</p>
                  <div className="space-y-1">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <div key={sub.id} className="text-xs text-gray-400">
                        {sub.name}
                      </div>
                    ))}
                    {category.subcategories.length > 3 && (
                      <div className="text-xs text-green-600 font-medium">
                        +{category.subcategories.length - 3} more
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}