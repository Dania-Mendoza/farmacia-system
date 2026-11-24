const oracledb = require('oracledb');

// Configurar oracledb para retornar objetos
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

// Estado del pool de conexiones
let pool = null;
let isConnected = false;

async function initialize() {
  const user = (process.env.DB_USER || 'ADMIN').trim();
  const password = (process.env.DB_PASSWORD || '').trim();
  let connectString = (process.env.DB_CONNECT_STRING || '').trim();

  // Quitar comillas accidentales si las tiene
  if (connectString.startsWith('"') && connectString.endsWith('"')) {
    connectString = connectString.slice(1, -1);
  }

  try {
    console.log(`📡 Conectando a Oracle Cloud Autonomous Database (${user})...`);
    pool = await oracledb.createPool({
      user,
      password,
      connectString,
      poolMin: parseInt(process.env.DB_POOL_MIN) || 1,
      poolMax: parseInt(process.env.DB_POOL_MAX) || 5,
      poolIncrement: 1,
    });
    isConnected = true;
    console.log('✅ ¡Conexión con Oracle Cloud (FARMACIASDB TLS) establecida exitosamente!');
  } catch (err) {
    isConnected = false;
    console.warn('\n⚠️ [Aviso de Conexión Oracle Cloud]:');
    console.warn(`   No se pudo conectar a la base de datos (${err.message}).`);
    console.warn('   💡 Verifica que tu contraseña en farmacia-backend/.env coincida con la que creaste en Oracle Cloud.');
    console.warn('   💡 El backend continuará operando en modo desarrollo/demostración.\n');
  }
}

async function close() {
  if (pool) {
    try {
      await pool.close(5);
      isConnected = false;
      console.log('Pool de conexiones Oracle cerrado.');
    } catch (err) {
      console.error('Error cerrando pool:', err.message);
    }
  }
}

async function getConnection() {
  if (!isConnected || !pool) {
    throw new Error('No hay conexión activa a Oracle Cloud.');
  }
  return await pool.getConnection();
}

// Función para ejecutar queries con fallback
async function execute(sql, binds = [], options = {}) {
  if (!isConnected || !pool) {
    return { rows: [], outBinds: {}, isMock: true };
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options,
    });
    return result;
  } catch (err) {
    console.error('Error ejecutando query en Oracle Cloud:', err.message);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error cerrando conexión:', err.message);
      }
    }
  }
}

function getStatus() {
  return {
    connected: isConnected,
    database: 'Oracle Cloud Autonomous Database (FARMACIASDB - US East Ashburn)',
    user: process.env.DB_USER || 'ADMIN',
  };
}

module.exports = { initialize, close, getConnection, execute, getStatus };
