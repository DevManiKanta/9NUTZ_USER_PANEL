"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';


const filterCategories = [
  { value: 'all', label: 'All Categories', count: 'View All' },
  { value: 'Fruits & Vegetables', label: 'Fruits & Vegetables', count: '12 items' },
  { value: 'Dairy, Bread & Eggs', label: 'Dairy, Bread & Eggs', count: '8 items' },
  { value: 'Snacks & Munchies', label: 'Snacks & Munchies', count: '10 items' },
  { value: 'Cold Drinks & Juices', label: 'Cold Drinks & Juices', count: '6 items' },
  { value: 'Bakery & Biscuits', label: 'Bakery & Biscuits', count: '7 items' },
  { value: 'Tea, Coffee & Health Drink', label: 'Tea, Coffee & Health', count: '5 items' },
  { value: 'Instant & Frozen Food', label: 'Instant & Frozen Food', count: '8 items' },
  { value: 'Personal Care', label: 'Personal Care', count: '9 items' }
];

export default function CategoryFilter({ onCategoryChange, selectedCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const selectedCategoryData = filterCategories.find(cat => cat.value === selectedCategory);

  const handleCategorySelect = (category) => {
    setIsAnimating(true);
    setIsOpen(false);
    
    // Delay the filter change to allow for smooth transition
    setTimeout(() => {
      onCategoryChange(category);
      setIsAnimating(false);
    }, 150);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target 
      if (!target.closest('.category-filter-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filter Title */}
        <div className="flex items-center space-x-2">
          {/* <Filter className="h-5 w-5 text-green-600" /> */}
          {/* <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2> */}
          {isAnimating && (
            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin ml-2"></div>
          )}
        </div>

      </div>

      {/* Filter Info */}
      {selectedCategory !== 'all' && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <span className="font-medium">Filtered by:</span> {selectedCategoryData?.label}
            <button 
              onClick={() => handleCategorySelect('all')}
              className="ml-2 text-green-600 hover:text-green-700 underline font-medium"
            >
              Clear filter
            </button>
          </p>
        </div>
      )}
    </div>
  );
}