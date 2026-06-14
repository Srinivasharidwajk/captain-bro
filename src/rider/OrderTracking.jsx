import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import { formatPrice } from '../utils/formatPrice';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { FaPhone, FaMapMarkerAlt, FaCheckCircle, FaClipboardList, FaTruck } from 'react-icons/fa';
import { updateOrderTrackingDb } from '../firebase/firestore';
import DeliveryMap from '../components/common/DeliveryMap';

const ROUTE_PATH = [
  { lat: 17.9689, lng: 79.5941 }, // Chowrasta Restaurant
  { lat: 17.9730, lng: 79.5910 },
  { lat: 17.9780, lng: 79.5870 },
  { lat: 17.9830, lng: 79.5830 },
  { lat: 17.9880, lng: 79.5790 },
  { lat: 17.9920, lng: 79.5750 },
  { lat: 17.9960, lng: 79.5710 },
  { lat: 18.0000, lng: 79.5680 },
  { lat: 18.0040, lng: 79.5650 },
  { lat: 18.0076, lng: 79.5623 }  // Hanamkonda Customer
];

export const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, fetchOrders, changeStatus } = useContext(OrderContext);
  const [order, setOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [riderCoords, setRiderCoords] = useState(ROUTE_PATH[0]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [arrived, setArrived] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheckItem = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isAllItemsChecked = () => {
    if (!order || !order.items || order.items.length === 0) return true;
    return order.items.every((_, idx) => checkedItems[idx]);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const o = orders.find((ord) => ord.id === id);
    if (o) setOrder(o);
  }, [orders, id]);

  // Synchronize start or completed states
  useEffect(() => {
    if (!order) return;
    if (order.status === 'dispatched') {
      setRiderCoords(ROUTE_PATH[0]);
      setRouteIndex(0);
      setArrived(false);
    } else if (order.status === 'delivered') {
      setRiderCoords(ROUTE_PATH[ROUTE_PATH.length - 1]);
      setRouteIndex(ROUTE_PATH.length - 1);
      setArrived(true);
    } else if (order.status === 'picked_up' && routeIndex === 0) {
      // If refreshed while delivering, start at beginning
      setRiderCoords(ROUTE_PATH[0]);
    }
  }, [order?.status]);

  const getLiveLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation access failed or denied. Falling back to simulation.', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  // Route simulation cycle when marked picked_up
  useEffect(() => {
    if (!order || order.status !== 'picked_up') return;

    const interval = setInterval(async () => {
      if (routeIndex >= ROUTE_PATH.length - 1) {
        setArrived(true);
        clearInterval(interval);
        return;
      }

      const nextIndex = routeIndex + 1;
      setRouteIndex(nextIndex);
      
      let coords = ROUTE_PATH[nextIndex];
      const liveCoords = await getLiveLocation();
      if (liveCoords) {
        console.log('Using real rider GPS coordinate:', liveCoords);
        coords = liveCoords;
      } else {
        console.log('Using simulated coordinate:', coords);
      }
      
      setRiderCoords(coords);

      try {
        await updateOrderTrackingDb(order.id, coords.lat, coords.lng, 'picked_up');
      } catch (err) {
        console.error('Failed to update tracking location: ', err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [order?.status, routeIndex]);

  if (!order) return <Loader fullPage={true} />;

  const handlePickUpOrder = async () => {
    setSubmitting(true);
    try {
      await changeStatus(order.id, 'picked_up');
      let coords = ROUTE_PATH[0];
      const liveCoords = await getLiveLocation();
      if (liveCoords) {
        coords = liveCoords;
      }
      await updateOrderTrackingDb(order.id, coords.lat, coords.lng, 'picked_up');
      alert('Order marked as Picked Up! You are now in transit.');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteDelivery = async () => {
    setSubmitting(true);
    try {
      await changeStatus(order.id, 'delivered');
      // Mark delivered in tracking as well
      await updateOrderTrackingDb(order.id, ROUTE_PATH[ROUTE_PATH.length - 1].lat, ROUTE_PATH[ROUTE_PATH.length - 1].lng, 'delivered');
      alert('Delivery completed successfully! Great job.');
      navigate('/rider');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20 text-left">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h2 className="text-lg font-bold text-neutral-dark">Job details</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] text-neutral-dark/50 font-semibold">ORDER: {order.id.slice(-6).toUpperCase()}</p>
            <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full border ${
              order.status === 'dispatched' ? 'bg-blue-50 text-blue-600 border-blue-200' :
              order.status === 'picked_up' ? 'bg-amber-50 text-amber-600 border-amber-200' :
              order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-200' :
              'bg-neutral-light text-neutral-dark border-neutral-border'
            }`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <Button onClick={() => navigate('/rider/orders')} variant="outline" size="sm" className="py-1.5 px-3 text-xs">
          Back
        </Button>
      </div>

      {/* Live Map Card */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-border shadow-sm flex flex-col gap-3">
        <h4 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider px-1">
          Live Tracking Map
        </h4>
        <DeliveryMap 
          riderLat={riderCoords.lat}
          riderLng={riderCoords.lng}
          status={order.status}
        />
        {order.status === 'picked_up' && (
          <div className="flex justify-between items-center text-[10px] font-bold text-neutral-dark opacity-75 px-1 mt-0.5">
            <span>Route Progress: {Math.round((routeIndex / (ROUTE_PATH.length - 1)) * 100)}%</span>
            <span className={arrived ? 'text-green-600' : 'text-[#8B0000] animate-pulse'}>
              {arrived ? 'Arrived at Location' : 'Delivering...'}
            </span>
          </div>
        )}
      </div>

      {/* Customer Info Card */}
      <div className="bg-white p-5 rounded-3xl border border-neutral-border flex flex-col gap-4 shadow-sm">
        <h4 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider">
          Customer Details
        </h4>
        
        <div className="flex flex-col gap-3 text-xs font-semibold text-neutral-dark/80">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-border">
            <span className="text-neutral-dark/50">Name</span>
            <span className="font-bold text-neutral-dark">{order.customerName}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-neutral-border">
            <span className="text-neutral-dark/50">Phone</span>
            <a href={`tel:${order.customerPhone}`} className="text-primary font-bold flex items-center gap-1 hover:underline">
              <FaPhone /> {order.customerPhone}
            </a>
          </div>

          <div className="flex flex-col gap-1 items-start">
            <span className="text-[9px] text-neutral-dark/45 font-bold uppercase leading-none mb-1">Delivery Address</span>
            <div className="flex gap-2 items-start mt-0.5">
              <FaMapMarkerAlt className="text-primary mt-0.5" />
              <span>{order.address}</span>
            </div>
            {order.landmark && (
              <span className="text-[10px] text-neutral-dark/50 ml-6 mt-0.5">
                Landmark: {order.landmark}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Items Summary Card */}
      <div className="bg-white p-5 rounded-3xl border border-neutral-border flex flex-col gap-3.5 shadow-sm">
        <h4 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider">
          Items to Deliver ({order.status === 'dispatched' ? 'Check off items on pickup' : 'Details'})
        </h4>

        <div className="flex flex-col gap-2.5">
          {order.items?.map((item, index) => {
            const isChecked = !!checkedItems[index];
            const isPendingPickup = order.status === 'dispatched';
            
            return (
              <div key={index} className="flex justify-between items-center text-xs font-semibold text-neutral-dark">
                <div className="flex items-center gap-2">
                  {isPendingPickup ? (
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheckItem(index)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-neutral-border accent-primary cursor-pointer"
                    />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                  <span className={isChecked && isPendingPickup ? 'line-through opacity-50' : ''}>
                    {item.name} <span className="opacity-55 text-[10px]">x {item.quantity}</span>
                  </span>
                </div>
                <span>{item.weight || '1 Pack'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-auto pt-4 flex flex-col gap-3">
        {order.status === 'dispatched' && (
          <>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-800 font-semibold flex items-center gap-2">
              <FaTruck className="text-base text-blue-600 animate-bounce" />
              <span>Please pick up the food packages from the kitchen.</span>
            </div>
            {!isAllItemsChecked() && (
              <span className="text-[10px] text-[#8B0000] font-bold px-1 text-center -mt-1 mb-1">
                ⚠️ Verify and check off all items to enable pickup
              </span>
            )}
            <Button 
              onClick={handlePickUpOrder} 
              loading={submitting} 
              disabled={!isAllItemsChecked()}
              className="w-full flex gap-2 justify-center items-center py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTruck />
              <span>Mark as Picked Up</span>
            </Button>
          </>
        )}

        {order.status === 'picked_up' && (
          <>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 font-semibold flex items-center gap-2">
              <FaClipboardList className="text-base text-amber-600" />
              <span>Please collect cash of {formatPrice(order.total)} from the client on delivery (COD).</span>
            </div>
            <Button onClick={handleCompleteDelivery} loading={submitting} className="w-full flex gap-2 justify-center items-center py-3.5 bg-green-600 hover:bg-green-700">
              <FaCheckCircle />
              <span>Mark as Delivered</span>
            </Button>
          </>
        )}

        {order.status === 'delivered' && (
          <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-xs text-green-800 font-semibold flex items-center justify-center gap-2">
            <FaCheckCircle className="text-base text-green-600" />
            <span>Order Completed successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default OrderTracking;
