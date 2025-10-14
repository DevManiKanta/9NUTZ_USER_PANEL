

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
//   onClearCart?: () => void;
// }

// type CreateOrderResponse = {
//   status?: boolean;
//   success?: boolean;
//   message?: string;
//   data?: any;
//   key?: string;
//   amount?: number;
//   currency?: string;
//   order_id?: string;
// };

// type VerifyResponse = {
//   status?: boolean;
//   success?: boolean;
//   message?: string;
//   data?: any;
// };

// export default function CartSidebar({
//   isOpen,
//   onClose,
//   items,
//   onUpdateQuantity,
//   onProceedToPay,
//   onClearCart,
// }: CartSidebarProps) {
//   const { user, token } = (useAuth() as any) ?? {};
//   const [loadingPayment, setLoadingPayment] = useState(false);
//   const mountedRef = useRef(true);

//   const API_BASE = "http://192.168.29.100:8000";
//   const CREATE_ORDER_ENDPOINT = `${API_BASE}/api/razorpay/order`;
//   const VERIFY_ENDPOINT = `${API_BASE}/api/razorpay/verify`;

//   // ---- Choose the unit you want to use for create-order 'amount' value ----
//   // "rupees" -> create will POST { amount: <rounded rupees integer> } (e.g. { amount: 500 })
//   // "paise"  -> create will POST { amount: <integer paise> } (e.g. { amount: 50000 })
//   // The code below is defaulted to "rupees" because you requested { amount: 500 } style.
//   const AMOUNT_UNIT: "paise" | "rupees" = "rupees";

//   useEffect(() => {
//     mountedRef.current = true;
//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   // helpers
//   const parseNumber = (v: any): number => {
//     if (v === null || v === undefined || v === "") return 0;
//     const n = Number(String(v).replace(/,/g, ""));
//     return Number.isFinite(n) ? n : 0;
//   };
//   const rupeesToPaise = (v: any): number => Math.round(parseNumber(v) * 100);
//   const paiseToRupeesString = (p: number) => `₹${(Number.isFinite(p) ? p / 100 : 0).toFixed(2)}`;
//   const qtyOf = (q: any) => {
//     const n = Number(q ?? 0);
//     if (!Number.isFinite(n)) return 0;
//     return Math.max(0, Math.trunc(n));
//   };

//   // totals memoized
//   const itemsWithPaise = useMemo(
//     () =>
//       (items ?? []).map((item) => {
//         const pricePaise = rupeesToPaise((item as any).price ?? 0);
//         const originalPricePaise = rupeesToPaise((item as any).originalPrice ?? 0);
//         const quantity = qtyOf((item as any).quantity ?? 0);
//         return {
//           item,
//           pricePaise,
//           originalPricePaise,
//           quantity,
//           subtotalPaise: pricePaise * quantity,
//           savedTotalPaise: Math.max(0, originalPricePaise - pricePaise) * quantity,
//         };
//       }),
//     [items]
//   );

//   const totalItems = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.quantity, 0), [itemsWithPaise]);
//   const totalPricePaise = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.subtotalPaise, 0), [itemsWithPaise]);
//   const totalSavingsPaise = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.savedTotalPaise, 0), [itemsWithPaise]);
//   const grandTotalPaise = totalPricePaise; // integer paise
//   const grandTotalRupees = Number((grandTotalPaise / 100).toFixed(2)); // float rupees

//   // body scroll lock
//   useEffect(() => {
//     if (typeof document === "undefined") return;
//     const prev = document.body.style.overflow;
//     if (isOpen) document.body.style.overflow = "hidden";
//     else document.body.style.overflow = "unset";
//     return () => {
//       document.body.style.overflow = prev || "unset";
//     };
//   }, [isOpen]);

//   const decrease = (id: ID, currentQty: number) => onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) - 1));
//   const increase = (id: ID, currentQty: number) => onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) + 1));

