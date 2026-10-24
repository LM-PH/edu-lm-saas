-- ==============================================================================
-- CORRECCIÓN DEFINITIVA DE REPORTE Y CITATORIO
-- Alumna: MORENO DOMINGUEZ LUZ ELENA (Matrícula: AL-19460, Grupo: 3°D)
-- Docente: Profra. Aidé Pineda Ambriz
-- Reporte: "Salirse de clase sin pedir permiso"
-- Objetivo:
--   1. Cambiar reporte a "Moderado"
--   2. Eliminar citatorios automáticos asociados
--   3. Eliminar notificaciones de citatorio
--   4. Crear notificación oficial de reporte moderado con el texto original
-- ==============================================================================

-- PASO 1: Cambiar la gravedad del reporte a "Moderado"
UPDATE public.reportes_conducta
SET gravedad = 'Moderado'
WHERE alumno_id IN (
    SELECT id FROM public.alumnos 
    WHERE matricula = 'AL-19460' 
       OR nombre ILIKE '%MORENO DOMINGUEZ%'
       OR nombre ILIKE '%Luz Elena%'
)
AND (descripcion ILIKE '%Salirse de clase%' OR gravedad = 'Grave');

-- PASO 2: Eliminar cualquier reporte automático de escalamiento que se haya generado para la alumna
DELETE FROM public.reportes_conducta
WHERE alumno_id IN (
    SELECT id FROM public.alumnos 
    WHERE matricula = 'AL-19460' 
       OR nombre ILIKE '%MORENO DOMINGUEZ%'
       OR nombre ILIKE '%Luz Elena%'
)
AND descripcion ILIKE '%[AUTOMÁTICO] Escalamiento%';

-- PASO 3: Eliminar los citatorios asociados a la alumna
DELETE FROM public.citatorios
WHERE alumno_id IN (
    SELECT id FROM public.alumnos 
    WHERE matricula = 'AL-19460' 
       OR nombre ILIKE '%MORENO DOMINGUEZ%'
       OR nombre ILIKE '%Luz Elena%'
);

-- PASO 4: Eliminar las notificaciones de citatorio de la alumna en comunicados
DELETE FROM public.comunicados
WHERE audiencia IN (
    SELECT 'Alumno_' || id FROM public.alumnos 
    WHERE matricula = 'AL-19460' 
       OR nombre ILIKE '%MORENO DOMINGUEZ%'
       OR nombre ILIKE '%Luz Elena%'
)
AND (
    titulo ILIKE '%CITATORIO%' 
    OR mensaje ILIKE '%citatorio%'
    OR mensaje ILIKE '%Salirse de clase%'
);

-- PASO 5: Generar el comunicado oficial de reporte Moderado con el texto original
INSERT INTO public.comunicados (
    autor_id,
    titulo,
    audiencia,
    mensaje,
    plantel_id
)
SELECT 
    r.autor_id,
    'Aviso de Incidencia: Convivencia',
    'Alumno_' || a.id,
    'Se ha registrado un reporte de tipo Convivencia (Moderado) para seguimiento escolar.' || E'\n\n' ||
    'Descripción: ' || regexp_replace(r.descripcion, '^\[.*?\]\s*', '') || E'\n\n' ||
    '[REF_REPORTE: ' || r.id || ']',
    a.plantel_id
FROM public.reportes_conducta r
JOIN public.alumnos a ON a.id = r.alumno_id
WHERE (a.matricula = 'AL-19460' OR a.nombre ILIKE '%MORENO DOMINGUEZ%')
  AND r.descripcion ILIKE '%Salirse de clase%'
LIMIT 1;

-- ==============================================================================
-- CONSULTAS DE VERIFICACIÓN (Deben ejecutarse para confirmar el resultado)
-- ==============================================================================

-- 1. Comprobar que el reporte quedó como "Moderado"
SELECT 
    r.id AS reporte_id,
    a.nombre AS alumna,
    a.matricula,
    r.gravedad,
    r.descripcion
FROM public.reportes_conducta r
JOIN public.alumnos a ON a.id = r.alumno_id
WHERE a.matricula = 'AL-19460' OR a.nombre ILIKE '%MORENO DOMINGUEZ%';

-- 2. Comprobar que ya NO hay citatorios para la alumna (debe devolver 0 filas)
SELECT 
    c.id AS citatorio_id,
    c.alumno_id,
    c.motivo,
    c.estado
FROM public.citatorios c
JOIN public.alumnos a ON a.id = c.alumno_id
WHERE a.matricula = 'AL-19460' OR a.nombre ILIKE '%MORENO DOMINGUEZ%';

-- 3. Comprobar el comunicado moderado generado
SELECT 
    id,
    audiencia,
    titulo,
    mensaje,
    fecha_envio
FROM public.comunicados
WHERE audiencia IN (
    SELECT 'Alumno_' || id FROM public.alumnos WHERE matricula = 'AL-19460' OR nombre ILIKE '%MORENO DOMINGUEZ%'
)
ORDER BY fecha_envio DESC
LIMIT 2;
