"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAddresses } from "@/contexts/AddressContext";
import { X, Plus, Edit, Trash2, MapPin, Phone, User } from "lucide-react";

export default function MyAddresses({ isOpen, onClose }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { user } = useAuth() || {};
  const { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } =
    useAddresses() || {};

  const [formData, setFormData] = useState({
    type: "Home",
    name: "",
    address: "",
    phone: "",
  });

  const userAddresses = user && typeof getUserAddresses === "function"
    ? getUserAddresses(user.id)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    if (editingAddress) {
      if (typeof updateAddress === "function") {
        updateAddress(editingAddress.id, formData);
      }
      setEditingAddress(null);
    } else {
      if (typeof addAddress === "function") {
        addAddress({
          ...formData,
          userId: user.id,
        });
      }
      setShowAddForm(false);
    }

    setFormData({ type: "Home", name: "", address: "", phone: "" });
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type || "Home",
      name: address.name || "",
      address: address.address || "",
      phone: address.phone || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = (addressId) => {
    if (typeof deleteAddress === "function") {
      deleteAddress(addressId);
    }
    setDeleteConfirm(null);
  };

  const handleSetDefault = (addressId) => {
    if (user && typeof setDefaultAddress === "function") {
      setDefaultAddress(addressId, user.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Add Address Form */}
        {showAddForm ? (
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Enter complete address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {editingAddress ? "Update Address" : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                    setFormData({ type: "Home", name: "", address: "", phone: "" });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full mb-6 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Address</span>
            </button>
          </div>
        )}

        {/* Address List */}
        <div className="px-6 pb-6">
          {!userAddresses || userAddresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No addresses saved yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userAddresses.map((address) => (
                <div
                  key={address.id}
                  className={`border-2 rounded-lg p-4 transition-colors ${
                    address.isDefault ? "border-green-500 bg-green-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            address.type === "Home"
                              ? "bg-blue-100 text-blue-600"
                              : address.type === "Work"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {address.type}
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-gray-900">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{address.name}</span>
                        </div>
                        <div className="flex items-start space-x-2 text-gray-600">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{address.address}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{address.phone}</span>
                        </div>
                      </div>

                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="mt-3 text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit Address"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(address.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Address</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this address? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
