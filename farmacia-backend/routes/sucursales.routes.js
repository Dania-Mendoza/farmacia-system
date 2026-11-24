const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/sucursales
router.get('/', async (req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT s.*, m.nombre AS municipio, d.nombre AS departamento, t.nombre AS tipo_ubicacion
       FROM sucursales s
       JOIN municipios m ON s.id_municipio = m.id_municipio
       JOIN departamentos d ON m.id_departamento = d.id_departamento
       JOIN tipos_ubicacion t ON s.id_tipo_ubicacion = t.id_tipo_ubicacion
       ORDER BY s.nombre`
    );
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) { next(error); }
});

// GET /api/sucursales/:id
router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT s.*, m.nombre AS municipio, d.nombre AS departamento, t.nombre AS tipo_ubicacion
       FROM sucursales s
       JOIN municipios m ON s.id_municipio = m.id_municipio
       JOIN departamentos d ON m.id_departamento = d.id_departamento
       JOIN tipos_ubicacion t ON s.id_tipo_ubicacion = t.id_tipo_ubicacion
       WHERE s.id_sucursal = :id`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sucursal no encontrada' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { next(error); }
});

// POST /api/sucursales
router.post('/', async (req, res, next) => {
  try {
    const { nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email, nombre_contacto } = req.body;
    const result = await db.execute(
      `INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email, nombre_contacto)
       VALUES (:nombre, :direccion, :id_municipio, :id_tipo_ubicacion, :telefono, :email, :nombre_contacto)
       RETURNING id_sucursal INTO :id`,
      {
        nombre, direccion, id_municipio, id_tipo_ubicacion,
        telefono: telefono || null, email: email || null, nombre_contacto: nombre_contacto || null,
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
      }
    );
    res.status(201).json({ success: true, message: 'Sucursal creada', data: { id_sucursal: result.outBinds.id[0] } });
  } catch (error) { next(error); }
});

// PUT /api/sucursales/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email, nombre_contacto, estado } = req.body;
    await db.execute(
      `UPDATE sucursales SET nombre=:nombre, direccion=:direccion, id_municipio=:id_municipio,
       id_tipo_ubicacion=:id_tipo_ubicacion, telefono=:telefono, email=:email,
       nombre_contacto=:nombre_contacto, estado=:estado
       WHERE id_sucursal = :id`,
      { nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email, nombre_contacto, estado, id: req.params.id }
    );
    res.json({ success: true, message: 'Sucursal actualizada' });
  } catch (error) { next(error); }
});

// DELETE /api/sucursales/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await db.execute(
      `UPDATE sucursales SET estado = 'I' WHERE id_sucursal = :id`,
      [req.params.id]
    );
    res.json({ success: true, message: 'Sucursal desactivada' });
  } catch (error) { next(error); }
});

module.exports = router;
