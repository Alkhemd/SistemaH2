const sequelize = require('./src/config/database');
const { QueryTypes } = require('sequelize');
const models = require('./src/models');

/**
 * Script de migración no destructivo para SQLite
 * Agrega columnas faltantes sin eliminar datos existentes
 */

// Mapeo de tipos de Sequelize a tipos de SQLite
const mapSequelizeTypeToSQLite = (sequelizeType) => {
  const typeString = sequelizeType.toString().toUpperCase();
  
  if (typeString.includes('INTEGER')) return 'INTEGER';
  if (typeString.includes('REAL') || typeString.includes('FLOAT') || typeString.includes('DOUBLE')) return 'REAL';
  if (typeString.includes('TEXT') || typeString.includes('STRING')) return 'TEXT';
  if (typeString.includes('BLOB')) return 'BLOB';
  if (typeString.includes('DATE')) return 'TEXT'; // SQLite almacena fechas como TEXT
  if (typeString.includes('BOOLEAN')) return 'INTEGER'; // SQLite almacena booleanos como INTEGER
  
  // Por defecto, usar TEXT
  return 'TEXT';
};

// Obtener información de columnas de una tabla en SQLite
const getTableColumns = async (tableName) => {
  try {
    const columns = await sequelize.query(
      `PRAGMA table_info(${tableName});`,
      { type: QueryTypes.SELECT }
    );
    return columns.map(col => col.name);
  } catch (error) {
    // Si la tabla no existe, retornar array vacío
    return [];
  }
};

// Construir la definición de columna para ALTER TABLE
const buildColumnDefinition = (columnName, columnDef) => {
  let definition = `${columnName} ${mapSequelizeTypeToSQLite(columnDef.type)}`;
  
  // Agregar NOT NULL si es requerido (pero no para nuevas columnas en tablas existentes)
  // SQLite requiere que las nuevas columnas sean NULL o tengan DEFAULT
  if (columnDef.allowNull === false && columnDef.defaultValue !== undefined) {
    definition += ' NOT NULL';
  }
  
  // Agregar DEFAULT si existe
  if (columnDef.defaultValue !== undefined) {
    const defaultValue = columnDef.defaultValue;
    if (typeof defaultValue === 'string') {
      definition += ` DEFAULT '${defaultValue}'`;
    } else if (typeof defaultValue === 'number' || typeof defaultValue === 'boolean') {
      definition += ` DEFAULT ${defaultValue}`;
    }
  }
  
  // Agregar UNIQUE si existe
  if (columnDef.unique) {
    definition += ' UNIQUE';
  }
  
  return definition;
};

// Función principal de migración
const runMigration = async () => {
  console.log('🚀 Iniciando migración de base de datos...');
  
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
    
    // Obtener todos los modelos
    const modelNames = Object.keys(models);
    let totalColumnsAdded = 0;
    let totalTablesAnalyzed = 0;
    
    // Iterar sobre cada modelo
    for (const modelName of modelNames) {
      const model = models[modelName];
      const tableName = model.getTableName();
      
      console.log(`- Analizando tabla '${tableName}'...`);
      totalTablesAnalyzed++;
      
      // Obtener columnas existentes en la base de datos
      const existingColumns = await getTableColumns(tableName);
      
      // Si la tabla no existe, crearla usando sync
      if (existingColumns.length === 0) {
        console.log(`  ⚠️  La tabla '${tableName}' no existe. Creándola...`);
        await model.sync();
        console.log(`  ✅ Tabla '${tableName}' creada exitosamente.`);
        continue;
      }
      
      // Obtener atributos del modelo
      const modelAttributes = model.rawAttributes;
      const modelColumns = Object.keys(modelAttributes);
      
      // Encontrar columnas faltantes
      const missingColumns = modelColumns.filter(
        col => !existingColumns.includes(col)
      );
      
      if (missingColumns.length === 0) {
        console.log(`  (Sin cambios)`);
        continue;
      }
      
      // Agregar cada columna faltante
      for (const columnName of missingColumns) {
        const columnDef = modelAttributes[columnName];
        
        // Saltar columnas virtuales o de asociación
        if (columnDef.type && columnDef.type.key === 'VIRTUAL') {
          continue;
        }
        
        try {
          const columnDefinition = buildColumnDefinition(columnName, columnDef);
          const alterQuery = `ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition};`;
          
          console.log(`  -> Agregando columna '${columnName}' a la tabla '${tableName}'.`);
          
          await sequelize.query(alterQuery);
          totalColumnsAdded++;
          
        } catch (error) {
          // Si la columna ya existe (por alguna razón), solo advertir
          if (error.message.includes('duplicate column name')) {
            console.log(`  ⚠️  La columna '${columnName}' ya existe en la tabla '${tableName}'. Omitiendo...`);
          } else {
            console.error(`  ❌ Error al agregar columna '${columnName}':`, error.message);
          }
        }
      }
    }
    
    // Resumen final
    console.log('✅ Migración completada exitosamente.');
    console.log(`\n📊 Resumen:`);
    console.log(`   - Tablas analizadas: ${totalTablesAnalyzed}`);
    console.log(`   - Columnas agregadas: ${totalColumnsAdded}`);
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Cerrar la conexión
    await sequelize.close();
    console.log('\n🔌 Conexión a la base de datos cerrada.');
  }
};

// Ejecutar la migración
runMigration();
