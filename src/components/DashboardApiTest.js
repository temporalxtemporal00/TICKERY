import React, { useState, useEffect } from 'react';

const DashboardApiTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://3.141.29.220:5000/api/test');
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error al conectar con backend:', err);
        setError(`Error al cargar datos de la API. Detalle: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Datos de la API (Temporal)</h2>
      {loading && <p className="text-gray-500">Cargando datos de la API...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {data && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Resultados:</h3>
          {data.length === 0 ? (
            <p className="text-gray-500">La API no devolvió datos.</p>
          ) : (
            <ul id="data-list" className="list-disc list-inside space-y-1">
              {data.map((item, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {JSON.stringify(item)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardApiTest;

// DONE