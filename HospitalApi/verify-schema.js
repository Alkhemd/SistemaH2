const sequelize = require('./src/config/database');
const { QueryTypes } = require('sequelize');
const models = require('./src/models');

/**
 * Script de verificación de esquema
 * Compara el esquema de la base de datos con las definiciones de los modelos
 */

const getTableColumns = async (tableName) => {
  try {
    const columns = await sequelize.query(
      `PRAGMA table_info(${tableName});`,
      { type: QueryTypes.SELECT }
    );
    return columns;
  } catch (error) {
    return [];
  }
};

const verifySchema = async () => {
  console.log('🔍 Verificando esquema de base de datos...\n');
  
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida.\n');
    
    const modelNames = Object.keys(models);
    let totalMismatches = 0;
    
    for (const modelName of modelNames) {
      const model = models[modelName];
      const tableName = model.getTableName();
      
      console.log(`📋 Tabla: ${tableName}`);
      
      const existingColumns = await getTableColumns(tableName);
      const modelAttributes = model.rawAttributes;
      const modelColumns = Object.keys(modelAttributes).filter(
        col => !modelAttributes[col].type || modelAttributes[col].type.key !== 'VIRTUAL'
      );
      
      if (existingColumns.length === 0) {
        console.log(`  ❌ La tabla no existe en la base de datos`);
        totalMismatches++;
      } else {
        const existingColumnNames = existingColumns.map(col => col.name);
        const missingInDB = modelColumns.filter(col => !existingColumnNames.includes(col));
        const extraInDB = existingColumnNames.filter(col => !modelColumns.includes(col));
        
        if (missingInDB.length === 0 && extraInDB.length === 0) {
          console.log(`  ✅ Esquema sincronizado (${existingColumns.length} columnas)`);
        } else {
          if (missingInDB.length > 0) {
            console.log(`  ⚠️  Columnas faltantes en DB: ${missingInDB.join(', ')}`);
            totalMismatches += missingInDB.length;
          }
          if (extraInDB.length > 0) {
            console.log(`  ℹ️  Columnas extra en DB: ${extraInDB.join(', ')}`);
          }
        }
      }
      console.log('');
    }
    
    console.log('═══════════════════════════════════════════════════════');
    if (totalMismatches === 0) {
      console.log('✅ Todos los esquemas están sincronizados');
    } else {
      console.log(`⚠️  Se encontraron ${totalMismatches} diferencias`);
      console.log('💡 Ejecuta "node run-migrations.js" para sincronizar');
    }
    console.log('═══════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

verifySchema();
