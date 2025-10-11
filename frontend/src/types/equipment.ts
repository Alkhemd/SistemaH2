// Tipos específicos para equipos
// Estos tipos mantienen compatibilidad con la UI existente mientras
// mapean desde/hacia la estructura del backend

export interface EquipmentUI {
  id: string;
  modelo: string;
  numeroSerie: string;
  fabricante: string;
  modalidad: string;
  cliente: string;
  estado: 'operativo' | 'mantenimiento' | 'fuera-servicio';
  ubicacion: string;
  fechaInstalacion: string;
  ultimaCalibacion: string;
  proximaCalibacion: string;
}

export interface ClientUI {
  id: string;
  nombre: string;
  tipo: 'publico' | 'privado';
  ciudad: string;
  estado: string;
  equiposCount: number;
  contacto: {
    telefono: string;
    email: string;
    responsable: string;
  };
  fechaRegistro: string;
  ultimaActividad: string;
  estado_cliente: 'activo' | 'inactivo';
}

export interface OrderUI {
  id: string;
  equipo: {
    modelo: string;
    numeroSerie: string;
    fabricante: string;
  };
  cliente: string;
  prioridad: 'critica' | 'alta' | 'normal';
  estado: 'abierta' | 'proceso' | 'cerrada';
  tipo: 'correctivo' | 'preventivo' | 'calibracion';
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  fechaVencimiento?: string;
  tecnico?: string;
  tiempoEstimado: string;
}

// Funciones de mapeo desde backend hacia UI
import { Equipment, Client, Order } from '@/lib/api';

export const mapEquipmentToUI = (equipment: Equipment): EquipmentUI => ({
  id: equipment.equipo_id.toString(),
  modelo: equipment.modelo || '',
  numeroSerie: equipment.numero_serie || '',
  fabricante: equipment.fabricante?.nombre || '',
  modalidad: equipment.modalidad?.descripcion || equipment.modalidad?.codigo || '',
  cliente: equipment.cliente?.nombre || '',
  estado: mapEstadoEquipo(equipment.estado_equipo),
  ubicacion: equipment.ubicacion || '',
  fechaInstalacion: equipment.fecha_instalacion || '',
  ultimaCalibacion: '', // Se calculará desde historial
  proximaCalibacion: '', // Se calculará desde historial
});

export const mapClientToUI = (client: Client): ClientUI => ({
  id: client.cliente_id.toString(),
  nombre: client.nombre || '',
  tipo: mapTipoCliente(client.tipo),
  ciudad: client.ciudad || '',
  estado: client.estado || '',
  equiposCount: client.equipos?.length || 0,
  contacto: {
    telefono: client.telefono || '',
    email: client.email || '',
    responsable: typeof client.contacto === 'string' ? client.contacto : client.contacto?.responsable || '',
  },
  fechaRegistro: client.fechaRegistro || new Date().toISOString().split('T')[0],
  ultimaActividad: client.ultimaActividad || new Date().toISOString().split('T')[0],
  estado_cliente: client.estado_cliente || 'activo',
});

export const mapOrderToUI = (order: Order): OrderUI => ({
  id: order.orden_id.toString(),
  equipo: {
    modelo: order.equipo?.modelo || '',
    numeroSerie: order.equipo?.numero_serie || '',
    fabricante: order.equipo?.fabricante?.nombre || '',
  },
  cliente: order.cliente?.nombre || '',
  prioridad: mapPrioridad(order.prioridad),
  estado: mapEstadoOrden(order.estado),
  tipo: order.tipo || 'correctivo',
  titulo: order.titulo || order.falla_reportada || '',
  descripcion: order.descripcion || order.falla_reportada || '',
  fechaCreacion: order.fecha_apertura || order.fechaCreacion || '',
  fechaVencimiento: order.fechaVencimiento,
  tecnico: order.tecnico,
  tiempoEstimado: order.tiempoEstimado || '2 horas',
});

