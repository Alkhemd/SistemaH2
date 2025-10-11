import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface Tecnico {
  id: number;
  nombre: string;
  apellido: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
}

class TecnicosService {
  async getAll(params?: { page?: number; limit?: number }): Promise<{ data: Tecnico[] }> {
    try {
      const response = await axios.get(`${API_URL}/tecnicos`, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener técnicos:', error);
      throw error;
    }
  }
}

export const tecnicosService = new TecnicosService();
