-- Migración: Agregar campos de fechas de calibración a la tabla equipo
-- Fecha: 2025-10-13
-- Descripción: Agrega los campos ultima_calibracion y proxima_calibracion a la tabla equipo

-- Agregar columna ultima_calibracion
ALTER TABLE equipo 
ADD COLUMN IF NOT EXISTS ultima_calibracion DATE;

-- Agregar columna proxima_calibracion
ALTER TABLE equipo 
ADD COLUMN IF NOT EXISTS proxima_calibracion DATE;

-- Comentarios para documentación
COMMENT ON COLUMN equipo.ultima_calibracion IS 'Fecha de la última calibración realizada al equipo';
COMMENT ON COLUMN equipo.proxima_calibracion IS 'Fecha programada para la próxima calibración del equipo';
