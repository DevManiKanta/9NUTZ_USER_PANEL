"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import AccountDropdown from "./AccountDropdown";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assests/LOGO.jpg";

export default function Header({ onLoginClick, onLocationClick, onCartClick, cartItemCount, cartTotal }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { token, logout } = useAuth();
  const hasToken = Boolean(token);

  const tabs = [
    { href: "", label: "Shop" },
    { href: "/packages", label: "Packages" },
    { href: "/shippingmethods", label: "Shipping Methods" },
    { href: "/franchise", label: "Franchise With Us" },
  ];

  const [query, setQuery] = useState("");
  const searchInputRef = useRef(null);

  const [aboutTooltipOpen, setAboutTooltipOpen] = useState(false);
  const tooltipTimeoutRef = useRef(null);

  const showTooltip = () => {
    if (tooltipTimeoutRef.current) window.clearTimeout(tooltipTimeoutRef.current);
    setAboutTooltipOpen(true);
  };
  const hideTooltip = () => {
    tooltipTimeoutRef.current = window.setTimeout(() => setAboutTooltipOpen(false), 150);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = (query || "").trim();
    window.dispatchEvent(new CustomEvent("siteSearch", { detail: term }));
    setQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 bg-white z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center" aria-label="Home">
              <Image src={Logo} alt="9NUTZ" width={150} height={40} className="object-contain" priority />
            </Link>

            <nav className="hidden md:flex items-center space-x-2">
              {tabs.map((t) => (
                <Link key={t.href + t.label} href={t.href} className="text-sm text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md">
                  {t.label}
                </Link>
              ))}

              <div className="relative" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
                <button onFocus={showTooltip} onBlur={hideTooltip} aria-haspopup="true" aria-expanded={aboutTooltipOpen} className="text-sm text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md">
                  About Us
                </button>

                <div
                  role="tooltip"
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 md:w-80 p-3 rounded-lg shadow-lg text-sm bg-white border border-gray-100 transition-opacity duration-150 z-50 ${
                    aboutTooltipOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                  onMouseEnter={showTooltip}
                  onMouseLeave={hideTooltip}
                >
                  <h4 className="font-semibold text-gray-800">Our Journey</h4>
                  <p className="mt-1 text-gray-600 text-xs leading-relaxed">
                    From a small local shop to a nationwide brand — we started with a single idea: premium-quality nuts and snacks delivered with love. Today we combine traditional recipes with modern packaging to bring joy to your snacking moments.
                  </p>
                  <div className="mt-2 text-xs">
                    <Link href="/about" className="underline text-sm text-indigo-600">
                      Read full story
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-4">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-xl" role="search" aria-label="Site search">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="w-full border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-sm hover:bg-gray-100 transition">
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-3 relative">
            {hasToken ? (
              <button
                onClick={() => {
                  try { logout?.(); } catch (_) {}
                }}
                className="px-3 py-1 rounded-md bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors"
                aria-label="Logout"
              >
                Logout
              </button>
            ) : (
              <AccountDropdown onLoginClick={onLoginClick} />
            )}

            <button onClick={onCartClick} aria-label="Open cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center" aria-label={`${cartItemCount} items in cart`}>
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </button>

            <button className="ml-1 p-2 rounded-md md:hidden hover:bg-gray-100 transition-colors" onClick={() => setMobileNavOpen((s) => !s)} aria-expanded={mobileNavOpen} aria-label="Toggle navigation">
              <svg className="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("siteSearch", { detail: query.trim() }));
                setQuery("");
                setMobileNavOpen(false);
              }}
              className="mb-3"
            >
              <div className="relative">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="w-full border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  aria-label="Search"
                />
                <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-sm hover:bg-gray-100 transition">
                  Search
                </button>
              </div>
            </form>

            <ul className="space-y-2">
              {tabs.map((t) => (
                <li key={`mob-${t.href}-${t.label}`}>
                  <Link href={t.href} className="block text-sm text-gray-700 hover:text-gray-900 py-2" onClick={() => setMobileNavOpen(false)}>
                    {t.label}
                  </Link>
                </li>
              ))}

              <li>
                <details className="group">
                  <summary className="list-none cursor-pointer text-sm text-gray-700 hover:text-gray-900 py-2">About Us</summary>
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="text-xs leading-relaxed">From a small local shop to a nationwide brand — we started with a single idea: premium-quality nuts and snacks delivered with love.</p>
                    <div className="mt-2">
                      <Link href="/about" className="text-indigo-600 text-sm underline" onClick={() => setMobileNavOpen(false)}>
                        Read full story
                      </Link>
                    </div>
                  </div>
                </details>
              </li>

              <li>
                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    onLoginClick?.();
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


