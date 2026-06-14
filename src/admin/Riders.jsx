import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/userService';
import Loader from '../components/common/Loader';
import { FaMotorcycle } from 'react-icons/fa';

export const Riders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const u = await getUsers();
        setRiders(u.filter(x => x.role === 'rider'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRiders();
  }, []);

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20 text-left">
      <div>
        <h2 className="text-lg font-bold text-neutral-dark">Delivery Riders</h2>
        <p className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">List of active riders and status</p>
      </div>

      {loading ? (
        <Loader />
      ) : riders.length === 0 ? (
        <div className="p-8 bg-white border border-neutral-border rounded-3xl text-center text-xs font-semibold text-neutral-dark/40">
          No delivery riders registered.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {riders.map((r) => (
            <div key={r.uid} className="bg-white p-3.5 rounded-2xl border border-neutral-border flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-secondary-light text-secondary-dark flex items-center justify-center text-sm font-bold border border-secondary/15">
                <FaMotorcycle />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-neutral-dark truncate">{r.fullName}</h4>
                <p className="text-[10px] text-neutral-dark/50 font-semibold mt-0.5">{r.email} • {r.phone || 'No phone'}</p>
              </div>
              <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200/50 rounded-full text-[9px] font-bold">
                Active
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Riders;
