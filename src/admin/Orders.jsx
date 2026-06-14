import React, { useContext, useEffect, useState } from 'react';
import { OrderContext } from '../context/OrderContext';
import { getUsers } from '../services/userService';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/helpers';
import Loader from '../components/common/Loader';
import { FaTrash, FaCheckCircle, FaTruck, FaClock } from 'react-icons/fa';

export const Orders = () => {
  const { orders, loading, fetchOrders, changeStatus } = useContext(OrderContext);
  const [filterStatus, setFilterStatus] = useState('all');
  const [riders, setRiders] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [verifiedItems, setVerifiedItems] = useState({});

  useEffect(() => {
    fetchOrders();
    const fetchRiders = async () => {
      const u = await getUsers();
      setRiders(u.filter(x => x.role === 'rider'));
    };
    fetchRiders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await changeStatus(orderId, newStatus);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAssignRider = async (orderId, riderId) => {
    if (!riderId) return;
    try {
      await changeStatus(orderId, 'dispatched', riderId);
      alert('Rider assigned and order dispatched!');
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleSelectOrder = (orderId) => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleVerifyItem = (orderId, itemId) => {
    const key = `${orderId}_${itemId}`;
    setVerifiedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isOrderItemsVerified = (order) => {
    if (!['accepted', 'preparing'].includes(order.status)) return true;
    if (!order.items || order.items.length === 0) return true;
    return order.items.every(item => verifiedItems[`${order.id}_${item.id || item.name}`]);
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedOrderIds.length === 0) return;
    
    if (newStatus === 'dispatched') {
      const unverified = selectedOrderIds.filter(id => {
        const order = orders.find(o => o.id === id);
        return order && !isOrderItemsVerified(order);
      });
      if (unverified.length > 0) {
        alert("Some selected orders have unverified items. Please verify all items before bulk dispatching.");
        return;
      }
    }

    try {
      let count = 0;
      for (const orderId of selectedOrderIds) {
        await changeStatus(orderId, newStatus);
        count++;
      }
      alert(`Successfully updated ${count} orders to "${newStatus}"!`);
      setSelectedOrderIds([]);
      fetchOrders();
    } catch (err) {
      alert("Error updating bulk orders: " + err.message);
    }
  };

  const handleExportCSV = () => {
    const exportOrders = orders.filter(order => order.status !== 'pending_payment');
    if (exportOrders.length === 0) {
      alert("No orders to export.");
      return;
    }

    const headers = [
      "Order ID",
      "Customer Name",
      "Customer Phone",
      "Address",
      "Total Amount",
      "Status",
      "Payment Method",
      "Payment Status",
      "Created At"
    ];

    const csvRows = [
      headers.join(","),
      ...exportOrders.map(order => [
        `"${order.id}"`,
        `"${(order.customerName || '').replace(/"/g, '""')}"`,
        `"${(order.customerPhone || '').replace(/"/g, '""')}"`,
        `"${(order.address || '').replace(/"/g, '""')}"`,
        order.total,
        `"${order.status}"`,
        `"${order.paymentMethod || ''}"`,
        `"${order.paymentStatus || ''}"`,
        `"${order.createdAt || ''}"`
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(
    (order) => (filterStatus === 'all' || order.status === filterStatus) && order.status !== 'pending_payment'
  );

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20 text-left">
      <div className="flex justify-between items-center mb-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-neutral-dark">Manage Orders</h2>
            {selectedOrderIds.length > 0 ? (
              <span className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black rounded-full animate-pulse">
                {selectedOrderIds.length} Selected
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-neutral-dark/5 border border-neutral-dark/10 text-neutral-dark/50 text-[10px] font-bold rounded-full">
                0 Selected
              </span>
            )}
          </div>
          <p className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">Control order status workflow</p>
        </div>
        <div className="flex gap-2">
          {filteredOrders.length > 0 && (
            <button
              onClick={() => {
                const allFilteredIds = filteredOrders.map(o => o.id);
                const allSelected = allFilteredIds.every(id => selectedOrderIds.includes(id));
                if (allSelected) {
                  setSelectedOrderIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
                } else {
                  setSelectedOrderIds(prev => [...new Set([...prev, ...allFilteredIds])]);
                }
              }}
              className="px-3 py-1.5 bg-neutral-light border border-neutral-border hover:bg-neutral-light/80 text-neutral-dark rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer"
            >
              {filteredOrders.every(o => selectedOrderIds.includes(o.id)) ? 'Deselect All' : 'Select All'}
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Action Panel */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl flex flex-col md:flex-row gap-3 justify-between md:items-center text-xs font-bold text-neutral-dark">
          <div className="flex flex-col">
            <span className="text-primary font-black text-sm">{selectedOrderIds.length} Order(s) Selected</span>
            <span className="text-[10px] text-neutral-dark/50 mt-0.5">Apply bulk actions below</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBulkStatusChange('accepted')}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm cursor-pointer"
            >
              Bulk Accept
            </button>
            <button
              onClick={() => handleBulkStatusChange('preparing')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm cursor-pointer"
            >
              Bulk Prepare
            </button>
            <button
              onClick={() => handleBulkStatusChange('dispatched')}
              className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm cursor-pointer"
            >
              Bulk Dispatch
            </button>
            <button
              onClick={() => setSelectedOrderIds([])}
              className="px-3 py-1.5 bg-neutral-light border border-neutral-border text-neutral-dark rounded-xl text-[10px] font-bold uppercase transition-all hover:bg-neutral-light/75 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'pending', 'accepted', 'preparing', 'dispatched', 'picked_up', 'delivered', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`
              px-3.5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap
              ${filterStatus === tab 
                ? 'bg-neutral-dark border-neutral-dark text-white' 
                : 'bg-white border-neutral-border text-neutral-dark opacity-75 hover:bg-neutral-light'}
            `}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : filteredOrders.length === 0 ? (
        <div className="p-8 bg-white border border-neutral-border rounded-3xl text-center text-xs font-semibold text-neutral-dark/40">
          No orders found matching status "{filterStatus}".
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 overflow-y-auto">
          {filteredOrders.map((order) => {
            const isSelected = selectedOrderIds.includes(order.id);
            const verified = isOrderItemsVerified(order);
            
            return (
              <div
                key={order.id}
                className={`bg-white p-4 rounded-3xl border transition-all duration-300 flex flex-col gap-3 shadow-xs text-left ${
                  isSelected ? 'border-primary ring-2 ring-primary/5 bg-primary-light/5' : 'border-neutral-border'
                }`}
              >
                {/* Info */}
                <div className="flex justify-between items-start pb-2 border-b border-neutral-border">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOrder(order.id)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-neutral-border accent-primary cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-neutral-dark">
                        ID: {order.id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">
                        {order.customerName} • {order.customerPhone}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-neutral-dark">
                    {formatPrice(order.total)}
                  </span>
                </div>

                {/* Checklist & Details */}
                <div className="mt-0.5 p-3 bg-neutral-light/30 border border-neutral-border/50 rounded-2xl text-xs flex flex-col gap-2">
                  <span className="text-[9px] font-black text-neutral-dark/45 uppercase tracking-wider block mb-1">
                    Items to Pack ({['accepted', 'preparing'].includes(order.status) ? 'Verify all to assign rider/dispatch' : 'Details'})
                  </span>
                  <div className="flex flex-col gap-2">
                    {order.items?.map((item) => {
                      const itemId = item.id || item.name;
                      const isChecked = !!verifiedItems[`${order.id}_${itemId}`];
                      const canVerify = ['accepted', 'preparing'].includes(order.status);
                      
                      return (
                        <div key={itemId} className="flex justify-between items-center text-xs font-semibold text-neutral-dark">
                          <div className="flex items-center gap-2">
                            {canVerify ? (
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleVerifyItem(order.id, itemId)}
                                className="w-4 h-4 rounded text-primary focus:ring-primary border-neutral-border accent-primary cursor-pointer transition-all hover:scale-105"
                              />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-dark/30" />
                            )}
                            <span className={isChecked && canVerify ? 'line-through opacity-50 transition-all' : 'transition-all'}>
                              {item.name} <span className="opacity-55 text-[10px]">x {item.quantity}</span>
                            </span>
                          </div>
                          <span className="text-neutral-dark/60 text-[11px] font-medium">{item.weight || '1 Pack'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-neutral-dark/45 font-bold uppercase text-[9px]">Status</span>
                    <span className="capitalize font-bold text-primary">{order.status}</span>
                  </div>

                  {['accepted', 'preparing'].includes(order.status) && riders.length > 0 && (
                    <div className="flex flex-col gap-1 p-2 bg-neutral-light/50 border border-neutral-border/40 rounded-xl mb-1 text-left">
                      <span className="text-[9px] font-bold text-neutral-dark/50 uppercase leading-none">
                        Assign Delivery Rider {!verified && <span className="text-primary font-black">(Verify items first)</span>}
                      </span>
                      <select
                        onChange={(e) => handleAssignRider(order.id, e.target.value)}
                        disabled={!verified}
                        defaultValue=""
                        className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-neutral-border bg-white text-[10px] font-bold text-neutral-dark outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>Select rider to assign...</option>
                        {riders.map((r) => (
                          <option key={r.uid} value={r.uid}>
                            🛵 {r.fullName} ({r.phone || 'No phone'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-1.5 mt-1">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'accepted')}
                        className="py-2 px-1 bg-green-50 hover:bg-green-100 border border-green-200 text-[10px] font-bold text-green-700 rounded-xl transition-all cursor-pointer"
                      >
                        Accept
                      </button>
                    )}
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'preparing')}
                        className="py-2 px-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[10px] font-bold text-indigo-700 rounded-xl transition-all cursor-pointer"
                      >
                        Prepare Cut
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'dispatched')}
                        disabled={!verified}
                        className="py-2 px-1 bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[10px] font-bold text-pink-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Dispatch
                      </button>
                    )}
                    {['pending', 'accepted', 'preparing'].includes(order.status) && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        className="py-2 px-1 bg-red-50 hover:bg-red-100 border border-red-200 text-[10px] font-bold text-red-700 rounded-xl transition-all col-start-3 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    {order.status === 'dispatched' && (
                      <div className="col-span-3 p-2 bg-blue-50 border border-blue-200 text-[10px] text-center text-blue-700 rounded-xl font-bold">
                        Dispatched - Awaiting pickup by rider
                      </div>
                    )}
                    {order.status === 'picked_up' && (
                      <div className="col-span-3 p-2 bg-amber-50 border border-amber-200 text-[10px] text-center text-amber-700 rounded-xl font-bold">
                        Out for Delivery - Rider in transit
                      </div>
                    )}
                    {order.status === 'delivered' && (
                      <div className="col-span-3 p-2 bg-green-50 border border-green-200 text-[10px] text-center text-green-700 rounded-xl font-bold">
                        Order Completed Successfully
                      </div>
                    )}
                    {order.status === 'cancelled' && (
                      <div className="col-span-3 p-2 bg-red-50 border border-red-200 text-[10px] text-center text-red-700 rounded-xl font-bold">
                        Order Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Orders;
