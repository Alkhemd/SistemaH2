/**
 * Mappers para convertir entre formatos del backend (snake_case) y frontend (camelCase)
 */

import { Equipment, Client, Order, Modalidad, Fabricante, Tecnico } from './api';
import { EquipmentUI, ClientUI, OrderUI } from '@/types/equipment';

// ============================================================================
// EQUIPMENT MAPPERS
// ============================================================================

/**
 * Convierte un equipo del backend al formato del frontend
 */
export function mapEquipmentToUI(equipment: Equipment): EquipmentUI {
  return {
    id: equipment.equipo_id?.toString() || equipment.id?.toString() || '',
    modelo: equipment.modelo || '',
    numeroSerie: equipment.numero_serie || equipment.numeroSerie || '',
    fabricante: typeof equipment.fabricante === 'object' && equipment.fabricante?.nombre
      ? equipment.fabricante.nombre
      : (equipment.fabricante as any) || '',
    modalidad: typeof equipment.modalidad === 'object' && equipment.modalidad?.codigo
      ? equipment.modalidad.codigo
      : (equipment.modalidad as any) || '',
    cliente: typeof equipment.cliente === 'object' && equipment.cliente?.nombre
      ? equipment.cliente.nombre
      : (equipment.cliente as any) || '',
    estado: mapEstadoEquipoToUI(equipment.estado_equipo || equipment.estado || 'Operativo'),
    ubicacion: equipment.ubicacion || '',
    fechaInstalacion: equipment.fecha_instalacion || equipment.fechaInstalacion || new Date().toISOString().split('T')[0],
    ultimaCalibacion: (equipment as any).ultima_calibracion || equipment.ultimaCalibacion || new Date().toISOString().split('T')[0],
    proximaCalibacion: (equipment as any).proxima_calibracion || equipment.proximaCalibacion || new Date().toISOString().split('T')[0],
  };
}

/**
 * Convierte un equipo del frontend al formato del backend
 */
export function mapEquipmentToAPI(equipment: Partial<EquipmentUI>, clienteId?: number, modalidadId?: number, fabricanteId?: number): Partial<Equipment> {
  return {
    modelo: equipment.modelo,
    numero_serie: equipment.numeroSerie,
    cliente_id: clienteId,
    modalidad_id: modalidadId,
    fabricante_id: fabricanteId,
    estado_equipo: mapEstadoEquipoToAPI(equipment.estado || 'operativo'),
    ubicacion: equipment.ubicacion,
    fecha_instalacion: equipment.fechaInstalacion,
    ultima_calibracion: equipment.ultimaCalibacion,
    proxima_calibracion: equipment.proximaCalibacion,
  } as any;
}

/**
 * Mapea el estado del equipo del backend al frontend
 */
function mapEstadoEquipoToUI(estado: string): 'operativo' | 'mantenimiento' | 'fuera-servicio' {
  const estadoLower = estado.toLowerCase().replace('_', '-');
  
  if (estadoLower.includes('operativo')) return 'operativo';
  if (estadoLower.includes('mantenimiento')) return 'mantenimiento';
  return 'fuera-servicio';
}

/**
 * Mapea el estado del equipo del frontend al backend
 */
function mapEstadoEquipoToAPI(estado: string): 'Operativo' | 'En_Mantenimiento' | 'Fuera_Servicio' {
  switch (estado) {
    case 'operativo':
      return 'Operativo';
    case 'mantenimiento':
      return 'En_Mantenimiento';
    case 'fuera-servicio':
      return 'Fuera_Servicio';
    default:
      return 'Operativo';
  }
}

// ============================================================================
// CLIENT MAPPERS
// ============================================================================

/**
 * Convierte un cliente del backend al formato del frontend
 */
export function mapClientToUI(client: Client): ClientUI {
  // Parsear contacto si es string JSON
  let contacto = { telefono: '', email: '', responsable: '' };
  
  if (typeof client.contacto === 'string') {
    try {
      contacto = JSON.parse(client.contacto);
    } catch {
      contacto = {
        telefono: client.telefono || '',
        email: client.email || '',
        responsable: '',
      };
    }
  } else if (typeof client.contacto === 'object' && client.contacto) {
    contacto = client.contacto as any;
  }

  return {
    id: client.cliente_id?.toString() || client.id?.toString() || '',
    nombre: client.nombre || '',
    tipo: mapTipoClienteToUI(client.tipo || 'Hospital'),
    ciudad: client.ciudad || '',
    estado: client.estado || '',
    contacto: {
      telefono: contacto.telefono || client.telefono || '',
      email: contacto.email || client.email || '',
      responsable: contacto.responsable || '',
    },
    estado_cliente: client.estado_cliente || 'activo',
    equiposCount: client.equipos?.length || 0,
    fechaRegistro: client.fechaRegistro || new Date().toISOString().split('T')[0],
    ultimaActividad: client.ultimaActividad || new Date().toISOString().split('T')[0],
  };
}

/**
 * Convierte un cliente del frontend al formato del backend
 */
export function mapClientToAPI(client: Partial<ClientUI>): Partial<Client> {
  return {
    nombre: client.nombre,
    tipo: mapTipoClienteToAPI(client.tipo || 'publico'),
    ciudad: client.ciudad,
    estado: client.estado,
    contacto: client.contacto ? JSON.stringify(client.contacto) : undefined,
    telefono: client.contacto?.telefono,
    email: client.contacto?.email,
  };
}

/**
 * Mapea el tipo de cliente del backend al frontend
 */
function mapTipoClienteToUI(tipo: string): 'publico' | 'privado' {
  const tipoLower = tipo.toLowerCase();
  if (tipoLower.includes('hospital') || tipoLower.includes('público')) return 'publico';
  return 'privado';
}

