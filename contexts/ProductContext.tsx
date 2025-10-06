// // ProductContext.tsx
// "use client";

// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { API_BASE } from "@/lib/api"; // <- single source of truth for base URL

// export interface ContextProduct {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   offerPrice?: number;
//   categoryId: string;
//   images: string[];
//   stock: number;
//   status: 'active' | 'inactive';
//   weight: string;
//   brand: string;
//   rating: number;
//   reviews: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface Product extends ContextProduct {
//   quantityPrices?: any[];
// }

// interface ProductContextType {
//   products: Product[];
//   reload: () => Promise<void>;
//   addProduct: (productData: any) => Promise<Product>;
//   updateProduct: (id: string, productData: any) => Promise<Product>;
//   deleteProduct: (id: string) => Promise<void>;
//   getProductById: (id: string) => Product | undefined;
//   getProductsByCategory: (categoryId: string) => Product[];
//   getActiveProducts: () => Product[];
//   getTopSellingProducts: () => Product[];
// }

// const ProductContext = createContext<ProductContextType | undefined>(undefined);

// export const useProducts = (): ProductContextType => {
//   const ctx = useContext(ProductContext);
//   if (!ctx) throw new Error("useProducts must be used within a ProductProvider");
//   return ctx;
// };

// // Helper: normalize incoming server product row into Product shape
// function normalizeServerProduct(r: any): Product {
//   const BASE = API_BASE.replace(/\/+$/,"");

//   // images normalization
//   let images: string[] = [];
//   try {
//     if (Array.isArray(r.images)) images = r.images;
//     else if (typeof r.images === "string") {
//       const s = r.images.trim();
//       if (s.startsWith("[")) images = JSON.parse(s);
//       else if (s) images = [s];
//     } else if (r.image) images = [r.image];
//     else if (r.image_url) images = [r.image_url];
//   } catch {
//     images = [];
//   }

//   images = images
//     .filter(Boolean)
//     .map((img: string) => {
//       if (typeof img !== "string") return "";
//       const trimmed = img.trim();
//       if (!trimmed) return "";
//       if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
//         return trimmed;
//       }
//       // server uses `/uploads/...` paths — prefix with API base
//       if (trimmed.startsWith("/")) return `${BASE}${trimmed}`;
//       return `${BASE}/${trimmed}`;
//     })
//     .filter(Boolean);

//   const price = typeof r.price_cents === "number" ? Math.round(Number(r.price_cents) / 100) : (r.price ?? 0);

//   const offerVal =
//     typeof r.offer_price !== "undefined" && r.offer_price !== null
//       ? Number(r.offer_price)
//       : (r.offerPrice ?? undefined);

//   let qp: any[] = [];
//   try {
//     if (Array.isArray(r.quantity_prices)) qp = r.quantity_prices;
//     else if (typeof r.quantity_prices === "string" && r.quantity_prices.trim()) qp = JSON.parse(r.quantity_prices);
//     else qp = r.quantityPrices ?? [];
//   } catch {
//     qp = r.quantityPrices ?? [];
//   }

//   // Category id mapping (important!)
//   const categoryId = String(r.category_id ?? r.categoryId ?? "");

//   return {
//     id: String(r.id),
//     name: r.name,
//     description: r.description ?? "",
//     price,
//     offerPrice: typeof offerVal === "number" ? offerVal : undefined,
//     images,
//     image: images[0] ?? (r.image_url ?? r.image ?? ""),
//     stock: Number(r.stock ?? r.inventory ?? 0),
//     status: r.status === "inactive" ? "inactive" : "active",
//     weight: r.weight ?? "",
//     brand: r.brand ?? "",
//     rating: Number(r.rating ?? 0),
//     reviews: Number(r.reviews ?? 0),
//     quantityPrices: qp,
//     createdAt: r.created_at ? new Date(r.created_at) : new Date(),
//     updatedAt: r.updated_at ? new Date(r.updated_at) : new Date(),
//     categoryId
//   } as Product;
// }

// export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { token } = useAuth();

//   const [products, setProducts] = useState<Product[]>([]);

