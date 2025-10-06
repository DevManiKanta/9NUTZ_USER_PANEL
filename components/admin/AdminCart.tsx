import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  Smartphone,
  Search,
  X
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight: string;
  brand: string;
}

export default function AdminCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  const { getActiveProducts } = useProducts();
  const { addOrder } = useOrders();
  const { user } = useAuth();

  const products = getActiveProducts();
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.offerPrice || product.price,
        quantity: 1,
        image: product.images[0],
        weight: product.weight,
        brand: product.brand
      }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const orderData = {
        userId: user.id,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: totalAmount + 27, // Adding delivery + handling charges
        status: 'confirmed' as const,
        deliveryAddress: {
          name: 'Admin Order',
          address: 'In-store pickup / Business use',
          phone: '+91-11-4759-8900'
        }
      };
      
      addOrder(orderData);
      clearCart();
      setShowCheckout(false);
      setIsProcessing(false);
      alert('Order placed successfully!');
    }, 2000);
  };

  const paymentMethods = [
    { id: 'cash', name: 'Cash Payment', icon: DollarSign },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI Payment', icon: Smartphone }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Admin Cart</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowProducts(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Products</span>
          </button>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Subtotal</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalAmount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total (incl. charges)</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalAmount + 27}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Cart Items</h3>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cart is Empty</h3>
            <p className="text-gray-500 mb-6">Add products to start creating an order</p>
            <button
              onClick={() => setShowProducts(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.brand} • {item.weight}</p>
                    <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-medium text-gray-900 w-12 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cart Summary */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>₹25</span>
                </div>
                <div className="flex justify-between">
                  <span>Handling Charge</span>
                  <span>₹2</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalAmount + 27}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Selection Modal */}
      {showProducts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Add Products to Cart</h3>
              <button
                onClick={() => setShowProducts(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{product.brand} • {product.weight}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">₹{product.offerPrice || product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Payment Method</h4>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === method.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{method.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Items ({totalItems})</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Charges</span>
                      <span>₹27</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{totalAmount + 27}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${totalAmount + 27}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}