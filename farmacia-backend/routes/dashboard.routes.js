const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/dashboard - Resumen general para auditoría
router.get('/', async (req, res, next) => {
  try {
    // Total sucursales activas
    const sucursales = await db.execute(
      "SELECT COUNT(*) AS total FROM sucursales WHERE estado = 'A'"
    );

    // Total medicamentos
    const medicamentos = await db.execute(
      "SELECT COUNT(*) AS total FROM medicamentos WHERE estado = 'A'"
    );

    // Total empleados activos
    const empleados = await db.execute(
      "SELECT COUNT(*) AS total FROM empleados WHERE estado = 'A'"
    );

    // Ventas del día
    const ventasHoy = await db.execute(
      `SELECT COUNT(*) AS cantidad, NVL(SUM(total),0) AS monto
       FROM ventas WHERE TRUNC(fecha) = TRUNC(CURRENT_TIMESTAMP) AND estado = 'COMPLETADA'`
    );

    // Alertas de stock bajo
    const alertasStock = await db.execute(
      'SELECT COUNT(*) AS total FROM inventario WHERE cantidad <= stock_minimo'
    );

    // Entregas pendientes
    const entregasPendientes = await db.execute(
      "SELECT COUNT(*) AS total FROM entregas WHERE estado IN ('PENDIENTE','EN_CAMINO')"
    );

    // Valor total de inventario
    const valorInventario = await db.execute(
      `SELECT NVL(SUM(i.cantidad * m.precio_venta),0) AS valor_total
       FROM inventario i JOIN medicamentos m ON i.id_medicamento = m.id_medicamento`
    );

    // Valor total de activos fijos
    const valorActivos = await db.execute(
      "SELECT NVL(SUM(valor_actual),0) AS valor_total FROM activos_fijos WHERE estado = 'ACTIVO'"
    );

    res.json({
      success: true,
      data: {
        sucursales_activas: sucursales.rows[0].TOTAL,
        medicamentos_registrados: medicamentos.rows[0].TOTAL,
        empleados_activos: empleados.rows[0].TOTAL,
        ventas_hoy: {
          cantidad: ventasHoy.rows[0].CANTIDAD,
          monto: ventasHoy.rows[0].MONTO,
        },
        alertas_stock_bajo: alertasStock.rows[0].TOTAL,
        entregas_pendientes: entregasPendientes.rows[0].TOTAL,
        valor_inventario: valorInventario.rows[0].VALOR_TOTAL,
        valor_activos_fijos: valorActivos.rows[0].VALOR_TOTAL,
      },
    });
  } catch (error) { next(error); }
});

// GET /api/dashboard/ventas-por-sucursal
router.get('/ventas-por-sucursal', async (req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT s.nombre AS sucursal, COUNT(v.id_venta) AS total_ventas,
              NVL(SUM(v.total),0) AS monto_total
       FROM sucursales s
       LEFT JOIN ventas v ON s.id_sucursal = v.id_sucursal AND v.estado = 'COMPLETADA'
       WHERE s.estado = 'A'
       GROUP BY s.nombre ORDER BY monto_total DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

// GET /api/dashboard/flujo-mensual
router.get('/flujo-mensual', async (req, res, next) => {
  try {
    const result = await db.execute(
      `SELECT TO_CHAR(fecha, 'YYYY-MM') AS mes,
              SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END) AS ingresos,
              SUM(CASE WHEN tipo = 'EGRESO' THEN monto ELSE 0 END) AS egresos,
              SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE -monto END) AS balance
       FROM flujo_efectivo
       WHERE fecha >= ADD_MONTHS(CURRENT_TIMESTAMP, -12)
       GROUP BY TO_CHAR(fecha, 'YYYY-MM')
       ORDER BY mes`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) { next(error); }
});

module.exports = router;
