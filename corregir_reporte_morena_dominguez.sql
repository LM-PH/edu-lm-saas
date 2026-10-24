-- ==============================================================================
-- CORRECCIÓN DE REPORTE DISCIPLINARIO
-- Alumna: Morena Dominguez Luz Elena (3°D) / Moreno Domínguez Luz Elena
-- Emisor: Mtra. Aidé Pineda
-- Cambio: Quitar reporte Grave -> Establecer reporte Moderado
--         Eliminar citatorio automático y su notificación
--         Generar/mantener el reporte moderado con el mismo texto original
-- ==============================================================================

DO $$
DECLARE
    v_reporte_id uuid;
    v_descripcion text;
    v_descripcion_limpia text;
    v_gravedad_actual text;
    v_categoria text := 'Académico';
    v_alumno_id uuid;
    v_alumno_nombre text;
    v_plantel_id uuid;
    v_grupo_nombre text;
    v_autor_id uuid;
    v_autor_nombre text;
    v_citatorio_id uuid;
    v_rows_rep int := 0;
    v_rows_cit int := 0;
    v_rows_com_del int := 0;
    v_rows_com_ins int := 0;
BEGIN
    -- ESTRATEGIA 1: Localizar el reporte combinando a la Mtra. Pineda y a la Alumna (Morena/Moreno/Luz Elena)
    SELECT 
        r.id, r.descripcion, r.gravedad, r.autor_id,
        a.id, a.nombre, a.plantel_id, g.nombre,
        p.nombre
    INTO 
        v_reporte_id, v_descripcion, v_gravedad_actual, v_autor_id,
        v_alumno_id, v_alumno_nombre, v_plantel_id, v_grupo_nombre,
        v_autor_nombre
    FROM public.reportes_conducta r
    JOIN public.alumnos a ON a.id = r.alumno_id
    LEFT JOIN public.grupos g ON g.id = a.grupo_id
    LEFT JOIN public.perfiles p ON p.id = r.autor_id
    WHERE (
        (p.nombre ILIKE '%Pineda%' OR p.nombre ILIKE '%Aide%' OR p.nombre ILIKE '%Aidé%')
        AND (
            a.nombre ILIKE '%Luz%' 
            OR a.nombre ILIKE '%Elena%' 
            OR a.nombre ILIKE '%Moren%' 
            OR a.nombre ILIKE '%Dominguez%' 
            OR a.nombre ILIKE '%Domínguez%'
        )
    )
    ORDER BY r.id DESC
    LIMIT 1;

    -- ESTRATEGIA 2: Si no coincidió la maestra, buscar por la alumna con coincidencia flexible (Moreno / Morena / Luz Elena)
    IF v_reporte_id IS NULL THEN
        SELECT 
            r.id, r.descripcion, r.gravedad, r.autor_id,
            a.id, a.nombre, a.plantel_id, g.nombre,
            p.nombre
        INTO 
            v_reporte_id, v_descripcion, v_gravedad_actual, v_autor_id,
            v_alumno_id, v_alumno_nombre, v_plantel_id, v_grupo_nombre,
            v_autor_nombre
        FROM public.reportes_conducta r
        JOIN public.alumnos a ON a.id = r.alumno_id
        LEFT JOIN public.grupos g ON g.id = a.grupo_id
        LEFT JOIN public.perfiles p ON p.id = r.autor_id
        WHERE (
            (a.nombre ILIKE '%Luz%Elena%')
            OR (a.nombre ILIKE '%Moren%' AND (a.nombre ILIKE '%Dominguez%' OR a.nombre ILIKE '%Domínguez%'))
            OR (a.nombre ILIKE '%Dominguez%' AND a.nombre ILIKE '%Elena%')
            OR (a.nombre ILIKE '%Moren%' AND a.nombre ILIKE '%Elena%')
        )
        ORDER BY r.id DESC
        LIMIT 1;
    END IF;

    -- ESTRATEGIA 3: Buscar directamente por la alumna en la tabla alumnos si aún no tiene reporte asignado con esos criterios
    IF v_alumno_id IS NULL THEN
        SELECT a.id, a.nombre, a.plantel_id, g.nombre INTO v_alumno_id, v_alumno_nombre, v_plantel_id, v_grupo_nombre
        FROM public.alumnos a
        LEFT JOIN public.grupos g ON g.id = a.grupo_id
        WHERE a.nombre ILIKE '%Luz%Elena%'
           OR (a.nombre ILIKE '%Moren%' AND (a.nombre ILIKE '%Dominguez%' OR a.nombre ILIKE '%Domínguez%'))
        ORDER BY CASE WHEN g.nombre ILIKE '%3%D%' THEN 0 ELSE 1 END
        LIMIT 1;
        
        IF v_alumno_id IS NOT NULL THEN
            SELECT id, descripcion, gravedad, autor_id INTO v_reporte_id, v_descripcion, v_gravedad_actual, v_autor_id
            FROM public.reportes_conducta
            WHERE alumno_id = v_alumno_id
            ORDER BY id DESC
            LIMIT 1;
        END IF;
    END IF;

    -- ESTRATEGIA 4: Buscar el último reporte emitido por la Mtra. Aidé Pineda
    IF v_reporte_id IS NULL THEN
        SELECT 
            r.id, r.descripcion, r.gravedad, r.autor_id,
            a.id, a.nombre, a.plantel_id, g.nombre,
            p.nombre
        INTO 
            v_reporte_id, v_descripcion, v_gravedad_actual, v_autor_id,
            v_alumno_id, v_alumno_nombre, v_plantel_id, v_grupo_nombre,
            v_autor_nombre
        FROM public.reportes_conducta r
        JOIN public.alumnos a ON a.id = r.alumno_id
        LEFT JOIN public.grupos g ON g.id = a.grupo_id
        LEFT JOIN public.perfiles p ON p.id = r.autor_id
        WHERE p.nombre ILIKE '%Pineda%' OR p.nombre ILIKE '%Aide%' OR p.nombre ILIKE '%Aidé%'
        ORDER BY r.id DESC
        LIMIT 1;
    END IF;

    -- Validación final de localización
    IF v_reporte_id IS NULL THEN
        RAISE EXCEPTION '❌ No se pudo localizar el reporte ni a la alumna. Por favor ejecuta la Consulta de Diagnóstico que se encuentra al final de este script.';
    END IF;

    RAISE NOTICE '---------------------------------------------------------';
    RAISE NOTICE '✅ REGISTRO ENCONTRADO CON ÉXITO:';
    RAISE NOTICE '   - Alumna: % (ID: %, Grupo: %)', v_alumno_nombre, v_alumno_id, COALESCE(v_grupo_nombre, 'S/G');
    RAISE NOTICE '   - Docente: % (ID: %)', COALESCE(v_autor_nombre, 'Docente'), v_autor_id;
    RAISE NOTICE '   - Reporte ID: % (Gravedad previa: %)', v_reporte_id, v_gravedad_actual;
    RAISE NOTICE '   - Texto del reporte: "%"', v_descripcion;
    RAISE NOTICE '---------------------------------------------------------';

    -- Extraer categoría si viene en formato [CATEGORÍA]
    IF v_descripcion ~ '^\[(.*?)\]' THEN
        v_categoria := (regexp_match(v_descripcion, '^\[(.*?)\]'))[1];
        v_descripcion_limpia := regexp_replace(v_descripcion, '^\[.*?\]\s*', '');
    ELSE
        v_descripcion_limpia := v_descripcion;
    END IF;

    -- 1. Modificar el reporte: Cambiar gravedad a 'Moderado' conservando el texto exacto
    UPDATE public.reportes_conducta
    SET gravedad = 'Moderado'
    WHERE id = v_reporte_id;
    GET DIAGNOSTICS v_rows_rep = ROW_COUNT;
    RAISE NOTICE '✅ 1. Reporte de conducta actualizado a gravedad "Moderado" (% fila(s)).', v_rows_rep;

    -- 2. Localizar y eliminar el citatorio automático asociado
    DELETE FROM public.citatorios
    WHERE alumno_id = v_alumno_id
      AND (
          motivo LIKE '%' || v_reporte_id::text || '%'
          OR (v_autor_id IS NOT NULL AND emisor_id = v_autor_id)
          OR motivo ILIKE '%Protocolo:%'
          OR motivo ILIKE '%Acumulación de reportes%'
          OR motivo ILIKE '%Grave%'
      );
    GET DIAGNOSTICS v_rows_cit = ROW_COUNT;

    IF v_rows_cit = 0 THEN
        -- Si no coincidieron las palabras anteriores, eliminar el último citatorio de la alumna si existe
        DELETE FROM public.citatorios
        WHERE id IN (
            SELECT id FROM public.citatorios 
            WHERE alumno_id = v_alumno_id 
            ORDER BY id DESC 
            LIMIT 1
        );
        GET DIAGNOSTICS v_rows_cit = ROW_COUNT;
    END IF;

    IF v_rows_cit > 0 THEN
        RAISE NOTICE '🗑️ 2. Citatorio automático eliminado de la tabla citatorios (% fila(s)).', v_rows_cit;
    ELSE
        RAISE NOTICE 'ℹ️ 2. No se requirió eliminar citatorios (no había citatorio pendiente).';
    END IF;

    -- 3. Eliminar la notificación del citatorio en comunicados
    DELETE FROM public.comunicados
    WHERE audiencia = 'Alumno_' || v_alumno_id
      AND (
          mensaje LIKE '%' || v_reporte_id::text || '%'
          OR titulo ILIKE '%CITATORIO%'
          OR mensaje ILIKE '%citatorio%'
      );
    GET DIAGNOSTICS v_rows_com_del = ROW_COUNT;

    IF v_rows_com_del > 0 THEN
        RAISE NOTICE '🗑️ 3. Notificación de citatorio eliminada de comunicados (% fila(s)).', v_rows_com_del;
    ELSE
        RAISE NOTICE 'ℹ️ 3. No se detectó notificación previa de citatorio en comunicados.';
    END IF;

    -- 4. Generar el comunicado oficial de reporte Moderado con el texto original
    INSERT INTO public.comunicados (
        autor_id,
        titulo,
        mensaje,
        audiencia,
        tipo,
        plantel_id
    ) VALUES (
        v_autor_id,
        'Aviso de Incidencia: ' || v_categoria,
        'Se ha registrado un reporte de tipo ' || v_categoria || ' (Moderado) para seguimiento escolar.' || E'\n\n' ||
        'Descripción: ' || v_descripcion_limpia || E'\n\n' ||
        '[REF_REPORTE: ' || v_reporte_id || ']',
        'Alumno_' || v_alumno_id,
        'General',
        v_plantel_id
    );
    GET DIAGNOSTICS v_rows_com_ins = ROW_COUNT;
    RAISE NOTICE '📢 4. Notificación oficial de reporte moderado generada para la alumna y padres (% fila(s)).', v_rows_com_ins;

    RAISE NOTICE '---------------------------------------------------------';
    RAISE NOTICE '🎉 CORRECCIÓN FINALIZADA EXITOSAMENTE PARA: %', v_alumno_nombre;
    RAISE NOTICE '---------------------------------------------------------';
