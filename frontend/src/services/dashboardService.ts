import { supabase } from '../lib/supabaseClient';

export interface DashboardStats {
  totalEquipments: number;
  openOrders: number;
  maintenanceEquipments: number;
  operativeEquipments: number;
}

export interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  status: string;
  equipment?: string;
  client?: string;
  time?: string;
}

class DashboardService {
  async getEstadisticas(): Promise<{ data: DashboardStats | null; error: any }> {
    try {
      console.log('🔹 Iniciando consulta de estadísticas...');
      
      // Obtener total de equipos
      console.log('🔹 Consultando total de equipos...');
      const { count: totalEquipments, error: equiposError } = await supabase
        .from('equipo')
        .select('*', { count: 'exact', head: true });

      console.log('📊 Total de equipos:', totalEquipments, 'Error:', equiposError);

      if (equiposError) {
        console.error('❌ Error al obtener equipos:', equiposError);
        return { data: null, error: equiposError };
      }

      // Obtener órdenes abiertas
      console.log('🔹 Consultando órdenes abiertas...');
      const { count: openOrders, error: ordenesError } = await supabase
        .from('orden_trabajo')
        .select('*', { count: 'exact', head: true });

      console.log('📊 Órdenes abiertas (total):', openOrders, 'Error:', ordenesError);

      if (ordenesError) {
        console.error('❌ Error al obtener órdenes:', ordenesError);
      }

      // Obtener equipos en mantenimiento - usando el valor correcto de la BD
      console.log('🔹 Consultando equipos en mantenimiento...');
      const { count: maintenanceEquipments, error: mantenimientoError } = await supabase
        .from('equipo')
        .select('*', { count: 'exact', head: true })
        .eq('estado_equipo', 'En_Mantenimiento');

      console.log('📊 Equipos en mantenimiento:', maintenanceEquipments, 'Error:', mantenimientoError);

      if (mantenimientoError) {
        console.error('❌ Error al obtener equipos en mantenimiento:', mantenimientoError);
      }

      // Obtener equipos operativos - usando el valor correcto de la BD
      console.log('🔹 Consultando equipos operativos...');
      const { count: operativeEquipments, error: operativosError } = await supabase
        .from('equipo')
        .select('*', { count: 'exact', head: true })
        .eq('estado_equipo', 'Operativo');

      console.log('📊 Equipos operativos:', operativeEquipments, 'Error:', operativosError);

      if (operativosError) {
        console.error('Error al obtener equipos operativos:', operativosError);
      }

      const stats: DashboardStats = {
        totalEquipments: totalEquipments || 0,
        openOrders: openOrders || 0,
        maintenanceEquipments: maintenanceEquipments || 0,
        operativeEquipments: operativeEquipments || 0,
      };

      console.log('✅ Estadísticas finales:', stats);
      return { data: stats, error: null };
    } catch (error) {
      console.error('Error en getEstadisticas:', error);
      return { data: null, error };
    }
  }

  async getActividadReciente(): Promise<{ data: RecentActivity[] | null; error: any }> {
    try {
      console.log('🔹 Consultando actividad reciente...');
      
      // Obtener órdenes con datos relacionados de equipo y cliente
      const { data, error } = await supabase
        .from('orden_trabajo')
        .select(`
          *,
          equipo:equipo_id(numero_serie, modelo),
          cliente:cliente_id(nombre)
        `)
        .order('fecha_apertura', { ascending: false })
        .limit(10);

      console.log('📊 Datos de orden_trabajo con relaciones:', data, 'Error:', error);

      if (error) {
        console.error('❌ Error al obtener actividad reciente:', error);
        return { data: null, error };
      }

      const activities: RecentActivity[] = (data || []).map((orden: any) => {
        // Formatear el equipo
        const equipoInfo = orden.equipo 
          ? `${orden.equipo.modelo || 'Modelo'} (${orden.equipo.numero_serie || 'S/N'})`
          : `Orden #${orden.orden_id}`;
        
        // Formatear la fecha
        const fecha = orden.fecha_apertura 
          ? new Date(orden.fecha_apertura).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })
          : 'Fecha desconocida';

        return {
          id: orden.orden_id,
          type: orden.prioridad || 'normal',
          description: orden.falla_reportada || equipoInfo,
          timestamp: fecha,
          status: orden.estado || 'pendiente',
          equipment: equipoInfo,
          client: orden.cliente?.nombre || 'Cliente no especificado',
          time: fecha
        };
      });

      console.log('✅ Actividades procesadas:', activities);
      return { data: activities, error: null };
    } catch (error) {
      console.error('Error en getActividadReciente:', error);
      return { data: null, error };
    }
  }
}

export const dashboardService = new DashboardService();