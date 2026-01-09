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
