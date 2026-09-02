-- ==========================================
-- PASO 2: HABILITAR ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
-- Copia y ejecuta este bloque en el SQL Editor de tu consola Supabase
-- ==========================================

DO $$ 
DECLARE 
    t_name text;
BEGIN
    FOR t_name IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t_name);
        RAISE NOTICE 'RLS activado exitosamente en: %', t_name;
    END LOOP;
END $$;