//   // helper to attach Authorization header if token present
//   const getAuthHeaders = useCallback(() => {
//     const headers: Record<string, string> = {};
//     const resolvedToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
//     if (resolvedToken) headers["Authorization"] = `Bearer ${resolvedToken}`;
//     return headers;
//   }, [token]);

//   const reload = useCallback(async () => {
//     try {
//       const base = API_BASE.replace(/\/+$/,"");
//       const res = await fetch(`${base}/api/products`, {
//         method: "GET",
//         headers: { Accept: "application/json" }
//       });
//       if (!res.ok) {
//         console.warn("Failed fetching /api/products", res.status);
//         setProducts([]);
//         return;
//       }
//       const data = await res.json();
//       if (!Array.isArray(data)) {
//         setProducts([]);
//         return;
//       }
//       const normalized = data.map(normalizeServerProduct);
//       setProducts(normalized);
//     } catch (err) {
//       console.error("reload products failed", err);
//       setProducts([]);
//     }
//   }, []);

//   useEffect(() => {
//     reload();
//   }, [reload]);

//   /**
//    * buildFormData
//    *
//    * Important rules:
//    * - If actual File objects are present in productData.imageFiles -> append them as multipart 'images'
//    * - images_urls MUST contain only http(s) URLs (not data: URIs). We filter productData.images and only include http/https
//    * - If no files and no valid URLs, we don't append images_urls at all
//    */
//   const buildFormData = (productData: any) => {
//     const fd = new FormData();
//     if (productData.name) fd.append("name", String(productData.name));
//     if (productData.description) fd.append("description", String(productData.description ?? ""));
//     if (typeof productData.price !== "undefined") fd.append("price", String(productData.price));
//     if (typeof productData.offerPrice !== "undefined") fd.append("offer_price", String(productData.offerPrice));
//     if (productData.categoryId) fd.append("category_id", String(productData.categoryId));
//     if (typeof productData.stock !== "undefined") fd.append("stock", String(productData.stock || 0));
//     if (productData.status) fd.append("status", String(productData.status));
//     if (productData.weight) fd.append("weight", String(productData.weight));
//     if (productData.brand) fd.append("brand", String(productData.brand));
//     if (typeof productData.rating !== "undefined") fd.append("rating", String(productData.rating));
//     if (typeof productData.reviews !== "undefined") fd.append("reviews", String(productData.reviews));
//     if (Array.isArray(productData.quantityPrices)) fd.append("quantityPrices", JSON.stringify(productData.quantityPrices));

//     // Append real uploaded files to multipart 'images'
//     if (Array.isArray(productData.imageFiles) && productData.imageFiles.length) {
//       productData.imageFiles.forEach((f: File) => fd.append("images", f));
//     }

//     // If there are image strings (productData.images), only include real http(s) URLs in images_urls
//     if (Array.isArray(productData.images) && productData.images.length) {
//       const urlImages = productData.images
//         .filter(Boolean)
//         .map((s: any) => String(s).trim())
//         .filter((s: string) => /^https?:\/\//i.test(s)); // keep only http(s)

//       // If we have URL images (and no files), send them as images_urls.
//       // If we also have file uploads, still include images_urls so backend can combine them.
//       if (urlImages.length) {
//         fd.append("images_urls", JSON.stringify(urlImages));
//       }
//     }

//     return fd;
//   };

//   const addProduct = useCallback(async (productData: any): Promise<Product> => {
//     const base = API_BASE.replace(/\/+$/,"");
//     const fd = buildFormData(productData);
//     const headers = getAuthHeaders();
//     const res = await fetch(`${base}/api/admin/products`, {
//       method: "POST",
//       headers, // don't set Content-Type; browser will set boundary for FormData
//       body: fd
//     });
//     if (!res.ok) {
//       const text = await res.text().catch(()=> '');
//       throw new Error(`Server ${res.status}: ${text || res.statusText}`);
//     }
//     const created = await res.json();
//     const normalized = normalizeServerProduct(created);
//     setProducts((prev) => [normalized, ...prev]); // newest first
//     window.dispatchEvent(new CustomEvent("productsUpdated"));
//     return normalized;
//   }, [getAuthHeaders]);

