const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '277353',
  database: 'liga_mujeres_diversas',
  waitForConnections: true,
  connectionLimit: 10,
});

app.get('/api/equipos', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, abreviatura AS abbr, nombre AS name, pj, pg, pp, gf, gc, pts, color_tailwind AS color FROM equipos ORDER BY pts DESC, (gf - gc) DESC',
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jugadoras', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT j.*, e.nombre AS equipo_nombre, e.abreviatura AS equipo_abbr
      FROM jugadoras j
      LEFT JOIN equipos e ON j.equipo_id = e.id
      ORDER BY j.equipo_id, j.dorsal
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/partidos', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id,
        p.jornada AS round,
        p.fecha_hora AS time,
        el.nombre AS home,
        ev.nombre AS away,
        p.estado AS status,
        p.goles_local,
        p.goles_visitante,
        p.penales_detalle AS penalties,
        p.mvp_nombre AS mvp
      FROM partidos p
      JOIN equipos el ON p.equipo_local_id = el.id
      JOIN equipos ev ON p.equipo_visitante_id = ev.id
      ORDER BY p.id DESC
    `);

    const formateados = rows.map((r) => ({
      id: r.id,
      round: r.round,
      time: r.time,
      home: r.home,
      away: r.away,
      status: r.status,
      ...(r.status === 'FINALIZADO' ? { score: `${r.goles_local} - ${r.goles_visitante}` } : {}),
      ...(r.penalties ? { penalties: r.penalties } : {}),
      ...(r.mvp ? { mvp: r.mvp } : {}),
    }));

    res.json(formateados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/partidos', async (req, res) => {
  const { round, time, home, away, status, score, penalties, mvp } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [[eqLocal]] = await conn.query('SELECT id FROM equipos WHERE nombre = ?', [home]);
    const [[eqVisitante]] = await conn.query('SELECT id FROM equipos WHERE nombre = ?', [away]);

    if (!eqLocal || !eqVisitante) {
      await conn.rollback();
      return res.status(400).json({ error: 'Equipo local o visitante no encontrado en MySQL' });
    }

    let golesLocal = 0;
    let golesVisitante = 0;

    if (score && score.includes('-')) {
      const partes = score.split('-').map((n) => parseInt(n.trim(), 10));
      golesLocal = partes[0] || 0;
      golesVisitante = partes[1] || 0;
    }

    const [insertRes] = await conn.query(
      `INSERT INTO partidos 
       (jornada, fecha_hora, equipo_local_id, equipo_visitante_id, estado, goles_local, goles_visitante, penales_detalle, mvp_nombre)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        round || 'Jornada 09',
        time || 'Dom 10:00',
        eqLocal.id,
        eqVisitante.id,
        status || 'FINALIZADO',
        golesLocal,
        golesVisitante,
        penalties || null,
        mvp || null,
      ],
    );

    if ((status || 'FINALIZADO') === 'FINALIZADO') {
      const ganoLocal = golesLocal > golesVisitante;
      const ganoVisitante = golesVisitante > golesLocal;
      let ptsLocal = 1;
      let ptsVisitante = 1;
      if (ganoLocal) {
        ptsLocal = 3;
        ptsVisitante = 0;
      } else if (ganoVisitante) {
        ptsLocal = 0;
        ptsVisitante = 3;
      } else if (penalties && penalties.includes('-')) {
        const [penL, penV] = penalties.split('-').map((n) => parseInt(n.trim(), 10));
        if (penL > penV) {
          ptsLocal = 2;
          ptsVisitante = 1;
        } else if (penV > penL) {
          ptsLocal = 1;
          ptsVisitante = 2;
        }
      }

      await conn.query(
        'UPDATE equipos SET pj = pj + 1, pg = pg + ?, pp = pp + ?, gf = gf + ?, gc = gc + ?, pts = pts + ? WHERE id = ?',
        [
          ptsLocal >= 2 ? 1 : 0,
          ptsLocal <= 1 ? 1 : 0,
          golesLocal,
          golesVisitante,
          ptsLocal,
          eqLocal.id,
        ],
      );

      await conn.query(
        'UPDATE equipos SET pj = pj + 1, pg = pg + ?, pp = pp + ?, gf = gf + ?, gc = gc + ?, pts = pts + ? WHERE id = ?',
        [
          ptsVisitante >= 2 ? 1 : 0,
          ptsVisitante <= 1 ? 1 : 0,
          golesVisitante,
          golesLocal,
          ptsVisitante,
          eqVisitante.id,
        ],
      );
    }

    await conn.commit();
    res.json({ ok: true, id: insertRes.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

app.get('/api/rankings', async (req, res) => {
  try {
    const [goleadoras] = await pool.query(`
      SELECT j.id AS playerId, j.nombre AS name, e.nombre AS team, SUM(ep.goles) AS goals
      FROM estadisticas_partido ep
      JOIN jugadoras j ON ep.jugadora_id = j.id
      JOIN equipos e ON j.equipo_id = e.id
      GROUP BY j.id, j.nombre, e.nombre
      HAVING goals > 0
      ORDER BY goals DESC
      LIMIT 5
    `);

    const [porteras] = await pool.query(`
      SELECT j.id AS playerId, j.nombre AS name, e.nombre AS team, SUM(ep.atajadas) AS atajadas
      FROM estadisticas_partido ep
      JOIN jugadoras j ON ep.jugadora_id = j.id
      JOIN equipos e ON j.equipo_id = e.id
      WHERE j.posicion = 'Portera'
      GROUP BY j.id, j.nombre, e.nombre
      HAVING atajadas > 0
      ORDER BY atajadas DESC
      LIMIT 5
    `);

    const [asistencias] = await pool.query(`
      SELECT j.id AS playerId, j.nombre AS name, e.nombre AS team, SUM(ep.asistencias) AS assists
      FROM estadisticas_partido ep
      JOIN jugadoras j ON ep.jugadora_id = j.id
      JOIN equipos e ON j.equipo_id = e.id
      GROUP BY j.id, j.nombre, e.nombre
      HAVING assists > 0
      ORDER BY assists DESC
      LIMIT 5
    `);

    res.json({ goleadoras, porteras, asistencias });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, equipo_id FROM usuarios WHERE email = ? AND password_hash = ? LIMIT 1',
      [email, password],
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos' });
    }

    res.json({ ok: true, usuario: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor MySQL listo en http://localhost:${PORT}`);
});
