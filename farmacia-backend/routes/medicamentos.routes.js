const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/medicamentos
router.get('/', async (req, res, next) => {
  try {
    const { categoria, buscar, estado } = req.query;
    let sql = `SELECT m.*, c.nombre AS categoria FROM medicamentos m
               JOIN categorias_medicamento c ON m.id_categoria = c.id_categoria WHERE 1=1`;
    const binds = {};

    if (categoria) { sql += ' AND m.id_categoria = :categoria'; binds.categoria = categoria; }
    if (estado) { sql += ' AND m.estado = :estado'; binds.estado = estado; }
    if (buscar) { sql += ' AND (UPPER(m.nombre) LIKE UPPER(:buscar) OR UPPER(m.principio_activo) LIKE UPPER(:buscar))'; binds.buscar = `%${buscar}%`; }
    sql += ' ORDER BY m.nombre';

    const result = await db.execute(sql, binds);
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) { next(error); }
});

// GET /api/medicamentos/categorias
router.get('/categorias', async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM categorias_medicamento WHERE estado = :e ORDER BY nombre', ['A']);
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

// GET /api/medicamentos/:id
router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT m.*, c.nombre AS categoria FROM medicamentos m
       JOIN categorias_medicamento c ON m.id_categoria = c.id_categoria
       WHERE m.id_medicamento = :id`, [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Medicamento no encontrado' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { next(error); }
});

// POST /api/medicamentos
router.post('/', async (req, res, next) => {
  try {
    const { nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta } = req.body;
    const result = await db.execute(
      `INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
       VALUES (:nombre, :descripcion, :codigo_barras, :principio_activo, :presentacion, :precio_compra, :precio_venta, :id_categoria, :requiere_receta)
       RETURNING id_medicamento INTO :id`,
      {
        nombre, descripcion: descripcion || null, codigo_barras: codigo_barras || null,
        principio_activo: principio_activo || null, presentacion: presentacion || null,
        precio_compra, precio_venta, id_categoria, requiere_receta: requiere_receta || 'N',
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
      }
    );
    res.status(201).json({ success: true, message: 'Medicamento creado', data: { id_medicamento: result.outBinds.id[0] } });
  } catch (error) { next(error); }
});

// PUT /api/medicamentos/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta, estado } = req.body;
    await db.execute(
      `UPDATE medicamentos SET nombre=:nombre, descripcion=:descripcion, codigo_barras=:codigo_barras,
       principio_activo=:principio_activo, presentacion=:presentacion, precio_compra=:precio_compra,
       precio_venta=:precio_venta, id_categoria=:id_categoria, requiere_receta=:requiere_receta, estado=:estado
       WHERE id_medicamento = :id`,
      { nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta, estado, id: req.params.id }
    );
    res.json({ success: true, message: 'Medicamento actualizado' });
  } catch (error) { next(error); }
});

module.exports = router;
