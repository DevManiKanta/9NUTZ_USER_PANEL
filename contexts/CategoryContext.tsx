"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import useFetchAuth from '../hooks/useFetchAuth';
import {
  getCategoriesPublicAPI,
  adminGetCategoriesAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI
} from '../lib/api';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getActiveCategories: () => Category[];
  refresh: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

// --- helper to convert API row -> Category (frontend shape)
function normalizeCategoryRow(row: any): Category {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description || '',
    image: row.image_url || row.image || '',
    status: row.status || row.status === 1 ? 'active' : 'inactive',
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date()
  };
}

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth(); // if logged in, token may be present
  const { call } = useFetchAuth(); // wrapper to call admin endpoints (automatically appends token)
  // Load categories on mount from backend public endpoint; fall back to localStorage if network fails
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const rows = await getCategoriesPublicAPI(); // public API, no token required
        if (cancelled) return;
        const normalized = Array.isArray(rows) ? rows.map(normalizeCategoryRow) : [];
        setCategories(normalized);
        // cache non-initial categories to localStorage for offline fallback
        localStorage.setItem('categories', JSON.stringify(normalized));
      } catch (err: any) {
        console.warn('Failed to fetch categories from API, falling back to localStorage', err);
        const saved = localStorage.getItem('categories');
        if (saved) {
          try {
            const parsed = JSON.parse(saved).map((c: any) => ({
              ...c,
              createdAt: new Date(c.createdAt),
              updatedAt: new Date(c.updatedAt)
            }));
            setCategories(parsed);
          } catch (e) {
            setCategories([]);
          }
        } else {
          setCategories([]);
        }
        setError(String(err?.message || err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Helper: update state and localStorage, and dispatch categoriesUpdated
  function saveAndNotify(updated: Category[]) {
    setCategories(updated);
    try {
      localStorage.setItem('categories', JSON.stringify(updated));
    } catch (e) {
      // ignore localStorage errors
    }
    window.dispatchEvent(new CustomEvent('categoriesUpdated'));
  }

  // Public refresh (re-fetch public categories)
  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const rows = await getCategoriesPublicAPI();
      const normalized = Array.isArray(rows) ? rows.map(normalizeCategoryRow) : [];
      saveAndNotify(normalized);
    } catch (err: any) {
      setError(String(err?.message || err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // ADMIN: Add category (calls protected API). Uses useFetchAuth.call
  async function addCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    // Try to call admin endpoint using token. If not logged in, throw so UI can handle it.
    try {
      // call(createCategoryAPI, payload) will append token automatically
      const payload = {
        name: categoryData.name,
        description: categoryData.description,
        image_url: categoryData.image,
        status: categoryData.status
      };

      // If token exists, use admin endpoint; otherwise attempt no-token fallback (not allowed for admin)
      if (!token) {
        throw new Error('Not authenticated. Please login as admin to add categories.');
      }

      // call wrapper will append token as last argument
      const created = await call(createCategoryAPI, payload); // expect backend returns created row
      const newCategory = normalizeCategoryRow(created);
      const updated = [...categories, newCategory];
      saveAndNotify(updated);
    } catch (err: any) {
      console.error('addCategory error:', err);
      throw err;
    }
  }

  // ADMIN: Update category
  async function updateCategory(id: string, categoryData: Partial<Category>): Promise<void> {
    try {
      if (!token) {
        throw new Error('Not authenticated. Please login as admin to update categories.');
      }
      const payload: any = {
        // map frontend fields to backend expected names
        name: categoryData.name,
        description: categoryData.description,
        image_url: categoryData.image,
        status: categoryData.status
      };

      // call update endpoint: (id, payload)
      const updatedRow = await call(updateCategoryAPI, Number(id), payload); // backend likely expects numeric id
      // If backend returns updated row, normalize and replace; else, apply client-side merge
      let updatedCategory: Category | undefined = undefined;
      if (updatedRow) {
        updatedCategory = normalizeCategoryRow(updatedRow);
      } else {
        // fallback: merge existing
        const existing = categories.find(c => c.id === id);
        if (existing) {
          updatedCategory = { ...existing, ...categoryData, updatedAt: new Date() };
        }
      }
      if (updatedCategory) {
        const updatedList = categories.map(c => (c.id === id ? updatedCategory! : c));
        saveAndNotify(updatedList);
      }
    } catch (err: any) {
      console.error('updateCategory error:', err);
      throw err;
    }
  }

  // ADMIN: Delete category
  async function deleteCategory(id: string): Promise<void> {
    try {
      if (!token) {
        throw new Error('Not authenticated. Please login as admin to delete categories.');
      }
      await call(deleteCategoryAPI, Number(id));
      const updated = categories.filter(c => c.id !== id);
      saveAndNotify(updated);
    } catch (err: any) {
      console.error('deleteCategory error:', err);
      throw err;
    }
  }

  const getCategoryById = (id: string) => categories.find(category => category.id === id);

  const getActiveCategories = () => categories.filter(category => category.status === 'active');

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getActiveCategories,
    refresh
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
