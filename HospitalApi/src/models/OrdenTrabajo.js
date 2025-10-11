const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenTrabajo = sequelize.define('orden_trabajo', {
  orden_id: {
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
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cliente',
      key: 'cliente_id'
    }
  },
  contrato_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'contrato',
      key: 'contrato_id'
    }
  },
  fecha_apertura: {
    type: DataTypes.DATE
  },
  prioridad: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['Baja', 'Media', 'Alta', 'Crítica']]
    }
  },
  estado: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['Abierta', 'Asignada', 'En Proceso', 'En Espera', 'Cerrada', 'Cancelada']]
    }
  },
  falla_reportada: {
    type: DataTypes.TEXT
  },
  origen: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['Llamada', 'Portal', 'PM', 'Alarma Remota', 'Email']]
    }
  }
}, {
  tableName: 'orden_trabajo',
  timestamps: false
});

module.exports = OrdenTrabajo;