"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { useCategories } from "@/contexts/CategoryContext";
import { useProducts } from "@/contexts/ProductContext";
import { API_BASE } from "@/utils/apiBase";

import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Search,
  X,
  Bell,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import UserManagement from "@/components/admin/UserManagement";
import BannerManagement from "@/components/BannerManagement";
import RecommendedProducts from "@/components/RecommendedProducts";
import CouponManagement from "@/components/CouponManagement";
import AdminCart from "@/components/admin/AdminCart";
import Modal from "@/components/Modal";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { user, token } = useAuth();
  const { getAllOrders, getOrderStats } = useOrders();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { products, addProduct, updateProduct, deleteProduct, getTopSellingProducts, reload } = useProducts();
  const router = useRouter();

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image: "",
    status: "active",
  });

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: 0,
    offerPrice: 0,
    categoryId: "",
    images: [""],
    imageFiles: [],
    stock: 0,
    status: "active",
    weight: "",
    brand: "",
    rating: 0,
    reviews: 0,
    quantityPrices: [{ quantity: "", price: 0 }],
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/admin");
      return;
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return <div>Loading...</div>;
  }

  const orders = getAllOrders();
  const stats = getOrderStats();
  const topSellingProducts = getTopSellingProducts();

  const overviewStats = [
    { title: "Total Orders", value: String(orders.length), icon: ShoppingCart, color: "text-blue-600 bg-blue-100" },
    { title: "Total Products", value: String(products.length), icon: Package, color: "text-green-600 bg-green-100" },
    { title: "Total Categories", value: String(categories.length), icon: BarChart3, color: "text-purple-600 bg-purple-100" },
    { title: "Total Revenue", value: `₹${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}`, icon: TrendingUp, color: "text-orange-600 bg-orange-100" },
  ];

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory, categoryForm);
      setEditingCategory(null);
    } else {
      addCategory(categoryForm);
    }
    setCategoryForm({ name: "", description: "", image: "", status: "active" });
    setShowCategoryForm(false);
  };

  const handleEditCategory = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setCategoryForm({
        name: category.name,
        description: category.description,
        image: category.image,
        status: category.status ?? "active",
      });
      setEditingCategory(categoryId);
      setShowCategoryForm(true);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: 0,
      offerPrice: 0,
      categoryId: "",
      images: [""],
      imageFiles: [],
      stock: 0,
      status: "active",
      weight: "",
      brand: "",
      rating: 0,
      reviews: 0,
      quantityPrices: [{ quantity: "", price: 0 }],
    });
  };

  const handleEditProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price ?? 0,
        offerPrice: product.offerPrice ?? 0,
        categoryId: product.categoryId ?? product.category_id ?? "",
        images: Array.isArray(product.images) && product.images.length ? product.images : product.image ? [product.image] : [""],
        imageFiles: [],
        stock: product.stock ?? product.inventory ?? 0,
        status: product.status ?? "active",
        weight: product.weight ?? "",
        brand: product.brand ?? "",
        rating: product.rating ?? 0,
        reviews: product.reviews ?? 0,
        quantityPrices: Array.isArray(product.quantityPrices) && product.quantityPrices.length
          ? product.quantityPrices.map((q) => ({ quantity: q.quantity ?? q.size ?? String(q.size), price: Number(q.price ?? product.offerPrice ?? product.price) }))
          : [{ quantity: product.weight ?? "", price: product.offerPrice ?? product.price ?? 0 }],
      });
      setEditingProduct(productId);
      setShowProductForm(true);
    }
  };

  const handleProductFilesChange = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setProductForm((prev) => ({ ...prev, imageFiles: [...prev.imageFiles, ...files] }));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setProductForm((prev) => ({ ...prev, images: [...prev.images.filter(Boolean), String(reader.result)] }));
      };
      reader.readAsDataURL(file);
    });
    e.currentTarget.value = "";
  };

  const addQuantityRow = () => setProductForm((prev) => ({ ...prev, quantityPrices: [...prev.quantityPrices, { quantity: "", price: 0 }] }));
  const updateQuantityRow = (idx, key, val) => setProductForm((prev) => ({ ...prev, quantityPrices: prev.quantityPrices.map((r, i) => (i === idx ? { ...r, [key]: key === "price" ? Number(val) : val } : r)) }));
  const removeQuantityRow = (idx) => setProductForm((prev) => ({ ...prev, quantityPrices: prev.quantityPrices.filter((_, i) => i !== idx) }));

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const authToken = token ?? null;
    try {
      const fd = new FormData();
      fd.append("name", productForm.name);
      fd.append("description", productForm.description || "");
      fd.append("price", String(productForm.price ?? 0));
      if (productForm.offerPrice) fd.append("offer_price", String(productForm.offerPrice));
      fd.append("category_id", String(productForm.categoryId ?? ""));
      fd.append("stock", String(productForm.stock ?? 0));
      fd.append("status", productForm.status ?? "active");
      fd.append("weight", productForm.weight ?? "");
      fd.append("brand", productForm.brand ?? "");
      fd.append("rating", String(productForm.rating ?? 0));
      fd.append("reviews", String(productForm.reviews ?? 0));
      fd.append("quantityPrices", JSON.stringify(productForm.quantityPrices ?? []));

      if (productForm.imageFiles && productForm.imageFiles.length > 0) {
        productForm.imageFiles.forEach((f) => fd.append("images", f));
      }
      const urlImages = (productForm.images || []).filter(Boolean);
      if ((productForm.imageFiles?.length || 0) === 0 && urlImages.length) {
        fd.append("images_urls", JSON.stringify(urlImages));
      }
      const headers = {};
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        credentials: "include",
        headers,
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server ${res.status}: ${text}`);
      }

      const created = await res.json();
      addProduct({
        id: String(created.id ?? created._id ?? Date.now()),
        name: created.name,
        description: created.description,
        price: Math.round((created.price_cents ?? created.price ?? 0) / 100),
        offerPrice: created.offer_price ? Number(created.offer_price) : created.offerPrice ?? 0,
        categoryId: created.category_id || "",
        images: created.images ? (typeof created.images === "string" ? JSON.parse(created.images) : created.images) : [],
        stock: created.stock ?? created.inventory ?? 0,
        status: created.status ?? "active",
        weight: created.weight ?? "",
        brand: created.brand ?? "",
        rating: created.rating ?? 0,
        reviews: created.reviews ?? 0,
        quantityPrices: created.quantity_prices ? (typeof created.quantity_prices === "string" ? JSON.parse(created.quantity_prices) : created.quantity_prices) : [],
        createdAt: new Date(created.created_at || Date.now()),
        updatedAt: new Date(created.updated_at || Date.now()),
      });

      resetProductForm();
      setShowProductForm(false);
      setEditingProduct(null);
      if (typeof reload === "function") await reload();
    } catch (err) {
      console.error("Product save failed", err);
      alert("Product save failed: " + (err.message || err));
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.deliveryAddress.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === "delivered" ? "bg-green-100 text-green-800" : order.status === "shipped" ? "bg-blue-100 text-blue-800" : order.status === "packed" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderDate.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Top Selling Items</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4 max-w-full overflow-hidden">
            {topSellingProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-medium text-sm">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.reviews} reviews</p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-24 ml-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min((product.reviews / (topSellingProducts[0]?.reviews || 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
        <button onClick={() => setShowCategoryForm(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editingCategory ? "Edit Category" : "Add New Category"}</h3>
              <button onClick={() => { setShowCategoryForm(false); setEditingCategory(null); setCategoryForm({ name: "", description: "", image: "", status: "active" }); }} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" required value={categoryForm.name} onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows={3} required value={categoryForm.description} onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input type="url" required value={categoryForm.image} onChange={(e) => setCategoryForm((prev) => ({ ...prev, image: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={categoryForm.status} onChange={(e) => setCategoryForm((prev) => ({ ...prev, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium">{editingCategory ? "Update Category" : "Add Category"}</button>
                <button type="button" onClick={() => { setShowCategoryForm(false); setEditingCategory(null); setCategoryForm({ name: "", description: "", image: "", status: "active" }); }} className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-lg object-cover mr-3" src={category.image} alt={category.name} />
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="text-sm text-gray-500 max-w-xs truncate">{category.description}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${category.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{category.status ? category.status.charAt(0).toUpperCase() + category.status.slice(1) : "Active"}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => handleEditCategory(category.id)} className="text-blue-600 hover:text-blue-900"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteConfirm({ type: "category", id: category.id })} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <button onClick={() => { resetProductForm(); setEditingProduct(null); setShowProductForm(true); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      <Modal open={showProductForm} onClose={() => { setShowProductForm(false); setEditingProduct(null); resetProductForm(); }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
          <button onClick={() => { setShowProductForm(false); setEditingProduct(null); resetProductForm(); }} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Close product modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" required value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <input type="text" required value={productForm.brand} onChange={(e) => setProductForm((prev) => ({ ...prev, brand: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
          </div>

          <div>
            <label className="block text_sm font-medium text-gray-700 mb-2">Description</label>
            <textarea required rows={3} value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input type="number" required min="0" step="0.01" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: parseFloat(e.target.value || "0") }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offer Price (₹)</label>
              <input type="number" min="0" step="0.01" value={productForm.offerPrice} onChange={(e) => setProductForm((prev) => ({ ...prev, offerPrice: parseFloat(e.target.value || "0") }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select required value={productForm.categoryId} onChange={(e) => setProductForm((prev) => ({ ...prev, categoryId: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Weight/Size</label>
              <input type="text" required value={productForm.weight} onChange={(e) => setProductForm((prev) => ({ ...prev, weight: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input type="number" required min="0" value={productForm.stock} onChange={(e) => setProductForm((prev) => ({ ...prev, stock: parseInt(e.target.value || "0") }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={productForm.status} onChange={(e) => setProductForm((prev) => ({ ...prev, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (URLs)</label>
            {productForm.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input type="url" value={image} onChange={(e) => { const newImages = [...productForm.images]; newImages[index] = e.target.value; setProductForm((prev) => ({ ...prev, images: newImages })); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Image URL or data preview" />
                <button type="button" onClick={() => setProductForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))} className="text-red-600 hover:text-red-800 px-2">Remove</button>
              </div>
            ))}
            <div className="flex items-center space-x-3">
              <button type="button" onClick={() => setProductForm((prev) => ({ ...prev, images: [...prev.images, ""] }))} className="text-green-600 hover:text-green-700 text-sm">+ Add Another Image URL</button>
              <label className="text-sm text-gray-600 ml-4">
                <input type="file" accept="image/*" multiple onChange={handleProductFilesChange} className="hidden" />
                <span className="cursor-pointer underline">Upload files</span>
              </label>
            </div>
            <div className="flex space-x-2 mt-3 overflow-auto">
              {productForm.images.filter(Boolean).map((src, i) => (
                <div key={i} className="w-20 h-20 border rounded overflow-hidden flex-shrink-0">
                  <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity / Price (editable)</label>
            <div className="space-y-2">
              {productForm.quantityPrices.map((q, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input placeholder="Quantity (e.g. 1 kg)" value={q.quantity} onChange={(e) => updateQuantityRow(idx, "quantity", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg w-1/2" />
                  <input type="number" placeholder="Price" value={q.price} onChange={(e) => updateQuantityRow(idx, "price", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg w-1/3" />
                  <button type="button" onClick={() => removeQuantityRow(idx)} className="text-red-600">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addQuantityRow} className="text-green-600 hover:text-green-700 text-sm">+ Add size</button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium">{editingProduct ? "Update Product" : "Add Product"}</button>
            <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); resetProductForm(); }} className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </Modal>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => {
                const category = categories.find((c) => c.id === product.categoryId);
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-lg object-cover mr-3" src={(product.images && product.images[0]) || product.image || ""} alt={product.name} />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand} • {product.weight}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>₹{product.offerPrice || product.price}</div>
                      {product.offerPrice && product.offerPrice < product.price && (
                        <div className="text-xs text-gray-400 line-through">₹{product.price}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{product.status.charAt(0).toUpperCase() + product.status.slice(1)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => handleEditProduct(product.id)} className="text-blue-600 hover:text-blue-900"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteConfirm({ type: "product", id: product.id })} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify_between">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-orange-500" />
          <span className="text-sm text-gray-600">{orders.length} total orders</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.deliveryAddress.name}</div>
                    <div className="text-sm text-gray-500">{order.deliveryAddress.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.length} items</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === "delivered" ? "bg-green-100 text-green-800" : order.status === "shipped" ? "bg-blue-100 text-blue-800" : order.status === "packed" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderDate.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>
        {activeTab === "overview" && renderOverview()}
        {activeTab === "categories" && renderCategories()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "orders" && renderOrders()}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "banners" && <BannerManagement />}
        {activeTab === "recommended" && <RecommendedProducts />}
        {activeTab === "coupons" && <CouponManagement />}
        {activeTab === "cart" && <AdminCart />}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w_full max-w-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delete {deleteConfirm.type === "category" ? "Category" : "Product"}</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.</p>
              <div className="flex space-x-4">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => { if (deleteConfirm.type === "category") deleteCategory(deleteConfirm.id); else deleteProduct(deleteConfirm.id); setDeleteConfirm(null); }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


