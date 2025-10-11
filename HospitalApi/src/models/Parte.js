const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parte = sequelize.define('parte', {
  parte_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fabricante: {
    type: DataTypes.TEXT
  },
  numero_parte: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 100]
    }
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  costo_unitario: {
    type: DataTypes.REAL,
    validate: {
      min: 0
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  },
  ubicacion: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 100]
    }
  }
}, {
  tableName: 'parte',
  timestamps: false
});

module.exports = Parte;