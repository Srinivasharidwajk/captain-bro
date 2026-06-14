import React from 'react';
import { FaTimes } from 'react-icons/fa';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-dark/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className={`
        bg-white rounded-lg w-full max-w-[400px] overflow-hidden shadow-2xl z-10 transform transition-all duration-300 relative border border-neutral-border
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-border">
          <h3 className="text-lg font-bold text-neutral-dark">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-dark opacity-60 hover:opacity-100 hover:bg-neutral-light transition-all"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;
