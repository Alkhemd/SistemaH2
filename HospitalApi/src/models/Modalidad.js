const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Modalidad = sequelize.define('modalidad', {
  modalidad_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 10]
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 255]
    }
  }
}, {
  tableName: 'modalidad',
  timestamps: false
});

module.exports = Modalidad;