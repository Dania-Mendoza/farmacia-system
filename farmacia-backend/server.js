require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const database = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================================
// MIDDLEWARES GLOBALES
// ============================================================
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// RUTAS DE LA API
// ============================================================
app.get('/api', (req, res) => {
  const dbStatus = database.getStatus();
  res.json({
    success: true,
    message: 'API Sistema de Farmacias - Seminario de Programación UMG',
    version: '1.0.0',
    oracle_status: dbStatus.connected ? 'CONECTADO (Oracle XE 21c)' : 'MODO_DEMO (Esperando conexión Oracle XE)',
    database_target: dbStatus.database,
    endpoints: {
      auth: '/api/auth',
      sucursales: '/api/sucursales',
      medicamentos: '/api/medicamentos',
      inventario: '/api/inventario',
      movimientos: '/api/movimientos',
      ventas: '/api/ventas',
      empleados: '/api/empleados',
      planilla: '/api/planilla',
      activos: '/api/activos',
      flujoEfectivo: '/api/flujo-efectivo',
      entregas: '/api/entregas',
      dashboard: '/api/dashboard',
    },
  });
});

// Importar rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/sucursales', require('./routes/sucursales.routes'));
app.use('/api/medicamentos', require('./routes/medicamentos.routes'));
app.use('/api/inventario', require('./routes/inventario.routes'));
app.use('/api/movimientos', require('./routes/movimientos.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/empleados', require('./routes/empleados.routes'));
app.use('/api/planilla', require('./routes/planilla.routes'));
app.use('/api/activos', require('./routes/activos.routes'));
app.use('/api/flujo-efectivo', require('./routes/flujoEfectivo.routes'));
app.use('/api/entregas', require('./routes/entregas.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

// ============================================================
// MANEJO DE ERRORES
// ============================================================
app.use(notFound);
app.use(errorHandler);

// ============================================================
// INICIAR SERVIDOR (Con tolerancia a fallas de conexión DB)
// ============================================================
async function startup() {
  try {
    // Intentar inicializar pool de conexiones Oracle
    await database.initialize();
  } catch (err) {
    console.warn('Iniciando servidor Express en modo resiliente...');
  }

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Servidor Backend Activo en http://localhost:${PORT}`);
    console.log(`📋 Explorar Endpoints: http://localhost:${PORT}/api`);
    console.log(`🏥 Seminario de Programación - Universidad Mariano Gálvez`);
    console.log(`======================================================\n`);
  });
}

// Manejar cierre graceful
process.on('SIGTERM', async () => {
  console.log('\nCerrando servidor...');
  await database.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nCerrando servidor...');
  await database.close();
  process.exit(0);
});

startup();
