"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import apiAxios from "@/lib/api";
// const API_ORIGIN = new URL(apiAxios).origin;
const ProductContext = createContext(undefined);

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within a ProductProvider");
  return ctx;
};

function toNumberSafe(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number.parseFloat(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function getFullStorageUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  const s = String(pathOrUrl).trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  return `${API_ORIGIN}/public/storage/${s.replace(/^\/+/, "")}`;
}

function normalizeServerProduct(r) {
  const imageUrl = r.image_url ? String(r.image_url) : (r.image ? getFullStorageUrl(r.image) : undefined);

  const price = toNumberSafe(r.price);
  const discountPrice = typeof r.discount_price !== "undefined" && r.discount_price !== null ? toNumberSafe(r.discount_price) : undefined;
  const discountAmount = typeof r.discount_amount !== "undefined" && r.discount_amount !== null ? toNumberSafe(r.discount_amount) : undefined;
  const discountPercent = typeof r.discount_percent !== "undefined" && r.discount_percent !== null ? toNumberSafe(r.discount_percent) : undefined;

  const stock = (() => {
    const s = r.stock ?? 0;
    return Number.isFinite(Number(s)) ? Number(s) : toNumberSafe(s);
  })();

  const category = r.category
    ? {
        id: String(r.category.id ?? ""),
        name: String(r.category.name ?? ""),
        imageUrl: r.category.image_url ? String(r.category.image_url) : (r.category.image ? getFullStorageUrl(r.category.image) : undefined),
      }
    : undefined;

  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    category,
    grams: r.grams ? String(r.grams) : undefined,
    price,
    imageUrl: imageUrl ?? undefined,
    discountPrice: typeof discountPrice === "number" ? discountPrice : undefined,
    discountAmount: typeof discountAmount === "number" ? discountAmount : undefined,
    discountPercent: typeof discountPercent === "number" ? discountPercent : undefined,
    vendorId: typeof r.vendor_id !== "undefined" && r.vendor_id !== null ? String(r.vendor_id) : undefined,
    stock: Number.isFinite(Number(stock)) ? Number(stock) : 0,
    createdAt: r.created_at ? new Date(r.created_at) : undefined,
    updatedAt: r.updated_at ? new Date(r.updated_at) : undefined,
    isOutOfStock: (Number.isFinite(Number(stock)) ? Number(stock) : 0) <= 0,
  };
}

export const ProductProvider = ({ children }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);

const reload = useCallback(async () => {
  try {
    const res = await apiAxios.get("http://192.168.29.8:8000/api/product/show");

    const payload = res.data;
    const rows = Array.isArray(payload?.data) ? payload.data : [];

    const normalized = rows.map((r) => normalizeServerProduct(r));
    setProducts(normalized);
  } catch (err) {
    console.error("Reload products failed:", err.response?.data || err.message);
    setProducts([]);
  }
}, []);
  useEffect(() => {
    reload();
  }, [reload]);

  const buildFormData = (productData) => {
    const fd = new FormData();
    if (productData.name) fd.append("name", String(productData.name));
    if (productData.description) fd.append("description", String(productData.description ?? ""));
    if (typeof productData.price !== "undefined") fd.append("price", String(productData.price));
    if (typeof productData.discount_price !== "undefined") fd.append("discount_price", String(productData.discount_price));
    if (productData.category_id) fd.append("category_id", String(productData.category_id));
    if (typeof productData.stock !== "undefined") fd.append("stock", String(productData.stock || 0));
    if (productData.imageFiles && Array.isArray(productData.imageFiles)) {
      productData.imageFiles.forEach((f) => fd.append("images", f));
    }
    if (Array.isArray(productData.images)) {
      const urlImages = productData.images
        .map((s) => String(s || "").trim())
        .filter((s) => /^https?:\/\//i.test(s));
      if (urlImages.length) fd.append("images_urls", JSON.stringify(urlImages));
    }
    return fd;
  };

  const addProduct = useCallback(async (productData) => {
    const fd = buildFormData(productData);
    const res = await fetch(`${API_ORIGIN}/public/api/admin/products`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Add product failed ${res.status}: ${t || res.statusText}`);
    }
    const body = await res.json();
    const row = body?.data ?? body;
    const normalized = normalizeServerProduct(row);
    setProducts((prev) => [normalized, ...prev]);
    window.dispatchEvent(new CustomEvent("productsUpdated"));
    return normalized;
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    const hasFiles = Array.isArray(productData.imageFiles) && productData.imageFiles.length > 0;
    if (hasFiles) {
      const fd = buildFormData(productData);
      const res = await fetch(`${API_ORIGIN}/public/api/admin/products/${id}`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Update product failed ${res.status}: ${t || res.statusText}`);
      }
      const body = await res.json();
      const row = body?.data ?? body;
      const normalized = normalizeServerProduct(row);
      setProducts((prev) => prev.map((p) => (p.id === String(id) ? normalized : p)));
      window.dispatchEvent(new CustomEvent("productsUpdated"));
      return normalized;
    }

    const payload = {
      name: productData.name,
      price: productData.price,
      discount_price: productData.discount_price,
      stock: productData.stock,
      category_id: productData.category_id,
    };
    const headers = { "Content-Type": "application/json" };
    const res = await fetch(`${API_ORIGIN}/public/api/admin/products/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Update product failed ${res.status}: ${t || res.statusText}`);
    }
    const body = await res.json();
    const row = body?.data ?? body;
    const normalized = normalizeServerProduct(row);
    setProducts((prev) => prev.map((p) => (p.id === String(id) ? normalized : p)));
    window.dispatchEvent(new CustomEvent("productsUpdated"));
    return normalized;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    const res = await fetch(`${API_ORIGIN}/public/api/admin/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Delete product failed ${res.status}: ${t || res.statusText}`);
    }
    setProducts((prev) => prev.filter((p) => p.id !== String(id)));
    window.dispatchEvent(new CustomEvent("productsUpdated"));
  }, []);

  const getProductById = (id) => products.find((p) => p.id === id);
  const getActiveProducts = () => products.filter((p) => !p.isOutOfStock);

  const ctxValue = {
    products,
    reload,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getActiveProducts,
  };

  return <ProductContext.Provider value={ctxValue}>{children}</ProductContext.Provider>;
};