END $$;

-- ==============================================================================
-- CONSULTAS DE VERIFICACIÓN FINAL
-- ==============================================================================

-- 1. Estado actualizado del reporte de conducta
SELECT 
    r.id AS reporte_id,
    a.nombre AS alumna,
    g.nombre AS grupo,
    r.gravedad,
    r.descripcion,
    r.resuelto,
    p.nombre AS emisor
FROM public.reportes_conducta r
JOIN public.alumnos a ON a.id = r.alumno_id
LEFT JOIN public.grupos g ON g.id = a.grupo_id
LEFT JOIN public.perfiles p ON p.id = r.autor_id
WHERE (a.nombre ILIKE '%Luz%Elena%' OR a.nombre ILIKE '%Moren%' OR p.nombre ILIKE '%Pineda%')
ORDER BY r.id DESC
LIMIT 3;

-- 2. Verificar que no queden citatorios activos para la alumna
SELECT 
    c.id AS citatorio_id,
    a.nombre AS alumna,
    c.tipo,
    c.motivo,
    c.estado,
    c.creado_en
FROM public.citatorios c
JOIN public.alumnos a ON a.id = c.alumno_id
WHERE a.nombre ILIKE '%Luz%Elena%' OR a.nombre ILIKE '%Moren%'
ORDER BY c.id DESC;

-- 3. Notificación generada en el portal del alumno
SELECT 
    cm.id AS comunicado_id,
    cm.audiencia,
    cm.titulo,
    cm.mensaje,
    cm.fecha_envio
FROM public.comunicados cm
WHERE cm.audiencia IN (
    SELECT 'Alumno_' || a.id 
    FROM public.alumnos a 
    WHERE a.nombre ILIKE '%Luz%Elena%' OR a.nombre ILIKE '%Moren%'
)
ORDER BY cm.id DESC
LIMIT 3;
