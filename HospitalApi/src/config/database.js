const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/sistema_h.db'),
  logging: process.env.NODE_ENV === 'development' && process.env.SQL_LOGGING === 'true' ? console.log : false,
  define: {
    timestamps: false, // Las tablas no tienen campos created_at/updated_at
    freezeTableName: true // Usar nombres de tabla exactos sin pluralización
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // Opciones de seguridad y rendimiento
  dialectOptions: {
    // Habilitar foreign keys en SQLite
    foreignKeys: true
  },
  // Retry logic para conexiones
  retry: {
    max: 3,
    timeout: 3000
  }
});

module.exports = sequelize;