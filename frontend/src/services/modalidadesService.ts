import { backendClient } from '../lib/backendClient';

export interface Modalidad {
  modalidad_id: number;
  codigo: string;
  descripcion?: string;
  prioridad_alta?: boolean;
}

class ModalidadesService {
  async getAll(): Promise<{ data: Modalidad[] | null; error: any }> {
    return backendClient.get<Modalidad[]>('/modalidades');
  }

  async getPaginated(page = 1, limit = 20, search = ''): Promise<any> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search
    });
    return backendClient.get(`/modalidades/paginated?${params}`);
  }

  async create(data: Omit<Modalidad, 'modalidad_id'>): Promise<{ data: Modalidad | null; error: any }> {
    return backendClient.post<Modalidad>('/modalidades', data);
  }

  async update(id: number, data: Partial<Omit<Modalidad, 'modalidad_id'>>): Promise<{ data: Modalidad | null; error: any }> {
    return backendClient.put<Modalidad>(`/modalidades/${id}`, data);
  }

  async delete(id: number): Promise<{ error: any }> {
    return backendClient.delete(`/modalidades/${id}`);
  }
}

export const modalidadesService = new ModalidadesService();
