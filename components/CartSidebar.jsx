
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem, ID } from "@/types";
import toast, { Toaster } from "react-hot-toast";
import {Login_API_BASE} from "@/lib/api";
import { Razorpay_CheckOut_url } from "@/lib/api";

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onProceedToPay,
  onClearCart,
  handlePaymentComplete
}) {
  // prefer context values but fallback to localStorage (handles auth_token / user created by older code)
  const authCtx = useAuth() ?? {};
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
  const CREATE_ORDER_ENDPOINT = `${Login_API_BASE}/api/razorpay/order`;
  const VERIFY_ENDPOINT = `${Login_API_BASE}/api/razorpay/verify`;

  // ---- Choose the unit you want to use for create-order 'amount' value ----
  // Keep as "rupees" to match behavior of sending integer rupees to backend.
  const AMOUNT_UNIT = "rupees";

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // helpers
  const parseNumber = (v) => {
    if (v === null || v === undefined || v === "") return 0;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const rupeesToPaise = (v) => {
    if (v === null || v === undefined || v === "") return 0;
    const n = Number(String(v).replace(/,/g, ""));
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100);
  };

  const paiseToRupeesString = (p) =>
    `₹${(Number.isFinite(p) ? p / 100 : 0).toFixed(2)}`;

  const qtyOf = (q) => {
    const n = Number(q ?? 0);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.trunc(n));
  };

  // totals memoized
  const itemsWithPaise = useMemo(
    () =>
      (items ?? []).map((item) => {
        const pricePaise = rupeesToPaise(item?.price ?? 0);
        const originalPricePaise = rupeesToPaise(item?.originalPrice ?? 0);
        const quantity = qtyOf(item?.quantity ?? 0);
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

  const totalItems = useMemo(
    () => itemsWithPaise.reduce((s, it) => s + it.quantity, 0),
    [itemsWithPaise]
  );
  const totalPricePaise = useMemo(
    () => itemsWithPaise.reduce((s, it) => s + it.subtotalPaise, 0),
    [itemsWithPaise]
  );
  const totalSavingsPaise = useMemo(
    () => itemsWithPaise.reduce((s, it) => s + it.savedTotalPaise, 0),
    [itemsWithPaise]
  );
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

  const decrease = (id, currentQty) =>
    onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) - 1));
  const increase = (id, currentQty) =>
    onUpdateQuantity(id, Math.max(0, Math.trunc(currentQty) + 1));

  // Razorpay script loader singleton
  const razorpayLoaderRef = useRef({ loaded: false });
  const loadRazorpayScript = () => {
    if (typeof window === "undefined") return Promise.resolve(false);
    if (window.Razorpay) {
      razorpayLoaderRef.current.loaded = true;
      return Promise.resolve(true);
    }
    if (razorpayLoaderRef.current.promise) return razorpayLoaderRef.current.promise;

    razorpayLoaderRef.current.promise = new Promise((resolve) => {
      try {
        const script = document.createElement("script");
        script.src = Razorpay_CheckOut_url || "https://checkout.razorpay.com/v1/checkout.js";
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
  const fetchWithTimeout = async (input, init, timeout = 15000) => {
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
  const submitOrderToServer = async (paymentResponse, payloadItems, orderMeta) => {
    const endpoint = `${Login_API_BASE}/api/razorpay/order`;
    const itemsPayload =
      payloadItems ??
      itemsWithPaise.map(({ item, pricePaise, quantity, subtotalPaise }) => ({
        id: item?.id ?? null,
        name: item?.name ?? "",
        quantity,
        unit_price_paise: pricePaise,
        unit_price_rupees: (pricePaise / 100).toFixed(2),
        subtotal_paise: subtotalPaise,
      }));

    const payload = {
      user: {
        id: effectiveUser?.id ?? null,
        name: effectiveUser?.name ?? null,
        email: effectiveUser?.email ?? null,
        phone: effectiveUser?.phone ?? null,
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
      meta:
        orderMeta ??
        { notes: (items ?? []).map((it) => `${it?.name ?? ""} x${it?.quantity ?? 0}`).join(", ") },
    };

    const headers = { "Content-Type": "application/json", Accept: "application/json" };
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

  // helper to clear cart (calls prop, falls back to localStorage removal)
  const clearCartSafely = () => {
    try {
      if (typeof onClearCart === "function") {
        onClearCart();
      } else if (typeof window !== "undefined") {
        // common fallback key — adjust if your app uses a different key
        localStorage.removeItem("cart");
        // if you store items under another key, remove that as well optionally:
        // localStorage.removeItem("cart_items");
      }
    } catch (e) {
      console.warn("Failed to clear cart via onClearCart/localStorage:", e);
    }
  };

  // ---------- MAIN payment handler ----------
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
        id: item?.id ?? null,
        sku: item?.sku ?? item?.id ?? null,
        name: item?.name ?? "",
        price_paise: pricePaise,
        price_rupees: (pricePaise / 100).toFixed(2),
        quantity,
        subtotal_paise: subtotalPaise,
        image: item?.imageUrl ?? item?.image ?? null,
        meta: item?.meta ?? null,
      }));

      const amountToSend = amountInRupeesRounded;

      console.debug("Creating order - request body will be:", amountToSend);

      let createRes;
      try {
        const headers = { "Content-Type": "application/json", Accept: "application/json" };
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
      } catch (err) {
        throw new Error("Network error while creating order: " + (err?.message || "timeout"));
      }

      if (!createRes.ok) {
        const txt = await createRes.text().catch(() => "");
        throw new Error(`Create order failed ${createRes.status}: ${txt}`);
      }

      const createData = await createRes.json();


      if (!createData || !(createData.status === true || createData.success === true || createData.data)) {
        throw new Error("Server failed to create Razorpay order: " + (createData?.message || JSON.stringify(createData)));
      }

      const server = createData.data ?? createData;
      const key = server.key ?? createData.key;
      const serverAmount = server.amount ?? createData.amount;
      const currency = server.currency ?? "INR";
      const order_id = server.order_id ?? server.id ?? createData.order_id;

      if (!key || !order_id) {
        throw new Error("Invalid create-order response from server (missing key/order_id).");
      }

      toast.dismiss(startToastId);

      let rzpAmount;
      if (serverAmount != null) {
        rzpAmount = AMOUNT_UNIT === "paise" ? Number(serverAmount) : Math.round(Number(serverAmount) * 100);
      } else {
        rzpAmount = AMOUNT_UNIT === "paise" ? amountToSend : Math.round(amountToSend * 100);
      }

      const options = {
        key,
        amount: rzpAmount,
        currency,
        name: "RayFog Business Solutions",
        description: `Order of ${totalItems} item(s)`,
        order_id,
        handler: async function (razorpayResponse) {
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
                id: effectiveUser?.id ?? null,
                name: effectiveUser?.name ?? null,
                email: effectiveUser?.email ?? null,
                phone: effectiveUser?.phone ?? null,
              },
              notes: { source: "web_checkout" },
            };
            const headers = { "Content-Type": "application/json", Accept: "application/json" };
            if (effectiveToken) headers["Authorization"] = `Bearer ${effectiveToken}`;

            let verifyRes;
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
            } catch (err) {
              throw new Error("Network error while verifying payment: " + (err?.message || "timeout"));
            }

            if (!verifyRes.ok) {
              const txt = await verifyRes.text().catch(() => "");
              throw new Error(`Verify failed ${verifyRes.status}: ${txt}`);
            }

            const verifyData = await verifyRes.json();
            console.debug("Verify response:", verifyData);

            if (verifyData && (verifyData.status === true || verifyData.success === true)) {
              toast.dismiss(verifyToastId);
              toast.success("✅ Payment successful & verified!", { duration: 4000 });
              handlePaymentComplete()
              // keep existing fallback call
              try {
                await submitOrderToServer(razorpayResponse, payloadItems, { created_by: "client_fallback" });
              } catch (e) {
                console.warn("submitOrderToServer fallback failed:", e);
              }

              // NEW: clear cart safely (call prop and fallback to localStorage)
              try {
                clearCartSafely();
              } catch (e) {
                console.warn("Error clearing cart after payment:", e);
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
          } catch (err) {
            console.error("Error verifying payment:", err);
            toast.dismiss();
            toast.error("Verification failed: " + (err?.message || "unknown"));
            if (mountedRef.current) setLoadingPayment(false);
          }
        },
        prefill: {
          name: effectiveUser?.name ?? "Customer",
          email: effectiveUser?.email ?? "",
          contact: effectiveUser?.phone ?? "",
        },
        theme: { color: "#0d6efd" },
      };

      if (!window.Razorpay) throw new Error("Razorpay SDK not available on window.");

      const rzp = new window.Razorpay(options);
      if (rzp && typeof rzp.on === "function") {
        rzp.on("payment.failed", function (resp) {
          const desc = resp?.error?.description || resp?.error?.reason || "Payment failed";
          toast.dismiss();
          toast.error("❌ Payment failed: " + desc);
          console.error("Razorpay payment.failed:", resp);
          if (mountedRef.current) setLoadingPayment(false);
        });
      }

      rzp.open();
    } catch (err) {
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
                const imageSrc = item?.imageUrl ?? item?.image ?? "/placeholder.png";
                return (
                  <div key={String(item?.id ?? Math.random())} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={imageSrc}
                      alt={item?.name ?? "item"}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{item?.name ?? "Unnamed"}</h3>
                      {item?.weight && <p className="text-xs text-gray-500 mt-1">{item.weight}</p>}
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center bg-green-600 text-white rounded-lg">
                        <button onClick={() => decrease(item.id, quantity)} className="p-1 hover:bg-green-700 rounded-l-lg" aria-label="Decrease quantity">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-sm font-medium">{quantity}</span>
                        <button onClick={() => increase(item.id, quantity)} className="p-1 hover:bg-green-700 rounded-r-lg" aria-label="Increase quantity">
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


