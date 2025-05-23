import { getStorage, setStorage } from '../utils/storage';

const STORAGE_KEY = 'ticket_users';

let usuarios = getStorage(STORAGE_KEY, [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    tipo: 'administrador',
    dni: '12345678',
    nombres: 'Admin',
    apellidos: 'Sistema',
    empresa: 'Empresa S.A.',
    telefono: '987654321',
    correo: 'admin@empresa.com'
  },
  {
    id: 2,
    username: 'tecnico',
    password: 'tecnico',
    tipo: 'tecnico',
    dni: '87654321',
    nombres: 'Juan',
    apellidos: 'Técnico',
    empresa: 'Soporte Técnico S.A.',
    telefono: '987123456',
    correo: 'tecnico@empresa.com'
  },
  {
    id: 3,
    username: 'cliente',
    password: 'cliente',
    tipo: 'cliente',
    dni: '56781234',
    nombres: 'Carlos',
    apellidos: 'Cliente',
    empresa: 'Cliente Importante S.A.',
    telefono: '987456123',
    correo: 'cliente@empresa.com'
  }
]);

const saveUsers = () => {
  setStorage(STORAGE_KEY, usuarios);
};

const getValidUser = (username, password) => {
  return usuarios.find(user => 
    user.username === username && user.password === password
  );
};

const addUser = (user) => {
  const nuevoUsuario = { 
    ...user, 
    id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1 
  };
  usuarios.push(nuevoUsuario);
  saveUsers();
  return usuarios;
};

const updateUser = (id, updates) => {
  const index = usuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...updates };
    saveUsers();
  }
  return usuarios;
};

const deleteUser = (id) => {
  usuarios = usuarios.filter(u => u.id !== id);
  saveUsers();
  return usuarios;
};

const getUsers = () => {
  return [...usuarios];
};

export { usuarios, getValidUser, addUser, updateUser, deleteUser, getUsers };

// DONE