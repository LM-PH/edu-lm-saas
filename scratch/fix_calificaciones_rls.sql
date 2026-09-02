-- Asegurar que Trabajo Social, Orientación y Apoyo puedan consultar calificaciones para Riesgo Académico
DROP POLICY IF EXISTS "Personal y Maestros ven calificaciones" ON public.calificaciones;

CREATE POLICY "Personal y Maestros ven calificaciones" ON public.calificaciones 
FOR SELECT TO authenticated 
USING (
  maestro_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() 
    AND rol IN ('admin', 'directivo', 'director', 'subdirector', 'trabajo_social', 'orientacion', 'apoyo', 'control_escolar', 'coordinador', 'administrativo')
  )
);
