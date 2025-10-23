// // OrdersTable.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Search,
//   Package,
//   Clock,
//   Laptop,
//   Truck,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { LOCAL_API_BASE } from "@/lib/api";

// export default function OrdersTablePage({ initialOrders = [] }) {
//   const [userOrders, setUserOrders] = useState(Array.isArray(initialOrders) ? initialOrders : []);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Helper: token getter
//   const getToken = () => localStorage.getItem("token") || "";

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     const token = getToken();
//     if (!token) {
//       toast.error("Not logged in — token missing.");
//       return;
//     }

//     setIsLoading(true);
//     const loadingId = toast.loading("Loading orders...");
//     try {
//       const res = await fetch(`${LOCAL_API_BASE}/admin/online-orders/user`, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json().catch(() => null);

//       if (!res.ok) {
//         const msg = data?.message || `Failed to fetch orders (${res.status})`;
//         toast.error(msg);
//         throw new Error(msg);
//       }

//       // Expected shape may vary. We attempt to find an array of orders in common places.
//       // If API returns { status: true, orders: [...] } or simply an array, handle both.
//       let ordersArray = [];
//       if (Array.isArray(data)) {
//         ordersArray = data;
//       } else if (Array.isArray(data.orders)) {
//         ordersArray = data.orders;
//       } else if (Array.isArray(data.data)) {
//         ordersArray = data.data;
//       } else if (data?.status === true && Array.isArray(data?.orders)) {
//         ordersArray = data.orders;
//       } else {
//         // Try to search keys for the first array found (best-effort)
//         const firstArray = Object.values(data || {}).find((v) => Array.isArray(v));
//         if (Array.isArray(firstArray)) ordersArray = firstArray;
//       }

//       // If still empty, treat as no orders (but don't error)
//       setUserOrders(ordersArray || []);
//       toast.dismiss(loadingId);
//       toast.success("Orders loaded");
//     } catch (err) {
//       console.error("fetchOrders error:", err);
//       toast.dismiss();
//       toast.error(err?.message || "Failed to load orders");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper to compute color class for status
//   const getStatusColor = (status) => {
//     if (!status) return "bg-gray-100 text-gray-800";
//     const s = String(status).toLowerCase();
//     if (["delivered", "complete"].includes(s)) return "bg-green-100 text-green-700";
//     if (["shipped", "in-transit", "shipped"].includes(s)) return "bg-blue-100 text-blue-700";
//     if (["packed", "processing"].includes(s)) return "bg-yellow-100 text-yellow-800";
//     if (["cancelled", "returned", "failed"].includes(s)) return "bg-red-100 text-red-700";
//     return "bg-gray-100 text-gray-800";
//   };

//   // Flatten orders → rows with line totals and normalize fields (keeps original logic)
//   const rows = useMemo(() => {
//     const flat = (userOrders || []).flatMap((order) =>
//       (order?.items || []).map((item, idx) => {
//         const qty = Number(item?.qty ?? item?.quantity ?? 1);
//         const price = Number(item?.price ?? item?.unitPrice ?? 0);
//         const lineTotal = qty * price;
//         return {
//           key: `${order.id ?? `o-${idx}`}-${idx}`,
//           orderId: order.id ?? order.orderId ?? "—",
//           status: (order.status || "").toLowerCase(),
//           orderDate: order.orderDate ?? order.created_at ?? order.createdAt ?? order.date ?? null,
//           deliveryAddress: order.deliveryAddress ?? order.address ?? null,
//           total: order.total ?? order.grand_total ?? null,
//           item: {
//             name: item?.name ?? item?.title ?? "—",
//             image: item?.image ?? (item?.images && item.images[0]) ?? null,
//             sku: item?.sku ?? item?.code ?? "—",
//             qty,
//             price,
//             lineTotal,
//             variant: item?.variant ?? item?.options ?? null,
//             category: item?.category ?? null,
//           },
//         };
//       })
//     );

//     // Static demo row as in your original snippet
//     const staticRows = [
//       {
//         key: "static-1",
//         orderId: "DEMO123456",
//         status: "shipped",
//         orderDate: new Date("2025-10-10"),
//         deliveryAddress: { name: "Demo User", city: "Bengaluru" },
//         total: 1499,
//         item: {
//           name: "Demo Product – Wireless Earbuds",
//           image:
//             "https://images.unsplash.com/photo-1518441902116-f26c36f0b55c?q=80&w=400&auto=format&fit=crop",
//           sku: "DEMO-SKU-001",
//           qty: 1,
//           price: 1499,
//           lineTotal: 1499,
//         },
//       },
//     ];

//     return [...flat, ...staticRows];
//   }, [userOrders]);

//   // Search filter
//   const filtered = useMemo(() => {
//     const q = String(searchTerm || "").trim().toLowerCase();
//     if (!q) return rows;
//     return rows.filter((r) => {
//       return (
//         String(r.orderId || "").toLowerCase().includes(q) ||
//         String(r.item?.name || "").toLowerCase().includes(q) ||
//         String(r.item?.sku || "").toLowerCase().includes(q)
//       );
//     });
//   }, [rows, searchTerm]);

//   // Small utility to format currency
//   const formatCurrency = (n) => {
//     const num = Number(n || 0);
//     return `₹${num.toFixed(2)}`;
//   };

//   // Rendering
//   return (
//     <div className="space-y-6 w-full">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//         <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

//         <div className="relative w-full sm:max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by order #, product, or SKU..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             aria-label="Search orders"
//           />
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="text-center py-12">
//           <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-600">Loading orders…</p>
//         </div>
//       ) : rows.length === 0 ? (
//         <div className="text-center py-12">
//           <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
//           <p className="text-gray-500">Your order history will appear here</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-12">
//           <Search className="h-10 w-10 text-gray-400 mx-auto mb-3" />
//           <p className="text-gray-600">No products match your search.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
//           <table className="min-w-[900px] w-full text-left">
//             <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
//               <tr>
//                 <th className="px-4 py-3">Product</th>
//                 <th className="px-4 py-3">SKU</th>
//                 <th className="px-4 py-3">Order #</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Qty</th>
//                 <th className="px-4 py-3">Price</th>
//                 <th className="px-4 py-3">Line Total</th>
//                 <th className="px-4 py-3">Ordered On</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100 text-sm">
//               {filtered.map((r) => (
//                 <tr key={r.key} className="hover:bg-gray-50/60">
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-3">
//                       {r.item.image ? (
//                         // eslint-disable-next-line @next/next/no-img-element
//                         <img
//                           src={r.item.image}
//                           alt={r.item.name}
//                           className="h-12 w-12 rounded-lg object-cover border"
//                         />
//                       ) : (
//                         <div className="h-12 w-12 rounded-lg bg-gray-100 border" />
//                       )}
//                       <div>
//                         <div className="font-medium text-gray-900">{r.item.name}</div>
//                         {(r.item.variant || r.item.category) && (
//                           <div className="text-xs text-gray-500">
//                             {r.item.variant ? `Variant: ${String(r.item.variant)}` : ""}
//                             {r.item.variant && r.item.category ? " • " : ""}
//                             {r.item.category ? `Category: ${String(r.item.category)}` : ""}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-4 py-3 text-gray-700">{r.item.sku}</td>

//                   <td className="px-4 py-3 font-mono text-gray-800">
//                     #{String(r.orderId || "").slice(-6).toUpperCase()}
//                   </td>

//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                         r.status
//                       )}`}
//                     >
//                       {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "—"}
//                     </span>
//                   </td>

//                   <td className="px-4 py-3">{r.item.qty}</td>

//                   <td className="px-4 py-3">{formatCurrency(r.item.price)}</td>

//                   <td className="px-4 py-3 font-semibold text-gray-900">
//                     {formatCurrency(r.item.lineTotal)}
//                   </td>

//                   <td className="px-4 py-3 text-gray-700">
//                     {r.orderDate instanceof Date
//                       ? r.orderDate.toLocaleDateString()
//                       : r.orderDate
//                       ? new Date(r.orderDate).toLocaleDateString()
//                       : "—"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//             <tfoot className="bg-gray-50">
//               <tr>
//                 <td className="px-4 py-3 text-xs text-gray-500" colSpan={8}>
//                   Showing {filtered.length} product{filtered.length > 1 ? "s" : ""} from{" "}
//                   {userOrders.length} order{userOrders.length > 1 ? "s" : ""}.
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

// OrdersTablePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, Package, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import { LOCAL_API_BASE } from "@/lib/api";

/**
 * OrdersTablePage
 *
 * - Fetches from: GET `${LOCAL_API_BASE}/api/admin/online-orders/user`
 * - Shows columns: customer_name, image (first item's image parsed from items JSON string),
 *   total, payment, order_time (formatted), address
 *
 * Important:
 * - Token is read from localStorage.getItem('token'). Change getToken() if your key differs.
 * - The component expects the response shape you posted:
 *   { status: true, message: "...", data: { data: [ { ...orders... } ], ... } }
 */

export default function OrdersTablePage({ initialOrders = [] }) {
  const [orders, setOrders] = useState(Array.isArray(initialOrders) ? initialOrders : []);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Not logged in — token missing.");
      return;
    }

    setIsLoading(true);
    const loadingId = toast.loading("Loading orders...");
    try {
      const res = await fetch(`${LOCAL_API_BASE}/admin/online-orders/user`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = json?.message || `Failed to fetch orders (${res.status})`;
        toast.error(msg);
        throw new Error(msg);
      }

      // Your API returns pagination at json.data.data
      const ordersArray = (json && json.data && Array.isArray(json.data.data))
        ? json.data.data
        : Array.isArray(json) ? json : [];

      setOrders(ordersArray);
      toast.dismiss(loadingId);
      toast.success("Orders loaded");
    } catch (err) {
      console.error("fetchOrders error:", err);
      toast.dismiss();
      toast.error(err?.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Map orders to rows that contain only the required fields
  const rows = useMemo(() => {
    return (orders || []).map((o) => {
      // parse items string — items is stored as a JSON string in API
      let parsedItems = [];
      try {
        if (typeof o.items === "string" && o.items.trim()) {
          parsedItems = JSON.parse(o.items);
        } else if (Array.isArray(o.items)) {
          parsedItems = o.items;
        }
      } catch (err) {
        console.warn("Failed to parse items for order", o.id, err);
        parsedItems = [];
      }

      // first item image (if available)
      const firstItem = parsedItems && parsedItems.length > 0 ? parsedItems[0] : null;
      // image field in your payload looks like: "http://192.168.../storage/products/..."
      const image = firstItem?.image ?? null;

      return {
        key: `order-${o.id}`,
        id: o.id,
        customer_name: o.customer_name ?? o.customer_name ?? "—",
        image,
        total: o.total ?? "—",
        payment: o.payment ?? "—",
        order_time: o.order_time ?? o.created_at ?? o.order_time_formatted ?? null,
        address: o.address ?? "—",
      };
    });
  }, [orders]);

  // Filter by customer_name only (per request)
  const filtered = useMemo(() => {
    const q = String(searchTerm || "").trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => String(r.customer_name || "").toLowerCase().includes(q));
  }, [rows, searchTerm]);

  const formatDate = (iso) => {
    if (!iso) return "—";
    // try to use existing formatted string if server returned it
    try {
      // if already a formatted string like "Oct 22, 2025 - 10:41 AM" (non-ISO),
      // just return it when new Date() fails.
      const dt = new Date(iso);
      if (!isNaN(dt.getTime())) {
        return dt.toLocaleString();
      }
      return String(iso);
    } catch {
      return String(iso);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            aria-label="Search orders by customer name"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders…</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500">Your order history will appear here</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No customers match your search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-[700px] w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Ordered On</th>
                <th className="px-4 py-3">Address</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((r) => (
                <tr key={r.key} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.customer_name}</td>

                  <td className="px-4 py-3">
                    {r.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.image}
                        alt={r.customer_name + " product"}
                        className="h-12 w-12 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 border" />
                    )}
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {typeof r.total === "string" && !isNaN(Number(r.total))
                      ? `₹${Number(r.total).toFixed(2)}`
                      : r.total}
                  </td>

                  <td className="px-4 py-3 text-gray-700">{r.payment}</td>

                  <td className="px-4 py-3 text-gray-700">{formatDate(r.order_time)}</td>

                  <td className="px-4 py-3 text-gray-700">{r.address}</td>
                </tr>
              ))}
            </tbody>

            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-4 py-3 text-xs text-gray-500" colSpan={6}>
                  Showing {filtered.length} order{filtered.length > 1 ? "s" : ""}.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

