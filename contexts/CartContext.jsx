// src/contexts/CartContext.jsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem("cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Cart load error:", e);
      return [];
    }
  });

  // persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(items));
    } catch (e) {
      console.warn("Cart save failed:", e);
    }
  }, [items]);

  const addItem = useCallback((payload) => {
    // payload: { id, name, price, image, quantity?, ... }
    if (!payload || !payload.id) return;
    const qtyToAdd = Math.max(1, Number(payload.quantity ?? 1));
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === payload.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: (Number(next[idx].quantity) || 0) + qtyToAdd };
        return next;
      }
      return [...prev, { ...payload, quantity: qtyToAdd }];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    const q = Math.trunc(Number(quantity) || 0);
    setItems((prev) => {
      if (q <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity: q } : i));
    });
  }, []);
  const clearCart = useCallback(() => setItems([]), []);
  const cartCount = items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
  const cartTotal = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
