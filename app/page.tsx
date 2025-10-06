// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import PaymentFlow from "@/components/PaymentFlow";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import CategoryFilter from "@/components/CategoryFilter";
import FilterableProductGrid from "@/components/FilterableProductGrid";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import LocationModal from "@/components/LocationModal";
import CartSidebar from "@/components/CartSidebar";



/**
 * Types used in this page
 */
type Product = {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  weight?: string;
  category?: string;
  // extend with any other product fields you use
};

type CartItem = Product & {
  quantity: number;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPaymentFlow, setShowPaymentFlow] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // <-- typed cartItems state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFilterAnimating, setIsFilterAnimating] = useState<boolean>(false);

  const { user } = useAuth();

  // Simulate loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleProceedToPay = () => {
    setShowPaymentFlow(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentFlow(false);
    setCartItems([]); // empty the cart
    // optionally show notification
  };

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        // increase quantity
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      // push new item with quantity 1
      return [...prev, { ...(product as Product), quantity: 1 }];
    });
  };

  // Calculate cart total (guard for missing fields)
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : 0;
    const qty = typeof item.quantity === "number" ? item.quantity : 0;
    return sum + price * qty;
  }, 0);

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleCategoryChange = (category: string) => {
    setIsFilterAnimating(true);
    setSelectedCategory(category);

    // Reset animation state after transition
    setTimeout(() => {
      setIsFilterAnimating(false);
    }, 300);
  };

  // Listen for category filter changes from Hero component
  useEffect(() => {
    // the dispatched event should be a CustomEvent<string> carrying the category id/name
    const handler = (e: Event) => {
      // safe cast to CustomEvent<string>
      const ce = e as CustomEvent<string>;
      if (ce && typeof ce.detail === "string") {
        handleCategoryChange(ce.detail);
      }
    };

    window.addEventListener("categoryFilterChange", handler);
    return () => window.removeEventListener("categoryFilterChange", handler);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLocationClick={() => setIsLocationModalOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={cartItems.reduce((s, i) => s + (i.quantity || 0), 0)}
        cartTotal={cartTotal}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />

          {/* Category Filter and Filterable Products */}
          <CategoryFilter
            onCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
          />

          <FilterableProductGrid
            onAddToCart={addToCart}
            selectedCategory={selectedCategory}
            isAnimating={isFilterAnimating}
          />
        </div>
      </main>

      <Footer />

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onProceedToPay={handleProceedToPay}
      />

      <PaymentFlow
        isOpen={showPaymentFlow}
        onClose={() => setShowPaymentFlow(false)}
        cartTotal={cartTotal}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
