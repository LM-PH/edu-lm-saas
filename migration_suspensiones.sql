-- ========================================================
-- MIGRACIÓN: MÓDULO DE SUSPENSIONES ESCOLARES (TRABAJO SOCIAL / DIRECCIÓN)
-- ========================================================

-- 1. Tabla de suspensiones de alumnos
CREATE TABLE IF NOT EXISTS public.suspensiones_alumnos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    alumno_id uuid REFERENCES public.alumnos(id) ON DELETE CASCADE,
    autor_id uuid REFERENCES public.perfiles(id) ON DELETE CASCADE,
    citatorio_id uuid REFERENCES public.citatorios(id) ON DELETE SET NULL,
    motivo text,
    fecha_inicio timestamp with time zone NOT NULL,
    fecha_fin timestamp with time zone NOT NULL,
    plantel_id uuid REFERENCES public.planteles(id) ON DELETE CASCADE,
    creado_en timestamp with time zone DEFAULT now()
);

-- 2. Habilitar RLS en suspensiones_alumnos
ALTER TABLE public.suspensiones_alumnos ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acceso (lectura/escritura por plantel)
CREATE POLICY "Lectura y escritura suspensiones" ON public.suspensiones_alumnos
    FOR ALL TO authenticated
    USING (plantel_id = (SELECT p.plantel_id FROM public.perfiles p WHERE p.id = auth.uid()));

-- 4. Asegurar que la columna estado en asistencias acepte textos largos como 'Falta por Suspensión'
ALTER TABLE public.asistencias ALTER COLUMN estado TYPE text;
