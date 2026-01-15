const { supabase } = require('../config/supabase');

/**
 * Helper para registrar actividades en el sistema
 * @param {Object} params - Parámetros de la actividad
 * @param {string} params.tipo_operacion - CREATE, UPDATE, DELETE, VIEW, LOGIN, LOGOUT, OTHER
 * @param {string} params.entidad - Nombre de la entidad: equipo, cliente, orden_trabajo, etc.
 * @param {number} [params.entidad_id] - ID del registro afectado
 * @param {string} params.titulo - Título descriptivo de la actividad
 * @param {string} [params.descripcion] - Descripción detallada
 * @param {Object} [params.datos_anterior] - Estado de los datos antes del cambio
 * @param {Object} [params.datos_nuevo] - Estado de los datos después del cambio
 * @param {string} [params.usuario] - Usuario que realizó la acción
 * @param {string} [params.ip_address] - IP del cliente
 */
async function logActivity({
    tipo_operacion,
    entidad,
    entidad_id,
    titulo,
    descripcion,
    datos_anterior,
    datos_nuevo,
    usuario = 'Sistema',
    ip_address
}) {
    try {
        const { error } = await supabase
            .from('actividad')
            .insert([{
                tipo_operacion,
                entidad,
                entidad_id: entidad_id || null,
                titulo,
                descripcion: descripcion || null,
                datos_anterior: datos_anterior || null,
                datos_nuevo: datos_nuevo || null,
                usuario,
                ip_address: ip_address || null
            }]);

        if (error) {
            console.error('Error logging activity:', error);
        }
    } catch (error) {
        // Don't let activity logging break the main operation
        console.error('Error in logActivity:', error);
    }
}

/**
 * Genera un título descriptivo basado en la operación y entidad
 */
function generateTitle(operacion, entidad, nombre) {
    const operaciones = {
        CREATE: 'Nuevo',
        UPDATE: 'Actualización de',
        DELETE: 'Eliminación de'
    };

    const entidades = {
        equipo: 'equipo',
        cliente: 'cliente',
        orden_trabajo: 'orden de trabajo',
        tecnico: 'técnico',
        fabricante: 'fabricante',
        modalidad: 'modalidad'
    };

    const op = operaciones[operacion] || operacion;
    const ent = entidades[entidad] || entidad;

    if (nombre) {
        return `${op} ${ent}: ${nombre}`;
    }
    return `${op} ${ent}`;
}

/**
 * Extrae la IP del request
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        null;
}

module.exports = {
    logActivity,
    generateTitle,
    getClientIP
};
