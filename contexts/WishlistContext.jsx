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

      // --- Robust extraction of the favorites list ---
      // The backend may return:
      // 1) An array directly => data
      // 2) { data: [...] } => data.data
      // 3) Pagination: { data: { data: [...] , current_page... } } => data.data.data
      // 4) Various keys like favorites, wishlist, result...
      let listCandidate = [];

      // 1) data is an array
      if (Array.isArray(data)) {
        listCandidate = data;
      } else {
        // 2) top-level `data`
        const top = data?.data ?? null;

        // 3) if top is array
        if (Array.isArray(top)) {
          listCandidate = top;
        } else if (top && Array.isArray(top.data)) {
          // paginated shape: data.data => array
          listCandidate = top.data;
        } else {
          // fallback to common keys inside top or data root
          const root = top ?? data;
          listCandidate =
            (Array.isArray(root?.favorites) && root.favorites) ||
            (Array.isArray(root?.favorite) && root.favorite) ||
            (Array.isArray(root?.favourites) && root.favourites) ||
            (Array.isArray(root?.favourite) && root.favourite) ||
            (Array.isArray(root?.wishlist) && root.wishlist) ||
            (Array.isArray(root?.wishlists) && root.wishlists) ||
            (Array.isArray(root?.result) && root.result) ||
            [];
        }
      }

      // Normalize each item so consumers (dashboard) can read product/product_id consistently
      const normalized = listCandidate.map((f) => {
        // possible shapes:
        //  - favorite item: { id, user_id, product_id, product: { ... } }
        //  - nested: { product: {...} }
        const productObj = f?.product ?? null;
        const productId =
          f?.product_id ?? f?.productId ?? f?.id ?? productObj?.id ?? productObj?._id ?? null;

        const name =
          f?.name ??
          productObj?.name ??
          f?.product_name ??
          f?.title ??
          null;

        const price =
          f?.price ??
          productObj?.price ??
          f?.product_price ??
          f?.offerPrice ??
          null;

        const image =
          productObj?.image_url ??
          productObj?.image_url ??
          f?.image_url ??
          f?.image_url ??
          null;
        return {
          // keep original fields (helpful) and add normalized aliases
          ...f,
          product: productObj ?? f?.product ?? null,
          product_id: productId != null ? String(productId) : null,
          product_name: name,
          product_price: price,
          product_image: image,
        };
      });

      // Dedupe by product_id (keep the first occurrence)
      const seen = new Set();
      const deduped = [];
      for (const item of normalized) {
        const key = String(item?.product_id ?? item?.id ?? "");
        if (!key) continue;
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(item);
      }

      setFavorites(deduped);
    } catch (err) {
      setError(err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [Login_API_BASE, token]); // eslint-disable-line

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
        // avoid duplicates locally
        if (arr.some((it) => String(it?.product_id ?? it?.id) === String(productId))) return arr;
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
              // border: "1px solid #fca5a5",
              fontWeight: "600",
            },
            iconTheme: {
              primary: "green",
              secondary: "#fff",
            },
          });
        }

        // refresh to get canonical server shape
        await fetchFavorites();
        return data;
      } catch (err) {
        // Rollback & show error toast
        setFavorites(prevSnapshot);
        setError(err);
        toast.error("Failed to add favorite", {
          style: { background: "#fee2e2", color: "#7f1d1d", fontWeight: "600" },
        });
        throw err;
      }
    },
    [token, favorites, fetchFavorites] // eslint-disable-line
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
