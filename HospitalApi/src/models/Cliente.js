const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('cliente', {
  cliente_id: {
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
  tipo: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['Hospital', 'Clínica', 'Centro Médico', 'Laboratorio']]
    }
  },
  direccion: {
    type: DataTypes.TEXT
  },
  ciudad: {
    type: DataTypes.TEXT
  },
  estado: {
    type: DataTypes.TEXT
  },
  pais: {
    type: DataTypes.TEXT
  },
  contacto: {
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
  }
}, {
  tableName: 'cliente',
  timestamps: false
});

module.exports = Cliente;