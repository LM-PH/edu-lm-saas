window.initFlatpickrAvisos = async (isAlumno = false) => {
    const el = document.getElementById('filtroFechaAvisos');
    if(!el) return;
    
    const uRes = await supabaseClient.auth.getUser();
    const userId = uRes.data?.user?.id;
    const userRole = state.role || '';
    
    let { data } = await supabaseClient
        .from('comunicados')
        .select('fecha_envio, audiencia, titulo, tipo')
        .eq('plantel_id', state.plantelId);

    if(!data) data = [];

    let datesWithComs = [];

    if(isAlumno) {
        let audSet = new Set(['General', 'Alumnos', 'Todos']);
        if(userId) {
            const { data: al } = await supabaseClient
                .from('alumnos')
                .select('id, grupo_id')
                .or(`contacto_email.eq.${uRes.data.user.email},perfil_id.eq.${userId}`)
                .maybeSingle();

            if(al) {
                audSet.add('Alumno_' + al.id);
                if(al.grupo_id) audSet.add('Grupo_' + al.grupo_id);
            }
        }
        datesWithComs = data.filter(c => !c.audiencia || audSet.has(c.audiencia))
                            .map(c => getLocalDateStringHelper(c.fecha_envio));
    } else {
        // Obtener asignaciones si es maestro para abarcar grupos específicos y filtrar talleres
        let maestroGrupos = [];
        let maestroMaterias = [];
        if((userRole === 'maestro' || userRole === 'docente') && uRes.data?.user?.email) {
            const { data: asigs } = await supabaseClient.from('asignaciones_maestros').select('grupo_id, materia').eq('docente_email', uRes.data.user.email).eq('plantel_id', state.plantelId);
            if(asigs) {
                maestroGrupos = asigs.map(a => a.grupo_id).filter(Boolean);
                maestroMaterias = asigs.map(a => a.materia).filter(Boolean);
            }
        }

        datesWithComs = data.filter(c => {
            // Mantener consistencia con el filtro de loadTimelinePersonal
            if (c.titulo?.includes('HORARIO DE CLASE DISPONIBLE')) return false;
            if (c.tipo === 'AvisoMaestro') return false;

            if(!c.audiencia) return true;
            const aud = c.audiencia;
            let isTargeted = false;
            
            if(['Todos', 'General'].includes(aud)) isTargeted = true;
            else if(userRole === 'maestro' || userRole === 'docente') {
                if(['Maestros', 'Personal'].includes(aud)) isTargeted = true;
                else if(aud === `Maestro_${userId}`) isTargeted = true;
                else if(aud.startsWith('Maestros_Grupo_')) {
                    const gId = aud.replace('Maestros_Grupo_', '');
                    isTargeted = maestroGrupos.includes(gId);
                }
                else if(aud.startsWith('Grupo_')) {
                    const gId = aud.replace('Grupo_', '');
                    isTargeted = maestroGrupos.includes(gId);
                }
            } else if (userRole === 'directivo' || userRole === 'secretaria_direccion' || userRole === 'admin' || userRole === 'administrador' || userRole === 'administrativo') {
                isTargeted = true; // Admin/Directivos ven todas las fechas con avisos
            } else if (userRole === 'apoyo' || userRole === 'biblioteca') {
                if(['Personal', 'Maestros'].includes(aud)) isTargeted = true;
            }
            
            if (isTargeted && c.titulo?.startsWith('JUSTIFICANTE MÉDICO:') && c.titulo.includes('[TALLER:')) {
                const match = c.titulo.match(/\[TALLER:(.+?)\]/);
                if (match && maestroMaterias.length > 0) {
                    const reqTaller = match[1].toLowerCase().trim();
                    const canView = maestroMaterias.some(materia => {
                        const m = materia.toLowerCase().trim();
                        if (!m.includes('tecnología') && !m.includes('taller')) return true;
                        return m.includes(reqTaller) || reqTaller.includes(m) || m === reqTaller;
                    });
                    if (!canView) return false;
                }
            }

            return isTargeted;
        }).map(c => getLocalDateStringHelper(c.fecha_envio));
    }
    
    // Filtrar fechas únicas
    datesWithComs = [...new Set(datesWithComs)];

    if(window._fpAvisosInstance) {
        window._fpAvisosInstance.destroy();
    }
    
    // Función auxiliar para obtener fechas en el rango del calendario mostrado
    window._fpAvisosInstance = flatpickr(el, {
        locale: 'es',
        dateFormat: "Y-m-d",
        defaultDate: new Date(),
        onDayCreate: function(dObj, dStr, fp, dayElem) {
            const dateStr = getLocalDateStringHelper(dayElem.dateObj);
            if (datesWithComs.includes(dateStr)) {
                dayElem.innerHTML += '<span class="calendar-event-dot"></span>';
            }
        }
    });
};
