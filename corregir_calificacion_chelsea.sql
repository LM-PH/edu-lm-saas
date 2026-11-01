-- ==============================================================================
-- CORRECCIÓN DE CALIFICACIÓN Y COMUNICADO: ALQUICIRA FONSECA CHELSEA
-- Materia: Inglés (Trimestre 2)
-- Calificación real: 3.3 (reprobatoria)
-- Normativa SEP:
--   - En sistema y perfil de estudiante / avisos: Calificación real (3.3)
--   - En boleta oficial SEP (PDF/impresión): Calificación mínima oficial (5)
-- ==============================================================================

DO $$
DECLARE
    v_alumno_id uuid;
    v_rows_calif int := 0;
    v_rows_com int := 0;
BEGIN
    -- 1. Localizar ID de la alumna Chelsea Alquicira
    SELECT id INTO v_alumno_id
    FROM public.alumnos
    WHERE (nombre ILIKE '%ALQUICIRA%' AND nombre ILIKE '%CHELSEA%')
       OR (nombre ILIKE '%CHELSEA%' AND nombre ILIKE '%FONSECA%')
    LIMIT 1;

    IF v_alumno_id IS NULL THEN
        RAISE NOTICE 'No se encontró a la alumna ALQUICIRA FONSECA CHELSEA por nombre exacto. Intentando búsqueda general...';
        SELECT id INTO v_alumno_id
        FROM public.alumnos
        WHERE nombre ILIKE '%ALQUICIRA%'
        LIMIT 1;
    END IF;

    IF v_alumno_id IS NOT NULL THEN
        RAISE NOTICE 'Alumna localizada con ID: %', v_alumno_id;

        -- 2. Actualizar calificación en la tabla de calificaciones a la nota real (3.3)
        UPDATE public.calificaciones
        SET calificacion = 3.3
        WHERE alumno_id = v_alumno_id
          AND trimestre = 2
          AND (
              materia_nombre ILIKE '%ingl%' 
              OR materia_id IN (SELECT id FROM public.materias WHERE nombre ILIKE '%ingl%')
          );
        GET DIAGNOSTICS v_rows_calif = ROW_COUNT;
        RAISE NOTICE 'Calificaciones actualizadas a 3.3: %', v_rows_calif;

        -- 3. Actualizar comunicados automáticos de boleta digital
        UPDATE public.comunicados
        SET mensaje = REPLACE(mensaje, '• Inglés: 5', '• Inglés: 3.3')
        WHERE (
            audiencia = 'Alumno_' || v_alumno_id
            OR receptor_id IN (SELECT perfil_id FROM public.alumnos WHERE id = v_alumno_id)
        )
        AND mensaje ILIKE '%• Inglés: 5%';
        GET DIAGNOSTICS v_rows_com = ROW_COUNT;
        RAISE NOTICE 'Comunicados actualizados con calificación real 3.3: %', v_rows_com;

    ELSE
        RAISE WARNING 'No se encontró registro para ALQUICIRA FONSECA CHELSEA en public.alumnos.';
    END IF;
END $$;
