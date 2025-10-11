const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipo = sequelize.define('equipo', {
  equipo_id: {
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
  modalidad_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modalidad',
      key: 'modalidad_id'
    }
  },
  fabricante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'fabricante',
      key: 'fabricante_id'
    }
  },
  contrato_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'contrato',
      key: 'contrato_id'
    }
  },
  modelo: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 255]
    }
  },
  numero_serie: {
    type: DataTypes.TEXT,
    unique: true,
    validate: {
      len: [0, 100]
    }
  },
  asset_tag: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 50]
    }
  },
  fecha_instalacion: {
    type: DataTypes.DATEONLY
  },
  estado_equipo: {
    type: DataTypes.TEXT,
    validate: {
      isIn: [['Operativo', 'En_Mantenimiento', 'Fuera_Servicio', 'Desinstalado']]
    }
  },
  ubicacion: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 100]
    }
  },
  software_version: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 50]
    }
  },
  horas_uso: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  },
  garantia_hasta: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'equipo',
  timestamps: false
});

module.exports = Equipo;