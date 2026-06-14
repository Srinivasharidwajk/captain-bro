import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatPrice';
import { getAssignedOrders } from '../services/riderService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { FaTruck, FaCheckCircle } from 'react-icons/fa';

export const AssignedOrders = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders } = useContext(OrderContext);
  const { currentUser } = useAuth();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiderOrders = async () => {
      setLoading(true);
      try {
        await fetchOrders();
        if (currentUser) {
          const data = await getAssignedOrders(currentUser.uid);
          setAssigned(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRiderOrders();
  }, [orders.length, currentUser]);

  const activeTasks = assigned.filter(o => o.riderId === currentUser?.uid && !['delivered', 'cancelled'].includes(o.status));
  const completedTasks = assigned.filter(o => o.riderId === currentUser?.uid && o.status === 'delivered');

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20 text-left">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h2 className="text-lg font-bold text-neutral-dark">My Active Tasks</h2>
          <p className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">Assigned deliveries tracker</p>
        </div>
        <Button onClick={() => navigate('/rider')} variant="outline" size="sm" className="py-1.5 px-3 text-xs">
          Back
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-5">
          {/* Active List */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider px-1">
              Active Deliveries ({activeTasks.length})
            </h3>
            {activeTasks.length === 0 ? (
              <div className="p-5 bg-white rounded-3xl border border-neutral-border text-center text-xs text-neutral-dark/45">
                No active deliveries at the moment.
              </div>
            ) : (
              activeTasks.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/rider/track/${order.id}`)}
                  className="bg-white p-4 rounded-3xl border border-neutral-border flex flex-col gap-3 shadow-xs cursor-pointer hover:shadow-md transition-all text-left"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-neutral-dark">ID: {order.id.slice(-6).toUpperCase()}</span>
                      <span className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">{order.address}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-primary-light text-primary border border-primary/10 rounded-full text-[9px] font-bold uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Completed List */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider px-1">
              Completed Jobs ({completedTasks.length})
            </h3>
            {completedTasks.length === 0 ? (
              <div className="p-5 bg-white rounded-3xl border border-neutral-border text-center text-xs text-neutral-dark/45">
                No completed deliveries yet.
              </div>
            ) : (
              completedTasks.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-3.5 rounded-2xl border border-neutral-border flex justify-between items-center text-xs font-semibold text-neutral-dark opacity-80"
                >
                  <div className="flex flex-col">
                    <span>ID: {order.id.slice(-6).toUpperCase()}</span>
                    <span className="text-[9px] text-neutral-dark/50 font-medium mt-0.5">{order.address}</span>
                  </div>
                  <span className="text-green-600 flex items-center gap-1">
                    <FaCheckCircle /> Done
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default AssignedOrders;
