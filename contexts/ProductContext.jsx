// "use client";

// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import apiAxios from "@/lib/api";
// import { Login_API_BASE } from "@/lib/api";
// import axios from "axios";
// // const API_ORIGIN = new URL(apiAxios).origin;
// const ProductContext = createContext(undefined);

// export const useProducts = () => {
//   const ctx = useContext(ProductContext);
//   if (!ctx) throw new Error("useProducts must be used within a ProductProvider");
//   return ctx;
// };

// function toNumberSafe(v) {
//   if (typeof v === "number") return v;
//   if (typeof v === "string") {
//     const n = Number.parseFloat(v.replace(/,/g, ""));
//     return Number.isFinite(n) ? n : 0;
//   }
//   return 0;
// }

// function getFullStorageUrl(pathOrUrl) {
//   if (!pathOrUrl) return undefined;
//   const s = String(pathOrUrl).trim();
//   if (!s) return undefined;
//   if (/^https?:\/\//i.test(s)) return s;
//   return `${API_ORIGIN}/public/storage/${s.replace(/^\/+/, "")}`;
// }

// function normalizeServerProduct(r) {
//   const imageUrl = r.image_url ? String(r.image_url) : (r.image ? getFullStorageUrl(r.image) : undefined);

//   const price = toNumberSafe(r.price);
//   const discountPrice = typeof r.discount_price !== "undefined" && r.discount_price !== null ? toNumberSafe(r.discount_price) : undefined;
//   const discountAmount = typeof r.discount_amount !== "undefined" && r.discount_amount !== null ? toNumberSafe(r.discount_amount) : undefined;
//   const discountPercent = typeof r.discount_percent !== "undefined" && r.discount_percent !== null ? toNumberSafe(r.discount_percent) : undefined;

//   const stock = (() => {
//     const s = r.stock ?? 0;
//     return Number.isFinite(Number(s)) ? Number(s) : toNumberSafe(s);
//   })();

//   const category = r.category
//     ? {
//         id: String(r.category.id ?? ""),
//         name: String(r.category.name ?? ""),
//         imageUrl: r.category.image_url ? String(r.category.image_url) : (r.category.image ? getFullStorageUrl(r.category.image) : undefined),
//       }
//     : undefined;

//   return {
//     id: String(r.id ?? ""),
//     name: String(r.name ?? ""),
//     category,
//     grams: r.grams ? String(r.grams) : undefined,
//     price,
//     imageUrl: imageUrl ?? undefined,
//     discountPrice: typeof discountPrice === "number" ? discountPrice : undefined,
//     discountAmount: typeof discountAmount === "number" ? discountAmount : undefined,
//     discountPercent: typeof discountPercent === "number" ? discountPercent : undefined,
//     vendorId: typeof r.vendor_id !== "undefined" && r.vendor_id !== null ? String(r.vendor_id) : undefined,
//     stock: Number.isFinite(Number(stock)) ? Number(stock) : 0,
//     createdAt: r.created_at ? new Date(r.created_at) : undefined,
//     updatedAt: r.updated_at ? new Date(r.updated_at) : undefined,
//     isOutOfStock: (Number.isFinite(Number(stock)) ? Number(stock) : 0) <= 0,
//   };
// }

// export const ProductProvider = ({ children }) => {
//   const { token } = useAuth();
//   const [products, setProducts] = useState([]);

// const reload = useCallback(async () => {
//   try {
//     const res = await axios.get(`${Login_API_BASE}/product/show`);
//     const payload = res.data;
//     const rows = Array.isArray(payload?.data) ? payload.data : [];

//     const normalized = rows.map((r) => normalizeServerProduct(r));
//     setProducts(normalized);
//   } catch (err) {
    
//     setProducts([]);
//   }
// }, []);
//   useEffect(() => {
//     reload();
//   }, [reload]);

//   const buildFormData = (productData) => {
//     const fd = new FormData();
//     if (productData.name) fd.append("name", String(productData.name));
//     if (productData.description) fd.append("description", String(productData.description ?? ""));
//     if (typeof productData.price !== "undefined") fd.append("price", String(productData.price));
//     if (typeof productData.discount_price !== "undefined") fd.append("discount_price", String(productData.discount_price));
//     if (productData.category_id) fd.append("category_id", String(productData.category_id));
//     if (typeof productData.stock !== "undefined") fd.append("stock", String(productData.stock || 0));
//     if (productData.imageFiles && Array.isArray(productData.imageFiles)) {
//       productData.imageFiles.forEach((f) => fd.append("images", f));
//     }
//     if (Array.isArray(productData.images)) {
//       const urlImages = productData.images
//         .map((s) => String(s || "").trim())
//         .filter((s) => /^https?:\/\//i.test(s));
//       if (urlImages.length) fd.append("images_urls", JSON.stringify(urlImages));
//     }
//     return fd;
//   };

//   const addProduct = useCallback(async (productData) => {
//     const fd = buildFormData(productData);
//     const res = await fetch(`${API_ORIGIN}/public/api/admin/products`, {
//       method: "POST",
//       body: fd,
//     });
//     if (!res.ok) {
//       const t = await res.text().catch(() => "");
//       throw new Error(`Add product failed ${res.status}: ${t || res.statusText}`);
//     }
//     const body = await res.json();
//     const row = body?.data ?? body;
//     const normalized = normalizeServerProduct(row);
//     setProducts((prev) => [normalized, ...prev]);
//     window.dispatchEvent(new CustomEvent("productsUpdated"));
//     return normalized;
//   }, []);

//   const updateProduct = useCallback(async (id, productData) => {
//     const hasFiles = Array.isArray(productData.imageFiles) && productData.imageFiles.length > 0;
//     if (hasFiles) {
//       const fd = buildFormData(productData);
//       const res = await fetch(`${API_ORIGIN}/public/api/admin/products/${id}`, {
//         method: "PUT",
//         body: fd,
//       });
//       if (!res.ok) {
//         const t = await res.text().catch(() => "");
//         throw new Error(`Update product failed ${res.status}: ${t || res.statusText}`);
//       }
//       const body = await res.json();
//       const row = body?.data ?? body;
//       const normalized = normalizeServerProduct(row);
//       setProducts((prev) => prev.map((p) => (p.id === String(id) ? normalized : p)));
//       window.dispatchEvent(new CustomEvent("productsUpdated"));
//       return normalized;
//     }

//     const payload = {
//       name: productData.name,
//       price: productData.price,
//       discount_price: productData.discount_price,
//       stock: productData.stock,
//       category_id: productData.category_id,
//     };
//     const headers = { "Content-Type": "application/json" };
//     const res = await fetch(`${API_ORIGIN}/public/api/admin/products/${id}`, {
//       method: "PUT",
//       headers,
//       body: JSON.stringify(payload),
//     });
//     if (!res.ok) {
//       const t = await res.text().catch(() => "");
//       throw new Error(`Update product failed ${res.status}: ${t || res.statusText}`);
//     }
//     const body = await res.json();
//     const row = body?.data ?? body;
//     const normalized = normalizeServerProduct(row);
//     setProducts((prev) => prev.map((p) => (p.id === String(id) ? normalized : p)));
//     window.dispatchEvent(new CustomEvent("productsUpdated"));
//     return normalized;
//   }, []);

//   const deleteProduct = useCallback(async (id) => {
//     const res = await fetch(`${API_ORIGIN}/public/api/admin/products/${id}`, {
//       method: "DELETE",
//     });
//     if (!res.ok) {
//       const t = await res.text().catch(() => "");
//       throw new Error(`Delete product failed ${res.status}: ${t || res.statusText}`);
//     }
//     setProducts((prev) => prev.filter((p) => p.id !== String(id)));
//     window.dispatchEvent(new CustomEvent("productsUpdated"));
//   }, []);

//   const getProductById = (id) => products.find((p) => p.id === id);
//   const getActiveProducts = () => products.filter((p) => !p.isOutOfStock);

//   const ctxValue = {
//     products,
//     reload,
//     addProduct,
//     updateProduct,
//     deleteProduct,
//     getProductById,
//     getActiveProducts,
//   };

//   return <ProductContext.Provider value={ctxValue}>{children}</ProductContext.Provider>;
// };

"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import apiAxios from "@/lib/api";
import { Login_API_BASE } from "@/lib/api";
import axios from "axios";
const ProductContext = createContext(undefined);
export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within a ProductProvider");
  return ctx;
};

