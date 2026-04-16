-- ==========================================
-- SCRIPT DE INICIALIZACIÓN: SUPABASE ESTRUCTURA
-- Ejecutar en Supabase SQL Editor
-- ==========================================

-- 1. EXTENSIONES
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type user_role as enum ('admin', 'maestro', 'apoyo', 'alumno', 'directivo');

-- 3. TABLA DE PERFILES
-- Esta tabla se enlaza automáticamente por Triggers cuando un usuario se registra en Auth.
create table public.perfiles (
  id uuid references auth.users(id) on delete cascade primary key,
  rol user_role not null default 'alumno',
  nombre text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.perfiles enable row level security;
create policy "Perfiles visibles a la escuela" on public.perfiles for select to authenticated using (true);
create policy "Modificable por admins" on public.perfiles for update to authenticated using (
  (select rol from public.perfiles where id = auth.uid()) = 'admin'
);

-- 3.1. TRIGGER DE REGISTRO
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles (id, rol, nombre)
  values (new.id, coalesce((new.raw_user_meta_data->>'rol')::user_role, 'alumno'), new.raw_user_meta_data->>'nombre');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. TABLA GRUPOS
create table public.grupos (
  id uuid default uuid_generate_v4() primary key,
  nombre varchar(50) not null, -- Ej. 1°A, 2°B
  turno varchar(50) default 'Matutino'
);
alter table public.grupos enable row level security;
create policy "Todos ven grupos" on public.grupos for select to authenticated using(true);
create policy "Admin edita" on public.grupos for all to authenticated using(
  (select rol from public.perfiles where id = auth.uid()) = 'admin'
);

-- 5. TABLA ALUMNOS
create table public.alumnos (
  id uuid default uuid_generate_v4() primary key,
  perfil_id uuid references public.perfiles(id),
  matricula text unique not null,
  curp text unique,
  nombre text not null,
  contacto_email text,
  edad int,
  sexo varchar(20),
  estatura numeric(4,2),
  peso numeric(5,2),
  grupo_id uuid references public.grupos(id),
  grado text,
  taller text,
  qr_token text unique default uuid_generate_v4()::text,
  creado_en timestamp with time zone default now()
);
alter table public.alumnos enable row level security;
create policy "Alumnos ven su propio matricula" on public.alumnos for select to authenticated using(
  perfil_id = auth.uid() or (select rol from public.perfiles where id = auth.uid()) in ('admin', 'maestro', 'apoyo')
);
create policy "Admin inserta alumnos" on public.alumnos for all to authenticated using(
  (select rol from public.perfiles where id = auth.uid()) = 'admin'
);

-- 5.1. TRIGGER DE BAJA/GRADUACIÓN (Limpieza Profunda)
create function public.handle_alumno_deletion()
returns trigger as $$
begin
    if old.contacto_email is not null then
        delete from public.perfiles_permitidos where email = old.contacto_email;
    end if;
    if old.perfil_id is not null then
        delete from auth.users where id = old.perfil_id;
    end if;
    return old;
end;
$$ language plpgsql security definer;

create trigger on_alumno_deleted
    after delete on public.alumnos
    for each row execute procedure public.handle_alumno_deletion();

-- 6. TABLA MATERIAS
create table public.materias (
  id uuid default uuid_generate_v4() primary key,
  nombre text not null
);

-- 7. TABLA CALIFICACIONES
create table public.calificaciones (
  id uuid default uuid_generate_v4() primary key,
  alumno_id uuid references public.alumnos(id) on delete cascade,
  materia_id uuid references public.materias(id),
  maestro_id uuid references public.perfiles(id),
  trimestre int not null check(trimestre between 1 and 3),
  calificacion numeric(4,2) not null check(calificacion between 0 and 10),
  fecha timestamp with time zone default now()
);
alter table public.calificaciones enable row level security;
create policy "Alumnos ven sus califs" on public.calificaciones for select to authenticated using(
  alumno_id in (select id from public.alumnos where perfil_id = auth.uid())
);
create policy "Maestros ven y editan sus subidas" on public.calificaciones for all to authenticated using(
  maestro_id = auth.uid() or (select rol from public.perfiles where id = auth.uid()) = 'admin'
);

-- 8. TABLA BITACORA DOCENTE (Hechos de Diario)
create table public.bitacora_docente (
  id uuid default gen_random_uuid() primary key,
  perfil_id uuid references public.perfiles(id),
  firma_autor varchar(255) not null,
  texto text not null,
  fecha_referencia date not null default current_date,
  creado_en timestamp with time zone default now()
);
alter table public.bitacora_docente enable row level security;
create policy "Bitacora read general" on public.bitacora_docente for select to authenticated using(true);
create policy "Bitacora insert maestro" on public.bitacora_docente for insert to authenticated with check(
  (select rol from public.perfiles where id = auth.uid()) in ('admin', 'maestro', 'apoyo')
);

-- 9. TABLA ASISTENCIAS / ESCANEO QR
create table public.asistencias (
  id uuid default uuid_generate_v4() primary key,
  alumno_id uuid references public.alumnos(id) on delete cascade not null,
  registrador_id uuid references public.perfiles(id),
  estado varchar(20) default 'Asistencia',
  creado_en timestamp with time zone default now()
);
alter table public.asistencias enable row level security;
create policy "Staff ve asistencias" on public.asistencias for select to authenticated using(true);
CREATE POLICY "Docentes_read_their_asignaciones" ON public.asignaciones_docentes FOR SELECT TO authenticated USING (
    docente_email = ((current_setting('request.jwt.claims', true))::json ->> 'email')
);
create policy "Staff inserta asistencias" on public.asistencias for insert to authenticated with check(
  (select rol from public.perfiles where id = auth.uid()) in ('admin', 'maestro', 'apoyo')
);

-- 9. TABLA REPORTES DE CONDUCTA / FOCOS ROJOS
create table public.reportes_conducta (
  id uuid default uuid_generate_v4() primary key,
  alumno_id uuid references public.alumnos(id) on delete cascade not null,
  autor_id uuid references public.perfiles(id),
  descripcion text not null,
  gravedad varchar(20) default 'Leve',
  resuelto boolean default false,
  fecha timestamp with time zone default now()
);
alter table public.reportes_conducta enable row level security;
create policy "Staff ve reportes" on public.reportes_conducta for select to authenticated using(
  (select rol from public.perfiles where id = auth.uid()) in ('admin', 'maestro', 'apoyo')
);
create policy "Alumno ve sus propios reportes" on public.reportes_conducta for select to authenticated using(
  alumno_id in (select id from public.alumnos where perfil_id = auth.uid())
);
create policy "Staff inserta reportes" on public.reportes_conducta for insert to authenticated with check(
  (select rol from public.perfiles where id = auth.uid()) in ('admin', 'maestro', 'apoyo')
);
create policy "Apoyo resuelve reportes" on public.reportes_conducta for update to authenticated using(
  (select rol from public.perfiles where id = auth.uid()) in ('apoyo', 'admin')
);

-- 10. STORAGE: EXPEDIENTES ALUMNOS
insert into storage.buckets (id, name, public) 
values ('expedientes_alumnos', 'expedientes_alumnos', false);

create policy "Los trabajadores pueden acceder a documentos de expedientes"
  on storage.objects for select
  using (
    bucket_id = 'expediente' 
    and (select rol from public.perfiles where perfiles.id = auth.uid()) in ('admin', 'apoyo', 'maestro', 'directivo')
  );

-- ========================================================
-- AUTORIZACIONES Y VISTOS BUENOS
-- ========================================================

create table public.autorizaciones_movimientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_accion TEXT NOT NULL,
    detalles TEXT NOT NULL,
    payload_json JSONB NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    solicitante_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    fecha_solicitud TIMESTAMPTZ DEFAULT NOW(),
    fecha_resolucion TIMESTAMPTZ
);

