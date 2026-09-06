-- Crear tabla de protocolos de atención para reportes escolares
CREATE TABLE IF NOT EXISTS public.protocolos_reportes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    plantel_id uuid REFERENCES public.planteles(id) ON DELETE CASCADE,
    clasificacion text NOT NULL, -- 'Académico', 'Convivencia', 'Atención Prioritaria'
    gravedad text, -- 'Leve', 'Moderado', 'Grave', o NULL/'N/A' para Atención Prioritaria
    cantidad_reportes integer NOT NULL, -- Número de reportes que disparan el protocolo
    accion_a_tomar text NOT NULL, -- 'Mandar citatorio a padre', 'Citatorio a alumno', etc.
    creado_en timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.protocolos_reportes ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Public read protocolos" ON public.protocolos_reportes FOR SELECT USING (true);
CREATE POLICY "Admin full protocolos" ON public.protocolos_reportes FOR ALL TO authenticated USING (
    (SELECT rol FROM perfiles WHERE id = auth.uid()) IN ('admin', 'directivo', 'apoyo')
);
