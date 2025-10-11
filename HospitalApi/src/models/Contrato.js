const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contrato = sequelize.define('contrato', {
  contrato_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cliente',
      key: 'cliente_id'
    }
  },
  tipo: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['Full', 'T&M', 'PM', 'Garantia']]
    }
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY
  },
  fecha_fin: {
    type: DataTypes.DATEONLY
  },
  sla_horas_respuesta: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 168 // máximo una semana
    }
  },
  visitas_pm_anuales: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 12
    }
  },
  cobertura: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['Solo_PM', 'Mano_Obra', 'Piezas+Mano_Obra']]
    }
  }
}, {
  tableName: 'contrato',
  timestamps: false
});

module.exports = Contrato;