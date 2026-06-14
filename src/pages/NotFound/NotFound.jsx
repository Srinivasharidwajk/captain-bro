import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-neutral-light px-6 flex flex-col items-center justify-center text-center animate-float">
      <span className="text-6xl mb-4">🔍</span>
      <h2 className="text-2xl font-extrabold text-neutral-dark">
        Page Not Found
      </h2>
      <p className="text-xs text-neutral-dark/60 font-semibold mt-1 max-w-[220px]">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => navigate('/home')} className="mt-6" size="sm">
        Go Back Home
      </Button>
    </div>
  );
};
export default NotFound;
