const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/movimientos
router.get('/', async (req, res, next) => {
  try {
    const { estado, sucursal } = req.query;
    let sql = `SELECT mi.*, m.nombre AS medicamento,
               so.nombre AS sucursal_origen, sd.nombre AS sucursal_destino
               FROM movimientos_inventario mi
               JOIN medicamentos m ON mi.id_medicamento = m.id_medicamento
               JOIN sucursales so ON mi.id_sucursal_origen = so.id_sucursal
               JOIN sucursales sd ON mi.id_sucursal_destino = sd.id_sucursal WHERE 1=1`;
    const binds = {};
    if (estado) { sql += ' AND mi.estado = :estado'; binds.estado = estado; }
    if (sucursal) { sql += ' AND (mi.id_sucursal_origen = :suc OR mi.id_sucursal_destino = :suc)'; binds.suc = sucursal; }
    sql += ' ORDER BY mi.fecha_solicitud DESC';
    const result = await db.execute(sql, binds);
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) { next(error); }
});

// POST /api/movimientos - Solicitar traslado
router.post('/', async (req, res, next) => {
  try {
    const { id_medicamento, id_sucursal_origen, id_sucursal_destino, cantidad, observaciones } = req.body;

    // Verificar stock disponible en origen
    const stockResult = await db.execute(
      'SELECT cantidad FROM inventario WHERE id_sucursal = :suc AND id_medicamento = :med',
      { suc: id_sucursal_origen, med: id_medicamento }
    );
    if (stockResult.rows.length === 0 || stockResult.rows[0].CANTIDAD < cantidad) {
      return res.status(400).json({ success: false, message: 'Stock insuficiente en sucursal origen' });
    }

    const result = await db.execute(
      `INSERT INTO movimientos_inventario (id_medicamento, id_sucursal_origen, id_sucursal_destino, cantidad, id_usuario, observaciones)
       VALUES (:id_medicamento, :id_sucursal_origen, :id_sucursal_destino, :cantidad, :id_usuario, :observaciones)
       RETURNING id_movimiento INTO :id`,
      {
        id_medicamento, id_sucursal_origen, id_sucursal_destino, cantidad,
        id_usuario: req.user.id, observaciones: observaciones || null,
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
      }
    );
    res.status(201).json({ success: true, message: 'Traslado solicitado', data: { id_movimiento: result.outBinds.id[0] } });
  } catch (error) { next(error); }
});

// PUT /api/movimientos/:id/enviar
router.put('/:id/enviar', async (req, res, next) => {
  try {
    const connection = await db.getConnection();
    try {
      // Obtener datos del movimiento
      const mov = await connection.execute(
        'SELECT * FROM movimientos_inventario WHERE id_movimiento = :id AND estado = :est',
        { id: req.params.id, est: 'PENDIENTE' }
      );
      if (mov.rows.length === 0) return res.status(404).json({ success: false, message: 'Movimiento no encontrado o ya procesado' });

      const m = mov.rows[0];
      // Descontar del origen
      await connection.execute(
        'UPDATE inventario SET cantidad = cantidad - :cant, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_sucursal = :suc AND id_medicamento = :med',
        { cant: m.CANTIDAD, suc: m.ID_SUCURSAL_ORIGEN, med: m.ID_MEDICAMENTO }
      );
      // Actualizar estado
      await connection.execute(
        'UPDATE movimientos_inventario SET estado = :est, fecha_envio = CURRENT_TIMESTAMP WHERE id_movimiento = :id',
        { est: 'EN_TRANSITO', id: req.params.id }
      );
      await connection.commit();
      res.json({ success: true, message: 'Movimiento enviado' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      await connection.close();
    }
  } catch (error) { next(error); }
});

// PUT /api/movimientos/:id/recibir
router.put('/:id/recibir', async (req, res, next) => {
  try {
    const connection = await db.getConnection();
    try {
      const mov = await connection.execute(
        'SELECT * FROM movimientos_inventario WHERE id_movimiento = :id AND estado = :est',
        { id: req.params.id, est: 'EN_TRANSITO' }
      );
      if (mov.rows.length === 0) return res.status(404).json({ success: false, message: 'Movimiento no encontrado o no está en tránsito' });

      const m = mov.rows[0];
      // Verificar si ya existe en inventario destino
      const invDest = await connection.execute(
        'SELECT id_inventario FROM inventario WHERE id_sucursal = :suc AND id_medicamento = :med',
        { suc: m.ID_SUCURSAL_DESTINO, med: m.ID_MEDICAMENTO }
      );

      if (invDest.rows.length > 0) {
        await connection.execute(
          'UPDATE inventario SET cantidad = cantidad + :cant, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id_sucursal = :suc AND id_medicamento = :med',
          { cant: m.CANTIDAD, suc: m.ID_SUCURSAL_DESTINO, med: m.ID_MEDICAMENTO }
        );
      } else {
        await connection.execute(
          'INSERT INTO inventario (id_sucursal, id_medicamento, cantidad) VALUES (:suc, :med, :cant)',
          { suc: m.ID_SUCURSAL_DESTINO, med: m.ID_MEDICAMENTO, cant: m.CANTIDAD }
        );
      }

      await connection.execute(
        'UPDATE movimientos_inventario SET estado = :est, fecha_recepcion = CURRENT_TIMESTAMP WHERE id_movimiento = :id',
        { est: 'RECIBIDO', id: req.params.id }
      );
      await connection.commit();
      res.json({ success: true, message: 'Movimiento recibido y stock actualizado' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      await connection.close();
    }
  } catch (error) { next(error); }
});

module.exports = router;
