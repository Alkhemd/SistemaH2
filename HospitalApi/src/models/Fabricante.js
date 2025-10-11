const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fabricante = sequelize.define('fabricante', {
  fabricante_id: {
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
  pais: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 100]
    }
  },
  soporte_tel: {
    type: DataTypes.TEXT,
    validate: {
      is: /^[\+]?[0-9\s\-\(\)]+$/
    }
  },
  web: {
    type: DataTypes.TEXT,
    validate: {
      isUrl: true
    }
  }
}, {
  tableName: 'fabricante',
  timestamps: false
});

module.exports = Fabricante;