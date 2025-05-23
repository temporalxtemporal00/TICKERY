import React, { useState } from 'react';

const DashboardTicketDetalle = ({ ticket, onSave, onCancel, onUpdate, usuarios, usuarioActual, onEliminar }) => {
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState(ticket);
  const [nuevaNota, setNuevaNota] = useState('');

  const tecnicos = usuarios.filter(u => u.tipo === 'tecnico');
  const esAdmin = usuarioActual?.tipo === 'administrador';
  const esTecnico = usuarioActual?.tipo === 'tecnico';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos(prev => ({ ...prev, [name]: value }));
  };

  const handleFechaChange = (e) => {
    setDatos(prev => ({ ...prev, fecha: new Date(e.target.value) }));
  };

  const handleAgregarNota = () => {
    if (nuevaNota.trim()) {
      const notasActualizadas = [...(datos.notas || []), {
        texto: nuevaNota,
        fecha: new Date(),
        autor: usuarioActual?.username || 'Desconocido'
      }];
      setDatos(prev => ({ ...prev, notas: notasActualizadas }));
      setNuevaNota('');
    }
  };

  const handleGuardar = () => {
    onUpdate(datos);
    onSave();
  };

  const handleEliminarClick = () => {
    onEliminar(datos.id);
  };

  const handleDownloadAttachment = (attachment) => {
    // En un caso real, aquí harías una petición para descargar el archivo desde la URL real
    // Como estamos simulando, solo abrimos una nueva pestaña con un mensaje
    alert(`Simulando descarga del archivo: ${attachment.name}`);
    // window.open(attachment.url, '_blank'); // Usar la URL real en un caso real
  };

  // Formatear fecha para input type="datetime-local"
  const formatFechaInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Detalle del Ticket #{datos.id}</h2>
        <div className="flex space-x-3">
          {editando ? (
            <>
              <button
                onClick={handleGuardar}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setDatos(ticket);
                  setEditando(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditando(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Editar
              </button>
              {esAdmin && (
                <button
                  onClick={handleEliminarClick}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Información del Ticket</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <p className="text-lg">
                {datos.cliente ? datos.cliente.nombre : 'Cliente no especificado'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Técnico asignado</label>
              {editando ? (
                <select
                  name="tecnico"
                  value={datos.tecnico?.id || ''}
                  onChange={(e) => {
                    const tecnicoId = e.target.value;
                    if (tecnicoId) {
                      const tecnico = tecnicos.find(t => t.id.toString() === tecnicoId);
                      setDatos(prev => ({
                        ...prev,
                        tecnico: tecnico ? {
                          id: tecnico.id,
                          nombre: `${tecnico.nombres} ${tecnico.apellidos}`
                        } : null
                      }));
                    } else {
                      setDatos(prev => ({
                        ...prev,
                        tecnico: null
                      }));
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Sin asignar</option>
                  {tecnicos.map(tecnico => (
                    <option key={tecnico.id} value={tecnico.id}>
                      {tecnico.nombres} {tecnico.apellidos}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-lg">
                  {datos.tecnico ? datos.tecnico.nombre : 'Sin asignar'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              {editando ? (
                <select
                  name="prioridad"
                  value={datos.prioridad}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              ) : (
                <span className={`px-2 py-1 rounded-full ${
                  datos.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                  datos.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {datos.prioridad}
                </span>
              )}
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
              {editando ? (
                 <input
                   type="datetime-local"
                   name="fecha"
                   value={formatFechaInput(datos.fecha)}
                   onChange={handleFechaChange}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                 />
              ) : (
                <p className="text-lg">
                  {new Date(datos.fecha).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Estado y Comentarios</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              {editando ? (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setDatos(prev => ({ ...prev, estado: 'pendiente' }))}
                    className={`px-3 py-1 rounded ${datos.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}
                  >
                    Pendiente
                  </button>
                  <button
                    onClick={() => setDatos(prev => ({ ...prev, estado: 'atendido' }))}
                    className={`px-3 py-1 rounded ${datos.estado === 'atendido' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                  >
                    Atendido
                  </button>
                  <button
                    onClick={() => setDatos(prev => ({ ...prev, estado: 'cancelado' }))}
                    className={`px-3 py-1 rounded ${datos.estado === 'cancelado' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}
                  >
                    Cancelado
                  </button>
                </div>
              ) : (
                <span className={`px-2 py-1 rounded-full ${
                  datos.estado === 'atendido' ? 'bg-green-100 text-green-800' :
                  datos.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {datos.estado}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <div className="space-y-2 mb-4">
                {datos.notas?.map((nota, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{nota.texto}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(nota.fecha).toLocaleString()} - {nota.autor}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={nuevaNota}
                  onChange={(e) => setNuevaNota(e.target.value)}
                  placeholder="Agregar nueva nota"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleAgregarNota}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Petición</label>
        {editando ? (
          <textarea
            name="peticion"
            value={datos.peticion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows="4"
          />
        ) : (
          <p className="text-lg whitespace-pre-line">{datos.peticion}</p>
        )}
      </div>

      {(esAdmin || esTecnico) && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Posible Solución</label>
          {editando ? (
            <textarea
              name="solucion"
              value={datos.solucion || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows="4"
              placeholder="Describe la posible solución aquí..."
            />
          ) : (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 whitespace-pre-line">
                {datos.solucion || 'Aún no se ha sugerido una posible solución.'}
              </p>
            </div>
          )}
        </div>
      )}
       <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Adjuntos</label>
        {datos.adjuntos && datos.adjuntos.length > 0 ? (
          <div className="space-y-2">
            {datos.adjuntos.map((adjunto, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700 bg-gray-100 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.414 6.586a6 6 0 108.485 8.485l6.586-6.586a2 2 0 00-2.828-2.828z" />
                </svg>
                <span>{adjunto.name} ({(adjunto.size / 1024 / 1024).toFixed(2)} MB)</span>
                 <button 
                   onClick={() => handleDownloadAttachment(adjunto)}
                   className="ml-auto text-blue-500 hover:text-blue-700"
                 >
                   Descargar
                 </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay adjuntos para este ticket.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardTicketDetalle;

// DONE