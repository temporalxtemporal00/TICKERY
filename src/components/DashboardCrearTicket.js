import React, { useState, useEffect } from 'react';

const DashboardCrearTicket = ({ onCrearTicket, usuarios, usuarioActual }) => {
  const [ticket, setTicket] = useState({
    clienteId: '',
    tecnicoId: '',
    peticion: '',
    prioridad: 'media',
    adjuntos: []
  });

  const clientes = usuarios.filter(u => u.tipo === 'cliente');
  const tecnicos = usuarios.filter(u => u.tipo === 'tecnico');
  const esCliente = usuarioActual?.tipo === 'cliente';

  useEffect(() => {
    if (esCliente && usuarioActual) {
      setTicket(prev => ({
        ...prev,
        clienteId: usuarioActual.id.toString()
      }));
    }
  }, [usuarioActual, esCliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 25 * 1024 * 1024; // 25 MB en bytes
    
    const nuevosAdjuntos = [];
    files.forEach(file => {
      if (file.size > maxSize) {
        alert(`El archivo "${file.name}" excede el tamaño máximo de 25MB.`);
      } else {
        // En un caso real, subirías el archivo a un servidor y guardarías la URL
        // Aquí, solo simulamos guardando el nombre y un placeholder
        nuevosAdjuntos.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: '#' // Placeholder URL
        });
      }
    });

    setTicket(prev => ({
      ...prev,
      adjuntos: [...prev.adjuntos, ...nuevosAdjuntos]
    }));
  };

  const handleRemoveAttachment = (index) => {
    setTicket(prev => ({
      ...prev,
      adjuntos: prev.adjuntos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticket.clienteId || !ticket.peticion) return;
    
    const cliente = clientes.find(c => c.id.toString() === ticket.clienteId);
    const tecnico = tecnicos.find(t => t.id.toString() === ticket.tecnicoId) || null;
    
    const ticketCompleto = {
      cliente: {
        id: cliente.id,
        nombre: `${cliente.nombres} ${cliente.apellidos}`
      },
      tecnico: tecnico ? {
        id: tecnico.id,
        nombre: `${tecnico.nombres} ${tecnico.apellidos}`
      } : null,
      peticion: ticket.peticion,
      prioridad: ticket.prioridad,
      estado: 'pendiente',
      adjuntos: ticket.adjuntos // Incluir adjuntos
    };
    
    onCrearTicket(ticketCompleto);
    setTicket({
      clienteId: esCliente ? usuarioActual.id.toString() : '',
      tecnicoId: '',
      peticion: '',
      prioridad: 'media',
      adjuntos: []
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Crear nuevo ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            {esCliente ? (
              <input
                type="text"
                value={`${usuarioActual.nombres} ${usuarioActual.apellidos}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                readOnly
              />
            ) : (
              <select
                name="clienteId"
                value={ticket.clienteId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombres} {cliente.apellidos}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Técnico asignado (opcional)</label>
            <select
              name="tecnicoId"
              value={ticket.tecnicoId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Sin asignar</option>
              {tecnicos.map(tecnico => (
                <option key={tecnico.id} value={tecnico.id}>
                  {tecnico.nombres} {tecnico.apellidos}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
            <select
              name="prioridad"
              value={ticket.prioridad}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adjuntar Archivos (máx 25MB c/u)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            />
             <div className="mt-2 space-y-1">
              {ticket.adjuntos.map((adjunto, index) => (
                <div key={index} className="flex items-center justify-between text-sm text-gray-700 bg-gray-100 p-2 rounded">
                  <span>{adjunto.name} ({(adjunto.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <button onClick={() => handleRemoveAttachment(index)} className="ml-2 text-red-500 hover:text-red-700">
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Petición</label>
          <textarea
            name="peticion"
            value={ticket.peticion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            rows="4"
            placeholder="Describe tu petición o problema"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Crear Ticket
        </button>
      </form>
    </div>
  );
};

export default DashboardCrearTicket;

// DONE