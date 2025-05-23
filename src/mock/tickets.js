import { getStorage, setStorage } from '../utils/storage';

// Define constants outside any function to ensure they are only declared once
// when the module is imported by the bundler.
// If the issue persists, it might indicate a problem with the build process
// or how the module is being imported/cached.

const STORAGE_KEY = 'ticket_data';
const ID_COUNTER_KEY = 'ticket_id_counter';


let tickets = getStorage(STORAGE_KEY, []);
let idCounter = getStorage(ID_COUNTER_KEY, 0);

const saveTickets = () => {
  setStorage(STORAGE_KEY, tickets);
  setStorage(ID_COUNTER_KEY, idCounter);
};

const generateTicketId = () => {
  idCounter++;
  const paddedId = idCounter.toString().padStart(8, '0');
  return `TK${paddedId}`;
};

const addTicket = (ticket) => {
  const nuevoTicket = { 
    ...ticket, 
    id: generateTicketId(), // Usar el nuevo generador de ID
    fecha: new Date(),
    notas: ticket.notas || [],
    estado: ticket.estado || 'pendiente',
    solucion: ticket.solucion || '', // Agregar campo solucion
    adjuntos: ticket.adjuntos || [] // Agregar campo adjuntos
  };
  tickets.push(nuevoTicket);
  saveTickets();
  return tickets;
};

const updateTicket = (id, updates) => {
  const index = tickets.findIndex(t => t.id === id);
  if (index !== -1) {
    if (typeof updates === 'string') {
      // Para compatibilidad con version anterior (solo estado)
      tickets[index].estado = updates;
    } else {
      // Nueva versión con objeto completo
      tickets[index] = { ...tickets[index], ...updates };
    }
    saveTickets();
  }
  return tickets;
};

const deleteTicket = (id) => {
  tickets = tickets.filter(t => t.id !== id);
  saveTickets();
  return tickets;
};

const getTickets = () => {
  return [...tickets];
};

const findTickets = (searchTerm) => {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return tickets.filter(ticket => {
    // Buscar por ID
    if (ticket.id.toLowerCase().includes(lowerSearchTerm)) {
      return true;
    }
    // Buscar por nombre de cliente
    if (ticket.cliente?.nombre.toLowerCase().includes(lowerSearchTerm)) {
      return true;
    }
    // Buscar por nombre de técnico
    if (ticket.tecnico?.nombre.toLowerCase().includes(lowerSearchTerm)) {
      return true;
    }
    return false;
  });
};

export { addTicket, updateTicket, deleteTicket, getTickets, findTickets };

// DONE