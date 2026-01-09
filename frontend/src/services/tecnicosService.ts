import { backendClient } from '../lib/backendClient';

export interface Tecnico {
  tecnico_id: number;
  nombre: string;
  especialidad?: string;
  certificaciones?: string;
  telefono?: string;
  email?: string;
  base_ciudad?: string;
  activo?: boolean;
}

class TecnicosService {
  async getAll(): Promise<{ data: Tecnico[] | null; error: any }> {
    return backendClient.get<Tecnico[]>('/tecnicos');
  }

  async create(data: Omit<Tecnico, 'tecnico_id'>): Promise<{ data: Tecnico | null; error: any }> {
    return backendClient.post<Tecnico>('/tecnicos', data);
  }

  async update(id: number, data: Partial<Omit<Tecnico, 'tecnico_id'>>): Promise<{ data: Tecnico | null; error: any }> {
    return backendClient.put<Tecnico>(`/tecnicos/${id}`, data);
  }

  async delete(id: number): Promise<{ error: any }> {
    return backendClient.delete(`/tecnicos/${id}`);
  }
}

export const tecnicosService = new TecnicosService();
