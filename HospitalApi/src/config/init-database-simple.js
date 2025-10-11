const sequelize = require('./database');

// Importar todos los modelos
require('../models');

async function initDatabase() {
  try {
    console.log('🔄 Inicializando base de datos...');
    
    // Sincronizar todos los modelos con la base de datos
    // force: true eliminará las tablas existentes y las recreará
    await sequelize.sync({ force: true });
    
    console.log('✅ Base de datos inicializada correctamente');
    console.log('✅ Todas las tablas han sido creadas');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

initDatabase();
