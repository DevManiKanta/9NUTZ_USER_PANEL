

// import React, { useEffect, useMemo, useState } from "react";
// import { Search, Package, Clock } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { LOCAL_API_BASE, Login_API_BASE } from "@/lib/api";

// export default function OrdersTablePage({ initialOrders = [] }) {
//   const [orders, setOrders] = useState(Array.isArray(initialOrders) ? initialOrders : []);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const getToken = () => localStorage.getItem("token") || "";

//   useEffect(() => {
//     fetchOrders();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
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

//       const json = await res.json().catch(() => null);

//       if (!res.ok) {
//         const msg = json?.message || `Failed to fetch orders (${res.status})`;
//         toast.error(msg);
//         throw new Error(msg);
//       }

//       // Your API returns pagination at json.data.data
//       const ordersArray = (json && json.data && Array.isArray(json.data.data))
//         ? json.data.data
//         : Array.isArray(json) ? json : [];

//       setOrders(ordersArray);
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

//   // Map orders to rows that contain only the required fields
//   const rows = useMemo(() => {
//     return (orders || []).map((o) => {
//       // parse items string — items is stored as a JSON string in API
//       let parsedItems = [];
//       try {
//         if (typeof o.items === "string" && o.items.trim()) {
//           parsedItems = JSON.parse(o.items);
//         } else if (Array.isArray(o.items)) {
//           parsedItems = o.items;
//         }
//       } catch (err) {
//         console.warn("Failed to parse items for order", o.id, err);
//         parsedItems = [];
//       }

//       // first item image (if available)
//       const firstItem = parsedItems && parsedItems.length > 0 ? parsedItems[0] : null;
//       // image field in your payload looks like: "http://192.168.../storage/products/..."
//       const image = firstItem?.image ?? null;

//       return {
//         key: `order-${o.id}`,
//         id: o.id,
//         customer_name: o.customer_name ?? o.customer_name ?? "—",
//         image,
//         total: o.total ?? "—",
//         payment: o.payment ?? "—",
//         order_time: o.order_time ?? o.created_at ?? o.order_time_formatted ?? null,
//         address: o.address ?? "—",
//       };
//     });
//   }, [orders]);

//   // Filter by customer_name only (per request)
//   const filtered = useMemo(() => {
//     const q = String(searchTerm || "").trim().toLowerCase();
//     if (!q) return rows;
//     return rows.filter((r) => String(r.customer_name || "").toLowerCase().includes(q));
//   }, [rows, searchTerm]);

//   const formatDate = (iso) => {
//     if (!iso) return "—";
//     // try to use existing formatted string if server returned it
//     try {
//       // if already a formatted string like "Oct 22, 2025 - 10:41 AM" (non-ISO),
//       // just return it when new Date() fails.
//       const dt = new Date(iso);
//       if (!isNaN(dt.getTime())) {
//         return dt.toLocaleString();
//       }
//       return String(iso);
//     } catch {
//       return String(iso);
//     }
//   };

//   return (
//     <div className="space-y-6 w-full">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//         <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

//         <div className="relative w-full sm:max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by customer name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             aria-label="Search orders by customer name"
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
//           <p className="text-gray-600">No customers match your search.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
//           <table className="min-w-[700px] w-full text-left">
//             <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
//               <tr>
//                 <th className="px-4 py-3">Customer</th>
//                 <th className="px-4 py-3">Image</th>
//                 <th className="px-4 py-3">Total</th>
//                 <th className="px-4 py-3">Payment</th>
//                 <th className="px-4 py-3">Ordered On</th>
//                 <th className="px-4 py-3">Address</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100 text-sm">
//               {filtered.map((r) => (
//                 <tr key={r.key} className="hover:bg-gray-50/60">
//                   <td className="px-4 py-3 font-medium text-gray-900">{r.customer_name}</td>

//                   <td className="px-4 py-3">
//                     {r.image ? (
//                       // eslint-disable-next-line @next/next/no-img-element
//                       <img
//                         src={r.image}
//                         alt={r.customer_name + " product"}
//                         className="h-12 w-12 rounded-lg object-cover border"
//                       />
//                     ) : (
//                       <div className="h-12 w-12 rounded-lg bg-gray-100 border" />
//                     )}
//                   </td>

//                   <td className="px-4 py-3 font-semibold text-gray-900">
//                     {typeof r.total === "string" && !isNaN(Number(r.total))
//                       ? `₹${Number(r.total).toFixed(2)}`
//                       : r.total}
//                   </td>

//                   <td className="px-4 py-3 text-gray-700">{r.payment}</td>

//                   <td className="px-4 py-3 text-gray-700">{formatDate(r.order_time)}</td>

