import { backendClient } from '../lib/backendClient';

export interface Actividad {
    actividad_id: number;
    tipo_operacion: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'LOGIN' | 'LOGOUT' | 'OTHER';
    entidad: string;
    entidad_id?: number;
    titulo: string;
    descripcion?: string;
    datos_anterior?: any;
    datos_nuevo?: any;
    usuario: string;
    ip_address?: string;
    created_at: string;
}

export interface CreateActividadData {
    tipo_operacion: Actividad['tipo_operacion'];
    entidad: string;
    entidad_id?: number;
    titulo: string;
    descripcion?: string;
    datos_anterior?: any;
    datos_nuevo?: any;
    usuario?: string;
}

class ActividadesService {
    // Get activities with pagination and filters
    async getAll(params?: {
        page?: number;
        limit?: number;
        entidad?: string;
        tipo?: string
    }): Promise<{ data: Actividad[] | null; pagination?: any; error: any }> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.entidad) queryParams.append('entidad', params.entidad);
        if (params?.tipo) queryParams.append('tipo', params.tipo);

        const endpoint = queryParams.toString() ? `/actividades?${queryParams}` : '/actividades';
        return backendClient.get<Actividad[]>(endpoint);
    }

    // Get recent activities for dashboard
    async getRecent(limit: number = 5): Promise<{ data: Actividad[] | null; error: any }> {
        return backendClient.get<Actividad[]>(`/actividades/recent?limit=${limit}`);
    }

    // Log a new activity
    async log(data: CreateActividadData): Promise<{ data: Actividad | null; error: any }> {
        return backendClient.post<Actividad>('/actividades', data);
    }

    // Delete an activity
    async delete(id: number): Promise<{ error: any }> {
        return backendClient.delete(`/actividades/${id}`);
    }

    // Cleanup old activities
    async cleanup(days: number = 30): Promise<{ deleted: number; error: any }> {
        return backendClient.delete(`/actividades/cleanup/${days}`) as any;
    }

    // Helper method to log CRUD operations easily
    async logCrud(
        operation: 'CREATE' | 'UPDATE' | 'DELETE',
        entidad: string,
        entidad_id: number | undefined,
        titulo: string,
        descripcion?: string,
        datosAnterior?: any,
        datosNuevo?: any
    ): Promise<void> {
        try {
            await this.log({
                tipo_operacion: operation,
                entidad,
                entidad_id,
                titulo,
                descripcion,
                datos_anterior: datosAnterior,
                datos_nuevo: datosNuevo,
                usuario: 'Sistema' // Could be replaced with actual user from auth
            });
        } catch (error) {
            console.error('Error logging activity:', error);
            // Don't throw - activity logging shouldn't break the main operation
        }
    }
}

export const actividadesService = new ActividadesService();
