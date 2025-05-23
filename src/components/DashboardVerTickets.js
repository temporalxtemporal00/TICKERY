import React, { useState, useEffect } from 'react';
import DashboardTicketDetalle from './DashboardTicketDetalle';

const DashboardVerTickets = ({ tickets, onUpdateTicket, usuarios, usuarioActual, onEliminarTicket, ticketsBuscados, setTicketsBuscados, filtroInicial }) => { // Cambiado a ticketsBuscados
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [orden, setOrden] = useState('fecha-reciente');
  const [filtroFecha, setFiltroFecha] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTecnico, setFiltroTecnico] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todos');
  const [filtroUsuario, setFiltroUsuario] = useState('todos');

  const tecnicos = usuarios.filter(u => u.tipo === 'tecnico');
  const clientes = usuarios.filter(u => u.tipo === 'cliente');
  const esAdmin = usuarioActual?.tipo === 'administrador';
  const esTecnico = usuarioActual?.tipo === 'tecnico';
  const esCliente = usuarioActual?.tipo === 'cliente';

  // Aplicar filtro inicial si existe
  useEffect(() => {
    if (filtroInicial) {
      if (filtroInicial.estado) setFiltroEstado(filtroInicial.estado);
      if (filtroInicial.fecha) setFiltroFecha(filtroInicial.fecha);
      if (filtroInicial.prioridad) setFiltroPrioridad(filtroInicial.prioridad);
      if (filtroInicial.usuario) setFiltroUsuario(filtroInicial.usuario);
    }
  }, [filtroInicial]);


  useEffect(() => {
    // Limpiar ticket seleccionado cuando cambia ticketsBuscados
    if (ticketsBuscados !== null) { // Check if it's not null (meaning a search happened)
      setTicketSeleccionado(null);
    }
  }, [ticketsBuscados]);

  const handleVerDetalle = (ticket) => {
    setTicketSeleccionado(ticket);
    setTicketsBuscados(null); // Limpiar búsqueda al abrir detalle manualmente
  };

  const handleGuardarCambios = (ticketActualizado) => {
    onUpdateTicket(ticketActualizado.id, ticketActualizado);
    setTicketSeleccionado(null);
  };

  const handleEliminar = (ticketId) => {
    if (window.confirm('¿Estás seguro de eliminar este ticket?')) {
      onEliminarTicket(ticketId);
      setTicketSeleccionado(null); // Cerrar detalle si está abierto
    }
  };

  const ordenarTickets = (tickets) => {
    switch (orden) {
      case 'fecha-reciente':
        return [...tickets].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      case 'fecha-antigua':
        return [...tickets].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      case 'tecnico':
        return [...tickets].sort((a, b) => {
          const nombreA = a.tecnico?.nombre || 'zzz';
          const nombreB = b.tecnico?.nombre || 'zzz';
          return nombreA.localeCompare(nombreB);
        });
      case 'estado':
        return [...tickets].sort((a, b) => a.estado.localeCompare(b.estado));
      case 'prioridad':
        const prioridadOrden = { alta: 1, media: 2, baja: 3 };
        return [...tickets].sort((a, b) => prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad]);
      default:
        return tickets;
    }
  };

  const filtrarTickets = (tickets) => {
    let filtrados = tickets;

    // Filtro por fecha
    if (filtroFecha !== 'todos') {
      const now = new Date();
      let startDate;
      switch (filtroFecha) {
        case 'ultimos-7-dias':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'mes-actual':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = null;
      }
      if (startDate) {
        filtrados = filtrados.filter(ticket => new Date(ticket.fecha) >= startDate);
      }
    }
    
    // Filtro por estado
    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(t => t.estado === filtroEstado);
    }
    
    // Filtro por técnico
    if (filtroTecnico !== 'todos') {
      if (filtroTecnico === 'sin-asignar') {
        filtrados = filtrados.filter(t => !t.tecnico);
      } else {
        filtrados = filtrados.filter(t => t.tecnico?.id.toString() === filtroTecnico);
      }
    }

    // Filtro por prioridad
    if (filtroPrioridad !== 'todos') {
      filtrados = filtrados.filter(ticket => ticket.prioridad === filtroPrioridad);
    }

    // Filtro por usuario (cliente o técnico) - Solo para Admin
    if (esAdmin && filtroUsuario !== 'todos') {
      if (filtroUsuario.startsWith('cliente-')) {
        const clienteId = parseInt(filtroUsuario.split('-')[1]);
        filtrados = filtrados.filter(ticket => ticket.cliente?.id === clienteId);
      } else if (filtroUsuario.startsWith('tecnico-')) {
        const tecnicoId = parseInt(filtroUsuario.split('-')[1]);
        filtrados = filtrados.filter(ticket => ticket.tecnico?.id === tecnicoId);
      } else if (filtroUsuario === 'sin-asignar-tecnico') {
         filtrados = filtrados.filter(ticket => !ticket.tecnico);
      }
    }
    
    return filtrados;
  };

  const getTicketsVisibles = () => {
    if (esAdmin) {
      return tickets;
    } else if (esCliente) {
      return tickets.filter(ticket => ticket.cliente?.id === usuarioActual.id);
    } else if (esTecnico) {
      return tickets.filter(ticket => ticket.tecnico?.id === usuarioActual.id);
    }
    return [];
  };

  const ticketsBase = getTicketsVisibles();
  const ticketsFiltradosYOrdenados = ordenarTickets(filtrarTickets(ticketsBase));

  // Mostrar tickets buscados si existen, de lo contrario, mostrar filtrados y ordenados
  const ticketsAMostrar = ticketsBuscados !== null ? ticketsBuscados : ticketsFiltradosYOrdenados;

  const handleLimpiarFiltros = () => {
    setFiltroFecha('todos');
    setFiltroEstado('todos');
    setFiltroTecnico('todos');
    setFiltroPrioridad('todos');
    setFiltroUsuario('todos');
    setTicketsBuscados(null); // Limpiar búsqueda al limpiar filtros
  };


  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold">Tickets Registrados</h2>
        
        {/* Mostrar filtros solo si no hay búsqueda activa y no se está viendo un detalle */}
        {!ticketsBuscados && !ticketSeleccionado && (
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Fecha:</label>
              <select
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="todos">Todas</option>
                <option value="ultimos-7-dias">Últimos 7 días</option>
                <option value="mes-actual">Mes actual</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Estado:</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="atendido">Atendido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
             <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Prioridad:</label>
              <select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="todos">Todas</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            
            {(esAdmin || esTecnico) && (
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Técnico:</label>
                <select
                  value={filtroTecnico}
                  onChange={(e) => setFiltroTecnico(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="sin-asignar">Sin asignar</option>
                  {tecnicos.map(tecnico => (
                    <option key={tecnico.id} value={tecnico.id}>
                      {tecnicos.nombres}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {esAdmin && (
               <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Usuario:</label>
                <select
                  value={filtroUsuario}
                  onChange={(e) => setFiltroUsuario(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="sin-asignar-tecnico">Sin técnico asignado</option>
                  <optgroup label="Clientes">
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={`cliente-${cliente.id}`}>
                        {cliente.nombres} {cliente.apellidos}
                      </option>
                    ))}
                  </optgroup>
                   <optgroup label="Técnicos">
                    {tecnicos.map(tecnico => (
                      <option key={tecnico.id} value={`tecnico-${tecnico.id}`}>
                        {tecnico.nombres} {tecnico.apellidos}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            )}

             <button
              onClick={handleLimpiarFiltros}
              className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>
      
      {ticketSeleccionado ? (
        <DashboardTicketDetalle
          ticket={ticketSeleccionado}
          onSave={() => setTicketSeleccionado(null)}
          onCancel={() => setTicketSeleccionado(null)}
          onUpdate={handleGuardarCambios}
          usuarios={usuarios}
          usuarioActual={usuarioActual}
          onEliminar={handleEliminar}
        />
      ) : (
        <>
          {ticketsAMostrar.length === 0 ? (
            <p className="text-gray-500">No hay tickets que coincidan con los filtros o la búsqueda</p>
          ) : (
            <div className="space-y-4">
              {ticketsAMostrar.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className={`p-4 border rounded-lg cursor-pointer ${
                    ticket.estado === 'atendido' ? 'bg-green-50 border-green-100' :
                    ticket.estado === 'cancelado' ? 'bg-red-50 border-red-100' :
                    'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleVerDetalle(ticket)}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">
                          {ticket.cliente ? ticket.cliente.nombre : 'Cliente no especificado'}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ticket.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                          ticket.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.prioridad}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ticket.peticion}</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                       <span className="text-xs text-gray-400 mb-1">ID: {ticket.id}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.estado === 'atendido' ? 'bg-green-100 text-green-800' :
                        ticket.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ticket.estado}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(ticket.fecha).toLocaleString()}
                      </p>
                      {ticket.tecnico && (
                        <p className="text-xs text-gray-500 mt-1">
                          Asignado a: {ticket.tecnico.nombre}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardVerTickets;

// DONE