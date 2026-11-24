const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/activos
router.get('/', async (req, res, next) => {
  try {
    const { sucursal } = req.query;
    let sql = `SELECT af.*, ca.nombre AS categoria, ca.porcentaje_depreciacion, s.nombre AS sucursal
               FROM activos_fijos af
               JOIN categorias_activo ca ON af.id_categoria = ca.id_categoria
               JOIN sucursales s ON af.id_sucursal = s.id_sucursal WHERE 1=1`;
    const binds = {};
    if (sucursal) { sql += ' AND af.id_sucursal = :sucursal'; binds.sucursal = sucursal; }
    sql += ' ORDER BY af.nombre';
    const result = await db.execute(sql, binds);
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) { next(error); }
});

// GET /api/activos/resumen
router.get('/resumen', async (req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT s.id_sucursal, s.nombre AS sucursal,
              COUNT(af.id_activo) AS total_activos,
              NVL(SUM(af.valor_adquisicion),0) AS valor_adquisicion,
              NVL(SUM(af.depreciacion_acumulada),0) AS depreciacion_acumulada,
              NVL(SUM(af.valor_actual),0) AS valor_actual
       FROM sucursales s
       LEFT JOIN activos_fijos af ON s.id_sucursal = af.id_sucursal AND af.estado = 'ACTIVO'
       WHERE s.estado = 'A'
       GROUP BY s.id_sucursal, s.nombre ORDER BY s.nombre`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

// GET /api/activos/categorias
router.get('/categorias', async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM categorias_activo ORDER BY nombre');
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

// POST /api/activos
router.post('/', async (req, res, next) => {
  try {
    const { nombre, descripcion, codigo_activo, id_categoria, valor_adquisicion, fecha_adquisicion, id_sucursal } = req.body;
    const result = await db.execute(
      `INSERT INTO activos_fijos (nombre, descripcion, codigo_activo, id_categoria, valor_adquisicion, fecha_adquisicion, valor_actual, id_sucursal)
       VALUES (:nombre, :descripcion, :codigo_activo, :id_categoria, :valor_adquisicion, TO_DATE(:fecha_adquisicion,'YYYY-MM-DD'), :valor_actual, :id_sucursal)
       RETURNING id_activo INTO :id`,
      {
        nombre, descripcion: descripcion || null, codigo_activo: codigo_activo || null,
        id_categoria, valor_adquisicion, fecha_adquisicion, valor_actual: valor_adquisicion, id_sucursal,
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
      }
    );
    res.status(201).json({ success: true, message: 'Activo registrado', data: { id_activo: result.outBinds.id[0] } });
  } catch (error) { next(error); }
});

// PUT /api/activos/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { nombre, descripcion, id_sucursal, estado } = req.body;
    await db.execute(
      `UPDATE activos_fijos SET nombre=:nombre, descripcion=:descripcion, id_sucursal=:id_sucursal, estado=:estado
       WHERE id_activo = :id`,
      { nombre, descripcion, id_sucursal, estado, id: req.params.id }
    );
    res.json({ success: true, message: 'Activo actualizado' });
  } catch (error) { next(error); }
});

module.exports = router;
