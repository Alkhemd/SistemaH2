import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface CreateOrdenData {
  equipo_id: number;
  cliente_id: number;
  tipo: 'correctivo' | 'preventivo' | 'calibracion';
  prioridad: 'critica' | 'alta' | 'normal';
  titulo: string;
  descripcion?: string;
  tecnico_id?: number;
  fecha_vencimiento?: string;
  tiempo_estimado?: string;
}

export interface Orden {
  id: number;
  numero_orden: string;
  equipo_id: number;
  cliente_id: number;
  tipo: string;
  prioridad: string;
  estado: string;
  titulo: string;
  descripcion?: string;
  fecha_apertura: string;
  fecha_vencimiento?: string;
  fecha_cierre?: string;
  tecnico_id?: number;
  tiempo_estimado?: string;
  equipo?: any;
  cliente?: any;
  tecnico?: any;
}

class OrdenesService {
  async getAll(params?: {
    page?: number;
    limit?: number;
    estado?: string;
    prioridad?: string;
    cliente_id?: number;
    equipo_id?: number;
  }): Promise<{ data: Orden[]; total: number; pages: number }> {
    try {
      const response = await axios.get(`${API_URL}/ordenes-trabajo`, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Orden> {
    try {
      const response = await axios.get(`${API_URL}/ordenes-trabajo/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener orden:', error);
      throw error;
    }
  }

  async create(data: CreateOrdenData): Promise<Orden> {
    try {
      const response = await axios.post(`${API_URL}/ordenes-trabajo`, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<CreateOrdenData>): Promise<Orden> {
    try {
      const response = await axios.put(`${API_URL}/ordenes-trabajo/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/ordenes-trabajo/${id}`);
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      throw error;
    }
  }
}

export const ordenesService = new OrdenesService();
