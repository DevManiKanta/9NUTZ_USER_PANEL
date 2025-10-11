'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Heart, 
  Package, 
  RefreshCw, 
  Star, 
  Calendar, 
  ShoppingBag,
  Eye,
  ArrowRight,
  Filter,
  Search,
  LogOut
} from 'lucide-react';

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState<'wishlist' | 'orders' | 'returns'>('wishlist');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const { user, logout } = useAuth();
  const { getUserOrders } = useOrders();

  const userOrders = user ? getUserOrders(user.id) : [];

  // Mock wishlist data
  const wishlistItems = [
    {
      id: 'wish-1',
      name: 'Fresh Red Bananas (Robusta)',
      price: 48,
      originalPrice: 52,
      image: 'https://images.pexels.com/photos/2238309/pexels-photo-2238309.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      brand: 'Fresho',
      weight: '1 kg',
      inStock: true,
      rating: 4.3,
      addedDate: new Date('2025-01-10')
    },
    {
      id: 'wish-2',
      name: 'Amul Taaza Toned Milk',
      price: 29,
      originalPrice: 32,
      image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      brand: 'Amul',
      weight: '500 ml',
      inStock: true,
      rating: 4.5,
      addedDate: new Date('2025-01-12')
    }
  ];

  // Mock returns data
  const returnItems = [
    {
      id: 'return-1',
      orderId: 'order-1',
      name: 'Lays American Style Chips',
      reason: 'Product damaged',
      status: 'approved',
      returnDate: new Date('2025-01-14'),
      refundAmount: 279,
      image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1'
    }
  ];

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const getStatusColor = (status) => {
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

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
        <span className="text-gray-500 text-sm">{wishlistItems.length} items</span>
      </div>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500">Add products you love to keep track of them</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 group hover:shadow-md transition-shadow">
              <div className="relative mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:shadow-md">
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </button>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium text-sm">Out of Stock</span>
                  </div>
                )}
              </div>
              
              <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{item.brand} • {item.weight}</p>
              
              <div className="flex items-center space-x-1 mb-3">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">{item.rating}</span>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-bold text-gray-900">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-gray-400 line-through ml-2">
                      ₹{item.originalPrice}
                    </span>
                  )}
                </div>
              </div>
              
              <button 
                disabled={!item.inStock}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
            .filter(order => 
              filterStatus === 'all' || order.status === filterStatus
            )
            .filter(order =>
              order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="font-semibold text-gray-900">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{order.total}</p>
                  <p className="text-sm text-gray-500">{order.orderDate.toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                {order.items.slice(0, 4).map((item, index) => (
                  <img
                    key={index}
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ))}
                {order.items.length > 4 && (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{order.items.length - 4}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {order.items.length} items • Delivered to {order.deliveryAddress.name}
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

  const renderReturns = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Returns</h2>
        <span className="text-gray-500 text-sm">{returnItems.length} returns</span>
      </div>

      {returnItems.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No returns yet</h3>
          <p className="text-gray-500">Your return history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returnItems.map((returnItem) => (
            <div key={returnItem.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={returnItem.image}
                  alt={returnItem.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{returnItem.name}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      returnItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                      returnItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Reason: {returnItem.reason}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Return Date: {returnItem.returnDate.toLocaleDateString()}
                    </p>
                    <p className="font-medium text-gray-900">
                      Refund: ₹{returnItem.refundAmount}
                    </p>
                  </div>
                </div>
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
          <p className="text-gray-600">You need to be logged in to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => {}}
        onLocationClick={() => {}}
        onCartClick={() => {}}
        cartItemCount={0}
        cartTotal={0}
      />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Logout */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveSection('wishlist')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeSection === 'wishlist'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
            </button>
            <button
              onClick={() => setActiveSection('orders')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeSection === 'orders'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>My Orders</span>
            </button>
            <button
              onClick={() => setActiveSection('returns')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeSection === 'returns'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              <span>My Returns</span>
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {activeSection === 'wishlist' && renderWishlist()}
            {activeSection === 'orders' && renderOrders()}
            {activeSection === 'returns' && renderReturns()}
          </div>
        </div>
      </main>
      
      {/* Logout Confirmation Modal */}
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