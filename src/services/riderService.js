import { getOrdersDb } from '../supabase/database';

export const getAssignedOrders = async (riderId) => {
  const allOrders = await getOrdersDb();
  // Return orders that are either assigned to this rider, or are "dispatched" (ready for any rider to claim)
  return allOrders.filter(
    (order) => order.riderId === riderId || (order.status === 'dispatched' && !order.riderId)
  );
};
