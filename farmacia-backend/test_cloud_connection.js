require('dotenv').config();
const oracledb = require('oracledb');

async function testConnection() {
  console.log('======================================================');
  console.log('🧪 PRUEBA DE CONEXIÓN ORACLE CLOUD (TLS SIN WALLET)');
  console.log('======================================================');

  const user = (process.env.DB_USER || 'ADMIN').trim();
  const password = (process.env.DB_PASSWORD || '').trim();
  let connectString = (process.env.DB_CONNECT_STRING || '').trim();

  if (connectString.startsWith('"') && connectString.endsWith('"')) {
    connectString = connectString.slice(1, -1);
  }

  console.log(`Usuario: ${user}`);
  console.log(`Password configurado: ${password ? '***** (establecido)' : '❌ VACÍO'}`);
  console.log(`Destino: adb.us-ashburn-1.oraclecloud.com:1521 (farmaciasdb_high)`);
  console.log('Intentando conectar en modo Thin (TLS directo)...\n');

  try {
    const connection = await oracledb.getConnection({
      user,
      password,
      connectString,
    });

    console.log('🎉 ¡CONEXIÓN EXITOSA CON ORACLE CLOUD!');
    
    // Probar consulta a las tablas creadas
    const result = await connection.execute(
      'SELECT nombre, direccion, horario_apertura, horario_cierre FROM sucursales'
    );

    console.log(`\n📋 Farmacias y Stands encontrados en la nube (${result.rows.length} sedes):`);
    result.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row[0]} | ${row[1]}`);
    });

    await connection.close();
    console.log('\n======================================================');
    console.log('✅ Todo listo para correr el proyecto conectado a la nube.');
    console.log('======================================================');
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    if (err.message.includes('ORA-01017')) {
      console.log('\n💡 Tip: ORA-01017 significa usuario o contraseña incorrectos.');
      console.log('   Asegúrate de editar farmacia-backend/.env y colocar la contraseña correcta de ADMIN.');
    }
  }
}

testConnection();