alter table public.autorizaciones_movimientos enable row level security;

create policy "Directivos y Admins pueden gestionar autorizaciones"
    on public.autorizaciones_movimientos for all
    using ( 
        (select rol from public.perfiles where perfiles.id = auth.uid())::text in ('directivo', 'admin', 'administrador')
    );
create policy "Lectura de expedientes" on storage.objects for select to authenticated using (
  bucket_id = 'expedientes_alumnos' and ((auth.uid() = owner) or ((select rol from public.perfiles where id = auth.uid()) in ('admin', 'apoyo')))
);

-- Tabla Comunicados
CREATE TABLE public.comunicados (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    autor_id uuid REFERENCES public.perfiles(id) ON DELETE CASCADE,
    titulo text NOT NULL,
    audiencia text NOT NULL,
    mensaje text NOT NULL,
    archivo_url text,
    fecha_envio timestamp with time zone DEFAULT now()
);

ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura general de comunicados" ON public.comunicados
    FOR SELECT
    USING (true);

CREATE POLICY "Solo admins crean comunicados" ON public.comunicados
    FOR INSERT
    WITH CHECK (
        (SELECT rol FROM perfiles WHERE perfiles.id = auth.uid()) = 'admin'
    );

-- Bucket para adjuntos de comunicados
INSERT INTO storage.buckets (id, name, public) VALUES ('comunicados_adjuntos', 'comunicados_adjuntos', true);

CREATE POLICY "Lectura de adjuntos comunicados" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'comunicados_adjuntos');

