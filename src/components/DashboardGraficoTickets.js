import React from 'react';

const DashboardGraficoTickets = ({ tickets, onSegmentClick }) => {
  const contarEstados = () => {
    return tickets.reduce((acc, ticket) => {
      const estado = ticket.estado || 'pendiente';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});
  };

  const datos = contarEstados();
  const total = Object.values(datos).reduce((sum, value) => sum + value, 0);
  const colores = {
    pendiente: '#FBBF24',
    atendido: '#10B981',
    cancelado: '#EF4444'
  };

  let anguloAcumulado = 0;
  const segmentos = Object.entries(datos).map(([estado, cantidad]) => {
    const porcentaje = (cantidad / total) * 100;
    const angulo = (porcentaje / 100) * 360;
    const segmento = {
      estado,
      cantidad,
      porcentaje,
      angulo,
      startAngle: anguloAcumulado,
      endAngle: anguloAcumulado + angulo,
      color: colores[estado] || '#9CA3AF'
    };
    anguloAcumulado += angulo;
    return segmento;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 mb-6">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segmentos.map((segmento, index) => (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={segmento.color}
              strokeWidth="10"
              strokeDasharray={`${segmento.angulo} ${360 - segmento.angulo}`}
              strokeDashoffset={-segmento.startAngle + 25}
              transform="rotate(-90) translate(-100)"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl font-bold">{total}</span>
            <p className="text-sm text-gray-500">Total tickets</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        {segmentos.map((segmento) => (
          <button 
            key={segmento.estado} 
            className="flex items-center focus:outline-none cursor-pointer hover:opacity-75 transition-opacity"
            onClick={() => onSegmentClick(segmento.estado)}
          >
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: segmento.color }}
            ></div>
            <div>
              <p className="text-sm capitalize">{segmento.estado}</p>
              <p className="text-xs text-gray-500">
                {segmento.cantidad} ({segmento.porcentaje.toFixed(1)}%)
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardGraficoTickets;