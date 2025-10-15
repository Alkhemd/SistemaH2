
import { supabase } from '../lib/supabaseClient';

export interface Tecnico {
  tecnico_id: number;
  nombre: string;
  especialidad?: string;
  certificaciones?: string;
  telefono?: string;
  email?: string;
  base_ciudad?: string;
  activo?: boolean;
}


class TecnicosService {
  async getAll(): Promise<{ data: Tecnico[] | null; error: any }> {
    const { data, error } = await supabase
      .from('tecnico')
      .select('*');
    if (error) {
      console.error('Error al obtener técnicos:', error);
    }
    // Convertir campo activo de 0/1 a booleano si es necesario
    const dataTyped = data?.map((t: any) => ({ ...t, activo: t.activo === true || t.activo === 1 }));
    return { data: dataTyped as Tecnico[] | null, error };
  }

  async create(data: Omit<Tecnico, 'tecnico_id'>): Promise<{ data: Tecnico | null; error: any }> {
    const { data: created, error } = await supabase
      .from('tecnico')
      .insert([data])
      .select()
      .single();
    if (error) {
      console.error('Error al crear técnico:', error);
    }
    return { data: created as Tecnico | null, error };
  }

  async update(id: number, data: Partial<Omit<Tecnico, 'tecnico_id'>>): Promise<{ data: Tecnico | null; error: any }> {
    const { data: updated, error } = await supabase
      .from('tecnico')
      .update(data)
      .eq('tecnico_id', id)
      .select()
      .single();
    if (error) {
      console.error('Error al actualizar técnico:', error);
    }
    return { data: updated as Tecnico | null, error };
  }

  async delete(id: number): Promise<{ error: any }> {
    const { error } = await supabase
      .from('tecnico')
      .delete()
      .eq('tecnico_id', id);
    if (error) {
      console.error('Error al eliminar técnico:', error);
    }
    return { error };
  }
}

export const tecnicosService = new TecnicosService();
