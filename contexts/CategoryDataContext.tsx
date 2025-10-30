// src/contexts/CategoryDataContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import apiAxios, { API_BASE } from "@/lib/api";

export type CategoryItem = { id: string; name: string };

type CategoryDataContextState = {
  categories: CategoryItem[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
};

const CategoryDataContext = createContext<CategoryDataContextState | undefined>(undefined);

async function fetchCategoriesFromApi(): Promise<any[]> {
  try {
    const res = await apiAxios.get("category/show");
    const body = res?.data?.data ?? res?.data ?? res;
    let rows: any[] = [];

    if (Array.isArray(body)) rows = body;
    else if (Array.isArray(body.data)) {
      if (Array.isArray(body.data.data)) rows = body.data.data;
      else rows = body.data;
    } else {
      const arr = Object.values(body || {}).find((v) => Array.isArray(v));
      if (Array.isArray(arr)) rows = arr as any[];
    }

    return rows;
  } catch (err) {
    
    throw err;
  }
}

export function CategoryDataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchCategoriesFromApi();
      const normalized = (rows || [])
        .map((r: any) => {
          const id = String(r.id ?? r._id ?? r.category_id ?? r.categoryId ?? r.id?.toString?.() ?? "").trim();
          const name = String(r.name ?? r.title ?? r.label ?? r.category_name ?? id ?? "");
          return id ? { id, name } : null;
        })
        .filter(Boolean) as CategoryItem[];

      // deduplicate by id, keep last seen
      const dedup: Record<string, CategoryItem> = {};
      normalized.forEach((c) => (dedup[c.id] = c));
      setCategories(Object.values(dedup));
    } catch (err: any) {
      setCategories([]);
      setError(String(err?.message ?? "Failed to load categories"));
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    void refreshCategories();
  }, [refreshCategories]);

  return (
    <CategoryDataContext.Provider value={{ categories, loading, error, refreshCategories }}>
      {children}
    </CategoryDataContext.Provider>
  );
}

export function useCategoryDataContext(): CategoryDataContextState {
  const ctx = useContext(CategoryDataContext);
  if (!ctx) throw new Error("useCategoryDataContext must be used within a CategoryDataProvider");
  return ctx;
}
