const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MantenimientoPM = sequelize.define('mantenimiento_pm', {
  pm_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  equipo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'equipo',
      key: 'equipo_id'
    }
  },
  fecha_programada: {
    type: DataTypes.DATEONLY
  },
  fecha_ejecucion: {
    type: DataTypes.DATEONLY
  },
  tecnico_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'tecnico',
      key: 'tecnico_id'
    }
  },
  checklist_ok: {
    type: DataTypes.INTEGER,
    validate: {
      isIn: [[0, 1]]
    }
  },
  observaciones: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'mantenimiento_pm',
  timestamps: false
});

module.exports = MantenimientoPM;