import { backendClient } from '../lib/backendClient';

export interface Cliente {
  cliente_id: number;
  nombre: string;
  tipo: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  equipos_count?: number;
}

class ClientesService {
  // Get all clients without pagination (for dropdowns)
  async getAllForDropdown(): Promise<{ data: Cliente[] | null; error: any }> {
    return backendClient.get<Cliente[]>('/clientes/all');
  }

  async getAll(params?: { page?: number; limit?: number; search?: string }): Promise<{ data: Cliente[] | null; pagination?: any; error: any }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = queryParams.toString() ? `/clientes?${queryParams}` : '/clientes';
    return backendClient.get<Cliente[]>(endpoint);
  }

  async create(data: Omit<Cliente, 'cliente_id'>): Promise<{ data: Cliente | null; error: any }> {
    return backendClient.post<Cliente>('/clientes', data);
  }

  async update(id: number, data: Partial<Omit<Cliente, 'cliente_id'>>): Promise<{ data: Cliente | null; error: any }> {
    return backendClient.put<Cliente>(`/clientes/${id}`, data);
  }

  async delete(id: number): Promise<{ error: any }> {
    return backendClient.delete(`/clientes/${id}`);
  }
}

export const clientesService = new ClientesService();