CREATE POLICY "Admins suben adjuntos comunicados" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'comunicados_adjuntos' AND
        (SELECT rol FROM perfiles WHERE perfiles.id = auth.uid()) = 'admin'
    );

-- 12. TABLA ACTIVIDADES DOCENTE
CREATE TABLE public.actividades_docente (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    maestro_id uuid REFERENCES public.perfiles(id) ON DELETE CASCADE,
    materia varchar(100) NOT NULL,
    grupo_id uuid REFERENCES public.grupos(id),
    titulo text NOT NULL,
    descripcion text,
    fecha_creacion timestamp with time zone DEFAULT now()
);

ALTER TABLE public.actividades_docente ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Docentes leen sus actividades" ON public.actividades_docente
FOR SELECT 
USING ( true );

CREATE POLICY "Docentes insertan sus actividades" ON public.actividades_docente
FOR INSERT
WITH CHECK ( maestro_id = auth.uid() OR (SELECT rol FROM perfiles WHERE id = auth.uid()) = 'admin' );

CREATE POLICY "Docentes actualizan sus actividades" ON public.actividades_docente
FOR UPDATE
USING ( maestro_id = auth.uid() OR (SELECT rol FROM perfiles WHERE id = auth.uid()) = 'admin' )
WITH CHECK ( maestro_id = auth.uid() OR (SELECT rol FROM perfiles WHERE id = auth.uid()) = 'admin' );

CREATE POLICY "Docentes borran sus actividades" ON public.actividades_docente
FOR DELETE
USING ( maestro_id = auth.uid() OR (SELECT rol FROM perfiles WHERE id = auth.uid()) = 'admin' );

-- 13. TABLA EVALUACIONES ACTIVIDADES (CALIFICAR CON QR)
CREATE TABLE public.evaluaciones_actividades (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    actividad_id uuid REFERENCES public.actividades_docente(id) ON DELETE CASCADE,
    alumno_id uuid REFERENCES public.alumnos(id) ON DELETE CASCADE,
    calificacion text NOT NULL,
    fecha_evaluacion timestamp with time zone DEFAULT now(),
    UNIQUE(actividad_id, alumno_id)
);

