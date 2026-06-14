import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { FaUserCircle, FaEnvelope, FaPhone, FaShieldAlt, FaMotorcycle, FaSignOutAlt, FaMapMarkerAlt } from 'react-icons/fa';

export const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex-1 bg-neutral-light px-6 flex flex-col items-center justify-center text-center">
        <FaUserCircle className="text-5xl text-neutral-dark/30 mb-4" />
        <h3 className="text-base font-bold text-neutral-dark">
          Access Denied
        </h3>
        <p className="text-xs text-neutral-dark/60 font-semibold mt-1">
          Please log in to view and manage your profile details.
        </p>
        <Button onClick={() => navigate('/login')} className="mt-5" size="sm">
          Go to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-neutral-light px-4 py-5 flex flex-col gap-4 pb-20 text-left">
      {/* Header Profile Info */}
      <div className="bg-white p-5 rounded-lg border border-neutral-border flex items-center gap-4 shadow-sm">
        <div className="text-5xl text-primary animate-pulse">
          <FaUserCircle />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-neutral-dark leading-tight truncate">
            {currentUser.fullName || 'Happy Customer'}
          </h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 bg-primary-light text-primary text-[9px] font-bold rounded uppercase tracking-wider border border-primary/10">
            {currentUser.role || 'Customer'}
          </span>
        </div>
      </div>

      {/* Account Details Box */}
      <div className="bg-white p-5 rounded-lg border border-neutral-border flex flex-col gap-4 shadow-sm">
        <h4 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider">
          Account Details
        </h4>

        <div className="flex flex-col gap-3.5 text-xs font-semibold text-neutral-dark/80">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-primary text-sm" />
            <div className="flex flex-col">
              <span className="text-[9px] text-neutral-dark/45 font-bold uppercase leading-none">Email Address</span>
              <span className="mt-0.5">{currentUser.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaPhone className="text-primary text-sm" />
            <div className="flex flex-col">
              <span className="text-[9px] text-neutral-dark/45 font-bold uppercase leading-none">Phone Number</span>
              <span className="mt-0.5">{currentUser.phone || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Addresses Panel */}
      <div className="bg-white p-5 rounded-lg border border-neutral-border flex flex-col gap-4 shadow-sm">
        <h4 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider">
          Saved Information
        </h4>

        <button
          onClick={() => navigate('/addresses')}
          className="flex items-center justify-between p-3.5 bg-neutral-light hover:bg-neutral-border/20 rounded-md border border-neutral-border text-xs font-bold text-neutral-dark transition-all active:scale-95"
        >
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-primary text-base" />
            <span>Manage Delivery Addresses</span>
          </div>
          <span className="text-neutral-dark/40">→</span>
        </button>
      </div>

      {/* Admin or Rider Shortcuts */}
      {(currentUser.role === 'admin' || currentUser.role === 'rider') && (
        <div className="bg-white p-5 rounded-lg border border-neutral-border flex flex-col gap-3 shadow-sm">
          <h4 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider">
            Portal Shortcuts
          </h4>
          
          <div className="flex flex-col gap-2">
            {currentUser.role === 'admin' && (
              <Button onClick={() => navigate('/admin')} className="w-full flex gap-2">
                <FaShieldAlt />
                <span>Go to Admin Dashboard</span>
              </Button>
            )}
            {currentUser.role === 'rider' && (
              <Button onClick={() => navigate('/rider')} variant="secondary" className="w-full flex gap-2">
                <FaMotorcycle />
                <span>Go to Rider Dashboard</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Log Out Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-auto py-3 bg-red-50 hover:bg-primary-light text-primary font-bold rounded-lg text-xs transition-all border border-primary/10 flex items-center justify-center gap-2 active:scale-95"
      >
        <FaSignOutAlt />
        <span>Log Out Account</span>
      </button>
    </div>
  );
};
export default Profile;
