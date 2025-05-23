import React, { useState, useEffect } from 'react';

const UIAlert = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
    }, 800); // Iniciar desvanecimiento antes de 1 segundo

    const hideTimer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, 1000); // Ocultar completamente después de 1 segundo

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

  if (!visible || !message) return null;

  const baseClasses = "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg shadow-lg text-white flex items-center space-x-2 z-50 transition-opacity duration-200 ease-out";
  const typeClasses = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  };

  return (
    <div 
      className={`${baseClasses} ${typeClasses[type || 'info']}`}
      style={{ opacity: opacity }}
    >
      <span>{message}</span>
      <button onClick={() => setOpacity(0)} className="ml-auto focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default UIAlert;

// DONE