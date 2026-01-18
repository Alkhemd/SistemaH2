import axios from 'axios';

// Configuración base de la API - Backend Node.js + Express
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 404) {
      console.error('Endpoint no encontrado:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

// Interfaces para catálogos
export interface Modalidad {
  modalidad_id: number;
  codigo: string;
  descripcion?: string;
}

export interface Fabricante {
  fabricante_id: number;
  nombre: string;
  pais?: string;
  soporte_tel?: string;
  web?: string;
}

export interface Contrato {
  contrato_id: number;
  cliente_id: number;
  tipo_contrato?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  activo?: number;
}

export interface Tecnico {
  tecnico_id: number;
  nombre: string;
  especialidad?: 'XR' | 'CT' | 'MR' | 'US' | 'MG' | 'PET/CT' | 'Multi-mod' | 'DEXA' | 'RF' | 'CATH';
  certificaciones?: string;
  telefono?: string;
  email?: string;
  base_ciudad?: string;
  activo?: number;
}

// Tipos actualizados para coincidir con backend
export interface Equipment {
  equipo_id: number;
  id?: number; // Alias para compatibilidad
  cliente_id: number;
  modalidad_id: number;
  fabricante_id: number;
  contrato_id?: number;
  modelo: string;
  numero_serie: string;
  numeroSerie?: string; // Alias para compatibilidad
  asset_tag?: string;
  fecha_instalacion?: string;
  fechaInstalacion?: string; // Alias para compatibilidad
  estado_equipo: 'Operativo' | 'En_Mantenimiento' | 'Fuera_Servicio' | 'Desinstalado';
  estado?: 'operativo' | 'mantenimiento' | 'fuera-servicio'; // Alias para compatibilidad
  ubicacion?: string;
  software_version?: string;
  horas_uso?: number;
  garantia_hasta?: string;
  ultimaCalibacion?: string; // Para compatibilidad
  proximaCalibacion?: string; // Para compatibilidad
  foto_url?: string;
  // Relaciones populadas
  cliente?: Client;
  modalidad?: Modalidad;
  fabricante?: Fabricante;
  contrato?: Contrato;
}

export interface Client {
  cliente_id: number;
  id?: number; // Alias para compatibilidad
  nombre: string;
  tipo?: 'Hospital' | 'Clínica' | 'Centro Médico' | 'Laboratorio';
  direccion?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  contacto?: {
    telefono: string;
    email: string;
    responsable: string;
  } | string;
  telefono?: string;
  email?: string;
  // Propiedades calculadas para compatibilidad con UI existente
  equiposCount?: number;
  fechaRegistro?: string;
  ultimaActividad?: string;
  estado_cliente?: 'activo' | 'inactivo';
  // Relaciones
  equipos?: Equipment[];
  contratos?: Contrato[];
}

export interface Order {
  orden_id: number;
  equipo_id: number;
  cliente_id: number;
  contrato_id?: number;
  fecha_apertura?: string;
  prioridad?: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  estado?: 'Abierta' | 'Asignada' | 'En Proceso' | 'En Espera' | 'Cerrada' | 'Cancelada';
  falla_reportada?: string;
  origen?: 'Llamada' | 'Portal' | 'PM' | 'Alarma Remota' | 'Email';
  // Relaciones populadas
  equipo?: Equipment;
  cliente?: Client;
  contrato?: Contrato;
  // Propiedades para compatibilidad con UI existente
  tipo?: 'correctivo' | 'preventivo' | 'calibracion';
  titulo?: string;
  descripcion?: string;
  fechaCreacion?: string;
  fechaVencimiento?: string;
  tecnico?: string;
  tiempoEstimado?: string;
}

// Tipo para respuestas paginadas del backend
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

// API Services actualizados
export const equipmentApi = {
  getAll: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<Equipment[]>>('/equipos', { params: { limit: 1000, ...params } }),
  getById: (id: number) => api.get<ApiResponse<Equipment>>(`/equipos/${id}`),
  create: (data: Omit<Equipment, 'equipo_id'>) => api.post<ApiResponse<Equipment>>('/equipos', data),
  update: (id: number, data: Partial<Equipment>) => api.put<ApiResponse<Equipment>>(`/equipos/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/equipos/${id}`),
  getByEstado: (estado: string) => api.get<ApiResponse<Equipment[]>>(`/equipos/estado/${estado}`),
  getBySerial: (serial: string) => api.get<ApiResponse<Equipment>>(`/equipos/serial/${serial}`),
  getHistorial: (id: number) => api.get<ApiResponse<any[]>>(`/equipos/${id}/historial`),
};

export const clientApi = {
  getAll: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<Client[]>>('/clientes', { params: { limit: 1000, ...params } }),
  getById: (id: number) => api.get<ApiResponse<Client>>(`/clientes/${id}`),
  create: (data: Omit<Client, 'cliente_id'>) => api.post<ApiResponse<Client>>('/clientes', data),
  update: (id: number, data: Partial<Client>) => api.put<ApiResponse<Client>>(`/clientes/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/clientes/${id}`),
  getByCity: (ciudad: string) => api.get<ApiResponse<Client[]>>(`/clientes/ciudad/${ciudad}`),
  getWithEquipos: (id: number) => api.get<ApiResponse<Client>>(`/clientes/${id}/equipos`),
};

export const orderApi = {
  getAll: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<Order[]>>('/ordenes', { params: { limit: 1000, ...params } }),
  getById: (id: number) => api.get<ApiResponse<Order>>(`/ordenes/${id}`),
  create: (data: Omit<Order, 'orden_id'>) => api.post<ApiResponse<Order>>('/ordenes', data),
  update: (id: number, data: Partial<Order>) => api.put<ApiResponse<Order>>(`/ordenes/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/ordenes/${id}`),
  getHistorial: (id: number) => api.get<ApiResponse<any[]>>(`/ordenes/${id}/historial`),
  getByEstado: (estado: string) => api.get<ApiResponse<Order[]>>(`/ordenes/estado/${estado}`),
};

// Nuevos servicios para catálogos
export const modalidadApi = {
  getAll: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<Modalidad[]>>('/modalidades', { params: { limit: 1000, ...params } }),
  getById: (id: number) => api.get<ApiResponse<Modalidad>>(`/modalidades/${id}`),
  create: (data: Omit<Modalidad, 'modalidad_id'>) => api.post<ApiResponse<Modalidad>>('/modalidades', data),
  update: (id: number, data: Partial<Modalidad>) => api.put<ApiResponse<Modalidad>>(`/modalidades/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/modalidades/${id}`),
};

export const fabricanteApi = {
  getAll: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<Fabricante[]>>('/fabricantes', { params: { limit: 1000, ...params } }),
  getById: (id: number) => api.get<ApiResponse<Fabricante>>(`/fabricantes/${id}`),
  create: (data: Omit<Fabricante, 'fabricante_id'>) => api.post<ApiResponse<Fabricante>>('/fabricantes', data),
  update: (id: number, data: Partial<Fabricante>) => api.put<ApiResponse<Fabricante>>(`/fabricantes/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/fabricantes/${id}`),
};

export const tecnicoApi = {
  getAll: (params?: { page?: number; limit?: number }) => api.get<ApiResponse<Tecnico[]>>('/tecnicos', { params: { limit: 1000, ...params } }),
  getById: (id: number) => api.get<ApiResponse<Tecnico>>(`/tecnicos/${id}`),
  create: (data: Omit<Tecnico, 'tecnico_id'>) => api.post<ApiResponse<Tecnico>>('/tecnicos', data),
  update: (id: number, data: Partial<Tecnico>) => api.put<ApiResponse<Tecnico>>(`/tecnicos/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/tecnicos/${id}`),
  getActivos: () => api.get<ApiResponse<Tecnico[]>>('/tecnicos/activos'),
};

// Dashboard API
export const dashboardApi = {
  getEstadisticas: () => api.get<ApiResponse<any>>('/dashboard/estadisticas'),
  getActividadReciente: (limit?: number) => api.get<ApiResponse<any>>('/dashboard/actividad-reciente', { params: { limit } }),
  getResumen: () => api.get<ApiResponse<any>>('/dashboard/resumen'),
};

export default api;
