-- =======================================================
-- CORRECCIÓN DEFINITIVA DE RLS Y VINCULACIÓN PARA ACTIVIDADES DE MAESTROS
-- Permite al usuario Master (creador del sistema) y a los docentes
-- ver, gestionar y auditar todas las actividades y evaluaciones.
-- =======================================================

-- 1. Habilitar RLS en actividades_maestro y eliminar políticas restrictivas obsoletas
ALTER TABLE public.actividades_maestro ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura y escritura actividades maestro" ON public.actividades_maestro;
DROP POLICY IF EXISTS "Multi-Tenant Aislamiento Estricto" ON public.actividades_maestro;
DROP POLICY IF EXISTS "Permitir lectura y gestion actividades maestro" ON public.actividades_maestro;
DROP POLICY IF EXISTS "Staff gestiona actividades maestro" ON public.actividades_maestro;

-- 2. Crear política universal para actividades_maestro
-- - El usuario Master (creador) puede ver y auditar TODAS las actividades de cualquier plantel.
-- - El docente creador (maestro_id = auth.uid()) SIEMPRE puede ver y gestionar sus actividades.
-- - Los directivos y personal del plantel ven las actividades de su escuela.
-- - Las actividades sin plantel asignado (NULL) pueden ser leídas por su creador y por el Master.
CREATE POLICY "Permitir lectura y gestion actividades maestro" 
ON public.actividades_maestro 
FOR ALL 
TO authenticated 
USING (
    maestro_id = auth.uid()
    OR plantel_id = (SELECT p.plantel_id FROM public.perfiles p WHERE p.id = auth.uid())
    OR (SELECT p.plantel_id FROM public.perfiles p WHERE p.id = auth.uid()) IS NULL
    OR (SELECT (p.es_master = true OR p.rol = 'master' OR p.rol = 'admin') FROM public.perfiles p WHERE p.id = auth.uid()) = TRUE
    OR (current_setting('request.jwt.claims', true)::json ->> 'email') = 'zlagustin10@gmail.com'
)
WITH CHECK (
    maestro_id = auth.uid()
    OR plantel_id = (SELECT p.plantel_id FROM public.perfiles p WHERE p.id = auth.uid())
    OR (SELECT (p.es_master = true OR p.rol = 'master' OR p.rol = 'admin') FROM public.perfiles p WHERE p.id = auth.uid()) = TRUE
    OR (current_setting('request.jwt.claims', true)::json ->> 'email') = 'zlagustin10@gmail.com'
);

-- 3. Asegurar que las actividades con plantel_id nulo se vinculen con el plantel del maestro
UPDATE public.actividades_maestro am
SET plantel_id = p.plantel_id
FROM public.perfiles p
WHERE am.maestro_id = p.id
  AND am.plantel_id IS NULL
  AND p.plantel_id IS NOT NULL;

-- 4. Asegurar que las evaluaciones con plantel_id nulo se vinculen con el plantel de la actividad o del alumno
UPDATE public.evaluaciones_actividades ea
SET plantel_id = am.plantel_id
FROM public.actividades_maestro am
WHERE ea.actividad_id = am.id
  AND ea.plantel_id IS NULL
  AND am.plantel_id IS NOT NULL;

UPDATE public.evaluaciones_actividades ea
SET plantel_id = al.plantel_id
FROM public.alumnos al
WHERE ea.alumno_id = al.id
  AND ea.plantel_id IS NULL
  AND al.plantel_id IS NOT NULL;

-- 5. Asegurar columna fecha_creacion / creado_en para compatibilidad total
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'actividades_maestro' AND column_name = 'fecha_creacion'
    ) THEN
        ALTER TABLE public.actividades_maestro ADD COLUMN fecha_creacion timestamp with time zone DEFAULT now();
        UPDATE public.actividades_maestro SET fecha_creacion = creado_en WHERE creado_en IS NOT NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'actividades_maestro' AND column_name = 'creado_en'
    ) THEN
        ALTER TABLE public.actividades_maestro ADD COLUMN creado_en timestamp with time zone DEFAULT now();
        UPDATE public.actividades_maestro SET creado_en = fecha_creacion WHERE fecha_creacion IS NOT NULL;
    END IF;
END $$;
