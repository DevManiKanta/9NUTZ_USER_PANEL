"use client";

import React, { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";
import ProductClient from "@/app/product/ProductClient";

export default function ProductPageClient({ id }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, updateQuantity, clearCart, cartCount, cartTotal } = useCart();

  useEffect(() => {
    const openHandler = () => setIsCartOpen(true);
    window.addEventListener("openCart", openHandler);
    return () => window.removeEventListener("openCart", openHandler);
  }, []);

  const handlePaymentComplete = useCallback(() => {
    clearCart();
    setIsCartOpen(false);
  }, [clearCart]);

  const handleProceedToPay = () => {
    // Integrate payment flow here if needed
    // Keeping console for traceability during development
    // eslint-disable-next-line no-console
    console.log("Proceed to payment");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={cartCount}
        cartTotal={cartTotal}
      />
      <main className="flex-1 w-full bg-white">
        <section className="w-full bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <ProductClient id={String(id || "")} />
          </div>
        </section>
      </main>
      <Footer />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onProceedToPay={handleProceedToPay}
        handlePaymentComplete={handlePaymentComplete}
        onClearCart={clearCart}
      />
    </div>
  );
}


