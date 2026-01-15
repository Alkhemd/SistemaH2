import { backendClient } from '../lib/backendClient';

export interface Fabricante {
  fabricante_id: number;
  nombre: string;
  pais?: string;
  soporte_tel?: string;
  web?: string;
}

class FabricantesService {
  async getAll(): Promise<{ data: Fabricante[] | null; error: any }> {
    return backendClient.get<Fabricante[]>('/fabricantes');
  }

  async getPaginated(page = 1, limit = 20, search = ''): Promise<any> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search
    });
    return backendClient.get(`/fabricantes/paginated?${params}`);
  }

  async create(data: Omit<Fabricante, 'fabricante_id'>): Promise<{ data: Fabricante | null; error: any }> {
    return backendClient.post<Fabricante>('/fabricantes', data);
  }

  async update(id: number, data: Partial<Omit<Fabricante, 'fabricante_id'>>): Promise<{ data: Fabricante | null; error: any }> {
    return backendClient.put<Fabricante>(`/fabricantes/${id}`, data);
  }

  async delete(id: number): Promise<{ error: any }> {
    return backendClient.delete(`/fabricantes/${id}`);
  }
}

export const fabricantesService = new FabricantesService();
