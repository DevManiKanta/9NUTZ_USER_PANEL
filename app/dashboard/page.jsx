
// "use client";
// import React, { useState, useRef } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useOrders } from "@/contexts/OrderContext";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Package, LogOut, Plus, Search, ArrowRight } from "lucide-react";
// import { Login_API_BASE, LOCAL_API_BASE } from "@/lib/api";
// import toast, { Toaster } from "react-hot-toast";

// export default function UserDashboard() {
//   const [activeSection, setActiveSection] = useState("address");
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [isSaving, setIsSaving] = useState(false);

//   // pincode lookup loading flag + abort handle
//   const [isPinFetching, setIsPinFetching] = useState(false);
//   const pinAbortRef = useRef(null);

//   const { user, token, logout } = useAuth();
//   const { getUserOrders } = useOrders();

//   const userOrders = user ? getUserOrders(user.id) : [];

//   const getLocalToken = () => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem("auth_token") ?? localStorage.getItem("token");
//   };
//   const effectiveToken = token ?? getLocalToken();
//   const ADDRESS_CREATE_ENDPOINT = `${LOCAL_API_BASE}/user/address/add`;
//   // Address form state (NO line2)
//   const [address, setAddress] = useState({
//     label: "",
//     line1: "",
//     city: "",
//     state: "",
//     pincode: "",
//     phone: "",
//   });

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;

//     // If user edits pincode, clear city/state so they don't stay stale
//     if (name === "pincode") {
//       const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
//       setAddress((prev) => ({
//         ...prev,
//         pincode: digitsOnly,
//         city: digitsOnly.length === 6 ? prev.city : "", // clear while incomplete
//         state: digitsOnly.length === 6 ? prev.state : "",
//       }));
//       return;
//     }

//     setAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   // ===== PINCODE LOOKUP =====
//   const isValidIndianPin = (pin) => /^\d{6}$/.test(pin);

//   const lookupPincode = async (pin) => {
//     if (!isValidIndianPin(pin)) {
//       toast.error("Please enter a valid 6-digit pincode.");
//       return;
//     }

//     // Cancel any in-flight request
//     if (pinAbortRef.current) {
//       pinAbortRef.current.abort();
//       pinAbortRef.current = null;
//     }

//     try {
//       setIsPinFetching(true);
//       const controller = new AbortController();
//       pinAbortRef.current = controller;

//       const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
//         signal: controller.signal,
//       });

//       if (!res.ok) throw new Error(`Lookup failed: ${res.status}`);

//       const payload = await res.json();

//       // API returns an array with one object
//       const item = Array.isArray(payload) ? payload[0] : null;

//       if (
//         !item ||
//         item.Status !== "Success" ||
//         !Array.isArray(item.PostOffice) ||
//         item.PostOffice.length === 0
//       ) {
//         toast.error("No location found for this pincode.");
//         setAddress((prev) => ({ ...prev, city: "", state: "" }));
//         return;
//       }

//       // Prefer a PostOffice with DeliveryStatus === "Delivery", else first
//       const po =
//         item.PostOffice.find((x) => x?.DeliveryStatus === "Delivery") ||
//         item.PostOffice[0];

//       const city = po?.District || "";
//       const state = po?.State || "";

//       if (!city || !state) {
//         toast.error("Could not read city/state from this pincode.");
//         setAddress((prev) => ({ ...prev, city: "", state: "" }));
//         return;
//       }

//       setAddress((prev) => ({ ...prev, city, state }));
//       toast.success(`Filled City: ${city}, State: ${state}`);
//     } catch (err) {
//       if (err?.name !== "AbortError") {
//         console.error(err);
//         toast.error("Failed to fetch details for this pincode.");
//         setAddress((prev) => ({ ...prev, city: "", state: "" }));
//       }
//     } finally {
//       setIsPinFetching(false);
//       pinAbortRef.current = null;
//     }
//   };

//   const handlePincodeKeyDown = async (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (!isPinFetching) await lookupPincode(address.pincode);
//     }
//   };

//   const handlePincodeBlur = async () => {
//     // Also fetch on blur, if it's valid and nothing is in flight
//     if (!isPinFetching && isValidIndianPin(address.pincode)) {
//       await lookupPincode(address.pincode);
//     }
//   };
//   // ==========================

//   const handleAddAddress = async (e) => {
//     e.preventDefault();
//     if (isSaving) return;

//     const requiredFields = ["label", "line1", "city", "state", "pincode", "phone"];
//     const missing = requiredFields.filter((k) => !String(address[k] || "").trim());
//     if (missing.length) {
//       toast.error(`Please fill: ${missing.join(", ")}`);
//       return;
//     }

//     if (!/^\d{6}$/.test(address.pincode)) {
//       toast.error("Pincode must be a valid 6-digit number.");
//       return;
//     }

//     if (!effectiveToken) {
//       toast.error("Please login again to add an address.");
//       return;
//     }

