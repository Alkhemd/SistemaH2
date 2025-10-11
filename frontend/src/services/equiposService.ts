import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface Equipo {
  id: number;
  numero_serie: string;
  modelo: string;
  fabricante_id: number;
  modalidad_id: number;
  cliente_id: number;
  fabricante?: { nombre: string };
  modalidad?: { nombre: string };
}

class EquiposService {
  async getAll(params?: { page?: number; limit?: number }): Promise<{ data: Equipo[] }> {
    try {
      const response = await axios.get(`${API_URL}/equipos`, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener equipos:', error);
      throw error;
    }
  }
}

export const equiposService = new EquiposService();
