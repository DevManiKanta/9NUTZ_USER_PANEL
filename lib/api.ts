export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'https://ecom.nearbydoctors.in').replace(/\/+$/,'');

type ReqOpts = {
  method?: string;
  body?: any;
  token?: string | null;
  headers?: Record<string,string>;
  credentials?: RequestCredentials; // optional
};

function buildUrl(path: string) {
  if (!path) return API_BASE;
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.replace(/^\/+/, '');
  return `${API_BASE}/${p}`;
}

async function request(path: string, opts: ReqOpts = {}) {
  const url = buildUrl(path);
  const init: RequestInit = {
    method: opts.method || 'GET',
    headers: { ...(opts.headers || {}) },
    // respect credentials when caller supplies it (useful for cookie sessions)
    credentials: opts.credentials ?? 'same-origin'
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
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch(e) { data = text; }

  if (!res.ok) {
    const message = data?.message || data || res.statusText;
    const err: any = new Error(String(message));
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
export const registerAPI = (payload: { name: string; email: string; password: string }) =>
  request('/api/auth/register', { method: 'POST', body: payload });

export const loginAPI = (payload: { email: string; password: string }) =>
  request('/api/auth/login', { method: 'POST', body: payload, credentials: 'include' }); // if backend sets cookies

export const meAPI = (token?: string) =>
  request('/api/auth/me', { token, credentials: 'include' });



/* -------------------
   PRODUCTS (public)
   ------------------- */
export const getProductsAPI = () => request('/api/products');
export const getProductAPI = (id: number | string) => request(`/api/products/${id}`);

/* -------------------
   CATEGORIES
   ------------------- */

// Admin: users
export const adminGetUsersAPI = (token?: string) =>
  request('/api/admin/users', { token });

export const adminGetUserOrdersAPI = (userId: string | number, token?: string) =>
  request(`/api/admin/users/${userId}/orders`, { token });

// Public
// export const getCategoriesPublicAPI = () => request('/api/categories');

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
export const adminGetCategoriesAPI = (token?: string) =>
  request('/api/admin/categories', { token });

export const createCategoryAPI = (payload: any, token?: string) =>
  request('/api/admin/categories', { method: 'POST', body: payload, token });

export const updateCategoryAPI = (id: number | string, payload: any, token?: string) =>
  request(`/api/admin/categories/${id}`, { method: 'PUT', body: payload, token });

export const deleteCategoryAPI = (id: number | string, token?: string) =>
  request(`/api/admin/categories/${id}`, { method: 'DELETE', token });

/* -------------------
   PRODUCTS - Admin
   ------------------- */
export const adminGetProductsAPI = (token?: string) =>
  request('/api/admin/products', { token });

export const createProductAPI = (payload: any, token?: string) =>
  request('/api/admin/products', { method: 'POST', body: payload, token });

export const updateProductAPI = (id: number | string, payload: any, token?: string) =>
  request(`/api/admin/products/${id}`, { method: 'PUT', body: payload, token });

export const deleteProductAPI = (id: number | string, token?: string) =>
  request(`/api/admin/products/${id}`, { method: 'DELETE', token });

/* -------------------
   ORDERS
   ------------------- */
export const placeOrderAPI = (payload: { items: { product_id:number; quantity:number }[] }, token?: string) =>
  request('/api/orders', { method: 'POST', body: payload, token });

export const getMyOrdersAPI = (token?: string) => request('/api/orders/my', { token });
export const adminGetOrdersAPI = (token?: string) => request('/api/orders', { token });
export const updateOrderStatusAPI = (id: number | string, status: string, token?: string) =>
  request(`/api/orders/${id}/status`, { method: 'PUT', body: { status }, token });
