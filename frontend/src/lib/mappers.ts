/**
 * Mappers para convertir entre formatos del backend (snake_case) y frontend (camelCase)
 */

import { Equipment, Client, Order, Modalidad, Fabricante, Tecnico } from './api';
import { EquipmentUI, ClientUI, OrderUI } from '@/types/equipment';


// ============================================================================
// EQUIPMENT MAPPERS
// ============================================================================

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

/**
 * Mapea el estado del equipo del backend al frontend
 */
export function mapEstadoEquipoToUI(estado: string): 'operativo' | 'mantenimiento' | 'fuera-servicio' {
  switch (estado) {
    case 'Operativo':
      return 'operativo';
    case 'En_Mantenimiento':
      return 'mantenimiento';
    case 'Fuera_Servicio':
    case 'Desinstalado':
      return 'fuera-servicio';
    default:
      return 'operativo';
  }
}

/**
 * Convierte un equipo del backend al formato del frontend
 */
export function mapEquipmentToUI(equipment: any): EquipmentUI {
  return {
    id: equipment.equipo_id?.toString() || '',
    modelo: equipment.modelo || '',
    numeroSerie: equipment.numero_serie || '',
    fabricante_id: equipment.fabricante_id,
    fabricante: equipment.fabricante?.nombre || '',
    modalidad_id: equipment.modalidad_id,
    modalidad: equipment.modalidad?.codigo || equipment.modalidad?.descripcion || '',
    cliente_id: equipment.cliente_id,
    cliente: equipment.cliente?.nombre || '',
    estado: mapEstadoEquipoToUI(equipment.estado_equipo || 'Operativo'),
    ubicacion: equipment.ubicacion || '',
    fechaInstalacion: equipment.fecha_instalacion || '',
    ultimaCalibacion: equipment.ultima_calibracion || '',
    proximaCalibacion: equipment.proxima_calibracion || '',
    fotoUrl: equipment.foto_url || '',
  };
}

export function mapEquipmentToAPI(equipment: Partial<EquipmentUI> | Omit<EquipmentUI, 'id'>) {
  return {
    modelo: equipment.modelo,
    numero_serie: equipment.numeroSerie,
    cliente_id: equipment.cliente_id,
    modalidad_id: equipment.modalidad_id,
    fabricante_id: equipment.fabricante_id,
    estado_equipo: equipment.estado ? mapEstadoEquipoToAPI(equipment.estado) : undefined,
    ubicacion: equipment.ubicacion,
    fecha_instalacion: equipment.fechaInstalacion,
    ultima_calibracion: equipment.ultimaCalibacion,
    proxima_calibracion: equipment.proximaCalibacion,
    foto_url: equipment.fotoUrl || (equipment as any).foto_url,
    // Otros campos opcionales pueden agregarse aquí si se usan en el formulario
  } as any;
}

// ============================================================================
// CLIENT MAPPERS
// ============================================================================

/**
 * Convierte un cliente del backend al formato del frontend
 */
export function mapClientToUI(client: any): ClientUI {
  // Manejar el campo contacto que puede ser string o JSON
  let responsable = '';
  if (typeof client.contacto === 'string') {
    // Si es string simple, usarlo como responsable
    try {
      // Intentar parsear por si es un JSON string
      const parsed = JSON.parse(client.contacto);
      responsable = parsed.responsable || parsed.telefono || client.contacto;
    } catch {
      // Si no es JSON, usar el string directamente
      responsable = client.contacto;
    }
  } else if (typeof client.contacto === 'object' && client.contacto !== null) {
    // Si es objeto, extraer el responsable
    responsable = client.contacto.responsable || '';
  }

  return {
    id: client.cliente_id?.toString() || '',
    nombre: client.nombre || '',
    tipo: mapTipoClienteToUI(client.tipo || ''),
    ciudad: client.ciudad || '',
    estado: client.estado || '',
    contacto: {
      telefono: client.telefono || '',
      email: client.email || '',
      responsable: responsable || 'Sin responsable',
    },
    estado_cliente: 'activo', // Por defecto activo, no existe en BD
    equiposCount: client.equipos_count || 0, // Usar el conteo de la query
    fechaRegistro: '',
    ultimaActividad: new Date().toISOString().split('T')[0],
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
    contacto: client.contacto?.responsable, // Solo el nombre del responsable
    telefono: client.contacto?.telefono,
    email: client.contacto?.email,
  };
}

/**
 * Mapea el tipo de cliente del backend al frontend
 */
function mapTipoClienteToUI(tipo: string): 'publico' | 'privado' {
  switch (tipo) {
    case 'Hospital':
    case 'Centro Médico':
      return 'publico';
    case 'Clínica':
    case 'Laboratorio':
      return 'privado';
    default:
      return 'publico';
  }
}

/**
 * Mapea el tipo de cliente del frontend al backend
 */
function mapTipoClienteToAPI(tipo: string): 'Hospital' | 'Clínica' | 'Centro Médico' | 'Laboratorio' {
  switch (tipo) {
    case 'publico':
      return 'Hospital';
    case 'privado':
      return 'Clínica';
    default:
      return 'Hospital';
  }
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
    equipo_id: order.equipo_id,
    cliente_id: order.cliente_id,
    equipo: {
      modelo: order.equipo?.modelo || '',
      numeroSerie: order.equipo?.numero_serie || '',
      fabricante: order.equipo?.fabricante?.nombre || '',
    },
    cliente: order.cliente?.nombre || '',
    prioridad: mapPrioridadToUI(order.prioridad || ''),
    estado: mapEstadoOrdenToUI(order.estado || ''),
    tipo: (order as any).tipo || 'correctivo',
    titulo: order.falla_reportada || '',
    descripcion: order.falla_reportada || '',
    fechaCreacion: order.fecha_apertura || '',
    fechaVencimiento: (order as any).fecha_vencimiento || '',
    tecnico: (order as any).tecnico ? (order as any).tecnico.nombre : 'Sin asignar',
    tecnico_id: (order as any).tecnico_id,
    tiempoEstimado: '',
  };
}

/**
 * Convierte una orden del frontend al formato del backend
 */
export function mapOrderToAPI(order: Partial<OrderUI> & { equipo_id?: number; cliente_id?: number; }, extra?: { isEdit?: boolean }) {
  // Usar los IDs reales del formulario
  return {
    equipo_id: order.equipo_id,
    cliente_id: order.cliente_id,
    tecnico_id: order.tecnico_id,
    prioridad: mapPrioridadToAPI(order.prioridad || 'normal'),
    estado: mapEstadoOrdenToAPI(order.estado || 'abierta'),
    falla_reportada: order.descripcion || order.titulo,
    fecha_apertura: order.fechaCreacion,
    // Solo para edición: no enviar fecha_apertura si no se edita
    ...(extra?.isEdit ? { fecha_apertura: undefined } : {}),
  };
}

/**
 * Mapea la prioridad de la orden del backend al frontend
 */
function mapPrioridadToUI(prioridad: string): 'critica' | 'alta' | 'normal' {
  switch (prioridad) {
    case 'Crítica':
      return 'critica';
    case 'Alta':
      return 'alta';
    case 'Media':
    case 'Baja':
      return 'normal';
    default:
      return 'normal';
  }
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
  switch (estado) {
    case 'Abierta':
      return 'abierta';
    case 'Asignada':
    case 'En Proceso':
    case 'En Espera':
      return 'proceso';
    case 'Cerrada':
    case 'Cancelada':
      return 'cerrada';
    default:
      return 'abierta';
  }
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
    activo: !!tecnico.activo,
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
