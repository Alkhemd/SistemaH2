const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PartesUsadas = sequelize.define('partes_usadas', {
  partes_usadas_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  intervencion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'intervencion',
      key: 'intervencion_id'
    }
  },
  parte_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'parte',
      key: 'parte_id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1
    }
  },
  costo_unitario: {
    type: DataTypes.REAL,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'partes_usadas',
  timestamps: false
});

module.exports = PartesUsadas;