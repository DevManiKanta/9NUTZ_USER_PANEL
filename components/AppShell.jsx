"use client";

import React, { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import LoginModal from "@/components/LoginModal";
import { useCart } from "@/contexts/CartContext";

export default function AppShell({ children }) {
  const { items, updateQuantity, clearCart, cartCount, cartTotal } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  useEffect(() => {
    const handler = () => setCartOpen(true);
    window.addEventListener("openCart", handler);
    return () => window.removeEventListener("openCart", handler);
  }, []);

  return (
    <>
      <Header
        onCartClick={openCart}
        onLoginClick={() => setLoginOpen(true)}
        cartItemCount={cartCount}
        cartTotal={cartTotal}
      />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />

      <CartSidebar
        isOpen={cartOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
      />

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}


