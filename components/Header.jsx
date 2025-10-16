
// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { ShoppingCart, User, Bell } from "lucide-react"; // ✅ Added Bell
// import AccountDropdown from "./AccountDropdown";
// import { useAuth } from "@/contexts/AuthContext";
// import Link from "next/link";
// import Image from "next/image";
// import Logo from "../assests/LOGO.jpg";


// export default function Header({
//   onLoginClick,
//   onLocationClick,
//   onCartClick,
//   cartItemCount,
//   cartTotal,
//   handlePaymentComplete,
// }) {
//   const [mobileNavOpen, setMobileNavOpen] = useState(false);
//   const { token, logout } = useAuth();
//   const hasToken = Boolean(token);

//   const tabs = [
//     { href: "", label: "Shop" },
//     { href: "/packages", label: "Packages" },
//     { href: "/shippingmethods", label: "Shipping Methods" },
//     { href: "/franchise", label: "Franchise With Us" },
//   ];

//   const [query, setQuery] = useState("");

//   const [profileOpen, setProfileOpen] = useState(false);
//   const profileBtnRef = useRef(null);
//   const profileMenuRef = useRef(null);

//   useEffect(() => {
//     const handleClick = (e) => {
//       if (
//         profileOpen &&
//         profileMenuRef.current &&
//         profileBtnRef.current &&
//         !profileMenuRef.current.contains(e.target) &&
//         !profileBtnRef.current.contains(e.target)
//       ) {
//         setProfileOpen(false);
//       }
//     };
//     const handleEsc = (e) => e.key === "Escape" && setProfileOpen(false);
//     document.addEventListener("mousedown", handleClick);
//     document.addEventListener("keydown", handleEsc);
//     return () => {
//       document.removeEventListener("mousedown", handleClick);
//       document.removeEventListener("keydown", handleEsc);
//     };
//   }, [profileOpen]);

//   const searchInputRef = useRef(null);

//   const [aboutTooltipOpen, setAboutTooltipOpen] = useState(false);
//   const tooltipTimeoutRef = useRef(null);

//   const showTooltip = () => {
//     if (tooltipTimeoutRef.current) window.clearTimeout(tooltipTimeoutRef.current);
//     setAboutTooltipOpen(true);
//   };
//   const hideTooltip = () => {
//     tooltipTimeoutRef.current = window.setTimeout(() => setAboutTooltipOpen(false), 150);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     const term = (query || "").trim();
//     window.dispatchEvent(new CustomEvent("siteSearch", { detail: term }));
//     setQuery("");
//     if (searchInputRef.current) {
//       searchInputRef.current.blur();
//     }
//   };

//   return (
//     <header className="sticky top-0 left-0 right-0 w-medium bg-white z-50 shadow-sm border-b border-gray-100">
//       {/* Full-width header */}
//       <div className="w-full px-0">
//         <div className="w-full flex items-center justify-between h-16 px-3 sm:px-4">
//           {/* LEFT: Logo + Nav */}
//           <div className="flex items-center gap-4 sm:gap-6">
//             <Link href="/" className="flex items-center" aria-label="Home">
//               <Image
//                 src={Logo}
//                 alt="9NUTZ"
//                 width={140}
//                 height={35}
//                 className="object-contain"
//                 priority
//               />
//             </Link>

//             <nav className="hidden md:flex items-center space-x-2">
//               {tabs.map((t) => (
//                 <Link
//                   key={t.href + t.label}
//                   href={t.href}
//                   className="text-sm text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md"
//                 >
//                   {t.label}
//                 </Link>
//               ))}

//               {/* Tooltip: About Us */}
//               <div
//                 className="relative"
//                 onMouseEnter={showTooltip}
//                 onMouseLeave={hideTooltip}
//               >
//                 <button
//                   onFocus={showTooltip}
//                   onBlur={hideTooltip}
//                   aria-haspopup="true"
//                   aria-expanded={aboutTooltipOpen}
//                   className="text-sm text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md"
//                 >
//                   About Us
//                 </button>

