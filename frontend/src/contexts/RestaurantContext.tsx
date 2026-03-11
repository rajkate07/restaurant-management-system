import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { MenuItem, OrderItem, Order, StaffMember, CurrentUser, CGST_RATE, SGST_RATE } from '@/types/restaurant';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RestaurantContextType {
  currentUser: CurrentUser | null;
  menuItems: MenuItem[];
  orders: Order[];
  myOrders: Order[];
  users: StaffMember[];
  cartItems: OrderItem[];
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Cart Actions
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  // Menu Actions
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  // Staff Actions
  addStaffMember: (staff: Omit<StaffMember, 'id'>) => Promise<void>;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => Promise<void>;
  deleteStaffMember: (id: string) => Promise<void>;
  addOrder: (tableNumber: number, items: OrderItem[], paymentMethod: 'cash' | 'online', transactionId?: string, customerName?: string) => Promise<Order | null>;
  placeCustomerOrder: (tableNumber: number, paymentMethod: 'cash' | 'online', transactionId?: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: string, estimatedTime?: number) => Promise<void>;
  fetchMyOrders: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchUsers: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [users, setUsers] = useState<StaffMember[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  // Cart Logic
  const addToCart = useCallback((menuItem: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(item => item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.menuItem.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.menuItem.id === itemId ? { ...item, quantity } : item));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCartItems([]), []);

  // Helper for Headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  // --- AUTH & STAFF LOGIC ---

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return data.user.role; // e.g. 'admin', 'staff', 'customer'
      }
      return null;
    } catch (error) {
      return null;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/staff`, { headers: getHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) { console.error(err); }
  };

  const addStaffMember = async (staff: Omit<StaffMember, 'id'>) => {
    const res = await fetch(`${API_URL}/auth/add-staff`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(staff),
    });
    const data = await res.json();
    if (data.success) setUsers(prev => [...prev, data.data]);
  };

  const updateStaffMember = async (id: string, updates: Partial<StaffMember>) => {
    const res = await fetch(`${API_URL}/auth/staff/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (data.success) setUsers(prev => prev.map(s => s.id === id ? data.data : s));
  };

  const deleteStaffMember = async (id: string) => {
    const res = await fetch(`${API_URL}/auth/staff/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) setUsers(prev => prev.filter(s => s.id !== id));
  };

  // --- MENU LOGIC ---

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_URL}/menu`);
      const data = await res.json();
      if (data.success) setMenuItems(data.data);
    } catch (err) { console.error(err); }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    const res = await fetch(`${API_URL}/menu`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (data.success) setMenuItems(prev => [...prev, data.data]);
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    const res = await fetch(`${API_URL}/menu/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (data.success) setMenuItems(prev => prev.map(item => item.id === id ? data.data : item));
  };

  const deleteMenuItem = async (id: string) => {
    const res = await fetch(`${API_URL}/menu/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  // 1. Fetch Orders from MySQL on load
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`, { headers: getHeaders() });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) { console.error("Failed to fetch orders", err); }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/my-orders`, { headers: getHeaders() });
      const data = await res.json();
      if (data.success) setMyOrders(data.data);
    } catch (err) { console.error("Failed to fetch my orders", err); }
  };

  const updateOrderStatus = async (orderId: string, status: string, estimatedTime?: number) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, estimatedTime }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders(); // Refresh orders globally
      }
    } catch (err) { console.error(err); }
  };

  // Initial Data Fetch
  useEffect(() => {
    fetchMenu();
    if (currentUser) {
      if (currentUser.role === 'admin') fetchUsers();
      fetchOrders();
      fetchMyOrders();
    }
  }, [currentUser]);

  // 2. The Final Add Order Function
  const addOrder = useCallback(async (
    tableNumber: number,
    items: OrderItem[],
    paymentMethod: 'cash' | 'online',
    transactionId?: string,
    customerName?: string
  ): Promise<Order | null> => {
    try {
      const orderPayload = {
        tableNumber,
        paymentMethod,
        transactionId,
        customerName,
        items: items.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity
        }))
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success) {
        const newOrder = data.data;
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
      }
      return null;
    } catch (error) {
      console.error("Order Creation Error:", error);
      return null;
    }
  }, [currentUser]);

  const placeCustomerOrder = useCallback(async (
    tableNumber: number,
    paymentMethod: 'cash' | 'online',
    transactionId?: string
  ): Promise<Order | null> => {
    try {
      const orderPayload = {
        tableNumber,
        paymentMethod,
        transactionId,
        items: cartItems.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity
        }))
      };

      // USE PROTECTED ENDPOINT NOW BECAUSE CUSTOMER MUST BE AUTHENTICATED
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success) {
        setCartItems([]);
        return data.data;
      }
      return null;
    } catch (error) {
      console.error("Customer Order Error:", error);
      return null;
    }
  }, [cartItems]);


  return (
    <RestaurantContext.Provider value={{
      currentUser, users, menuItems, orders, myOrders, cartItems,
      login, register, logout,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      addStaffMember, updateStaffMember, deleteStaffMember,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addOrder,
      placeCustomerOrder,
      updateOrderStatus,
      fetchMyOrders,
      fetchOrders,
      fetchUsers,
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

// Add this at the bottom, outside the RestaurantProvider component
export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

