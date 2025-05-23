import React, { useState } from 'react';

const DashboardDatabaseTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Llamada al endpoint del backend
      const response = await fetch('http://localhost:3001/api/tickets'); // Usar la URL del backend

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      setData(result);
      setLoading(false);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Error al conectar o consultar el backend. Asegúrate de que el backend esté corriendo en http://localhost:3001. Detalle: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Prueba de Conexión a Base de Datos (Temporal)</h2>
      <p className="text-sm text-gray-600 mb-4">
        Esta sección muestra datos obtenidos de un backend que se conecta a la base de datos.
        Asegúrate de que el backend esté corriendo.
      </p>
      <button
        onClick={fetchData}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        disabled={loading}
      >
        {loading ? 'Consultando...' : 'Consultar Tabla "test"'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      {data && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Resultados de la Tabla "test":</h3>
          {data.length === 0 ? (
            <p className="text-gray-500">La tabla "test" está vacía.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.cliente}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.tecnico}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardDatabaseTest;

// DONE