// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { X, Plus, Minus } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
// import { CartItem, ID } from "@/types";
// import toast, { Toaster } from "react-hot-toast";

// declare global {
//   interface Window {
//     Razorpay?: any;
//   }
// }

// interface CartSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   items: CartItem[];
//   onUpdateQuantity: (id: ID, quantity: number) => void;
//   onProceedToPay?: () => void;
// }

// export default function CartSidebar({
//   isOpen,
//   onClose,
//   items,
//   onUpdateQuantity,
//   onProceedToPay,
// }: CartSidebarProps) {
//   const { user, token } = useAuth() as any;
//   const [loadingPayment, setLoadingPayment] = useState(false);
//   const mountedRef = useRef(true);

//   useEffect(() => {
//     mountedRef.current = true;
//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   const parseNumber = (v: any): number => {
//     if (v === null || v === undefined || v === "") return 0;
//     const n = Number(String(v).replace(/,/g, ""));
//     return Number.isFinite(n) ? n : 0;
//   };
//   const rupeesToPaise = (v: any): number => Math.round(parseNumber(v) * 100);
//   const paiseToRupeesString = (p: number) => `₹${(p / 100).toFixed(2)}`;
//   const qtyOf = (q: any) => {
//     const n = Number(q ?? 0);
//     if (!Number.isFinite(n)) return 0;
//     return Math.max(0, Math.trunc(n));
//   };

//   const itemsWithPaise = useMemo(() => {
//     return items.map((item) => {
//       const pricePaise = rupeesToPaise((item as any).price ?? 0);
//       const originalPricePaise = rupeesToPaise((item as any).originalPrice ?? 0);
//       const quantity = qtyOf(item.quantity);
//       return {
//         item,
//         pricePaise,
//         originalPricePaise,
//         quantity,
//         subtotalPaise: pricePaise * quantity,
//         savedTotalPaise: Math.max(0, originalPricePaise - pricePaise) * quantity,
//       };
//     });
//   }, [items]);

//   const totalItems = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.quantity, 0), [itemsWithPaise]);
//   const totalPricePaise = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.subtotalPaise, 0), [itemsWithPaise]);
//   const totalSavingsPaise = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.savedTotalPaise, 0), [itemsWithPaise]);
//   const grandTotalPaise = totalPricePaise;

//   useEffect(() => {
//     if (isOpen) document.body.style.overflow = "hidden";
//     else document.body.style.overflow = "unset";
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen]);

//   const decrease = (id: ID, currentQty: number) =>
//     onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) - 1));
//   const increase = (id: ID, currentQty: number) =>
//     onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) + 1));

//   const razorpayLoaderRef = useRef<{ loaded: boolean; promise?: Promise<boolean> }>({ loaded: false });

//   const loadRazorpayScript = (): Promise<boolean> => {
//     if (typeof window === "undefined") return Promise.resolve(false);
//     if (window.Razorpay) {
//       razorpayLoaderRef.current.loaded = true;
//       return Promise.resolve(true);
//     }
//     if (razorpayLoaderRef.current.promise) return razorpayLoaderRef.current.promise;

//     razorpayLoaderRef.current.promise = new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       script.onload = () => {
//         razorpayLoaderRef.current.loaded = true;
//         resolve(true);
//       };
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//     return razorpayLoaderRef.current.promise;
//   };

//   // Build absolute endpoint URL using NEXT_PUBLIC_API_BASE if present
//   const buildUrl = (path: string) => {
//     const base = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
//     if (!base) return path; // relative to same origin
//     return `${base}${path.startsWith("/") ? path : "/" + path}`;
//   };

//   // Submit order to server: uses full/relative URL depending on env
//   const submitOrderToServer = async (paymentResponse: any) => {
//     const endpoint = buildUrl("/api/orders/confirm");
//     const payloadItems = itemsWithPaise.map(({ item, pricePaise, quantity, subtotalPaise }) => ({
//       id: item.id,
//       name: item.name,
//       quantity,
//       unit_price_paise: pricePaise,
//       unit_price_rupees: (pricePaise / 100).toFixed(2),
//       subtotal_paise: subtotalPaise,
//     }));

