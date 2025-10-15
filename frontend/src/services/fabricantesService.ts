import { supabase } from '../lib/supabaseClient';

export interface Fabricante {
  fabricante_id: number;
  nombre: string;
  pais?: string;
  soporte_tel?: string;
  web?: string;
}

class FabricantesService {
  async getAll(): Promise<{ data: Fabricante[] | null; error: any }> {
    const { data, error } = await supabase
      .from('fabricante')
      .select('*');
    if (error) {
      console.error('Error al obtener fabricantes:', error);
    }
    return { data: data as Fabricante[] | null, error };
  }

  async create(data: Omit<Fabricante, 'fabricante_id'>): Promise<{ data: Fabricante | null; error: any }> {
    // Obtener el máximo ID actual y sumarle 1
    const { data: maxIdResult } = await supabase
      .from('fabricante')
      .select('fabricante_id')
      .order('fabricante_id', { ascending: false })
      .limit(1)
      .single();
    
    const nextId = maxIdResult ? maxIdResult.fabricante_id + 1 : 1;
    
    const { data: created, error } = await supabase
      .from('fabricante')
      .insert([{ ...data, fabricante_id: nextId }])
      .select()
      .single();
    if (error) {
      console.error('Error al crear fabricante:', error);
    }
    return { data: created as Fabricante | null, error };
  }

  async update(id: number, data: Partial<Omit<Fabricante, 'fabricante_id'>>): Promise<{ data: Fabricante | null; error: any }> {
    const { data: updated, error } = await supabase
      .from('fabricante')
      .update(data)
      .eq('fabricante_id', id)
      .select()
      .single();
    if (error) {
      console.error('Error al actualizar fabricante:', error);
    }
    return { data: updated as Fabricante | null, error };
  }

  async delete(id: number): Promise<{ error: any }> {
    const { error } = await supabase
      .from('fabricante')
      .delete()
      .eq('fabricante_id', id);
    if (error) {
      console.error('Error al eliminar fabricante:', error);
    }
    return { error };
  }
}

export const fabricantesService = new FabricantesService();
