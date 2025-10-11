const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EventoOrden = sequelize.define('evento_orden', {
  evento_id: {
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
  fecha_hora: {
    type: DataTypes.DATE
  },
  estado: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['Abierta', 'Asignada', 'En Proceso', 'En Espera', 'Cerrada', 'Cancelada']]
    }
  },
  nota: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'evento_orden',
  timestamps: false
});

module.exports = EventoOrden;