//   const updateProduct = useCallback(async (id: string, productData: any): Promise<Product> => {
//     const base = API_BASE.replace(/\/+$/,"");
//     const hasFiles = Array.isArray(productData.imageFiles) && productData.imageFiles.length > 0;

//     // if files present => send FormData (multipart)
//     if (hasFiles) {
//       const fd = buildFormData(productData);
//       const headers = getAuthHeaders(); // do NOT set Content-Type - browser sets boundary
//       const res = await fetch(`${base}/api/admin/products/${id}`, {
//         method: "PUT",
//         headers,
//         body: fd
//       });
//       if (!res.ok) {
//         const text = await res.text().catch(()=> '');
//         throw new Error(`Server ${res.status}: ${text || res.statusText}`);
//       }
//       const updated = await res.json();
//       const normalized = normalizeServerProduct(updated);
//       setProducts((prev) => prev.map((p) => (p.id === String(id) ? normalized : p)));
//       window.dispatchEvent(new CustomEvent("productsUpdated"));
//       return normalized;
//     }

//     // Otherwise send JSON: backend PUT currently expects JSON (no multipart)
//     const payload: any = {
//       name: productData.name,
//       description: productData.description,
//       price: productData.price,
//       offer_price: typeof productData.offerPrice !== "undefined" ? productData.offerPrice : undefined,
//       category_id: productData.categoryId,
//       stock: productData.stock,
//       status: productData.status,
//       weight: productData.weight,
//       brand: productData.brand,
//       rating: productData.rating,
//       reviews: productData.reviews,
//       quantityPrices: Array.isArray(productData.quantityPrices) ? productData.quantityPrices : undefined,
//       // If frontend provides images (URLs) include them as an array of http(s) URLs only
//       images: Array.isArray(productData.images) ? (productData.images.filter((s: any) => typeof s === "string" && /^https?:\/\//i.test(String(s)))) : undefined
//     };

//     // strip undefined values
//     const cleanPayload: Record<string, any> = {};
//     Object.keys(payload).forEach((k) => {
//       if (payload[k] !== undefined) cleanPayload[k] = payload[k];
//     });

//     const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
//     const res = await fetch(`${base}/api/admin/products/${id}`, {
//       method: "PUT",
//       headers,
//       body: JSON.stringify(cleanPayload)
//     });
//     if (!res.ok) {
//       const text = await res.text().catch(()=> '');
//       throw new Error(`Server ${res.status}: ${text || res.statusText}`);
//     }
//     const updated = await res.json();
//     const normalized = normalizeServerProduct(updated);
//     setProducts((prev) => prev.map((p) => (p.id === String(id) ? normalized : p)));
//     window.dispatchEvent(new CustomEvent("productsUpdated"));
//     return normalized;
//   }, [getAuthHeaders]);

//   const deleteProduct = useCallback(async (id: string) => {
//     const base = API_BASE.replace(/\/+$/,"");
//     const headers = getAuthHeaders();
//     const res = await fetch(`${base}/api/admin/products/${id}`, {
//       method: "DELETE",
//       headers
//     });
//     if (!res.ok) {
//       const text = await res.text().catch(()=> '');
//       throw new Error(`Server ${res.status}: ${text || res.statusText}`);
//     }
//     setProducts((prev) => prev.filter((p) => p.id !== String(id)));
//     window.dispatchEvent(new CustomEvent("productsUpdated"));
//   }, [getAuthHeaders]);

//   const getProductById = (id: string) => products.find((p) => p.id === id);
//   const getProductsByCategory = (categoryId: string) =>
//     products.filter((p) => (p as any).categoryId === categoryId && p.status === "active");
//   const getActiveProducts = () => products.filter((p) => p.status === "active");
//   const getTopSellingProducts = () =>
//     products.filter((p) => p.status === "active").sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0)).slice(0, 10);

//   const ctxValue: ProductContextType = {
//     products,
//     reload,
//     addProduct,
//     updateProduct,
//     deleteProduct,
//     getProductById,
//     getProductsByCategory,
//     getActiveProducts,
//     getTopSellingProducts
//   };

//   return <ProductContext.Provider value={ctxValue}>{children}</ProductContext.Provider>;
// };
// ProductContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Exact API to call
 */
