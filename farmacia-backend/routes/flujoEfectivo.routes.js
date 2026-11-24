const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/flujo-efectivo
router.get('/', async (req, res, next) => {
  try {
    const { sucursal, tipo, fecha_inicio, fecha_fin } = req.query;
    let sql = `SELECT f.*, s.nombre AS sucursal FROM flujo_efectivo f
               JOIN sucursales s ON f.id_sucursal = s.id_sucursal WHERE 1=1`;
    const binds = {};
    if (sucursal) { sql += ' AND f.id_sucursal = :sucursal'; binds.sucursal = sucursal; }
    if (tipo) { sql += ' AND f.tipo = :tipo'; binds.tipo = tipo; }
    if (fecha_inicio) { sql += ' AND f.fecha >= TO_TIMESTAMP(:fi, \'YYYY-MM-DD\')'; binds.fi = fecha_inicio; }
    if (fecha_fin) { sql += ' AND f.fecha < TO_TIMESTAMP(:ff, \'YYYY-MM-DD\') + 1'; binds.ff = fecha_fin; }
    sql += ' ORDER BY f.fecha DESC';
    const result = await db.execute(sql, binds);
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) { next(error); }
});

// GET /api/flujo-efectivo/resumen - Consolidado por sucursal
router.get('/resumen', async (req, res, next) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    let sql = `SELECT s.id_sucursal, s.nombre AS sucursal,
               NVL(SUM(CASE WHEN f.tipo = 'INGRESO' THEN f.monto ELSE 0 END),0) AS total_ingresos,
               NVL(SUM(CASE WHEN f.tipo = 'EGRESO' THEN f.monto ELSE 0 END),0) AS total_egresos,
               NVL(SUM(CASE WHEN f.tipo = 'INGRESO' THEN f.monto ELSE -f.monto END),0) AS balance
               FROM sucursales s
               LEFT JOIN flujo_efectivo f ON s.id_sucursal = f.id_sucursal`;
    const binds = {};
    if (fecha_inicio) { sql += ' AND f.fecha >= TO_TIMESTAMP(:fi, \'YYYY-MM-DD\')'; binds.fi = fecha_inicio; }
    if (fecha_fin) { sql += ' AND f.fecha < TO_TIMESTAMP(:ff, \'YYYY-MM-DD\') + 1'; binds.ff = fecha_fin; }
    sql += ' WHERE s.estado = \'A\' GROUP BY s.id_sucursal, s.nombre ORDER BY s.nombre';
    const result = await db.execute(sql, binds);
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

// POST /api/flujo-efectivo
router.post('/', async (req, res, next) => {
  try {
    const { id_sucursal, tipo, concepto, monto, observaciones } = req.body;
    const result = await db.execute(
      `INSERT INTO flujo_efectivo (id_sucursal, tipo, concepto, monto, id_usuario, observaciones)
       VALUES (:id_sucursal, :tipo, :concepto, :monto, :id_usuario, :observaciones)
       RETURNING id_flujo INTO :id`,
      {
        id_sucursal, tipo, concepto, monto, id_usuario: req.user.id,
        observaciones: observaciones || null,
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
      }
    );
    res.status(201).json({ success: true, message: 'Movimiento registrado', data: { id_flujo: result.outBinds.id[0] } });
  } catch (error) { next(error); }
});

module.exports = router;