// --- helpers ---
function toNumberSafe(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number.parseFloat(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

// Login_API_BASE is expected to include the /public suffix (e.g. https://.../public)
// We'll compute STORAGE_BASE which points to the storage root that image paths use.
const LOGIN_BASE_CLEAN = (Login_API_BASE || "").replace(/\/+$/, "");
const STORAGE_BASE = LOGIN_BASE_CLEAN.includes("/public")
  ? LOGIN_BASE_CLEAN // e.g. https://.../public (API already points to public)
  : `${LOGIN_BASE_CLEAN}/public`;

// Build absolute storage url from a relative path like "products/xxx.jpg"
function getFullStorageUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  const s = String(pathOrUrl).trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  // If the server already serves via `${STORAGE_BASE}/storage/...` then construct url accordingly.
  // Many of your responses already include full image_url, but some endpoints may provide only the relative `image` path.
  // The API responses show full image_url with "/public/storage/...", so we build the same shape.
  // If `s` already includes 'storage/' return `${LOGIN_BASE_CLEAN}/${s}` otherwise use `storage/${s}`
  const candidate = s.replace(/^\/+/, "");
  // if candidate looks like "storage/..." or already has "public/storage", preserve structure
  if (/^storage\//i.test(candidate) || /\/storage\//i.test(candidate)) {
    return `${LOGIN_BASE_CLEAN}/${candidate}`;
  }
  // otherwise assume it should live under /public/storage/
  return `${STORAGE_BASE}/storage/${candidate}`;
}

function normalizeServerProduct(r) {
  if (!r) return null;

  // Normalize price & discounts
  const price = toNumberSafe(r.price);
  const discountPrice =
    typeof r.discount_price !== "undefined" && r.discount_price !== null ? toNumberSafe(r.discount_price) : undefined;
  const discountAmount =
    typeof r.discount_amount !== "undefined" && r.discount_amount !== null ? toNumberSafe(r.discount_amount) : undefined;
  const discountPercent =
    typeof r.discount_percent !== "undefined" && r.discount_percent !== null ? toNumberSafe(r.discount_percent) : undefined;

  // Normalize stock
  const stockRaw = r.stock ?? 0;
  const stock = Number.isFinite(Number(stockRaw)) ? Number(stockRaw) : toNumberSafe(stockRaw);

  // Category normalization
  const category = r.category
    ? {
        id: String(r.category.id ?? ""),
        name: String(r.category.name ?? ""),
        imageUrl: r.category.image_url
          ? String(r.category.image_url)
          : r.category.image
          ? getFullStorageUrl(r.category.image)
          : undefined,
      }
    : undefined;

  // Normalize images array from server (items often contain image and image_url)
  const imagesArr =
    Array.isArray(r.images) && r.images.length > 0
      ? r.images.map((it) => ({
          id: it?.id ?? undefined,
          product_id: it?.product_id ?? undefined,
          image: it?.image ?? undefined,
          image_url: it?.image_url ?? (it?.image ? getFullStorageUrl(it.image) : undefined),
          raw: it,
        }))
      : [];

  // Build imagesUrls simple array (use image_url first, fallback to image)
  const imagesUrls = imagesArr
    .map((it) => it.image_url ?? (it.image ? getFullStorageUrl(it.image) : undefined))
    .filter(Boolean);

  // Top-level image preferences:
  // - prefer r.image_url (already full)
  // - otherwise, if imagesUrls available use first
  // - otherwise fallback to r.image (relative) converted to full URL
  const imageUrl =
    (r.image_url && String(r.image_url)) ||
    (imagesUrls.length > 0 ? imagesUrls[0] : r.image ? getFullStorageUrl(r.image) : undefined);

  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    category,
    grams: r.grams ? String(r.grams) : undefined,
    description: r.description ?? undefined,
    price,
    imageUrl: imageUrl ?? undefined,
    image: r.image ?? undefined,
    images: imagesArr, // array of {id, image, image_url}
    imagesUrls, // array of strings (image URLs)
    discountPrice: typeof discountPrice === "number" ? discountPrice : undefined,
    discountAmount: typeof discountAmount === "number" ? discountAmount : undefined,
    discountPercent: typeof discountPercent === "number" ? discountPercent : undefined,
    vendorId: typeof r.vendor_id !== "undefined" && r.vendor_id !== null ? String(r.vendor_id) : undefined,
    stock: Number.isFinite(Number(stock)) ? Number(stock) : 0,
    createdAt: r.created_at ? new Date(r.created_at) : undefined,
    updatedAt: r.updated_at ? new Date(r.updated_at) : undefined,
    isOutOfStock: (Number.isFinite(Number(stock)) ? Number(stock) : 0) <= 0,
    raw: r,
  };
}

