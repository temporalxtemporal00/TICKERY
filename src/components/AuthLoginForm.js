import React, { useState } from 'react';

const AuthLoginForm = ({ onLogin, disabled }) => { // Added disabled prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor ingresa ambos campos');
      return;
    }
    setError(null);
    onLogin({ username, password });
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-md space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Acceso Admin</h2>
        <p className="mt-2 text-gray-600">Ingresa tus credenciales</p>
      </div>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            placeholder="admin"
            disabled={disabled} // Disable input
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            placeholder="admin"
            disabled={disabled} // Disable input
          />
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition disabled:opacity-50 disabled:cursor-not-allowed" // Disable style
          disabled={disabled} // Disable button
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default AuthLoginForm;

// DONE