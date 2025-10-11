const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tecnico = sequelize.define('tecnico', {
  tecnico_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  especialidad: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['XR', 'CT', 'MR', 'US', 'MG', 'PET/CT', 'Multi-mod', 'DEXA', 'RF', 'CATH']]
    }
  },
  certificaciones: {
    type: DataTypes.TEXT
  },
  telefono: {
    type: DataTypes.TEXT,
    validate: {
      is: /^[\+]?[0-9\s\-\(\)]+$/
    }
  },
  email: {
    type: DataTypes.TEXT,
    validate: {
      isEmail: true
    }
  },
  base_ciudad: {
    type: DataTypes.TEXT
  },
  activo: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      isIn: [[0, 1]]
    }
  }
}, {
  tableName: 'tecnico',
  timestamps: false
});

module.exports = Tecnico;