//                 <div
//                   role="tooltip"
//                   className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 md:w-80 p-3 rounded-lg shadow-lg text-sm bg-white border border-gray-100 transition-opacity duration-150 z-50 ${
//                     aboutTooltipOpen
//                       ? "opacity-100 pointer-events-auto"
//                       : "opacity-0 pointer-events-none"
//                   }`}
//                   onMouseEnter={showTooltip}
//                   onMouseLeave={hideTooltip}
//                 >
//                   <h4 className="font-semibold text-gray-800">Our Journey</h4>
//                   <p className="mt-1 text-gray-600 text-xs leading-relaxed">
//                     From a small local shop to a nationwide brand — we started with a
//                     single idea: premium-quality nuts and snacks delivered with love.
//                     Today we combine traditional recipes with modern packaging to bring
//                     joy to your snacking moments.
//                   </p>
//                   <div className="mt-2 text-xs">
//                     <Link href="/about" className="underline text-sm text-indigo-600">
//                       Read full story
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </nav>
//           </div>

//           {/* CENTER: Smaller Search */}
//           <div className="hidden md:flex flex-1 justify-center px-2 sm:px-4">
//             <form
//               onSubmit={handleSearchSubmit}
//               className="w-full flex justify-center"
//               role="search"
//               aria-label="Site search"
//             >
//               <div className="relative w-[240px] sm:w-[500px]"> {/* ✅ Reduced width */}
//                 <input
//                   ref={searchInputRef}
//                   type="search"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search..."
//                   className="w-full border border-gray-200 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
//                 />
//                 <button
//                   type="submit"
//                   aria-label="Search"
//                   className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded-full hover:bg-gray-100 transition"
//                 >
//                   Search
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* RIGHT: Bell, Profile, Cart, Menu */}
//           <div className="flex items-center space-x-3 relative">
//             {/* 🔔 Notification bell */}
//             <button
//               aria-label="Notifications"
//               className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               <Bell className="h-5 w-5 text-gray-700" />
//               <span className="absolute top-1.5 right-1.5 bg-red-500 rounded-full w-2 h-2" />
//             </button>

//             {/* 👤 Profile */}
//             {hasToken ? (
//               <div className="relative">
//                 <button
//                   ref={profileBtnRef}
//                   onClick={() => setProfileOpen(!profileOpen)}
//                   className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
//                 >
//                   <User className="h-5 w-5 text-gray-700" />
//                   <span className="hidden sm:inline text-sm font-medium text-gray-700">
//                     Profile
//                   </span>
//                 </button>

//                 {profileOpen && (
//                   <div
//                     ref={profileMenuRef}
//                     className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50"
//                   >
//                     <Link
//                       href="/dashboard"
//                       onClick={() => setProfileOpen(false)}
//                       className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Dashboard
//                     </Link>
//                     <button
//                       onClick={async () => {
//                         try {
//                           if (typeof logout === "function") await logout();
//                         } catch (err) {
//                           console.warn("Logout failed:", err);
//                         } finally {
//                           setProfileOpen(false);
//                           handlePaymentComplete?.();
//                         }
//                       }}
//                       className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <AccountDropdown onLoginClick={onLoginClick} />
//             )}

//             {/* 🛒 Cart */}
//             <button
//               onClick={onCartClick}
//               aria-label="Open cart"
//               className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               <ShoppingCart className="h-6 w-6 text-gray-700" />
//               {cartItemCount > 0 && (
//                 <span
//                   className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
//                   aria-label={`${cartItemCount} items in cart`}
//                 >
//                   {cartItemCount > 9 ? "9+" : cartItemCount}
//                 </span>
//               )}
//             </button>

