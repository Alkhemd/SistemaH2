const BaseController = require('./BaseController');
const { Modalidad, Fabricante, Tecnico, Contrato, EventoOrden, Intervencion, MantenimientoPM, CalibracionQC, Parte, PartesUsadas } = require('../models');

// Controladores simples que extienden BaseController
class ModalidadController extends BaseController {
  constructor() {
    super(Modalidad, 'Modalidad');
  }
}

class FabricanteController extends BaseController {
  constructor() {
    super(Fabricante, 'Fabricante');
  }
}

class TecnicoController extends BaseController {
  constructor() {
    super(Tecnico, 'Técnico');
  }

  // Obtener técnicos activos
  async getActivos(req, res) {
    try {
      const tecnicos = await Tecnico.findAll({
        where: { activo: 1 },
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        data: tecnicos,
        count: tecnicos.length
      });
    } catch (error) {
      console.error('Error en getActivos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener técnicos activos',
        error: error.message
      });
    }
  }
}

class ContratoController extends BaseController {
  constructor() {
    super(Contrato, 'Contrato');
  }

  // Sobrescribir getAll para incluir cliente
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [{ association: 'cliente' }],
        order: [['fecha_inicio', 'DESC']]
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
      console.error('Error en getAll Contratos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener contratos',
        error: error.message
      });
    }
  }
}

class EventoOrdenController extends BaseController {
  constructor() {
    super(EventoOrden, 'Evento de Orden');
  }

  // Obtener eventos por orden
  async getByOrden(req, res) {
    try {
      const { orden_id } = req.params;
      const eventos = await EventoOrden.findAll({
        where: { orden_id },
        include: [{ association: 'orden_trabajo' }],
        order: [['fecha_hora', 'ASC']]
      });

      res.json({
        success: true,
        data: eventos,
        count: eventos.length
      });
    } catch (error) {
      console.error('Error en getByOrden:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener eventos de la orden',
        error: error.message
      });
    }
  }
}

class IntervencionController extends BaseController {
  constructor() {
    super(Intervencion, 'Intervención');
  }

  // Sobrescribir getAll para incluir relaciones
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          { association: 'orden_trabajo' },
          { association: 'tecnico' },
          { 
            association: 'partes_usadas',
            include: [{ association: 'parte' }]
          }
        ],
        order: [['fecha_inicio', 'DESC']]
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
      console.error('Error en getAll Intervenciones:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener intervenciones',
        error: error.message
      });
    }
  }
}

class MantenimientoPMController extends BaseController {
  constructor() {
    super(MantenimientoPM, 'Mantenimiento PM');
  }

  // Sobrescribir getAll para incluir relaciones
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          { 
            association: 'equipo',
            include: [
              { association: 'cliente' },
              { association: 'modalidad' }
            ]
          },
          { association: 'tecnico' }
        ],
        order: [['fecha_programada', 'DESC']]
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
      console.error('Error en getAll Mantenimientos PM:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener mantenimientos PM',
        error: error.message
      });
    }
  }
}

class CalibracionQCController extends BaseController {
  constructor() {
    super(CalibracionQC, 'Calibración QC');
  }

  // Sobrescribir getAll para incluir relaciones
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          { 
            association: 'equipo',
            include: [
              { association: 'cliente' },
              { association: 'modalidad' }
            ]
          },
          { association: 'tecnico' }
        ],
        order: [['fecha', 'DESC']]
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
      console.error('Error en getAll Calibraciones QC:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener calibraciones QC',
        error: error.message
      });
    }
  }
}

class ParteController extends BaseController {
  constructor() {
    super(Parte, 'Parte');
  }

  // Obtener partes con stock bajo
  async getBajoStock(req, res) {
    try {
      const { minimo = 5 } = req.query;
      const partes = await Parte.findAll({
        where: {
          stock: {
            [require('sequelize').Op.lte]: parseInt(minimo)
          }
        },
        order: [['stock', 'ASC']]
      });

      res.json({
        success: true,
        data: partes,
        count: partes.length
      });
    } catch (error) {
      console.error('Error en getBajoStock:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener partes con stock bajo',
        error: error.message
      });
    }
  }
}

class PartesUsadasController extends BaseController {
  constructor() {
    super(PartesUsadas, 'Partes Usadas');
  }

  // Sobrescribir getAll para incluir relaciones
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          { 
            association: 'intervencion',
            include: [{ association: 'orden_trabajo' }]
          },
          { association: 'parte' }
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
      console.error('Error en getAll Partes Usadas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener partes usadas',
        error: error.message
      });
    }
  }
}

// Exportar todas las instancias de controladores
module.exports = {
  ModalidadController: new ModalidadController(),
  FabricanteController: new FabricanteController(),
  TecnicoController: new TecnicoController(),
  ContratoController: new ContratoController(),
  EventoOrdenController: new EventoOrdenController(),
  IntervencionController: new IntervencionController(),
  MantenimientoPMController: new MantenimientoPMController(),
  CalibracionQCController: new CalibracionQCController(),
  ParteController: new ParteController(),
  PartesUsadasController: new PartesUsadasController()
};