//     const payload = {
//       user: {
//         id: (user as any)?.id ?? null,
//         name: (user as any)?.name ?? null,
//         email: (user as any)?.email ?? null,
//         phone: (user as any)?.phone ?? null,
//       },
//       payment: {
//         provider: "razorpay",
//         payment_id: paymentResponse?.razorpay_payment_id ?? null,
//         order_id: paymentResponse?.razorpay_order_id ?? null,
//         signature: paymentResponse?.razorpay_signature ?? null,
//         raw: paymentResponse ?? null,
//       },
//       items: payloadItems,
//       totals: {
//         items_total_paise: totalPricePaise,
//         grand_total_paise: grandTotalPaise,
//         total_savings_paise: totalSavingsPaise,
//         currency: "INR",
//       },
//       meta: {
//         notes: items.map((it) => `${it.name} x${it.quantity}`).join(", "),
//       },
//     };

//     const headers: Record<string, string> = { "Content-Type": "application/json" };
//     if (token) headers["Authorization"] = `Bearer ${token}`;

//     const res = await fetch(endpoint, {
//       method: "POST",
//       headers,
//       body: JSON.stringify(payload),
//       credentials: "include",
//     });

//     const text = await res.text().catch(() => "");
//     let json;
//     try {
//       json = text ? JSON.parse(text) : null;
//     } catch (e) {
//       throw new Error(`Invalid JSON response from server: ${text}`);
//     }
//     if (!res.ok) {
//       throw new Error(json?.message || `Server returned ${res.status}`);
//     }
//     return json;
//   };

//   // Call server capture endpoint if needed
//   const capturePaymentOnServer = async (paymentId: string, amountPaise: number) => {
//     const endpoint = buildUrl("/api/payments/capture");
//     const headers: Record<string, string> = { "Content-Type": "application/json" };
//     if (token) headers["Authorization"] = `Bearer ${token}`;

//     const res = await fetch(endpoint, {
//       method: "POST",
//       headers,
//       body: JSON.stringify({ payment_id: paymentId, amount_paise: amountPaise }),
//       credentials: "include",
//     });

//     const text = await res.text().catch(() => "");
//     let json;
//     try {
//       json = text ? JSON.parse(text) : null;
//     } catch (e) {
//       throw new Error(`Invalid JSON from capture endpoint: ${text}`);
//     }
//     if (!res.ok) {
//       throw new Error(json?.message || `Capture API returned ${res.status}`);
//     }
//     return json;
//   };

//   const handlePayWithRazorpay = async () => {
//     if (!user) {
//       toast.error("Please login to proceed to payment.");
//       return;
//     }
//     if (!items || items.length === 0) {
//       toast.error("Cart is empty.");
//       return;
//     }
//     if (loadingPayment) return;

//     setLoadingPayment(true);
//     const startToastId = toast.loading("Preparing payment...");
//     try {
//       const ok = await loadRazorpayScript();
//       if (!ok) throw new Error("Failed to load Razorpay SDK.");

//       const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RNiKLAWnAJRrZG";
//       if (!keyId) throw new Error("Razorpay public key is not configured.");

//       const notesText = items.map((it) => `${it.name} x${it.quantity}`).join(", ");

//       const paymentSuccessHandler = async (response: any) => {
//         const recordingToast = toast.loading("Recording order...");
//         try {
//           // If no order_id was used (frontend-only), optionally capture via server
//           if (!response?.razorpay_order_id) {
//             try {
//               await capturePaymentOnServer(response.razorpay_payment_id, grandTotalPaise);
//             } catch (captureErr) {
//               console.warn("Capture failed:", captureErr);
//               // proceed to record order anyway
//             }
//           }

//           await submitOrderToServer(response);

//           if (!mountedRef.current) return;
//           toast.dismiss(startToastId);
//           toast.dismiss(recordingToast);
//           toast.success("Payment successful and order recorded. Thank you!");
//           if (typeof onProceedToPay === "function") onProceedToPay();
//           onClose();
//         } catch (err: any) {
//           console.error("Order recording/capture flow failed:", err);
//           toast.dismiss(startToastId);
//           toast.dismiss(recordingToast);
//           toast.success("Payment completed — please contact support if order is not recorded.");
//           toast.error(`Order recording failed (payment id: ${response?.razorpay_payment_id ?? "N/A"})`, {
//             duration: 10000,
//           });
//         } finally {
//           if (mountedRef.current) setLoadingPayment(false);
//         }
//       };

