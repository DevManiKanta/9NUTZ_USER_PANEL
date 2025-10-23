
"use client";
import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, User, Bell } from "lucide-react"; // ✅ Added Bell
import AccountDropdown from "./AccountDropdown";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assests/LOGO.jpg";
import { useSettings } from "@/contexts/SettingsContext";


export default function Header({
  onLoginClick,
  onLocationClick,
  onCartClick,
  cartItemCount,
  cartTotal,
  handlePaymentComplete,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { token, logout } = useAuth();
  const hasToken = Boolean(token);
    const { settings } = useSettings();
  const logoSrc = settings?.logo_url || Logo;
  const tabs = [
    { href: "/", label: "Shop" },
    { href: "/packages", label: "Packages" },
    { href: "/shippingmethods", label: "Shipping Methods" },
    { href: "/franchise", label: "Franchise With Us" },
  ];

  const [query, setQuery] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);
  const profileBtnRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        profileOpen &&
        profileMenuRef.current &&
        profileBtnRef.current &&
        !profileMenuRef.current.contains(e.target) &&
        !profileBtnRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };
    const handleEsc = (e) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [profileOpen]);

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
    <header className="sticky top-0 left-0 right-0 w-medium bg-white z-50 shadow-sm border-b border-gray-100">
      {/* Full-width header */}
      <div className="w-full px-0">
        <div className="w-full flex items-center justify-between h-16 px-3 sm:px-4">
          {/* LEFT: Logo + Nav */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center" aria-label="Home">
              <Image
                src={logoSrc}
                alt="9NUTZ"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-2">
              {tabs.map((t) => (
                <Link
                  key={t.href + t.label}
                  href={t.href}
                  className="text-sm text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md"
                >
                  {t.label}
                </Link>
              ))}
              {/* Tooltip: About Us */}
              <div
                className="relative"
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
              >
                <button
                  onFocus={showTooltip}
                  onBlur={hideTooltip}
                  aria-haspopup="true"
                  aria-expanded={aboutTooltipOpen}
                  className="text-sm text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md"
                >
                  About Us
                </button>

                <div
                  role="tooltip"
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 md:w-80 p-3 rounded-lg shadow-lg text-sm bg-white border border-gray-100 transition-opacity duration-150 z-50 ${
                    aboutTooltipOpen
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  onMouseEnter={showTooltip}
                  onMouseLeave={hideTooltip}
                >
                  <h4 className="font-semibold text-gray-800">Our Journey</h4>
                  <p className="mt-1 text-gray-600 text-xs leading-relaxed">
                    From a small local shop to a nationwide brand — we started with a
                    single idea: premium-quality nuts and snacks delivered with love.
                    Today we combine traditional recipes with modern packaging to bring
                    joy to your snacking moments.
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

          {/* CENTER: Smaller Search */}
          <div className="hidden md:flex flex-1 justify-center px-2 sm:px-4">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex justify-center"
              role="search"
              aria-label="Site search"
            >
              <div className="relative w-[240px] sm:w-[500px]">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full border border-gray-200 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded-full hover:bg-gray-100 transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Bell, Profile, Cart, Menu */}
          <div className="flex items-center space-x-3 relative">
            {/* 🔔 Notification bell */}
          <Link
  href="/dashboard"
  aria-label="Notifications"
  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
>
  <Bell className="h-5 w-5 text-gray-700" />
  <span className="absolute top-1.5 right-1.5 bg-red-500 rounded-full w-2 h-2" />
</Link>
            {/* 👤 Profile */}
            {hasToken ? (
              <div className="relative">
                <button
                  ref={profileBtnRef}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    Profile
                  </span>
                </button>

                {profileOpen && (
                  <div
                    ref={profileMenuRef}
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          if (typeof logout === "function") await logout();
                        } catch (err) {
                          console.warn("Logout failed:", err);
                        } finally {
                          setProfileOpen(false);
                          handlePaymentComplete?.();
                        }
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <AccountDropdown onLoginClick={onLoginClick} />
            )}

            {/* 🛒 Cart */}
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

            {/* ☰ Mobile menu */}
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

      {/* 📱 Mobile Nav */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white w-full">
          <div className="w-full px-3 sm:px-4 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.dispatchEvent(
                  new CustomEvent("siteSearch", { detail: query.trim() })
                );
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
                  placeholder="Search products..."
                  className="w-full border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  aria-label="Search"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-sm hover:bg-gray-100 transition"
                >
                  Search
                </button>
              </div>
            </form>

            <ul className="space-y-2">
              {tabs.map((t) => (
                <li key={`mob-${t.href}-${t.label}`}>
                  <Link
                    href={t.href}
                    className="block text-sm text-gray-700 hover:text-gray-900 py-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
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




