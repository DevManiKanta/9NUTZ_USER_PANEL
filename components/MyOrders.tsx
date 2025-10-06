"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { X, Package, Clock, CheckCircle, Truck, MapPin, Phone } from 'lucide-react';

interface MyOrdersProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyOrders({ isOpen, onClose }: MyOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const { user } = useAuth();
  const { getUserOrders } = useOrders();

  const userOrders = user ? getUserOrders(user.id) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'packed':
        return 'bg-orange-100 text-orange-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'packed':
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  const selectedOrderData = selectedOrder ? userOrders.find(order => order.id === selectedOrder) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedOrderData ? `Order #${selectedOrderData.id.slice(-6).toUpperCase()}` : 'My Orders'}
          </h2>
          <div className="flex items-center space-x-2">
            {selectedOrderData && (
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Back to Orders
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {selectedOrderData ? (
          /* Order Details View */
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Status</h3>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getStatusColor(selectedOrderData.status)}`}>
                      {getStatusIcon(selectedOrderData.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{selectedOrderData.status}</p>
                      <p className="text-sm text-gray-500">
                        Ordered on {selectedOrderData.orderDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {selectedOrderData.estimatedDelivery && (
                    <p className="text-sm text-gray-600 mt-2">
                      Estimated delivery: {selectedOrderData.estimatedDelivery.toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedOrderData.deliveryAddress.name}</p>
                        <p className="text-sm text-gray-600">{selectedOrderData.deliveryAddress.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-600">{selectedOrderData.deliveryAddress.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3 mb-6">
                  {selectedOrderData.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Items Total</span>
                      <span>₹{selectedOrderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>₹25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Handling Charge</span>
                      <span>₹2</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Paid</span>
                        <span>₹{selectedOrderData.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Orders List View */
          <div className="p-6">
            {userOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No orders found</p>
                <p className="text-sm text-gray-400">Your order history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">{order.orderDate.toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{order.items.length} items</span>
                      <span>•</span>
                      <span>₹{order.total}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {order.items.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}