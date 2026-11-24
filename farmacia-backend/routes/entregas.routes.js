const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/entregas
router.get('/', async (req, res, next) => {
  try {
    const { estado, sucursal } = req.query;
    let sql = `SELECT e.*, s.nombre AS sucursal_origen,
               c.nombre || ' ' || c.apellido AS cliente,
               rep.nombre || ' ' || rep.apellido AS repartidor
               FROM entregas e
               JOIN sucursales s ON e.id_sucursal_origen = s.id_sucursal
               JOIN clientes c ON e.id_cliente = c.id_cliente
               LEFT JOIN empleados rep ON e.id_repartidor = rep.id_empleado WHERE 1=1`;
    const binds = {};
    if (estado) { sql += ' AND e.estado = :estado'; binds.estado = estado; }
    if (sucursal) { sql += ' AND e.id_sucursal_origen = :sucursal'; binds.sucursal = sucursal; }
    sql += ' ORDER BY e.fecha_solicitud DESC';
    const result = await db.execute(sql, binds);
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) { next(error); }
});

// POST /api/entregas
router.post('/', async (req, res, next) => {
  try {
    const { id_venta, id_sucursal_origen, id_cliente, direccion_entrega, telefono_contacto, id_repartidor, costo_envio } = req.body;
    // Fecha estimada: 2 horas desde ahora
    const result = await db.execute(
      `INSERT INTO entregas (id_venta, id_sucursal_origen, id_cliente, direccion_entrega, telefono_contacto, fecha_estimada, id_repartidor, costo_envio)
       VALUES (:id_venta, :id_sucursal_origen, :id_cliente, :direccion_entrega, :telefono_contacto, CURRENT_TIMESTAMP + INTERVAL '2' HOUR, :id_repartidor, :costo_envio)
       RETURNING id_entrega INTO :id`,
      {
        id_venta, id_sucursal_origen, id_cliente, direccion_entrega,
        telefono_contacto: telefono_contacto || null,
        id_repartidor: id_repartidor || null,
        costo_envio: costo_envio || 0,
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
      }
    );
    res.status(201).json({ success: true, message: 'Entrega programada', data: { id_entrega: result.outBinds.id[0] } });
  } catch (error) { next(error); }
});

// PUT /api/entregas/:id/estado
router.put('/:id/estado', async (req, res, next) => {
  try {
    const { estado } = req.body;
    const updates = { est: estado, id: req.params.id };
    let sql = 'UPDATE entregas SET estado = :est';
    if (estado === 'EN_CAMINO') sql += ', id_repartidor = :rep';
    if (estado === 'ENTREGADO') sql += ', fecha_entrega = CURRENT_TIMESTAMP';
    sql += ' WHERE id_entrega = :id';

    if (estado === 'EN_CAMINO' && req.body.id_repartidor) {
      updates.rep = req.body.id_repartidor;
    }

    await db.execute(sql, updates);
    res.json({ success: true, message: `Entrega actualizada a ${estado}` });
  } catch (error) { next(error); }
});

module.exports = router;
