const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/ventas
router.get('/', async (req, res, next) => {
  try {
    const { sucursal, fecha_inicio, fecha_fin } = req.query;
    let sql = `SELECT v.*, s.nombre AS sucursal, 
               c.nombre || ' ' || c.apellido AS cliente,
               e.nombre || ' ' || e.apellido AS empleado
               FROM ventas v
               JOIN sucursales s ON v.id_sucursal = s.id_sucursal
               LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
               JOIN empleados e ON v.id_empleado = e.id_empleado WHERE 1=1`;
    const binds = {};
    if (sucursal) { sql += ' AND v.id_sucursal = :sucursal'; binds.sucursal = sucursal; }
    if (fecha_inicio) { sql += ' AND v.fecha >= TO_TIMESTAMP(:fi, \'YYYY-MM-DD\')'; binds.fi = fecha_inicio; }
    if (fecha_fin) { sql += ' AND v.fecha < TO_TIMESTAMP(:ff, \'YYYY-MM-DD\') + 1'; binds.ff = fecha_fin; }
    sql += ' ORDER BY v.fecha DESC';
    const result = await db.execute(sql, binds);
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) { next(error); }
});

// GET /api/ventas/:id - Venta con detalle
router.get('/:id', async (req, res, next) => {
  try {
    const venta = await db.execute(
      `SELECT v.*, s.nombre AS sucursal, c.nombre || ' ' || c.apellido AS cliente,
       e.nombre || ' ' || e.apellido AS empleado FROM ventas v
       JOIN sucursales s ON v.id_sucursal = s.id_sucursal
       LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
       JOIN empleados e ON v.id_empleado = e.id_empleado
       WHERE v.id_venta = :id`, [req.params.id]
    );
    if (venta.rows.length === 0) return res.status(404).json({ success: false, message: 'Venta no encontrada' });

    const detalle = await db.execute(
      `SELECT dv.*, m.nombre AS medicamento FROM detalle_ventas dv
       JOIN medicamentos m ON dv.id_medicamento = m.id_medicamento
       WHERE dv.id_venta = :id`, [req.params.id]
    );
    res.json({ success: true, data: { ...venta.rows[0], detalle: detalle.rows } });
  } catch (error) { next(error); }
});

// POST /api/ventas - Registrar venta completa
router.post('/', async (req, res, next) => {
  try {
    const { id_sucursal, id_cliente, id_empleado, tipo_pago, items } = req.body;
    const connection = await db.getConnection();

    try {
      let subtotal = 0;
      // Calcular subtotal
      for (const item of items) {
        subtotal += item.cantidad * item.precio_unitario;
      }
      const impuesto = 0; // IVA ya incluido en Guatemala
      const total = subtotal;

      // Insertar venta
      const ventaResult = await connection.execute(
        `INSERT INTO ventas (id_sucursal, id_cliente, id_empleado, subtotal, impuesto, total, tipo_pago)
         VALUES (:id_sucursal, :id_cliente, :id_empleado, :subtotal, :impuesto, :total, :tipo_pago)
         RETURNING id_venta INTO :id`,
        {
          id_sucursal, id_cliente: id_cliente || null, id_empleado,
          subtotal, impuesto, total, tipo_pago: tipo_pago || 'EFECTIVO',
          id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
        }
      );
      const id_venta = ventaResult.outBinds.id[0];

      // Insertar detalle y actualizar inventario
      for (const item of items) {
        const itemSubtotal = item.cantidad * item.precio_unitario;
        await connection.execute(
          `INSERT INTO detalle_ventas (id_venta, id_medicamento, cantidad, precio_unitario, subtotal)
           VALUES (:id_venta, :id_medicamento, :cantidad, :precio_unitario, :subtotal)`,
          { id_venta, id_medicamento: item.id_medicamento, cantidad: item.cantidad, precio_unitario: item.precio_unitario, subtotal: itemSubtotal }
        );
        // Descontar inventario
        await connection.execute(
          `UPDATE inventario SET cantidad = cantidad - :cant, fecha_actualizacion = CURRENT_TIMESTAMP
           WHERE id_sucursal = :suc AND id_medicamento = :med`,
          { cant: item.cantidad, suc: id_sucursal, med: item.id_medicamento }
        );
      }

      // Registrar en flujo de efectivo
      await connection.execute(
        `INSERT INTO flujo_efectivo (id_sucursal, tipo, concepto, monto, referencia_tipo, referencia_id, id_usuario)
         VALUES (:id_sucursal, 'INGRESO', 'Venta de medicamentos', :monto, 'VENTA', :ref_id, :id_usuario)`,
        { id_sucursal, monto: total, ref_id: id_venta, id_usuario: req.user.id }
      );

      await connection.commit();
      res.status(201).json({ success: true, message: 'Venta registrada', data: { id_venta, total } });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      await connection.close();
    }
  } catch (error) { next(error); }
});

module.exports = router;
