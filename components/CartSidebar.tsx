
// "use client";
// import React, { useEffect, useState } from "react";
// import { X, Plus, Minus } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
// import { CartItem, ID } from "@/types";

// declare global {
//   interface Window {
//     Razorpay?: any;
//   }
// }

// interface CartSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   items: CartItem[]; // expects { id, name, price, originalPrice?, quantity, image/imageUrl?, weight? }
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
//   const { user } = useAuth();
//   const [loadingPayment, setLoadingPayment] = useState(false);

//   // helpers
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

//   // compute totals
//   const itemsWithPaise = items.map((item) => {
//     const pricePaise = rupeesToPaise((item as any).price ?? 0);
//     const originalPricePaise = rupeesToPaise((item as any).originalPrice ?? 0);
//     const quantity = qtyOf(item.quantity);
//     return {
//       item,
//       pricePaise,
//       originalPricePaise,
//       quantity,
//       subtotalPaise: pricePaise * quantity,
//       savedTotalPaise: Math.max(0, originalPricePaise - pricePaise) * quantity,
//     };
//   });

//   const totalItems = itemsWithPaise.reduce((s, it) => s + it.quantity, 0);
//   const totalPricePaise = itemsWithPaise.reduce((s, it) => s + it.subtotalPaise, 0);
//   const totalSavingsPaise = itemsWithPaise.reduce((s, it) => s + it.savedTotalPaise, 0);
//   const grandTotalPaise = totalPricePaise; // per your logic

//   useEffect(() => {
//     if (isOpen) document.body.style.overflow = "hidden";
//     else document.body.style.overflow = "unset";
//     return () => (document.body.style.overflow = "unset");
//   }, [isOpen]);

//   const decrease = (id: ID, currentQty: number) => onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) - 1));
//   const increase = (id: ID, currentQty: number) => onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) + 1));

//   // load Razorpay script dynamically
//   const loadRazorpayScript = (): Promise<boolean> =>
//     new Promise((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//   // FRONTEND-ONLY checkout (test/demo). No server order creation, no signature verification.
//   // This is fine for testing, but DO NOT use this in production without server-side order creation + verification.
//   const handlePayWithRazorpay = async () => {
//     if (!user) {
//       alert("Please login to proceed to payment.");
//       return;
//     }
//     if (items.length === 0) {
//       alert("Cart is empty.");
//       return;
//     }

//     setLoadingPayment(true);
//     try {
//       const ok = await loadRazorpayScript();
//       if (!ok) throw new Error("Failed to load Razorpay SDK.");
//       const keyId = "rzp_test_RNiKLAWnAJRrZG";
//       if (!keyId) {
//         throw new Error("Razorpay public key not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.");
//       }

