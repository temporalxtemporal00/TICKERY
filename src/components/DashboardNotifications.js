import React, { useState, useEffect, useRef } from 'react';

const DashboardNotifications = ({ notifications, onNotificationClick, onMarkAsRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // Nuevo estado para la animación de cierre
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.read).length);
  const dropdownRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose(); // Usar la función de cierre animado
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOpen = () => {
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Duración de la animación (0.3s)
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
    handleClose(); // Usar la función de cierre animado
  };

  const handleClearAll = () => {
    onClearAll();
    handleClose(); // Usar la función de cierre animado
  };

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      handleClose(); // Usar la función de cierre animado
    }, 500); // 0.5 segundos de retraso
  };

  const visibleNotifications = notifications.slice(0, 6); // Mostrar solo las primeras 6

  return (
    <div className="relative" ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        onClick={() => isOpen ? handleClose() : handleOpen()} // Usar funciones de abrir/cerrar
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 transition-opacity duration-300 ease-out ${isClosing ? 'opacity-0' : 'opacity-100'}`} // Added transition classes
          style={{ pointerEvents: isClosing ? 'none' : 'auto' }} // Disable pointer events while closing
        >
          <div className="py-2 max-h-64 overflow-y-auto">
            <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">Notificaciones</div>
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No hay notificaciones.</div>
            ) : (
              visibleNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`block w-full text-left px-4 py-3 text-sm border-b hover:bg-gray-100 focus:outline-none ${notification.read ? 'text-gray-500 bg-gray-50' : 'text-gray-700 font-medium bg-blue-50'}`}
                >
                  {notification.message}
                  {notification.description && (
                    <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                </button>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t">
              <button
                onClick={handleClearAll}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                Limpiar Notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardNotifications;

// DONE