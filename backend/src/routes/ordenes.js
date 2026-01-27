const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { logActivity, generateTitle, getClientIP } = require('../utils/activityLogger');

// GET all ordenes with pagination, search and filters
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const prioridad = req.query.prioridad || '';
        const estado = req.query.estado || '';
        const clienteId = req.query.cliente_id || '';
        const offset = (page - 1) * limit;

        let query = supabase
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
            `, { count: 'exact' });

        // Apply cliente_id filter (exact match)
        if (clienteId.trim()) {
            query = query.eq('cliente_id', parseInt(clienteId));
        }

        // Apply prioridad filter (case-insensitive exact match)
        if (prioridad.trim()) {
            query = query.ilike('prioridad', prioridad.trim());
        }

        // Apply estado filter (case-insensitive exact match)
        if (estado.trim()) {
            query = query.ilike('estado', estado.trim());
        }

        // If search term exists, search without pagination (return all matches)
        if (search.trim()) {
            query = query.or(`falla_reportada.ilike.%${search}%`);

            const { data, error, count } = await query.order('orden_id', { ascending: false });

            if (error) throw error;

            return res.json({
                data,
                pagination: {
                    page: 1,
                    limit: count || 0,
                    total: count || 0,
                    totalPages: 1,
                    isSearch: true
                },
                error: null
            });
        }

        // No search - apply pagination
        query = query
            .range(offset, offset + limit - 1)
            .order('orden_id', { ascending: false });

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
                isSearch: false
            },
            error: null
        });
    } catch (error) {
        console.error('Error getting ordenes:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET orden by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('orden_trabajo')
            .select('*')
            .eq('orden_id', id)
            .single();

        if (error) throw error;
        res.json({ data, error: null });
    } catch (error) {
        console.error('Error getting orden:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// POST create orden
router.post('/', async (req, res) => {
    try {
        console.log('==========================================');
        console.log('[POST /ordenes] Body recibido:', JSON.stringify(req.body, null, 2));
        console.log('==========================================');

        const { data: maxIdResult } = await supabase
            .from('orden_trabajo')
            .select('orden_id')
            .order('orden_id', { ascending: false })
            .limit(1)
            .single();

        const nextId = maxIdResult ? maxIdResult.orden_id + 1 : 1;

        const dataWithDefaults = {
            ...req.body,
            orden_id: nextId,
            fecha_apertura: req.body.fecha_apertura || new Date().toISOString(),
            estado: req.body.estado || 'Abierta',
            prioridad: req.body.prioridad || 'Normal',
            prioridad_manual: req.body.prioridad_manual || 'media',
            fecha_vencimiento: req.body.fecha_vencimiento || null,
            origen: req.body.origen || 'Portal'
        };

        console.log('[POST /ordenes] Datos a insertar:', JSON.stringify(dataWithDefaults, null, 2));

        const { data, error } = await supabase
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

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'CREATE',
            entidad: 'orden_trabajo',
            entidad_id: data?.orden_id,
            titulo: generateTitle('CREATE', 'orden_trabajo', `#${data?.orden_id}`),
            descripcion: data?.falla_reportada || `Nueva orden de trabajo creada`,
            datos_nuevo: data,
            ip_address: getClientIP(req)
        });

        res.json({ data, error: null });
    } catch (error) {
        console.error('Error creating orden:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// PUT update orden
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('orden_trabajo')
            .update(req.body)
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

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'UPDATE',
            entidad: 'orden_trabajo',
            entidad_id: parseInt(id),
            titulo: generateTitle('UPDATE', 'orden_trabajo', `#${id}`),
            descripcion: `Estado: ${data?.estado} - Prioridad: ${data?.prioridad}`,
            datos_nuevo: data,
            ip_address: getClientIP(req)
        });

        res.json({ data, error: null });
    } catch (error) {
        console.error('Error updating orden:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// DELETE orden (with cascade)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get intervenciones
        const { data: intervenciones } = await supabase
            .from('intervencion')
            .select('intervencion_id')
            .eq('orden_id', id);

        if (intervenciones && intervenciones.length > 0) {
            const intervencionIds = intervenciones.map(i => i.intervencion_id);
            await supabase.from('partes_usadas').delete().in('intervencion_id', intervencionIds);
        }

        await supabase.from('intervencion').delete().eq('orden_id', id);
        await supabase.from('evento_orden').delete().eq('orden_id', id);

        const { error } = await supabase.from('orden_trabajo').delete().eq('orden_id', id);

        if (error) throw error;

        // Log activity
        await logActivity({
            tipo_operacion: 'DELETE',
            entidad: 'orden_trabajo',
            entidad_id: parseInt(id),
            titulo: generateTitle('DELETE', 'orden_trabajo', `#${id}`),
            descripcion: `Se eliminó la orden de trabajo #${id}`,
            ip_address: getClientIP(req)
        });

        res.json({ error: null });
    } catch (error) {
        console.error('Error deleting orden:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST cambiar estado con justificación
router.post('/:id/cambiar-estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_nuevo, justificacion } = req.body;

        // Validar que se proporcione justificación
        if (!justificacion || justificacion.trim() === '') {
            return res.status(400).json({
                data: null,
                error: 'La justificación es obligatoria para cambiar el estado'
            });
        }

        // Obtener estado actual
        const { data: ordenActual, error: errorOrden } = await supabase
            .from('orden_trabajo')
            .select('estado')
            .eq('orden_id', id)
            .single();

        if (errorOrden) throw errorOrden;

        const estado_anterior = ordenActual.estado;


        // Preparar datos de actualización
        const updateData = { estado: estado_nuevo };

        // Si el estado nuevo es cerrado/completado/cancelado, establecer fecha_cierre
        const estadosCerrados = ['cerrada', 'completada', 'cancelada'];
        if (estadosCerrados.includes(estado_nuevo.toLowerCase())) {
            updateData.fecha_cierre = new Date().toISOString();
        }

        // Actualizar estado de la orden
        const { data: ordenActualizada, error: errorUpdate } = await supabase
            .from('orden_trabajo')
            .update(updateData)
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

        if (errorUpdate) throw errorUpdate;

        // Registrar en historial
        const { error: errorHistorial } = await supabase
            .from('orden_historial')
            .insert([{
                orden_id: parseInt(id),
                estado_anterior,
                estado_nuevo,
                justificacion: justificacion.trim(),
                usuario: 'Admin'
            }]);

        if (errorHistorial) throw errorHistorial;

        // Log activity
        await logActivity({
            tipo_operacion: 'UPDATE',
            entidad: 'orden_trabajo',
            entidad_id: parseInt(id),
            titulo: generateTitle('UPDATE', 'orden_trabajo', `#${id} - Cambio de Estado`),
            descripcion: `Estado cambiado de "${estado_anterior}" a "${estado_nuevo}". Justificación: ${justificacion.substring(0, 100)}`,
            datos_nuevo: ordenActualizada,
            ip_address: getClientIP(req)
        });

        res.json({ data: ordenActualizada, error: null });
    } catch (error) {
        console.error('Error cambiando estado de orden:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// GET historial de una orden
router.get('/:id/historial', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('orden_historial')
            .select('*')
            .eq('orden_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ data, error: null });
    } catch (error) {
        console.error('Error getting orden historial:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

// POST posponer fecha de vencimiento (requiere justificación)
router.post('/:id/posponer-vencimiento', async (req, res) => {
    try {
        const { id } = req.params;
        const { nueva_fecha, justificacion } = req.body;

        // Validar campos obligatorios
        if (!nueva_fecha) {
            return res.status(400).json({
                data: null,
                error: 'La nueva fecha de vencimiento es obligatoria'
            });
        }

        if (!justificacion || justificacion.trim() === '') {
            return res.status(400).json({
                data: null,
                error: 'La justificación es obligatoria para posponer la fecha de vencimiento'
            });
        }

        // Obtener fecha actual de vencimiento
        const { data: ordenActual, error: errorOrden } = await supabase
            .from('orden_trabajo')
            .select('fecha_vencimiento, estado')
            .eq('orden_id', id)
            .single();

        if (errorOrden) throw errorOrden;

        // No permitir posponer si la orden está cerrada
        const estadosCerrados = ['cerrada', 'completada', 'cancelada'];
        if (estadosCerrados.includes((ordenActual.estado || '').toLowerCase())) {
            return res.status(400).json({
                data: null,
                error: 'No se puede posponer la fecha de una orden cerrada o completada'
            });
        }

        const fecha_anterior = ordenActual.fecha_vencimiento;

        // Validar que la nueva fecha sea posterior a hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const nuevaFecha = new Date(nueva_fecha);
        if (nuevaFecha < hoy) {
            return res.status(400).json({
                data: null,
                error: 'La nueva fecha debe ser igual o posterior a hoy'
            });
        }

        // Actualizar fecha de vencimiento
        const { data: ordenActualizada, error: errorUpdate } = await supabase
            .from('orden_trabajo')
            .update({ fecha_vencimiento: nueva_fecha })
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

        if (errorUpdate) throw errorUpdate;

        // Registrar en historial (evento de postergación)
        const { error: errorHistorial } = await supabase
            .from('orden_historial')
            .insert([{
                orden_id: parseInt(id),
                estado_anterior: `Vencimiento: ${fecha_anterior || 'Sin fecha'}`,
                estado_nuevo: `Vencimiento: ${nueva_fecha}`,
                justificacion: `[POSTERGACIÓN] ${justificacion.trim()}`,
                usuario: 'Admin'
            }]);

        if (errorHistorial) {
            console.error('Error registrando en historial:', errorHistorial);
            // No fallar la operación por esto
        }

        // Log activity
        await logActivity({
            tipo_operacion: 'UPDATE',
            entidad: 'orden_trabajo',
            entidad_id: parseInt(id),
            titulo: generateTitle('UPDATE', 'orden_trabajo', `#${id} - Postergación de Vencimiento`),
            descripcion: `Fecha de vencimiento cambiada de "${fecha_anterior || 'Sin fecha'}" a "${nueva_fecha}". Motivo: ${justificacion.substring(0, 100)}`,
            datos_nuevo: ordenActualizada,
            ip_address: getClientIP(req)
        });

        res.json({ data: ordenActualizada, error: null });
    } catch (error) {
        console.error('Error posponiendo vencimiento de orden:', error);
        res.status(500).json({ data: null, error: error.message });
    }
});

module.exports = router;
