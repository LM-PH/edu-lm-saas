-- =========================================================================
-- MIGRACIÓN: Permitir a 'biblioteca' (y otros roles escolares) crear comunicados
-- Ejecutar en Supabase SQL Editor para Secundaria Técnica 150 y demás planteles
-- =========================================================================

DROP POLICY IF EXISTS "Permitir creacion de comunicados" ON public.comunicados;

CREATE POLICY "Permitir creacion de comunicados" ON public.comunicados
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT rol FROM public.perfiles WHERE perfiles.id = auth.uid()) IN (
            'admin', 
            'directivo', 
            'apoyo', 
            'maestro', 
            'secretaria_direccion', 
            'biblioteca'
        )
    );
