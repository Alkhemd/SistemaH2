const BaseController = require('./BaseController');
const { OrdenTrabajo } = require('../models');
const { Op } = require('sequelize');

class OrdenTrabajoController extends BaseController {
  constructor() {
    super(OrdenTrabajo, 'Orden de Trabajo');
  }

  // Sobrescribir getAll para incluir relaciones
  async getAll(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        estado, 
        prioridad, 
        fecha_desde, 
        fecha_hasta,
        cliente_id,
        equipo_id
      } = req.query;
      
      const offset = (page - 1) * limit;
      const whereConditions = {};
      
      // Aplicar filtros
      if (estado) whereConditions.estado = estado;
      if (prioridad) whereConditions.prioridad = prioridad;
      if (cliente_id) whereConditions.cliente_id = cliente_id;
      if (equipo_id) whereConditions.equipo_id = equipo_id;
      
      if (fecha_desde && fecha_hasta) {
        whereConditions.fecha_apertura = {
          [Op.between]: [fecha_desde, fecha_hasta]
        };
      }

      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        where: whereConditions,
        include: [
          { association: 'cliente' },
          { 
            association: 'equipo',
            include: [
              { association: 'modalidad' },
              { association: 'fabricante' }
            ]
          },
          { association: 'contrato' }
        ],
        order: [['fecha_apertura', 'DESC']]
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
      console.error('Error en getAll Órdenes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener órdenes de trabajo',
        error: error.message
      });
    }
  }

  // Obtener orden con historial completo
  async getWithHistorial(req, res) {
    try {
      const { id } = req.params;
      const orden = await OrdenTrabajo.findByPk(id, {
        include: [
          { association: 'cliente' },
          { 
            association: 'equipo',
            include: [
              { association: 'modalidad' },
              { association: 'fabricante' }
            ]
          },
          { association: 'contrato' },
          { 
            association: 'eventos',
            order: [['fecha_hora', 'ASC']]
          },
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
      });

      if (!orden) {
        return res.status(404).json({
          success: false,
          message: 'Orden de trabajo no encontrada'
        });
      }

      res.json({
        success: true,
        data: orden
      });
    } catch (error) {
      console.error('Error en getWithHistorial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener orden con historial',
        error: error.message
      });
    }
  }

  // Obtener órdenes por estado
  async getByEstado(req, res) {
    try {
      const { estado } = req.params;
      const ordenes = await OrdenTrabajo.findAll({
        where: { estado },
        include: [
          { association: 'cliente' },
          { 
            association: 'equipo',
            include: [
              { association: 'modalidad' },
              { association: 'fabricante' }
            ]
          }
        ],
        order: [['fecha_apertura', 'DESC']]
      });

      res.json({
        success: true,
        data: ordenes,
        count: ordenes.length
      });
    } catch (error) {
      console.error('Error en getByEstado:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar órdenes por estado',
        error: error.message
      });
    }
  }

  // Dashboard - estadísticas de órdenes y equipos
  async getEstadisticas(req, res) {
    try {
      const { Equipo } = require('../models');
      
      const [
        totalEquipos,
        equiposOperativos,
        equiposMantenimiento,
        equiposFueraServicio,
        ordenesAbiertas,
        ordenesEnProceso,
        ordenesCerradas,
        ordenesCriticas
      ] = await Promise.all([
        Equipo.count(),
        Equipo.count({ where: { estado_equipo: 'Operativo' } }),
        Equipo.count({ where: { estado_equipo: 'En_Mantenimiento' } }),
        Equipo.count({ where: { estado_equipo: 'Fuera_Servicio' } }),
        OrdenTrabajo.count({ where: { estado: 'Abierta' } }),
        OrdenTrabajo.count({ where: { estado: 'En Proceso' } }),
        OrdenTrabajo.count({ where: { estado: 'Cerrada' } }),
        OrdenTrabajo.count({ where: { prioridad: 'Crítica' } })
      ]);

      res.json({
        success: true,
        data: {
          // Estadísticas de equipos (para el dashboard)
          totalEquipos,
          equiposOperativos,
          equiposMantenimiento,
          equiposFueraServicio,
          // Estadísticas de órdenes
          ordenesAbiertas,
          ordenesEnProceso,
          ordenesCerradas,
          ordenesCriticas
        }
      });
    } catch (error) {
      console.error('Error en getEstadisticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    }
  }
}

module.exports = new OrdenTrabajoController();