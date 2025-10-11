const BaseController = require('./BaseController');
const { Equipo } = require('../models');
const { Op } = require('sequelize');

class EquipoController extends BaseController {
  constructor() {
    super(Equipo, 'Equipo');
  }

  // Sobrescribir getAll para incluir relaciones
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, estado_equipo, modalidad, fabricante, cliente } = req.query;
      const offset = (page - 1) * limit;
      
      const whereConditions = {};
      
      // Aplicar filtros
      if (estado_equipo) whereConditions.estado_equipo = estado_equipo;
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        where: whereConditions,
        include: [
          { association: 'cliente' },
          { association: 'modalidad' },
          { association: 'fabricante' },
          { association: 'contrato' }
        ]
      };

      const { count, rows } = await this.model.findAndCountAll(options);
      
      res.json({
        success: true,
        data: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error en getAll Equipos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener equipos',
        error: error.message
      });
    }
  }

  // Obtener equipos por estado
  async getByEstado(req, res) {
    try {
      const { estado } = req.params;
      const equipos = await Equipo.findAll({
        where: { estado_equipo: estado },
        include: [
          { association: 'cliente' },
          { association: 'modalidad' },
          { association: 'fabricante' }
        ]
      });

      res.json({
        success: true,
        data: equipos,
        count: equipos.length
      });
    } catch (error) {
      console.error('Error en getByEstado:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar equipos por estado',
        error: error.message
      });
    }
  }

  // Buscar equipos por número de serie
  async getBySerial(req, res) {
    try {
      const { serial } = req.params;
      const equipo = await Equipo.findOne({
        where: { numero_serie: serial },
        include: [
          { association: 'cliente' },
          { association: 'modalidad' },
          { association: 'fabricante' },
          { association: 'contrato' }
        ]
      });

      if (!equipo) {
        return res.status(404).json({
          success: false,
          message: 'Equipo no encontrado'
        });
      }

      res.json({
        success: true,
        data: equipo
      });
    } catch (error) {
      console.error('Error en getBySerial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar equipo por número de serie',
        error: error.message
      });
    }
  }

  // Obtener historial completo del equipo
  async getHistorial(req, res) {
    try {
      const { id } = req.params;
      const equipo = await Equipo.findByPk(id, {
        include: [
          { association: 'cliente' },
          { association: 'modalidad' },
          { association: 'fabricante' },
          { 
            association: 'ordenes_trabajo',
            include: [
              { association: 'eventos' },
              { 
                association: 'intervenciones',
                include: [
                  { association: 'tecnico' },
                  { 
                    association: 'partes_usadas',
                    include: [{ association: 'parte' }]
                  }
                ]
              }
            ]
          },
          { 
            association: 'mantenimientos_pm',
            include: [{ association: 'tecnico' }]
          },
          { 
            association: 'calibraciones_qc',
            include: [{ association: 'tecnico' }]
          }
        ]
      });

      if (!equipo) {
        return res.status(404).json({
          success: false,
          message: 'Equipo no encontrado'
        });
      }

      res.json({
        success: true,
        data: equipo
      });
    } catch (error) {
      console.error('Error en getHistorial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener historial del equipo',
        error: error.message
      });
    }
  }
}

module.exports = new EquipoController();