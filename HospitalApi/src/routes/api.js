const express = require('express');
const router = express.Router();

// Importar controladores
const ClienteController = require('../controllers/ClienteController');
const EquipoController = require('../controllers/EquipoController');
const OrdenTrabajoController = require('../controllers/OrdenTrabajoController');
const {
  ModalidadController,
  FabricanteController,
  TecnicoController,
  ContratoController,
  EventoOrdenController,
  IntervencionController,
  MantenimientoPMController,
  CalibracionQCController,
  ParteController,
  PartesUsadasController
} = require('../controllers');

// Función helper para crear rutas CRUD estándar
function createCrudRoutes(path, controller) {
  router.get(`/${path}`, controller.getAll.bind(controller));
  router.get(`/${path}/:id`, controller.getById.bind(controller));
  router.post(`/${path}`, controller.create.bind(controller));
  router.put(`/${path}/:id`, controller.update.bind(controller));
  router.delete(`/${path}/:id`, controller.delete.bind(controller));
}

// === RUTAS PARA CLIENTES ===
/**
 * @openapi
 * /clientes:
 *   get:
 *     summary: Obtener lista paginada de clientes
 *     tags:
 *       - Clientes
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista paginada de clientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags:
 *       - Clientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags:
 *       - Clientes
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Cliente no encontrado
 *   put:
 *     summary: Actualizar un cliente
 *     tags:
 *       - Clientes
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   delete:
 *     summary: Eliminar un cliente
 *     tags:
 *       - Clientes
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Cliente eliminado
 */
createCrudRoutes('clientes', ClienteController);
router.get('/clientes/ciudad/:ciudad', ClienteController.getByCity.bind(ClienteController));
router.get('/clientes/:id/equipos', ClienteController.getWithEquipos.bind(ClienteController));

// === RUTAS PARA EQUIPOS ===
/**
 * @openapi
 * /equipos:
 *   get:
 *     summary: Obtener lista paginada de equipos
 *     tags:
 *       - Equipos
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista paginada de equipos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     summary: Crear un nuevo equipo
 *     tags:
 *       - Equipos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EquipoInput'
 *     responses:
 *       201:
 *         description: Equipo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * /equipos/{id}:
 *   get:
 *     summary: Obtener un equipo por ID
 *     tags:
 *       - Equipos
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Equipo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   put:
 *     summary: Actualizar un equipo
 *     tags:
 *       - Equipos
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EquipoInput'
 *     responses:
 *       200:
 *         description: Equipo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   delete:
 *     summary: Eliminar un equipo
 *     tags:
 *       - Equipos
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Equipo eliminado
 */
createCrudRoutes('equipos', EquipoController);
router.get('/equipos/estado/:estado', EquipoController.getByEstado.bind(EquipoController));
router.get('/equipos/serial/:serial', EquipoController.getBySerial.bind(EquipoController));
router.get('/equipos/:id/historial', EquipoController.getHistorial.bind(EquipoController));

// === RUTAS PARA ÓRDENES DE TRABAJO ===
/**
 * @openapi
 * /ordenes:
 *   get:
 *     summary: Obtener lista paginada de órdenes de trabajo
 *     tags:
 *       - Órdenes de Trabajo
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtrar por estado
 *       - in: query
 *         name: prioridad
 *         schema:
 *           type: string
 *         description: Filtrar por prioridad
 *     responses:
 *       200:
 *         description: Lista paginada de órdenes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     summary: Crear una nueva orden de trabajo
 *     tags:
 *       - Órdenes de Trabajo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrdenTrabajo'
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * /ordenes/{id}:
 *   get:
 *     summary: Obtener una orden de trabajo por ID
 *     tags:
 *       - Órdenes de Trabajo
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   put:
 *     summary: Actualizar una orden de trabajo
 *     tags:
 *       - Órdenes de Trabajo
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrdenTrabajo'
 *     responses:
 *       200:
 *         description: Orden actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   delete:
 *     summary: Eliminar una orden de trabajo
 *     tags:
 *       - Órdenes de Trabajo
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Orden eliminada
 */
