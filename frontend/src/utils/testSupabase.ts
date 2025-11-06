import { supabase } from '../lib/supabaseClient';

export async function testSupabaseConnection() {
  console.log('🧪 Probando conexión con Supabase...');
  
  try {
    // Test 1: Verificar tablas
    console.log('\n📋 Test 1: Verificando tabla equipo...');
    const { data: equipos, error: equipoError } = await supabase
      .from('equipo')
      .select('*')
      .limit(5);
    
    if (equipoError) {
      console.error('❌ Error en tabla equipo:', equipoError);
      console.error('Detalles del error:', JSON.stringify(equipoError, null, 2));
    } else {
      console.log('✅ Tabla equipo encontrada. Registros:', equipos?.length || 0);
      if (equipos && equipos.length > 0) {
        console.log('📝 Ejemplo de registro:', equipos[0]);
        console.log('📝 Columnas de equipo:', Object.keys(equipos[0]));
      }
    }
    
    // Test 2: Verificar tabla orden_trabajo
    console.log('\n📋 Test 2: Verificando tabla orden_trabajo...');
    const { data: ordenes, error: ordenError } = await supabase
      .from('orden_trabajo')
      .select('*')
      .limit(5);
    
    if (ordenError) {
      console.error('❌ Error en tabla orden_trabajo:', ordenError);
      console.error('Detalles del error:', JSON.stringify(ordenError, null, 2));
    } else {
      console.log('✅ Tabla orden_trabajo encontrada. Registros:', ordenes?.length || 0);
      if (ordenes && ordenes.length > 0) {
        console.log('📝 Ejemplo de registro:', ordenes[0]);
        console.log('📝 Columnas disponibles:', Object.keys(ordenes[0]));
      }
    }
    
    // Test 3: Listar todas las tablas disponibles
    console.log('\n📋 Test 3: Intentando detectar tablas...');
    const tables = ['equipo', 'orden_trabajo', 'cliente', 'fabricante', 'modalidad', 'tecnico'];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Tabla "${table}": No existe o error - ${error.message}`);
      } else {
        console.log(`✅ Tabla "${table}": ${count} registros`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('💥 Error general:', error);
    return false;
  }
}
