-- ==============================================================================
-- MÓDULO DE AUDITORÍA Y TRAZABILIDAD
-- Ejecutar en el SQL Editor de Supabase
-- ==============================================================================

-- 1. Crear tabla de auditoría
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tabla_afectada TEXT NOT NULL,
    operacion TEXT NOT NULL CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE')),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    valores_viejos JSONB,
    valores_nuevos JSONB,
    ip_address TEXT,
    user_agent TEXT,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Asegurar que nadie pueda alterar el log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura exclusiva para Master" ON public.audit_log
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM perfiles 
            WHERE id = auth.uid() AND es_master = true
        )
    );

-- (Nadie puede hacer INSERT, UPDATE o DELETE directamente desde el cliente)
-- El trigger insertará los registros como SECURITY DEFINER (saltando RLS)

-- 3. Crear Función del Trigger Genérico
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
    v_ip TEXT;
    v_ua TEXT;
BEGIN
    -- Capturar IP y User Agent desde los headers de Supabase PostgREST
    BEGIN
        v_ip := current_setting('request.headers', true)::json->>'x-forwarded-for';
        v_ua := current_setting('request.headers', true)::json->>'user-agent';
    EXCEPTION WHEN OTHERS THEN
        v_ip := 'Unknown';
        v_ua := 'Unknown';
    END;

    IF (TG_OP = 'UPDATE') THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        INSERT INTO public.audit_log (tabla_afectada, operacion, usuario_id, valores_viejos, valores_nuevos, ip_address, user_agent)
        VALUES (TG_TABLE_NAME::TEXT, TG_OP, auth.uid(), v_old_data, v_new_data, v_ip, v_ua);
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        v_old_data := to_jsonb(OLD);
        INSERT INTO public.audit_log (tabla_afectada, operacion, usuario_id, valores_viejos, ip_address, user_agent)
        VALUES (TG_TABLE_NAME::TEXT, TG_OP, auth.uid(), v_old_data, null, v_ip, v_ua);
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
        v_new_data := to_jsonb(NEW);
        INSERT INTO public.audit_log (tabla_afectada, operacion, usuario_id, valores_nuevos, ip_address, user_agent)
        VALUES (TG_TABLE_NAME::TEXT, TG_OP, auth.uid(), null, v_new_data, v_ip, v_ua);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;

-- 4. Asociar el Trigger a las tablas académicas importantes

-- A) Asistencias (Faltas/Retardos)
DROP TRIGGER IF EXISTS audit_asistencias_trigger ON public.asistencias;
CREATE TRIGGER audit_asistencias_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.asistencias
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- B) Calificaciones
DROP TRIGGER IF EXISTS audit_calificaciones_trigger ON public.calificaciones;
CREATE TRIGGER audit_calificaciones_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.calificaciones
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- C) Reportes de Conducta (Incidencias)
DROP TRIGGER IF EXISTS audit_reportes_trigger ON public.reportes_conducta;
CREATE TRIGGER audit_reportes_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.reportes_conducta
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- D) Autorizaciones / Movimientos (opcional pero recomendado)
DROP TRIGGER IF EXISTS audit_autorizaciones_trigger ON public.autorizaciones_movimientos;
CREATE TRIGGER audit_autorizaciones_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.autorizaciones_movimientos
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

-- ==============================================================================
-- Fin del script
-- ==============================================================================
