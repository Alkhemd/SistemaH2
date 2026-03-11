require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Faltan variables de entorno de Supabase');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getNextId(table, idColumn) {
    const { data, error } = await supabase
        .from(table)
        .select(idColumn)
        .order(idColumn, { ascending: false })
        .limit(1);

    if (error) return null;
    if (!data || data.length === 0) return 1;
    return data[0][idColumn] + 1;
}

async function getValidFK(table, idColumn) {
    const { data, error } = await supabase
        .from(table)
        .select(idColumn)
        .limit(1);

    if (error || !data || data.length === 0) return null;
    return data[0][idColumn];
}

async function generarDatos() {
    console.log('🚀 Iniciando generación de datos sintéticos (Versión Robusta)...');

    try {
        // 0. Obtener claves externas válidas
        const idFabricante = await getValidFK('fabricante', 'fabricante_id');
        const idModalidad = await getValidFK('modalidad', 'modalidad_id');

        if (!idFabricante || !idModalidad) {
            console.error('❌ No se encontraron fabricantes o modalidades en la base de datos para referenciar.');
            return;
        }

        // 1. Crear Clientes
        console.log('--- Creando clientes...');

        const nuevosClientes = [
            { nombre: 'Hospital Regional de Occidente', tipo: 'Público', ciudad: 'Guadalajara', estado: 'Jalisco', contacto: 'Dr. Alejandro Sans', email: `contacto.${Date.now()}@hro.mx`, activo: true },
            { nombre: 'Clínica Santa María', tipo: 'Privado', ciudad: 'Monterrey', estado: 'Nuevo León', contacto: 'Lic. Martha Ruiz', email: `mruiz.${Date.now()}@santamaria.com`, activo: true }
        ];

        const { data: clientesInsertados, error: errClientes } = await supabase
            .from('cliente')
            .insert(nuevosClientes)
            .select();

        if (errClientes) throw errClientes;
        console.log(`✅ ${clientesInsertados.length} clientes creados.`);

        // 2. Crear Técnicos
        console.log('--- Creando técnicos...');

        const nuevosTecnicos = [
            { nombre: 'Ing. Carlos Mendoza', especialidad: 'Imagenología', activo: true, base_ciudad: 'Guadalajara', email: `c.mendoza.${Date.now()}@sistemah.mx` }
        ];

        const { data: tecnicosInsertados, error: errTecnicos } = await supabase
            .from('tecnico')
            .insert(nuevosTecnicos)
            .select();

        if (errTecnicos) throw errTecnicos;
        console.log(`✅ ${tecnicosInsertados.length} técnicos creados.`);

        // 3. Crear Equipos
        console.log('--- Creando equipos...');

        const nuevosEquipos = [
            {
                cliente_id: clientesInsertados[0].cliente_id,
                modalidad_id: idModalidad,
                fabricante_id: idFabricante,
                modelo: 'GE Revolution X',
                numero_serie: `SN-GE-${Date.now()}-1`,
                estado_equipo: 'Operativo',
                ubicacion: 'Sala A1',
                fecha_instalacion: '2023-01-15'
            }
        ];

        const { data: equiposInsertados, error: errEquipos } = await supabase
            .from('equipo')
            .insert(nuevosEquipos)
            .select();

        if (errEquipos) throw errEquipos;
        console.log(`✅ ${equiposInsertados.length} equipos creados.`);

        // 4. Crear Órdenes de Trabajo
        console.log('--- Creando órdenes de trabajo...');

        const nuevasOrdenes = [
            {
                cliente_id: clientesInsertados[0].cliente_id,
                equipo_id: equiposInsertados[0].equipo_id,
                falla_reportada: 'Prueba de datos sintéticos - Funcionamiento OK',
                prioridad: 'Alta',
                estado: 'Abierta',
                origen: 'Portal',
                fecha_apertura: new Date().toISOString()
            }
        ];

        const { data: ordenesInsertadas, error: errOrdenes } = await supabase
            .from('orden_trabajo')
            .insert(nuevasOrdenes)
            .select();

        if (errOrdenes) throw errOrdenes;
        console.log(`✅ ${ordenesInsertadas.length} órdenes creadas.`);

        console.log('\n✨ ¡Proceso completado con éxito!');

    } catch (error) {
        console.error('❌ Error durante la generación de datos:', error.message);
    }
}

generarDatos();
