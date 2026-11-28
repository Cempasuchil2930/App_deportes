const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '277353',
  database: 'liga_mujeres_diversas',
});

app.get('/api/equipos', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM equipos WHERE estatus = "APROBADO"');
  res.json(rows);
});

app.get('/api/jugadoras', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM jugadoras');
  res.json(rows);
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