//                   <td className="px-4 py-3 text-gray-700">{r.address}</td>
//                 </tr>
//               ))}
//             </tbody>

//             <tfoot className="bg-gray-50">
//               <tr>
//                 <td className="px-4 py-3 text-xs text-gray-500" colSpan={6}>
//                   Showing {filtered.length} order{filtered.length > 1 ? "s" : ""}.
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
"use client"
import React, { useEffect, useMemo, useState } from "react";
import { Search, Package, Clock, X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { LOCAL_API_BASE,Login_API_BASE } from "@/lib/api";
export default function OrdersTablePage({ initialOrders = [] }) {
  // store server paginated object and current page data
  const [ordersData, setOrdersData] = useState(null);
  const [orders, setOrders] = useState(Array.isArray(initialOrders) ? initialOrders : []);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // modal state
  const [viewOrder, setViewOrder] = useState(null);

  const getToken = () => localStorage.getItem("token") || "";

  // fetch orders with optional page (defined BEFORE useEffect to avoid reference error)
  const fetchOrders = async (p = 1) => {
    const token = getToken();
    if (!token) {
      toast.error("Not logged in — token missing.");
      return;
    }

    setIsLoading(true);
    const loadingId = toast.loading("Loading orders...");
    try {
      // request 5 orders per page
      const url = `${Login_API_BASE}/admin/online-orders/user?page=${p}&per_page=5`;
      const res = await fetch(url, {
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

      // server returns pagination in json.data (data.data array)
      const payloadOrders =
        json && json.data && Array.isArray(json.data.data) ? json.data.data : Array.isArray(json) ? json : [];

      setOrders(payloadOrders);
      setOrdersData(json?.data ?? null);
      setPage(p);

      toast.dismiss(loadingId);
      toast.success(json?.message ?? "Orders loaded");
    } catch (err) {
      
      toast.dismiss();
      toast.error(err?.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetch first page on mount
    fetchOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Parse items for a given order (handles stringified JSON or array)
  const parseItems = (itemsField) => {
    if (!itemsField) return [];
    try {
      if (typeof itemsField === "string") {
        const trimmed = itemsField.trim();
        if (!trimmed) return [];
        return JSON.parse(trimmed);
      }
      if (Array.isArray(itemsField)) return itemsField;
    } catch (err) {
      
      return [];
    }
    return [];
  };

  // Map orders to rows (single row per order)
  const rows = useMemo(() => {
    return (orders || []).map((o) => {
      const parsedItems = parseItems(o.items);
      const firstItem = parsedItems.length > 0 ? parsedItems[0] : null;
      const image = firstItem?.image ?? null;

      return {
        key: `order-${o.id}`,
        raw: o,
        id: o.id,
        customer_name: o.customer_name ?? "—",
        image,
        total: o.total ?? "—",
        payment: o.payment ?? "—",
        order_time: o.order_time ?? o.created_at ?? o.order_time_formatted ?? null,
        address: o.address ?? "—",
        items: parsedItems,
        status: o.status ?? null,
        awb_number: o.awb_number ?? null,
        tracking_id: o.tracking_id ?? null,
        shipping_url: o.shipping_url ?? null,
        subtotal: o.subtotal ?? null,
        gst_amount: o.gst_amount ?? null,
        discount_value: o.discount_value ?? null,
      };
    });
  }, [orders]);

  // Filter by customer_name only
  const filtered = useMemo(() => {
    const q = String(searchTerm || "").trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => String(r.customer_name || "").toLowerCase().includes(q));
  }, [rows, searchTerm]);

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      // prefer server formatted string if present; otherwise use Date parse
      const dt = new Date(iso);
      if (!isNaN(dt.getTime())) {
        return dt.toLocaleString();
      }
      return String(iso);
    } catch {
      return String(iso);
    }
  };

  // Render pagination using server-provided data (ordersData)
  const renderPagination = () => {
    if (!ordersData) return null;

    const current = ordersData.current_page ?? page;
    const last = ordersData.last_page ?? null;

    return (
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-t sm:px-6" aria-label="Pagination">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{ordersData.from ?? 1}</span> to{" "}
            <span className="font-medium">{ordersData.to ?? rows.length}</span> of{" "}
            <span className="font-medium">{ordersData.total ?? rows.length}</span> results
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center sm:justify-end gap-1">
          <button
            onClick={() => fetchOrders(Math.max(1, current - 1))}
            disabled={!ordersData.prev_page_url}
            className="px-3 py-1 rounded border bg-white text-sm disabled:opacity-50"
          >
            Prev
          </button>

          {/* show up to 7 page buttons (center current) */}
          {(() => {
            const buttons = [];
            let start = 1;
            let end = last ?? current;
            if (last && last > 7) {
              start = Math.max(1, current - 3);
              end = Math.min(last, start + 6);
              if (end - start < 6) start = Math.max(1, end - 6);
            }
            for (let p = start; p <= end; p++) {
              buttons.push(
                <button
                  key={p}
                  onClick={() => fetchOrders(p)}
                  className={`px-3 py-1 rounded border text-sm ${p === current ? "bg-emerald-600 text-white" : "bg-white"}`}
                >
                  {p}
                </button>
              );
            }
            return buttons;
          })()}

          <button
            onClick={() => fetchOrders((ordersData.current_page ?? page) + 1)}
            disabled={!ordersData.next_page_url}
            className="px-3 py-1 rounded border bg-white text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </nav>
    );
  };

  return (
    <div className="space-y-6 w-full">
      <Toaster position="top-right" reverseOrder={false} />

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
        <>
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
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map((r) => (
                  <tr key={r.key} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.customer_name}</td>

                    <td className="px-4 py-3">
                      {r.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.image} alt={`${r.customer_name} product`} className="h-12 w-12 rounded-lg object-cover border" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-100 border" />
                      )}
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {typeof r.total === "string" && !isNaN(Number(r.total)) ? `₹${Number(r.total).toFixed(2)}` : r.total}
                    </td>

                    <td className="px-4 py-3 text-gray-700">{r.payment}</td>

                    <td className="px-4 py-3 text-gray-700">{formatDate(r.order_time)}</td>

                    <td className="px-4 py-3 text-gray-700">{r.address}</td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewOrder(r.raw)}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded border text-sm text-indigo-600 hover:bg-indigo-50"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-3 text-xs text-gray-500" colSpan={7}>
                    Showing {filtered.length} order{filtered.length > 1 ? "s" : ""}.
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* pagination */}
          {renderPagination()}
        </>
      )}

      {/* View order modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewOrder(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl p-4 z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Order #{viewOrder.id} <span className="ml-2 text-sm font-medium text-gray-500"> • {viewOrder.status ?? "Status N/A"}</span>
                </h3>
                <div className="text-xs text-gray-500 mt-1">Customer: {viewOrder.customer_name}</div>
              </div>
              <button onClick={() => setViewOrder(null)} className="rounded-md p-1 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Items</div>
                <div className="space-y-3">
                  {parseItems(viewOrder.items).length === 0 ? (
                    <div className="text-sm text-gray-500">No items found</div>
                  ) : (
                    parseItems(viewOrder.items).map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border rounded">
                        <div className="flex-shrink-0 h-16 w-16">
                          {it.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={it.image} alt={it.name} className="h-16 w-16 object-cover rounded" />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{it.name}</div>
                          <div className="text-sm text-gray-500">Qty: {it.quantity ?? it.qty ?? 1}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ₹
                            {it.price_rupees ?? it.price ?? (it.price_paise ? (Number(it.price_paise) / 100).toFixed(2) : "—")}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total: ₹
                            {(it.quantity || it.qty) && it.price_rupees ? (Number(it.price_rupees) * Number(it.quantity || it.qty)).toFixed(2) : "—"}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Summary</div>
                <div className="space-y-2 bg-gray-50 p-3 rounded">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{viewOrder.subtotal ?? viewOrder.total ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>GST</span>
                    <span>₹{viewOrder.gst_amount ?? "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Discount</span>
                    <span>- ₹{viewOrder.discount_value ?? "0.00"}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{viewOrder.total ?? "—"}</span>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="text-xs text-gray-500">Payment</div>
                    <div className="text-sm text-gray-900">{viewOrder.payment}</div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="text-xs text-gray-500">Tracking details</div>
                    <div className="text-sm text-gray-900 space-y-1">
                      {viewOrder.status === "Shipping" ? (
                        <div className="space-y-1">
                          <div>
                            <span className="text-xs text-gray-500">AWB / Tracking</span>
                            <div>{viewOrder.awb_number ?? viewOrder.tracking_id ?? "—"}</div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Tracking URL</span>
                            <div>
                              {viewOrder.shipping_url ? (
                                <a href={viewOrder.shipping_url} target="_blank" rel="noreferrer" className="text-emerald-600 underline">
                                  View tracking
                                </a>
                              ) : (
                                "—"
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {viewOrder.shipping_url ? (
                            <a href={viewOrder.shipping_url} target="_blank" rel="noreferrer" className="text-emerald-600 underline">
                              View tracking
                            </a>
                          ) : (
                            viewOrder.awb_number ?? viewOrder.tracking_id ?? "—"
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="text-xs text-gray-500">Address</div>
                    <div className="text-sm text-gray-900">{viewOrder.address}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={() => setViewOrder(null)} className="px-4 py-2 rounded border">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

