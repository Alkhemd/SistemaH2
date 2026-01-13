import { backendClient } from '../lib/backendClient';

export interface CreateOrdenData {
  equipo_id: number;
  cliente_id: number;
  contrato_id?: number;
  prioridad?: string;
  estado?: string;
  tipo?: string;
  falla_reportada?: string;
  origen?: string;
  fecha_apertura?: string;
}

export interface Orden {
  orden_id: number;
  equipo_id: number;
  cliente_id: number;
  contrato_id?: number;
  fecha_apertura: string;
  prioridad?: string;
  estado?: string;
  falla_reportada?: string;
  origen?: string;
  equipo?: any;
  cliente?: any;
}

class OrdenesService {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    prioridad?: string;
    estado?: string;
  }): Promise<{ data: Orden[] | null; pagination?: any; error: any }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.prioridad) queryParams.append('prioridad', params.prioridad);
    if (params?.estado) queryParams.append('estado', params.estado);

    const endpoint = queryParams.toString() ? `/ordenes?${queryParams}` : '/ordenes';
    return backendClient.get<Orden[]>(endpoint);
  }

  async getById(id: number): Promise<{ data: Orden | null; error: any }> {
    return backendClient.get<Orden>(`/ordenes/${id}`);
  }

  async create(data: CreateOrdenData): Promise<{ data: Orden | null; error: any }> {
    return backendClient.post<Orden>('/ordenes', data);
  }

  async update(id: number, data: Partial<CreateOrdenData>): Promise<{ data: Orden | null; error: any }> {
    return backendClient.put<Orden>(`/ordenes/${id}`, data);
  }

  async delete(id: number): Promise<{ error: any }> {
    return backendClient.delete(`/ordenes/${id}`);
  }
}

export const ordenesService = new OrdenesService();
