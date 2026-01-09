import { backendClient } from '../lib/backendClient';

export interface Equipo {
  equipo_id: number;
  numero_serie: string;
  modelo: string;
  fabricante_id: number;
  modalidad_id: number;
  cliente_id: number;
  contrato_id?: number;
  asset_tag?: string;
  fecha_instalacion?: string;
  estado_equipo?: string;
  ubicacion?: string;
  software_version?: string;
  horas_uso?: number;
  garantia_hasta?: string;
  fabricante?: { nombre: string };
  modalidad?: { descripcion: string };
}

class EquiposService {
  async getAll(): Promise<{ data: Equipo[] | null; error: any }> {
    return backendClient.get<Equipo[]>('/equipos');
  }

  async create(data: Omit<Equipo, 'equipo_id'>): Promise<{ data: Equipo | null; error: any }> {
    return backendClient.post<Equipo>('/equipos', data);
  }

  async update(id: number, data: Partial<Omit<Equipo, 'equipo_id'>>): Promise<{ data: Equipo | null; error: any }> {
    return backendClient.put<Equipo>(`/equipos/${id}`, data);
  }

  async delete(id: number): Promise<{ error: any }> {
    return backendClient.delete(`/equipos/${id}`);
  }
}

export const equiposService = new EquiposService();
