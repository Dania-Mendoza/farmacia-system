const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/empleados
router.get('/', async (req, res, next) => {
  try {
    const { sucursal } = req.query;
    let sql = `SELECT e.*, p.nombre AS puesto, p.salario_base, s.nombre AS sucursal
               FROM empleados e
               JOIN puestos p ON e.id_puesto = p.id_puesto
               JOIN sucursales s ON e.id_sucursal = s.id_sucursal WHERE 1=1`;
    const binds = {};
    if (sucursal) { sql += ' AND e.id_sucursal = :sucursal'; binds.sucursal = sucursal; }
    sql += ' ORDER BY e.apellido, e.nombre';
    const result = await db.execute(sql, binds);
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) { next(error); }
});

// GET /api/empleados/puestos
router.get('/puestos', async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM puestos WHERE estado = :e ORDER BY nombre', ['A']);
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

// GET /api/empleados/:id
router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT e.*, p.nombre AS puesto, p.salario_base, s.nombre AS sucursal
       FROM empleados e JOIN puestos p ON e.id_puesto = p.id_puesto
       JOIN sucursales s ON e.id_sucursal = s.id_sucursal
       WHERE e.id_empleado = :id`, [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) { next(error); }
});

// POST /api/empleados
router.post('/', async (req, res, next) => {
  try {
    const { nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, email, id_puesto, id_sucursal } = req.body;
    const result = await db.execute(
      `INSERT INTO empleados (nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, email, id_puesto, id_sucursal)
       VALUES (:nombre, :apellido, :dpi, TO_DATE(:fecha_nacimiento,'YYYY-MM-DD'), :direccion, :telefono, :email, :id_puesto, :id_sucursal)
       RETURNING id_empleado INTO :id`,
      {
        nombre, apellido, dpi, fecha_nacimiento, direccion: direccion || null,
        telefono: telefono || null, email: email || null, id_puesto, id_sucursal,
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
      }
    );
    res.status(201).json({ success: true, message: 'Empleado creado', data: { id_empleado: result.outBinds.id[0] } });
  } catch (error) { next(error); }
});

// PUT /api/empleados/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { nombre, apellido, direccion, telefono, email, id_puesto, id_sucursal, estado } = req.body;
    await db.execute(
      `UPDATE empleados SET nombre=:nombre, apellido=:apellido, direccion=:direccion,
       telefono=:telefono, email=:email, id_puesto=:id_puesto, id_sucursal=:id_sucursal, estado=:estado
       WHERE id_empleado = :id`,
      { nombre, apellido, direccion, telefono, email, id_puesto, id_sucursal, estado, id: req.params.id }
    );
    res.json({ success: true, message: 'Empleado actualizado' });
  } catch (error) { next(error); }
});

module.exports = router;
