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
  async getAll(): Promise<{ data: Cliente[] | null; error: any }> {
    return backendClient.get<Cliente[]>('/clientes');
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
