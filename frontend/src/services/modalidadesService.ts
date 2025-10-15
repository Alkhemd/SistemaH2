import { supabase } from '../lib/supabaseClient';

export interface Modalidad {
  modalidad_id: number;
  codigo: string;
  descripcion?: string;
}

class ModalidadesService {
  async getAll(): Promise<{ data: Modalidad[] | null; error: any }> {
    const { data, error } = await supabase
      .from('modalidad')
      .select('*');
    if (error) {
      console.error('Error al obtener modalidades:', error);
    }
    return { data: data as Modalidad[] | null, error };
  }

  async create(data: Omit<Modalidad, 'modalidad_id'>): Promise<{ data: Modalidad | null; error: any }> {
    // Obtener el máximo ID actual y sumarle 1
    const { data: maxIdResult } = await supabase
      .from('modalidad')
      .select('modalidad_id')
      .order('modalidad_id', { ascending: false })
      .limit(1)
      .single();
    
    const nextId = maxIdResult ? maxIdResult.modalidad_id + 1 : 1;
    
    const { data: created, error } = await supabase
      .from('modalidad')
      .insert([{ ...data, modalidad_id: nextId }])
      .select()
      .single();
    if (error) {
      console.error('Error al crear modalidad:', error);
    }
    return { data: created as Modalidad | null, error };
  }

  async update(id: number, data: Partial<Omit<Modalidad, 'modalidad_id'>>): Promise<{ data: Modalidad | null; error: any }> {
    const { data: updated, error } = await supabase
      .from('modalidad')
      .update(data)
      .eq('modalidad_id', id)
      .select()
      .single();
    if (error) {
      console.error('Error al actualizar modalidad:', error);
    }
    return { data: updated as Modalidad | null, error };
  }

  async delete(id: number): Promise<{ error: any }> {
    const { error } = await supabase
      .from('modalidad')
      .delete()
      .eq('modalidad_id', id);
    if (error) {
      console.error('Error al eliminar modalidad:', error);
    }
    return { error };
  }
}

export const modalidadesService = new ModalidadesService();
