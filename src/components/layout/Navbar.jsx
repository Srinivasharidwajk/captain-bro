import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaShoppingBag, FaHistory, FaUser } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { cartCount } = useCart();
  const { currentUser } = useAuth();
  const location = useLocation();

  // If inside Admin dashboard or Rider dashboard, we might want different navbar or omit bottom bar
  const isAdminPath = location.pathname.startsWith('/admin');
  const isRiderPath = location.pathname.startsWith('/rider');
  const isSplashPath = location.pathname === '/';

  if (isSplashPath) return null;

  if (isAdminPath) {
    return (
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-16 bg-white border-t border-neutral-border flex items-center justify-around z-40">
        <NavLink to="/admin" end className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-semibold ${isActive ? 'text-primary' : 'text-neutral-dark opacity-60'}`}>
          <FaHome className="text-xl" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-semibold ${isActive ? 'text-primary' : 'text-neutral-dark opacity-60'}`}>
          <FaSearch className="text-xl" />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-semibold ${isActive ? 'text-primary' : 'text-neutral-dark opacity-60'}`}>
          <FaHistory className="text-xl" />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/home" className="flex flex-col items-center gap-0.5 text-xs font-semibold text-neutral-dark opacity-60">
          <FaUser className="text-xl text-neutral-dark" />
          <span>Exit Admin</span>
        </NavLink>
      </div>
    );
  }

  if (isRiderPath) {
    return (
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-16 bg-white border-t border-neutral-border flex items-center justify-around z-40">
        <NavLink to="/rider" end className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-semibold ${isActive ? 'text-primary' : 'text-neutral-dark opacity-60'}`}>
          <FaHome className="text-xl" />
          <span>Rider Portal</span>
        </NavLink>
        <NavLink to="/rider/orders" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-semibold ${isActive ? 'text-primary' : 'text-neutral-dark opacity-60'}`}>
          <FaHistory className="text-xl" />
          <span>Deliveries</span>
        </NavLink>
        <NavLink to="/home" className="flex flex-col items-center gap-0.5 text-xs font-semibold text-neutral-dark opacity-60">
          <FaUser className="text-xl text-neutral-dark" />
          <span>Customer App</span>
        </NavLink>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-16 bg-white border-t border-neutral-border flex items-center justify-around z-40">
      <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-semibold ${isActive ? 'text-primary' : 'text-neutral-dark opacity-60'}`}>
        <FaHome className="text-xl" />
        <span>Home</span>
      </NavLink>
      <NavLink to="/products" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-semibold ${isActive ? 'text-primary' : 'text-neutral-dark opacity-60'}`}>
        <FaSearch className="text-xl" />
        <span>Browse</span>
      </NavLink>
      <NavLink to="/cart" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-semibold relative ${isActive ? 'text-primary' : 'text-neutral-dark opacity-60'}`}>
        <FaShoppingBag className="text-xl" />
        <span>Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </NavLink>
      <NavLink to="/orders" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-semibold ${isActive ? 'text-primary' : 'text-neutral-dark opacity-60'}`}>
        <FaHistory className="text-xl" />
        <span>Orders</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-semibold ${isActive ? 'text-primary' : 'text-neutral-dark opacity-60'}`}>
        <FaUser className="text-xl" />
        <span>Profile</span>
      </NavLink>
    </div>
  );
};
export default Navbar;
