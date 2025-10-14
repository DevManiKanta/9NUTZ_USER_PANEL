"use client";

import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Star, TrendingUp, Search, X, Plus, Edit, Trash2 } from 'lucide-react';



export default function RecommendedProducts() {
  const { getActiveProducts, getProductById } = useProducts();
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([
    {
      id: 'rec-1',
      productId: 'prod-1',
      priority: 1,
      reason: 'Best Seller',
      status: 'active',
      createdAt: new Date('2025-01-10')
    },
    {
      id: 'rec-2',
      productId: 'prod-2',
      priority: 2,
      reason: 'High Rating',
      status: 'active',
      createdAt: new Date('2025-01-12')
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    productId: '',
    priority: 1,
    reason: '',
    status: 'active' 
  });

  const activeProducts = getActiveProducts();
  const availableProducts = activeProducts.filter(product => 
    !recommendedProducts.some(rec => rec.productId === product.id)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingRecommendation) {
      setRecommendedProducts(prev => prev.map(rec =>
        rec.id === editingRecommendation
          ? { ...rec, ...formData }
          : rec
      ));
    } else {
      const newRecommendation = {
        ...formData,
        id: `rec-${Date.now()}`,
        createdAt: new Date()
      };
      setRecommendedProducts(prev => [...prev, newRecommendation]);
    }
    
    setFormData({
      productId: '',
      priority: 1,
      reason: '',
      status: 'active'
    });
    setShowForm(false);
    setEditingRecommendation(null);
  };

  const handleEdit = (recommendation) => {
    setFormData({
      productId: recommendation.productId,
      priority: recommendation.priority,
      reason: recommendation.reason,
      status: recommendation.status
    });
    setEditingRecommendation(recommendation.id);
    setShowForm(true);
  };

  const handleDelete = (recId) => {
    setRecommendedProducts(prev => prev.filter(rec => rec.id !== recId));
    setDeleteConfirm(null);
  };

  const toggleStatus = (recId) => {
    setRecommendedProducts(prev => prev.map(rec =>
      rec.id === recId
        ? { ...rec, status: rec.status === 'active' ? 'inactive' : 'active' }
        : rec
    ));
  };

  const filteredRecommendations = recommendedProducts.filter(rec => {
    const product = getProductById(rec.productId);
    return product && (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recommended Products</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Recommendation</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Recommendations</p>
              <p className="text-2xl font-bold text-gray-900">
                {recommendedProducts.filter(r => r.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Recommendations</p>
              <p className="text-2xl font-bold text-gray-900">{recommendedProducts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Available Products</p>
              <p className="text-2xl font-bold text-gray-900">{availableProducts.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search recommendations..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecommendations.map((recommendation) => {
                const product = getProductById(recommendation.productId);
                if (!product) return null;
                
                return (
                  <tr key={recommendation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand} • ₹{product.offerPrice || product.price}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        #{recommendation.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {recommendation.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(recommendation.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          recommendation.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {recommendation.status.charAt(0).toUpperCase() + recommendation.status.slice(1)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(recommendation)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(recommendation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRecommendation ? 'Edit Recommendation' : 'Add Recommendation'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRecommendation(null);
                  setFormData({
                    productId: '',
                    priority: 1,
                    reason: '',
                    status: 'active'
                  });
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Product</option>
                  {availableProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.brand}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <select
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Reason</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="High Rating">High Rating</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Seasonal">Seasonal</option>
                  <option value="Trending">Trending</option>
                  <option value="Editor's Choice">Editor's Choice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium"
                >
                  {editingRecommendation ? 'Update' : 'Add Recommendation'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRecommendation(null);
                    setFormData({
                      productId: '',
                      priority: 1,
                      reason: '',
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Remove Recommendation</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to remove this product from recommendations?</p>
            
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
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}