//   // Razorpay script loader singleton
//   const razorpayLoaderRef = useRef<{ loaded: boolean; promise?: Promise<boolean> }>({ loaded: false });
//   const loadRazorpayScript = (): Promise<boolean> => {
//     if (typeof window === "undefined") return Promise.resolve(false);
//     if (window.Razorpay) {
//       razorpayLoaderRef.current.loaded = true;
//       return Promise.resolve(true);
//     }
//     if (razorpayLoaderRef.current.promise) return razorpayLoaderRef.current.promise;

//     razorpayLoaderRef.current.promise = new Promise((resolve) => {
//       try {
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         script.onload = () => {
//           razorpayLoaderRef.current.loaded = true;
//           resolve(true);
//         };
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       } catch (e) {
//         resolve(false);
//       }
//     });

//     return razorpayLoaderRef.current.promise;
//   };

//   // fetch with timeout helper
//   const fetchWithTimeout = async (input: RequestInfo, init?: RequestInit, timeout = 15000) => {
//     const controller = new AbortController();
//     const id = setTimeout(() => controller.abort(), timeout);
//     try {
//       const res = await fetch(input, { ...(init ?? {}), signal: controller.signal });
//       clearTimeout(id);
//       return res;
//     } catch (err) {
//       clearTimeout(id);
//       throw err;
//     }
//   };

//   // optional fallback server-side recording (keeps using same endpoint, adjust if your backend uses a different route)
//   const submitOrderToServer = async (paymentResponse: any, payloadItems?: any[], orderMeta?: any) => {
//     const endpoint = `${API_BASE}/api/razorpay/order`;
//     const itemsPayload =
//       payloadItems ??
//       itemsWithPaise.map(({ item, pricePaise, quantity, subtotalPaise }) => ({
//         id: (item as any)?.id ?? null,
//         name: (item as any)?.name ?? "",
//         quantity,
//         unit_price_paise: pricePaise,
//         unit_price_rupees: (pricePaise / 100).toFixed(2),
//         subtotal_paise: subtotalPaise,
//       }));

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
//       items: itemsPayload,
//       totals: {
//         items_total_paise: totalPricePaise,
//         grand_total_paise: grandTotalPaise,
//         total_savings_paise: totalSavingsPaise,
//         currency: "INR",
//       },
//       meta: orderMeta ?? { notes: (items ?? []).map((it) => `${(it as any).name ?? ""} x${(it as any).quantity ?? 0}`).join(", ") },
//     };

//     const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
//     if (token) headers["Authorization"] = `Bearer ${token}`;

//     const res = await fetchWithTimeout(endpoint, {
//       method: "POST",
//       headers,
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const txt = await res.text().catch(() => "");
//       throw new Error(`submitOrderToServer failed ${res.status}: ${txt}`);
//     }
//     return res.json();
//   };

//   // ---------- MAIN payment handler (updated to send create-order as `{ amount: 500 }`) ----------
//   const handlePayment = async () => {
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

//       // compute both units
//       const amountInPaise = Math.max(0, Math.trunc(grandTotalPaise)); // integer paise
//       const amountInRupeesFloat = grandTotalPaise / 100; // may be decimal
//       const amountInRupeesRounded = Math.round(amountInRupeesFloat); // integer rupees (we send this to backend per your requirement)

//       // Build a clean items payload to send along with verify
//       const payloadItems = itemsWithPaise.map(({ item, pricePaise, quantity, subtotalPaise }) => ({
//         id: (item as any)?.id ?? null,
//         sku: (item as any)?.sku ?? (item as any)?.id ?? null,
//         name: (item as any)?.name ?? "",
//         price_paise: pricePaise,
//         price_rupees: (pricePaise / 100).toFixed(2),
//         quantity,
//         subtotal_paise: subtotalPaise,
//         image: (item as any)?.imageUrl ?? (item as any)?.image ?? null,
//         meta: (item as any)?.meta ?? null,
//       }));

//       // Decide exact value to send to CREATE ORDER endpoint (per your request this must be a simple { amount: <number> })
//       // NOTE: currently AMOUNT_UNIT === "rupees", so we send rounded integer rupees (e.g. 500).
//       // If you need decimals instead, change the expression to:
//       // const amountToSend = parseFloat(amountInRupeesFloat.toFixed(2));
//       const amountToSend = amountInRupeesRounded;

//       // Debug: log the exact body we'll send to the create-order endpoint
//       console.debug("Creating order - request body will be:", amountToSend);

//       // ---------- CREATE ORDER: send EXACTLY { amount: <number> } ----------
//       let createRes: Response;
//       try {
//         const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
//         if (token) headers["Authorization"] = `Bearer ${token}`;

//         createRes = await fetchWithTimeout(
//           CREATE_ORDER_ENDPOINT,
//           {
//             method: "POST",
//             headers,
//             // <-- exactly as you asked: a single amount field
//             body: JSON.stringify({ amount: amountToSend }),
//           },
//           15000
//         );
//       } catch (err: any) {
//         throw new Error("Network error while creating order: " + (err?.message || "timeout"));
//       }

//       if (!createRes.ok) {
//         const txt = await createRes.text().catch(() => "");
//         throw new Error(`Create order failed ${createRes.status}: ${txt}`);
//       }

//       const createData: CreateOrderResponse = await createRes.json();
//       console.debug("Create order response:", createData);

//       // validate server response
//       if (!createData || !(createData.status === true || createData.success === true || createData.data)) {
//         // some backends return success boolean, others return data directly — handle both
//         throw new Error("Server failed to create Razorpay order: " + (createData?.message || JSON.stringify(createData)));
//       }

//       const server = createData.data ?? createData;
//       const key = server.key ?? (createData.key as any);
//       const serverAmount = server.amount ?? (createData.amount as any); // may be present
//       const currency = server.currency ?? "INR";
//       const order_id = server.order_id ?? server.id ?? createData.order_id;

//       if (!key || !order_id) {
//         throw new Error("Invalid create-order response from server (missing key/order_id).");
//       }

//       // dismiss the preparing toast; we're ready to show Razorpay checkout
//       toast.dismiss(startToastId);

//       // Razorpay requires options.amount in paise (integer). Prefer server-provided amount if present.
//       // If server returned `amount` in rupees (because we sent rupees), convert to paise here.
//       let rzpAmount: number;
//       if (serverAmount != null) {
//         // serverAmount could be paise or rupees depending on your server implementation — try to guess:
//         // If AMOUNT_UNIT === "paise" we expect serverAmount already paise.
//         // If AMOUNT_UNIT === "rupees" serverAmount might be rupees; convert to paise.
//         rzpAmount = AMOUNT_UNIT === "paise" ? Number(serverAmount) : Math.round(Number(serverAmount) * 100);
//       } else {
//         // fallback: convert what we sent
//         rzpAmount = AMOUNT_UNIT === "paise" ? amountToSend : Math.round(amountToSend * 100);
//       }

//       // Build Razorpay options
//       const options: any = {
//         key,
//         amount: rzpAmount,
//         currency,
//         name: "RayFog Business Solutions",
//         description: `Order of ${totalItems} item(s)`,
//         order_id,
//         handler: async function (razorpayResponse: any) {
//           const verifyToastId = toast.loading("Verifying payment with server...");
//           try {
//             // Build verify payload: include razorpay response + the same amount we used for create + items/totals/user/order_id
//             const verifyPayload = {
//               ...razorpayResponse,
//               order_id,
//               amount: amountToSend, // same "amount" (unit = AMOUNT_UNIT) we used when creating the order
//               amount_unit: AMOUNT_UNIT,
//               currency,
//               items: payloadItems,
//               totals: {
//                 items_total_paise: totalPricePaise,
//                 grand_total_paise: grandTotalPaise,
//                 total_savings_paise: totalSavingsPaise,
//                 items_count: totalItems,
//               },
//               user: {
//                 id: (user as any)?.id ?? null,
//                 name: (user as any)?.name ?? null,
//                 email: (user as any)?.email ?? null,
//                 phone: (user as any)?.phone ?? null,
//               },
//               notes: { source: "web_checkout" },
//             };

//             console.debug("Verify payload:", verifyPayload);

//             // send verify
//             const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
//             if (token) headers["Authorization"] = `Bearer ${token}`;

//             let verifyRes: Response;
//             try {
//               verifyRes = await fetchWithTimeout(
//                 VERIFY_ENDPOINT,
//                 {
//                   method: "POST",
//                   headers,
//                   body: JSON.stringify(verifyPayload),
//                 },
//                 15000
//               );
//             } catch (err: any) {
//               throw new Error("Network error while verifying payment: " + (err?.message || "timeout"));
//             }

//             if (!verifyRes.ok) {
//               const txt = await verifyRes.text().catch(() => "");
//               throw new Error(`Verify failed ${verifyRes.status}: ${txt}`);
//             }

//             const verifyData: VerifyResponse = await verifyRes.json();
//             console.debug("Verify response:", verifyData);

//             if (verifyData && (verifyData.status === true || verifyData.success === true)) {
//               toast.dismiss(verifyToastId);
//               toast.success("✅ Payment successful & verified!", { duration: 4000 });

//               // optional fallback record if your verify endpoint didn't create a full order record
//               try {
//                 await submitOrderToServer(razorpayResponse, payloadItems, { created_by: "client_fallback" });
//               } catch (e) {
//                 console.warn("submitOrderToServer fallback failed:", e);
//               }

//               // post-payment callbacks (clear cart etc.)
//               try {
//                 // if (typeof onClearCart === "function") onClearCart();
//                 // else if (typeof onProceedToPay === "function") onProceedToPay();
//               } catch (e) {
//                 console.warn("post-payment callback threw:", e);
//               }

//               if (mountedRef.current) setLoadingPayment(false);
//               onClose();
//             } else {
//               toast.dismiss(verifyToastId);
//               const msg = verifyData?.message ?? "Payment verification failed on server.";
//               toast.error(`❌ ${msg}`);
//               console.error("verifyData:", verifyData);
//               if (mountedRef.current) setLoadingPayment(false);
//             }
//           } catch (err: any) {
//             console.error("Error verifying payment:", err);
//             toast.dismiss();
//             toast.error("Verification failed: " + (err?.message || "unknown"));
//             if (mountedRef.current) setLoadingPayment(false);
//           }
//         },
//         prefill: {
//           name: (user as any)?.name ?? "Customer",
//           email: (user as any)?.email ?? "",
//           contact: (user as any)?.phone ?? "",
//         },
//         theme: { color: "#0d6efd" },
//       };

//       if (!window.Razorpay) throw new Error("Razorpay SDK not available on window.");

//       // instantiate checkout and handle payment.failed
//       const rzp = new window.Razorpay(options);
//       if (rzp && typeof rzp.on === "function") {
//         rzp.on("payment.failed", function (resp: any) {
//           const desc = resp?.error?.description || resp?.error?.reason || "Payment failed";
//           toast.dismiss();
//           toast.error("❌ Payment failed: " + desc);
//           console.error("Razorpay payment.failed:", resp);
//           if (mountedRef.current) setLoadingPayment(false);
//         });
//       }

//       // open checkout
//       rzp.open();
//     } catch (err: any) {
//       toast.dismiss();
//       const msg = err?.message ?? String(err) ?? "Payment failed to start.";
//       console.error("Payment start failed:", err);
//       toast.error(msg);
//       if (mountedRef.current) setLoadingPayment(false);
//     }
//   };

//   // (rendering code omitted here is identical to your prior markup)...
//   return (
//     <>
//       <Toaster position="top-right" reverseOrder={false} />
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
//         onClick={onClose}
//         aria-hidden={!isOpen}
//       />
//       <aside
//         className={`fixed top-0 right-0 h-full w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } flex flex-col`}
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
//           {!items || items.length === 0 ? (
//             <div className="flex items-center justify-center h-full p-6">
//               <p className="text-gray-500">Your cart is empty</p>
//             </div>
//           ) : (
//             <div className="p-4 space-y-4">
//               {itemsWithPaise.map(({ item, quantity, subtotalPaise }) => {
//                 const imageSrc = (item as any)?.imageUrl ?? (item as any)?.image ?? "/placeholder.png";
//                 return (
//                   <div key={String((item as any)?.id ?? Math.random())} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
//                     <img
//                       src={imageSrc}
//                       alt={(item as any)?.name ?? "item"}
//                       className="w-12 h-12 object-cover rounded-lg"
//                       onError={(e) => {
//                         (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
//                       }}
//                     />
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{(item as any)?.name ?? "Unnamed"}</h3>
//                       {(item as any)?.weight && <p className="text-xs text-gray-500 mt-1">{(item as any).weight}</p>}
//                     </div>

//                     <div className="flex flex-col items-end space-y-2">
//                       <div className="flex items-center bg-green-600 text-white rounded-lg">
//                         <button onClick={() => decrease((item as any).id, quantity)} className="p-1 hover:bg-green-700 rounded-l-lg" aria-label="Decrease quantity">
//                           <Minus className="w-3 h-3" />
//                         </button>
//                         <span className="px-2 text-sm font-medium">{quantity}</span>
//                         <button onClick={() => increase((item as any).id, quantity)} className="p-1 hover:bg-green-700 rounded-r-lg" aria-label="Increase quantity">
//                           <Plus className="w-3 h-3" />
//                         </button>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-bold text-sm">{paiseToRupeesString(subtotalPaise)}</div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {items && items.length > 0 && (
//           <div className="border-t border-gray-200">
//             <div className="p-4">
//               <h3 className="font-semibold text-gray-900 mb-3">Bill details</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Items total</span>
//                   <span className="font-semibold">{paiseToRupeesString(totalPricePaise)}</span>
//                 </div>

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
//                 onClick={handlePayment}
//                 className={`w-full py-4 rounded-lg font-semibold text-lg mt-4 flex items-center justify-around ${
//                   user ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                 }`}
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
  onClearCart?: () => void;
}

