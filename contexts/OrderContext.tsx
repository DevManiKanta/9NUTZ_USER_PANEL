"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Order {
  id: string;
  userId: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryAddress: {
    name: string;
    address: string;
    phone: string;
  };
  estimatedDelivery?: Date;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
  getOrderStats: () => {
    daily: { date: string; count: number; revenue: number }[];
    monthly: { month: string; count: number; revenue: number }[];
    itemFrequency: { itemId: string; itemName: string; count: number }[];
  };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    items: [
      {
        id: '101',
        name: 'Fresh Red Bananas',
        price: 48,
        quantity: 2,
        image: 'https://images.pexels.com/photos/2238309/pexels-photo-2238309.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
      }
    ],
    total: 96,
    status: 'delivered',
    orderDate: new Date('2025-01-10'),
    deliveryAddress: {
      name: 'John Doe',
      address: 'B62, Pocket B, Sector 7, Rohini, Delhi - 110085',
      phone: '+91 9876543210'
    },
    estimatedDelivery: new Date('2025-01-10')
  },
  {
    id: 'order-2',
    userId: 'user-1',
    items: [
      {
        id: '201',
        name: 'Amul Taaza Toned Milk',
        price: 29,
        quantity: 4,
        image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
      }
    ],
    total: 116,
    status: 'shipped',
    orderDate: new Date('2025-01-15'),
    deliveryAddress: {
      name: 'John Doe',
      address: 'B62, Pocket B, Sector 7, Rohini, Delhi - 110085',
      phone: '+91 9876543210'
    },
    estimatedDelivery: new Date('2025-01-16')
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        orderDate: new Date(order.orderDate),
        estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined
      }));
      setOrders([...mockOrders, ...parsedOrders]);
    }
  }, []);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderDate'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderDate: new Date()
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    
    // Save to localStorage
    const ordersToSave = updatedOrders.filter(order => !mockOrders.find(mock => mock.id === order.id));
    localStorage.setItem('orders', JSON.stringify(ordersToSave));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    
    // Save to localStorage
    const ordersToSave = updatedOrders.filter(order => !mockOrders.find(mock => mock.id === order.id));
    localStorage.setItem('orders', JSON.stringify(ordersToSave));
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId).sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
  };

  const getAllOrders = () => {
    return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
  };

  const getOrderStats = () => {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last12Months = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Daily stats for last 30 days
    const dailyStats: { [key: string]: { count: number; revenue: number } } = {};
    orders
      .filter(order => order.orderDate >= last30Days)
      .forEach(order => {
        const dateKey = order.orderDate.toISOString().split('T')[0];
        if (!dailyStats[dateKey]) {
          dailyStats[dateKey] = { count: 0, revenue: 0 };
        }
        dailyStats[dateKey].count++;
        dailyStats[dateKey].revenue += order.total;
      });

    // Monthly stats for last 12 months
    const monthlyStats: { [key: string]: { count: number; revenue: number } } = {};
    orders
      .filter(order => order.orderDate >= last12Months)
      .forEach(order => {
        const monthKey = `${order.orderDate.getFullYear()}-${String(order.orderDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = { count: 0, revenue: 0 };
        }
        monthlyStats[monthKey].count++;
        monthlyStats[monthKey].revenue += order.total;
      });

    // Item frequency
    const itemFrequency: { [key: string]: { itemName: string; count: number } } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemFrequency[item.id]) {
          itemFrequency[item.id] = { itemName: item.name, count: 0 };
        }
        itemFrequency[item.id].count += item.quantity;
      });
    });

    return {
      daily: Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        count: stats.count,
        revenue: stats.revenue
      })),
      monthly: Object.entries(monthlyStats).map(([month, stats]) => ({
        month,
        count: stats.count,
        revenue: stats.revenue
      })),
      itemFrequency: Object.entries(itemFrequency).map(([itemId, data]) => ({
        itemId,
        itemName: data.itemName,
        count: data.count
      }))
    };
  };

  const value: OrderContextType = {
    orders,
    addOrder,
    updateOrderStatus,
    getUserOrders,
    getAllOrders,
    getOrderStats
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};