//       // Build checkout options — using amount directly (in paise)
//       const options = {
//         key: keyId,
//         amount: grandTotalPaise, // paise
//         currency: "INR",
//         name: "9Nutz",
//         description: `Order of ${totalItems} item(s)`,
//         // order_id: undefined // not used in frontend-only mode
//         prefill: {
//           name: (user as any)?.name || "",
//           email: (user as any)?.email || "",
//           contact: (user as any)?.phone || "",
//         },
//         notes: {
//           // optional: brief cart info for client-side notes
//           items: items.map((it) => `${it.name} x${it.quantity}`).join(", "),
//         },
//         theme: { color: "#16a34a" },
//         handler: function (response: any) {
//           // response: { razorpay_payment_id, razorpay_order_id?, razorpay_signature? }
//           // FRONTEND-ONLY: we cannot verify signature here. Show success message for testing.
//           // For production: POST these fields to server to verify signature using YOUR KEY_SECRET.
//           alert(`Payment success!\nPayment ID: ${response.razorpay_payment_id}`);
//           // if (onProceedToPay) onProceedToPay();
//         },
//         modal: {
//           ondismiss: function () {
//             // user closed checkout
//             // optional: notify / log
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err: any) {
//       console.error(err);
//       alert(err?.message || "Payment failed to start.");
//     } finally {
//       setLoadingPayment(false);
//     }
//   };

//   return (
//     <>
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
//           isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
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
//           <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
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
//                     <img
//                       src={imageSrc}
//                       alt={item.name}
//                       className="w-12 h-12 object-cover rounded-lg"
//                       onError={(e) => {
//                         (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
//                       }}
//                     />
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</h3>
//                       {item.weight && <p className="text-xs text-gray-500 mt-1">{item.weight}</p>}
//                     </div>

//                     <div className="flex flex-col items-end space-y-2">
//                       <div className="flex items-center bg-green-600 text-white rounded-lg">
//                         <button onClick={() => decrease(item.id, quantity)} className="p-1 hover:bg-green-700 rounded-l-lg">
//                           <Minus className="w-3 h-3" />
//                         </button>
//                         <span className="px-2 text-sm font-medium">{quantity}</span>
//                         <button onClick={() => increase(item.id, quantity)} className="p-1 hover:bg-green-700 rounded-r-lg">
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

//         {items.length > 0 && (
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
//                 <p className="text-xs text-gray-600">
//                   Orders cannot be cancelled once packed. Refunds handled per policy.
//                 </p>
//               </div>

//               <button
//                 onClick={handlePayWithRazorpay}
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


// components/CartSidebar.tsx
// components/CartSidebar.tsx
// components/CartSidebar.tsx
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
  items: CartItem[]; // expects { id, name, price, originalPrice?, quantity, image/imageUrl?, weight? }
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
  const { user, token } = useAuth() as any; // token optional, depends on your AuthContext
  const [loadingPayment, setLoadingPayment] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ---------- small helpers ----------
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

  // ---------- calculations (memoized) ----------
  const itemsWithPaise = useMemo(() => {
    return items.map((item) => {
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const totalItems = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.quantity, 0), [itemsWithPaise]);
  const totalPricePaise = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.subtotalPaise, 0), [itemsWithPaise]);
  const totalSavingsPaise = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.savedTotalPaise, 0), [itemsWithPaise]);
  const grandTotalPaise = totalPricePaise;

  // body scroll lock/unlock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const decrease = (id: ID, currentQty: number) =>
    onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) - 1));
  const increase = (id: ID, currentQty: number) =>
    onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) + 1));

  // ---------- Razorpay loader (singleton) ----------
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

  // ---------- build payload & submit to server ----------
  const submitOrderToServer = async (paymentResponse: any) => {
    const endpoint = "/api/orders/confirm"; // change to your server route
    const payloadItems = itemsWithPaise.map(({ item, pricePaise, quantity, subtotalPaise }) => ({
      id: item.id,
      name: item.name,
      quantity,
      unit_price_paise: pricePaise,
      unit_price_rupees: (pricePaise / 100).toFixed(2),
      subtotal_paise: subtotalPaise,
    }));

    // Important: send numeric paise for totals (server expects numbers)
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
      meta: {
        notes: items.map((it) => `${it.name} x${it.quantity}`).join(", "),
      },
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

  // ---------- Razorpay checkout flow ----------
  const handlePayWithRazorpay = async () => {
    if (!user) {
      toast.error("Please login to proceed to payment.");
      return;
    }
    if (!items || items.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    setLoadingPayment(true);

    // show a toast while we prepare payment
    const startToastId = toast.loading("Starting payment...");

    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay SDK.");

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RNiKLAWnAJRrZG";
      if (!keyId) throw new Error("Razorpay key not configured.");

      // prepare notes / short description
      const notesText = items.map((it) => `${it.name} x${it.quantity}`).join(", ");

      // handler function (keeps lexical access to component)
      const paymentSuccessHandler = async (response: any) => {
        // response contains: razorpay_payment_id, razorpay_order_id?, razorpay_signature?
        const serverToastId = toast.loading("Recording order...");

        try {
          await submitOrderToServer(response);

          if (!mountedRef.current) return;
          toast.dismiss(startToastId);
          toast.dismiss(serverToastId);
          toast.success("Payment successful and order recorded. Thank you!");
          if (typeof onProceedToPay === "function") onProceedToPay();
          onClose();
        } catch (err: any) {
          console.error("Order recording failed:", err);
          toast.dismiss(startToastId);
          toast.dismiss(serverToastId);
          toast.success("Payment successful"); // payment itself succeeded
          toast.error(
            `Order recording failed.: ${response?.razorpay_payment_id ?? "N/A"}`,
            { duration: 10000 }
          );
          // optionally keep cart and let user retry server submission from UI
        } finally {
          if (mountedRef.current) setLoadingPayment(false);
        }
      };

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
          // Razorpay will call this on success
          void paymentSuccessHandler(response);
        },
        modal: {
          ondismiss: function () {
            // optional: user cancelled/closed checkout
            toast.dismiss(startToastId);
            if (mountedRef.current) setLoadingPayment(false);
            toast("Payment cancelled", { icon: "⚠️" });
          },
        },
      };

      // dismiss start toast once checkout UI opens
      toast.dismiss(startToastId);

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment start failed:", err);
      toast.dismiss(); // clear existing toasts
      toast.error(err?.message || "Payment failed to start.");
      if (mountedRef.current) setLoadingPayment(false);
    }
  };

  return (
    <>
      {/* Toaster (include here if you don't already have one at app root) */}
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