// Funciones de mapeo desde UI hacia backend
export const mapUIToEquipment = (equipmentUI: Partial<EquipmentUI>, clienteId?: number, modalidadId?: number, fabricanteId?: number): Omit<Equipment, 'equipo_id'> => ({
  cliente_id: clienteId || 1, // Valor por defecto temporal
  modalidad_id: modalidadId || 1, // Valor por defecto temporal
  fabricante_id: fabricanteId || 1, // Valor por defecto temporal
  modelo: equipmentUI.modelo || '',
  numero_serie: equipmentUI.numeroSerie || '',
  estado_equipo: mapEstadoEquipoToBackend(equipmentUI.estado),
  ubicacion: equipmentUI.ubicacion,
  fecha_instalacion: equipmentUI.fechaInstalacion,
});

export const mapUIToClient = (clientUI: Partial<ClientUI>): Omit<Client, 'cliente_id'> => ({
  nombre: clientUI.nombre || '',
  tipo: mapTipoClienteToBackend(clientUI.tipo),
  ciudad: clientUI.ciudad,
  estado: clientUI.estado,
  telefono: clientUI.contacto?.telefono,
  email: clientUI.contacto?.email,
  contacto: clientUI.contacto?.responsable,
});

export const mapUIToOrder = (orderUI: Partial<OrderUI>, equipoId?: number, clienteId?: number): Omit<Order, 'orden_id'> => ({
  equipo_id: equipoId || 1, // Valor por defecto temporal
  cliente_id: clienteId || 1, // Valor por defecto temporal
  prioridad: mapPrioridadToBackend(orderUI.prioridad),
  estado: mapEstadoOrdenToBackend(orderUI.estado),
  falla_reportada: orderUI.descripcion || orderUI.titulo,
  fecha_apertura: orderUI.fechaCreacion,
});

// Funciones auxiliares de mapeo
function mapEstadoEquipo(estado?: string): 'operativo' | 'mantenimiento' | 'fuera-servicio' {
  switch (estado) {
    case 'Operativo': return 'operativo';
    case 'En_Mantenimiento': return 'mantenimiento';
    case 'Fuera_Servicio':
    case 'Desinstalado': return 'fuera-servicio';
    default: return 'operativo';
  }
}

function mapEstadoEquipoToBackend(estado?: string): 'Operativo' | 'En_Mantenimiento' | 'Fuera_Servicio' | 'Desinstalado' {
  switch (estado) {
    case 'operativo': return 'Operativo';
    case 'mantenimiento': return 'En_Mantenimiento';
    case 'fuera-servicio': return 'Fuera_Servicio';
    default: return 'Operativo';
  }
}

function mapTipoCliente(tipo?: string): 'publico' | 'privado' {
  switch (tipo) {
    case 'Hospital':
    case 'Centro Médico': return 'publico';
    case 'Clínica':
    case 'Laboratorio': return 'privado';
    default: return 'publico';
  }
}

function mapTipoClienteToBackend(tipo?: string): 'Hospital' | 'Clínica' | 'Centro Médico' | 'Laboratorio' {
  switch (tipo) {
    case 'publico': return 'Hospital';
    case 'privado': return 'Clínica';
    default: return 'Hospital';
  }
}

function mapPrioridad(prioridad?: string): 'critica' | 'alta' | 'normal' {
  switch (prioridad) {
    case 'Crítica': return 'critica';
    case 'Alta': return 'alta';
    case 'Media':
    case 'Baja': return 'normal';
    default: return 'normal';
  }
}

function mapPrioridadToBackend(prioridad?: string): 'Baja' | 'Media' | 'Alta' | 'Crítica' {
  switch (prioridad) {
    case 'critica': return 'Crítica';
    case 'alta': return 'Alta';
    case 'normal': return 'Media';
    default: return 'Media';
  }
}

function mapEstadoOrden(estado?: string): 'abierta' | 'proceso' | 'cerrada' {
  switch (estado) {
    case 'Abierta': return 'abierta';
    case 'Asignada':
    case 'En Proceso':
    case 'En Espera': return 'proceso';
    case 'Cerrada':
    case 'Cancelada': return 'cerrada';
    default: return 'abierta';
  }
}

function mapEstadoOrdenToBackend(estado?: string): 'Abierta' | 'Asignada' | 'En Proceso' | 'En Espera' | 'Cerrada' | 'Cancelada' {
  switch (estado) {
    case 'abierta': return 'Abierta';
    case 'proceso': return 'En Proceso';
    case 'cerrada': return 'Cerrada';
    default: return 'Abierta';
  }
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface EquipmentFilters {
  modalidades: string[];
  estados: string[];
  fabricantes: string[];
}
