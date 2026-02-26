const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// GET órdenes activas priorizadas para Centro de Operaciones
router.get('/ordenes-activas', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const estado = req.query.estado || '';
        const prioridad = req.query.prioridad || '';
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        // Consulta directa a orden_trabajo con joins (incluyendo modalidad a través del equipo)
        let query = supabase
            .from('orden_trabajo')
            .select(`
                *,
                tecnico:usuario_asignado (tecnico_id, nombre),
                equipo:equipo_id (
                    equipo_id, 
                    modelo, 
                    numero_serie, 
                    fabricante:fabricante_id(nombre),
                    modalidad:modalidad_id(modalidad_id, codigo, prioridad_alta)
                ),
                cliente:cliente_id (cliente_id, nombre)
            `, { count: 'exact' })
            .not('estado', 'ilike', '%cerrad%')
            .not('estado', 'ilike', '%completad%')
            .not('estado', 'ilike', '%cancelad%');

        // Filtros opcionales
        if (estado.trim()) {
            query = query.eq('estado', estado.trim());
        }

        if (prioridad.trim()) {
            query = query.eq('prioridad', prioridad.trim());
        }

        if (search.trim()) {
            // Búsqueda básica por ID
            const searchNum = parseInt(search);
            if (!isNaN(searchNum)) {
                query = query.eq('orden_id', searchNum);
            }
        }

        // Aplicar paginación y ordenar por fecha (más recientes primero)
        query = query
            .range(offset, offset + limit - 1)
            .order('fecha_apertura', { ascending: false });

        const { data, error, count } = await query;

        if (error) throw error;

        // Transformar datos para el frontend
        const ordenesTransformadas = (data || []).map(orden => ({
            id: orden.orden_id,
            prioridad_calculada: calcularPrioridad(orden),
            prioridad_manual: orden.prioridad_manual || orden.prioridad || 'Normal',
            estado: orden.estado,
            equipo: orden.equipo ? `${orden.equipo.modelo || 'Sin modelo'}` : 'Sin equipo',
            numero_serie: orden.equipo?.numero_serie || 'N/A',
            cliente: orden.cliente?.nombre || 'Sin cliente',
            tecnico: orden.tecnico?.nombre || null,
            fecha_vencimiento: orden.fecha_vencimiento,
            modalidad: orden.equipo?.modalidad?.codigo || 'N/A',
            modalidad_prioridad_alta: orden.equipo?.modalidad?.prioridad_alta || false,
            falla_reportada: orden.falla_reportada || '',
            created_at: orden.fecha_apertura
        }));

        // Ordenar por prioridad calculada
        ordenesTransformadas.sort((a, b) => b.prioridad_calculada - a.prioridad_calculada);

        res.json({
            success: true,
            data: ordenesTransformadas,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            },
            error: null
        });
    } catch (error) {
        console.error('Error getting ordenes activas:', error);
        res.status(500).json({ success: false, data: [], error: error.message });
    }
});

// Función para calcular prioridad
function calcularPrioridad(orden) {
    let prioridad = 50; // Base

    // Por prioridad manual
    const prioManual = (orden.prioridad_manual || orden.prioridad || '').toLowerCase();
    switch (prioManual) {
        case 'critica': prioridad += 100; break;
        case 'alta': prioridad += 75; break;
        case 'media':
        case 'normal': prioridad += 50; break;
        case 'baja': prioridad += 25; break;
    }

    // Por fecha de vencimiento (fórmula mejorada con cálculo exacto)
    if (orden.fecha_vencimiento) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
        const vencimiento = new Date(orden.fecha_vencimiento);
        vencimiento.setHours(0, 0, 0, 0);
        const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

        if (diasRestantes < 0) {
            // Vencida - URGENTÍSIMO
            // Mientras más días vencida, MÁS prioridad
            prioridad += 150 + Math.abs(diasRestantes) * 10;
        } else if (diasRestantes === 0) {
            // Vence HOY - CRÍTICO
            prioridad += 120;
        } else if (diasRestantes === 1) {
            // Vence MAÑANA - MUY URGENTE
            prioridad += 100;
        } else if (diasRestantes <= 3) {
            // Vence en 2-3 días - URGENTE
            // Inversamente proporcional: menos días = más prioridad
            prioridad += 80 - (diasRestantes - 1) * 10;
        } else if (diasRestantes <= 7) {
            // Vence en 4-7 días - IMPORTANTE
            prioridad += 50 - (diasRestantes - 3) * 5;
        } else if (diasRestantes <= 14) {
            // Vence en 8-14 días - ATENCIÓN
            prioridad += 20 - (diasRestantes - 7) * 2;
        }
        // Si vence en más de 14 días, no suma puntos extra
    }

    // Por modalidad de alta prioridad (a través del equipo)
    if (orden.equipo?.modalidad?.prioridad_alta) {
        prioridad += 50;
    }

    // Por estado
    if (orden.estado === 'Abierta') prioridad += 20;
    else if (orden.estado === 'En Proceso') prioridad += 10;

    return prioridad;
}

// GET estadísticas del centro de operaciones
router.get('/estadisticas', async (req, res) => {
    try {
        // Contar órdenes por estado
        const { data: ordenes, error } = await supabase
            .from('orden_trabajo')
            .select('estado')
            .not('estado', 'in', '(Completada,Cancelada,Cerrada)');

        if (error) throw error;

        // Agrupar por estado
        const estadisticas = ordenes.reduce((acc, orden) => {
            acc[orden.estado] = (acc[orden.estado] || 0) + 1;
            return acc;
        }, {});

        // Contar alertas no leídas
        const { count: alertasCount } = await supabase
            .from('alertas')
            .select('*', { count: 'exact', head: true })
            .eq('leida', false);

        res.json({
            data: {
                ordenes_por_estado: estadisticas,
                total_ordenes_activas: ordenes.length,
                alertas_no_leidas: alertasCount || 0
            },
            error: null
        });
    } catch (error) {
        console.error('Error getting estadísticas:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

module.exports = router;
