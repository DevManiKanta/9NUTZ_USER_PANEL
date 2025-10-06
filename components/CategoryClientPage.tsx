'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Grid, List, Filter, SortAsc } from 'lucide-react';
import { categories, sampleProducts, getCategoryById } from '@/lib/categories';

interface CategoryClientPageProps {
  category: any;
  categoryProducts: any[];
  slug: string;
}

export default function CategoryClientPage({ category, categoryProducts, slug }: CategoryClientPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [filterBy, setFilterBy] = useState('all');

  if (!category) {
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
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{category.name}</span>
            </div>
          </div>
        </div>

        {/* Category Header */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start space-x-6">
              <img
                src={category.image}
                alt={category.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{category.itemCount} products available</span>
                  <span>•</span>
                  <span>Delivery in 8-15 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategories */}
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop by Category</h2> */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {category.subcategories.map((subcategory: any) => (
                <Link
                  key={subcategory.id}
                  href={`/category/${category.slug}/${subcategory.slug}`}
                  className="group text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                    {subcategory.image ? (
                      <img
                        src={subcategory.image}
                        alt={subcategory.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-green-200 rounded"></div>
                    )}
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                    {subcategory.name}
                  </h3>
                  <p className="text-xs text-gray-500">{subcategory.itemCount} items</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Sort */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          {categoryProducts.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
                : 'grid-cols-1'
            }`}>
              {categoryProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${
                    viewMode === 'list' ? 'flex items-center space-x-4 p-4' : 'p-4'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`object-cover rounded-lg ${
                      viewMode === 'list' ? 'w-20 h-20 flex-shrink-0' : 'w-full h-32 mb-3'
                    }`}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{product.weight}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Grid className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Products will be available soon in this category.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}