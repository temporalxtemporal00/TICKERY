import React, { useState, useEffect } from 'react';

const AuthApiCheck = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'success', 'error'

  useEffect(() => {
    const checkApi = async () => {
      try {
        // Using a public API endpoint
        const controller = new AbortController(); // Create a controller
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Set timeout

        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
          method: 'GET',
          signal: controller.signal // Pass the signal
        });

        clearTimeout(timeoutId); // Clear timeout if fetch completes

        if (response.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('API check failed:', error);
        setStatus('error');
      }
    };

    checkApi();
  }, []);

  if (status === 'checking') {
    return (
      <div className="text-center text-sm text-gray-500 mt-4">
        Verificando conexión...
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center text-sm text-green-600 mt-4">
        ✅ Conexión a Internet confirmada
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center text-sm text-red-600 mt-4">
        ❌ No hay conexión a Internet
      </div>
    );
  }

  return null; // Should not happen
};

export default AuthApiCheck;