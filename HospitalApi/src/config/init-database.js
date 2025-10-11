const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Crear directorio de base de datos si no existe
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'sistema_h.db');

// Si la base de datos ya existe, eliminarla para crear una nueva
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Base de datos existente eliminada');
}

// Leer el script SQL del archivo sql.md
const sqlPath = path.join(__dirname, '../../..', 'sql.md');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

// Crear y conectar a la base de datos
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error al crear la base de datos:', err.message);
    process.exit(1);
  }
  console.log('Conectado a la base de datos SQLite');
});

// Ejecutar el script SQL
db.exec(sqlContent, (err) => {
  if (err) {
    console.error('Error al ejecutar el script SQL:', err.message);
    process.exit(1);
  }
  
  console.log('Base de datos inicializada correctamente');
  
  // Verificar que las tablas se crearon
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error al listar tablas:', err.message);
    } else {
      console.log('Tablas creadas:');
      tables.forEach(table => {
        console.log(`- ${table.name}`);
      });
    }
    
    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
      } else {
        console.log('Conexión a la base de datos cerrada');
      }
    });
  });
});