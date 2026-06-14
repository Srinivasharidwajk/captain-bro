import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../../components/common/Button';
import { FaCheckCircle } from 'react-icons/fa';

export const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="flex-1 bg-neutral-light px-6 py-10 flex flex-col justify-center gap-6 items-center text-center">
      {/* Icon */}
      <div className="text-6xl text-green-500 animate-float">
        <FaCheckCircle className="mx-auto" />
      </div>

      {/* Message */}
      <div>
        <h2 className="text-2xl font-extrabold text-neutral-dark">
          Order Placed!
        </h2>
        <p className="text-xs font-semibold text-neutral-dark opacity-60 mt-1">
          Your order is being processed and prepared for packaging.
        </p>
      </div>

      {/* Summary Card */}
      {order && (
        <div className="bg-white p-5 rounded-lg border border-neutral-border w-full flex flex-col gap-3.5 shadow-sm text-left">
          <div className="flex justify-between items-center pb-2.5 border-b border-neutral-border text-xs font-semibold">
            <span className="text-neutral-dark/50">ORDER ID</span>
            <span className="font-bold text-neutral-dark">{order.id}</span>
          </div>

          <div className="flex flex-col gap-2 text-xs font-semibold text-neutral-dark/80">
            <div className="flex justify-between">
              <span>Items Count</span>
              <span>{order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0} items</span>
            </div>
            <div className="flex justify-between">
              <span>Address</span>
              <span className="truncate max-w-[180px]">{order.address}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Est.</span>
              <span className="text-primary font-bold">15 - 25 mins</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2.5 border-t border-neutral-border">
            <span className="text-xs font-bold text-neutral-dark">Paid amount</span>
            <span className="text-base font-extrabold text-neutral-dark">{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="w-full flex flex-col gap-2 mt-4">
        <Button onClick={() => navigate('/orders')} className="w-full">
          Track Active Order
        </Button>
        <Button onClick={() => navigate('/home')} variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};
export default OrderSuccess;
