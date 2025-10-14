"use client";

import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus, X, Percent, Calendar, Users } from 'lucide-react';



export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'coupon-1',
      code: 'WELCOME20',
      description: 'Welcome discount for new users',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 199,
      maxDiscount: 100,
      validFrom: new Date('2025-01-01'),
      validUntil: new Date('2025-12-31'),
      usageLimit: 1000,
      usedCount: 45,
      status: 'active',
      createdAt: new Date('2025-01-01')
    },
    {
      id: 'coupon-2',
      code: 'SAVE50',
      description: 'Flat ₹50 off on orders above ₹299',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 299,
      validFrom: new Date('2025-01-15'),
      validUntil: new Date('2025-02-15'),
      usageLimit: 500,
      usedCount: 12,
      status: 'active',
      createdAt: new Date('2025-01-15')
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    validFrom: '',
    validUntil: '',
    usageLimit: 1,
    status: 'active' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCoupon) {
      setCoupons(prev => prev.map(coupon =>
        coupon.id === editingCoupon
          ? {
              ...coupon,
              ...formData,
              validFrom: new Date(formData.validFrom),
              validUntil: new Date(formData.validUntil)
            }
          : coupon
      ));
    } else {
      const newCoupon = {
        ...formData,
        id: `coupon-${Date.now()}`,
        validFrom: new Date(formData.validFrom),
        validUntil: new Date(formData.validUntil),
        usedCount: 0,
        createdAt: new Date()
      };
      setCoupons(prev => [...prev, newCoupon]);
    }
    
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscount: 0,
      validFrom: '',
      validUntil: '',
      usageLimit: 1,
      status: 'active'
    });
    setShowForm(false);
    setEditingCoupon(null);
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount || 0,
      validFrom: coupon.validFrom.toISOString().split('T')[0],
      validUntil: coupon.validUntil.toISOString().split('T')[0],
      usageLimit: coupon.usageLimit,
      status: coupon.status
    });
    setEditingCoupon(coupon.id);
    setShowForm(true);
  };

  const handleDelete = (couponId) => {
    setCoupons(prev => prev.filter(coupon => coupon.id !== couponId));
    setDeleteConfirm(null);
  };

  const toggleStatus = (couponId) => {
    setCoupons(prev => prev.map(coupon =>
      coupon.id === couponId
        ? { ...coupon, status: coupon.status === 'active' ? 'inactive' : 'active' }
        : coupon
    ));
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Coupon</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Coupons</p>
              <p className="text-2xl font-bold text-gray-900">
                {coupons.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Percent className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                {coupons.reduce((sum, coupon) => sum + coupon.usedCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {coupons.filter(c => {
                  const daysUntilExpiry = Math.ceil((c.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900">₹{(coupons.reduce((sum, coupon) => sum + coupon.usedCount * (coupon.discountType === 'fixed' ? coupon.discountValue : 50), 0)).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Percent className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Coupons List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900 font-mono">{coupon.code}</div>
                      <div className="text-sm text-gray-500">{coupon.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% off`
                        : `₹${coupon.discountValue} off`
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      Min order: ₹{coupon.minOrderAmount}
                      {coupon.maxDiscount && ` • Max: ₹${coupon.maxDiscount}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{coupon.validFrom.toLocaleDateString()}</div>
                    <div>to {coupon.validUntil.toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(coupon.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        coupon.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(coupon.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Coupon Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCoupon(null);
                  setFormData({
                    code: '',
                    description: '',
                    discountType: 'percentage',
                    discountValue: 0,
                    minOrderAmount: 0,
                    maxDiscount: 0,
                    validFrom: '',
                    validUntil: '',
                    usageLimit: 1,
                    status: 'active'
                  });
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                    placeholder="e.g., SAVE20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value  }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Welcome discount for new users"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {formData.discountType === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Optional - Leave 0 for no limit"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
                  <input
                    type="date"
                    required
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                  <input
                    type="date"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="How many times can this coupon be used?"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium"
                >
                  {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCoupon(null);
                    setFormData({
                      code: '',
                      description: '',
                      discountType: 'percentage',
                      discountValue: 0,
                      minOrderAmount: 0,
                      maxDiscount: 0,
                      validFrom: '',
                      validUntil: '',
                      usageLimit: 1,
                      status: 'active'
                    });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Coupon</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this coupon? This action cannot be undone.</p>
            
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
  );
}