/**
 * Mapea el tipo de cliente del frontend al backend
 */
function mapTipoClienteToAPI(tipo: string): 'Hospital' | 'Clínica' | 'Centro Médico' | 'Laboratorio' {
  if (tipo === 'publico') return 'Hospital';
  return 'Clínica';
}

// ============================================================================
// ORDER MAPPERS
// ============================================================================

/**
 * Convierte una orden del backend al formato del frontend
 */
export function mapOrderToUI(order: Order): OrderUI {
  return {
    id: order.orden_id?.toString() || '',
    equipo: {
      modelo: typeof order.equipo === 'object' ? order.equipo?.modelo || '' : '',
      numeroSerie: typeof order.equipo === 'object' ? order.equipo?.numero_serie || '' : '',
      fabricante: typeof order.equipo === 'object' && typeof order.equipo.fabricante === 'object' 
        ? order.equipo.fabricante?.nombre || '' 
        : '',
    },
    cliente: typeof order.cliente === 'object' ? order.cliente?.nombre || '' : '',
    prioridad: mapPrioridadToUI(order.prioridad || 'Media'),
    estado: mapEstadoOrdenToUI(order.estado || 'Abierta'),
    tipo: order.tipo || 'correctivo',
    titulo: order.titulo || order.falla_reportada || 'Sin título',
    descripcion: order.descripcion || order.falla_reportada || '',
    fechaCreacion: order.fecha_apertura || order.fechaCreacion || new Date().toISOString().split('T')[0],
    fechaVencimiento: order.fechaVencimiento,
    tecnico: order.tecnico,
    tiempoEstimado: order.tiempoEstimado || '2 horas',
  };
}

/**
 * Convierte una orden del frontend al formato del backend
 */
export function mapOrderToAPI(order: Partial<OrderUI>, equipoId?: number, clienteId?: number): Partial<Order> {
  return {
    equipo_id: equipoId,
    cliente_id: clienteId,
    prioridad: mapPrioridadToAPI(order.prioridad || 'normal'),
    estado: mapEstadoOrdenToAPI(order.estado || 'abierta'),
    falla_reportada: order.descripcion || order.titulo,
    fecha_apertura: order.fechaCreacion,
  };
}

/**
 * Mapea la prioridad de la orden del backend al frontend
 */
function mapPrioridadToUI(prioridad: string): 'critica' | 'alta' | 'normal' {
  const prioridadLower = prioridad.toLowerCase();
  if (prioridadLower.includes('crít') || prioridadLower.includes('crit')) return 'critica';
  if (prioridadLower.includes('alta')) return 'alta';
  return 'normal';
}

/**
 * Mapea la prioridad de la orden del frontend al backend
 */
function mapPrioridadToAPI(prioridad: string): 'Baja' | 'Media' | 'Alta' | 'Crítica' {
  switch (prioridad) {
    case 'critica':
      return 'Crítica';
    case 'alta':
      return 'Alta';
    case 'normal':
      return 'Media';
    default:
      return 'Media';
  }
}

/**
 * Mapea el estado de la orden del backend al frontend
 */
function mapEstadoOrdenToUI(estado: string): 'abierta' | 'proceso' | 'cerrada' {
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('cerrada')) return 'cerrada';
  if (estadoLower.includes('proceso') || estadoLower.includes('asignada')) return 'proceso';
  return 'abierta';
}

/**
 * Mapea el estado de la orden del frontend al backend
 */
function mapEstadoOrdenToAPI(estado: string): 'Abierta' | 'Asignada' | 'En Proceso' | 'Cerrada' {
  switch (estado) {
    case 'cerrada':
      return 'Cerrada';
    case 'proceso':
      return 'En Proceso';
    case 'abierta':
      return 'Abierta';
    default:
      return 'Abierta';
  }
}

// ============================================================================
// CATALOG MAPPERS
// ============================================================================

/**
 * Mapea modalidades del backend
 */
export function mapModalidadToUI(modalidad: Modalidad) {
  return {
    id: modalidad.modalidad_id.toString(),
    codigo: modalidad.codigo,
    descripcion: modalidad.descripcion || '',
  };
}

/**
 * Mapea fabricantes del backend
 */
export function mapFabricanteToUI(fabricante: Fabricante) {
  return {
    id: fabricante.fabricante_id.toString(),
    nombre: fabricante.nombre,
    pais: fabricante.pais || '',
    soporte_tel: fabricante.soporte_tel || '',
    web: fabricante.web || '',
  };
}

/**
 * Mapea técnicos del backend
 */
export function mapTecnicoToUI(tecnico: Tecnico) {
  return {
    id: tecnico.tecnico_id.toString(),
    nombre: tecnico.nombre,
    especialidad: tecnico.especialidad || 'Multi-mod',
    certificaciones: tecnico.certificaciones || '',
    telefono: tecnico.telefono || '',
    email: tecnico.email || '',
    base_ciudad: tecnico.base_ciudad || '',
    activo: tecnico.activo === 1,
  };
}

// ============================================================================
// BATCH MAPPERS
// ============================================================================

/**
 * Convierte un array de equipos del backend al formato del frontend
 */
export function mapEquipmentsToUI(equipments: Equipment[]): EquipmentUI[] {
  return equipments.map(mapEquipmentToUI);
}

/**
 * Convierte un array de clientes del backend al formato del frontend
 */
export function mapClientsToUI(clients: Client[]): ClientUI[] {
  return clients.map(mapClientToUI);
}

/**
 * Convierte un array de órdenes del backend al formato del frontend
 */
export function mapOrdersToUI(orders: Order[]): OrderUI[] {
  return orders.map(mapOrderToUI);
}