type CreateOrderResponse = {
  status?: boolean;
  success?: boolean;
  message?: string;
  data?: any;
  key?: string;
  amount?: number;
  currency?: string;
  order_id?: string;
};

type VerifyResponse = {
  status?: boolean;
  success?: boolean;
  message?: string;
  data?: any;
};

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onProceedToPay,
  onClearCart,
}: CartSidebarProps) {
  // prefer context values but fallback to localStorage (handles auth_token / user created by older code)
  const authCtx = (useAuth() as any) ?? {};
  const ctxUser = authCtx.user ?? null;
  const ctxToken = authCtx.token ?? null;

  // fallback keys in localStorage you mentioned: auth_token and user
  const getLocalToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token") ?? localStorage.getItem("token");
  };
  const getLocalUser = () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  // effective auth values used throughout the component
  const effectiveToken = ctxToken ?? getLocalToken();
  const effectiveUser = ctxUser ?? getLocalUser();

  const [loadingPayment, setLoadingPayment] = useState(false);
  const mountedRef = useRef(true);

  const API_BASE = "https://9nutsapi.nearbydoctors.in/public";
  const CREATE_ORDER_ENDPOINT = `${API_BASE}/api/razorpay/order`;
  const VERIFY_ENDPOINT = `${API_BASE}/api/razorpay/verify`;

  // ---- Choose the unit you want to use for create-order 'amount' value ----
  const AMOUNT_UNIT: "paise" | "rupees" = "rupees";

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
  const paiseToRupeesString = (p: number) => `₹${(Number.isFinite(p) ? p / 100 : 0).toFixed(2)}`;
  const qtyOf = (q: any) => {
    const n = Number(q ?? 0);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.trunc(n));
  };

  // totals memoized
  const itemsWithPaise = useMemo(
    () =>
      (items ?? []).map((item) => {
        const pricePaise = rupeesToPaise((item as any).price ?? 0);
        const originalPricePaise = rupeesToPaise((item as any).originalPrice ?? 0);
        const quantity = qtyOf((item as any).quantity ?? 0);
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
  const grandTotalPaise = totalPricePaise; // integer paise
  const grandTotalRupees = Number((grandTotalPaise / 100).toFixed(2)); // float rupees

  // body scroll lock
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = prev || "unset";
    };
  }, [isOpen]);

  const decrease = (id: ID, currentQty: number) => onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) - 1));
  const increase = (id: ID, currentQty: number) => onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) + 1));

  // Razorpay script loader singleton
  const razorpayLoaderRef = useRef<{ loaded: boolean; promise?: Promise<boolean> }>({ loaded: false });
  const loadRazorpayScript = (): Promise<boolean> => {
    if (typeof window === "undefined") return Promise.resolve(false);
    if (window.Razorpay) {
      razorpayLoaderRef.current.loaded = true;
      return Promise.resolve(true);
    }
    if (razorpayLoaderRef.current.promise) return razorpayLoaderRef.current.promise;

    razorpayLoaderRef.current.promise = new Promise((resolve) => {
      try {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          razorpayLoaderRef.current.loaded = true;
          resolve(true);
        };
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      } catch (e) {
        resolve(false);
      }
    });

    return razorpayLoaderRef.current.promise;
  };

  // fetch with timeout helper
  const fetchWithTimeout = async (input: RequestInfo, init?: RequestInit, timeout = 15000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(input, { ...(init ?? {}), signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  };

  // optional fallback server-side recording (keeps using same endpoint, adjust if your backend uses a different route)
  const submitOrderToServer = async (paymentResponse: any, payloadItems?: any[], orderMeta?: any) => {
    const endpoint = `${API_BASE}/api/razorpay/order`;
    const itemsPayload =
      payloadItems ??
      itemsWithPaise.map(({ item, pricePaise, quantity, subtotalPaise }) => ({
        id: (item as any)?.id ?? null,
        name: (item as any)?.name ?? "",
        quantity,
        unit_price_paise: pricePaise,
        unit_price_rupees: (pricePaise / 100).toFixed(2),
        subtotal_paise: subtotalPaise,
      }));

    const payload = {
      user: {
        id: (effectiveUser as any)?.id ?? null,
        name: (effectiveUser as any)?.name ?? null,
        email: (effectiveUser as any)?.email ?? null,
        phone: (effectiveUser as any)?.phone ?? null,
      },
      payment: {
        provider: "razorpay",
        payment_id: paymentResponse?.razorpay_payment_id ?? null,
        order_id: paymentResponse?.razorpay_order_id ?? null,
        signature: paymentResponse?.razorpay_signature ?? null,
        raw: paymentResponse ?? null,
      },
      items: itemsPayload,
      totals: {
        items_total_paise: totalPricePaise,
        grand_total_paise: grandTotalPaise,
        total_savings_paise: totalSavingsPaise,
        currency: "INR",
      },
      meta: orderMeta ?? { notes: (items ?? []).map((it) => `${(it as any).name ?? ""} x${(it as any).quantity ?? 0}`).join(", ") },
    };

    const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
    if (effectiveToken) headers["Authorization"] = `Bearer ${effectiveToken}`;

    const res = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`submitOrderToServer failed ${res.status}: ${txt}`);
    }
    return res.json();
  };

  // ---------- MAIN payment handler (updated to send create-order as `{ amount: 500 }`) ----------
  const handlePayment = async () => {
    if (!effectiveToken) {
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

      // compute both units
      const amountInPaise = Math.max(0, Math.trunc(grandTotalPaise)); // integer paise
      const amountInRupeesFloat = grandTotalPaise / 100; // may be decimal
      const amountInRupeesRounded = Math.round(amountInRupeesFloat); // integer rupees (we send this to backend per your requirement)

      const payloadItems = itemsWithPaise.map(({ item, pricePaise, quantity, subtotalPaise }) => ({
        id: (item as any)?.id ?? null,
        sku: (item as any)?.sku ?? (item as any)?.id ?? null,
        name: (item as any)?.name ?? "",
        price_paise: pricePaise,
        price_rupees: (pricePaise / 100).toFixed(2),
        quantity,
        subtotal_paise: subtotalPaise,
        image: (item as any)?.imageUrl ?? (item as any)?.image ?? null,
        meta: (item as any)?.meta ?? null,
      }));

      const amountToSend = amountInRupeesRounded;

      console.debug("Creating order - request body will be:", amountToSend);

      let createRes: Response;
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
        if (effectiveToken) headers["Authorization"] = `Bearer ${effectiveToken}`;

        createRes = await fetchWithTimeout(
          CREATE_ORDER_ENDPOINT,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ amount: amountToSend }),
          },
          15000
        );
      } catch (err: any) {
        throw new Error("Network error while creating order: " + (err?.message || "timeout"));
      }

      if (!createRes.ok) {
        const txt = await createRes.text().catch(() => "");
        throw new Error(`Create order failed ${createRes.status}: ${txt}`);
      }

      const createData: CreateOrderResponse = await createRes.json();
      console.debug("Create order response:", createData);

      if (!createData || !(createData.status === true || createData.success === true || createData.data)) {
        throw new Error("Server failed to create Razorpay order: " + (createData?.message || JSON.stringify(createData)));
      }

      const server = createData.data ?? createData;
      const key = server.key ?? (createData.key as any);
      const serverAmount = server.amount ?? (createData.amount as any);
      const currency = server.currency ?? "INR";
      const order_id = server.order_id ?? server.id ?? createData.order_id;

      if (!key || !order_id) {
        throw new Error("Invalid create-order response from server (missing key/order_id).");
      }

      toast.dismiss(startToastId);

      let rzpAmount: number;
      if (serverAmount != null) {
        rzpAmount = AMOUNT_UNIT === "paise" ? Number(serverAmount) : Math.round(Number(serverAmount) * 100);
      } else {
        rzpAmount = AMOUNT_UNIT === "paise" ? amountToSend : Math.round(amountToSend * 100);
      }

      const options: any = {
        key,
        amount: rzpAmount,
        currency,
        name: "RayFog Business Solutions",
        description: `Order of ${totalItems} item(s)`,
        order_id,
        handler: async function (razorpayResponse: any) {
          const verifyToastId = toast.loading("Verifying payment with server...");
          try {
            const verifyPayload = {
              ...razorpayResponse,
              order_id,
              amount: amountToSend,
              amount_unit: AMOUNT_UNIT,
              currency,
              items: payloadItems,
              totals: {
                items_total_paise: totalPricePaise,
                grand_total_paise: grandTotalPaise,
                total_savings_paise: totalSavingsPaise,
                items_count: totalItems,
              },
              user: {
                id: (effectiveUser as any)?.id ?? null,
                name: (effectiveUser as any)?.name ?? null,
                email: (effectiveUser as any)?.email ?? null,
                phone: (effectiveUser as any)?.phone ?? null,
              },
              notes: { source: "web_checkout" },
            };

            console.debug("Verify payload:", verifyPayload);

            const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
            if (effectiveToken) headers["Authorization"] = `Bearer ${effectiveToken}`;

            let verifyRes: Response;
            try {
              verifyRes = await fetchWithTimeout(
                VERIFY_ENDPOINT,
                {
                  method: "POST",
                  headers,
                  body: JSON.stringify(verifyPayload),
                },
                15000
              );
            } catch (err: any) {
              throw new Error("Network error while verifying payment: " + (err?.message || "timeout"));
            }

            if (!verifyRes.ok) {
              const txt = await verifyRes.text().catch(() => "");
              throw new Error(`Verify failed ${verifyRes.status}: ${txt}`);
            }

            const verifyData: VerifyResponse = await verifyRes.json();
            console.debug("Verify response:", verifyData);

            if (verifyData && (verifyData.status === true || verifyData.success === true)) {
              toast.dismiss(verifyToastId);
              toast.success("✅ Payment successful & verified!", { duration: 4000 });

              try {
                await submitOrderToServer(razorpayResponse, payloadItems, { created_by: "client_fallback" });
              } catch (e) {
                console.warn("submitOrderToServer fallback failed:", e);
              }

              if (mountedRef.current) setLoadingPayment(false);
              onClose();
            } else {
              toast.dismiss(verifyToastId);
              const msg = verifyData?.message ?? "Payment verification failed on server.";
              toast.error(`❌ ${msg}`);
              console.error("verifyData:", verifyData);
              if (mountedRef.current) setLoadingPayment(false);
            }
          } catch (err: any) {
            console.error("Error verifying payment:", err);
            toast.dismiss();
            toast.error("Verification failed: " + (err?.message || "unknown"));
            if (mountedRef.current) setLoadingPayment(false);
          }
        },
        prefill: {
          name: (effectiveUser as any)?.name ?? "Customer",
          email: (effectiveUser as any)?.email ?? "",
          contact: (effectiveUser as any)?.phone ?? "",
        },
        theme: { color: "#0d6efd" },
      };

      if (!window.Razorpay) throw new Error("Razorpay SDK not available on window.");

      const rzp = new window.Razorpay(options);
      if (rzp && typeof rzp.on === "function") {
        rzp.on("payment.failed", function (resp: any) {
          const desc = resp?.error?.description || resp?.error?.reason || "Payment failed";
          toast.dismiss();
          toast.error("❌ Payment failed: " + desc);
          console.error("Razorpay payment.failed:", resp);
          if (mountedRef.current) setLoadingPayment(false);
        });
      }

      rzp.open();
    } catch (err: any) {
      toast.dismiss();
      const msg = err?.message ?? String(err) ?? "Payment failed to start.";
      console.error("Payment start failed:", err);
      toast.error(msg);
      if (mountedRef.current) setLoadingPayment(false);
    }
  };

  // rendering
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
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
          {!items || items.length === 0 ? (
            <div className="flex items-center justify-center h-full p-6">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {itemsWithPaise.map(({ item, quantity, subtotalPaise }) => {
                const imageSrc = (item as any)?.imageUrl ?? (item as any)?.image ?? "/placeholder.png";
                return (
                  <div key={String((item as any)?.id ?? Math.random())} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={imageSrc}
                      alt={(item as any)?.name ?? "item"}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{(item as any)?.name ?? "Unnamed"}</h3>
                      {(item as any)?.weight && <p className="text-xs text-gray-500 mt-1">{(item as any).weight}</p>}
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center bg-green-600 text-white rounded-lg">
                        <button onClick={() => decrease((item as any).id, quantity)} className="p-1 hover:bg-green-700 rounded-l-lg" aria-label="Decrease quantity">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-sm font-medium">{quantity}</span>
                        <button onClick={() => increase((item as any).id, quantity)} className="p-1 hover:bg-green-700 rounded-r-lg" aria-label="Increase quantity">
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

        {items && items.length > 0 && (
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
                onClick={handlePayment}
                className={`w-full py-4 rounded-lg font-semibold text-lg mt-4 flex items-center justify-around ${
                  effectiveToken ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={!effectiveToken || loadingPayment}
              >
                <span>{paiseToRupeesString(grandTotalPaise)}</span>
                <span>{effectiveToken ? (loadingPayment ? "Processing..." : "Pay with Razorpay") : "Login to Proceed"}</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}


