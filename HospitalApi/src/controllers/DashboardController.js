const { Equipo, OrdenTrabajo, Cliente, Modalidad, Fabricante } = require('../models');
const { Op } = require('sequelize');

class DashboardController {
  // GET /api/v1/dashboard/estadisticas - Obtener estadísticas generales
  async getEstadisticas(req, res) {
    try {
      console.log('[Dashboard] Obteniendo estadísticas...');

      // Total de equipos
      const totalEquipos = await Equipo.count();
      console.log('[Dashboard] Total equipos:', totalEquipos);

      // Equipos por estado
      const equiposOperativos = await Equipo.count({
        where: { estado_equipo: 'Operativo' }
      });

      const equiposMantenimiento = await Equipo.count({
        where: { estado_equipo: 'En_Mantenimiento' }
      });

      const equiposFueraServicio = await Equipo.count({
        where: { 
          estado_equipo: {
            [Op.in]: ['Fuera_Servicio', 'Desinstalado']
          }
        }
      });

      // Órdenes abiertas
      const ordenesAbiertas = await OrdenTrabajo.count({
        where: { 
          estado: {
            [Op.in]: ['Abierta', 'Asignada', 'En Proceso']
          }
        }
      });

      // Órdenes por prioridad
      const ordenesCriticas = await OrdenTrabajo.count({
        where: { 
          prioridad: 'Crítica',
          estado: {
            [Op.notIn]: ['Cerrada', 'Cancelada']
          }
        }
      });

      console.log('[Dashboard] Estadísticas calculadas exitosamente');

      res.json({
        success: true,
        data: {
          totalEquipos,
          equiposOperativos,
          equiposMantenimiento,
          equiposFueraServicio,
          ordenesAbiertas,
          ordenesCriticas
        }
      });
    } catch (error) {
      console.error('Error en getEstadisticas:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // GET /api/v1/dashboard/actividad-reciente - Obtener actividad reciente
  async getActividadReciente(req, res) {
    try {
      const { limit = 10 } = req.query;

      console.log('[Dashboard] Obteniendo actividad reciente, limit:', limit);

      // Obtener las órdenes más recientes con sus relaciones
      const ordenesRecientes = await OrdenTrabajo.findAll({
        limit: parseInt(limit),
        include: [
          { 
            association: 'equipo',
            required: false,
            include: [
              { association: 'fabricante', required: false },
              { association: 'modalidad', required: false }
            ]
          },
          { association: 'cliente', required: false }
        ],
        order: [['fecha_apertura', 'DESC']]
      });

      console.log('[Dashboard] Órdenes encontradas:', ordenesRecientes.length);

      // Mapear a formato de actividad
      const actividades = ordenesRecientes.map(orden => ({
        id: orden.orden_id,
        equipment: orden.equipo ? `${orden.equipo.modelo} (${orden.equipo.numero_serie})` : 'Equipo no especificado',
        client: orden.cliente ? orden.cliente.nombre : 'Cliente no especificado',
        type: orden.tipo || 'correctivo',
        status: mapEstadoOrden(orden.estado),
        priority: mapPrioridad(orden.prioridad),
        time: formatearTiempo(orden.fecha_apertura),
        fecha: orden.fecha_apertura
      }));

      res.json({
        success: true,
        data: actividades,
        count: actividades.length
      });
    } catch (error) {
      console.error('Error en getActividadReciente:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Error al obtener actividad reciente',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // GET /api/v1/dashboard/resumen - Obtener resumen completo del dashboard
  async getResumen(req, res) {
    try {
      // Obtener estadísticas
      const estadisticas = await this.getEstadisticasInterno();
      
      // Obtener actividad reciente
      const actividadReciente = await this.getActividadRecienteInterno(5);

      // Obtener equipos críticos (fuera de servicio o con órdenes críticas)
      const equiposCriticos = await Equipo.findAll({
        where: {
          [Op.or]: [
            { estado_equipo: 'Fuera_Servicio' },
            { estado_equipo: 'Desinstalado' }
          ]
        },
        limit: 5,
        include: [
          { association: 'cliente' },
          { association: 'modalidad' }
        ]
      });

      res.json({
        success: true,
        data: {
          estadisticas,
          actividadReciente,
          equiposCriticos: equiposCriticos.map(eq => ({
            id: eq.equipo_id,
            modelo: eq.modelo,
            numeroSerie: eq.numero_serie,
            cliente: eq.cliente?.nombre || 'N/A',
            modalidad: eq.modalidad?.codigo || 'N/A',
            estado: eq.estado_equipo
          }))
        }
      });
    } catch (error) {
      console.error('Error en getResumen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener resumen del dashboard',
        error: error.message
      });
    }
  }

  // Métodos internos (helpers)
  async getEstadisticasInterno() {
    const totalEquipos = await Equipo.count();
    const equiposOperativos = await Equipo.count({ where: { estado_equipo: 'Operativo' } });
    const equiposMantenimiento = await Equipo.count({ where: { estado_equipo: 'En_Mantenimiento' } });
    const ordenesAbiertas = await OrdenTrabajo.count({
      where: { estado: { [Op.in]: ['Abierta', 'Asignada', 'En Proceso'] } }
    });

    return {
      totalEquipos,
      equiposOperativos,
      equiposMantenimiento,
      ordenesAbiertas
    };
  }

  async getActividadRecienteInterno(limit = 10) {
    const ordenesRecientes = await OrdenTrabajo.findAll({
      limit,
      include: [
        { 
          association: 'equipo',
          include: [{ association: 'fabricante' }, { association: 'modalidad' }]
        },
        { association: 'cliente' }
      ],
      order: [['fecha_apertura', 'DESC']]
    });

    return ordenesRecientes.map(orden => ({
      id: orden.orden_id,
      equipment: orden.equipo ? `${orden.equipo.modelo}` : 'N/A',
      client: orden.cliente?.nombre || 'N/A',
      type: orden.tipo || 'correctivo',
      status: mapEstadoOrden(orden.estado),
      priority: mapPrioridad(orden.prioridad),
      time: formatearTiempo(orden.fecha_apertura)
    }));
  }
}

// Funciones auxiliares
function mapEstadoOrden(estado) {
  switch (estado) {
    case 'Abierta': return 'abierta';
    case 'Asignada':
    case 'En Proceso': return 'proceso';
    case 'Cerrada': return 'completado';
    default: return 'abierta';
  }
}

function mapPrioridad(prioridad) {
  switch (prioridad) {
    case 'Crítica': return 'critica';
    case 'Alta': return 'alta';
    default: return 'normal';
  }
}

function formatearTiempo(fecha) {
  if (!fecha) return 'Fecha desconocida';
  
  const ahora = new Date();
  const fechaOrden = new Date(fecha);
  const diferencia = ahora - fechaOrden;
  
  const minutos = Math.floor(diferencia / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
  if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
  if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  return 'Hace un momento';
}

module.exports = new DashboardController();
