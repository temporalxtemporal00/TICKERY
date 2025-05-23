import React, { useState, useEffect } from 'react';
import AuthLayout from './components/AuthLayout';
import AuthLoginForm from './components/AuthLoginForm';
import DashboardNav from './components/DashboardNav';
import DashboardInicio from './components/DashboardInicio';
import DashboardCrearTicket from './components/DashboardCrearTicket';
import DashboardVerTickets from './components/DashboardVerTickets';
import DashboardGestionUsuarios from './components/DashboardGestionUsuarios';
import LayoutFooter from './components/LayoutFooter';
import UIAlert from './components/UI/UIAlert';
import { getValidUser, addUser, updateUser, deleteUser, getUsers } from './mock/users';
import { addTicket, getTickets, updateTicket, deleteTicket, findTickets } from './mock/tickets';
import { getStorage, setStorage } from './utils/storage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(getStorage('isAuthenticated', false));
  const [activeTab, setActiveTab] = useState(getStorage('activeTab', 'inicio'));
  const [tickets, setTickets] = useState(getTickets());
  const [usuarios, setUsuarios] = useState([]); // Fetch users from API for login
  const [usuarioActual, setUsuarioActual] = useState(getStorage('usuarioActual', null));
  const [ticketsBuscados, setTicketsBuscados] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtroVerTickets, setFiltroVerTickets] = useState(null);
  const [userNotifications, setUserNotifications] = useState(getStorage('userNotifications', {}));
  const [loadingUsersForLogin, setLoadingUsersForLogin] = useState(true); // New state for loading users for login

  // Fetch users for login when the app starts
  useEffect(() => {
    const fetchUsersForLogin = async () => {
      try {
        const response = await fetch('http://3.141.29.220:5000/api/consulta_usuario');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Map API data to match expected structure for login validation
        const mappedUsers = data.map(user => ({
          ...user,
          username: user.usuario,
          password: user.contrasena,
          id: user.dni // Use DNI as ID for consistency if API doesn't provide one
        }));
        setUsuarios(mappedUsers);
      } catch (error) {
        console.error("Error fetching users for login:", error);
        showAlert("Error al cargar usuarios para login. No se podrá iniciar sesión.", 'error');
      } finally {
        setLoadingUsersForLogin(false);
      }
    };

    fetchUsersForLogin();
  }, []); // Run once on mount

  useEffect(() => {
    setStorage('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    setStorage('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    setStorage('usuarioActual', usuarioActual);
  }, [usuarioActual]);

  useEffect(() => {
    setStorage('userNotifications', userNotifications);
  }, [userNotifications]);

  const addNotification = (message, description, ticketId, recipientIds = []) => {
    const newNotification = {
      message,
      description,
      ticketId,
      timestamp: new Date(),
      id: Date.now() + Math.random(),
      read: false,
    };

    setUserNotifications(prev => {
      const newState = { ...prev };
      recipientIds.forEach(userId => {
        if (!newState[userId]) {
          newState[userId] = [];
        }
        newState[userId] = [newNotification, ...newState[userId]];
      });
      return newState;
    });
  };

  const markNotificationAsRead = (notificationId) => {
    if (!usuarioActual) return;

    setUserNotifications(prev => {
      const newState = { ...prev };
      const userId = usuarioActual.id;
      if (newState[userId]) {
        newState[userId] = newState[userId].map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
      }
      return newState;
    });
  };

  const clearAllNotifications = () => {
    if (!usuarioActual) return;

    setUserNotifications(prev => {
      const newState = { ...prev };
      const userId = usuarioActual.id;
      newState[userId] = [];
      return newState;
    });
  };


  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const handleLogin = ({ username, password }) => {
    if (loadingUsersForLogin) {
        showAlert("Cargando usuarios para login, por favor espera.", 'info');
        return;
    }
    // Use fetched users for login validation
    const user = usuarios.find(user => 
        user.username === username && user.password === password
    );

    if (user) {
      setIsAuthenticated(true);
      setUsuarioActual(user);
      // Inicializar notificaciones para el usuario si no existen
      if (!userNotifications[user.id]) {
          setUserNotifications(prev => ({ ...prev, [user.id]: [] }));
      }
    } else {
      showAlert('Credenciales incorrectas o usuario no encontrado.', 'error');
    }
  };

  const handleCrearTicket = (ticket) => {
    const newTicket = addTicket(ticket);
    setTickets(getTickets());
    showAlert('Ticket creado exitosamente.', 'success');
    
    const adminUsers = usuarios.filter(u => u.tipo === 'administrador');
    const recipientIds = adminUsers.map(u => u.id);
    if (newTicket[newTicket.length - 1].tecnico) {
        recipientIds.push(newTicket[newTicket.length - 1].tecnico.id);
    }
    if (newTicket[newTicket.length - 1].cliente) {
        recipientIds.push(newTicket[newTicket.length - 1].cliente.id);
    }

    addNotification(
        `Nuevo ticket creado: ${newTicket[newTicket.length - 1].id}`,
        `Cliente: ${newTicket[newTicket.length - 1].cliente.nombre}`,
        newTicket[newTicket.length - 1].id,
        recipientIds
    );
  };

  const handleUpdateTicket = (id, updates) => {
    const oldTicket = tickets.find(t => t.id === id);
    updateTicket(id, updates);
    setTickets(getTickets());
    showAlert('Ticket actualizado exitosamente.', 'success');
    
    let description = 'Ticket actualizado.';
    if (oldTicket && updates.estado && oldTicket.estado !== updates.estado) {
        description = `Estado cambiado a: ${updates.estado}`;
    } else if (oldTicket && updates.tecnico && oldTicket.tecnico?.id !== updates.tecnico.id) {
        description = `Asignado a: ${updates.tecnico.nombre}`;
    } else if (oldTicket && updates.prioridad && oldTicket.prioridad !== updates.prioridad) {
        description = `Prioridad cambiada a: ${updates.prioridad}`;
    } else if (updates.notas && updates.notas.length > (oldTicket?.notas?.length || 0)) {
        description = `Nueva nota agregada.`;
    }

    const updatedTicket = findTickets(id)[0];
    const adminUsers = usuarios.filter(u => u.tipo === 'administrador');
    const recipientIds = adminUsers.map(u => u.id);
    if (updatedTicket?.tecnico) {
        recipientIds.push(updatedTicket.tecnico.id);
    }
    if (updatedTicket?.cliente) {
        recipientIds.push(updatedTicket.cliente.id);
    }


    addNotification(
        `Ticket ${id} actualizado.`,
        description,
        id,
        recipientIds
    );
  };

  const handleEliminarTicket = (id) => {
    deleteTicket(id);
    setTickets(getTickets());
    showAlert('Ticket eliminado exitosamente.', 'success');
    
    const adminUsers = usuarios.filter(u => u.tipo === 'administrador');
    const recipientIds = adminUsers.map(u => u.id);
    // In a real scenario, you might notify the client and technician as well,
    // but you'd need the ticket data *before* deletion.
    // For this mock, only admin is notified of deletion.

    addNotification(
        `Ticket ${id} eliminado.`,
        'Este ticket ya no existe.',
        null,
        recipientIds
    );
  };

  const handleCrearUsuario = (usuario) => {
    // Creation is handled by API call in component
    // setUsuarios(getUsers()); // Refresh users from API is handled in component
    // showAlert is handled within DashboardGestionUsuarios
  };

  const handleActualizarUsuario = (id, updates) => {
    // updateUser(id, updates); // Update is handled by API call in component
    // setUsuarios(getUsers()); // Refresh users from API is handled in component
    // showAlert is handled within DashboardGestionUsuarios
  };

  const handleEliminarUsuario = (id) => {
    // deleteUser(id); // Deletion is handled by API call in component
    // setUsuarios(getUsers()); // Refresh users from API is handled in component
    // showAlert is handled within DashboardGestionUsuarios
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('inicio');
    setUsuarioActual(null);
    setTicketsBuscados(null);
    setFiltroVerTickets(null);
    // setNotifications([]); // Removed clearing notifications on logout
    showAlert('Sesión cerrada.', 'info');
  };

  const handleSearchTickets = (term) => {
    const foundTickets = findTickets(term);
    if (foundTickets.length > 0) {
      setTicketsBuscados(foundTickets);
      setActiveTab('ver');
      setFiltroVerTickets(null);
      showAlert(`${foundTickets.length} ticket(s) encontrado(s).`, 'success');
    } else {
      showAlert(`No se encontraron tickets para "${term}".`, 'warning');
      setTicketsBuscados([]);
    }
  };

  const handleSetActiveTab = (tab) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      if (tab === 'ver') {
        setTicketsBuscados(null);
      } else {
         setFiltroVerTickets(null);
         setTicketsBuscados(null);
      }
      setLoading(false);
    }, 100);
  };

  const handleFilterTicketsFromGraph = (filters) => {
    setFiltroVerTickets(filters);
    handleSetActiveTab('ver');
  };

  const getVisibleNotifications = () => {
    if (!usuarioActual) return [];
    return userNotifications[usuarioActual.id] || [];
  };

  const handleNotificationClick = (notification) => {
    if (notification.ticketId) {
      const foundTicket = findTickets(notification.ticketId)[0];
      if (foundTicket) {
        setTicketsBuscados([foundTicket]);
        setActiveTab('ver');
        setFiltroVerTickets(null);
      } else {
        showAlert(`Ticket con ID "${notification.ticketId}" no encontrado.`, 'warning');
      }
      markNotificationAsRead(notification.id);
    }
  };


  return (
    <div className="App flex flex-col min-h-screen">
      {!isAuthenticated ? (
        <AuthLayout>
          <AuthLoginForm onLogin={handleLogin} disabled={loadingUsersForLogin} /> {/* Disable form while loading users */}
          {loadingUsersForLogin && (
            <div className="text-center text-sm text-gray-500 mt-4">
              Cargando usuarios para login...
            </div>
          )}
        </AuthLayout>
      ) : (
        <div className="flex flex-col flex-grow bg-gray-50">
          <DashboardNav 
            activeTab={activeTab} 
            setActiveTab={handleSetActiveTab} 
            onLogout={handleLogout}
            usuarioActual={usuarioActual}
            onSearchTicket={handleSearchTickets}
            notifications={getVisibleNotifications()}
            onNotificationClick={handleNotificationClick}
            onMarkNotificationAsRead={markNotificationAsRead}
            onClearAllNotifications={clearAllNotifications}
          />
          <div className="flex-grow">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Cargando...</p>
              </div>
            ) : (
              <>
                {activeTab === 'inicio' && <DashboardInicio tickets={tickets} usuarioActual={usuarioActual} usuarios={usuarios} onFilterTickets={handleFilterTicketsFromGraph} />}
                {activeTab === 'crear' && (
                  <DashboardCrearTicket 
                    onCrearTicket={handleCrearTicket} 
                    usuarios={usuarios}
                    usuarioActual={usuarioActual}
                  />
                )}
                {activeTab === 'ver' && (
                  <DashboardVerTickets 
                    tickets={tickets} 
                    onUpdateTicket={handleUpdateTicket}
                    onEliminarTicket={handleEliminarTicket}
                    usuarios={usuarios}
                    usuarioActual={usuarioActual}
                    ticketsBuscados={ticketsBuscados}
                    setTicketsBuscados={setTicketsBuscados}
                    filtroInicial={filtroVerTickets}
                  />
                )}
                {activeTab === 'usuarios' && usuarioActual?.tipo === 'administrador' && (
                  <DashboardGestionUsuarios 
                    showAlert={showAlert} 
                    // Remove passing users and user handlers from App.js
                    // The component will fetch and manage its own user list
                  />
                )}
              </>
            )}
          </div>
          <LayoutFooter />
        </div>
      )}
      {alert && (
        <UIAlert 
          message={alert.message} 
          type={alert.type} 
          onClose={handleCloseAlert} 
        />
      )}
    </div>
  );
};

export default App;