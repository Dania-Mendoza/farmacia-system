const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/inventario - Inventario con filtros por sucursal
router.get('/', async (req, res, next) => {
  try {
    const { sucursal, alerta } = req.query;
    let sql = `SELECT i.*, m.nombre AS medicamento, m.precio_venta, m.codigo_barras,
               s.nombre AS sucursal, c.nombre AS categoria,
               CASE WHEN i.cantidad <= i.stock_minimo THEN 'BAJO'
                    WHEN i.cantidad >= i.stock_maximo THEN 'EXCESO' ELSE 'NORMAL' END AS nivel_stock,
               (i.cantidad * m.precio_venta) AS valor_inventario
               FROM inventario i
               JOIN medicamentos m ON i.id_medicamento = m.id_medicamento
               JOIN sucursales s ON i.id_sucursal = s.id_sucursal
               JOIN categorias_medicamento c ON m.id_categoria = c.id_categoria
               WHERE 1=1`;
    const binds = {};
    if (sucursal) { sql += ' AND i.id_sucursal = :sucursal'; binds.sucursal = sucursal; }
    if (alerta === 'bajo') { sql += ' AND i.cantidad <= i.stock_minimo'; }
    if (alerta === 'exceso') { sql += ' AND i.cantidad >= i.stock_maximo'; }
    sql += ' ORDER BY s.nombre, m.nombre';

    const result = await db.execute(sql, binds);
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) { next(error); }
});

// GET /api/inventario/resumen - Resumen por sucursal
router.get('/resumen', async (req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT s.id_sucursal, s.nombre AS sucursal,
              COUNT(i.id_inventario) AS total_productos,
              SUM(i.cantidad) AS total_unidades,
              SUM(i.cantidad * m.precio_venta) AS valor_total,
              SUM(CASE WHEN i.cantidad <= i.stock_minimo THEN 1 ELSE 0 END) AS alertas_stock_bajo
       FROM sucursales s
       LEFT JOIN inventario i ON s.id_sucursal = i.id_sucursal
       LEFT JOIN medicamentos m ON i.id_medicamento = m.id_medicamento
       WHERE s.estado = 'A'
       GROUP BY s.id_sucursal, s.nombre
       ORDER BY s.nombre`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

// PUT /api/inventario/:id - Actualizar stock
router.put('/:id', async (req, res, next) => {
  try {
    const { cantidad, stock_minimo, stock_maximo } = req.body;
    await db.execute(
      `UPDATE inventario SET cantidad=:cantidad, stock_minimo=:stock_minimo,
       stock_maximo=:stock_maximo, fecha_actualizacion=CURRENT_TIMESTAMP
       WHERE id_inventario = :id`,
      { cantidad, stock_minimo, stock_maximo, id: req.params.id }
    );
    res.json({ success: true, message: 'Inventario actualizado' });
  } catch (error) { next(error); }
});

// POST /api/inventario - Agregar medicamento a inventario de sucursal
router.post('/', async (req, res, next) => {
  try {
    const { id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo } = req.body;
    const result = await db.execute(
      `INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo)
       VALUES (:id_sucursal, :id_medicamento, :cantidad, :stock_minimo, :stock_maximo)
       RETURNING id_inventario INTO :id`,
      {
        id_sucursal, id_medicamento, cantidad: cantidad || 0,
        stock_minimo: stock_minimo || 10, stock_maximo: stock_maximo || 500,
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
      }
    );
    res.status(201).json({ success: true, message: 'Inventario registrado', data: { id_inventario: result.outBinds.id[0] } });
  } catch (error) { next(error); }
});

module.exports = router;
