const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Intervencion = sequelize.define('intervencion', {
  intervencion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orden_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orden_trabajo',
      key: 'orden_id'
    }
  },
  tecnico_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tecnico',
      key: 'tecnico_id'
    }
  },
  fecha_inicio: {
    type: DataTypes.DATE
  },
  fecha_fin: {
    type: DataTypes.DATE
  },
  horas_labor: {
    type: DataTypes.REAL,
    validate: {
      min: 0,
      max: 24
    }
  },
  accion_realizada: {
    type: DataTypes.TEXT
  },
  causa_raiz: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['Desgaste', 'Fallo eléctrico', 'Firmware desactualizado', 'Uso inadecuado', 'Condensación', 'Conector suelto', 'Otro']]
    }
  },
  resultado: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['Reparado', 'Temporal', 'No_Falla', 'Requiere_Seguimiento', 'Requiere_Pieza']]
    }
  }
}, {
  tableName: 'intervencion',
  timestamps: false
});

module.exports = Intervencion;