//             {/* ☰ Mobile menu */}
//             <button
//               className="ml-1 p-2 rounded-md md:hidden hover:bg-gray-100 transition-colors"
//               onClick={() => setMobileNavOpen((s) => !s)}
//               aria-expanded={mobileNavOpen}
//               aria-label="Toggle navigation"
//             >
//               <svg
//                 className="h-6 w-6 text-gray-700"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 📱 Mobile Nav */}
//       {mobileNavOpen && (
//         <div className="md:hidden border-t border-gray-100 bg-white w-full">
//           <div className="w-full px-3 sm:px-4 py-3">
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 window.dispatchEvent(
//                   new CustomEvent("siteSearch", { detail: query.trim() })
//                 );
//                 setQuery("");
//                 setMobileNavOpen(false);
//               }}
//               className="mb-3"
//             >
//               <div className="relative">
//                 <input
//                   type="search"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search products..."
//                   className="w-full border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
//                   aria-label="Search"
//                 />
//                 <button
//                   type="submit"
//                   aria-label="Search"
//                   className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-sm hover:bg-gray-100 transition"
//                 >
//                   Search
//                 </button>
//               </div>
//             </form>

//             <ul className="space-y-2">
//               {tabs.map((t) => (
//                 <li key={`mob-${t.href}-${t.label}`}>
//                   <Link
//                     href={t.href}
//                     className="block text-sm text-gray-700 hover:text-gray-900 py-2"
//                     onClick={() => setMobileNavOpen(false)}
//                   >
//                     {t.label}
//                   </Link>
//                 </li>
//               ))}
//               <li>
//                 <button
//                   onClick={() => {
//                     setMobileNavOpen(false);
//                     onLoginClick?.();
//                   }}
//                   className="w-full text-left text-sm text-gray-700 hover:text-gray-900 py-2"
//                 >
//                   Login
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }


"use client";
import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Package,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Truck,
  ClipboardList,
  Box,
  CheckCircle2,
  MapPin,
  Bell,
  Clock,
} from "lucide-react";
import { LOCAL_API_BASE, Login_API_BASE } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function UserDashboard() {
  // Default to "profile" now that Add Address lives inside it
  const [activeSection, setActiveSection] = useState("profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // pincode lookup loading flag + abort handle
  const [isPinFetching, setIsPinFetching] = useState(false);
  const pinAbortRef = useRef(null);

  const { user, token, logout } = useAuth();
  const { getUserOrders } = useOrders();

  const userOrders = user ? getUserOrders(user.id) : [];

  const getLocalToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token") ?? localStorage.getItem("token");
  };
  const effectiveToken = token ?? getLocalToken();

  const ADDRESS_CREATE_ENDPOINT = `${Login_API_BASE}/user/address/add`;

  // Address form state (NO line2)
  const [address, setAddress] = useState({
    label: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    if (name === "pincode") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
      setAddress((prev) => ({
        ...prev,
        pincode: digitsOnly,
        city: digitsOnly.length === 6 ? prev.city : "",
        state: digitsOnly.length === 6 ? prev.state : "",
      }));
      return;
    }

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 15); // allow intl but cap length
      setAddress((prev) => ({ ...prev, phone: digitsOnly }));
      return;
    }

    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // ===== Helpers =====
  const isValidIndianPin = (pin) => /^\d{6}$/.test(pin);

  const safeParseJSON = async (res) => {
    const ctype = (res.headers.get("content-type") || "").toLowerCase();
    if (!ctype.includes("application/json")) return null;
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  // ⭐ Simple 4-step linear progress: Confirmed → Packed → Shipped → Delivered
  const StatusProgress = ({ current }) => {
    const steps = ["Confirmed", "Packed", "Shipped", "Delivered"];
    const pct = (Math.max(0, Math.min(3, current)) / 3) * 100;

    return (
      <div className="w-full">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-green-600 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-4">
          {steps.map((label, i) => {
            const active = i <= current;
            return (
              <div key={label} className="flex flex-col items-center">
                <div
                  className={`h-2.5 w-2.5 rounded-full border ${
                    active ? "bg-green-600 border-green-600" : "bg-white border-gray-300"
                  }`}
                />
                <div className={`mt-2 text-xs font-medium ${active ? "text-green-700" : "text-gray-500"}`}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Map order status to step index 0..3
  const stepIndexFromStatus = (status = "") => {
    const s = status.toLowerCase();
    if (s === "delivered") return 3;
    if (s === "shipped") return 2;
    if (s === "packed") return 1;
    if (s === "confirmed") return 0;
    return 0;
  };

  // ===== PINCODE LOOKUP =====
  const lookupPincode = async (pin) => {
    if (!isValidIndianPin(pin)) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }

    if (pinAbortRef.current) {
      pinAbortRef.current.abort();
      pinAbortRef.current = null;
    }

    try {
      setIsPinFetching(true);
      const controller = new AbortController();
      pinAbortRef.current = controller;

      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`Lookup failed: ${res.status}`);

      const payload = await res.json().catch(() => null);
      const item = Array.isArray(payload) ? payload[0] : null;

      if (!item || item.Status !== "Success" || !Array.isArray(item.PostOffice) || item.PostOffice.length === 0) {
        toast.error("No location found for this pincode.");
        setAddress((prev) => ({ ...prev, city: "", state: "" }));
        return;
      }

      const po = item.PostOffice.find((x) => x?.DeliveryStatus === "Delivery") || item.PostOffice[0];

      const city = po?.District || "";
      const state = po?.State || "";

      if (!city || !state) {
        toast.error("Could not read city/state from this pincode.");
        setAddress((prev) => ({ ...prev, city: "", state: "" }));
        return;
      }

      setAddress((prev) => ({ ...prev, city, state }));
      toast.success(`Filled City: ${city}, State: ${state}`);
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error(err);
        toast.error("Failed to fetch details for this pincode.");
        setAddress((prev) => ({ ...prev, city: "", state: "" }));
      }
    } finally {
      setIsPinFetching(false);
      pinAbortRef.current = null;
    }
  };

  const handlePincodeKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isPinFetching) await lookupPincode(address.pincode);
    }
  };

  const handlePincodeBlur = async () => {
    if (!isPinFetching && isValidIndianPin(address.pincode)) {
      await lookupPincode(address.pincode);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    const requiredFields = ["label", "line1", "city", "state", "pincode", "phone"];
    const missing = requiredFields.filter((k) => !String(address[k] || "").trim());
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return;
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Pincode must be a valid 6-digit number.");
      return;
    }

    if (!effectiveToken) {
      toast.error("Please login again to add an address.");
      return;
    }

    const loadingId = toast.loading("Saving address...");
    try {
      setIsSaving(true);
      const res = await fetch(ADDRESS_CREATE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${effectiveToken}`,
        },
        body: JSON.stringify({
          label: address.label,
          line1: address.line1,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        toast.dismiss(loadingId);
        throw new Error(text || `Add address failed (${res.status})`);
      }

      const payload = await safeParseJSON(res);
      if (payload && payload.status === false) {
        toast.dismiss(loadingId);
        throw new Error(payload.message || "Server rejected the request.");
      }

      // merge into local user cache so other screens can access immediately
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const u = JSON.parse(raw);
          const arr = Array.isArray(u.addresses) ? u.addresses.slice() : [];
          arr.push(
            payload?.address ?? {
              id: payload?.id,
              label: address.label,
              line1: address.line1,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
              phone: address.phone,
            }
          );
          localStorage.setItem("user", JSON.stringify({ ...u, addresses: arr }));
        }
      } catch (err) {
        console.warn("Local user cache update failed:", err);
      }

      toast.dismiss(loadingId);
      toast.success("Address added successfully!");

      setAddress({
        label: "",
        line1: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to add address.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    toast.success("Logged out.");
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "packed":
        return "bg-orange-100 text-orange-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ---------- ORDERS (tabular grid, includes one static demo row) ----------
  const renderOrders = () => {
    // Flatten real orders
    const rows = (userOrders || []).flatMap((order) =>
      (order?.items || []).map((item, idx) => {
        const qty = item?.qty ?? item?.quantity ?? 1;
        const price = Number(item?.price ?? item?.unitPrice ?? 0);
        const lineTotal = qty * price;
        return {
          key: `${order.id}-${idx}`,
          orderId: order.id,
          status: (order.status || "").toLowerCase(),
          orderDate: order.orderDate,
          deliveryAddress: order.deliveryAddress,
          total: order.total,
          item: {
            name: item?.name ?? "—",
            image: item?.image,
            sku: item?.sku ?? item?.code ?? "—",
            qty,
            price,
            lineTotal,
            variant: item?.variant ?? item?.options ?? null,
            category: item?.category ?? null,
          },
        };
      })
    );

    // Static demo rows
    const staticRows = [
      {
        key: "static-1",
        orderId: "DEMO123456",
        status: "shipped",
        orderDate: new Date("2025-10-10"),
        deliveryAddress: { name: "Demo User", city: "Bengaluru" },
        total: 1499,
        item: {
          name: "Demo Product – Wireless Earbuds",
          image:
            "https://images.unsplash.com/photo-1518441902116-f26c36f0b55c?q=80&w=400&auto=format&fit=crop",
          sku: "DEMO-SKU-001",
          qty: 1,
          price: 1499,
          lineTotal: 1499,
        },
      },
    ];

    const rowsWithStatic = [...rows, ...staticRows];

    // Search by order id, product name, or SKU
    const filtered = rowsWithStatic.filter((r) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return (
        String(r.orderId).toLowerCase().includes(q) ||
        String(r.item.name).toLowerCase().includes(q) ||
        String(r.item.sku).toLowerCase().includes(q)
      );
    });

    return (
      <div className="space-y-6" style={{ width: "100%" }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order #, product, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {rowsWithStatic.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500">Your order history will appear here</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No products match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-[900px] w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Line Total</th>
                  <th className="px-4 py-3">Ordered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map((r) => (
                  <tr key={r.key} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.item.image ? (
                          <img
                            src={r.item.image}
                            alt={r.item.name}
                            className="h-12 w-12 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-100 border" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{r.item.name}</div>
                          {(r.item.variant || r.item.category) && (
                            <div className="text-xs text-gray-500">
                              {r.item.variant ? `Variant: ${String(r.item.variant)}` : ""}
                              {r.item.variant && r.item.category ? " • " : ""}
                              {r.item.category ? `Category: ${String(r.item.category)}` : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.item.sku}</td>
                    <td className="px-4 py-3 font-mono text-gray-800">
                      #{String(r.orderId).slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>
                        {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{r.item.qty}</td>
                    <td className="px-4 py-3">₹{Number(r.item.price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ₹{Number(r.item.lineTotal || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.orderDate instanceof Date
                        ? r.orderDate.toLocaleDateString()
                        : r.orderDate
                        ? new Date(r.orderDate).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-3 text-xs text-gray-500" colSpan={9}>
                    Showing {filtered.length} product{filtered.length > 1 ? "s" : ""} from {userOrders.length} order
                    {userOrders.length > 1 ? "s" : ""}.
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    );
  };

  // ---------- PROFILE (now includes Add Address form) ----------
  const renderProfile = () => {
    const name = user?.name || user?.fullName || user?.username || "User";

    return (
      <div className="space-y-8">
        {/* Top: Personal Details + Quick Stats (responsive grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" /> Personal Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-xs uppercase text-gray-500">Name</div>
                <div className="mt-1 font-medium text-gray-900">{name}</div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-xs uppercase text-gray-500">Email</div>
                <div className="mt-1 font-medium text-gray-900 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {user?.email ?? "—"}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-xs uppercase text-gray-500">Phone</div>
                <div className="mt-1 font-medium text-gray-900 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {user?.phone ?? user?.mobile ?? "—"}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="text-xs uppercase text-gray-500">Member Since</div>
                <div className="mt-1 font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : user?.joinedAt
                    ? new Date(user.joinedAt).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5" /> Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold text-gray-900">{userOrders?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <span className="text-gray-600">Delivered</span>
                <span className="font-semibold text-gray-900">
                  {userOrders?.filter((o) => (o.status || "").toLowerCase() === "delivered").length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <span className="text-gray-600">In Transit</span>
                <span className="font-semibold text-gray-900">
                  {userOrders?.filter((o) =>
                    ["packed", "shipped", "confirmed"].includes((o.status || "").toLowerCase())
                  ).length ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Address (moved here) */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Add Address
          </h3>
          {/* Reuse the same form JSX */}
          <form onSubmit={handleAddAddress} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label (e.g., Home, Office)</label>
                <input
                  type="text"
                  name="label"
                  value={address.label}
                  onChange={handleAddressChange}
                  placeholder="Home / Office"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input
                type="text"
                name="line1"
                value={address.line1}
                onChange={handleAddressChange}
                placeholder="Flat / House No. / Building"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="Enter city"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="Enter state"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode {isPinFetching && <span className="text-xs text-gray-500">(looking up…)</span>}
              </label>
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                onKeyDown={handlePincodeKeyDown}
                onBlur={handlePincodeBlur}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="Enter 6-digit pincode"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                pattern="[0-9]{6}"
                title="Enter a valid 6-digit pincode"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Press Enter after typing the 6-digit pincode to auto-fill City & State.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving || isPinFetching}
              className="w-full sm:w-auto mt-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {isSaving ? "Saving..." : "Save Address"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // ---------- TRACKING (no dropdown, progress bar) ----------
  const renderTracking = () => {
    const demoOrders = [
      {
        id: "DEMO-T-1001",
        status: "shipped",
        orderDate: new Date("2025-10-08"),
        deliveryAddress: {
          name: "Demo User",
          line1: "221B Baker St",
          city: "Bengaluru",
          state: "KA",
          pincode: "560001",
        },
        items: [
          {
            name: "Wireless Earbuds",
            image:
              "https://images.unsplash.com/photo-1518441902116-f26c36f0b55c?q=80&w=300&auto=format&fit=crop",
          },
          {
            name: "Charging Cable",
            image:
              "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300&auto=format&fit=crop",
          },
        ],
      },
    ];

    // Combine real + demo
    const trackingOrders = [...(userOrders || []), ...demoOrders];

    // Search (no dropdown anymore)
    const filtered = trackingOrders.filter(
      (o) =>
        String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.items || []).some((it) => String(it.name).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Tracking</h2>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
            />
          </div>
        </div>

        {trackingOrders.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments yet</h3>
            <p className="text-gray-500">Your order tracking will appear here</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No results match your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((o) => {
              const idx = stepIndexFromStatus(o.status);
              return (
                <div key={o.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Order #{String(o.id).slice(-6).toUpperCase()}</div>
                        <div className="text-sm text-gray-500">
                          {o.orderDate instanceof Date
                            ? o.orderDate.toLocaleDateString()
                            : o.orderDate
                            ? new Date(o.orderDate).toLocaleDateString()
                            : ""}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(o.status)}`}>
                      {(o.status || "").charAt(0).toUpperCase() + (o.status || "").slice(1)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <StatusProgress current={idx} />

                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs uppercase text-gray-500 mb-1">Ship To</div>
                      <div className="font-medium text-gray-900">{o?.deliveryAddress?.name ?? "—"}</div>
                      <div className="text-gray-600">
                        {o?.deliveryAddress?.line1 ? `${o.deliveryAddress.line1}, ` : ""}
                        {o?.deliveryAddress?.city ? `${o.deliveryAddress.city}, ` : ""}
                        {o?.deliveryAddress?.state ? `${o.deliveryAddress.state} ` : ""}
                        {o?.deliveryAddress?.pincode ? `- ${o.deliveryAddress.pincode}` : ""}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs uppercase text-gray-500 mb-1">Items</div>
                      <div className="flex items-center gap-3">
                        {o.items?.slice(0, 3).map((it, i) => (
                          <img key={i} src={it.image} alt={it.name} className="w-10 h-10 rounded-md object-cover border" />
                        ))}
                        {o.items?.length > 3 && (
                          <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                            +{o.items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ---------- NOTIFICATIONS (NEW TAB) ----------
  const renderNotifications = () => {
    const [notifications, setNotifications] = useState([
      {
        id: "n1",
        title: "Order #A1B2C3 shipped",
        description: "Your order is on the way. Track it in the Tracking tab.",
        time: "2h ago",
        unread: true,
        type: "shipping",
      },
      {
        id: "n2",
        title: "Welcome to 9NUTZ!",
        description: "Thanks for joining. Enjoy exclusive offers and fast delivery.",
        time: "1d ago",
        unread: false,
        type: "info",
      },
      {
        id: "n3",
        title: "Limited-time deal",
        description: "Get 15% off on Dry Fruits Mega Pack. Use code MEGA15.",
        time: "3d ago",
        unread: true,
        type: "promo",
      },
    ]);

    const markAllRead = () =>
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

    const clearAll = () => setNotifications([]);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6" /> Notifications
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Mark all as read
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No notifications right now.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 bg-white border border-gray-200 rounded-xl overflow-hidden">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`p-4 sm:p-5 flex gap-3 sm:gap-4 ${n.unread ? "bg-green-50/40" : "bg-white"}`}
              >
                <div className={`mt-1 h-2.5 w-2.5 rounded-full ${n.unread ? "bg-green-600" : "bg-gray-200"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 truncate">{n.title}</h4>
                    <span className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      {n.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{n.description}</p>
                  {n.type === "shipping" && (
                    <button
                      onClick={() => setActiveSection("tracking")}
                      className="mt-2 text-sm text-green-700 hover:text-green-800 font-medium"
                    >
                      Go to Tracking →
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // ---------- Guard ----------
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
        </div>
      </div>
    );
  }

  // ---------- Page ----------
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header
        onLoginClick={() => {}}
        onLocationClick={() => {}}
        onCartClick={() => {}}
        cartItemCount={0}
        cartTotal={0}
      />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          </div>

          {/* Layout: LEFT vertical tabs, RIGHT content */}
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            style={{ width: "100%" }}
          >
            <div className="flex flex-col md:flex-row">
              {/* LEFT: vertical nav */}
              <aside className="md:w-72 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50">
                <nav className="p-3 md:p-4 space-y-2">
                  <button
                    onClick={() => setActiveSection("profile")}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "profile"
                        ? "bg-white text-green-600 shadow-sm border border-gray-200"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium">My Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveSection("orders")}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "orders"
                        ? "bg-white text-green-600 shadow-sm border border-gray-200"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <Package className="h-4 w-4" />
                    <span className="font-medium">My Orders</span>
                  </button>

                  <button
                    onClick={() => setActiveSection("tracking")}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "tracking"
                        ? "bg-white text-green-600 shadow-sm border border-gray-200"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">Tracking</span>
                  </button>

                  {/* NEW: Notifications */}
                  <button
                    onClick={() => setActiveSection("notifications")}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "notifications"
                        ? "bg-white text-green-600 shadow-sm border border-gray-200"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="font-medium">Notifications</span>
                  </button>
                </nav>
              </aside>

              {/* RIGHT: content */}
              <section className="flex-1 p-6 md:p-8">
                {activeSection === "profile" && renderProfile()}
                {activeSection === "orders" && renderOrders()}
                {activeSection === "tracking" && renderTracking()}
                {activeSection === "notifications" && renderNotifications()}
              </section>
            </div>
          </div>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