// ---------- Provider ----------
export const ProductProvider = ({ children }) => {
  const { token } = useAuth?.() ?? {}; // kept for parity
  const [products, setProducts] = useState([]);

  const reload = useCallback(async () => {
    try {
      // your existing call used Login_API_BASE; keep it unchanged.
      // The endpoint you used previously was `${Login_API_BASE}/product/show` — but sample responses you provided show the payload under data array.
      // We will attempt to call the same endpoint and safely extract res.data.data (array).
      const res = await axios.get(`${Login_API_BASE}/product/show`);
      const payload = res.data ?? res;
      // payload may be { status: true, message: "...", data: [...] }
      const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

      const normalized = rows.map((r) => normalizeServerProduct(r)).filter(Boolean);
      setProducts(normalized);
    } catch (err) {
      // keep behavior: on error, empty list (no crash)
      console.error("reload products failed", err);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  // build FormData: respects your API expectation (images[] files + images_urls JSON for remote urls)
  const buildFormData = (productData) => {
    const fd = new FormData();
    if (productData.name) fd.append("name", String(productData.name));
    if (productData.description) fd.append("description", String(productData.description ?? ""));
    if (typeof productData.price !== "undefined") fd.append("price", String(productData.price));
    if (typeof productData.discount_price !== "undefined") fd.append("discount_price", String(productData.discount_price));
    if (productData.category_id) fd.append("category_id", String(productData.category_id));
    if (typeof productData.stock !== "undefined") fd.append("stock", String(productData.stock || 0));

    // Append main image file (legacy field) if present
    if (productData.imageFile) {
      fd.append("image", productData.imageFile);
    }

    // Append additional image files as images[] (matches your curl examples)
    if (productData.imageFiles && Array.isArray(productData.imageFiles)) {
      productData.imageFiles.forEach((f) => {
        // backend expects images[] (array)
        fd.append("images[]", f);
      });
    }

    // If the client passed an array of image URLs (strings) include them as images_urls JSON
    if (Array.isArray(productData.images)) {
      const urlImages = productData.images.map((s) => String(s || "").trim()).filter((s) => /^https?:\/\//i.test(s));
      if (urlImages.length) fd.append("images_urls", JSON.stringify(urlImages));
    }

    return fd;
  };

  // addProduct: POST to same API (keeps your previous behavior)
  const addProduct = useCallback(async (productData) => {
    const fd = buildFormData(productData);
    // use the same origin you were using previously: Login_API_BASE/public/api/admin/products is expressed similarly in your earlier code.
    // We'll keep the endpoint path unchanged relative to what you had before: the previous code referenced `${API_ORIGIN}/public/api/admin/products`
    // but to avoid changing API surface, we keep using the Login_API_BASE host + expected path.
    // Construct the add URL from Login_API_BASE by ensuring it does not double-add /public.
    const addUrl = `${LOGIN_BASE_CLEAN}/api/admin/products`;
    const res = await fetch(addUrl, {
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
    // When files present, send FormData (PUT)
    const hasFiles = (productData.imageFile && productData.imageFile instanceof File) || (Array.isArray(productData.imageFiles) && productData.imageFiles.length > 0);
    const updateUrl = `${LOGIN_BASE_CLEAN}/api/admin/products/${id}`;

    if (hasFiles) {
      const fd = buildFormData(productData);
      const res = await fetch(updateUrl, {
        method: "POST", // some servers use POST with _method=PUT; if your backend expects PUT change accordingly
        // include method override: many PHP backends expect _method=PUT in multipart forms
        body: fd,
      });

      // If your backend expects method override, uncomment the following before sending:
      // fd.append('_method', 'PUT');

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

    // otherwise JSON update (no files)
    const payload = {
      name: productData.name,
      price: productData.price,
      discount_price: productData.discount_price,
      stock: productData.stock,
      category_id: productData.category_id,
    };
    const headers = { "Content-Type": "application/json" };
    const res = await fetch(updateUrl, {
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
    const delUrl = `${LOGIN_BASE_CLEAN}/api/admin/products/${id}`;
    const res = await fetch(delUrl, {
      method: "DELETE",
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Delete product failed ${res.status}: ${t || res.statusText}`);
    }
    setProducts((prev) => prev.filter((p) => p.id !== String(id)));
    window.dispatchEvent(new CustomEvent("productsUpdated"));
  }, []);

  const getProductById = (id) => products.find((p) => p.id === String(id));
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