const PRODUCTS_URL = "https://9nutsapi.nearbydoctors.in/public/api/admin/products/show";
const API_ORIGIN = new URL(PRODUCTS_URL).origin;

/**
 * STATIC TOKEN (will be sent as Bearer token in Authorization header)
 * If you later want to prefer dynamic token from AuthContext/localStorage, remove or modify this constant.
 */
const STATIC_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovLzludXRzYXBpLm5lYXJieWRvY3RvcnMuaW4vcHVibGljL2FwaS9sb2dpbiIsImlhdCI6MTc1OTczMDcxOSwiZXhwIjoxNzYwNTk0NzE5LCJuYmYiOjE3NTk3MzA3MTksImp0aSI6IjFPTEJ2S1FXdTRvRHl2MzEiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.Zj2GVNIBtVzDLhHi8hLLFZCW56iEnCCd1z6S-RmdkZk";

/* ---------------------------
   Types (reflects server JSON)
   --------------------------- */

export interface ApiCategory {
  id: number;
  name: string;
  image?: string | null;       // relative path on some rows
  image_url?: string | null;   // full URL when provided
}

export interface ApiProductRow {
  id: number;
  name: string;
  category?: ApiCategory | null;
  grams?: string | null;
  price?: string | number | null;            // e.g. "1000.00"
  image?: string | null;                     // e.g. "products/xxx.jpg"
  image_url?: string | null;                 // full URL
  discount_price?: string | number | null;
  discount_amount?: string | number | null;
  discount_percent?: string | number | null;
  vendor_id?: number | null;
  stock?: string | number | null;
  created_at?: string | null;
  updated_at?: string | null;
  [k: string]: any;
}

/* ---------------------------
   App Product shape (normalized)
   --------------------------- */

export interface ProductCategory {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  category?: ProductCategory;
  grams?: string;
  price: number;                 // parsed number
  imageUrl?: string;             // full URL (image_url preferred)
  discountPrice?: number;        // discount_price
  discountAmount?: number;       // discount_amount
  discountPercent?: number;
  vendorId?: string | null;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
  // extra helpers
  isOutOfStock: boolean;
}

/* ---------------------------
   Context types
   --------------------------- */

interface ProductContextType {
  products: Product[];
  reload: () => Promise<void>;
  addProduct: (payload: any) => Promise<Product>;
  updateProduct: (id: string, payload: any) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getActiveProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = (): ProductContextType => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within a ProductProvider");
  return ctx;
};

/* ---------------------------
   Normalizer
   --------------------------- */

function toNumberSafe(v: any): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number.parseFloat(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function getFullStorageUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined;
  const s = String(pathOrUrl).trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  // server stores images under /public/storage/...
  return `${API_ORIGIN}/public/storage/${s.replace(/^\/+/, "")}`;
}

function normalizeServerProduct(r: ApiProductRow): Product {
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
        imageUrl: r.category.image_url ? String(r.category.image_url) : (r.category.image ? getFullStorageUrl(r.category.image) : undefined)
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
    isOutOfStock: (Number.isFinite(Number(stock)) ? Number(stock) : 0) <= 0
  };
}

