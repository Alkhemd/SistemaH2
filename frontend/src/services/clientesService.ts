import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface Cliente {
  id: number;
  nombre: string;
  tipo: string;
  direccion?: string;
  telefono?: string;
}

class ClientesService {
  async getAll(params?: { page?: number; limit?: number }): Promise<{ data: Cliente[] }> {
    try {
      const response = await axios.get(`${API_URL}/clientes`, { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }
}

export const clientesService = new ClientesService();
