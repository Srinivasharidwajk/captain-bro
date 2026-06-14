import { 
  createOrderDb, 
  getOrdersDb, 
  updateOrderStatusDb,
  updateOrderFieldsDb
} from '../supabase/database';

export const createOrder = async (orderData) => {
  return await createOrderDb(orderData);
};

export const getOrders = async () => {
  return await getOrdersDb();
};

export const updateOrderStatus = async (id, status, riderId = null) => {
  return await updateOrderStatusDb(id, status, riderId);
};

export const updateOrderFields = async (id, fields) => {
  return await updateOrderFieldsDb(id, fields);
};