ALTER TABLE public.evaluaciones_actividades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Docentes insertan evaluaciones" ON public.evaluaciones_actividades
FOR INSERT
WITH CHECK (
    (SELECT maestro_id FROM actividades_docente ad WHERE ad.id = actividad_id) = auth.uid() OR
    (SELECT rol FROM perfiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Docentes actualizan evaluaciones" ON public.evaluaciones_actividades
FOR UPDATE
USING (
    (SELECT maestro_id FROM actividades_docente ad WHERE ad.id = evaluaciones_actividades.actividad_id) = auth.uid() OR
    (SELECT rol FROM perfiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
    (SELECT maestro_id FROM actividades_docente ad WHERE ad.id = evaluaciones_actividades.actividad_id) = auth.uid() OR
    (SELECT rol FROM perfiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Docentes borran evaluaciones" ON public.evaluaciones_actividades
FOR DELETE
USING (
    (SELECT maestro_id FROM actividades_docente ad WHERE ad.id = actividad_id) = auth.uid() OR
    (SELECT rol FROM perfiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Lectura de evaluaciones alumnos" ON public.evaluaciones_actividades
    FOR SELECT
    USING (true);


-- 14. TABLA ENCUADRES (RUBRICAS)
CREATE TABLE IF NOT EXISTS public.encuadres (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    maestro_id uuid REFERENCES public.perfiles(id) ON DELETE CASCADE,
    grupo_id uuid REFERENCES public.grupos(id),
    materia text NOT NULL,
    rubros jsonb NOT NULL, 
    fecha_creacion timestamp with time zone DEFAULT now(),
    UNIQUE(grupo_id, materia)
);

ALTER TABLE public.encuadres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura de encuadres" ON public.encuadres FOR SELECT USING (true);
CREATE POLICY "Docentes insertan encuadres" ON public.encuadres FOR INSERT WITH CHECK (
    maestro_id = auth.uid() OR (SELECT rol FROM perfiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Docentes actualizan encuadres" ON public.encuadres FOR UPDATE USING (
    maestro_id = auth.uid() OR (SELECT rol FROM perfiles WHERE id = auth.uid()) = 'admin'
);

-- 15. TABLA FIRMAS DE ENCUADRE
CREATE TABLE IF NOT EXISTS public.firmas_encuadre (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    encuadre_id uuid REFERENCES public.encuadres(id) ON DELETE CASCADE,
    alumno_id uuid REFERENCES public.alumnos(id) ON DELETE CASCADE,
    firma text NOT NULL,
    fecha_firma timestamp with time zone DEFAULT now(),
    UNIQUE(encuadre_id, alumno_id)
);
ALTER TABLE public.firmas_encuadre ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura de firmas" ON public.firmas_encuadre FOR SELECT USING (true);
CREATE POLICY "Alumnos y padres firman su encuadre" ON public.firmas_encuadre FOR INSERT WITH CHECK (
    alumno_id IN (SELECT id FROM alumnos WHERE perfil_id = auth.uid()) OR (SELECT rol FROM perfiles WHERE id = auth.uid()) IN ('admin', 'maestro')
);

-- 16. TABLA ASIGNACIONES DOCENTES (VINCULACIÓN)
CREATE TABLE IF NOT EXISTS public.asignaciones_docentes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    docente_email text NOT NULL,
    materia text NOT NULL,
    grupo_id uuid REFERENCES public.grupos(id),
    target_grado text,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.asignaciones_docentes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Directivos_manage_asignaciones" ON public.asignaciones_docentes FOR ALL TO authenticated USING (
    (SELECT rol FROM perfiles WHERE id = auth.uid()) IN ('admin', 'directivo')
);
CREATE POLICY "Docentes_read_own_asignaciones" ON public.asignaciones_docentes FOR SELECT TO authenticated USING (
    docente_email = ((current_setting('request.jwt.claims', true))::json ->> 'email') OR
    (SELECT rol FROM perfiles WHERE id = auth.uid()) IN ('admin', 'directivo')
);

-- 17. TABLA PERFILES PERMITIDOS (REGISTRO PREVIO)
CREATE TABLE IF NOT EXISTS public.perfiles_permitidos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    nombre text,
    rol text CHECK (rol IN ('administrativo', 'docente', 'apoyo', 'alumno', 'maestro', 'admin', 'directivo')),
    estado text DEFAULT 'pendiente',
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.perfiles_permitidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Directivos_manage_perfiles" ON public.perfiles_permitidos FOR ALL TO authenticated USING (
    (SELECT rol FROM perfiles WHERE id = auth.uid()) IN ('admin', 'directivo')
);
CREATE POLICY "Lectura_general_perfiles" ON public.perfiles_permitidos FOR SELECT TO authenticated USING (true);

-- 18. TABLA ASISTENCIA SESIONES (MAESTROS)
CREATE TABLE IF NOT EXISTS public.asistencia_sesiones (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id text NOT NULL, -- Puede ser UUID o "grado:1°"
    materia text NOT NULL,
    fecha date DEFAULT CURRENT_DATE,
    maestro_id uuid REFERENCES public.perfiles(id) ON DELETE CASCADE,
    estado text DEFAULT 'abierto' CHECK (estado IN ('abierto', 'retardo', 'cerrado')),
    creado_en timestamp with time zone DEFAULT now()
);
ALTER TABLE public.asistencia_sesiones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Maestros_manage_sessions" ON public.asistencia_sesiones FOR ALL TO authenticated USING (
    maestro_id = auth.uid() OR (SELECT rol FROM perfiles WHERE id = auth.uid()) IN ('admin', 'directivo')
);

-- ACTUALIZACIONES DE TABLAS EXISTENTES
ALTER TABLE public.encuadres ADD COLUMN IF NOT EXISTS target_grado text;
ALTER TABLE public.encuadres ADD COLUMN IF NOT EXISTS trimestre int DEFAULT 1;
ALTER TABLE public.encuadres ADD COLUMN IF NOT EXISTS notificacion_enviada boolean DEFAULT false;
ALTER TABLE public.encuadres ADD COLUMN IF NOT EXISTS fecha_envio_notif timestamp with time zone;

ALTER TABLE public.calificaciones ADD COLUMN IF NOT EXISTS materia_nombre text;
-- Actualizar check de trimestre (1-4)
ALTER TABLE public.calificaciones DROP CONSTRAINT IF EXISTS calificaciones_trimestre_check;
ALTER TABLE public.calificaciones ADD CONSTRAINT calificaciones_trimestre_check CHECK (trimestre >= 1 AND trimestre <= 4);

-- 19. TABLA CONFIG INSTITUCION
CREATE TABLE IF NOT EXISTS public.config_institucion (
    id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    nombre_escuela text,
    nombre_director text,
    correo_director text,
    fecha_configuracion timestamp with time zone DEFAULT now()
);
ALTER TABLE public.config_institucion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Directivo_manage_config" ON public.config_institucion FOR ALL TO authenticated USING (
    (SELECT rol FROM perfiles WHERE id = auth.uid()) IN ('admin', 'directivo')
);
CREATE POLICY "Public_read_config" ON public.config_institucion FOR SELECT TO authenticated USING (true);
-- ALTER TABLE public.actividades_docente ADD COLUMN IF NOT EXISTS rubro_name text;
-- ALTER TABLE public.actividades_docente ADD COLUMN IF NOT EXISTS rubro_peso numeric(5,2);