//     const loadingId = toast.loading("Saving address...");
//     try {
//       setIsSaving(true);
//       const res = await fetch(ADDRESS_CREATE_ENDPOINT, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${effectiveToken}`,
//         },
//         body: JSON.stringify({
//           label: address.label,
//           line1: address.line1,
//           city: address.city,
//           state: address.state,
//           pincode: address.pincode,
//           phone: address.phone,
//         }),
//       });

//       console.log("TEST",res)

//       if (!res.ok) {
//         const text = await res.text().catch(() => "");
//         throw new Error(`Add address failed ${res.status}: ${text}`);
//       }

//       const data = await res.json().catch(() => ({}));

//       // merge into local user cache so other screens can access immediately
//       try {
//         const raw = localStorage.getItem("user");
//         if (raw) {
//           const u = JSON.parse(raw);
//           const arr = Array.isArray(u.addresses) ? u.addresses.slice() : [];
//           arr.push(
//             data?.address ?? {
//               id: data?.id,
//               label: address.label,
//               line1: address.line1,
//               city: address.city,
//               state: address.state,
//               pincode: address.pincode,
//               phone: address.phone,
//             }
//           );
//           localStorage.setItem("user", JSON.stringify({ ...u, addresses: arr }));
//         }
//       } catch {}

//       toast.dismiss(loadingId);
//       toast.success("Address added successfully!");

//       setAddress({
//         label: "",
//         line1: "",
//         city: "",
//         state: "",
//         pincode: "",
//         phone: "",
//       });
//     } catch (err) {
//       console.error(err);
//       toast.dismiss(loadingId);
//       toast.error(err?.message || "Failed to add address.");
//       setAddress({
//         label: "",
//         line1: "",
//         city: "",
//         state: "",
//         pincode: "",
//         phone: "",
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setShowLogoutConfirm(false);
//     toast.success("Logged out.");
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "delivered":
//         return "bg-green-100 text-green-800";
//       case "shipped":
//         return "bg-blue-100 text-blue-800";
//       case "packed":
//         return "bg-orange-100 text-orange-800";
//       case "confirmed":
//         return "bg-purple-100 text-purple-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const renderAddAddress = () => (
//     <div className="max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Address</h2>

//       {/* keep native validation, but FIX the pincode pattern */}
//       <form
//         onSubmit={handleAddAddress}
//         className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200"
//       >
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Label (e.g., Home, Office)
//             </label>
//             <input
//               type="text"
//               name="label"
//               value={address.label}
//               onChange={handleAddressChange}
//               placeholder="Home / Office"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone
//             </label>
//             <input
//               type="text"
//               name="phone"
//               value={address.phone}
//               onChange={handleAddressChange}
//               placeholder="Enter phone number"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Address Line 1
//           </label>
//           <input
//             type="text"
//             name="line1"
//             value={address.line1}
//             onChange={handleAddressChange}
//             placeholder="Flat / House No. / Building"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               City
//             </label>
//             <input
//               type="text"
//               name="city"
//               value={address.city}
//               onChange={handleAddressChange}
//               placeholder="Enter city"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               State
//             </label>
//             <input
//               type="text"
//               name="state"
//               value={address.state}
//               onChange={handleAddressChange}
//               placeholder="Enter state"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Pincode {isPinFetching && (
//               <span className="text-xs text-gray-500">(looking up…)</span>
//             )}
//           </label>
//           <input
//             type="text"
//             name="pincode"
//             value={address.pincode}
//             onChange={handleAddressChange}
//             onKeyDown={handlePincodeKeyDown}   // ENTER to fetch
//             onBlur={handlePincodeBlur}         // also fetch on blur
//             inputMode="numeric"
//             autoComplete="postal-code"
//             placeholder="Enter 6-digit pincode"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             pattern="[0-9]{6}"
//             title="Enter a valid 6-digit pincode"
//             required
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Press Enter after typing the 6-digit pincode to auto-fill City & State.
//           </p>
//         </div>

//         <button
//           type="submit"
//           disabled={isSaving || isPinFetching}
//           className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
//         >
//           {isSaving ? "Saving..." : "Save Address"}
//         </button>
//       </form>
//     </div>
//   );

//   const renderOrders = () => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
//         <div className="flex items-center space-x-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search orders..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             />
//           </div>
//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
//           >
//             <option value="all">All Orders</option>
//             <option value="delivered">Delivered</option>
//             <option value="shipped">Shipped</option>
//             <option value="packed">Packed</option>
//             <option value="confirmed">Confirmed</option>
//             <option value="cancelled">Cancelled</option>
//           </select>
//         </div>
//       </div>

