-- ========================================================
-- MIGRACIÓN: PERMISOS DE HORARIOS DOCENTES PARA SECRETARÍA Y DIRECTIVOS
-- ========================================================

-- 1. Asegurar que el rol 'secretaria_direccion' exista en el enum si aplica
DO $$
BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'secretaria_direccion';
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN undefined_object THEN null;
END $$;

-- 2. Actualizar política de LECTURA para horarios_maestros
DROP POLICY IF EXISTS "Read Horarios Maestros" ON public.horarios_maestros;
CREATE POLICY "Read Horarios Maestros" ON public.horarios_maestros
FOR SELECT TO authenticated USING (
    (maestro_email = (auth.jwt() ->> 'email'::text)) OR
    ((SELECT rol FROM public.perfiles WHERE id = auth.uid()) IN ('admin', 'directivo', 'apoyo', 'secretaria_direccion', 'administrativo'))
);

-- 3. Actualizar política de GESTIÓN (Insert, Update, Delete) para horarios_maestros
DROP POLICY IF EXISTS "Manage Horarios Maestros" ON public.horarios_maestros;
CREATE POLICY "Manage Horarios Maestros" ON public.horarios_maestros
FOR ALL TO authenticated USING (
    (SELECT rol FROM public.perfiles WHERE id = auth.uid()) IN ('admin', 'directivo', 'secretaria_direccion', 'administrativo')
) WITH CHECK (
    (SELECT rol FROM public.perfiles WHERE id = auth.uid()) IN ('admin', 'directivo', 'secretaria_direccion', 'administrativo')
);
