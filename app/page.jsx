
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
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
import AllPackages from "@/components/allcombopacks/AllPackages";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterAnimating, setIsFilterAnimating] = useState(false);

  const { user } = useAuth();

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
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 0) + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : 0;
    const qty = typeof item.quantity === "number" ? item.quantity : 0;
    return sum + price * qty;
  }, 0);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleCategoryChange = (category) => {
    setIsFilterAnimating(true);
    setSelectedCategory(category);

    setTimeout(() => {
      setIsFilterAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const handler = (e) => {
      const ce = e;
      if (ce && typeof ce.detail === "string") {
        handleCategoryChange(ce.detail);
      }
    };

    // uncomment to listen globally:
    // window.addEventListener("categoryFilterChange", handler);
    // return () => window.removeEventListener("categoryFilterChange", handler);
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

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />

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

      <AllPackages />

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

    </div>
  );
}
