
import { supabase } from '../lib/supabaseClient';

export interface CreateOrdenData {
  equipo_id: number;
  cliente_id: number;
  contrato_id?: number;
  prioridad?: string;
  estado?: string;
  falla_reportada?: string;
  origen?: string;
  fecha_apertura?: string;
}

export interface Orden {
  orden_id: number;
  equipo_id: number;
  cliente_id: number;
  contrato_id?: number;
  fecha_apertura: string;
  prioridad?: string;
  estado?: string;
  falla_reportada?: string;
  origen?: string;
}


class OrdenesService {
  async getAll(): Promise<{ data: any[] | null; error: any }> {
    // Traer datos relacionados de equipo y cliente
    const { data, error } = await supabase
      .from('orden_trabajo')
      .select(`
        *,
        equipo:equipo_id(
          equipo_id,
          modelo,
          numero_serie,
          fabricante:fabricante_id(fabricante_id, nombre)
        ),
        cliente:cliente_id(cliente_id, nombre)
      `);
    if (error) {
      console.error('Error al obtener órdenes:', error);
    }
    return { data: data as any[] | null, error };
  }

  async getById(id: number): Promise<{ data: Orden | null; error: any }> {
    const { data, error } = await supabase
      .from('orden_trabajo')
      .select('*')
      .eq('orden_id', id)
      .single();
    if (error) {
      console.error('Error al obtener orden:', error);
    }
    return { data: data as Orden | null, error };
  }

  async create(data: CreateOrdenData): Promise<{ data: Orden | null; error: any }> {
    // Obtener el máximo ID actual y sumarle 1
    const { data: maxIdResult } = await supabase
      .from('orden_trabajo')
      .select('orden_id')
      .order('orden_id', { ascending: false })
      .limit(1)
      .single();
    
    const nextId = maxIdResult ? maxIdResult.orden_id + 1 : 1;
    
    // Agregar fecha_apertura si no existe
    const dataWithDefaults = {
      ...data,
      orden_id: nextId,
      fecha_apertura: data.fecha_apertura || new Date().toISOString(),
      estado: data.estado || 'Abierta',
      prioridad: data.prioridad || 'Normal',
      origen: data.origen || 'Portal'
    };
    
    const { data: created, error } = await supabase
      .from('orden_trabajo')
      .insert([dataWithDefaults])
      .select(`
        *,
        equipo:equipo_id(
          equipo_id,
          modelo,
          numero_serie,
          fabricante:fabricante_id(fabricante_id, nombre)
        ),
        cliente:cliente_id(cliente_id, nombre)
      `)
      .single();
    if (error) {
      console.error('Error al crear orden:', error);
    }
    return { data: created as Orden | null, error };
  }

  async update(id: number, data: Partial<CreateOrdenData>): Promise<{ data: Orden | null; error: any }> {
    const { data: updated, error } = await supabase
      .from('orden_trabajo')
      .update(data)
      .eq('orden_id', id)
      .select(`
        *,
        equipo:equipo_id(
          equipo_id,
          modelo,
          numero_serie,
          fabricante:fabricante_id(fabricante_id, nombre)
        ),
        cliente:cliente_id(cliente_id, nombre)
      `)
      .single();
    if (error) {
      console.error('Error al actualizar orden:', error);
    }
    return { data: updated as Orden | null, error };
  }

  async delete(id: number): Promise<{ error: any }> {
    // Eliminar en orden de dependencias (foreign key constraints)
    
    // 1. Obtener IDs de intervenciones asociadas
    const { data: intervenciones } = await supabase
      .from('intervencion')
      .select('intervencion_id')
      .eq('orden_id', id);
    
    // 2. Eliminar partes_usadas si hay intervenciones
    if (intervenciones && intervenciones.length > 0) {
      const intervencionIds = intervenciones.map(i => i.intervencion_id);
      const { error: partesError } = await supabase
        .from('partes_usadas')
        .delete()
        .in('intervencion_id', intervencionIds);
      
      if (partesError && partesError.code !== 'PGRST116') {
        console.error('Error al eliminar partes usadas:', partesError);
      }
    }
    
    // 3. Eliminar intervenciones asociadas
    const { error: intervencionesError } = await supabase
      .from('intervencion')
      .delete()
      .eq('orden_id', id);
    
    if (intervencionesError && intervencionesError.code !== 'PGRST116') {
      console.error('Error al eliminar intervenciones:', intervencionesError);
    }
    
    // 4. Eliminar eventos asociados
    const { error: eventosError } = await supabase
      .from('evento_orden')
      .delete()
      .eq('orden_id', id);
    
    if (eventosError && eventosError.code !== 'PGRST116') {
      console.error('Error al eliminar eventos de la orden:', eventosError);
      return { error: eventosError };
    }
    
    // 5. Finalmente eliminar la orden
    const { error } = await supabase
      .from('orden_trabajo')
      .delete()
      .eq('orden_id', id);
    
    if (error) {
      console.error('Error al eliminar orden:', error);
    }
    
    return { error };
  }
}

export const ordenesService = new OrdenesService();