createCrudRoutes('ordenes', OrdenTrabajoController);
router.get('/ordenes/:id/historial', OrdenTrabajoController.getWithHistorial.bind(OrdenTrabajoController));
router.get('/ordenes/estado/:estado', OrdenTrabajoController.getByEstado.bind(OrdenTrabajoController));
router.get('/dashboard/estadisticas', OrdenTrabajoController.getEstadisticas.bind(OrdenTrabajoController));

// === RUTAS PARA MODALIDADES ===
/**
 * @openapi
 * /modalidades:
 *   get:
 *     summary: Obtener lista de modalidades
 *     tags:
 *       - Modalidades
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista de modalidades
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     summary: Crear una nueva modalidad
 *     tags:
 *       - Modalidades
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Modalidad'
 *     responses:
 *       201:
 *         description: Modalidad creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * /modalidades/{id}:
 *   get:
 *     summary: Obtener una modalidad por ID
 *     tags:
 *       - Modalidades
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Modalidad encontrada
 *   put:
 *     summary: Actualizar una modalidad
 *     tags:
 *       - Modalidades
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Modalidad'
 *     responses:
 *       200:
 *         description: Modalidad actualizada
 *   delete:
 *     summary: Eliminar una modalidad
 *     tags:
 *       - Modalidades
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Modalidad eliminada
 */
createCrudRoutes('modalidades', ModalidadController);

// === RUTAS PARA FABRICANTES ===
/**
 * @openapi
 * /fabricantes:
 *   get:
 *     summary: Obtener lista de fabricantes
 *     tags:
 *       - Fabricantes
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista de fabricantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     summary: Crear un nuevo fabricante
 *     tags:
 *       - Fabricantes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fabricante'
 *     responses:
 *       201:
 *         description: Fabricante creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * /fabricantes/{id}:
 *   get:
 *     summary: Obtener un fabricante por ID
 *     tags:
 *       - Fabricantes
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Fabricante encontrado
 *   put:
 *     summary: Actualizar un fabricante
 *     tags:
 *       - Fabricantes
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fabricante'
 *     responses:
 *       200:
 *         description: Fabricante actualizado
 *   delete:
 *     summary: Eliminar un fabricante
 *     tags:
 *       - Fabricantes
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Fabricante eliminado
 */
createCrudRoutes('fabricantes', FabricanteController);

// === RUTAS PARA TÉCNICOS ===
/**
 * @openapi
 * /tecnicos:
 *   get:
 *     summary: Obtener lista de técnicos
 *     tags:
 *       - Técnicos
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista de técnicos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     summary: Crear un nuevo técnico
 *     tags:
 *       - Técnicos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tecnico'
 *     responses:
 *       201:
 *         description: Técnico creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * /tecnicos/{id}:
 *   get:
 *     summary: Obtener un técnico por ID
 *     tags:
 *       - Técnicos
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Técnico encontrado
 *   put:
 *     summary: Actualizar un técnico
 *     tags:
 *       - Técnicos
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tecnico'
 *     responses:
 *       200:
 *         description: Técnico actualizado
 *   delete:
 *     summary: Eliminar un técnico
 *     tags:
 *       - Técnicos
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Técnico eliminado
 */
createCrudRoutes('tecnicos', TecnicoController);
router.get('/tecnicos/activos', TecnicoController.getActivos.bind(TecnicoController));

// === RUTAS PARA CONTRATOS ===
/**
 * @openapi
 * /contratos:
 *   get:
 *     summary: Obtener lista de contratos
 *     tags:
 *       - Contratos
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista de contratos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     summary: Crear un nuevo contrato
 *     tags:
 *       - Contratos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cliente_id, tipo_contrato, fecha_inicio]
 *             properties:
 *               cliente_id:
 *                 type: integer
 *               tipo_contrato:
 *                 type: string
 *                 enum: [Full_Service, Time_Material, Parts_Only, No_Contract]
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *               monto_anual:
 *                 type: number
 *     responses:
 *       201:
 *         description: Contrato creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * /contratos/{id}:
 *   get:
 *     summary: Obtener un contrato por ID
 *     tags:
 *       - Contratos
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Contrato encontrado
 *   put:
 *     summary: Actualizar un contrato
 *     tags:
 *       - Contratos
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Contrato actualizado
 *   delete:
 *     summary: Eliminar un contrato
 *     tags:
 *       - Contratos
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Contrato eliminado
 */
