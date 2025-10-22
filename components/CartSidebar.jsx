
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Minus, Edit3, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { Login_API_BASE, Razorpay_CheckOut_url, LOCAL_API_BASE } from "@/lib/api";

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onProceedToPay,
  onClearCart,
  handlePaymentComplete,
}) {
  const router = useRouter();
  const ADD_ADDRESS_ROUTE = "/dashboard";

  // ---- Auth (context + local fallback) ----
  const authCtx = useAuth() ?? {};
  const ctxUser = authCtx.user ?? null;
  const ctxToken = authCtx.token ?? null;

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

  const effectiveToken = ctxToken ?? getLocalToken();
  const effectiveUser = ctxUser ?? getLocalUser();

  // ---- API endpoints ----
  const CREATE_ORDER_ENDPOINT = `${LOCAL_API_BASE}/admin/razorpay/order`;
  const VERIFY_ENDPOINT = `${LOCAL_API_BASE}/admin/razorpay/verify`;
  const ADDRESS_LIST_ENDPOINT = `${LOCAL_API_BASE}/user/address`; // GET list
  const ADDRESS_ITEM_ENDPOINT = (id) => `${Login_API_BASE}/user/address/delete/${id}`; // DELETE
  const ADDRESS_UPDATE_ENDPOINT = (id) => `${LOCAL_API_BASE}/user/address/update/${id}`; // UPDATE
  const ADDRESS_ADD_ENDPOINT = `${LOCAL_API_BASE}/user/address/add`; // ADD

  // ---- State ----
  const [loadingPayment, setLoadingPayment] = useState(false);
  const mountedRef = useRef(true);
  const AMOUNT_UNIT = "rupees";

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ---------- Address state ----------
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ---------- EDIT modal ----------
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    label: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const openEditModal = (addr) => {
    setEditId(addr?.id ?? null);
    setEditForm({
      label: addr?.label ?? "",
      line1: addr?.line1 ?? "",
      city: addr?.city ?? "",
      state: addr?.state ?? "",
      pincode: addr?.pincode ?? "",
      phone: addr?.phone ?? "",
    });
    setEditOpen(true);
  };
  const closeEditModal = () => {
    if (editSaving) return;
    setEditOpen(false);
    setEditId(null);
  };
  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  // ---------- ADD modal (NEW) ----------
  const [addOpen, setAddOpen] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addForm, setAddForm] = useState({
    label: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const openAddModal = () => {
    setAddForm({
      label: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    });
    setAddOpen(true);
  };
  const closeAddModal = () => {
    if (addSaving) return;
    setAddOpen(false);
  };
  const onAddChange = (e) => {
    const { name, value } = e.target;
    // small sanitizers
    if (name === "pincode") {
      const v = value.replace(/\D/g, "").slice(0, 6);
      setAddForm((f) => ({ ...f, pincode: v }));
      return;
    }
    if (name === "phone") {
      const v = value.replace(/\D/g, "").slice(0, 15);
      setAddForm((f) => ({ ...f, phone: v }));
      return;
    }
    setAddForm((f) => ({ ...f, [name]: value }));
  };

  // ---------- Fetch addresses (robust) ----------
  const fetchAddresses = async () => {
    setAddrLoading(true);

    if (!effectiveToken) {
      setAddresses([]);
      setSelectedAddress(null);
      setAddrLoading(false);
      return;
    }

    try {
      const res = await fetch(ADDRESS_LIST_ENDPOINT, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${effectiveToken}`,
        },
        cache: "no-store",
      });

      const ctype = (res.headers.get("content-type") || "").toLowerCase();
      const isJson = ctype.includes("application/json");

      if (res.status === 401) {
        setAddresses([]);
        setSelectedAddress(null);
        toast.error("Please log in to view your addresses.");
        return;
      }

      if (!res.ok || !isJson) {
        setAddresses([]);
        setSelectedAddress(null);
        return;
      }

      const data = await res.json();
      const raw = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.addresses)
        ? data.addresses
        : Array.isArray(data)
        ? data
        : [];

      const normalized = raw.map((a) => ({
        id: a.id ?? a._id ?? a.uuid ?? null,
        label: a.label ?? "Address",
        line1: a.line1 ?? "",
        line2: a.line2 ?? "",
        city: a.city ?? "",
        state: a.state ?? "",
        pincode: a.pincode ?? a.zip ?? "",
        phone: a.phone ?? a.mobile ?? "",
        is_default: (a.is_default ?? a.default ?? false) === true,
        ...a,
      }));

      setAddresses(normalized);

      if (!selectedAddress || !normalized.some((x) => x.id === selectedAddress.id)) {
        const def = normalized.find((x) => x.is_default) ?? normalized[0] ?? null;
        setSelectedAddress(def);
      }
    } catch (e) {
      console.warn("Address fetch failed:", e);
      setAddresses([]);
      setSelectedAddress(null);
    } finally {
      setAddrLoading(false);
    }
  };

  // Prefetch when sidebar opens
  useEffect(() => {
    if (isOpen && effectiveToken) fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, effectiveToken]);

  // Refresh when modal opens
  useEffect(() => {
    if (addressModalOpen) fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressModalOpen]);

  // Reset if user logs out
  useEffect(() => {
    if (!effectiveToken) {
      setAddresses([]);
      setSelectedAddress(null);
    }
  }, [effectiveToken]);

  const openAddressModal = () => setAddressModalOpen(true);
  const closeAddressModal = () => setAddressModalOpen(false);

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    closeAddressModal();
    toast.success(`${addr.label ?? "Address"} selected`);
  };

  const handleAddAddressNavigate = () => {
    // (kept for compatibility; not used now that we have an inline Add modal)
    setAddressModalOpen(false);
    setTimeout(() => {
      router.push(ADD_ADDRESS_ROUTE);
    }, 100);
  };

  // ---- Edit submit (POST to /user/address/update/:id) ----
  const submitEdit = async (e) => {
    e?.preventDefault?.();
    if (!editId) return;
    setEditSaving(true);
    try {
      const res = await fetch(ADDRESS_UPDATE_ENDPOINT(editId), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${effectiveToken}`,
        },
        body: JSON.stringify({
          label: editForm.label ?? "",
          line1: editForm.line1 ?? "",
          city: editForm.city ?? "",
          state: editForm.state ?? "",
          pincode: editForm.pincode ?? "",
          phone: editForm.phone ?? "",
        }),
      });

      const ctype = (res.headers.get("content-type") || "").toLowerCase();
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Update failed (${res.status})`);
      }
      if (ctype.includes("application/json")) {
        const payload = await res.json().catch(() => null);
        if (payload && payload.status === false) {
          throw new Error(payload?.message || "Update failed.");
        }
      }

      toast.success("Address updated");
      setEditOpen(false);
      setEditId(null);
      await fetchAddresses();
    } catch (err) {
      console.error("Update address error:", err);
      toast.error(err?.message || "Failed to update address");
    } finally {
      setEditSaving(false);
    }
  };

  // ---- Add submit (POST to /user/address/add) ----
  const submitAdd = async (e) => {
    e?.preventDefault?.();
    if (addSaving) return;

    // Basic required-field check
    const req = ["label", "line1", "city", "state", "pincode", "phone"];
    const missing = req.filter((k) => !String(addForm[k] || "").trim());
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return;
    }
    if (!/^\d{6}$/.test(addForm.pincode)) {
      toast.error("Pincode must be a valid 6-digit number.");
      return;
    }
    if (!effectiveToken) {
      toast.error("Please login to add an address.");
      return;
    }

    setAddSaving(true);
    const loadingId = toast.loading("Adding address...");
    try {
      const res = await fetch(ADDRESS_ADD_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${effectiveToken}`,
        },
        body: JSON.stringify({
          label: addForm.label,
          line1: addForm.line1,
          city: addForm.city,
          state: addForm.state,
          pincode: addForm.pincode,
          phone: addForm.phone,
        }),
      });

      const ctype = (res.headers.get("content-type") || "").toLowerCase();

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Add address failed (${res.status})`);
      }

      let payload = null;
      if (ctype.includes("application/json")) {
        payload = await res.json().catch(() => null);
        if (payload && payload.status === false) {
          throw new Error(payload?.message || "Server rejected the request.");
        }
      }

      toast.dismiss(loadingId);
      toast.success("Address added successfully!");

      // Refresh and try to select the newly created one (if API returns id)
      await fetchAddresses();
      if (payload?.data?.id) {
        const justAdded = { ...(payload.data || payload.address) };
        if (justAdded?.id) setSelectedAddress(justAdded);
      }

      setAddOpen(false);
    } catch (err) {
      console.error("Add address error:", err);
      toast.dismiss(loadingId);
      toast.error(err?.message || "Failed to add address.");
    } finally {
      setAddSaving(false);
    }
  };

  // ---- Delete (unchanged) ----
  const handleDeleteAddress = async (addr) => {
    if (!addr?.id) return;
    const ok = window.confirm("Delete this address? This action cannot be undone.");
    if (!ok) return;

    setDeletingId(addr.id);
    try {
      const res = await fetch(ADDRESS_ITEM_ENDPOINT(addr.id), {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${effectiveToken}`,
        },
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`Delete failed ${res.status}: ${msg}`);
      }

      toast.success("Address deleted");
      await fetchAddresses();
    } catch (e) {
      console.error("Delete address error:", e);
      toast.error(e?.message || "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  // ---- Helpers for pricing / qty ----
  const rupeesToPaise = (v) => {
    if (v === null || v === undefined || v === "") return 0;
    const n = Number(String(v).replace(/,/g, ""));
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100);
  };

  const paiseToRupeesString = (p) => `₹${(Number.isFinite(p) ? p / 100 : 0).toFixed(2)}`;

  const qtyOf = (q) => {
    const n = Number(q ?? 0);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.trunc(n));
  };

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

  const totalItems = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.quantity, 0), [itemsWithPaise]);
  const totalPricePaise = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.subtotalPaise, 0), [itemsWithPaise]);
  const totalSavingsPaise = useMemo(() => itemsWithPaise.reduce((s, it) => s + it.savedTotalPaise, 0), [itemsWithPaise]);
  const grandTotalPaise = totalPricePaise;

  // Lock body scroll when sidebar OR modal open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    if (isOpen || addressModalOpen || editOpen || addOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = prev || "unset";
    };
  }, [isOpen, addressModalOpen, editOpen, addOpen]);

  const decrease = (id, currentQty) => onUpdateQuantity?.(id, Math.max(0, Math.trunc(currentQty) - 1));
  const increase = (id, currentQty) => onUpdateQuantity?.(id, Math.max(0, Math.trunc(currentQty) + 1));

  // ----- Razorpay loader -----
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
      } catch {
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

  const submitOrderToServer = async (paymentResponse, payloadItems, orderMeta) => {
    const endpoint = `${LOCAL_API_BASE}/admin/razorpay/order`;
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
      shipping_address: selectedAddress ?? null,
      address_id: selectedAddress?.id ?? null,
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

  // ---------- MAIN payment handler ----------
  const clearCartSafely = () => {
    try {
      if (typeof onClearCart === "function") onClearCart();
      else if (typeof window !== "undefined") localStorage.removeItem("cart");
    } catch (e) {
      console.warn("Failed to clear cart via onClearCart/localStorage:", e);
    }
  };

  const handlePayment = async () => {
    if (!effectiveToken) {
      toast.error("Please login to proceed to payment.");
      return;
    }
    if (!items || items.length === 0) {
      toast.error("Cart is empty.");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (loadingPayment) return;

    setLoadingPayment(true);
    const startToastId = toast.loading("Preparing payment...");

    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay SDK.");

      const grandTotalPaise = totalPricePaise;
      const amountInRupeesRounded = Math.round(grandTotalPaise / 100);

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

      const headers = { "Content-Type": "application/json", Accept: "application/json" };
      if (effectiveToken) headers["Authorization"] = `Bearer ${effectiveToken}`;

      const createRes = await fetchWithTimeout(
        CREATE_ORDER_ENDPOINT,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ amount: amountInRupeesRounded }),
        },
        15000
      );

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

      const rzpAmount =
        serverAmount != null
          ? (AMOUNT_UNIT === "paise" ? Number(serverAmount) : Math.round(Number(serverAmount) * 100))
          : (AMOUNT_UNIT === "paise" ? amountInRupeesRounded : Math.round(amountInRupeesRounded * 100));

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
              amount: amountInRupeesRounded,
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
              shipping_address: selectedAddress,
              notes: { source: "web_checkout" },
            };

            const headers = { "Content-Type": "application/json", Accept: "application/json" };
            if (effectiveToken) headers["Authorization"] = `Bearer ${effectiveToken}`;

            const verifyRes = await fetchWithTimeout(
              VERIFY_ENDPOINT,
              { method: "POST", headers, body: JSON.stringify(verifyPayload) },
              15000
            );

            if (!verifyRes.ok) {
              const txt = await verifyRes.text().catch(() => "");
              throw new Error(`Verify failed ${verifyRes.status}: ${txt}`);
            }

            const verifyData = await verifyRes.json();

            if (verifyData && (verifyData.status === true || verifyData.success === true)) {
              toast.dismiss(verifyToastId);
              toast.success("✅ Payment successful & verified!", { duration: 4000 });

              try {
                await submitOrderToServer(razorpayResponse, payloadItems, {
                  created_by: "client_fallback",
                  address_id: selectedAddress?.id,
                });
              } catch (e) {
                console.warn("submitOrderToServer fallback failed:", e);
              }

              try {
                clearCartSafely();
              } catch (e) {
                console.warn("Error clearing cart after payment:", e);
              }

              if (mountedRef.current) setLoadingPayment(false);
              onClose?.();
              handlePaymentComplete?.();
            } else {
              toast.dismiss(verifyToastId);
              const msg = verifyData?.message ?? "Payment verification failed on server.";
              toast.error(`❌ ${msg}`);
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

  // ---- Render helpers ----
  const renderAddressBlock = (addr) => {
    if (!addr) return null;
    const parts = [
      addr.line1,
      addr.line2,
      addr.city ? `${addr.city}${addr.pincode ? " - " + addr.pincode : ""}` : null,
      addr.state,
    ]
      .filter(Boolean)
      .join(", ");
    const phone = addr.phone ? `Phone: ${addr.phone}` : "";
    return (
      <div>
        <div className="font-medium text-sm">{addr.label ?? "Selected address"}</div>
        <div className="text-xs text-gray-700">{parts}</div>
        {phone && <div className="text-xs text-gray-600 mt-1">{phone}</div>}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
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
          {!items || items.length === 0 ? (
            <div className="flex items-center justify-center h-full p-6">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {itemsWithPaise.map(({ item, quantity, subtotalPaise }) => {
                const imageSrc = item?.imageUrl ?? item?.image ?? "";
                return (
                  <div key={String(item?.id ?? Math.random())} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={imageSrc}
                      alt={item?.name ?? "item"}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "";
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Bill details</h3>
                <button
                  onClick={() => setAddressModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                  aria-expanded={addressModalOpen}
                >
                  <Plus className="w-4 h-4" />
                  <span>{selectedAddress ? "Change address" : "Add address"}</span>
                </button>
              </div>

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

              {/* Selected address above payment */}
              <div className="mt-4 p-3 rounded-lg">
                {selectedAddress ? (
                  <div className="bg-gray-50 p-3 rounded">
                    {renderAddressBlock(selectedAddress)}
                    <div className="mt-2">
                      <button onClick={() => setAddressModalOpen(true)} className="text-xs underline">
                        Change address
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-3 rounded">
                    No address selected. Click “{effectiveToken ? "Add address" : "Login"}” to choose one.
                  </div>
                )}
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

      {/* Address modal */}
      {addressModalOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-black/60" onClick={() => setAddressModalOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl z-10 overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-base font-semibold">Select address</h3>
              <button onClick={() => setAddressModalOpen(false)} className="p-2 rounded hover:bg-gray-100" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto space-y-3">
              {addrLoading && (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse h-16 bg-gray-100 rounded" />
                  ))}
                </div>
              )}

              {!addrLoading && addresses.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600 mb-4">No saved addresses found.</p>
                  <button
                    onClick={openAddModal}
                    className="px-4 py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700 text-sm"
                  >
                    Add address
                  </button>
                </div>
              )}

              {!addrLoading &&
                addresses.length > 0 &&
                addresses.map((addr, idx) => {
                  const parts = [
                    addr.line1,
                    addr.line2,
                    addr.city ? `${addr.city}${addr.pincode ? " - " + addr.pincode : ""}` : null,
                    addr.state,
                  ]
                    .filter(Boolean)
                    .join(", ");
                  const isChecked = selectedAddress?.id === addr.id;
                  return (
                    <label
                      key={addr.id ?? idx}
                      className={`block border rounded p-3 cursor-pointer hover:bg-gray-50 ${
                        isChecked ? "border-green-400 ring-1 ring-green-200" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">
                            {addr.label ?? "Address"}{" "}
                            {addr.is_default ? <span className="ml-2 text-xs text-green-600">(Default)</span> : null}
                          </div>
                          <div className="text-xs text-gray-700 mt-1">{parts}</div>
                          {addr.phone && <div className="text-xs text-gray-600 mt-1">Phone: {addr.phone}</div>}
                        </div>

                        {/* Right column: radio + actions */}
                        <div className="ml-3 flex flex-col items-end">
                          <input
                            type="radio"
                            name="selected_address"
                            checked={!!isChecked}
                            onChange={() => handleSelectAddress(addr)}
                            className="w-4 h-4 mb-2"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openEditModal(addr);
                              }}
                              className="p-1 rounded hover:bg-gray-100"
                              title="Edit address"
                              aria-label="Edit address"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!deletingId) handleDeleteAddress(addr);
                              }}
                              className={`p-1 rounded hover:bg-gray-100 ${deletingId === addr.id ? "opacity-50 pointer-events-none" : ""}`}
                              title="Delete address"
                              aria-label="Delete address"
                              disabled={deletingId === addr.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
            </div>

            <div className="p-4 border-t flex items-center justify-between">
              <button onClick={() => setAddressModalOpen(false)} className="px-3 py-1.5 rounded border hover:bg-gray-50 text-sm">
                Close
              </button>
              <button
  onClick={openAddModal}
  className="px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
>
  Add new
</button>

            </div>
          </div>
        </div>
      )}

      {/* EDIT ADDRESS POPUP */}
      {editOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-black/60" onClick={closeEditModal} aria-hidden="true" />
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl z-10 overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-base font-semibold">Edit address</h3>
              <button onClick={closeEditModal} className="p-2 rounded hover:bg-gray-100" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitEdit} className="p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Label</label>
                  <input
                    name="label"
                    value={editForm.label}
                    onChange={onEditChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Home / Office"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Address line</label>
                  <input
                    name="line1"
                    value={editForm.line1}
                    onChange={onEditChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Street, area"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">City</label>
                    <input
                      name="city"
                      value={editForm.city}
                      onChange={onEditChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">State</label>
                    <input
                      name="state"
                      value={editForm.state}
                      onChange={onEditChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Pincode</label>
                    <input
                      name="pincode"
                      value={editForm.pincode}
                      onChange={onEditChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="e.g. 500055"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Phone</label>
                    <input
                      name="phone"
                      value={editForm.phone}
                      onChange={onEditChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="e.g. 9874563210"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-3 py-2 rounded border hover:bg-gray-50 text-sm"
                  disabled={editSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white text-sm ${
                    editSaving ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={editSaving}
                >
                  {editSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ADDRESS POPUP (NEW) */}
      {addOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-black/60" onClick={closeAddModal} aria-hidden="true" />
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl z-10 overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-base font-semibold">Add new address</h3>
              <button onClick={closeAddModal} className="p-2 rounded hover:bg-gray-100" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitAdd} className="p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Label</label>
                  <input
                    name="label"
                    value={addForm.label}
                    onChange={onAddChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Home / Office"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Address line</label>
                  <input
                    name="line1"
                    value={addForm.line1}
                    onChange={onAddChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Street, area"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">City</label>
                    <input
                      name="city"
                      value={addForm.city}
                      onChange={onAddChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">State</label>
                    <input
                      name="state"
                      value={addForm.state}
                      onChange={onAddChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Pincode</label>
                    <input
                      name="pincode"
                      value={addForm.pincode}
                      onChange={onAddChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="e.g. 500067"
                      required
                      inputMode="numeric"
                      pattern="\d{6}"
                      title="Enter 6 digit pincode"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Phone</label>
                    <input
                      name="phone"
                      value={addForm.phone}
                      onChange={onAddChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="e.g. 9874563210"
                      required
                      inputMode="tel"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-3 py-2 rounded border hover:bg-gray-50 text-sm"
                  disabled={addSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white text-sm ${
                    addSaving ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={addSaving}
                >
                  {addSaving ? "Saving..." : "Add address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

