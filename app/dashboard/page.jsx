
"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import {
  Package,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Box,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ProfilePage from "@/app/myprofile/page";
import OrdersTablePage from "@/app/myorders/page";
import { useWishlist } from "@/contexts/WishlistContext";
import apiAxios from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = (searchParams?.get("tab") || "").toLowerCase();
    if (["orders", "profile", "tracking", "favourites"].includes(tab)) {
      setActiveSection(tab);
    } else if (!activeSection) {
      setActiveSection("profile");
    }
  }, [searchParams]);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPinFetching, setIsPinFetching] = useState(false);
  const pinAbortRef = useRef(null);

  const { user, token, logout } = useAuth();
  const { getUserOrders } = useOrders();
  const { favorites = [], loading: favLoading, refreshFavorites } = useWishlist() || {}; // ✅ from wishlist

  const userOrders = user ? getUserOrders(user.id) : [];

  // ✅ Build favourites table rows
  const favouriteRows = useMemo(() => {
    const arr = Array.isArray(favorites) ? favorites : [];
    return arr.map((f, idx) => {
      const idRaw = f?.product_id ?? f?.id ?? f?.product?.id ?? f?.product?._id;
      const id = idRaw != null ? String(idRaw) : "";
      const name =
        f?.name ??
        f?.product_name ??
        f?.title ??
        f?.product?.name ??
        `Product ${id || idx + 1}`;
      const price =
        f?.price ??
        f?.offerPrice ??
        f?.product_price ??
        f?.product?.offerPrice ??
        f?.product?.price ??
        null;
      const image_url =
        f?.image_url ??
        f?.image_url ??
        f?.product?.image_url ??
        (Array.isArray(f?.product?.image_url) ? f.product.images[0] : null);
      return { id, name, price, image_url };
    });
  }, [favorites]);
  // ✅ Refresh favourites on mount and when "favourites" tab opens
  useEffect(() => {
    refreshFavorites?.();
  }, []);

  useEffect(() => {
    if (activeSection === "favourites") {
      refreshFavorites?.();
    }
  }, [activeSection]);

  // 🏷️ Address form state
  const [address, setAddress] = useState({
    label: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const getLocalToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token") ?? localStorage.getItem("token");
  };
  const effectiveToken = token ?? getLocalToken();

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
      const digitsOnly = value.replace(/\D/g, "").slice(0, 15);
      setAddress((prev) => ({ ...prev, phone: digitsOnly }));
      return;
    }
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const isValidIndianPin = (pin) => /^\d{6}$/.test(pin);

  const lookupPincode = async (pin) => {
    if (!isValidIndianPin(pin)) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }
    if (pinAbortRef.current) pinAbortRef.current.abort();

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

      if (!item || item.Status !== "Success" || !item.PostOffice?.length) {
        toast.error("No location found for this pincode.");
        setAddress((p) => ({ ...p, city: "", state: "" }));
        return;
      }

      const po =
        item.PostOffice.find((x) => x?.DeliveryStatus === "Delivery") ||
        item.PostOffice[0];
      const city = po?.District || "";
      const state = po?.State || "";

      setAddress((p) => ({ ...p, city, state }));
      toast.success(`Filled City: ${city}, State: ${state}`);
    } catch (err) {
      if (err?.name !== "AbortError") {
        toast.error("Failed to fetch pincode details.");
      }
    } finally {
      setIsPinFetching(false);
      pinAbortRef.current = null;
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    const required = ["label", "line1", "city", "state", "pincode", "phone"];
    const missing = required.filter((k) => !String(address[k] || "").trim());
    if (missing.length) return toast.error(`Please fill: ${missing.join(", ")}`);

    if (!effectiveToken) return toast.error("Please login again.");

    const loadingId = toast.loading("Saving address...");
    try {
      setIsSaving(true);
      const res = await apiAxios.post(
        "user/address/add",
        { ...address },
        { headers: { Authorization: `Bearer ${effectiveToken}` } }
      );

      const payload = res.data;
      if (payload?.status === false)
        throw new Error(payload.message || "Server error.");

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
      toast.error(err?.response?.data?.message || "Failed to add address.");
    } finally {
      toast.dismiss(loadingId);
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    toast.success("Logged out.");
  };

  // ========== PAGE RENDER ==========

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">Please Login</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            User Dashboard
          </h1>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* LEFT NAV */}
              <aside className="md:w-72 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50">
                <nav className="p-3 md:p-4 space-y-2">
                  {[
                    { key: "profile", label: "My Profile", icon: <User /> },
                    { key: "orders", label: "My Orders", icon: <Package /> },
                    { key: "favourites", label: "Favourites", icon: <Box /> },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveSection(t.key)}
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === t.key
                          ? "bg-white text-green-600 shadow-sm border border-gray-200"
                          : "text-gray-700 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      <span className="h-4 w-4">{t.icon}</span>
                      <span className="font-medium">{t.label}</span>
                    </button>
                  ))}
                </nav>
              </aside>

              {/* RIGHT CONTENT */}
              <section className="flex-1 p-6 md:p-8">
                {activeSection === "profile" && <ProfilePage />}
                {activeSection === "orders" && <OrdersTablePage />}

                {/* ✅ FAVOURITES TAB */}
                {activeSection === "favourites" && (
                  <div className="space-y-6 w-full">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        My Favourites
                      </h2>
                      <span className="text-sm text-gray-500">
                        {Array.isArray(favorites) ? favorites.length : 0} items
                      </span>
                    </div>

                    {favLoading ? (
                      <div className="text-center py-12 text-gray-500">
                        Loading favourites…
                      </div>
                    ) : favouriteRows.length === 0 ? (
                      <div className="text-center py-12">
                        <Box className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No favourites yet
                        </h3>
                        <p className="text-gray-500">
                          Tap the heart on a product to add it here.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-100 rounded-lg overflow-hidden">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {favouriteRows.map((r, i) => (
                              <tr key={r.id || i} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    {r.image_url ? (
                                      <img
                                        src={r.image_url}
                                        alt={r.image_url}
                                        className="w-10 h-10 rounded object-cover"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-gray-100 rounded" />
                                    )}
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {r.name}
                                      </div>
                                      {r.id && (
                                        <div className="text-xs text-gray-500">
                                          #{r.id}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {r.price ? `₹${r.price}` : "-"}
                                </td>
                                <td className="px-4 py-3">
                                  {r.id ? (
                                    <a
                                      href={`/product/${r.id}`}
                                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                                    >
                                      View
                                    </a>
                                  ) : (
                                    <span className="text-gray-400 text-sm">
                                      View
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
