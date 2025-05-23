import React, { useState } from 'react';
import DashboardGraficoTickets from './DashboardGraficoTickets';
import DashboardApiTest from './DashboardApiTest'; // Importar el componente de prueba de API

const DashboardInicio = ({ tickets, usuarioActual, usuarios, onFilterTickets }) => {
  const esAdmin = usuarioActual?.tipo === 'administrador';
  const esTecnico = usuarioActual?.tipo === 'tecnico';
  const esCliente = usuarioActual?.tipo === 'cliente';

  const [filtroFecha, setFiltroFecha] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todos');
  const [filtroUsuario, setFiltroUsuario] = useState('todos');

  const clientes = usuarios.filter(u => u.tipo === 'cliente');
  const tecnicos = usuarios.filter(u => u.tipo === 'tecnico');

  const getTicketsVisibles = () => {
    if (esAdmin) {
      return tickets;
    } else if (esTecnico) {
      return tickets.filter(ticket => ticket.tecnico?.id === usuarioActual.id);
    } else if (esCliente) {
      return tickets.filter(ticket => ticket.cliente?.id === usuarioActual.id);
    }
    return [];
  };

  const ticketsBase = getTicketsVisibles();

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
        // Puedes agregar 'personalizado' aquí si implementas selectores de fecha
        default:
          startDate = null;
      }
      if (startDate) {
        filtrados = filtrados.filter(ticket => new Date(ticket.fecha) >= startDate);
      }
    }

    // Filtro por estado
    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(ticket => ticket.estado === filtroEstado);
    }

    // Filtro por categoría (asumiendo que los tickets tienen una propiedad 'categoria')
    if (filtroCategoria !== 'todos') {
       // Necesitarías agregar 'categoria' al mock de tickets y al formulario de creación
       // filtrados = filtrados.filter(ticket => ticket.categoria === filtroCategoria);
       // Como no existe, este filtro no hará nada por ahora
    }

    // Filtro por prioridad
    if (filtroPrioridad !== 'todos') {
      filtrados = filtrados.filter(ticket => ticket.prioridad === filtroPrioridad);
    }

    // Filtro por usuario (cliente o técnico)
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

  const ticketsFiltrados = filtrarTickets(ticketsBase);

  const handleLimpiarFiltros = () => {
    setFiltroFecha('todos');
    setFiltroEstado('todos');
    setFiltroCategoria('todos');
    setFiltroPrioridad('todos');
    setFiltroUsuario('todos');
  };

  const handleSegmentClick = (estado) => {
    // Pasar todos los filtros actuales más el filtro de estado del gráfico
    onFilterTickets({
      fecha: filtroFecha,
      estado: estado, // Este es el filtro del gráfico
      categoria: filtroCategoria,
      prioridad: filtroPrioridad,
      usuario: filtroUsuario
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Resumen de Tickets</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Filtros</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <select
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="todos">Todas las fechas</option>
              <option value="ultimos-7-dias">Últimos 7 días</option>
              <option value="mes-actual">Mes actual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="atendido">Atendido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="todos">Todas las prioridades</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
           {/* Filtro por Categoría - Descomentar si se agrega la propiedad 'categoria' a los tickets */}
           {/*
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="todos">Todas las categorías</option>
              {/* Mapear categorías únicas de los tickets si existen }
            </select>
          </div>
          */}

          {esAdmin && (
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <select
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="todos">Todos los usuarios</option>
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
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 self-end"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {ticketsFiltrados.length > 0 ? (
          <DashboardGraficoTickets tickets={ticketsFiltrados} onSegmentClick={handleSegmentClick} />
        ) : (
          <p className="text-gray-500 text-center">No hay tickets que coincidan con los filtros para mostrar en el gráfico.</p>
        )}
      </div>

      {/* Add the API Test component here */}
      <DashboardApiTest />
    </div>
  );
};

export default DashboardInicio;

// DONE