/* ---------------------------
   Provider
   --------------------------- */

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  // attach Authorization header if token available; prefer STATIC_TOKEN if present
  const getAuthHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = { Accept: "application/json" };
    // Use STATIC_TOKEN first if it's defined; otherwise fall back to dynamic token/localStorage
    const resolvedToken = STATIC_TOKEN || token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (resolvedToken) headers["Authorization"] = `Bearer ${resolvedToken}`;
    return headers;
  }, [token]);

  /**
   * Reload - calls the exact endpoint you provided and expects { status, data }
   */
  const reload = useCallback(async () => {
    try {
      const res = await fetch(PRODUCTS_URL, {
        method: "GET",
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        console.warn("Failed fetching products:", res.status, res.statusText);
        setProducts([]);
        return;
      }

      const payload = await res.json();

      // payload expected: { status: true, data: [...] }
      const rows = Array.isArray(payload?.data) ? payload.data : [];

      const normalized = rows.map((r: ApiProductRow) => normalizeServerProduct(r));
      setProducts(normalized);
    } catch (err) {
      console.error("reload products failed", err);
      setProducts([]);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    // auto-load once on mount
    reload();
  }, [reload]);

  /* ---------------------------
     CRUD helpers (use same origin for admin endpoints)
     --------------------------- */

  const buildFormData = (productData: any) => {
    const fd = new FormData();
    if (productData.name) fd.append("name", String(productData.name));
    if (productData.description) fd.append("description", String(productData.description ?? ""));
    if (typeof productData.price !== "undefined") fd.append("price", String(productData.price));
    if (typeof productData.discount_price !== "undefined") fd.append("discount_price", String(productData.discount_price));
    if (productData.category_id) fd.append("category_id", String(productData.category_id));
    if (typeof productData.stock !== "undefined") fd.append("stock", String(productData.stock || 0));
    if (productData.imageFiles && Array.isArray(productData.imageFiles)) {
      productData.imageFiles.forEach((f: File) => fd.append("images", f));
    }
    if (Array.isArray(productData.images)) {
      const urlImages = productData.images
        .map((s: any) => String(s || "").trim())
        .filter((s: string) => /^https?:\/\//i.test(s));
      if (urlImages.length) fd.append("images_urls", JSON.stringify(urlImages));
    }
    return fd;
  };

  const addProduct = useCallback(async (productData: any): Promise<Product> => {
    const fd = buildFormData(productData);
    const res = await fetch(`${API_ORIGIN}/public/api/admin/products`, {
      method: "POST",
      headers: getAuthHeaders(), // do not set Content-Type (browser will set)
      body: fd
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Add product failed ${res.status}: ${t || res.statusText}`);
    }
    const body = await res.json();
    const row = body?.data ?? body;
    const normalized = normalizeServerProduct(row as ApiProductRow);
    setProducts(prev => [normalized, ...prev]);
    window.dispatchEvent(new CustomEvent("productsUpdated"));
    return normalized;
  }, [getAuthHeaders]);

  const updateProduct = useCallback(async (id: string, productData: any): Promise<Product> => {
    const hasFiles = Array.isArray(productData.imageFiles) && productData.imageFiles.length > 0;
    if (hasFiles) {
      const fd = buildFormData(productData);
      const res = await fetch(`${API_ORIGIN}/public/api/admin/products/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: fd
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Update product failed ${res.status}: ${t || res.statusText}`);
      }
      const body = await res.json();
      const row = body?.data ?? body;
      const normalized = normalizeServerProduct(row as ApiProductRow);
      setProducts(prev => prev.map(p => (p.id === String(id) ? normalized : p)));
      window.dispatchEvent(new CustomEvent("productsUpdated"));
      return normalized;
    }

    // JSON update
    const payload: any = {
      name: productData.name,
      price: productData.price,
      discount_price: productData.discount_price,
      stock: productData.stock,
      category_id: productData.category_id
    };
    const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
    const res = await fetch(`${API_ORIGIN}/public/api/admin/products/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Update product failed ${res.status}: ${t || res.statusText}`);
    }
    const body = await res.json();
    const row = body?.data ?? body;
    const normalized = normalizeServerProduct(row as ApiProductRow);
    setProducts(prev => prev.map(p => (p.id === String(id) ? normalized : p)));
    window.dispatchEvent(new CustomEvent("productsUpdated"));
    return normalized;
  }, [getAuthHeaders]);

  const deleteProduct = useCallback(async (id: string) => {
    const res = await fetch(`${API_ORIGIN}/public/api/admin/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Delete product failed ${res.status}: ${t || res.statusText}`);
    }
    setProducts(prev => prev.filter(p => p.id !== String(id)));
    window.dispatchEvent(new CustomEvent("productsUpdated"));
  }, [getAuthHeaders]);

  /* ---------------------------
     Consumers / helpers
     --------------------------- */

  const getProductById = (id: string) => products.find(p => p.id === id);
  const getActiveProducts = () => products.filter(p => !p.isOutOfStock);

  const ctxValue: ProductContextType = {
    products,
    reload,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getActiveProducts
  };

  return <ProductContext.Provider value={ctxValue}>{children}</ProductContext.Provider>;
};
