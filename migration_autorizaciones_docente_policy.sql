-- =========================================================================
-- MIGRACIÓN: Permitir a Docentes Completar Autorizaciones al Sellar Boleta
-- =========================================================================

-- Esta política de seguridad RLS permite que cuando un docente selle y envíe 
-- sus calificaciones modificadas a Control Escolar, la autorización aprobada 
-- pase automáticamente de 'aprobada' a 'completada'.

DROP POLICY IF EXISTS "Docentes pueden completar sus autorizaciones de calificaciones" ON public.autorizaciones_movimientos;

CREATE POLICY "Docentes pueden completar sus autorizaciones de calificaciones"
ON public.autorizaciones_movimientos
FOR UPDATE
TO authenticated
USING (
    plantel_id = public.get_my_plantel_id()
    AND tipo_accion IN ('MODIFICACION_CALIFICACIONES', 'PRORROGA_CALIFICACIONES')
    AND estado = 'aprobada'
)
WITH CHECK (
    estado = 'completada'
);
