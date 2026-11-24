const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/planilla
router.get('/', async (req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT p.*, 
       (SELECT COUNT(*) FROM detalle_planilla dp WHERE dp.id_planilla = p.id_planilla) AS total_empleados
       FROM planilla p ORDER BY p.fecha_creacion DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

// GET /api/planilla/:id - Con detalle
router.get('/:id', async (req, res, next) => {
  try {
    const planilla = await db.execute('SELECT * FROM planilla WHERE id_planilla = :id', [req.params.id]);
    if (planilla.rows.length === 0) return res.status(404).json({ success: false, message: 'Planilla no encontrada' });

    const detalle = await db.execute(
      `SELECT dp.*, e.nombre, e.apellido, e.dpi, p.nombre AS puesto, s.nombre AS sucursal
       FROM detalle_planilla dp
       JOIN empleados e ON dp.id_empleado = e.id_empleado
       JOIN puestos p ON e.id_puesto = p.id_puesto
       JOIN sucursales s ON e.id_sucursal = s.id_sucursal
       WHERE dp.id_planilla = :id ORDER BY e.apellido, e.nombre`, [req.params.id]
    );
    res.json({ success: true, data: { ...planilla.rows[0], detalle: detalle.rows } });
  } catch (error) { next(error); }
});

// POST /api/planilla - Generar planilla
router.post('/', async (req, res, next) => {
  try {
    const { periodo, fecha_inicio, fecha_fin } = req.body;
    const connection = await db.getConnection();

    try {
      // Crear planilla
      const planillaResult = await connection.execute(
        `INSERT INTO planilla (periodo, fecha_inicio, fecha_fin, id_usuario)
         VALUES (:periodo, TO_DATE(:fecha_inicio,'YYYY-MM-DD'), TO_DATE(:fecha_fin,'YYYY-MM-DD'), :id_usuario)
         RETURNING id_planilla INTO :id`,
        {
          periodo, fecha_inicio, fecha_fin, id_usuario: req.user.id,
          id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER },
        }
      );
      const id_planilla = planillaResult.outBinds.id[0];

      // Obtener empleados activos con su salario
      const empleados = await connection.execute(
        `SELECT e.id_empleado, p.salario_base FROM empleados e
         JOIN puestos p ON e.id_puesto = p.id_puesto WHERE e.estado = 'A'`
      );

      let totalPlanilla = 0;
      for (const emp of empleados.rows) {
        const bonificacion = 250.00; // Bonificación incentivo
        const igss = emp.SALARIO_BASE * 0.0483; // 4.83% IGSS
        const isr = emp.SALARIO_BASE > 4000 ? (emp.SALARIO_BASE - 4000) * 0.05 : 0;
        const salarioNeto = emp.SALARIO_BASE + bonificacion - igss - isr;
        totalPlanilla += salarioNeto;

        await connection.execute(
          `INSERT INTO detalle_planilla (id_planilla, id_empleado, salario_base, bonificacion, deduccion_igss, deduccion_isr, salario_neto)
           VALUES (:id_planilla, :id_empleado, :salario_base, :bonificacion, :igss, :isr, :salario_neto)`,
          { id_planilla, id_empleado: emp.ID_EMPLEADO, salario_base: emp.SALARIO_BASE, bonificacion, igss, isr, salario_neto: salarioNeto }
        );
      }

      // Actualizar total
      await connection.execute(
        'UPDATE planilla SET total = :total WHERE id_planilla = :id',
        { total: totalPlanilla, id: id_planilla }
      );

      await connection.commit();
      res.status(201).json({
        success: true, message: 'Planilla generada',
        data: { id_planilla, total_empleados: empleados.rows.length, total: totalPlanilla }
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      await connection.close();
    }
  } catch (error) { next(error); }
});

// PUT /api/planilla/:id/pagar
router.put('/:id/pagar', async (req, res, next) => {
  try {
    const connection = await db.getConnection();
    try {
      const planilla = await connection.execute(
        'SELECT * FROM planilla WHERE id_planilla = :id AND estado = :est',
        { id: req.params.id, est: 'PENDIENTE' }
      );
      if (planilla.rows.length === 0) return res.status(400).json({ success: false, message: 'Planilla no encontrada o ya fue pagada' });

      await connection.execute(
        'UPDATE planilla SET estado = :est, fecha_pago = SYSDATE WHERE id_planilla = :id',
        { est: 'PAGADA', id: req.params.id }
      );

      // Registrar en flujo de efectivo (egreso global, se distribuye por sucursal)
      const detalle = await connection.execute(
        `SELECT e.id_sucursal, SUM(dp.salario_neto) AS total_sucursal
         FROM detalle_planilla dp JOIN empleados e ON dp.id_empleado = e.id_empleado
         WHERE dp.id_planilla = :id GROUP BY e.id_sucursal`, [req.params.id]
      );
      for (const row of detalle.rows) {
        await connection.execute(
          `INSERT INTO flujo_efectivo (id_sucursal, tipo, concepto, monto, referencia_tipo, referencia_id, id_usuario)
           VALUES (:suc, 'EGRESO', 'Pago de planilla', :monto, 'PLANILLA', :ref, :usr)`,
          { suc: row.ID_SUCURSAL, monto: row.TOTAL_SUCURSAL, ref: parseInt(req.params.id), usr: req.user.id }
        );
      }

      await connection.commit();
      res.json({ success: true, message: 'Planilla pagada y registrada en flujo de efectivo' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      await connection.close();
    }
  } catch (error) { next(error); }
});

module.exports = router;