createCrudRoutes('contratos', ContratoController);

// === RUTAS PARA EVENTOS DE ORDEN ===
/**
 * @openapi
 * /eventos-orden:
 *   get:
 *     summary: Obtener lista de eventos de orden
 *     tags:
 *       - Eventos de Orden
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista de eventos
 *   post:
 *     summary: Crear un nuevo evento de orden
 *     tags:
 *       - Eventos de Orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orden_id, tipo_evento]
 *             properties:
 *               orden_id:
 *                 type: integer
 *               tipo_evento:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evento creado
 * /eventos-orden/{id}:
 *   get:
 *     summary: Obtener un evento por ID
 *     tags:
 *       - Eventos de Orden
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Evento encontrado
 *   put:
 *     summary: Actualizar un evento
 *     tags:
 *       - Eventos de Orden
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Evento actualizado
 *   delete:
 *     summary: Eliminar un evento
 *     tags:
 *       - Eventos de Orden
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Evento eliminado
 */
createCrudRoutes('eventos-orden', EventoOrdenController);
router.get('/eventos-orden/orden/:orden_id', EventoOrdenController.getByOrden.bind(EventoOrdenController));

// === RUTAS PARA INTERVENCIONES ===
/**
 * @openapi
 * /intervenciones:
 *   get:
 *     summary: Obtener lista de intervenciones
 *     tags:
 *       - Intervenciones
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista de intervenciones
 *   post:
 *     summary: Crear una nueva intervención
 *     tags:
 *       - Intervenciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orden_id, tecnico_id]
 *             properties:
 *               orden_id:
 *                 type: integer
 *               tecnico_id:
 *                 type: integer
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               diagnostico:
 *                 type: string
 *     responses:
 *       201:
 *         description: Intervención creada
 * /intervenciones/{id}:
 *   get:
 *     summary: Obtener una intervención por ID
 *     tags:
 *       - Intervenciones
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Intervención encontrada
 *   put:
 *     summary: Actualizar una intervención
 *     tags:
 *       - Intervenciones
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Intervención actualizada
 *   delete:
 *     summary: Eliminar una intervención
 *     tags:
 *       - Intervenciones
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Intervención eliminada
 */
createCrudRoutes('intervenciones', IntervencionController);

// === RUTAS PARA MANTENIMIENTOS PM ===
/**
 * @openapi
 * /mantenimientos-pm:
 *   get:
 *     summary: Obtener lista de mantenimientos preventivos
 *     tags:
 *       - Mantenimientos PM
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista de mantenimientos PM
 *   post:
 *     summary: Crear un nuevo mantenimiento PM
 *     tags:
 *       - Mantenimientos PM
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [equipo_id]
 *             properties:
 *               equipo_id:
 *                 type: integer
 *               fecha_programada:
 *                 type: string
 *                 format: date
 *               tecnico_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Mantenimiento PM creado
 * /mantenimientos-pm/{id}:
 *   get:
 *     summary: Obtener un mantenimiento PM por ID
 *     tags:
 *       - Mantenimientos PM
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Mantenimiento PM encontrado
 *   put:
 *     summary: Actualizar un mantenimiento PM
 *     tags:
 *       - Mantenimientos PM
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Mantenimiento PM actualizado
 *   delete:
 *     summary: Eliminar un mantenimiento PM
 *     tags:
 *       - Mantenimientos PM
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Mantenimiento PM eliminado
 */
createCrudRoutes('mantenimientos-pm', MantenimientoPMController);

