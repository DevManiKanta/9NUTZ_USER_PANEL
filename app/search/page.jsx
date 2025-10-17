'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Filter, Grid, List, Star } from 'lucide-react';
// import { categories, searchProducts,  } from '@/lib/categories';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'all';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const searchResults = searchProducts(query, categoryFilter === 'all' ? undefined : categoryFilter);
      setResults(searchResults);
      setLoading(false);
    }, 300);
  }, [query, categoryFilter]);

  const selectedCategory = categories.find(cat => cat.id === categoryFilter);

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
        {/* Search Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4 mb-4">
              <Search className="h-6 w-6 text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `Search results for "${query}"` : 'Search Products'}
              </h1>
            </div>
            
            {query && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{results.length} results found</span>
                {selectedCategory && (
                  <>
                    <span>•</span>
                    <span>in {selectedCategory.name}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Sort */}
          {results.length > 0 && (
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
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Searching for products...</p>
            </div>
          )}

          {/* No Results */}
          {!loading && query && results.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-6">
                Sorry, we couldn't find any products matching "{query}"
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Try:</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Checking your spelling</li>
                  <li>• Using fewer keywords</li>
                  <li>• Searching for a different product</li>
                </ul>
              </div>
            </div>
          )}

          {/* Search Results */}
          {!loading && results.length > 0 && (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
                : 'grid-cols-1'
            }`}>
              {results.map((product) => (
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
          )}

          {/* Popular Searches - shown when no query */}
          {!loading && !query && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Searches</h2>
                <div className="flex flex-wrap gap-3">
                  {['Milk', 'Bread', 'Eggs', 'Bananas', 'Onions', 'Rice', 'Oil', 'Sugar'].map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {categories.slice(0, 8).map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center"
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 rounded-lg object-cover mx-auto mb-3"
                      />
                      <h3 className="font-medium text-sm text-gray-900 group-hover:text-green-600">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500">{category.itemCount} items</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}