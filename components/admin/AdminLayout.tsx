"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Image,
  Star,
  Percent,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

export type AdminTab =
  | "overview"
  | "categories"
  | "products"
  | "orders"
  | "users"
  | "banners"
  | "recommended"
  | "coupons"
  | "cart";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: AdminTab;
  // Accept either a state setter or a simple callback
  onTabChange?: ((tab: AdminTab) => void) | React.Dispatch<React.SetStateAction<AdminTab>>;
}

export default function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  const navigationItems: {
    name: string;
    key: AdminTab;
    icon: React.ComponentType<any>;
    current: boolean;
  }[] = [
    { name: "Dashboard", key: "overview", icon: LayoutDashboard, current: activeTab === "overview" },
    { name: "Categories", key: "categories", icon: Package, current: activeTab === "categories" },
    { name: "Products", key: "products", icon: ShoppingCart, current: activeTab === "products" },
    { name: "Orders", key: "orders", icon: Users, current: activeTab === "orders" },
    { name: "User Management", key: "users", icon: Users, current: activeTab === "users" },
    { name: "Banner Management", key: "banners", icon: Image, current: activeTab === "banners" },
    { name: "Recommended Products", key: "recommended", icon: Star, current: activeTab === "recommended" },
    { name: "Coupon Codes", key: "coupons", icon: Percent, current: activeTab === "coupons" },
    // optionally show cart tab in sidebar if you'd like:
    // { name: "Cart", key: "cart", icon: ShoppingCart, current: activeTab === "cart" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">JB</span>
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900">JBasket Admin</span>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    if (!onTabChange) return;
                    // both the setter and a plain callback accept AdminTab as an argument,
                    // so calling generically works.
                    (onTabChange as (tab: AdminTab) => void)(item.key);
                  }}
                  className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? "bg-green-100 text-green-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      item.current ? "text-green-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase() ?? ""}
              </span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-3 p-1 text-gray-400 hover:text-gray-500"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        {/* Top navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full max-w-lg pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="h-5 w-5" />
                </button>
                {/* Cart Button in Admin */}
                <button className="relative bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
