import React, { useState } from 'react';
import DashboardNotifications from './DashboardNotifications';

const DashboardNav = ({ activeTab, setActiveTab, onLogout, usuarioActual, onSearchTicket, notifications, onNotificationClick, onMarkNotificationAsRead, onClearAllNotifications }) => {
  const esAdmin = usuarioActual?.tipo === 'administrador';
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchTicket(searchTerm.trim());
      setSearchTerm('');
    }
  };

  const baseButtonClasses = "py-2 md:py-4 px-3 md:px-6 font-medium text-sm focus:outline-none transition-colors duration-200";
  const activeButtonClasses = "text-black border-b-2 border-black";
  const inactiveButtonClasses = "text-gray-500 hover:text-black hover:border-b-2 hover:border-blue-300";

  return (
    <nav className="flex flex-col md:flex-row border-b border-gray-200 p-4 md:p-0">
      <div className="flex flex-grow">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`${baseButtonClasses} ${activeTab === 'inicio' ? activeButtonClasses : inactiveButtonClasses}`}
        >
          Inicio
        </button>
        <button
          onClick={() => setActiveTab('crear')}
          className={`${baseButtonClasses} ${activeTab === 'crear' ? activeButtonClasses : inactiveButtonClasses}`}
        >
          Crear Ticket
        </button>
        <button
          onClick={() => setActiveTab('ver')}
          className={`${baseButtonClasses} ${activeTab === 'ver' ? activeButtonClasses : inactiveButtonClasses}`}
        >
          Ver Tickets
        </button>
        {esAdmin && (
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`${baseButtonClasses} ${activeTab === 'usuarios' ? activeButtonClasses : inactiveButtonClasses}`}
          >
            Usuarios
          </button>
        )}
      </div>
      
      <div className="flex flex-col items-end justify-center mt-4 md:mt-0 md:ml-auto space-y-1 pr-4 py-2">
        {usuarioActual && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Bienvenido</span>
            <span className="text-sm font-semibold text-black">
              {usuarioActual.nombres} {usuarioActual.apellidos}
            </span>
            <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
              usuarioActual.tipo === 'administrador' ? 'bg-purple-100 text-purple-800' :
              usuarioActual.tipo === 'tecnico' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {usuarioActual.tipo}
            </span>
             <DashboardNotifications 
               notifications={notifications}
               onNotificationClick={onNotificationClick}
               onMarkAsRead={onMarkNotificationAsRead}
               onClearAll={onClearAllNotifications} // Corrected prop name
             />
          </div>
        )}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ticket por ID (TK...)"
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="ml-2 px-3 py-1 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
            >
              Buscar
            </button>
          </form>
          <button
            onClick={onLogout}
            className="py-2 px-4 font-medium text-sm text-gray-500 hover:text-gray-900 focus:outline-none transition-colors duration-200"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;

// DONE