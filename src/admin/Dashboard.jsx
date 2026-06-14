import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import { getUsers } from '../services/userService';
import { formatPrice } from '../utils/formatPrice';
import { FaBoxes, FaMotorcycle, FaUsers, FaCoins } from 'react-icons/fa';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, changeStatus } = useContext(OrderContext);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    fetchOrders();
    const fetchUsers = async () => {
      const u = await getUsers();
      setUsersCount(u.length);
    };
    fetchUsers();
  }, []);

  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status === 'delivered')
      .reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter(o => ['pending', 'accepted', 'preparing', 'dispatched'].includes(o.status));
  }, [orders]);

  const chartData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push({ dateString, label, revenue: 0 });
    }

    orders.forEach(o => {
      if (o.status === 'delivered' && o.createdAt) {
        const orderDate = o.createdAt.split('T')[0];
        const dayObj = last7Days.find(d => d.dateString === orderDate);
        if (dayObj) {
          dayObj.revenue += o.total;
        }
      }
    });

    return last7Days;
  }, [orders]);

  const maxRevenue = useMemo(() => {
    const maxVal = Math.max(...chartData.map(d => d.revenue));
    return maxVal === 0 ? 1000 : maxVal * 1.1;
  }, [chartData]);

  const svgPoints = useMemo(() => {
    return chartData.map((d, index) => {
      const x = 30 + (index * 56);
      const y = 110 - ((d.revenue / maxRevenue) * 90);
      return { x, y };
    });
  }, [chartData, maxRevenue]);

  const pathD = useMemo(() => {
    if (svgPoints.length === 0) return '';
    return svgPoints.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  }, [svgPoints]);

  const areaD = useMemo(() => {
    if (svgPoints.length === 0) return '';
    return `${pathD} L ${svgPoints[svgPoints.length - 1].x} 110 L ${svgPoints[0].x} 110 Z`;
  }, [svgPoints, pathD]);

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20 text-left">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h2 className="text-lg font-bold text-neutral-dark">Admin Control Panel</h2>
          <p className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">Real-time statistics & store logistics</p>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-neutral-border flex flex-col gap-1">
          <FaCoins className="text-primary text-base" />
          <span className="text-[10px] font-bold text-neutral-dark/40 uppercase">Revenue</span>
          <span className="text-lg font-black text-neutral-dark leading-none">{formatPrice(totalRevenue)}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-border flex flex-col gap-1">
          <FaBoxes className="text-secondary-dark text-base" />
          <span className="text-[10px] font-bold text-neutral-dark/40 uppercase">Pending</span>
          <span className="text-lg font-black text-neutral-dark leading-none">{pendingOrders.length} orders</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-border flex flex-col gap-1">
          <FaUsers className="text-teal-600 text-base" />
          <span className="text-[10px] font-bold text-neutral-dark/40 uppercase">Users</span>
          <span className="text-lg font-black text-neutral-dark leading-none">{usersCount} profiles</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-border flex flex-col gap-1">
          <FaMotorcycle className="text-pink-600 text-base" />
          <span className="text-[10px] font-bold text-neutral-dark/40 uppercase">Deliveries</span>
          <span className="text-lg font-black text-neutral-dark leading-none">{orders.length} total</span>
        </div>
      </div>

      {/* Weekly Revenue Line Chart */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-border flex flex-col gap-3 shadow-xs">
        <h4 className="text-[10px] font-bold text-neutral-dark/40 uppercase tracking-wider px-1">
          Weekly Revenue Trend
        </h4>
        
        <div className="relative w-full h-[150px] bg-neutral-light/50 rounded-2xl border border-neutral-border/40 p-2 overflow-hidden flex items-center justify-center">
          {maxRevenue === 1000 && chartData.every(d => d.revenue === 0) ? (
            <span className="text-xs font-bold text-neutral-dark/30">No revenue data for the past 7 days</span>
          ) : (
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B0000" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8B0000" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal Grid lines */}
              <line x1="20" y1="20" x2="380" y2="20" stroke="#DEE2E6" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="20" y1="65" x2="380" y2="65" stroke="#DEE2E6" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="20" y1="110" x2="380" y2="110" stroke="#DEE2E6" strokeWidth="0.5" />

              {/* Area path */}
              <path d={areaD} fill="url(#areaGrad)" />

              {/* Line path */}
              <path d={pathD} fill="none" stroke="#8B0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data points */}
              {svgPoints.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="white"
                    stroke="#8B0000"
                    strokeWidth="2"
                    className="hover:r-6 transition-all duration-150 cursor-pointer"
                  />
                  {chartData[i].revenue > 0 && (
                    <text
                      x={p.x}
                      y={p.y - 8}
                      textAnchor="middle"
                      fill="#5C0000"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      ₹{chartData[i].revenue}
                    </text>
                  )}
                </g>
              ))}

              {/* X Axis Labels */}
              {chartData.map((d, i) => (
                <text
                  key={i}
                  x={30 + (i * 56)}
                  y="128"
                  textAnchor="middle"
                  fill="#212529"
                  opacity="0.5"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {d.label}
                </text>
              ))}
            </svg>
          )}
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-border flex flex-col gap-2 shadow-xs">
        <h4 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider mb-1 px-1">
          Quick Links
        </h4>
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-neutral-dark">
          <button onClick={() => navigate('/admin/products')} className="p-3 bg-neutral-light border border-neutral-border rounded-xl active:scale-95 hover:bg-neutral-border/20">
            📦 Manage Catalog
          </button>
          <button onClick={() => navigate('/admin/orders')} className="p-3 bg-neutral-light border border-neutral-border rounded-xl active:scale-95 hover:bg-neutral-border/20">
            🚚 Track Orders
          </button>
          <button onClick={() => navigate('/admin/customers')} className="p-3 bg-neutral-light border border-neutral-border rounded-xl active:scale-95 hover:bg-neutral-border/20">
            👨‍💼 Customers List
          </button>
          <button onClick={() => navigate('/admin/riders')} className="p-3 bg-neutral-light border border-neutral-border rounded-xl active:scale-95 hover:bg-neutral-border/20">
            🛵 Riders List
          </button>
        </div>
      </div>

      {/* Recent Orders Tracker */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-neutral-dark">Recent Active Orders</h3>
        {pendingOrders.length === 0 ? (
          <div className="p-5 bg-white rounded-3xl border border-neutral-border text-center text-xs font-semibold text-neutral-dark/40">
            All caught up! No active orders.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {pendingOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="bg-white p-3.5 rounded-2xl border border-neutral-border flex justify-between items-center text-xs font-semibold text-neutral-dark">
                <div className="flex flex-col">
                  <span>ID: {order.id.slice(-6).toUpperCase()}</span>
                  <span className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">{order.customerName}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200/50 uppercase">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
