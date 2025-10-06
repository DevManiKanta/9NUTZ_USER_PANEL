// components/admin/UserManagement.tsx
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Eye, Calendar, Package, TrendingUp, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { adminGetUsersAPI, adminGetUserOrdersAPI } from '@/lib/api';

type OrderItem = {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number; // rupees
};

type Order = {
  id: string;
  total: number; // rupees
  status: 'delivered' | 'shipped' | 'packed' | string;
  orderDate: Date;
  items: OrderItem[];
};

type UserStats = {
  id: string;
  email: string;
  name?: string;
  orders: Order[];
  totalSpent: number;
  totalOrders: number;
  lastOrderDate: Date | null;
  averageOrderValue: number;
};

export default function UserManagement(): JSX.Element {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'totalSpent' | 'totalOrders' | 'lastOrderDate' | 'averageOrderValue'>('totalSpent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [usersAgg, setUsersAgg] = useState<Array<any>>([]); // raw aggregated user list from server
  const [ordersMap, setOrdersMap] = useState<Record<string, Order[]>>({}); // userId -> orders
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrdersForUser, setLoadingOrdersForUser] = useState(false);

  // Fetch aggregated user stats on mount (requires admin token)
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoadingUsers(true);
        const data = await adminGetUsersAPI(token);
        // data: [{ id, name, email, totalOrders, totalSpent, lastOrder }]
        setUsersAgg(data || []);
      } catch (err) {
        console.error('Failed to fetch admin users', err);
        setUsersAgg([]);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, [token]);

  // When a user is selected, fetch that user's orders (if not already fetched)
  const openUserDetails = async (userId: string) => {
    setSelectedUserId(userId);
    if (ordersMap[userId]) return; // already loaded
    if (!token) {
      console.warn('No admin token available');
      return;
    }
    try {
      setLoadingOrdersForUser(true);
      const ordersRaw = await adminGetUserOrdersAPI(userId, token);
      // ordersRaw have orderDate ISO strings; convert to Date objects
      const parsed = (ordersRaw || []).map((o: any) => ({
        id: String(o.id),
        total: Number(o.total),
        status: o.status,
        orderDate: new Date(o.orderDate),
        items: (o.items || []).map((it: any) => ({
          productId: String(it.productId),
          name: it.name,
          image: it.image || '',
          quantity: Number(it.quantity),
          price: Number(it.price)
        }))
      }));
      setOrdersMap(prev => ({ ...prev, [userId]: parsed }));
    } catch (err) {
      console.error('Failed to fetch orders for user', err);
      setOrdersMap(prev => ({ ...prev, [userId]: [] }));
    } finally {
      setLoadingOrdersForUser(false);
    }
  };

  // Build userStats from the aggregated users and loaded orders
  const userStats: UserStats[] = useMemo(() => {
    return usersAgg.map(u => {
      const orders = ordersMap[String(u.id)] || [];
      const totalSpent = u.totalSpent ?? orders.reduce((s: number, o: Order) => s + (o.total || 0), 0);
      const totalOrders = u.totalOrders ?? orders.length;
      const lastOrderDate = u.lastOrder ? new Date(u.lastOrder) : (orders.length ? orders[0].orderDate : null);
      const averageOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;
      return {
        id: String(u.id),
        email: u.email,
        name: u.name,
        orders,
        totalSpent,
        totalOrders,
        lastOrderDate,
        averageOrderValue
      };
    });
  }, [usersAgg, ordersMap]);

  // Filter and sort users based on UI controls
  const filteredUsers = useMemo(() => {
    const filtered = userStats.filter((u) =>
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a: UserStats, b: UserStats) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortBy) {
        case 'totalSpent':
          aValue = a.totalSpent;
          bValue = b.totalSpent;
          break;
        case 'totalOrders':
          aValue = a.totalOrders;
          bValue = b.totalOrders;
          break;
        case 'averageOrderValue':
          aValue = a.averageOrderValue;
          bValue = b.averageOrderValue;
          break;
        case 'lastOrderDate':
          aValue = a.lastOrderDate ? a.lastOrderDate.getTime() : 0;
          bValue = b.lastOrderDate ? b.lastOrderDate.getTime() : 0;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortOrder === 'asc') return aValue - bValue;
        return bValue - aValue;
      }

      const aStr = String(aValue);
      const bStr = String(bValue);
      if (sortOrder === 'asc') return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
    });

    return filtered;
  }, [userStats, searchTerm, sortBy, sortOrder]);

  const selectedUserData = selectedUserId ? userStats.find(u => u.id === selectedUserId) ?? null : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Users</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{usersAgg.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{userStats.reduce((sum, u) => sum + u.totalSpent, 0).toLocaleString()}
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
              <p className="text-gray-600 text-sm">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{Math.round(userStats.reduce((sum, u) => sum + u.averageOrderValue, 0) / (userStats.length || 1))}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.reduce((s, u) => s + u.totalOrders, 0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="totalSpent">Total Spent</option>
                <option value="totalOrders">Total Orders</option>
                <option value="lastOrderDate">Last Order Date</option>
                <option value="averageOrderValue">Average Order Value</option>
              </select>
              <button
                onClick={() => setSortOrder((s) => (s === 'asc' ? 'desc' : 'asc'))}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium text-sm">
                          {u.email ? u.email.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{u.email}</div>
                        <div className="text-sm text-gray-500">User ID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{u.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{Math.round(u.averageOrderValue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.lastOrderDate ? u.lastOrderDate.toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openUserDetails(u.id)}
                      className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-sm text-gray-500">
                    {loadingUsers ? 'Loading users...' : 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUserData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedUserData.email} - Order History
              </h3>
              <button
                onClick={() => setSelectedUserId(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* User Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Orders</div>
                  <div className="text-xl font-bold text-gray-900">{selectedUserData.totalOrders}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Spent</div>
                  <div className="text-xl font-bold text-gray-900">₹{selectedUserData.totalSpent.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Average Order</div>
                  <div className="text-xl font-bold text-gray-900">₹{Math.round(selectedUserData.averageOrderValue)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Last Order</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedUserData.lastOrderDate ? selectedUserData.lastOrderDate.toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>

              {/* Order History */}
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Order History</h4>
              <div className="space-y-4">
                {loadingOrdersForUser && !selectedUserData.orders.length ? (
                  <div className="text-center text-sm text-gray-500">Loading orders...</div>
                ) : selectedUserData.orders.length === 0 ? (
                  <div className="text-sm text-gray-500">No orders for this user.</div>
                ) : selectedUserData.orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'packed' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">₹{order.total}</div>
                        <div className="text-sm text-gray-500">{order.orderDate.toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image || '/placeholder.png'}
                              alt={item.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-gray-900">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Qty: {item.quantity}</span>
                            <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
