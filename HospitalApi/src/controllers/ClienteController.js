const BaseController = require('./BaseController');
const { Cliente } = require('../models');

class ClienteController extends BaseController {
  constructor() {
    super(Cliente, 'Cliente');
  }

  // Método personalizado: buscar clientes por ciudad
  async getByCity(req, res) {
    try {
      const { ciudad } = req.params;
      const clientes = await Cliente.findAll({
        where: {
          ciudad: ciudad
        }
      });

      res.json({
        success: true,
        data: clientes,
        count: clientes.length
      });
    } catch (error) {
      console.error('Error en getByCity:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar clientes por ciudad',
        error: error.message
      });
    }
  }

  // Método personalizado: obtener cliente con sus equipos
  async getWithEquipos(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findByPk(id, {
        include: [{
          association: 'equipos',
          include: [
            { association: 'modalidad' },
            { association: 'fabricante' }
          ]
        }]
      });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      res.json({
        success: true,
        data: cliente
      });
    } catch (error) {
      console.error('Error en getWithEquipos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cliente con equipos',
        error: error.message
      });
    }
  }
}

module.exports = new ClienteController();