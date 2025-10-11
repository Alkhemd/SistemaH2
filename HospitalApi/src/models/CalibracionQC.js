const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CalibracionQC = sequelize.define('calibracion_qc', {
  qc_id: {
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
  fecha: {
    type: DataTypes.DATEONLY
  },
  tecnico_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'tecnico',
      key: 'tecnico_id'
    }
  },
  prueba: {
    type: DataTypes.TEXT
  },
  valor: {
    type: DataTypes.REAL
  },
  unidad: {
    type: DataTypes.TEXT
  },
  resultado: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['OK', 'FUERA_RANGO', 'NO_APLICA']]
    }
  },
  observaciones: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'calibracion_qc',
  timestamps: false
});

module.exports = CalibracionQC;