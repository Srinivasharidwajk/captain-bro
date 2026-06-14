import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

export const RiderRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loader fullPage={true} />;
  }

  const isRider = currentUser && currentUser.role === 'rider';

  return isRider ? <Outlet /> : <Navigate to="/home" replace={true} />;
};
export default RiderRoute;