// === RUTAS PARA CALIBRACIONES QC ===
/**
 * @openapi
 * /calibraciones-qc:
 *   get:
 *     summary: Obtener lista de calibraciones de control de calidad
 *     tags:
 *       - Calibraciones QC
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista de calibraciones QC
 *   post:
 *     summary: Crear una nueva calibración QC
 *     tags:
 *       - Calibraciones QC
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [equipo_id]
 *             properties:
 *               equipo_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               resultado:
 *                 type: string
 *                 enum: [Aprobado, Rechazado, Condicional]
 *     responses:
 *       201:
 *         description: Calibración QC creada
 * /calibraciones-qc/{id}:
 *   get:
 *     summary: Obtener una calibración QC por ID
 *     tags:
 *       - Calibraciones QC
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Calibración QC encontrada
 *   put:
 *     summary: Actualizar una calibración QC
 *     tags:
 *       - Calibraciones QC
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Calibración QC actualizada
 *   delete:
 *     summary: Eliminar una calibración QC
 *     tags:
 *       - Calibraciones QC
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Calibración QC eliminada
 */
createCrudRoutes('calibraciones-qc', CalibracionQCController);

// === RUTAS PARA PARTES ===
/**
 * @openapi
 * /partes/stock-bajo:
 *   get:
 *     summary: Obtener partes con stock bajo
 *     tags:
 *       - Partes
 *     parameters:
 *       - in: query
 *         name: minimo
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Valor mínimo de stock para considerar "bajo"
 *     responses:
 *       200:
 *         description: Lista de partes con stock bajo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/partes/stock-bajo', ParteController.getBajoStock.bind(ParteController));

/**
 * @openapi
 * /partes:
 *   get:
 *     summary: Obtener lista paginada de partes
 *     tags:
 *       - Partes
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista paginada de partes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *   post:
 *     summary: Crear una nueva parte
 *     tags:
 *       - Partes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parte'
 *     responses:
 *       201:
 *         description: Parte creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * /partes/{id}:
 *   get:
 *     summary: Obtener una parte por ID
 *     tags:
 *       - Partes
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Parte encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   put:
 *     summary: Actualizar una parte
 *     tags:
 *       - Partes
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Parte'
 *     responses:
 *       200:
 *         description: Parte actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   delete:
 *     summary: Eliminar una parte
 *     tags:
 *       - Partes
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Parte eliminada
 */
createCrudRoutes('partes', ParteController);

// === RUTAS PARA PARTES USADAS ===
/**
 * @openapi
 * /partes-usadas:
 *   get:
 *     summary: Obtener lista de partes usadas
 *     tags:
 *       - Partes Usadas
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Lista de partes usadas
 *   post:
 *     summary: Registrar una parte usada
 *     tags:
 *       - Partes Usadas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [intervencion_id, parte_id, cantidad]
 *             properties:
 *               intervencion_id:
 *                 type: integer
 *               parte_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Parte usada registrada
 * /partes-usadas/{id}:
 *   get:
 *     summary: Obtener una parte usada por ID
 *     tags:
 *       - Partes Usadas
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Parte usada encontrada
 *   put:
 *     summary: Actualizar una parte usada
 *     tags:
 *       - Partes Usadas
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Parte usada actualizada
 *   delete:
 *     summary: Eliminar una parte usada
 *     tags:
 *       - Partes Usadas
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Parte usada eliminada
 */
createCrudRoutes('partes-usadas', PartesUsadasController);

// Ruta de información de la API
router.get('/', (req, res) => {
  res.json({
    message: 'API Sistema H - Gestión de Equipos Médicos',
    version: '1.0.0',
    endpoints: {
      clientes: '/api/v1/clientes',
      equipos: '/api/v1/equipos',
      ordenes: '/api/v1/ordenes',
      modalidades: '/api/v1/modalidades',
      fabricantes: '/api/v1/fabricantes',
      tecnicos: '/api/v1/tecnicos',
      contratos: '/api/v1/contratos',
      eventos_orden: '/api/v1/eventos-orden',
      intervenciones: '/api/v1/intervenciones',
      mantenimientos_pm: '/api/v1/mantenimientos-pm',
      calibraciones_qc: '/api/v1/calibraciones-qc',
      partes: '/api/v1/partes',
      partes_usadas: '/api/v1/partes-usadas'
    },
    documentation: '/api-docs'
  });
});

module.exports = router;