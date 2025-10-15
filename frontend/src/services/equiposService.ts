
import { supabase } from '../lib/supabaseClient';

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
    const { data, error } = await supabase
      .from('equipo')
      .select(`
        *,
        fabricante:fabricante_id(fabricante_id, nombre),
        modalidad:modalidad_id(modalidad_id, codigo, descripcion),
        cliente:cliente_id(cliente_id, nombre)
      `);
    if (error) {
      console.error('Error al obtener equipos:', error);
    }
    return { data: data as Equipo[] | null, error };
  }

  async create(data: Omit<Equipo, 'equipo_id'>): Promise<{ data: Equipo | null; error: any }> {
    // Obtener el máximo ID actual y sumarle 1
    const { data: maxIdResult } = await supabase
      .from('equipo')
      .select('equipo_id')
      .order('equipo_id', { ascending: false })
      .limit(1)
      .single();
    
    const nextId = maxIdResult ? maxIdResult.equipo_id + 1 : 1;
    
    const dataWithId = {
      ...data,
      equipo_id: nextId
    };
    
    const { data: created, error } = await supabase
      .from('equipo')
      .insert([dataWithId])
      .select(`
        *,
        fabricante:fabricante_id(fabricante_id, nombre),
        modalidad:modalidad_id(modalidad_id, codigo, descripcion),
        cliente:cliente_id(cliente_id, nombre)
      `)
      .single();
    if (error) {
      console.error('Error al crear equipo:', error);
    }
    return { data: created as Equipo | null, error };
  }

  async update(id: number, data: Partial<Omit<Equipo, 'equipo_id'>>): Promise<{ data: Equipo | null; error: any }> {
    const { data: updated, error } = await supabase
      .from('equipo')
      .update(data)
      .eq('equipo_id', id)
      .select(`
        *,
        fabricante:fabricante_id(fabricante_id, nombre),
        modalidad:modalidad_id(modalidad_id, codigo, descripcion),
        cliente:cliente_id(cliente_id, nombre)
      `)
      .single();
    if (error) {
      console.error('Error al actualizar equipo:', error);
    }
    return { data: updated as Equipo | null, error };
  }

  async delete(id: number): Promise<{ error: any }> {
    // Eliminar en cascada manual
    
    // 1. Obtener órdenes asociadas al equipo
    const { data: ordenes } = await supabase
      .from('orden_trabajo')
      .select('orden_id')
      .eq('equipo_id', id);
    
    if (ordenes && ordenes.length > 0) {
      const ordenIds = ordenes.map(o => o.orden_id);
      
      // 1.1 Obtener intervenciones de esas órdenes
      const { data: intervenciones } = await supabase
        .from('intervencion')
        .select('intervencion_id')
        .in('orden_id', ordenIds);
      
      if (intervenciones && intervenciones.length > 0) {
        const intervencionIds = intervenciones.map(i => i.intervencion_id);
        
        // 1.1.1 Eliminar partes_usadas
        await supabase
          .from('partes_usadas')
          .delete()
          .in('intervencion_id', intervencionIds);
      }
      
      // 1.2 Eliminar intervenciones
      await supabase
        .from('intervencion')
        .delete()
        .in('orden_id', ordenIds);
      
      // 1.3 Eliminar eventos de órdenes
      await supabase
        .from('evento_orden')
        .delete()
        .in('orden_id', ordenIds);
      
      // 1.4 Eliminar órdenes
      await supabase
        .from('orden_trabajo')
        .delete()
        .in('orden_id', ordenIds);
    }
    
    // 2. Eliminar calibraciones del equipo
    await supabase
      .from('calibracion')
      .delete()
      .eq('equipo_id', id);
    
    // 3. Eliminar mantenimientos del equipo
    await supabase
      .from('mantenimiento')
      .delete()
      .eq('equipo_id', id);
    
    // 4. Finalmente eliminar el equipo
    const { error } = await supabase
      .from('equipo')
      .delete()
      .eq('equipo_id', id);
    
    if (error) {
      console.error('Error al eliminar equipo:', error);
    }
    
    return { error };
  }
}

export const equiposService = new EquiposService();
