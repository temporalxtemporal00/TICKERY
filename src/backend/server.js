const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import cors

const app = express();
const port = 3001; // Puedes cambiar el puerto si es necesario

// Configuración de la base de datos
const pool = new Pool({
  user: 'adminuser',
  host: 'bdtickets.cduisgwc48m5.us-east-2.rds.amazonaws.com',
  database: 'postgres',
  password: 'adminuser',
  port: 5432,
  ssl: {
    rejectUnauthorized: false // Puede ser necesario si no tienes un certificado SSL configurado correctamente
  }
});

// Middleware para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors()); // Use cors middleware

// Endpoint para obtener datos de la tabla 'test'
app.get('/api/tickets', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, cliente, tecnico, descripcion, estado FROM test');
    client.release(); // Liberar la conexión

    res.json(result.rows); // Enviar los resultados como JSON
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Backend corriendo en http://localhost:${port}`);
});