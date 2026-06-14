import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';

export const Header = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('current_delivery_location')) || { addressLine: 'Warangal City, TG', type: 'Default' };
    } catch {
      return { addressLine: 'Warangal City, TG', type: 'Default' };
    }
  });

  useEffect(() => {
    const handleLocationChange = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('current_delivery_location'));
        if (stored) {
          setDeliveryLocation(stored);
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('location_changed', handleLocationChange);
    return () => window.removeEventListener('location_changed', handleLocationChange);
  }, []);

  const isMainPage = ['/home', '/orders', '/profile', '/admin', '/rider'].includes(location.pathname);
  const isSplashPage = location.pathname === '/';

  if (isSplashPage) return null;

  return (
    <div className="h-16 bg-white border-b border-neutral-border flex items-center justify-between px-4 z-40 sticky top-0">
      <div className="flex items-center gap-3">
        {!isMainPage && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full text-neutral-dark hover:bg-neutral-light transition-all"
          >
            <FaArrowLeft className="text-lg" />
          </button>
        )}
        
        {isMainPage && location.pathname === '/home' ? (
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              DELIVER TO ({deliveryLocation.type || 'Default'})
            </span>
            <div className="flex items-center gap-1 -mt-0.5 max-w-[190px]">
              <FaMapMarkerAlt className="text-primary text-xs flex-shrink-0" />
              <span className="text-sm font-bold text-neutral-dark truncate" title={deliveryLocation.addressLine}>
                {deliveryLocation.addressLine || 'Warangal City, TG'}
              </span>
            </div>
          </div>
        ) : (
          <h1 className="text-lg font-bold text-neutral-dark capitalize">
            {title || location.pathname.substring(1).replace('/', ' - ') || 'App'}
          </h1>
        )}
      </div>

      <div>
        {location.pathname !== '/cart' && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/rider') && (
          <button
            onClick={() => navigate('/cart')}
            className="p-2 rounded-full text-neutral-dark hover:bg-neutral-light relative transition-all"
          >
            <FaShoppingBag className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
export default Header;
