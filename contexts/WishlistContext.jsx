"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Login_API_BASE } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const WishListContext = createContext({
  favorites: [],
  loading: false,
  error: null,
  refreshFavorites: async () => {},
  addFavorite: async (productId) => {},
});

export const WishListProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from AuthContext or fallback to localStorage
  let authHook = null;
  try {
    authHook = useAuth && useAuth();
  } catch (e) {
    authHook = null;
  }

  const token =
    (authHook && (authHook.token || authHook.accessToken || authHook.authToken)) ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : null) ||
    null;

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${Login_API_BASE}/admin/users/list-favorite`, {
        method: "GET",
        headers: { ...authHeader },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load favorites: ${res.status} ${text}`);
      }

      const data = await res.json();
      // Try multiple common shapes from backend
      const root = data?.data ?? data;
      const listCandidate =
        (Array.isArray(data) && data) ||
        (Array.isArray(root?.favorites) && root.favorites) ||
        (Array.isArray(root?.favorite) && root.favorite) ||
        (Array.isArray(root?.favourites) && root.favourites) ||
        (Array.isArray(root?.favourite) && root.favourite) ||
        (Array.isArray(root?.wishlist) && root.wishlist) ||
        (Array.isArray(root?.wishlists) && root.wishlists) ||
        (Array.isArray(root?.result) && root.result) ||
        [];

      // Dedupe by product id and normalize minimal fields
      const normalized = listCandidate.map((f) => {
        const id = f?.product_id ?? f?.id ?? f?.productId ?? f?.product?.id ?? f?.product?._id;
        return {
          ...f,
          product_id: id != null ? id : f?.product_id,
        };
      });

      const seen = new Set();
      const deduped = [];
      for (const item of normalized) {
        const k = String(item?.product_id ?? item?.id ?? "");
        if (!k || seen.has(k)) continue;
        seen.add(k);
        deduped.push(item);
      }

      setFavorites(deduped);
    } catch (err) {
      setError(err);
      setFavorites([]);
      console.error("fetchFavorites error:", err);
    } finally {
      setLoading(false);
    }
  }, [Login_API_BASE, token]);

  useEffect(() => {
    if (token) fetchFavorites();
    else setFavorites([]);
  }, [token, fetchFavorites]);

  /**
   * Add Favorite with toast notifications
   */
  const addFavorite = useCallback(
    async (productId) => {
      if (!token) {
        const err = new Error("Not authenticated");
        setError(err);
        toast.error("Please log in first!");
        throw err;
      }

      setError(null);
      const prevSnapshot = Array.isArray(favorites) ? [...favorites] : [];
      const optimisticItem = { id: productId, product_id: productId, pending: true };

      // Defensive update
      setFavorites((current) => {
        const arr = Array.isArray(current) ? current : [];
        return [...arr, optimisticItem];
      });

      try {
        const formData = new FormData();
        formData.append("product_id", String(productId));

        const res = await fetch(`${Login_API_BASE}/admin/users/add-favorite`, {
          method: "POST",
          headers: { ...authHeader },
          body: formData,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Add favorite failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        if (data?.status) {
          toast.success(data.message || "Added to favorites", {
            style: {
              background: "#fef2f2",
              color: "green",
              border: "1px solid green",
              fontWeight: "600",
            },
            iconTheme: {
              primary: "green",
              secondary: "#fff",
            },
          });
        }
        await fetchFavorites();
        return data;
      } catch (err) {
        // Rollback & show error toast
        setFavorites(prevSnapshot);
        setError(err);
        console.error("addFavorite error:", err);
        toast.error("Failed to add favorite", {
          style: { background: "#fee2e2", color: "#7f1d1d", fontWeight: "600" },
        });
        throw err;
      }
    },
    [token, favorites, fetchFavorites]
  );

  const value = {
    favorites,
    loading,
    error,
    refreshFavorites: fetchFavorites,
    addFavorite,
  };

  return <WishListContext.Provider value={value}>{children}</WishListContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishListContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishListProvider");
  return ctx;
};

export default WishListContext;
