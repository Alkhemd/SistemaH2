
import { supabase } from '../lib/supabaseClient';

export interface Cliente {
  cliente_id: number;
  nombre: string;
  tipo: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
}



class ClientesService {
  async getAll(): Promise<{ data: any[] | null; error: any }> {
    // Primero obtenemos los clientes
    const { data: clientes, error } = await supabase
      .from('cliente')
      .select('*');
    
    if (error) {
      console.error('Error al obtener clientes:', error);
      return { data: null, error };
    }
    
    if (!clientes || clientes.length === 0) {
      return { data: [], error: null };
    }
    
    // Luego obtenemos el conteo de equipos para cada cliente
    const clientesConEquipos = await Promise.all(
      clientes.map(async (cliente) => {
        const { count } = await supabase
          .from('equipo')
          .select('*', { count: 'exact', head: true })
          .eq('cliente_id', cliente.cliente_id);
        
        return {
          ...cliente,
          equipos_count: count || 0
        };
      })
    );
    
    return { data: clientesConEquipos, error: null };
  }

  async create(data: Omit<Cliente, 'cliente_id'>): Promise<{ data: Cliente | null; error: any }> {
    // Obtener el máximo ID actual y sumarle 1
    const { data: maxIdResult } = await supabase
      .from('cliente')
      .select('cliente_id')
      .order('cliente_id', { ascending: false })
      .limit(1)
      .single();
    
    const nextId = maxIdResult ? maxIdResult.cliente_id + 1 : 1;
    
    const dataWithId = {
      ...data,
      cliente_id: nextId
    };
    
    const { data: created, error } = await supabase
      .from('cliente')
      .insert([dataWithId])
      .select()
      .single();
    if (error) {
      console.error('Error al crear cliente:', error);
    }
    return { data: created as Cliente | null, error };
  }

  async update(id: number, data: Partial<Omit<Cliente, 'cliente_id'>>): Promise<{ data: Cliente | null; error: any }> {
    const { data: updated, error } = await supabase
      .from('cliente')
      .update(data)
      .eq('cliente_id', id)
      .select()
      .single();
    if (error) {
      console.error('Error al actualizar cliente:', error);
    }
    return { data: updated as Cliente | null, error };
  }

  async delete(id: number): Promise<{ error: any }> {
    const { error } = await supabase
      .from('cliente')
      .delete()
      .eq('cliente_id', id);
    if (error) {
      console.error('Error al eliminar cliente:', error);
    }
    return { error };
  }
}

export const clientesService = new ClientesService();
