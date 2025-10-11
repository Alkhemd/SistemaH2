// Importar todos los modelos
const Cliente = require('./Cliente');
const Contrato = require('./Contrato');
const Modalidad = require('./Modalidad');
const Fabricante = require('./Fabricante');
const Equipo = require('./Equipo');
const Tecnico = require('./Tecnico');
const OrdenTrabajo = require('./OrdenTrabajo');
const EventoOrden = require('./EventoOrden');
const Intervencion = require('./Intervencion');
const MantenimientoPM = require('./MantenimientoPM');
const CalibracionQC = require('./CalibracionQC');
const Parte = require('./Parte');
const PartesUsadas = require('./PartesUsadas');

// Definir las relaciones entre modelos

// Cliente -> Contrato (1:N)
Cliente.hasMany(Contrato, { foreignKey: 'cliente_id', as: 'contratos' });
Contrato.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Cliente -> Equipo (1:N)
Cliente.hasMany(Equipo, { foreignKey: 'cliente_id', as: 'equipos' });
Equipo.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Modalidad -> Equipo (1:N)
Modalidad.hasMany(Equipo, { foreignKey: 'modalidad_id', as: 'equipos' });
Equipo.belongsTo(Modalidad, { foreignKey: 'modalidad_id', as: 'modalidad' });

// Fabricante -> Equipo (1:N)
Fabricante.hasMany(Equipo, { foreignKey: 'fabricante_id', as: 'equipos' });
Equipo.belongsTo(Fabricante, { foreignKey: 'fabricante_id', as: 'fabricante' });

// Contrato -> Equipo (1:N)
Contrato.hasMany(Equipo, { foreignKey: 'contrato_id', as: 'equipos' });
Equipo.belongsTo(Contrato, { foreignKey: 'contrato_id', as: 'contrato' });

// Equipo -> OrdenTrabajo (1:N)
Equipo.hasMany(OrdenTrabajo, { foreignKey: 'equipo_id', as: 'ordenes_trabajo' });
OrdenTrabajo.belongsTo(Equipo, { foreignKey: 'equipo_id', as: 'equipo' });

// Cliente -> OrdenTrabajo (1:N)
Cliente.hasMany(OrdenTrabajo, { foreignKey: 'cliente_id', as: 'ordenes_trabajo' });
OrdenTrabajo.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Contrato -> OrdenTrabajo (1:N)
Contrato.hasMany(OrdenTrabajo, { foreignKey: 'contrato_id', as: 'ordenes_trabajo' });
OrdenTrabajo.belongsTo(Contrato, { foreignKey: 'contrato_id', as: 'contrato' });

// OrdenTrabajo -> EventoOrden (1:N)
OrdenTrabajo.hasMany(EventoOrden, { foreignKey: 'orden_id', as: 'eventos' });
EventoOrden.belongsTo(OrdenTrabajo, { foreignKey: 'orden_id', as: 'orden_trabajo' });

// OrdenTrabajo -> Intervencion (1:N)
OrdenTrabajo.hasMany(Intervencion, { foreignKey: 'orden_id', as: 'intervenciones' });
Intervencion.belongsTo(OrdenTrabajo, { foreignKey: 'orden_id', as: 'orden_trabajo' });

// Tecnico -> Intervencion (1:N)
Tecnico.hasMany(Intervencion, { foreignKey: 'tecnico_id', as: 'intervenciones' });
Intervencion.belongsTo(Tecnico, { foreignKey: 'tecnico_id', as: 'tecnico' });

// Equipo -> MantenimientoPM (1:N)
Equipo.hasMany(MantenimientoPM, { foreignKey: 'equipo_id', as: 'mantenimientos_pm' });
MantenimientoPM.belongsTo(Equipo, { foreignKey: 'equipo_id', as: 'equipo' });

// Tecnico -> MantenimientoPM (1:N)
Tecnico.hasMany(MantenimientoPM, { foreignKey: 'tecnico_id', as: 'mantenimientos_pm' });
MantenimientoPM.belongsTo(Tecnico, { foreignKey: 'tecnico_id', as: 'tecnico' });

// Equipo -> CalibracionQC (1:N)
Equipo.hasMany(CalibracionQC, { foreignKey: 'equipo_id', as: 'calibraciones_qc' });
CalibracionQC.belongsTo(Equipo, { foreignKey: 'equipo_id', as: 'equipo' });

// Tecnico -> CalibracionQC (1:N)
Tecnico.hasMany(CalibracionQC, { foreignKey: 'tecnico_id', as: 'calibraciones_qc' });
CalibracionQC.belongsTo(Tecnico, { foreignKey: 'tecnico_id', as: 'tecnico' });

// Intervencion -> PartesUsadas (1:N)
Intervencion.hasMany(PartesUsadas, { foreignKey: 'intervencion_id', as: 'partes_usadas' });
PartesUsadas.belongsTo(Intervencion, { foreignKey: 'intervencion_id', as: 'intervencion' });

// Parte -> PartesUsadas (1:N)
Parte.hasMany(PartesUsadas, { foreignKey: 'parte_id', as: 'usos' });
PartesUsadas.belongsTo(Parte, { foreignKey: 'parte_id', as: 'parte' });

// Exportar todos los modelos
module.exports = {
  Cliente,
  Contrato,
  Modalidad,
  Fabricante,
  Equipo,
  Tecnico,
  OrdenTrabajo,
  EventoOrden,
  Intervencion,
  MantenimientoPM,
  CalibracionQC,
  Parte,
  PartesUsadas
};