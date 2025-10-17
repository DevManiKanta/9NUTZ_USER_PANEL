"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import useFetchAuth from '../hooks/useFetchAuth';
import {
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
} from '../lib/api';

const CategoryContext = createContext(undefined);

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

function normalizeCategoryRow(row) {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description || '',
    image: row.image_url || row.image || '',
    status: row.status || row.status === 1 ? 'active' : 'inactive',
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
  };
}

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useAuth();
  const { call } = useFetchAuth();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const rows = await getCategoriesPublicAPI();
        if (cancelled) return;
        const normalized = Array.isArray(rows) ? rows.map(normalizeCategoryRow) : [];
        setCategories(normalized);
        localStorage.setItem('categories', JSON.stringify(normalized));
      } catch (err) {
        console.warn('Failed to fetch categories from API, falling back to localStorage', err);
        const saved = localStorage.getItem('categories');
        if (saved) {
          try {
            const parsed = JSON.parse(saved).map((c) => ({
              ...c,
              createdAt: new Date(c.createdAt),
              updatedAt: new Date(c.updatedAt),
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
    return () => {
      cancelled = true;
    };
  }, []);

  function saveAndNotify(updated) {
    setCategories(updated);
    try {
      localStorage.setItem('categories', JSON.stringify(updated));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('categoriesUpdated'));
  }

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const rows = await getCategoriesPublicAPI();
      const normalized = Array.isArray(rows) ? rows.map(normalizeCategoryRow) : [];
      saveAndNotify(normalized);
    } catch (err) {
      setError(String(err?.message || err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function addCategory(categoryData) {
    try {
      if (!token) {
        throw new Error('Not authenticated. Please login as admin to add categories.');
      }
      const payload = {
        name: categoryData.name,
        description: categoryData.description,
        image_url: categoryData.image,
        status: categoryData.status,
      };
      const created = await call(createCategoryAPI, payload);
      const newCategory = normalizeCategoryRow(created);
      const updated = [...categories, newCategory];
      saveAndNotify(updated);
    } catch (err) {
      console.error('addCategory error:', err);
      throw err;
    }
  }

  async function updateCategory(id, categoryData) {
    try {
      if (!token) {
        throw new Error('Not authenticated. Please login as admin to update categories.');
      }
      const payload = {
        name: categoryData.name,
        description: categoryData.description,
        image_url: categoryData.image,
        status: categoryData.status,
      };
      const updatedRow = await call(updateCategoryAPI, Number(id), payload);
      let updatedCategory = undefined;
      if (updatedRow) {
        updatedCategory = normalizeCategoryRow(updatedRow);
      } else {
        const existing = categories.find((c) => c.id === id);
        if (existing) {
          updatedCategory = { ...existing, ...categoryData, updatedAt: new Date() };
        }
      }
      if (updatedCategory) {
        const updatedList = categories.map((c) => (c.id === id ? updatedCategory : c));
        saveAndNotify(updatedList);
      }
    } catch (err) {
      console.error('updateCategory error:', err);
      throw err;
    }
  }

  async function deleteCategory(id) {
    try {
      if (!token) {
        throw new Error('Not authenticated. Please login as admin to delete categories.');
      }
      await call(deleteCategoryAPI, Number(id));
      const updated = categories.filter((c) => c.id !== id);
      saveAndNotify(updated);
    } catch (err) {
      console.error('deleteCategory error:', err);
      throw err;
    }
  }

  const getCategoryById = (id) => categories.find((category) => category.id === id);
  const getActiveCategories = () => categories.filter((category) => category.status === 'active');

  const value = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getActiveCategories,
    refresh,
  };

  return (
    <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
  );
};


