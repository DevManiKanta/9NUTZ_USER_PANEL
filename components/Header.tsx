// "use client";

// import { Search, MapPin, ShoppingCart, ChevronDown, ChevronRight } from 'lucide-react';
// import { useState, useRef, useEffect } from 'react';
// import AccountDropdown from './AccountDropdown';
// import { categories, searchProducts, getCategorySuggestions } from '@/lib/categories';
// import Link from 'next/link';
// import Logo from '../assests/LOGO.jpg';



// interface HeaderProps {
//   onLoginClick: () => void;
//   onLocationClick: () => void;
//   onCartClick: () => void;
//   cartItemCount: number;
//   cartTotal: number;
// }

// export default function Header({
//   onLoginClick,
//   onLocationClick,
//   onCartClick,
//   cartItemCount,
//   cartTotal
// }: HeaderProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
//   const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
//   const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
  
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const categoryDropdownRef = useRef<HTMLDivElement>(null);
//   const searchRef = useRef<HTMLDivElement>(null);

//   // Handle search input changes
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const query = e.target.value;
//     setSearchQuery(query);
    
//     if (query.length > 1) {
//       const productResults = searchProducts(query);
//       const categoryResults = getCategorySuggestions(query);
      
//       const suggestions = [
//         ...categoryResults.map(cat => ({ type: 'category', ...cat })),
//         ...productResults.slice(0, 5).map(product => ({ type: 'product', ...product }))
//       ];
      
//       setSearchSuggestions(suggestions);
//       setShowSuggestions(true);
//     } else {
//       setShowSuggestions(false);
//     }
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
//         setIsCategoryDropdownOpen(false);
//         setHoveredCategory(null);
//       }
//       if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handle search submission
//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       // Navigate to search results page
//       window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
//     }
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40 border-b border-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Left Section - Logo and Categories */}
//         <div className="flex items-center space-x-6">
//   {/* Logo */}
//   <Link href="/" className="flex items-center space-x-2">
//     <img
//       src="Logo"
//       alt="9NUTZ"
//       className="h-8 w-auto object-contain" // Adjust height as needed
//     />
//   </Link>

//   {/* Location - Desktop Only */}
//   <button
//     onClick={onLocationClick}
//     className="hidden lg:flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
//     aria-label="Change delivery location"
//   >
//   </button>
// </div>

//           {/* Search Bar */}
//           <div className="flex-1 max-w-3xl mx-6 relative" ref={searchRef}>
//             <form onSubmit={handleSearchSubmit}>
//               {/* Search Input - Full Width */}
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   type="text"
//                   placeholder="Search for products..."
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
//                   aria-label="Search products"
//                 />
                  
//                 {/* Search Suggestions */}
//                 {showSuggestions && searchSuggestions.length > 0 && (
//                   <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
//                     {searchSuggestions.map((suggestion, index) => (
//                       <Link
//                         key={`${suggestion.type}-${suggestion.id || index}`}
//                         href={
//                           suggestion.type === 'category' 
//                             ? `/category/${suggestion.slug}`
//                             : `/product/${suggestion.id}`
//                         }
//                         className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
//                         onClick={() => setShowSuggestions(false)}
//                       >
//                         {suggestion.image && (
//                           <img
//                             src={suggestion.image}
//                             alt={suggestion.name}
//                             className="w-8 h-8 rounded object-cover flex-shrink-0"
//                           />
//                         )}
//                         <div className="flex-1 min-w-0">
//                           <div className="font-medium text-sm text-gray-900 truncate">
//                             {suggestion.name}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {suggestion.type === 'category' ? 'Category' : `${suggestion.brand} • ${suggestion.weight}`}
//                           </div>
//                         </div>
//                         {suggestion.type === 'product' && (
//                           <div className="text-sm font-semibold text-green-600">
//                             ₹{suggestion.price}
//                           </div>
//                         )}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </form>
//           </div>
//           <div className="flex items-center space-x-6">
//             <AccountDropdown onLoginClick={onLoginClick} />
//             <button
//               onClick={onCartClick}
//               className="relative bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all shadow-lg hover:shadow-xl"
//               aria-label={`Shopping cart with ${cartItemCount} items`}
//             >
//               <ShoppingCart className="h-5 w-5" />
//               <span className="hidden sm:inline">
//                 {cartItemCount} item{cartItemCount !== 1 ? 's' : ''}
//               </span>
//               <span className="font-semibold">₹{cartTotal}</span>
//               {cartItemCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
//                   {cartItemCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
        
//       </div>
//     </header>
//   );
// }

"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import AccountDropdown from "./AccountDropdown";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assests/LOGO.jpg";

interface HeaderProps {
  onLoginClick: () => void;
  onLocationClick: () => void;
  onCartClick: () => void;
  cartItemCount: number;
  cartTotal: number;
}

export default function Header({
  onLoginClick,
  onLocationClick,
  onCartClick,
  cartItemCount,
  cartTotal,
}: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const tabs = [
    { href: "/about", label: "About" },
    { href: "/our-journey", label: "Our Journey" },
    { href: "/shop", label: "Shop" },
    { href: "/shipping-methods", label: "Shipping Methods" },
    { href: "/franchise", label: "Franchise With Us" },
    { href: "/brochure", label: "Brochure" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 bg-white z-50 shadow-sm border-b border-gray-100">
      {/* Top row: logo + tabs (left) | spacer | account + cart (right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Tabs */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center" aria-label="Home">
              <Image
                src={Logo}
                alt="9NUTZ"
                width={150}
                height={40}
                className="object-contain"
                priority
              />
            </Link>

            {/* Tabs visible on md and up, placed beside logo */}
            <nav className="hidden md:flex items-center space-x-4">
              {tabs.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="text-sm text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md"
                >
                  {t.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* center spacer */}
          <div className="flex-1" />

          {/* Right: account dropdown and cart icon only */}
          <div className="flex items-center space-x-3 relative">
            <AccountDropdown onLoginClick={onLoginClick} />

            {/* Cart button with badge */}
            <button
              onClick={onCartClick}
              aria-label="Open cart"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
                  aria-label={`${cartItemCount} items in cart`}
                >
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile nav toggle */}
            <button
              className="ml-1 p-2 rounded-md md:hidden hover:bg-gray-100 transition-colors"
              onClick={() => setMobileNavOpen((s) => !s)}
              aria-expanded={mobileNavOpen}
              aria-label="Toggle navigation"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav: when toggled show tabs stacked under header */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ul className="space-y-2">
              {tabs.map((t) => (
                <li key={`mob-${t.href}`}>
                  <Link
                    href={t.href}
                    className="block text-sm text-gray-700 hover:text-gray-900 py-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
              {/* Optional login link inside mobile nav for convenience */}
              <li>
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    onLoginClick();
                  }}
                  className="w-full text-left text-sm text-gray-700 hover:text-gray-900 py-2"
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
