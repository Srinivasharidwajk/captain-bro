import React, { createContext, useState, useEffect } from 'react';
import { createOrder, getOrders, updateOrderStatus, updateOrderFields, subscribeToOrders } from '../services/orderService';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await createOrder(orderData);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (orderId, status, riderId = null) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await updateOrderStatus(orderId, status, riderId);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, ...updatedOrder } : order))
      );
      // Re-fetch to keep consistency across storage triggers
      await fetchOrders();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFields = async (orderId, fields) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await updateOrderFields(orderId, fields);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, ...updatedOrder } : order))
      );
      await fetchOrders();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToOrders((data) => {
      setOrders(data);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    orders,
    loading,
    error,
    fetchOrders,
    placeOrder,
    changeStatus,
    updateFields
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
