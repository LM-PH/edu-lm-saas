-- SCRIPT DE OPTIMIZACIÓN DE RENDIMIENTO (ÍNDICES)
-- Copia y pega esto en el SQL Editor de Supabase y dale a RUN.
-- Se ejecuta en 1 o 2 segundos. No borra ni altera ningún dato.

-- Índices para búsquedas de la línea de tiempo (Comunicados)
CREATE INDEX IF NOT EXISTS idx_comunicados_audiencia ON public.comunicados(audiencia);
CREATE INDEX IF NOT EXISTS idx_comunicados_plantel ON public.comunicados(plantel_id);

-- Índices para el expediente y reportes de Trabajo Social
CREATE INDEX IF NOT EXISTS idx_reportes_alumno ON public.reportes_conducta(alumno_id);
CREATE INDEX IF NOT EXISTS idx_reportes_plantel ON public.reportes_conducta(plantel_id);
CREATE INDEX IF NOT EXISTS idx_reportes_resuelto ON public.reportes_conducta(resuelto);

-- Índices para asistencias (que se consultan diario por cientos de alumnos)
CREATE INDEX IF NOT EXISTS idx_asistencias_alumno ON public.asistencias(alumno_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_fecha ON public.asistencias(fecha);

-- Índices para citatorios
CREATE INDEX IF NOT EXISTS idx_citatorios_alumno ON public.citatorios(alumno_id);
CREATE INDEX IF NOT EXISTS idx_citatorios_estado ON public.citatorios(estado);
CREATE INDEX IF NOT EXISTS idx_citatorios_plantel ON public.citatorios(plantel_id);

-- Índices para Alumnos y Usuarios
CREATE INDEX IF NOT EXISTS idx_alumnos_plantel ON public.alumnos(plantel_id);
CREATE INDEX IF NOT EXISTS idx_alumnos_grupo ON public.alumnos(grupo_id);
CREATE INDEX IF NOT EXISTS idx_perfiles_rol ON public.perfiles(rol);
