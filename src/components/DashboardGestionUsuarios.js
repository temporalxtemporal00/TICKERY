import React, { useState, useEffect } from 'react';

const DashboardGestionUsuarios = ({ showAlert }) => {
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: '',
    password: '',
    tipo: 'cliente',
    dni: '',
    nombres: '',
    apellidos: '',
    empresa: '',
    telefono: '',
    correo: ''
  });
  
  const [editandoDni, setEditandoDni] = useState(null); // Usar DNI para identificar al usuario en edición
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]); // State for users fetched from API
  const [loadingUsers, setLoadingUsers] = useState(true); // State for loading the list

  const tiposUsuario = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'cliente', label: 'Cliente' }
  ];

  // Effect to load the list of users from the API when the component mounts or after actions
  useEffect(() => {
    fetchUsuarios();
  }, []); // Empty dependency array means this runs once on mount

  const fetchUsuarios = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('http://3.141.29.220:5000/api/consulta_usuario');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Mapear los datos de la API para que coincidan con la estructura esperada si es necesario
      const mappedUsers = data.map(user => ({
        ...user,
        username: user.usuario, // Mapear 'usuario' de API a 'username' local
        password: user.contrasena, // Mapear 'contrasena' de API a 'password' local
        // Assuming the API response includes an 'id' field, if not, use DNI or another unique field
        id: user.dni // Using DNI as a temporary ID if API doesn't provide one
      }));
      setUsuarios(mappedUsers);
    } catch (error) {
      console.error("Error fetching users from API:", error);
      showAlert("Error al cargar la lista de usuarios.", 'error');
    } finally {
      setLoadingUsers(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({ ...prev, [name]: value }));
  };

  const validarDNI = (dni) => {
    return /^\d{8}$/.test(dni);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarDNI(nuevoUsuario.dni)) {
      showAlert('El DNI debe tener 8 dígitos', 'warning');
      return;
    }

    setLoading(true);

    const userData = {
      dni: nuevoUsuario.dni,
      nombres: nuevoUsuario.nombres,
      apellidos: nuevoUsuario.apellidos,
      telefono: nuevoUsuario.telefono,
      correo: nuevoUsuario.correo,
      empresa: nuevoUsuario.empresa,
      usuario: nuevoUsuario.username,
      contrasena: nuevoUsuario.password,
      tipo: nuevoUsuario.tipo
    };

    let apiUrl;
    let method;

    if (editandoDni) {
        // Si estamos editando, usar el endpoint de actualización
        apiUrl = `http://3.141.29.220:5000/api/actualizar_usuario/${editandoDni}`;
        method = 'PUT';
        // Eliminar DNI del cuerpo para la petición PUT según la API
        delete userData.dni;
    } else {
        // Si estamos creando, usar el endpoint de creación
        apiUrl = 'http://3.141.29.220:5000/api/crear_usuario';
        method = 'POST';
    }

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Operación de usuario exitosa en backend:', result);

      // Después de la operación exitosa en el backend, recargar la lista desde la API
      fetchUsuarios();

      showAlert(`Usuario ${editandoDni ? 'actualizado' : 'creado'} exitosamente.`, 'success');

    } catch (err) {
      console.error(`Error ${editandoDni ? 'actualizando' : 'creando'} usuario:`, err);
      showAlert(`Error al ${editandoDni ? 'actualizar' : 'crear'} usuario: ${err.message}`, 'error');
    } finally {
      setLoading(false);
      resetFormulario();
    }
  };

  const resetFormulario = () => {
    setNuevoUsuario({
      username: '',
      password: '',
      tipo: 'cliente',
      dni: '',
      nombres: '',
      apellidos: '',
      empresa: '',
      telefono: '',
      correo: ''
    });
    setEditandoDni(null);
    setMostrarFormulario(false);
  };

  const prepararEdicion = (usuario) => {
    // Mapear los datos del usuario de la lista a la estructura del formulario
    setNuevoUsuario({
        username: usuario.usuario, // Mapear 'usuario' de la lista a 'username' del formulario
        password: usuario.contrasena, // Mapear 'contrasena' de la lista a 'password' del formulario
        tipo: usuario.tipo,
        dni: usuario.dni,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        empresa: usuario.empresa,
        telefono: usuario.telefono,
        correo: usuario.correo
    });
    setEditandoDni(usuario.dni); // Usar DNI como identificador de edición
    setMostrarFormulario(true);
  };

   const handleEliminarUsuarioClick = async (dni) => {
      const apiUrl = `http://3.141.29.220:5000/api/eliminar_usuario/${dni}`;

      if (window.confirm(`¿Estás seguro de eliminar al usuario con DNI ${dni}?`)) {
          try {
              setLoading(true);
              const response = await fetch(apiUrl, {
                  method: 'DELETE',
              });

              if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
              }

              const result = await response.json();
              console.log('Usuario eliminado en backend:', result);
              fetchUsuarios(); // Refresh list
              showAlert('Usuario eliminado exitosamente.', 'success');
          } catch (err) {
              console.error("Error deleting user:", err);
              showAlert(`Error al eliminar usuario: ${err.message}`, 'error');
          } finally {
              setLoading(false);
          }
      }
  };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={() => {
            resetFormulario();
            setMostrarFormulario(!mostrarFormulario);
          }}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          {mostrarFormulario ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editandoDni ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h2>
          <form onSubmit={manejarSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI (8 dígitos)</label>
                <input
                  type="text"
                  name="dni"
                  value={nuevoUsuario.dni}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  maxLength="8"
                  pattern="\d{8}"
                  required
                  disabled={editandoDni !== null} // Disable DNI input when editing
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  value={nuevoUsuario.nombres}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  value={nuevoUsuario.apellidos}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={nuevoUsuario.empresa}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={nuevoUsuario.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={nuevoUsuario.correo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
                <input
                  type="text"
                  name="username"
                  value={nuevoUsuario.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={nuevoUsuario.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de usuario</label>
                <select
                  name="tipo"
                  value={nuevoUsuario.tipo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  {tiposUsuario.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetFormulario}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? 'Guardando...' : (editandoDni ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Lista de Usuarios</h2>
        {loadingUsers ? (
          <p className="text-gray-500">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-gray-500">No hay usuarios registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.dni}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.dni}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.nombres}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.apellidos}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                        usuario.tipo === 'administrador' ? 'bg-purple-100 text-purple-800' :
                        usuario.tipo === 'tecnico' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {usuario.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.usuario}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => prepararEdicion(usuario)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarUsuarioClick(usuario.dni)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardGestionUsuarios;

// DONE