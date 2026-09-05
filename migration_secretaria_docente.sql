-- ==========================================
-- SCRIPT DE MIGRACIÓN: SECRETARÍA DE DIRECCIÓN Y EXPEDIENTES
-- Ejecutar en Supabase SQL Editor
-- ==========================================

-- 1. AGREGAR NUEVO ROL (Si usas un Enum. Puede arrojar advertencia si ya existe, ignórala)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'secretaria_direccion';

-- 2. CREAR TABLA DE EXPEDIENTE DE DOCENTE
CREATE TABLE public.expedientes_docentes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    maestro_id uuid REFERENCES public.perfiles(id) ON DELETE CASCADE,
    plantel_id uuid NOT NULL,
    curp text,
    telefono text,
    correo text,
    estado_civil text,
    clave_presupuestal text,
    carga_horaria_json jsonb, -- Almacenará array de materias y horas
    horas_totales int DEFAULT 0,
    perfil_academico_ultimo_grado text,
    fecha_ingreso_sep date,
    fecha_ingreso_ct date,
    creado_en timestamp with time zone DEFAULT now(),
    actualizado_en timestamp with time zone DEFAULT now()
);

-- Aseguramos unicidad de expediente por maestro y plantel
ALTER TABLE public.expedientes_docentes ADD CONSTRAINT unique_expediente_maestro_plantel UNIQUE (maestro_id, plantel_id);

ALTER TABLE public.expedientes_docentes ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE SEGURIDAD (RLS)
-- Directivos, Admins y Secretaria de Dirección pueden gestionar los expedientes de su plantel
CREATE POLICY "Gestion_Expedientes_Docentes_Staff" 
ON public.expedientes_docentes FOR ALL TO authenticated 
USING (
    plantel_id = (SELECT p.plantel_id FROM public.perfiles p WHERE p.id = auth.uid()) 
    AND (SELECT rol FROM perfiles WHERE id = auth.uid()) IN ('admin', 'directivo', 'secretaria_direccion')
)
WITH CHECK (
    plantel_id = (SELECT p.plantel_id FROM public.perfiles p WHERE p.id = auth.uid()) 
    AND (SELECT rol FROM perfiles WHERE id = auth.uid()) IN ('admin', 'directivo', 'secretaria_direccion')
);

-- El propio maestro puede ver su expediente
CREATE POLICY "Lectura_Expediente_Propio"
ON public.expedientes_docentes FOR SELECT TO authenticated
USING (maestro_id = auth.uid());