//       {userOrders.length === 0 ? (
//         <div className="text-center py-12">
//           <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
//           <p className="text-gray-500">Your order history will appear here</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {userOrders
//             .filter((order) => filterStatus === "all" || order.status === filterStatus)
//             .filter(
//               (order) =>
//                 order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 order.items.some((item) =>
//                   item.name.toLowerCase().includes(searchTerm.toLowerCase())
//                 )
//             )
//             .map((order) => (
//               <div
//                 key={order.id}
//                 className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-4">
//                     <h3 className="font-semibold text-gray-900">
//                       Order #{order.id.slice(-6).toUpperCase()}
//                     </h3>
//                     <span
//                       className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
//                         order.status
//                       )}`}
//                     >
//                       {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold text-gray-900">₹{order.total}</p>
//                     <p className="text-sm text-gray-500">
//                       {order.orderDate.toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-4 mb-4">
//                   {order.items.slice(0, 4).map((item, index) => (
//                     <img
//                       key={index}
//                       src={item.image}
//                       alt={item.name}
//                       className="w-12 h-12 object-cover rounded-lg"
//                     />
//                   ))}
//                   {order.items.length > 4 && (
//                     <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
//                       <span className="text-xs text-gray-600">
//                         +{order.items.length - 4}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-gray-600">
//                     {order.items.length} items • Delivered to {order.deliveryAddress.name}
//                   </p>
//                   <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1">
//                     <span>View Details</span>
//                     <ArrowRight className="h-3 w-3" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//         </div>
//       )}
//     </div>
//   );

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Toaster position="top-right" />
//       <Header
//         onLoginClick={() => {}}
//         onLocationClick={() => {}}
//         onCartClick={() => {}}
//         cartItemCount={0}
//         cartTotal={0}
//       />
//       <main>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 User Dashboard
//               </h1>
//             </div>
//           </div>
//           <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg w-fit">
//             <button
//               onClick={() => setActiveSection("address")}
//               className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
//                 activeSection === "address"
//                   ? "bg-white text-green-600 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <Plus className="h-4 w-4" />
//               <span>Add Address</span>
//             </button>

//             <button
//               onClick={() => setActiveSection("orders")}
//               className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
//                 activeSection === "orders"
//                   ? "bg-white text-green-600 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <Package className="h-4 w-4" />
//               <span>My Orders</span>
//             </button>
//           </div>

//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//             {activeSection === "address" && renderAddAddress()}
//             {activeSection === "orders" && renderOrders()}
//           </div>
//         </div>
//       </main>

//       {showLogoutConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl w-full max-w-md p-6">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Logout</h3>
//             <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>

//             <div className="flex space-x-4">
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Log Out
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
// }
"use client";
import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, Plus, Search, ArrowRight } from "lucide-react";
import { LOCAL_API_BASE } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("address");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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

  const ADDRESS_CREATE_ENDPOINT = `${LOCAL_API_BASE}/user/address/add`;

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

      const po =
        item.PostOffice.find((x) => x?.DeliveryStatus === "Delivery") || item.PostOffice[0];

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
  // ==========================

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

      // Handle non-2xx with text body safely
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        toast.dismiss(loadingId);
        throw new Error(text || `Add address failed (${res.status})`);
      }

      const payload = await safeParseJSON(res);
      // Optional: if backend returns {status:false,message:"..."}
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

      // Reset only on success
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
    switch (status) {
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

  const renderAddAddress = () => (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Address</h2>

      <form onSubmit={handleAddAddress} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
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
          <p className="text-xs text-gray-500 mt-1">Press Enter after typing the 6-digit pincode to auto-fill City & State.</p>
        </div>

        <button
          type="submit"
          disabled={isSaving || isPinFetching}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
        >
          {isSaving ? "Saving..." : "Save Address"}
        </button>
      </form>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="shipped">Shipped</option>
            <option value="packed">Packed</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders
            .filter((order) => filterStatus === "all" || order.status === filterStatus)
            .filter(
              (order) =>
                `${order.id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold text-gray-900">Order #{String(order.id).slice(-6).toUpperCase()}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{order.total}</p>
                    <p className="text-sm text-gray-500">
                      {order.orderDate instanceof Date ? order.orderDate.toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  {order.items.slice(0, 4).map((item, index) => (
                    <img key={index} src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{order.items.length - 4}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {order.items.length} items • Delivered to {order?.deliveryAddress?.name ?? "—"}
                  </p>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1">
                    <span>View Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header onLoginClick={() => {}} onLocationClick={() => {}} onCartClick={() => {}} cartItemCount={0} cartTotal={0} />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          </div>

          {/* Layout: LEFT vertical tabs, RIGHT content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* LEFT: vertical nav */}
              <aside className="md:w-64 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50">
                <nav className="p-3 md:p-4 space-y-2">
                  <button
                    onClick={() => setActiveSection("address")}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === "address"
                        ? "bg-white text-green-600 shadow-sm border border-gray-200"
                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">Add Address</span>
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
                </nav>
              </aside>

              {/* RIGHT: content */}
              <section className="flex-1 p-6 md:p-8">
                {activeSection === "address" && renderAddAddress()}
                {activeSection === "orders" && renderOrders()}
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


