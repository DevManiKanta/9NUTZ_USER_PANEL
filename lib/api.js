// // api.js (JSX-compatible, plain JavaScript)

export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'https://ecom.nearbydoctors.in').replace(/\/+$/, '');

function buildUrl(path) {
  if (!path) return API_BASE;
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.replace(/^\/+/, '');
  return `${API_BASE}/${p}`;
}

async function request(path, opts = {}) {
  const url = buildUrl(path);
  const init = {
    method: opts.method || 'GET',
    headers: { ...(opts.headers || {}) },
    credentials: opts.credentials ?? 'same-origin',
  };

  if (opts.body !== undefined) {
    init.headers = { ...(init.headers || {}), 'Content-Type': 'application/json' };
    init.body = JSON.stringify(opts.body);
  }

  if (opts.token) {
    init.headers = { ...(init.headers || {}), Authorization: `Bearer ${opts.token}` };
  }

  const res = await fetch(url, init);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    const message = data?.message || data || res.statusText;
    const err = new Error(String(message));
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export default request;

/* -------------------
   AUTH (public)
   ------------------- */
export const registerAPI = (payload) =>
  request('/api/auth/register', { method: 'POST', body: payload });

export const loginAPI = (payload) =>
  request('/api/auth/login', { method: 'POST', body: payload, credentials: 'include' });

export const meAPI = (token) =>
  request('/api/auth/me', { token, credentials: 'include' });

/* -------------------
   PRODUCTS (public)
   ------------------- */
export const getProductsAPI = () => request('/api/products');
export const getProductAPI = (id) => request(`/api/products/${id}`);

/* -------------------
   CATEGORIES
   ------------------- */

// Admin: users
export const adminGetUsersAPI = (token) =>
  request('/api/admin/users', { token });

export const adminGetUserOrdersAPI = (userId, token) =>
  request(`/api/admin/users/${userId}/orders`, { token });

// Public URLs
export const CATEGORIES_API_URL = "https://9nutsapi.nearbydoctors.in/public/api/category/show";
export const PRODUCTS_URL = "https://9nutsapi.nearbydoctors.in/public/api/product/show";
export const Login_API_BASE = ("https://9nutsapi.nearbydoctors.in/public/api").replace(/\/+$/, '');
export const Razorpay_CheckOut_url = "https://checkout.razorpay.com/v1/checkout.js";
export const LOCAL_API_BASE='http://192.168.1.8:8000/api';

// Fetch categories (public)
export const getCategoriesPublicAPI = async () => {
  const API_URL = "https://9nutsapi.nearbydoctors.in/public/api/admin/categories/show";
  const TOKEN =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovLzludXRzYXBpLm5lYXJieWRvY3RvcnMuaW4vcHVibGljL2FwaS9sb2dpbiIsImlhdCI6MTc1OTczMDcxOSwiZXhwIjoxNzYwNTk0NzE5LCJuYmYiOjE3NTk3MzA3MTksImp0aSI6IjFPTEJ2S1FXdTRvRHl2MzEiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.Zj2GVNIBtVzDLhHi8hLLFZCW56iEnCCd1z6S-RmdkZk";

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${data.message || "Unknown error"}`);
    }
    if (data && data.status === true && Array.isArray(data.data)) {
      return data.data;
    }
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Admin (token required)
export const adminGetCategoriesAPI = (token) =>
  request('/api/admin/categories', { token });

export const createCategoryAPI = (payload, token) =>
  request('/api/admin/categories', { method: 'POST', body: payload, token });

export const updateCategoryAPI = (id, payload, token) =>
  request(`/api/admin/categories/${id}`, { method: 'PUT', body: payload, token });

export const deleteCategoryAPI = (id, token) =>
  request(`/api/admin/categories/${id}`, { method: 'DELETE', token });

/* -------------------
   PRODUCTS - Admin
   ------------------- */
export const adminGetProductsAPI = (token) =>
  request('/api/admin/products', { token });

export const createProductAPI = (payload, token) =>
  request('/api/admin/products', { method: 'POST', body: payload, token });

export const updateProductAPI = (id, payload, token) =>
  request(`/api/admin/products/${id}`, { method: 'PUT', body: payload, token });

export const deleteProductAPI = (id, token) =>
  request(`/api/admin/products/${id}`, { method: 'DELETE', token });

/* -------------------
   ORDERS
   ------------------- */
export const placeOrderAPI = (payload, token) =>
  request('/api/orders', { method: 'POST', body: payload, token });

export const getMyOrdersAPI = (token) => request('/api/orders/my', { token });
export const adminGetOrdersAPI = (token) => request('/api/orders', { token });

export const updateOrderStatusAPI = (id, status, token) =>
  request(`/api/orders/${id}/status`, { method: 'PUT', body: { status }, token });
