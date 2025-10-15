import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase para el frontend (Next.js)
// Las credenciales se cargan desde variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Verifica tu archivo .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
