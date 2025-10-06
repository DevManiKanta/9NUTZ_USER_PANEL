'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Grid, List, Filter, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  weight: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  subcategoryId: number;
}

interface SubcategoryClientProps {
  products: Product[];
}

export default function SubcategoryClient({ products }: SubcategoryClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');

  return (
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

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex items-center space-x-4 p-4' : 'p-4'
              }`}
            >
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={`object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform ${
                    viewMode === 'list' ? 'w-20 h-20 flex-shrink-0' : 'w-full h-32 mb-3'
                  }`}
                />
              </Link>
              <div className="flex-1">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2 hover:text-green-600 cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mb-1">{product.brand} • {product.weight}</p>
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
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
          <p className="text-gray-500">Products will be available soon in this subcategory.</p>
        </div>
      )}
    </div>
  );
}