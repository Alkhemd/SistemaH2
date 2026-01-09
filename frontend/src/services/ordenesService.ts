import { backendClient } from '../lib/backendClient';

export interface CreateOrdenData {
  equipo_id: number;
  cliente_id: number;
  contrato_id?: number;
  prioridad?: string;
  estado?: string;
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
  async getAll(): Promise<{ data: Orden[] | null; error: any }> {
    return backendClient.get<Orden[]>('/ordenes');
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
