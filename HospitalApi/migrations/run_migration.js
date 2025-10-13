const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ruta a la base de datos
const dbPath = path.join(__dirname, '../database/sistema_h.db');

// Verificar que existe la base de datos
if (!fs.existsSync(dbPath)) {
  console.error('❌ Error: No se encontró la base de datos en:', dbPath);
  process.exit(1);
}

// Conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado a la base de datos SQLite');
});

// SQL para agregar las columnas
const migrations = [
  {
    name: 'Agregar columna ultima_calibracion',
    sql: `ALTER TABLE equipo ADD COLUMN ultima_calibracion TEXT;`
  },
  {
    name: 'Agregar columna proxima_calibracion',
    sql: `ALTER TABLE equipo ADD COLUMN proxima_calibracion TEXT;`
  }
];

// Función para ejecutar una migración
function runMigration(migration) {
  return new Promise((resolve, reject) => {
    db.run(migration.sql, (err) => {
      if (err) {
        // Si el error es porque la columna ya existe, lo ignoramos
        if (err.message.includes('duplicate column name')) {
          console.log(`⚠️  ${migration.name}: La columna ya existe, omitiendo...`);
          resolve();
        } else {
          console.error(`❌ Error en ${migration.name}:`, err.message);
          reject(err);
        }
      } else {
        console.log(`✅ ${migration.name}: Completado`);
        resolve();
      }
    });
  });
}

// Ejecutar todas las migraciones
async function runAllMigrations() {
  console.log('\n🚀 Iniciando migraciones...\n');
  
  try {
    for (const migration of migrations) {
      await runMigration(migration);
    }
    
    console.log('\n✅ Todas las migraciones completadas exitosamente\n');
  } catch (error) {
    console.error('\n❌ Error durante las migraciones:', error.message);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('❌ Error al cerrar la base de datos:', err.message);
      } else {
        console.log('✅ Conexión a la base de datos cerrada');
      }
    });
  }
}

// Ejecutar
runAllMigrations();
