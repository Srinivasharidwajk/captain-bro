import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatPrice';
import { getAssignedOrders } from '../services/riderService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

export const RiderDashboard = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, changeStatus } = useContext(OrderContext);
  const { currentUser } = useAuth();
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRiderData = async () => {
    setLoading(true);
    try {
      await fetchOrders();
      if (currentUser) {
        const data = await getAssignedOrders(currentUser.uid);
        setAssignedOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
  }, [orders.length, currentUser]);

  const handleClaim = async (orderId) => {
    try {
      // Update order status and set this rider's ID
      await changeStatus(orderId, 'dispatched', currentUser.uid);
      alert('Order claimed! Proceed to pick up the items.');
      await fetchRiderData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Unclaimed orders are those which have status "dispatched" and NO riderId assigned
  const unclaimedOrders = orders.filter(
    (order) => order.status === 'dispatched' && !order.riderId
  );

  // My active deliveries are those assigned to me and NOT delivered/cancelled
  const myActiveDeliveries = assignedOrders.filter(
    (order) => order.riderId === currentUser?.uid && !['delivered', 'cancelled'].includes(order.status)
  );

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20 text-left">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h2 className="text-lg font-bold text-neutral-dark">Rider Dashboard</h2>
          <p className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">Welcome, {currentUser?.fullName || 'Rider'}</p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-border flex justify-around text-center shadow-xs">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-neutral-dark/40 uppercase">My Active</span>
          <span className="text-base font-black text-neutral-dark mt-0.5">{myActiveDeliveries.length} tasks</span>
        </div>
        <div className="w-px bg-neutral-border h-8 my-auto"></div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-neutral-dark/40 uppercase">Unclaimed</span>
          <span className="text-base font-black text-neutral-dark mt-0.5">{unclaimedOrders.length} orders</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-neutral-dark">
        <button onClick={() => navigate('/rider/orders')} className="p-3 bg-white border border-neutral-border rounded-2xl active:scale-95 shadow-sm">
          📦 My Active Tasks ({myActiveDeliveries.length})
        </button>
        <button onClick={() => navigate('/rider/profile')} className="p-3 bg-white border border-neutral-border rounded-2xl active:scale-95 shadow-sm">
          👤 Delivery Profile
        </button>
      </div>

      {/* Unclaimed Deliveries */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-neutral-dark">Available Jobs (Unclaimed)</h3>
        {loading ? (
          <Loader />
        ) : unclaimedOrders.length === 0 ? (
          <div className="p-5 bg-white rounded-3xl border border-neutral-border text-center text-xs font-semibold text-neutral-dark/40">
            No unclaimed deliveries available right now.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {unclaimedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-3xl border border-neutral-border flex flex-col gap-3 shadow-xs text-left"
              >
                <div className="flex justify-between items-start border-b border-neutral-border pb-2.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-neutral-dark">Order: {order.id.slice(-6).toUpperCase()}</span>
                    <span className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">{order.address}</span>
                  </div>
                  <span className="text-xs font-extrabold text-neutral-dark">{formatPrice(order.total)}</span>
                </div>
                
                <Button onClick={() => handleClaim(order.id)} size="sm" className="w-full py-2.5">
                  Accept Delivery Job
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default RiderDashboard;