//       const options: any = {
//         key: keyId,
//         amount: grandTotalPaise,
//         currency: "INR",
//         name: "9Nutz",
//         description: `Order of ${totalItems} item(s)`,
//         prefill: {
//           name: (user as any)?.name ?? "",
//           email: (user as any)?.email ?? "",
//           contact: (user as any)?.phone ?? "",
//         },
//         notes: { items: notesText },
//         theme: { color: "#16a34a" },
//         handler: function (response: any) {
//           void paymentSuccessHandler(response);
//         },
//         modal: {
//           ondismiss: function () {
//             toast.dismiss(startToastId);
//             if (mountedRef.current) setLoadingPayment(false);
//             toast("Payment cancelled", { icon: "⚠️" });
//           },
//         },
//       };

//       toast.dismiss(startToastId);
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err: any) {
//       console.error("Payment start failed:", err);
//       toast.dismiss();
//       toast.error(err?.message || "Payment failed to start.");
//       if (mountedRef.current) setLoadingPayment(false);
//     }
//   };

//   return (
//     <>
//       <Toaster position="top-right" reverseOrder={false} />

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
//         onClick={onClose}
//         aria-hidden={!isOpen}
//       />

//       <aside
//         className={`fixed top-0 right-0 h-full w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
//         role="dialog"
//         aria-hidden={!isOpen}
//       >
//         <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//           <h2 className="text-lg font-semibold">My Cart</h2>
//           <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close cart">
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {items.length === 0 ? (
//             <div className="flex items-center justify-center h-full p-6">
//               <p className="text-gray-500">Your cart is empty</p>
//             </div>
//           ) : (
//             <div className="p-4 space-y-4">
//               {itemsWithPaise.map(({ item, quantity, subtotalPaise }) => {
//                 const imageSrc = (item as any).imageUrl ?? (item as any).image ?? "/placeholder.png";
//                 return (
//                   <div key={String(item.id)} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
//                     <img src={imageSrc} alt={item.name} className="w-12 h-12 object-cover rounded-lg" onError={(e) => (e.currentTarget as HTMLImageElement).src = "/placeholder.png"} />
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</h3>
//                       {item.weight && <p className="text-xs text-gray-500 mt-1">{item.weight}</p>}
//                     </div>

//                     <div className="flex flex-col items-end space-y-2">
//                       <div className="flex items-center bg-green-600 text-white rounded-lg">
//                         <button onClick={() => decrease(item.id, quantity)} className="p-1 hover:bg-green-700 rounded-l-lg" aria-label="Decrease quantity"><Minus className="w-3 h-3" /></button>
//                         <span className="px-2 text-sm font-medium">{quantity}</span>
//                         <button onClick={() => increase(item.id, quantity)} className="p-1 hover:bg-green-700 rounded-r-lg" aria-label="Increase quantity"><Plus className="w-3 h-3" /></button>
//                       </div>
//                       <div className="text-right"><div className="font-bold text-sm">{paiseToRupeesString(subtotalPaise)}</div></div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {items.length > 0 && (
//           <div className="border-t border-gray-200">
//             <div className="p-4">
//               <h3 className="font-semibold text-gray-900 mb-3">Bill details</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between"><span>Items total</span><span className="font-semibold">{paiseToRupeesString(totalPricePaise)}</span></div>

//                 <div className="border-t border-gray-200 pt-2 mt-3">
//                   <div className="flex justify-between font-bold text-lg">
//                     <span>Grand total</span>
//                     <span>{paiseToRupeesString(grandTotalPaise)}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                 <h4 className="font-semibold text-sm mb-1">Cancellation Policy</h4>
//                 <p className="text-xs text-gray-600">Orders cannot be cancelled once packed. Refunds handled per policy.</p>
//               </div>

//               <button
//                 onClick={handlePayWithRazorpay}
//                 className={`w-full py-4 rounded-lg font-semibold text-lg mt-4 flex items-center justify-around ${user ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
//                 disabled={!user || loadingPayment}
//               >
//                 <span>{paiseToRupeesString(grandTotalPaise)}</span>
//                 <span>{user ? (loadingPayment ? "Processing..." : "Pay with Razorpay") : "Login to Proceed"}</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </aside>
//     </>
//   );
// }
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem, ID } from "@/types";
import toast, { Toaster } from "react-hot-toast";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: ID, quantity: number) => void;
  onProceedToPay?: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onProceedToPay,
}: CartSidebarProps) {
  const { user, token } = useAuth() as any;
  const [loadingPayment, setLoadingPayment] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // helpers
  const parseNumber = (v: any): number => {
    if (v === null || v === undefined || v === "") return 0;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };
  const rupeesToPaise = (v: any): number => Math.round(parseNumber(v) * 100);
  const paiseToRupeesString = (p: number) => `₹${(p / 100).toFixed(2)}`;
  const qtyOf = (q: any) => {
    const n = Number(q ?? 0);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.trunc(n));
  };

  // totals memoized
  const itemsWithPaise = useMemo(
    () =>
      items.map((item) => {
        const pricePaise = rupeesToPaise((item as any).price ?? 0);
        const originalPricePaise = rupeesToPaise((item as any).originalPrice ?? 0);
        const quantity = qtyOf(item.quantity);
        return {
          item,
          pricePaise,
          originalPricePaise,
          quantity,
          subtotalPaise: pricePaise * quantity,
          savedTotalPaise: Math.max(0, originalPricePaise - pricePaise) * quantity,
        };
      }),
    [items]
  );

  const totalItems = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.quantity, 0), [itemsWithPaise]);
  const totalPricePaise = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.subtotalPaise, 0), [itemsWithPaise]);
  const totalSavingsPaise = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.savedTotalPaise, 0), [itemsWithPaise]);
  const grandTotalPaise = totalPricePaise;

  // body scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  const decrease = (id: ID, currentQty: number) =>
    onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) - 1));
  const increase = (id: ID, currentQty: number) =>
    onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) + 1));

  // Razorpay loader singleton
  const razorpayLoaderRef = useRef<{ loaded: boolean; promise?: Promise<boolean> }>({ loaded: false });
  const loadRazorpayScript = (): Promise<boolean> => {
    if (typeof window === "undefined") return Promise.resolve(false);
    if (window.Razorpay) {
      razorpayLoaderRef.current.loaded = true;
      return Promise.resolve(true);
    }
    if (razorpayLoaderRef.current.promise) return razorpayLoaderRef.current.promise;

    razorpayLoaderRef.current.promise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        razorpayLoaderRef.current.loaded = true;
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    return razorpayLoaderRef.current.promise;
  };

  // POST order to server (recording function)
  const submitOrderToServer = async (paymentResponse: any) => {
    const endpoint = "/api/orders/confirm";
    const payloadItems = itemsWithPaise.map(({ item, pricePaise, quantity, subtotalPaise }) => ({
      id: item.id,
      name: item.name,
      quantity,
      unit_price_paise: pricePaise,
      unit_price_rupees: (pricePaise / 100).toFixed(2),
      subtotal_paise: subtotalPaise,
    }));

    const payload = {
      user: {
        id: (user as any)?.id ?? null,
        name: (user as any)?.name ?? null,
        email: (user as any)?.email ?? null,
        phone: (user as any)?.phone ?? null,
      },
      payment: {
        provider: "razorpay",
        payment_id: paymentResponse?.razorpay_payment_id ?? null,
        order_id: paymentResponse?.razorpay_order_id ?? null,
        signature: paymentResponse?.razorpay_signature ?? null,
        raw: paymentResponse ?? null,
      },
      items: payloadItems,
      totals: {
        items_total_paise: totalPricePaise,
        grand_total_paise: grandTotalPaise,
        total_savings_paise: totalSavingsPaise,
        currency: "INR",
      },
      meta: { notes: items.map((it) => `${it.name} x${it.quantity}`).join(", ") },
    };

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      credentials: "same-origin",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Server error ${res.status}: ${txt}`);
    }
    return res.json();
  };

  // UNSAFE: Exposes your Razorpay secret in client-side code. Use ONLY for local testing.
const capturePaymentOnServer = async (paymentId: string, amountPaise: number) => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RNiKLAWnAJRrZG";
  const keySecret = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET || "Xhweoip9SXz3nw0M1rK5teyo"); // WILL BE exposed!
  if (!keyId || !keySecret) throw new Error("Razorpay key id/secret not provided (client).");

  const url = `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/capture`;
  const basicAuth = btoa(`${keyId}:${keySecret}`); // browser btoa

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${basicAuth}`,
    },
    body: JSON.stringify({ amount: Number(amountPaise) }) // amount in paise
  });

  const text = await resp.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }

  if (!resp.ok) {
    throw new Error(`Capture failed ${resp.status}: ${JSON.stringify(json)}`);
  }
  return json;
};


  // main payment flow
  const handlePayWithRazorpay = async () => {
    if (!user) {
      toast.error("Please login to proceed to payment.");
      return;
    }
    if (!items || items.length === 0) {
      toast.error("Cart is empty.");
      return;
    }
    if (loadingPayment) return;

    setLoadingPayment(true);
    const startToastId = toast.loading("Preparing payment...");

    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay SDK.");

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RNiKLAWnAJRrZG";
      if (!keyId) throw new Error("Razorpay public key is not configured.");

      const notesText = items.map((it) => `${it.name} x${it.quantity}`).join(", ");

      // Called by Razorpay's client SDK when payment succeeds
      const paymentSuccessHandler = async (response: any) => {
        const recordingToastId = toast.loading("Recording order & capturing payment...");

        try {
          // If you want to capture on server (recommended when using front-end only flow),
          // call your capture endpoint with payment id + amount in paise.
          // If your server created an order and razorpay auto-captured, capture endpoint may not be necessary.
          if (response?.razorpay_payment_id) {
            try {
              await capturePaymentOnServer(response.razorpay_payment_id, grandTotalPaise);
            } catch (captureErr) {
              // Reasonable to continue to record order even if capture failed (server may mark as need-review).
              console.warn("Capture failed on server:", captureErr);
            }
          }
          // Record order in DB (server verifies signatures / payment in production)
          await submitOrderToServer(response);
          if (!mountedRef.current) return;
          toast.dismiss(startToastId);
          toast.dismiss(recordingToastId);
          toast.success("Payment captured and order recorded — thank you!");
          if (typeof onProceedToPay === "function") onProceedToPay();
          onClose();
        } catch (err: any) {
          console.error("Record/capture error:", err);
          toast.dismiss(startToastId);
          toast.dismiss(recordingToastId);
          toast.success("Payment received"); // at least payment succeeded
          toast.error(
            `Failed to record order or capture payment. Payment id: ${response?.razorpay_payment_id ?? "N/A"}`,
            { duration: 10000 }
          );
        } finally {
          if (mountedRef.current) setLoadingPayment(false);
        }
      };

      // Options passed to Razorpay checkout
      const options: any = {
        key: keyId,
        amount: grandTotalPaise, // paise (integer)
        currency: "INR",
        name: "9Nutz",
        description: `Order of ${totalItems} item(s)`,
        prefill: {
          name: (user as any)?.name ?? "",
          email: (user as any)?.email ?? "",
          contact: (user as any)?.phone ?? "",
        },
        notes: { items: notesText },
        theme: { color: "#16a34a" },
        handler: function (response: any) {
          void paymentSuccessHandler(response);
        },
        modal: {
          ondismiss: function () {
            toast.dismiss(startToastId);
            if (mountedRef.current) setLoadingPayment(false);
            toast("Payment cancelled", { icon: "⚠️" });
          },
        },
      };

      // dismiss preparing toast & open checkout
      toast.dismiss(startToastId);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment start failed:", err);
      toast.dismiss();
      toast.error(err?.message || "Payment failed to start.");
      if (mountedRef.current) setLoadingPayment(false);
    }
  };

  return (
    <>
      {/* Toaster (if not already at app root) */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        role="dialog"
        aria-hidden={!isOpen}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Cart</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close cart">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full p-6">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {itemsWithPaise.map(({ item, quantity, subtotalPaise }) => {
                const imageSrc = (item as any).imageUrl ?? (item as any).image ?? "/placeholder.png";
                return (
                  <div key={String(item.id)} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</h3>
                      {item.weight && <p className="text-xs text-gray-500 mt-1">{item.weight}</p>}
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center bg-green-600 text-white rounded-lg">
                        <button
                          onClick={() => decrease(item.id, quantity)}
                          className="p-1 hover:bg-green-700 rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-sm font-medium">{quantity}</span>
                        <button
                          onClick={() => increase(item.id, quantity)}
                          className="p-1 hover:bg-green-700 rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{paiseToRupeesString(subtotalPaise)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Bill details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items total</span>
                  <span className="font-semibold">{paiseToRupeesString(totalPricePaise)}</span>
                </div>

                <div className="border-t border-gray-200 pt-2 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Grand total</span>
                    <span>{paiseToRupeesString(grandTotalPaise)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Cancellation Policy</h4>
                <p className="text-xs text-gray-600">Orders cannot be cancelled once packed. Refunds handled per policy.</p>
              </div>

              <button
                onClick={handlePayWithRazorpay}
                className={`w-full py-4 rounded-lg font-semibold text-lg mt-4 flex items-center justify-around ${
                  user ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={!user || loadingPayment}
              >
                <span>{paiseToRupeesString(grandTotalPaise)}</span>
                <span>{user ? (loadingPayment ? "Processing..." : "Pay with Razorpay") : "Login to Proceed"}</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
