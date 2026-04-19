// Global Configuration & Branding (VERSIÓN UNIVERSAL v112 - HUMANIZACIÓN FORZADA)
const CONFIG = {
  appName: "Edu-LM",
  schoolName: "Portal Educativo"
};

// Supabase Configuration
console.log("%c>>> EDU-LM V112 UNIVERSAL CARGADA: VIGILANCIA HUMANA ACTIVA", "color: yellow; background: black; padding: 12px; font-weight: 1000; border: 2px solid yellow;");
const SUPABASE_URL = "https://yphflvrvfcqazqdqdfgg.supabase.co"; 
const SUPABASE_SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaGZsdnJ2ZmNxYXpxZHFkZmdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY4ODQ2MywiZXhwIjoyMDkxMjY0NDYzfQ.WD1c4kOtJrwdXZj3qHilbd4XRdoB5nPl_ijthomXw6k";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaGZsdnJ2ZmNxYXpxZHFkZmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODg0NjMsImV4cCI6MjA5MTI2NDQ2M30.-Y5pwEHhmcXPuyh0gYALNTaMMAyK7Dm883Fohq3DtV0";
const SUPABASE_KEY = SUPABASE_ANON_KEY;

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
const supaAdmin = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
}) : null;

// Global State
const ADMIN_ROLES = ['admin', 'administrativo', 'directivo', 'master'];
const esAdmin = (rol) => ADMIN_ROLES.includes(rol);

let _state = {
  role: null, 
  user: null,
  userName: '',
  plantelId: null,
  path: '/',
  schoolConfigured: false
};

const state = new Proxy(_state, {
  set(target, prop, value) {
    if (prop === 'role') {
      if (value === 'admin') value = 'admin';
    }
    target[prop] = value;
    // Disparar watchdog inmediatamente al cambiar estado
    if(window.autoHumanize) window.autoHumanize(); 
    return true;
  },
  get(target, prop) {
    return target[prop];
  }
});

// WATCHDOG UNIVERSAL v135
window.autoHumanize = () => {
    const selector = document.getElementById('selMaestroMateriasV110');
    // Si es un SELECT, revisamos opciones. Si es un INPUT, ignoramos (ya se humaniza al cargar)
    if(selector && selector.tagName === 'SELECT' && selector.options.length > 0) {
        const text = selector.options[0].text;
        if(text.includes('Cargando') || text.includes('@')) {
            // Si el primer elemento es un correo o dice cargando, intentamos humanizar
            if(window.loadSelectsMaestros) window.loadSelectsMaestros();
        }
    }
};
setInterval(window.autoHumanize, 3000); // Revisión constante cada 3 segundos (menos agresivo)

// Utils & Globals
window.navigate = (path) => {
  state.path = path;
  renderApp();
};

window.showToast = (msg, type = 'success') => {
    const existing = document.getElementById('toast-notification');
    if(existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    const bg = type === 'success' ? 'var(--success)' : (type === 'error' ? 'var(--danger)' : 'var(--warning)');
    const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'circle-exclamation' : 'circle-info');
    
    toast.style.cssText = `position:fixed; top:20px; left:50%; transform:translateX(-50%); background:${bg}; color:white; padding:12px 24px; border-radius:12px; z-index:10000; box-shadow: 0 10px 25px rgba(0,0,0,0.2); font-weight:bold; display:flex; gap:10px; align-items:center; animation: slideDown 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);`;
    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> ${msg}`;
    
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.4s forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

// Standardized Login Function
window.login = (rawRole) => {
    let role = rawRole;
    if (role === 'admin') role = 'admin';

    state.role = role;
    state.schoolConfigured = true;
    if (window.currentUserProfile && window.currentUserProfile.plantel_id) {
        state.plantelId = window.currentUserProfile.plantel_id;
    }
    console.log("Logged in as:", role, "School Configured:", state.schoolConfigured, "Plantel:", state.plantelId);

    
    // Default paths per role
    if(role === 'master') state.path = '/master/saas';
    else if(role === 'admin') state.path = '/admin/inscripcion';
    else if(role === 'directivo') state.path = '/directivo/autorizaciones';
    else if(role === 'maestro') state.path = '/maestro/aula';
    else if(role === 'apoyo') state.path = '/apoyo/dashboard';
    else if(role === 'alumno') state.path = '/alumno/credencial';
    
    renderApp();
};

window.logout = async () => {
    await supabaseClient.auth.signOut();
    state.user = null;
    state.role = null;
    state.schoolConfigured = false;
    state.path = '/';
    renderApp();
};


window.handleLogin = async (e) => {
  if (e && e.preventDefault) e.preventDefault();
  const emailInput = document.getElementById('fb-email');
  const btn = document.querySelector('.btn-login') || event?.currentTarget;
  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const errorMsg = document.getElementById('auth-error-msg');
  
  if(!email) {
    if(errorMsg) errorMsg.innerText = 'Por favor ingresa tu correo.';
    return;
  }
  
  if(btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando...';
  }

  try {
    const { data: allowed } = await supabaseClient.from('perfiles_permitidos').select('*').ilike('email', email).maybeSingle();

    // Excepción Maestra v136: Definir data por defecto si no está en padrón
    const effectiveData = allowed || (email === 'zlagustin10@gmail.com' ? { rol: 'master', nombre: 'Administrador Maestro', plantel_id: null } : null);

    if (!effectiveData) {
      if(errorMsg) errorMsg.innerText = 'Este correo no está registrado en el padrón de este plantel.';
      if(btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Acceder al Portal';
      }
      return;
    }

    const BYPASS_KEY = 'EduLM_Internal_Access_2026';
    let { data: authData, error: authErr } = await supabaseClient.auth.signInWithPassword({ email, password: BYPASS_KEY });

    if (authErr) {
        await fetch('https://yphflvrvfcqazqdqdfgg.supabase.co/auth/v1/admin/users', {
            method: 'POST',
            headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaGZsdnJ2ZmNxYXpxZHFkZmdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY4ODQ2MywiZXhwIjoyMDkxMjY0NDYzfQ.WD1c4kOtJrwdXZj3qHilbd4XRdoB5nPl_ijthomXw6k', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaGZsdnJ2ZmNxYXpxZHFkZmdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY4ODQ2MywiZXhwIjoyMDkxMjY0NDYzfQ.WD1c4kOtJrwdXZj3qHilbd4XRdoB5nPl_ijthomXw6k', 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email, 
                password: BYPASS_KEY, 
                email_confirm: true, 
                user_metadata: { rol: effectiveData.rol, nombre: effectiveData.nombre } 
            })
        });
        const retry = await supabaseClient.auth.signInWithPassword({ email, password: BYPASS_KEY });
        if (retry.error) throw retry.error;
        authData = retry.data;
    }

    await supabaseClient.from('perfiles').upsert({
        id: authData.user.id,
        rol: effectiveData.rol,
        nombre: effectiveData.nombre,
        plantel_id: effectiveData.plantel_id
    });

    // SINCRONIZACIÓN DE METADATOS JWT
    await supabaseClient.auth.updateUser({ 
        data: { 
            rol: effectiveData.rol, 
            nombre: effectiveData.nombre,
            plantel_id: effectiveData.plantel_id 
        } 
    });

    state.user = authData.user;
    state.plantelId = allowed.plantel_id;
    window.login(allowed.rol);

  } catch (err) {
    if(errorMsg) {
        errorMsg.innerText = 'Error: ' + err.message;
        errorMsg.style.color = '#ef4444';
    }
  } finally {
    if(btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Acceder al Portal';
    }
  }
};


window.handleRegister = async () => {
  const email = document.getElementById('fb-email').value;
  const pass = document.getElementById('fb-pass').value;
  const role = document.getElementById('fb-role').value;
  const errorMsg = document.getElementById('auth-error-msg');

  errorMsg.innerText = "";

  if(!email || !pass) {
    errorMsg.innerText = "Ingresa un correo y contraseña para crear la cuenta.";
    return;
  }

  if(pass.length < 6) {
    errorMsg.innerText = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  errorMsg.innerText = "Registrando en Supabase...";

  try {
    const { data, error } = await supabaseClient.auth.signUp({ 
      email, 
      password: pass,
      options: {
        data: { rol: role, nombre: 'Nuevo Usuario' }
      }
    });
    if(error) throw error;
    window.login(role);
  } catch (err) {
    errorMsg.innerText = "Error: " + err.message;
    console.error(err);
  }
};

window.handleGoogleLogin = async () => {
  const errorMsg = document.getElementById('auth-error-msg');
  errorMsg.innerText = "Abriendo Google Auth vía Supabase...";
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'google' });
    if(error) throw error;
  } catch(err) {
    errorMsg.innerText = "Error: " + err.message;
    console.error(err);
  }
};


// ========================
// TEMPLATES
// ========================

function renderSetupScreen() {
    const currentStep = state.setupStep || 0;

    if (currentStep === 0) {
        return `
        <div style="display:flex; justify-content:center; align-items:center; min-height:100vh; background:linear-gradient(135deg, var(--primary-dark) 0%, #1e293b 100%); padding:20px;">
          <div class="card shadow-lg" style="width:100%; max-width:450px; padding:40px; border-radius:24px; text-align:center; animation: fadeIn 0.8s ease-out; background:rgba(255,255,255,0.98); backdrop-filter: blur(10px);">
            <div style="font-size:4rem; color:var(--primary); margin-bottom:20px; filter: drop-shadow(0 4px 6px rgba(37, 99, 235, 0.2));"><i class="fa-solid fa-graduation-cap"></i></div>
            <h1 style="margin-bottom:12px; font-weight:800; letter-spacing:-0.02em;">¡Bienvenido a ${CONFIG.appName}!</h1>
            <p style="color:var(--text-muted); margin-bottom:32px; font-size:1.05rem;">Antes de comenzar, dinos cuál es tu situación:</p>
            
            <div style="display:flex; flex-direction:column; gap:16px;">
                <button class="btn btn-primary" style="height:64px; font-size:1.1rem; border-radius:16px; font-weight:600; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);" onclick="state.setupStep = 1; renderApp();">
                    <i class="fa-solid fa-user-tie"></i> Soy Director (Nuevo Plantel)
                </button>
                <button class="btn btn-outline" style="height:64px; font-size:1.1rem; border-radius:16px; border-width:2px; border-color:var(--primary); color:var(--primary); font-weight:600;" onclick="state.setupStep = 2; renderApp();">
                    <i class="fa-solid fa-school-circle-check"></i> Mi escuela ya está registrada
                </button>
            </div>
            
            <div style="margin-top:32px; padding:15px; border-top:1px dashed #e2e8f0; text-align:center;">
               <div style="padding:12px; border: 1.5px solid #e2e8f0; border-radius:12px; background:#f8fafc; cursor:pointer;" onclick="state.schoolConfigured = true; renderApp();">
                  <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Desarrollado por:</div>
                  <div style="font-size:0.9rem; font-weight:800; color:var(--primary);">M.C Luis Miguel Ponce Herrera</div>
               </div>
            </div>
          </div>
        </div>
        `;
    }

    if (currentStep === 1) { // Lógica Director
        return `
        <div class="role-selector-view">
          <div class="card shadow-lg" style="width:100%; max-width:480px; padding:40px; border-radius:24px; text-align:center; animation: scaleIn 0.4s ease-out; position:relative; z-index:100;">
            <button onclick="state.setupStep = 0; renderApp();" style="border:none; background:none; color:var(--primary); cursor:pointer; font-weight:700; margin-bottom:20px; font-size:1rem;"><i class="fa-solid fa-arrow-left"></i> Volver</button>
            <h1 style="color:var(--text-main); margin-bottom:8px;">Registro de Plantel</h1>
            <p style="color:var(--text-muted); margin-bottom:32px;">Configura tu escuela como Director Fundador.</p>

            <div id="setupForm" style="text-align:left;">
                <div class="form-group" style="margin-bottom:20px;">
                    <label class="form-label" style="font-weight:600; margin-bottom:8px; display:block;">Nombre de la Escuela (Mayúsculas)</label>
                    <input type="text" id="setupEscuela" class="form-input" 
                           style="height:60px; text-align:center; font-weight:700; border-radius:12px; font-size:16px;" 
                           placeholder="EJ: ESCUELA SECUNDARIA TECNICA NO. 1" 
                           oninput="this.value = this.value.toUpperCase()"
                           spellcheck="false" autocomplete="off">
                </div>
                <div class="form-group" style="margin-bottom:20px;">
                    <label class="form-label" style="font-weight:600; margin-bottom:8px; display:block;">Nombre del Director</label>
                    <input type="text" id="setupDirector" class="form-input" 
                           style="height:60px; text-align:center; border-radius:12px; font-size:16px;" 
                           placeholder="Nombre completo..."
                           spellcheck="false">
                </div>
                <div class="form-group" style="margin-bottom:32px;">
                    <label class="form-label" style="font-weight:600; margin-bottom:8px; display:block;">Tu Correo Institucional</label>
                    <input type="email" id="setupCorreo" class="form-input" 
                           style="height:60px; text-align:center; border-radius:12px; font-size:16px;" 
                           placeholder="director@escuela.com"
                           inputmode="email" autocomplete="email">
                </div>
                <button class="btn btn-primary" style="width:100%; height:64px; font-size:1.1rem; border-radius:16px; font-weight:700; box-shadow: var(--shadow-sm);" onclick="window.realizarSetupInicial()">
                    <i class="fa-solid fa-rocket"></i> Registrar Plantel y Acceder
                </button>
            </div>
          </div>
        </div>
        `;
    }

    if (currentStep === 2) { // Mi escuela ya está registrada
        return `
        <div class="role-selector-view">
          <div class="card shadow-lg" style="width:100%; max-width:500px; padding:40px; border-top: 6px solid var(--success); text-align:center; animation: slideInRight 0.4s; position:relative; z-index:100;">
             <button onclick="state.setupStep = 0; renderApp();" style="border:none; background:none; color:var(--text-muted); cursor:pointer; font-weight:600; float:left;"><i class="fa-solid fa-arrow-left"></i></button>
             <div style="font-size:3rem; color:var(--success); margin-bottom:15px;"><i class="fa-solid fa-clipboard-check"></i></div>
             <h2 style="margin-bottom:10px;">¡Excelente!</h2>
             <p style="color:var(--text-muted); margin-bottom:24px;">Para confirmar que tu escuela ya usa Edu-LM, por favor escribe su nombre tal como fue registrada.</p>
             
             <div class="form-group">
                <input type="text" id="checkEscuelaName" class="form-input" 
                       placeholder="ESCRIBA EL NOMBRE EN MAYÚSCULAS" 
                       style="text-align:center; font-weight:bold; height:60px; font-size:16px;" 
                       oninput="this.value = this.value.toUpperCase()"
                       spellcheck="false" autocomplete="off">
             </div>
             
             <button class="btn btn-success" style="width:100%; height:60px; font-size:1.1rem; border-radius:12px;" onclick="window.validarEscuelaYaRegistrada()">
                <i class="fa-solid fa-magnifying-glass"></i> Validar y Entrar al Portal
             </button>
             
             <p style="margin-top:20px; font-size:0.8rem; color:var(--text-muted);">Si aún no ha sido registrada por tu Director, elige la otra opción.</p>
          </div>
        </div>
        `;
    }
}

window.validarEscuelaYaRegistrada = async () => {
    const btn = event?.currentTarget;
    const inputName = document.getElementById('checkEscuelaName').value.trim();
    if(!inputName) return alert("Escriba el nombre de su escuela.");

    if(btn) { 
        btn.disabled = true; 
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando...'; 
    }

    try {
        const { data, error } = await supabaseClient.from('planteles')
            .select('*')
            .ilike('nombre', `%${inputName}%`)
            .limit(1)
            .maybeSingle();

        if(error) throw error;

        if(!data) {
            alert("⚠️ No encontramos ningún plantel con ese nombre registrado.\n\nVerifica que esté bien escrito o contacta a tu Director.");
            if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Validar y Entrar al Portal'; }
            return;
        }

        // Éxito: Guardar datos y redirigir
        state.plantelId = data.id;
        CONFIG.schoolName = data.nombre;
        localStorage.setItem('EduLM_LastPlantel', data.id);
        state.schoolConfigured = true;
        renderApp();
    } catch(e) { 
        console.error("Error Búsqueda:", e);
        alert("Error al validar: " + e.message); 
        if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Validar y Entrar al Portal'; }
    }
};


window.realizarSetupInicial = async () => {
    const btn = event?.currentTarget;
    const esc = document.getElementById('setupEscuela').value.trim();
    const dir = document.getElementById('setupDirector').value.trim();
    const cor = document.getElementById('setupCorreo').value.trim().toLowerCase();

    if(!esc || !dir || !cor) return alert("Por favor completa todos los campos.");
    if(btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';
    }

    try {
        const u = await supabaseClient.auth.getUser();
        const ownerId = u.data.user ? u.data.user.id : null;
        const slug = esc.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        // 1. Crear el Plantel en la tabla Multi-Tenant (Usamos supaAdmin para saltar RLS en setup)
        const { data: newPlantel, error: err1 } = await supaAdmin.from('planteles').insert([{
            nombre: esc, 
            slug: slug,
            owner_id: ownerId,
            primary_color: '#2563eb' // Default Blue
        }]).select().single();

        if(err1) {
            if(err1.message.includes("unique constraint")) throw new Error("Este nombre de escuela ya está en uso. Prueba con uno más específico.");
            throw err1;
        }

        // 2. Vincular al Director con el Plantel
        if(ownerId) {
            await supaAdmin.from('perfiles').upsert({
                id: ownerId,
                nombre: dir,
                rol: 'directivo', // El creador es Directivo por defecto
                plantel_id: newPlantel.id
            });
        }

        // 3. Registrar en padrón autorizado vinculado al plantel
        const { error: err2 } = await supaAdmin.from('perfiles_permitidos').upsert([{
            email: cor, 
            nombre: dir, 
            rol: 'directivo',
            plantel_id: newPlantel.id
        }], { onConflict: 'email' });
        
        if(err2) throw err2;

        CONFIG.schoolName = esc;
        state.schoolConfigured = true;
        state.plantelId = newPlantel.id;
        window.showToast("¡Plantel registrado con éxito!", "success");
        
        // Regresar a pantalla 0 para que el usuario elija "Ya tengo mi plantel" o entrar directo
        state.setupStep = 0;
        state.schoolConfigured = false;
        renderApp();
    } catch(e) { 
        alert("Error en Setup: " + e.message); 
    }
};

window.checkSchoolSetup = async () => {
    // Si startApp ya está en proceso o terminó, no interferir
    if(state.schoolConfigured !== null && state.role !== null) return;
    
    // REGLA DE ORO: Priorizar sesión REAL sobre parches locales
    const { data: { session } } = await supabaseClient.auth.getSession();
    const currentUser = session?.user;

    // Si hay un usuario que NO es el maestro, ignoramos el parche de localStorage
    const isMasterEmail = currentUser?.email === 'zlagustin10@gmail.com';
    const hasMasterPatch = localStorage.getItem('EduLM_MasterActive') === 'true';

    if(isMasterEmail || (hasMasterPatch && !currentUser)) {
        state.user = currentUser || { email: 'zlagustin10@gmail.com', user_metadata: { nombre: 'Creador' } };
        state.role = 'master';
        state.path = '/master/saas';
        state.schoolConfigured = true;
        await renderApp();
        return;
    }

    try {
        // 1. Ver si hay un usuario logueado
        if(session && session.user) {
            const { data: profile } = await supabaseClient.from('perfiles')
                .select('plantel_id, rol, nombre, planteles(id, nombre)')
                .eq('id', session.user.id)
                .maybeSingle();
            
            // SI NO HAY PERFIL O EL PLANTEL YA NO EXISTE (BORRADO)
            // Excepción v135: Si el rol es master, permitimos que no tenga plantel relacionado
            if(!profile || (profile.rol !== 'master' && !profile.planteles)) {
                console.warn(">>> [SEGURIDAD] Sesión huérfana detectada (Plantel borrado). Limpiando...");
                await supabaseClient.auth.signOut();
                state.schoolConfigured = false;
                await renderApp();
                return;
            }

            state.user = session.user;
            
            // NORMALIZACIÓN DE ROL (Unificación Total de Sinónimos)
            let normRole = profile.rol;
            if (esAdmin(normRole)) normRole = 'admin';
            // Normalizar rol

            state.role = normRole; 
            state.plantelId = profile.plantel_id;
            CONFIG.schoolName = profile.planteles.nombre || 'Mi Escuela';
            state.schoolConfigured = true;

            // DETERMINAR RUTA SEGÚN ROL RECUPERADO
            if(state.role === 'master') state.path = '/master/saas';
            else if(state.role === 'directivo') state.path = '/directivo/autorizaciones';
            else if(state.role === 'admin') state.path = '/admin/inscripcion';
            else if(state.role === 'maestro') state.path = '/maestro/aula';
            else if(state.role === 'apoyo') state.path = '/apoyo/dashboard';
            else if(state.role === 'alumno') state.path = '/alumno/credencial';

            await renderApp();
            return;
        }

        // 2. Si no hay sesión o no hay plantel, SIEMPRE mostrar la Pantalla 0 (Landing/Registro)
        state.schoolConfigured = false;
        renderApp();
    } catch(e) { 
        console.error("Setup Check Error:", e);
        state.schoolConfigured = false; 
        renderApp();
    } 
};

function renderRoleSelector() {
  // Asegurar que forzamos un reset si algo se queda trabado
  const forceLogout = `<div style="text-align:center; margin-top:24px;"><button onclick="window.logout()" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.85rem; text-decoration:underline; font-weight:500;">Limpiar Sesión Activa / Cambiar de Escuela</button></div>`;
  
  return `
    <div class="role-selector-view">
      <div class="card shadow-lg" style="width:100%; max-width:420px; padding:40px; border-radius:30px; text-align:center; animation: fadeInDown 0.5s ease-out; position:relative; z-index:100;">
        <h1 style="text-align:center; color:var(--primary); margin-bottom:8px; font-weight:900; letter-spacing:-0.03em; font-size:2.2rem;">${CONFIG.appName}</h1>
        <p style="text-align:center; color:var(--text-muted); margin-bottom:32px; font-weight:500; font-size:1.1rem;">${CONFIG.schoolName}</p>
        
        <div class="form-group" style="text-align:left;">
          <label class="form-label">Correo Electrónico Autorizado</label>
          <input type="email" id="fb-email" class="form-input" 
                 placeholder="ejemplo@escuela.edu.mx" 
                 inputmode="email" 
                 autocomplete="email" 
                 spellcheck="false"
                 style="font-size:16px; height:55px;">
        </div>

        <div id="auth-error-msg" style="color:var(--danger); font-size:0.85rem; text-align:center; min-height:20px; margin-bottom:12px; font-weight:500;"></div>

        <div style="margin-bottom:20px;">
          <button class="btn btn-primary" style="width:100%; border-radius:12px; height:60px; font-size:1.1rem; font-weight:700; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);" onclick="window.handleLogin()">
            <i class="fa-solid fa-right-to-bracket"></i> Acceder al Portal
          </button>
        </div>

        <div style="text-align:center; padding:15px; border-top:1px dashed #e2e8f0; margin-top:10px;">
           <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">¿Eres un Director nuevo?</p>
           <button class="btn btn-sm btn-outline" style="border-radius:20px; color:var(--primary); border-color:var(--primary); font-weight:700; width:100%;" onclick="state.schoolConfigured = false; state.setupStep = 1; renderApp();">
             <i class="fa-solid fa-plus-circle"></i> Registrar mi Plantel aquí
           </button>
        </div>

        ${forceLogout}
      </div>
    </div>
        `;
}

window.handleMagicLink = async () => {
    const email = document.getElementById('fb-email').value.trim();
    if(!email) return alert("Escribe tu correo primero.");
    
    const errDiv = document.getElementById('auth-error-msg');
    try {
        const { error } = await supabaseClient.from('perfiles_permitidos')
            .select('email').eq('email', email).maybeSingle();
        
        // Excepción Maestra: zlagustin10@gmail.com puede entrar aunque no esté en una escuela
        if (email !== 'zlagustin10@gmail.com' && (!error)) {
             // Si el correo no está permitido, le avisamos
             const { data: check } = await supabaseClient.from('perfiles_permitidos').select('email').eq('email', email).maybeSingle();
             if(!check) return alert("Este correo no tiene acceso autorizado a este plantel.");
        }

        const { error: authError } = await supabaseClient.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin }
        });
        
        if(authError) throw authError;
        alert("¡Enlace enviado! Revisa tu bandeja de entrada (y la carpeta de Spam) para iniciar sesión.");
    } catch(e) {
        errDiv.innerText = e.message;
    }
};

function renderSidebar() {
  // Mapeo seguro de roles (Sinonimia Total: admin/admin/administrativo -> admin)
  let userRole = state.role || 'alumno';
  if (esAdmin(userRole)) userRole = 'admin';
  if (userRole === 'maestro') userRole = 'maestro';

  const menus = {
    master: [
      { name: 'Administración SaaS', path: '/master/saas', icon: 'fa-globe' },
    ],
    admin: [
      { name: 'Inscripción', path: '/admin/inscripcion', icon: 'fa-user-plus' },
      { name: 'Boletas y Calificaciones', path: '/admin/calificaciones', icon: 'fa-star-half-stroke' },
      { name: 'Expediente Digital', path: '/admin/expediente', icon: 'fa-folder-open' },
      { name: 'Grupos y Asignación', path: '/admin/grupos', icon: 'fa-users-gear' },
      { name: 'Maestros y Materias', path: '/admin/maestros', icon: 'fa-chalkboard-user' },
      { name: 'Trámites y Constancias', path: '/admin/tramites', icon: 'fa-file-signature' },
      { name: 'Horarios de Clase', path: '/admin/horarios', icon: 'fa-calendar-days' },
      { name: 'Comunicados Oficiales', path: '/admin/comunicados', icon: 'fa-bullhorn' },
    ],
    maestro: [
      { name: 'Gestión de Aula y Pase de Lista', path: '/maestro/aula', icon: 'fa-users-rectangle' },
      { name: 'Actividades', path: '/maestro/actividades', icon: 'fa-clipboard-list' },
      { name: 'Listas y Seguimiento', path: '/maestro/listas', icon: 'fa-list-check' },
      { name: 'Encuadre', path: '/maestro/encuadre', icon: 'fa-sliders' },
      { name: 'Subir Calificaciones', path: '/maestro/calificaciones', icon: 'fa-cloud-arrow-up' },
      { name: 'Bitácora de Maestro', path: '/maestro/bitacora', icon: 'fa-book-journal-whills' },
      { name: 'Avisos Oficiales', path: '/maestro/comunicados', icon: 'fa-bullhorn' },
    ],
    apoyo: [
      { name: 'Focos Rojos', path: '/apoyo/dashboard', icon: 'fa-triangle-exclamation' },
      { name: 'Reportes Escolares', path: '/apoyo/reportes', icon: 'fa-file-signature' },
      { name: 'Expediente Salud', path: '/apoyo/salud', icon: 'fa-notes-medical' },
      { name: 'Bitácora Diaria', path: '/apoyo/bitacora', icon: 'fa-book-journal-whills' },
      { name: 'Prefectura (Escáner)', path: '/apoyo/prefectura', icon: 'fa-qrcode' },
      { name: 'Avisos Oficiales', path: '/apoyo/comunicados', icon: 'fa-bullhorn' },
    ],
    directivo: [
      { name: 'Boletas y Calificaciones', path: '/admin/calificaciones', icon: 'fa-star-half-stroke' },
      { name: 'Autorizaciones', path: '/directivo/autorizaciones', icon: 'fa-stamp' },
      { name: 'Gestión de Personal', path: '/directivo/gestion-personal', icon: 'fa-id-card-clip' },
      { name: 'Avisos Oficiales', path: '/apoyo/comunicados', icon: 'fa-bullhorn' }
    ],
    alumno: [
      { name: 'Credencial Digital', path: '/alumno/credencial', icon: 'fa-id-card' },
      { name: 'Boletas y Calificaciones', path: '/alumno/boletas', icon: 'fa-star-half-stroke' },
      { name: 'Avisos y Timeline', path: '/alumno/timeline', icon: 'fa-bell' },
      { name: 'Mi Horario', path: '/alumno/horario', icon: 'fa-calendar-days' },
      { name: 'Trámites Escolares', path: '/alumno/tramites', icon: 'fa-file-pdf' },
    ]
  };


  // Protección: Si el rol no existe en el menú, usar Alumno por defecto
  const menuList = menus[userRole] ? [...menus[userRole]] : [...menus['alumno']];

  const navItems = menuList.map(item => `
    <a class="nav-item ${state.path === item.path ? 'active' : ''}" onclick="window.navigate('${item.path}')">
      <i class="fa-solid ${item.icon} w-5 text-center"></i>
      <span>${item.name}</span>
    </a>
  `).join('');

  const roleNames = { master: 'Creador del Sistema', admin: 'Admin', directivo: 'Directivo', maestro: 'Maestro', apoyo: 'Trabajo Social', alumno: 'Estudiante', admin: 'Admin', administrativo: 'Admin' };

  const userName = (state.user?.email === 'zlagustin10@gmail.com') ? 'M.C Luis Miguel Ponce Herrera' : (state.userName || state.user?.user_metadata?.nombre || state.user?.email || 'Usuario');
  const shortName = (state.user?.email === 'zlagustin10@gmail.com') ? 'Luis Miguel' : userName.split(' ').slice(0, 2).join(' ');

  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo-icon"><i class="fa-solid fa-graduation-cap"></i></div>
        <div>
          <div class="sidebar-title">${CONFIG.appName}</div>
          <div class="sidebar-subtitle" style="margin-bottom: 5px;">${CONFIG.schoolName}</div>
          <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 155px;" title="${userName}">
             <i class="fa-solid fa-circle-user" style="margin-right: 4px;"></i>${shortName}
          </div>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${navItems}
      </nav>
      <div class="profile-switcher">
        <div class="profile-card" onclick="window.logout()">
          <div class="profile-avatar"><i class="fa-solid fa-user"></i></div>
          <div class="profile-info">
            <h4>Perfil ${roleNames[userRole] || 'Usuario'}</h4>
            <p>Cerrar Sesión</p>
          </div>
        </div>
        
      </div>
    </aside>
  `;
}

// ========================
// ADMIN PAGES
// ========================
function renderAdminInscripcion() {
  return `
    <div class="page-header">
      <h2 class="page-title">Nueva Inscripción</h2>
      <p class="page-subtitle">Genera el expediente y código QR automático del estudiante.</p>
    </div>
    <div class="inscripcion-grid">
      <div class="card">
        <h3 style="margin-bottom: 20px;">Datos del Alumno</h3>
        
        <div class="form-group">
          <label class="form-label">CURP (Manual)</label>
          <input type="text" class="form-input" id="curp" placeholder="Ingrese CURP...">
        </div>
        <div class="form-group">
          <label class="form-label">Nombre Completo</label>
          <input type="text" class="form-input" id="nombre" placeholder="Nombre completo...">
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Edad (Años)</label>
            <input type="number" id="edad" class="form-input" placeholder="Ej. 13" min="5" max="25">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Sexo</label>
            <select id="sexo" class="form-select">
               <option value="H">Hombre</option>
               <option value="M">Mujer</option>
            </select>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Estatura (Mts)</label>
            <input type="number" id="estatura" class="form-input" placeholder="1.65" step="0.01">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Peso (Kg)</label>
            <input type="number" id="peso" class="form-input" placeholder="55.5" step="0.1">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Talla Zapato</label>
            <input type="text" id="tallaZapato" class="form-input" placeholder="25.5">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Correo Electrónico (Acceso Alumno)</label>
          <input type="email" class="form-input" id="contactoAcceso" placeholder="alumno@correo.com">
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Estas credenciales servirán como usuario único para que inicie sesión en la plataforma y conectarlo con la Matrícula.</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="form-group">
            <label class="form-label">Grado</label>
            <select id="gradoInput" class="form-select" onchange="window.updateTecnologiasFiltro ? window.updateTecnologiasFiltro() : null">
               <option value="1°">1°</option>
               <option value="2°">2°</option>
               <option value="3°">3°</option>
               <option value="4°">4°</option>
               <option value="5°">5°</option>
               <option value="6°">6°</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Grupo</label>
            <select id="grupoInput" class="form-select">
               <option value="A">A</option>
               <option value="B">B</option>
               <option value="C">C</option>
               <option value="D">D</option>
               <option value="E">E</option>
               <option value="F">F</option>
               <option value="G">G</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label class="form-label" style="color:var(--primary); font-weight:600;"><i class="fa-solid fa-microchip"></i> Asignación de Tecnología</label>
          <select id="tallerInput" class="form-select" style="border-color:var(--primary-light);">
             <option value="">Selecciona grado para ver tecnologías...</option>
          </select>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">La tecnología se carga automáticamente desde las asignaciones de los maestros.</p>
        </div>

        <button class="btn btn-success btn-lg" style="width: 100%; margin-top:20px;" id="btnGuardarAlumno">
          <i class="fa-solid fa-user-check"></i> Finalizar Inscripción y Generar QR
        </button>
      </div>
    <div class="card" style="grid-column: 1 / -1; margin-top:24px;">
       <h3 style="margin-bottom:8px">Gestión de Alumnos Existentes</h3>
       <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">Busca un alumno para darlo de baja o promoverlo de grado.</p>
       <div class="form-group" style="position:relative">
          <input type="text" id="inBuscarGestionGral" class="form-input" placeholder="Buscar por nombre o matrícula..." onkeyup="window.liveSearchGestion(this.value)">
          
          <div id="resGestionGral" style="display:none; position:absolute; top:45px; left:0; right:0; background:white; border:1px solid var(--border); border-radius:8px; z-index:100; box-shadow:0 10px 25px rgba(0,0,0,0.1); max-height:300px; overflow-y:auto;"></div>
       </div>
    </div>

    <!-- Promoción Masiva -->
    <div class="card" style="grid-column: 1 / -1; margin-top:16px; border-left: 5px solid var(--success);">
       <h3 style="margin-bottom:8px">Promoción Masiva por Grupo</h3>
       <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">Mueve a todos los alumnos de un grupo al siguiente grado/grupo de forma inmediata.</p>
       
       <div style="display:grid; grid-template-columns: 1fr 1fr auto 1fr 1fr; gap:12px; align-items:end;">
          <div class="form-group" style="margin:0">
             <label style="font-size:0.7rem; color:var(--text-muted);">Grado Actual</label>
             <input type="text" id="promSourceGrado" class="form-input" list="gradoList" placeholder="1°" style="padding:6px">
          </div>
          <div class="form-group" style="margin:0">
             <label style="font-size:0.7rem; color:var(--text-muted);">Grupo Actual</label>
             <input type="text" id="promSourceGrupo" class="form-input" placeholder="A" style="padding:6px">
          </div>
          <div style="padding-bottom:10px; color:var(--text-muted);"><i class="fa-solid fa-arrow-right"></i></div>
          <div class="form-group" style="margin:0">
             <label style="font-size:0.7rem; color:var(--text-muted);">Nuevo Grado</label>
             <input type="text" id="promTargetGrado" class="form-input" list="gradoList" placeholder="2°" style="padding:6px">
          </div>
          <div class="form-group" style="margin:0">
             <label style="font-size:0.7rem; color:var(--text-muted);">Nuevo Grupo</label>
             <input type="text" id="promTargetGrupo" class="form-input" placeholder="A" style="padding:6px">
          </div>
       </div>
       <datalist id="gradoList"><option value="1°"></option><option value="2°"></option><option value="3°"></option><option value="4°"></option><option value="5°"></option><option value="6°"></option></datalist>
       <button class="btn btn-success" style="width:100%; margin-top:16px;" onclick="window.ejecutarPromocionMasiva()">
          <i class="fa-solid fa-users-gear"></i> Ejecutar Promoción del Grupo Completo
       </button>
    </div>

    <!-- Graduación / Baja Masiva -->
    <div class="card" style="grid-column: 1 / -1; margin-top:16px; border-left: 5px solid var(--danger); background: #fffcfc;">
       <h3 style="margin-bottom:8px; color:var(--danger)">Graduación / Baja Masiva de Grado</h3>
       <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">Usa esta opción únicamente para graduar a una generación. Eliminará a TODOS los alumnos del grado seleccionado de la base de datos de forma permanente.</p>
       
       <div style="display:flex; gap:12px; align-items:end;">
          <div class="form-group" style="margin:0; flex:1">
             <label style="font-size:0.7rem; color:var(--text-muted);">Grado a Graduar (ej: 6°)</label>
             <input type="text" id="gradoGraduacion" class="form-input" placeholder="6°" style="padding:6px">
          </div>
          <button class="btn" style="background:var(--danger); color:white; flex:1" onclick="window.graduarGeneracion()">
             <i class="fa-solid fa-graduation-cap"></i> Confirmar Graduación Masiva
          </button>
       </div>
    </div>
  `;
}

window.ejecutarPromocionMasiva = async () => {
    console.log("Iniciando promoción masiva...");
    let sGrado = document.getElementById('promSourceGrado').value.trim();
    let sGrupo = document.getElementById('promSourceGrupo').value.trim();
    let tGrado = document.getElementById('promTargetGrado').value.trim();
    let tGrupo = document.getElementById('promTargetGrupo').value.trim();

    if(!sGrado || !sGrupo || !tGrado || !tGrupo) return alert('Por favor completa todos los campos de origen y destino.');

    // Búsqueda flexible reconstruyendo el nombre oficial en cualquier caso
    const formatearGrupo = (grado, grupo) => {
        let g = grado.replace(/[^0-9]/g, ''); // Extraer solo el número
        let l = grupo.replace(/[^a-zA-Z]/g, '').toUpperCase(); // Extraer solo la letra
        return `${g}°${l}`; // Forzar el formato oficial: "1°A"
    };

    const sourceNom = formatearGrupo(sGrado, sGrupo);
    const targetNom = formatearGrupo(tGrado, tGrupo);
    
    // Forzar el formato del nuevo grado para la BDD (solo el número + el símbolo)
    tGrado = tGrado.replace(/[^0-9]/g, '') + '°';

    if(!confirm(`¿Deseas ejecutar AHORA la promoción de TODOS los alumnos de ${sourceNom} a ${targetNom}?`)) return;

    try {
        console.log(`[Promoción] Buscando grupo origen oficial: ${sourceNom}`);
        
        // Búsqueda más permisiva: ilike
        const { data: sData, error: sError } = await supaAdmin.from('grupos').select('id').ilike('nombre', sourceNom).maybeSingle();
        if(sError) throw sError;
        
        if(!sData) {
            return alert(`Atención: NO se encontró ningún grupo llamado "${sourceNom}" en el catálogo del sistema. Verifica la escritura.`);
        }

        console.log(`[Promoción] Buscando/Creando grupo destino: ${targetNom}`);
        let targetId;
        const { data: tData, error: tError } = await supaAdmin.from('grupos').select('id').ilike('nombre', targetNom).maybeSingle();
        if(tError) throw tError;
        
        if(tData) {
            targetId = tData.id;
        } else {
            console.log(`[Promoción] Creando nuevo grupo: ${targetNom}`);
            const { data: nG, error: errInsert } = await supaAdmin.from('grupos').insert([{ nombre: targetNom, plantel_id: state.plantelId }]).select().single();
            if(errInsert) throw errInsert;
            targetId = nG.id;
        }

        console.log(`[Promoción] Verificando padrón del ID Origen ${sData.id}`);
        // 1. Contar cuántos alumnos hay REALMENTE en ese momento en la base de datos
        const { data: qAlumnos, error: errExist } = await supaAdmin.from('alumnos').select('id, nombre').eq('grupo_id', sData.id);
        if(errExist) throw errExist;
        
        const numUpdated = qAlumnos ? qAlumnos.length : 0;

        if(numUpdated === 0) {
            alert(`[VERSIÓN V105] ⚠️ Aviso: Se encontraron 0 alumnos en el grupo ${sourceNom}.\n\n(Info técnica: ID Origen = ${sData.id}).\nSi usted está seguro de que hay alumnos en este grupo, significa que los alumnos guardados en su pantalla tienen un ID de grupo dañado o no están guardados en la tabla oficial.`);
            return;
        }

        console.log(`[Promoción] Actualizando alumnos de ID Origen ${sData.id} al ID Destino ${targetId}`);
        
        // 2. Ejecutar la actualización masiva
        const { error: errUpdate } = await supaAdmin.from('alumnos')
            .update({ grupo_id: targetId, grado: tGrado })
            .eq('grupo_id', sData.id);
            
        if(errUpdate) throw errUpdate;
        
        alert(`✅ ¡Éxito! Se han promovido ${numUpdated} alumnos de ${sourceNom} a ${targetNom}.\n\nListado promovido:\n${qAlumnos.map(a => '• ' + a.nombre).join('\\n')}`);
        
        // Limpiar campos solo si hubo éxito
        document.getElementById('promSourceGrado').value = '';
        document.getElementById('promSourceGrupo').value = '';
        document.getElementById('promTargetGrado').value = '';
        document.getElementById('promTargetGrupo').value = '';
        
        // Refrescar vistas si están activas
        if(typeof window.liveSearchGestion === 'function') {
            const currentSearch = document.getElementById('inBuscarGestionGral')?.value;
            if(currentSearch && currentSearch.length >= 2) window.liveSearchGestion(currentSearch);
        }
        if(typeof window.loadAlumnosInscritos === 'function') window.loadAlumnosInscritos();

    } catch(e) { 
        console.error("Error crítico en promoción masiva:", e); 
        alert('Error técnico en el proceso: ' + e.message); 
    }
};

window.graduarGeneracion = async () => {
    console.log("Iniciando graduación...");
    const grado = document.getElementById('gradoGraduacion').value.trim();
    if(!grado) return alert('Por favor indica el grado que se va a graduar.');

    if(!confirm(`⚠️ ¿Deseas ELIMINAR AHORA a todos los alumnos de ${grado}°? Esta acción es irreversible.`)) return;
    
    const confirmacionExtra = prompt(`Escribe "GRADUAR" para confirmar la baja masiva:`);
    if(confirmacionExtra !== 'GRADUAR') return;

    try {
        const { data: grps } = await supabaseClient.from('grupos').select('id').ilike('nombre', `${grado}%`);
        if(!grps || grps.length === 0) throw new Error("No se encontraron grupos para ese grado.");
        
        const ids = grps.map(g => g.id);
        
        // Obtener correos para limpiar perfiles permitidos (opcional pero recomendado)
        const { data: grads } = await supabaseClient.from('alumnos').select('contacto_email').in('grupo_id', ids);
        
        const { error: errDel } = await supabaseClient.from('alumnos').delete().in('grupo_id', ids);
        if(errDel) throw errDel;
        
        if(grads && grads.length > 0) {
            const emails = grads.map(g => g.contacto_email).filter(Boolean);
            if(emails.length > 0) {
                await supabaseClient.from('perfiles_permitidos').delete().in('email', emails);
            }
        }

        alert(`¡Generación Graduada! Se han eliminado los registros de ${grado}°.`);
        document.getElementById('gradoGraduacion').value = '';
    } catch(e) { console.error(e); alert('Error en graduación: ' + e.message); }
};

window.liveSearchGestion = async (q) => {
    const res = document.getElementById('resGestionGral');
    if(!res) return;
    if(q.length < 2) { res.style.display='none'; return; }
    try {
        const { data } = await supabaseClient.from('alumnos').select('*, grupos(nombre)').or(`nombre.ilike.%${q}%,matricula.ilike.%${q}%`).limit(50);
        if(!data || data.length === 0) { res.innerHTML='<p style="padding:10px; color:var(--text-muted)">Sin resultados</p>'; res.style.display='block'; return; }
        res.style.display='block';
        res.innerHTML = data.map(a => `
            <div style="padding:12px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
               <div>
                  <div style="font-weight:600; color:var(--text-main)">${a.nombre}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted)">${a.matricula} • ${a.grupos ? a.grupos.nombre : 'Sin Grupo'}</div>
               </div>
               <div style="display:flex; gap:8px;">
                  <button class="btn btn-sm btn-outline" style="color:var(--primary); border-color:var(--primary)" onclick="window.promoverGradoAlumno('${a.id}')" title="Promover de Grado"><i class="fa-solid fa-arrow-up"></i></button>
                  <button class="btn btn-sm" style="background:#fff1f0; color:var(--danger); border:1px solid #ffa39e" onclick="window.darDeBajaAlumno('${a.id}', '${a.nombre}')" title="Dar de Baja"><i class="fa-solid fa-user-minus"></i></button>
               </div>
            </div>
        `).join('');
    } catch(e) { console.error(e); }
}

window.darDeBajaAlumno = async (id, nombre) => {
    if(!confirm(`¿Deseas dar de BAJA DEFINITIVA a ${nombre}?`)) return;
    try {
        const { data: alu } = await supabaseClient.from('alumnos').select('contacto_email').eq('id', id).single();
        const { error } = await supabaseClient.from('alumnos').delete().eq('id', id);
        if(error) throw error;
        
        if(alu && alu.contacto_email) {
            await supabaseClient.from('perfiles_permitidos').delete().eq('email', alu.contacto_email);
        }

        alert('Alumno dado de baja exitosamente.');
        document.getElementById('resGestionGral').style.display='none';
        document.getElementById('inBuscarGestionGral').value = '';
    } catch(e) { console.error(e); alert('Error al borrar: ' + e.message); }
}

window.promoverGradoAlumno = async (id) => {
    const nuevoGrado = prompt('Ingresa el nuevo GRADO (ej. 2°, 3°):');
    if(!nuevoGrado) return;
    const nuevoGrupo = prompt('Ingresa el nuevo GRUPO (ej. A, B, C):');
    if(!nuevoGrupo) return;
    
    const nombreCompletoGrupo = `${nuevoGrado}${nuevoGrupo}`;

    try {
        // 1. Buscar o crear el grupo
        let grId;
        const { data: gData } = await supabaseClient.from('grupos').select('id').eq('nombre', nombreCompletoGrupo).maybeSingle();
        if(gData) {
           grId = gData.id;
        } else {
           const { data: nG, error: eG } = await supabaseClient.from('grupos').insert([{ nombre: nombreCompletoGrupo, plantel_id: state.plantelId }]).select().single();
           if(eG) throw eG;
           grId = nG.id;
        }

        // 2. Actualizar el grupo_id del alumno (La credencial se actualiza sola al recargar por el JOIN)
        const { error } = await supabaseClient.from('alumnos').update({ grupo_id: grId }).eq('id', id);
        if(error) throw error;

        alert(`Alumno promovido exitosamente a ${nombreCompletoGrupo}. La credencial digital ya refleja este cambio.`);
        document.getElementById('resGestionGral').style.display='none';
        document.getElementById('inBuscarGestionGral').value = '';
    } catch(e) { console.error(e); alert('Error: ' + e.message); }
}

function renderAdminExpediente() {
  return `
    <div class="page-header">
      <h2 class="page-title">Expediente Digital</h2>
      <p class="page-subtitle">Gestión y consulta de documentos oficiales del estudiante.</p>
    </div>


    
    <div class="card" style="margin-bottom: 24px; position: relative;">
       <div class="form-group" style="margin: 0; display:flex; gap:16px; align-items:center;">
         <div style="flex:1">
             <label class="form-label">Buscar Alumno</label>
             <input type="text" id="inBuscarExpediente" class="form-input" placeholder="Ingresa matrícula o nombre..." autocomplete="off">
         </div>
       </div>
       
       <div id="resBuscadorExpediente" style="display:none; position:absolute; top:85px; left:20px; right:20px; background:var(--surface); border:1px solid var(--border); border-radius:8px; z-index:10; padding:10px; max-height:200px; overflow-y:auto; box-shadow:0 4px 12px rgba(0,0,0,0.1)">
          <!-- Resultados dinámicos de búsqueda -->
       </div>
    </div>
    
    <div id="panelExpedienteAlumno" style="display:none; animation: fadeIn 0.3s">
        <h3 id="tituloExpediente" style="margin-bottom: 16px; color: var(--primary);">Documentos Oficiales</h3>
        <!-- Atributos persistentes para evitar errores de extraccion -->
        <input type="hidden" id="currentExpedienteAlumnoId" value="">
        <input type="hidden" id="currentExpedienteNombre" value="">
        <input type="hidden" id="currentExpedienteMatricula" value="">
        
        <div class="doc-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <!-- Acta de Nacimiento -->
          <div class="doc-card" id="card-acta">
            <input type="file" id="file-acta" accept="application/pdf" style="display:none" onchange="window.uploadExpedienteDoc(this, 'acta')">
            <i class="fa-solid fa-address-card doc-icon" style="font-size: 32px; margin-bottom: 4px;"></i>
            <h4 style="font-size: 0.9rem; margin-bottom: 4px;">Acta de Nacimiento</h4>
            <div id="badge-acta" class="badge" style="margin-bottom:8px; background:var(--page-bg); color:var(--text-muted); font-size: 0.65rem;">Pendiente</div>
            <div class="doc-actions" style="display:flex; flex-direction:column; gap:6px; width:100%; margin-top: auto;">
                <button class="btn btn-primary btn-xs btn-doc" onclick="document.getElementById('file-acta').click()" style="width: 100%"><i class="fa-solid fa-upload"></i> Subir PDF</button>
                <div id="ver-acta-container" style="display:none; gap:6px; width: 100%;">
                    <a id="btn-ver-acta" href="#" target="_blank" class="btn btn-outline btn-xs" style="flex:1"><i class="fa-solid fa-eye"></i> Ver</a>
                    <button id="btn-del-acta" class="btn btn-outline btn-xs" style="flex:1; border-color:var(--danger); color:var(--danger)"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
          </div>
          
          <!-- CURP -->
          <div class="doc-card" id="card-curp">
            <input type="file" id="file-curp" accept="application/pdf" style="display:none" onchange="window.uploadExpedienteDoc(this, 'curp')">
            <i class="fa-solid fa-file-invoice doc-icon" style="font-size: 32px; margin-bottom: 4px;"></i>
            <h4 style="font-size: 0.9rem; margin-bottom: 4px;">CURP Oficial</h4>
            <div id="badge-curp" class="badge" style="margin-bottom:8px; background:var(--page-bg); color:var(--text-muted); font-size: 0.65rem;">Pendiente</div>
            <div class="doc-actions" style="display:flex; flex-direction:column; gap:6px; width:100%; margin-top: auto;">
                <button class="btn btn-primary btn-xs btn-doc" onclick="document.getElementById('file-curp').click()" style="width: 100%"><i class="fa-solid fa-upload"></i> Subir PDF</button>
                <div id="ver-curp-container" style="display:none; gap:6px; width: 100%;">
                    <a id="btn-ver-curp" href="#" target="_blank" class="btn btn-outline btn-xs" style="flex:1"><i class="fa-solid fa-eye"></i> Ver</a>
                    <button id="btn-del-curp" class="btn btn-outline btn-xs" style="flex:1; border-color:var(--danger); color:var(--danger)"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
          </div>
          
          <!-- Certificado -->
          <div class="doc-card" id="card-certificado">
            <input type="file" id="file-certificado" accept="application/pdf" style="display:none" onchange="window.uploadExpedienteDoc(this, 'certificado')">
            <i class="fa-solid fa-award doc-icon" style="font-size: 32px; margin-bottom: 4px;"></i>
            <h4 style="font-size: 0.9rem; margin-bottom: 4px;">Certificado Previo</h4>
            <div id="badge-certificado" class="badge" style="margin-bottom:8px; background:var(--page-bg); color:var(--text-muted); font-size: 0.65rem;">Pendiente</div>
            <div class="doc-actions" style="display:flex; flex-direction:column; gap:6px; width:100%; margin-top: auto;">
                <button class="btn btn-primary btn-xs btn-doc" onclick="document.getElementById('file-certificado').click()" style="width: 100%"><i class="fa-solid fa-upload"></i> Subir PDF</button>
                <div id="ver-certificado-container" style="display:none; gap:6px; width: 100%;">
                    <a id="btn-ver-certificado" href="#" target="_blank" class="btn btn-outline btn-xs" style="flex:1"><i class="fa-solid fa-eye"></i> Ver</a>
                    <button id="btn-del-certificado" class="btn btn-outline btn-xs" style="flex:1; border-color:var(--danger); color:var(--danger)"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
          </div>
          
          <!-- Boletas (MULTIPLE) -->
          <div class="doc-card" id="card-boleta" style="border: 2px dashed var(--primary-light); background: var(--surface-hover); min-height: 250px;">
            <input type="file" id="file-extra" accept="application/pdf" style="display:none" onchange="window.uploadExpedienteDoc(this, 'boleta')">
            <i class="fa-solid fa-file-signature doc-icon" style="font-size: 32px; margin-bottom: 4px;"></i>
            <h4 style="font-size: 0.9rem; margin-bottom: 4px;">Boletines y Evaluaciones</h4>
            <div id="badge-boleta" class="badge" style="margin-bottom:8px; background:transparent; color: var(--text-muted); font-size: 0.65rem;">Historial de evaluaciones</div>
            <div class="doc-actions" style="display:flex; flex-direction:column; gap:6px; width:100%; margin-top: auto;">
                <button class="btn btn-primary btn-xs btn-doc" onclick="document.getElementById('file-extra').click()" style="width: 100%"><i class="fa-solid fa-plus"></i> Nueva Boleta</button>
                <div id="listado-boletas" style="width: 100%; max-height: 120px; overflow-y: auto; margin-top:4px; border-top:1px solid var(--border); padding-top:4px;">
                    <!-- Los archivos se listarán aquí dinámicamente -->
                </div>
            </div>
          </div>
        </div>
    </div>
  `;
}

function renderAdminGrupos() {
  setTimeout(() => {
    if(window.initEventosAdminGrupos) window.initEventosAdminGrupos();
    if(window.loadSelectsMaestros) window.loadSelectsMaestros();
  }, 300);

  return `
    <div class="page-header">
      <h2 class="page-title">Grupos y Asignación</h2>
      <p class="page-subtitle">Crea grupos y asígnalos directamente al plantel maestro.</p>
    </div>
    <div style="display:flex; gap:24px;">
      
      <!-- Panel de Creación de Grupos -->
      <div class="card" style="flex: 0 0 320px; align-self: flex-start;">
        <h3 style="margin-bottom: 16px;">Nuevo Grupo</h3>
        <div class="form-group">
          <label class="form-label">Grado Escolar</label>
          <input type="text" id="selGrado" class="form-input" list="gradoList" placeholder="Ej: 1°" value="1°">
          <datalist id="gradoList"><option value="1°"></option><option value="2°"></option><option value="3°"></option><option value="4°"></option><option value="5°"></option><option value="6°"></option></datalist>
        </div>
        <div class="form-group">
          <label class="form-label">Letra del Grupo</label>
          <input type="text" id="selLetra" class="form-input" list="letraList" placeholder="Ej: A" value="A">
          <datalist id="letraList"><option value="A"></option><option value="B"></option><option value="C"></option><option value="D"></option><option value="E"></option><option value="F"></option><option value="G"></option></datalist>
        </div>
        <button class="btn btn-outline" style="width: 100%; margin-bottom: 16px; border-color:var(--primary)" onclick="window.crearGrupoDrag()">
           <i class="fa-solid fa-plus"></i> Generar Tarjeta de Grupo
        </button>
        <div id="gruposCreados" style="display:flex; flex-direction:column; gap:8px;"></div>
      </div>

      <!-- Panel de Maestros y Asignación -->
      <div style="flex:1;">
        <div class="card" style="padding:16px;">
           <h3 style="margin-bottom:16px"><i class="fa-solid fa-users-viewfinder text-primary"></i> 2. Asignar Maestro a Grupos Creados</h3>
           <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">Selecciona el maestro previamente registrado, su materia, y enlaza el grupo deseado permanentemente.</p>
           
           <div class="form-group">
             <label class="form-label">Maestro Objetivo</label>
             <select id="selAsigMaestroBase" class="form-input">
                <option value="">Cargando maestros...</option>
             </select>
           </div>
           
           <div class="form-group">
             <label class="form-label">Materia Específica</label>
             <select id="selAsigMateriaBase" class="form-input">
                <option value="">Selecciona al maestro primero...</option>
             </select>
           </div>
           
           <div class="form-group">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <label class="form-label" id="lblAsigAmbito">Vincular con Grupo Existente</label>
                <label style="font-size:0.75rem; color:var(--primary); cursor:pointer; display:flex; align-items:center; gap:4px;">
                  <input type="checkbox" id="chkForzarTecnologia" onchange="window.toggleModoTecnologiaManual(this.checked)"> ¿Es Tecnología / Taller?
                </label>
              </div>
              <div id="wrapperAsigGrupo">
                <!-- Selector para materias normales -->
                <select id="selAsigGrupoBase" class="form-input">
                   <option value="">Cargando grupos...</option>
                </select>
                <!-- Selector para tecnologías (solo grado) -->
                <select id="selAsigGradoBase" class="form-input" style="display:none; border-color:var(--primary);">
                   <option value="">Selecciona el Grado Escolar</option>
                   <option value="1°">1° Grado (Toda la Tecnología)</option>
                   <option value="2°">2° Grado (Toda la Tecnología)</option>
                   <option value="3°">3° Grado (Toda la Tecnología)</option>
                </select>
                <p id="msgFiltroTecnologia" style="display:none; font-size:0.75rem; color:var(--primary); margin-top:4px;">
                  <i class="fa-solid fa-microchip"></i> <strong>Modo Tecnología Activo:</strong> Se asignará a todos los alumnos del grado seleccionado.
                </p>
              </div>
            </div>
           
           <button class="btn btn-primary" id="btnCrearAsignacionGrupoMaestro" style="width:100%">
             <i class="fa-solid fa-link"></i> Consolidar Asignación de Grupo
           </button>
           
           <div style="margin-top:24px; border-top:1px solid var(--border); padding-top:16px;">
             <h4>Resumen de Asignaciones (Tiempo Real)</h4>
             <ul id="listaGruposMaestro" style="font-size:0.85rem; color:var(--text-muted); padding-left:16px; margin-top:8px;">
                <li>Selecciona un maestro para ver sus grupos asignados actualmente.</li>
             </ul>
           </div>
        </div>
      </div>

    </div>
  `;
}

// ========================
// ADMIN PAGES - EXTENDED (CALIFICACIONES Y TRAMITES)
// ========================

function renderAdminCalificaciones() {
  setTimeout(() => { if (window.loadAdminCalificacionesFiltros) window.loadAdminCalificacionesFiltros(); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Monitor Curricular y Boletas</h2>
      <p class="page-subtitle">Revisión de avance de subida de calificaciones oficiales, y despliegue del concentrado por grupo que los maestros ya enviaron.</p>
    </div>

    <div style="display:flex; gap:24px; flex-wrap:wrap;">
      <div class="card" style="flex:1; min-width:320px; align-self: flex-start;">
         <h3 style="margin-bottom:12px">Filtros de Búsqueda</h3>
         <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">Selecciona un trimestre y el grupo para cargar las sábanas de calificaciones recopiladas.</p>
         <div class="form-group">
            <label class="form-label">Trimestre</label>
            <select class="form-select" id="adminTrimestreSel" onchange="window.cargarSabanaGrupo()">
                <option value="Trimestre 1">Trimestre 1</option>
                <option value="Trimestre 2">Trimestre 2</option>
                <option value="Trimestre 3">Trimestre 3</option>
            </select>
         </div>
         <div class="form-group">
            <label class="form-label">Grado y Grupo</label>
            <select class="form-select" id="adminGrupoSel" onchange="window.cargarSabanaGrupo()">
               <option value="">Cargando grupos...</option>
            </select>
         </div>
      </div>
      
      <!-- Nuevo Bloque: Revisión Detallada por Grupo -->
      <div class="card" style="flex:3; min-width:400px; width: 100%;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:16px;">
          <h3 style="margin:0;">Concentrado de Calificaciones Consolidadas</h3>
        </div>
        <div style="overflow-x:auto;" id="adminCalificacionesTablaHolder">
           <div style="color:var(--text-muted); font-size:0.9rem;">
              Seleccione un grupo y trimestre en los filtros de la izquierda...
           </div>
        </div>
        <div style="text-align:right; margin-top:24px; border-top:1px solid var(--border); padding-top:16px; display:flex; justify-content:flex-end; gap:12px;">
           <button id="btnNotifBoletas" class="btn btn-primary btn-outline" style="display:none;" onclick="window.notificarRevisionSabana()">
              <i class="fa-solid fa-bell"></i> Notificar a los Padres
           </button>
           <button class="btn btn-success" style="border-color:var(--success); color:white;" onclick="window.exportarSabanaCalificaciones()">
              <i class="fa-solid fa-file-excel"></i> Descargar Sábana (CSV/Excel)
           </button>
        </div>
      </div>
    </div>
  `;
}

function renderAdminTramites() {
  setTimeout(() => { 
    if(window.loadTramitesAdmin) window.loadTramitesAdmin(); 
  }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Trámites y Constancias Oficiales</h2>
      <p class="page-subtitle">Atención de requerimientos del alumnado desde control escolar, emisión de constancias con sello digital SEP.</p>
    </div>

    <div style="display:flex; flex-direction:column; gap:20px;">
      <!-- Selector de Vista -->
      <div style="display:flex; gap:10px; background:var(--surface); padding:4px; border-radius:12px; border:1px solid var(--border); width:fit-content; margin-bottom:10px;">
         <button id="btnTabPendientes" class="btn btn-primary" onclick="window.switchTramiteView('pendientes')" style="border-radius:10px; padding:8px 20px;">
            <i class="fa-solid fa-clock"></i> Pendientes
         </button>
         <button id="btnTabHistorial" class="btn btn-outline" onclick="window.switchTramiteView('historial')" style="border-radius:10px; padding:8px 20px;">
            <i class="fa-solid fa-calendar-check"></i> Historial de Entregas
         </button>
      </div>

      <div class="card" style="width:100%; border-top:4px solid var(--primary);">
         <div id="headerVistaTramite">
            <h3 style="margin-bottom:8px;"><i class="fa-solid fa-inbox text-primary"></i> Bandeja de Solicitudes Pendientes</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">Atiende los requerimientos activos de los estudiantes.</p>
         </div>
         
         <div id="tramitesRecibidosContenedor" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">
            <p style="color:var(--text-muted)">Cargando datos...</p>
         </div>
      </div>
    </div>

    <!-- Modal de Carga de Trámite -->
    <div id="modalTramiteCarga" class="modal" style="display:none; position:fixed; z-index:100; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px);">
      <div class="card shadow-lg" style="margin: 10% auto; width: 90%; max-width: 500px; padding: 24px; position:relative;">
          <button onclick="document.getElementById('modalTramiteCarga').style.display='none'" style="position:absolute; right:15px; top:15px; background:none; border:none; color:var(--text-muted); cursor:pointer;"><i class="fa-solid fa-xmark fa-xl"></i></button>
          
          <h3 style="margin-bottom:12px; color:var(--primary);"><i class="fa-solid fa-file-export"></i> Responder Solicitud</h3>
          <div style="background:var(--primary-light); padding:12px; border-radius:8px; margin-bottom:20px; color:var(--primary); font-weight:600;" id="txtAlumnoSeleccionadoTramite">
             Alumno: ---
          </div>
          
          <input type="hidden" id="tramiteAlumnoId" value="">
          <input type="hidden" id="tramiteRelacionadoId" value="">
          <input type="hidden" id="tramiteTipo" value="">

          <div class="form-group">
             <label class="form-label">Adjuntar Documento Oficial (PDF / Imagen)</label>
             <input type="file" id="tramiteFile" class="form-input" accept=".pdf,image/*" style="padding:10px; border:2px dashed var(--primary-light);">
             <p style="font-size:0.75rem; color:var(--text-muted); margin-top:8px;">Este archivo se reflejará instantáneamente en el perfil del alumno.</p>
          </div>

          <button id="btnSubirTramite" class="btn btn-success" style="width:100%; height:50px; font-weight:bold;" onclick="window.subirTramiteManual()">
             <i class="fa-solid fa-cloud-arrow-up"></i> ENVIAR DOCUMENTO AL ALUMNO
          </button>
      </div>
    </div>
  `;
}

function renderAdminMaestros() {
  setTimeout(async () => {
    if(window.loadListasAdminPersonal) window.loadListasAdminPersonal();
    if(window.initEventosAdminMaestros) window.initEventosAdminMaestros();
    if(window.loadSelectsMaestros) await window.loadSelectsMaestros();
  }, 100);
  
  return `
    <div class="page-header">
      <h2 class="page-title">Personal de la Escuela y Asignaciones</h2>
      <p class="page-subtitle">Gestión de roles, maestros y carga académica institucional.</p>
    </div>

    <div style="display:flex; gap:24px; flex-wrap:wrap; margin-bottom: 24px;">
      <div class="card" style="flex:1; min-width:300px;">
        <h3 style="margin-bottom:16px"><i class="fa-solid fa-user-plus text-primary"></i> 1. Alta de Personal</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">Esto autorizará el acceso del correo seleccionado al portal correspondiente.</p>
        
        <div class="form-group">
          <label class="form-label">Correo Institucional / Personal</label>
          <input type="email" id="docEmail" class="form-input" placeholder="empleado@escuela.edu.mx">
        </div>
        
        <div class="form-group">
          <label class="form-label">Nombre Completo</label>
          <input type="text" id="docName" class="form-input" placeholder="Ej. Lic. Martha López">
        </div>

        <div class="form-group">
          <label class="form-label">Rol / Perfil de Cuenta</label>
          <select id="docRole" class="form-input">
            <option value="maestro">Maestro</option>
            <option value="apoyo">Apoyo (Prefectura / Trabajo Social)</option>
            <option value="admin">Admin (Control Escolar)</option>
            <option value="directivo">Directivo del Plantel</option>
          </select>
        </div>

        <button class="btn btn-primary" id="btnGuardarMaestroSolo" style="width:100%">
          <i class="fa-solid fa-floppy-disk"></i> Registrar Maestro
        </button>
      </div>

      <div class="card" style="flex:1.5; min-width:350px;">
        <h3 style="margin-bottom:16px"><i class="fa-solid fa-book text-success"></i> 2. Añadir Materia al Maestro</h3>
        <div class="form-group" style="margin-bottom: 25px;">
          <div class="collapsible-header" onclick="window.togglePaso1Maestros(this)">
            <h4><i class="fa-solid fa-user-check"></i> PASO 1: Elige al Maestro</h4>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <div id="wrapperListaMaestros" class="collapsible-content">
              <div id="listaSeleccionMaestrosDirecta" class="lista-maestros-container">
                 <p style="text-align:center; color:var(--text-muted); font-size: 0.85rem; padding: 20px;">Cargando lista de maestros...</p>
              </div>
          </div>
          <input type="hidden" id="selMaestroMateriasV110" value="">
        </div>

        <div class="form-group">
           <label class="form-label">PASO 2: Escribe la Materia que dará</label>
           <input type="text" id="nuevaMateriaDoc" class="form-input" placeholder="Ej. Matemáticas, Inglés..." style="border: 2px solid var(--success);">
        </div>
        
        <button class="btn btn-success" id="btnAsignarMateriaMaestro" style="width:100%; height: 55px; font-size: 1.1rem; font-weight:900; background: #059669; box-shadow: 0 4px 12px rgba(5,150,105,0.3);">
          <i class="fa-solid fa-plus-circle"></i> REGISTRAR MATERIA AL MAESTRO
        </button>
        
        <div style="margin-top: 24px;">
           <h4>Materias registradas (Historial del profesor)</h4>
           <ul id="listaMateriasMaestro" style="font-size: 0.85rem; color: var(--text-muted); padding-left: 16px; margin-top: 8px;">
              <li>Selecciona un maestro para ver sus materias base.</li>
           </ul>
        </div>
      </div>
    </div>

    <!-- Nueva Sección: Lista de Personal -->
    <div class="card" style="margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3 style="margin:0;"><i class="fa-solid fa-users-shield text-primary"></i> 3. Personal Autorizado</h3>
            <div style="display:flex; align-items:center; gap:12px;">
                <div style="font-size:0.85rem; color:var(--text-muted);">Total Personal: <b id="totalPersonalCounter" class="text-primary">0</b></div>
                <div style="position:relative;">
                    <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:0.8rem;"></i>
                    <input type="text" id="busquedaPersonalAutorizado" placeholder="Buscar por nombre o correo..." 
                           style="padding:6px 12px 6px 30px; border-radius:15px; border:1px solid var(--border); font-size:0.85rem;"
                           onkeyup="window.loadListasAdminPersonal(this.value)">
                </div>
                <button class="btn btn-outline btn-xs" onclick="window.loadListasAdminPersonal()">
                    <i class="fa-solid fa-rotate"></i>
                </button>
            </div>
        </div>

        <div id="tabsPersonalAdmin" style="display:flex; background:var(--page-bg); padding:4px; border-radius:10px; gap:4px; border:1px solid var(--border); margin-bottom: 20px; width: max-content; overflow-x: auto; max-width:100%;">
            <button class="btn btn-sm btn-tab-personal active" onclick="window.cambiarTabPersonal('admin', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:white; border:1px solid var(--border); cursor:pointer;">Administradores</button>
            <button class="btn btn-sm btn-tab-personal" onclick="window.cambiarTabPersonal('maestro', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:transparent; border:none; cursor:pointer; color:var(--text-muted);">Maestros</button>
            <button class="btn btn-sm btn-tab-personal" onclick="window.cambiarTabPersonal('apoyo', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:transparent; border:none; cursor:pointer; color:var(--text-muted);">Apoyo</button>
            <button class="btn btn-sm btn-tab-personal" onclick="window.cambiarTabPersonal('directivo', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:transparent; border:none; cursor:pointer; color:var(--text-muted);">Directivos</button>
        </div>
        
        <div style="overflow-x:auto;">
            <table class="risk-table" style="width:100%;">
                <thead>
                    <tr>
                        <th style="padding:12px; text-align:left;">Nombre del Empleado</th>
                        <th style="padding:12px; text-align:left;">Identificador / ID</th>
                        <th style="padding:12px; text-align:center;">Perfil / Rol</th>
                        <th style="padding:12px; text-align:center;">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tbodyPersonalAdmin">
                    <tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted)">Cargando listado staff...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
  `;
}

function renderAdminComunicados() {
  setTimeout(() => { if(window.loadComunicadosAdmin) window.loadComunicadosAdmin(); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Comunicados y Anuncios Oficiales</h2>
      <p class="page-subtitle">Panel de difusión masiva con notificaciones push para la app de maestros, alumnos y padres de familia.</p>
    </div>

    <div style="display:flex; gap:24px; flex-wrap:wrap;">
      <!-- Creador de Comunicado -->
      <div class="card" style="flex:2; min-width:350px;">
        <h3 style="margin-bottom:16px">Nuevo Comunicado / Aviso</h3>
        <div class="form-group">
          <label class="form-label">Asunto o Título del Aviso</label>
          <input type="text" id="inComTitulo" class="form-input" placeholder="Ej: Suspensión de Clases por CTE">
        </div>
        <div class="form-group">
          <label class="form-label">Audiencia Destino a Notificar</label>
          <select id="selComAudiencia" class="form-select">
            <option value="General">Toda la Comunidad Escolar (Maestros y Alumnos)</option>
            <option value="Maestros">Solo Plantel de Maestros y Personal</option>
            <option value="Alumnos">Solo Alumnos y Perfiles de Padres de Familia</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Mensaje Detallado</label>
          <textarea id="inComMensaje" class="form-input" style="height:120px; resize:vertical; font-family:inherit;" placeholder="Escribe el contenido del comunicado aquí..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Adjuntar Documento / Convocatoria (.pdf, .jpg)</label>
          <input type="file" id="inComArchivo" class="form-input" style="padding:8px; cursor:pointer;" accept=".pdf,.jpg,.png">
        </div>
        <button id="btnPublicarComunicado" class="btn btn-primary btn-lg" style="width:100%" onclick="window.publicarComunicado()">
          <i class="fa-solid fa-bullhorn"></i> Publicar y Enviar Notificaciones App
        </button>
      </div>

      <!-- Historial de Comunicados -->
      <div class="card" style="flex:1; min-width:300px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="margin:0">Historial</h3>
            <button class="btn btn-outline" style="padding:4px 8px; font-size:0.7rem;" onclick="window.loadComunicadosAdmin(new Date().toLocaleDateString('en-CA'))">Hoy</button>
        </div>
        <div class="form-group" style="margin-bottom:16px;">
            <label class="form-label" style="font-size:0.75rem;">Filtrar por Fecha (Calendario)</label>
            <input type="date" id="filtroFechaComAdmin" class="form-input" style="padding:6px; font-size:0.85rem;" onchange="window.loadComunicadosAdmin(this.value)">
        </div>
        <div id="divComHistorial" style="display:flex; flex-direction:column; gap:16px;">
           <p style="color:var(--text-muted);">Cargando historial...</p>
        </div>
      </div>
    </div>
  `;
}

window.loadComunicadosAdmin = async (fechaFiltro = null) => {
    console.log("Cargando comunicados...");
    const cont = document.getElementById('divComHistorial');
    if(!cont) return;
    cont.innerHTML = '<p style="color:var(--text-muted); text-align:center;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>';
    try {
        let query = supabaseClient.from('comunicados')
            .select('*, perfiles(nombre)')
            .order('fecha_envio', { ascending: false })
            .limit(30);

        // Solo mostrar comunicados generales para el muro del admin
        query = query.in('audiencia', ['General', 'Maestros', 'Alumnos']);

        if(fechaFiltro) {
            const desde = fechaFiltro + 'T00:00:00';
            const hasta = fechaFiltro + 'T23:59:59';
            query = query.gte('fecha_envio', desde).lte('fecha_envio', hasta);
        }

        const { data, error } = await query;
        if(error) throw error;

        if(!data || data.length === 0) {
            cont.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted);"><i class="fa-solid fa-inbox" style="font-size:2rem; margin-bottom:8px; display:block;"></i>No hay comunicados' + (fechaFiltro ? ' en esta fecha.' : ' registrados.') + '</div>';
            return;
        }

        const tipoColores = {
            'General': 'var(--success)',
            'Maestros': 'var(--primary)',
            'Alumnos': 'var(--warning)',
        };

        cont.innerHTML = data.map(c => {
            const date = new Date(c.fecha_envio).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
            const autor = c.perfiles?.nombre || 'Sistema';
            const color = tipoColores[c.audiencia] || 'var(--text-muted)';
            const btnAdjunto = c.archivo_url
                ? `<a href="${c.archivo_url}" target="_blank" class="btn btn-outline btn-xs" style="margin-top:8px; border-color:var(--primary); color:var(--primary); display:inline-flex; gap:4px; align-items:center;"><i class="fa-solid fa-paperclip"></i> Ver adjunto</a>`
                : '';
            return `
            <div style="border-left:4px solid ${color}; padding:12px 14px; background:var(--page-bg); border-radius:8px; border:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; gap:8px; flex-wrap:wrap;">
                    <span style="font-weight:600; color:var(--text-main); font-size:0.95rem;">${c.titulo}</span>
                    <span style="font-size:0.7rem; background:${color}22; color:${color}; padding:2px 8px; border-radius:20px; white-space:nowrap; font-weight:600;">${c.audiencia}</span>
                </div>
                <p style="font-size:0.85rem; color:var(--text-main); margin:0 0 8px 0; white-space:pre-wrap;">${c.mensaje}</p>
                <div style="font-size:0.75rem; color:var(--text-muted);">
                    <i class="fa-regular fa-clock"></i> ${date} &nbsp;|&nbsp; <i class="fa-solid fa-user"></i> ${autor}
                </div>
                ${btnAdjunto}
            </div>`;
        }).join('');
    } catch(err) {
        console.error(err);
        cont.innerHTML = '<div style="color:var(--danger); padding:16px; text-align:center;"><i class="fa-solid fa-triangle-exclamation"></i> Error al cargar el historial: ' + err.message + '</div>';
    }
};

window.publicarComunicado = async () => {
    const titulo = document.getElementById('inComTitulo').value.trim();
    const audiencia = document.getElementById('selComAudiencia').value;
    const mensaje = document.getElementById('inComMensaje').value.trim();
    const fileInput = document.getElementById('inComArchivo');
    const btn = document.getElementById('btnPublicarComunicado');

    if(!titulo || !mensaje) {
        alert("Por favor completa el título y el mensaje del comunicado.");
        return;
    }

    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';

    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if(!session) throw new Error("No hay una sesión activa de admin.");

        let archivo_url = null;

        // 1. Subir archivo si existe
        if(fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const ext = file.name.split('.').pop();
            const fileName = `adjunto_${Date.now()}.${ext}`;
            
            // Usamos el cliente global que ya tiene permisos admin
            const { data: sData, error: sError } = await supabaseClient.storage
                .from('comunicados_adjuntos')
                .upload(fileName, file);
            
            if(sError) throw sError;
            
            const { data: urlData } = supabaseClient.storage
                .from('comunicados_adjuntos')
                .getPublicUrl(fileName);
            
            archivo_url = urlData.publicUrl;
        }

        // 2. Guardar comunicado en DB
        const { error: dbError } = await supabaseClient
            .from('comunicados')
            .insert([{
                autor_id: session.user.id,
                titulo,
                audiencia,
                mensaje,
                archivo_url,
                fecha_envio: new Date().toISOString(),
                plantel_id: state.plantelId
            }]);

        if(dbError) throw dbError;

        // 3. Éxito
        alert('"EXITO" Archivo guardado');
        
        // Limpiar formulario
        document.getElementById('inComTitulo').value = '';
        document.getElementById('inComMensaje').value = '';
        fileInput.value = '';
        
        // Recargar historial
        window.loadComunicadosAdmin();

    } catch(err) {
        console.error("Error publicando comunicado:", err);
        alert("Error al publicar: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = orig;
    }
};

// ========================
// MAESTRO PAGES
// ========================

function renderMaestroAula() {
  setTimeout(() => { if(window.loadMisGruposMaestro) window.loadMisGruposMaestro(); }, 100);
  return `
    <div class="mobile-app">
      <div class="mobile-header d-flex justify-content-between">
        <h2>Gestión de Aula y Pase de Lista</h2>
        <p>Ciclo Escolar 2026-II</p>
      </div>
      <div class="mobile-content">
        <h3 style="margin-bottom: 16px;">Mis Grupos Asignados (Todas mis clases)</h3>
        
        <div id="contenedorMisGrupos">
           <div style="padding: 20px; text-align: center; color: var(--text-muted)">
              <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
              <p style="margin-top: 10px;">Cargando grupos asignados...</p>
           </div>
        </div>

        <!-- Rendered when clicked on a class -->
        <div id="classDetail" style="display: none; text-align: center; margin-top: 10px; animation: fadeIn 0.3s">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
             <h3 id="classDetailTitle" style="margin:0">Grupo Seleccionado</h3>
             <div style="display:flex; gap:8px;">
               <button class="btn btn-outline" style="padding: 4px 8px; font-size:0.8rem; border-color:var(--primary); color:var(--primary)" onclick="window.navigate('/maestro/listas?grupo=' + window.currentAulaGrupoId)"><i class="fa-solid fa-list-check"></i> Ver Lista Alumnos</button>
               <button class="btn btn-outline" style="padding: 4px 8px; font-size:0.8rem;" onclick="document.getElementById('classDetail').style.display='none'; document.querySelectorAll('.class-card').forEach(c=>c.style.display='flex')"><i class="fa-solid fa-arrow-left"></i> Volver</button>
             </div>
          </div>

          <!-- PANEL DE CONTROL MANUAL DE ASISTENCIA -->
          <div class="card" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border: 1px solid var(--border); border-radius:12px;">
             <div id="asistenciaStatusMsg" style="margin-bottom:15px; font-weight: bold; color: var(--text-muted); font-size: 1.1rem; text-align:center;">
                <i class="fa-solid fa-circle-dot"></i> Esperando acción del maestro...
             </div>
             
             <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <button id="btnModoPuntual" class="btn btn-primary" style="padding:15px 5px; font-weight:bold; border-radius:10px; display:flex; flex-direction:column; align-items:center; gap:5px;" onclick="window.toggleAsistenciaModo('asistencia')">
                   <i class="fa-solid fa-clock"></i>
                   <span style="font-size:0.9rem;">ENTRADA EN TIEMPO</span>
                   <small id="lblBtnPuntual" style="font-size:0.65rem; opacity:0.8;">[Activar Cámara]</small>
                </button>
                
                <button id="btnModoRetardo" class="btn btn-warning" style="padding:15px 5px; font-weight:bold; border-radius:10px; display:flex; flex-direction:column; align-items:center; gap:5px;" onclick="window.toggleAsistenciaModo('retardo')">
                   <i class="fa-solid fa-stopwatch"></i>
                   <span style="font-size:0.9rem;">MÓDULO RETARDOS</span>
                   <small id="lblBtnRetardo" style="font-size:0.65rem; opacity:0.8;">[Activar Cámara]</small>
                </button>
             </div>
          </div>
          
          <div id="reader-maestro" style="width: 100%; min-height: 250px; display:none; border-radius:12px; overflow:hidden; margin: 20px 0; background:black"></div>
          
          <div style="display:flex; justify-content:center; align-items:center; margin-bottom:20px;">
             <button id="btnCerrarSesionDefinitivo" class="btn btn-danger btn-sm" style="display:none; border-radius:20px; padding:8px 20px; font-weight:bold;" onclick="window.confirmarCierreSesion()">
                <i class="fa-solid fa-lock"></i> FINALIZAR SESIÓN Y PONER FALTAS
             </button>
          </div>

          <button class="btn btn-outline btn-lg" style="width: 100%; border-color: var(--danger); color: var(--danger)" onclick="window.openReporteModal()">
            <i class="fa-solid fa-triangle-exclamation"></i> Levantar Reporte Rápido
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderMaestroActividades() {
  setTimeout(() => { if(window.loadActividadesMaestro) window.loadActividadesMaestro(); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Actividades y Tareas</h2>
      <p class="page-subtitle">Registra nuevos trabajos y prepara el escáner QR para revisión ágil.</p>
    </div>
    
    <div style="display:flex; gap:24px; flex-wrap:wrap;">
      <!-- Panel Nueva Actividad -->
      <div class="card" style="flex: 1; min-width: 320px; align-self: flex-start;">
        <h3 style="margin-bottom: 16px;">Nueva Actividad</h3>
        <div class="form-group">
          <label class="form-label">Título de la Actividad</label>
          <input type="text" class="form-input" id="actTitulo" placeholder="Ej. Mapa conceptual Ecosistemas">
        </div>
        <div class="form-group">
          <label class="form-label">Descripción (Opcional)</label>
          <textarea class="form-input" id="actDesc" rows="2" placeholder="Detalles de la entrega..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Materia y Grupo</label>
          <select class="form-select" id="actMateriaGrupo" onchange="window.cargarRubrosParaActividad()">
             <option value="">Cargando asignaciones...</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Rubro del Encuadre</label>
          <select class="form-select" id="actRubro">
             <option value="">-- Selecciona Grupo Primero --</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Trimestre</label>
          <select class="form-select" id="actTrimestre" onchange="window.cargarRubrosParaActividad()">
             <option value="1">1° Trimestre</option>
             <option value="2">2° Trimestre</option>
             <option value="3">3° Trimestre</option>
          </select>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="window.agregarActividad()">
           <i class="fa-solid fa-plus"></i> Guardar Actividad
        </button>
      </div>

      <!-- Panel Lista de Actividades -->
      <div class="card" style="flex: 2; min-width: 400px;">
         <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="margin:0;">Gestión de Actividades</h3>
            <div class="tabs" style="display:flex; background:var(--page-bg); padding:4px; border-radius:8px; gap:4px; align-items:center;">
                <select id="filtroTrimestreAct" class="form-select" style="margin:0; padding:4px 8px; font-size:0.8rem; width:120px;" onchange="window.loadActividadesMaestro()">
                    <option value="1">1° Trimestre</option>
                    <option value="2">2° Trimestre</option>
                    <option value="3">3° Trimestre</option>
                </select>
                <div style="width:1px; height:20px; background:var(--border); margin:0 4px;"></div>
                <button class="btn btn-sm" id="tabActsVigentes" onclick="window.cambiarTabActividades('vigentes')" style="background:white; border:1px solid var(--border); border-radius:6px; padding:6px 12px; font-size:0.85rem; font-weight:600; cursor:pointer;">
                    <i class="fa-solid fa-list-check"></i> Vigentes
                </button>
                <button class="btn btn-sm" id="tabActsArchivo" onclick="window.cambiarTabActividades('archivo')" style="background:transparent; border:none; border-radius:6px; padding:6px 12px; font-size:0.85rem; font-weight:600; cursor:pointer; color:var(--text-muted);">
                    <i class="fa-solid fa-calendar-check"></i> Archivo
                </button>
            </div>
         </div>
         <div id="listaActividadesMaestro" style="display:flex; flex-direction:column; gap:12px;">
            <div style="text-align:center; padding:20px; color:var(--text-muted)">Cargando actividades...</div>
         </div>
      </div>
    </div>
    
    <!-- Modal QR Escáner -->
    <div id="modalQREvaluacion" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
       <div style="background:white; padding:24px; border-radius:12px; width:400px; max-width:90%; position:relative;">
          <button class="btn-close" style="position:absolute; top:12px; right:12px; border:none; background:none; font-size:1.5rem; cursor:pointer;" onclick="window.cerrarQREvaluacion()">&times;</button>
          <h3 style="margin-top:0;">Evaluación QR Rápida</h3>
          <p id="qrActividadInfo" style="color:var(--text-muted); font-size:0.9rem; margin-bottom:16px;">Escaneando para: Actividad</p>
          <div id="qr-reader-eval" style="width:100%; max-width:350px; margin: 0 auto;"></div>
          
          <div id="panelCalificacionQR" style="display:none; margin-top:20px;">
             <h4 style="color:var(--primary); margin-bottom:8px;" id="qrAlumnoEncontrado">Alumno...</h4>
             <label class="form-label">Calificación / Nota</label>
             <div style="display:flex; gap:8px;">
               <input type="text" id="inCalificacionQR" class="form-input" style="flex:1" placeholder="Ej. 10, Entregado, Incompleto" value="10">
               <button class="btn btn-success" onclick="window.guardarEvaluacionQR()"><i class="fa-solid fa-check"></i> Asentar</button>
             </div>
          </div>
       </div>
    </div>
  `;
}

function renderMaestroListas() {
  setTimeout(() => { if(window.loadListasMaestro) window.loadListasMaestro(); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Listas y Evaluación Formativa</h2>
      <p class="page-subtitle">Seguimiento global de alumnos por grupo. Asistencias, entregas y desempeño.</p>
    </div>
    <div class="card">
       <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 24px; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
            <div>
               <label style="font-weight:600; font-size:0.9rem; margin-bottom:4px; display:block;">Grupo/Materia:</label>
               <select class="form-select" id="listaMaestroGrupo" style="width:220px; margin:0;" onchange="window.cargarAlumnosLista()">
                  <option value="">Cargando...</option>
               </select>
            </div>
            <div>
               <label style="font-weight:600; font-size:0.9rem; margin-bottom:4px; display:block;">Tipo de Lista:</label>
               <select class="form-select" id="listaMaestroTipo" style="width:200px; margin:0;" onchange="window.cargarAlumnosLista()">
                  <option value="evaluaciones">Lista de Evaluación</option>
                  <option value="asistencias">Lista de Asistencias</option>
               </select>
            </div>
          </div>
          <div id="tabsTrimestresListas" style="display:flex; background:var(--page-bg); padding:4px; border-radius:10px; gap:4px; border:1px solid var(--border);">
             <button class="btn btn-sm t-btn active" onclick="window.cambiarTrimestreLista(1, this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:white; border:1px solid var(--border); cursor:pointer;">1° T</button>
             <button class="btn btn-sm t-btn" onclick="window.cambiarTrimestreLista(2, this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:transparent; border:none; cursor:pointer; color:var(--text-muted);">2° T</button>
             <button class="btn btn-sm t-btn" onclick="window.cambiarTrimestreLista(3, this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:transparent; border:none; cursor:pointer; color:var(--text-muted);">3° T</button>
             <div style="width:1px; background:var(--border); margin:0 4px;"></div>
             <button class="btn btn-sm t-btn" onclick="window.cambiarTrimestreLista('final', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:transparent; border:none; cursor:pointer; color:var(--text-muted);">PROMEDIO FINAL</button>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
             <button class="btn btn-outline" style="border-color:var(--text-muted); color:var(--text-main)" onclick="window.exportarRejillaBlancoCSV()" title="Descargar plantilla de evaluación en blanco (20 columnas)"><i class="fa-solid fa-table-cells"></i> Plantilla Vacía</button>
             <button class="btn btn-outline" style="border-color:var(--success); color:var(--success)" onclick="window.exportarListasCSV()"><i class="fa-solid fa-file-csv"></i> Excel de Datos</button>
             <button class="btn btn-outline" style="border-color:var(--primary); color:var(--primary)" onclick="window.imprimirLista()"><i class="fa-solid fa-print"></i> Imprimir</button>
          </div>
       </div>
       
       <div style="overflow-x:auto;">
         <table class="risk-table" style="width:100%">
           <thead id="listaMaestroCabecera">
             <tr>
                <th style="padding:12px; text-align:left;">Alumno</th>
                <th style="padding:12px; text-align:center;">Actividades Revisadas</th>
                <th style="padding:12px; text-align:center;">Estimación Actual</th>
                <th style="padding:12px; text-align:center;">Contacto</th>
             </tr>
           </thead>
           <tbody id="listaMaestroAlumnos">
              <tr><td colspan="4" style="text-align:center; padding: 20px; color:var(--text-muted)">Seleccione un grupo para ver a los alumnos...</td></tr>
           </tbody>
         </table>
       </div>
    </div>
  `;
}

function renderMaestroEncuadre() {
  setTimeout(() => { if (window.loadGruposEncuadre) window.loadGruposEncuadre(); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Encuadre de Evaluación</h2>
      <p class="page-subtitle">Configura los rubros y porcentajes para cada grupo y expídelo a los padres de familia.</p>
    </div>
    
    <div class="card" style="margin-bottom:24px;">
      <label class="form-label">Selecciona el Grupo / Materia para configurar su Encuadre específico:</label>
      <select class="form-select" id="encuadreGrupoMateria" style="max-width:400px; margin-bottom:0;" onchange="window.cargarEncuadreActivo()">
         <option value="">Cargando asignaciones...</option>
      </select>
    </div>

    <div class="card" style="max-width: 800px; position:relative;" id="panelEncuadreConfig">
      <div id="encuadreOverlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.7); z-index:10; display:flex; justify-content:center; align-items:center; border-radius:8px;">
          <strong style="color:var(--text-muted);">Selecciona un grupo para habilitar.</strong>
      </div>
      
      <div style="display:flex; flex-direction:column; gap:8px; margin-bottom: 24px; padding: 16px; background:var(--page-bg); border-radius:var(--radius-sm);">
         <label class="form-label" style="margin:0; font-weight:600;">Trimestre a Aplicar:</label>
         <div style="display:flex; gap:10px;">
            <button class="btn btn-trimestre active" data-trim="1" onclick="window.setTrimestre(1, this)" style="flex:1;">1° Trimestre</button>
            <button class="btn btn-trimestre" data-trim="2" onclick="window.setTrimestre(2, this)" style="flex:1;">2° Trimestre</button>
            <button class="btn btn-trimestre" data-trim="3" onclick="window.setTrimestre(3, this)" style="flex:1;">3° Trimestre</button>
         </div>
      </div>

      <div style="display:flex; justify-content:space-between; margin-bottom: 16px;">
         <h4 id="encuadreCurrentTitle" style="margin:0; color:var(--text-main);">Configurando: ---</h4>
         <button class="btn btn-outline" style="border-color:var(--primary); color:var(--primary)" onclick="window.agregarRubro()"><i class="fa-solid fa-plus"></i> Nuevo Rubro</button>
      </div>
      <div id="rubrosContainer">
         <!-- Renderizado dinámicamente -->
      </div>
      <div style="background: var(--page-bg); padding: 16px; border-radius: var(--radius-sm); margin: 24px 0; display:flex; justify-content: space-between; align-items: center">
        <span style="font-weight: 600">Suma Total:</span>
        <span id="encuadreTotal" style="font-size: 1.4rem; font-weight: 800; color: var(--text-main)">100%</span>
      </div>
      <button id="btnEnviarEncuadre" class="btn btn-primary btn-lg" style="width: 100%;" onclick="window.guardarYEnviarEncuadre()">
         <i class="fa-regular fa-paper-plane"></i> Guardar y Enviar a Alumnos para Firma
      </button>

      <button id="btnResetEncuadre" class="btn btn-outline btn-xs" style="width: 100%; margin-top:12px; color:var(--danger); border-color:var(--danger); display:none;" onclick="window.resetEstadoEncuadre()">
         <i class="fa-solid fa-trash-can"></i> Limpiar Registro de Envío y Avisos (Reinicio Total)
      </button>
    </div>

    <!-- Panel de Firmantes -->
    <div class="card" style="max-width:800px; margin-top:24px;" id="panelFirmantes" style="display:none;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h4 style="margin:0;"><i class="fa-solid fa-signature text-success"></i> Alumnos que han firmado de Enterados</h4>
        <button class="btn btn-outline btn-xs" onclick="window.loadFirmantesEncuadre()" style="border-color:var(--primary); color:var(--primary);"><i class="fa-solid fa-rotate"></i> Refrescar</button>
      </div>
      <div id="contenedorFirmantes"><p style="color:var(--text-muted); font-size:0.85rem;">Selecciona un grupo/materia para ver el estado de firmas.</p></div>
    </div>
  `;
}

function renderMaestroCalificaciones() {
  setTimeout(() => { if(window.loadGruposCalificacionesCarga) window.loadGruposCalificacionesCarga(); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Captura Oficial de Evaluaciones (Boletas)</h2>
      <p class="page-subtitle">Asienta las calificaciones definitivas por alumno y grupo. Estatus: <span style="font-weight:bold; color:var(--success)">PERIODO ABIERTO POR ADMINISTRACIÓN</span>.</p>
    </div>

    <div class="card" style="margin-bottom:24px; padding:16px 24px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px;">
        <div class="form-group" style="margin:0; min-width:300px;">
          <label class="form-label">Asignatura y Grupo Activo</label>
          <select class="form-select" id="capturaCalificacionesGrupo" onchange="window.cargarBoletasGrupo()">
             <option value="">Cargando materias...</option>
          </select>
        </div>
        <div class="form-group" style="margin:0; min-width:120px;">
          <label class="form-label">Trimestre a Evaluar</label>
          <select class="form-select" id="capturaTrimestre" onchange="window.cargarBoletasGrupo()">
             <option value="1">Trimestre 1</option>
             <option value="2">Trimestre 2</option>
             <option value="3">Trimestre 3</option>
             <option value="4">Calificación Final (Año Escolar)</option>
          </select>
        </div>
        <div style="text-align:right;">
          <span style="font-size:0.8rem; color:var(--danger); display:block; margin-bottom:8px; font-weight:bold;">⚠️ Cierre del Sistema en breve</span>
          <button class="btn btn-outline" style="border-color:var(--success); color:var(--success);" onclick="window.cargarBoletasGrupo()">
             <i class="fa-solid fa-arrows-rotate"></i> Recalcular de Seguimiento
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="overflow-x:auto;">
      <table class="risk-table" style="width:100%; text-align:center;">
        <thead id="tablaBoletasCabecera">
          <tr>
             <th style="padding:12px; text-align:left;">Alumno</th>
             <th style="padding:12px; text-align:center;">Cargando...</th>
          </tr>
        </thead>
        <tbody id="tablaBoletasCuerpo">
           <tr><td colspan="5" style="padding:20px; color:var(--text-muted)">Seleccione una materia para cargar el informe.</td></tr>
        </tbody>
      </table>
      </div>
      
      <div style="margin-top:24px; padding-top:24px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
         <span style="font-size:0.85rem; color:var(--text-muted);">El sistema promedia los rubros de forma ponderada. Edita la calificación final si requieres realizar un ajuste definitivo.</span>
         <button class="btn btn-primary btn-lg" onclick="window.sellarYEnviarCalificaciones()">
            <i class="fa-solid fa-paper-plane"></i> Sellar y Enviar a Control Escolar
         </button>
      </div>
    </div>
  `;
}

function renderMaestroBitacora() {
  const tD = new Date().toLocaleDateString('en-CA');
  setTimeout(() => { if(window.cargarBitacora) window.cargarBitacora(tD); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Bitácora de Maestros (Hechos)</h2>
      <p class="page-subtitle">Registro de incidencias, recados o reportes acontecidos dentro y fuera del salón durante la jornada. Compartible con Prefectura y Trabajo Social.</p>
    </div>
    
    <div class="card" style="max-width: 800px;">
       <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:1px solid var(--border); padding-bottom:16px; margin-bottom: 24px;">
         <h3 style="margin:0;">Jornada Oficial</h3>
         <div class="form-group" style="margin:0; min-width:200px">
           <label class="form-label" style="font-size:0.8rem">Consultar Historial</label>
           <input type="date" class="form-input" id="fechaBitacora" style="padding:6px; font-size:0.9rem" value="${tD}" onchange="window.cargarBitacora(this.value)">
         </div>
       </div>

       <div style="display:flex; flex-direction:column; gap:12px; margin-bottom: 32px; padding-bottom:24px; border-bottom:1px solid var(--border)">
          <div style="display:flex; gap:16px; flex-wrap:wrap">
            <div class="form-group" style="flex:1; min-width:200px; margin:0;">
               <label class="form-label">Firma de Registro (Tu Nombre/Maestro)</label>
               <input type="text" class="form-input" id="autorBitacora" placeholder="Escribe cómo quieres firmar (ej. Mtro. Matemáticas)...">
            </div>
            <div class="form-group" style="flex:2; min-width:300px; margin:0;">
               <label class="form-label">Añadir Acontecimiento en el Aula</label>
               <textarea class="form-input" id="nuevaBitacoraTexto" rows="1" placeholder="Describe la situación ocurrida..."></textarea>
            </div>
            <button class="btn btn-primary" style="align-self: flex-end; height:42px" onclick="window.agregarBitacora()"><i class="fa-solid fa-pen-clip"></i> Sellar y Escribir</button>
          </div>
       </div>

       <div id="bitacoraTimeline" style="position:relative; margin-left: 12px; border-left: 2px solid var(--border); padding-left:24px; display:flex; flex-direction:column; gap:24px;">
          <div style="color:var(--text-muted); font-size:0.9rem"><i class="fa-solid fa-spinner fa-spin"></i> Cargando hechos de la jornada...</div>
       </div>
    </div>
  `;
}

// ========================
// APOYO PAGES
// ========================
function renderApoyoDashboard() {
  setTimeout(() => { if(window.loadFocosRojos) window.loadFocosRojos(); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title" style="color: var(--danger)">Dashboard de Trabajo Social</h2>
      <p class="page-subtitle">Gestión de alumnos críticos y consulta de expedientes integrales.</p>
    </div>

    <!-- Buscador General de Expedientes -->
    <div class="card" style="margin-bottom:32px; border-bottom: 3px solid var(--primary);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="margin:0; font-size:1.1rem;"><i class="fa-solid fa-address-book" style="color:var(--primary)"></i> Buscador de Expedientes</h3>
            <span style="font-size:0.75rem; color:var(--text-muted)">Busca cualquier alumno del plantel</span>
        </div>
        <div style="position:relative;">
            <input type="text" class="form-input" placeholder="Escribe el nombre o matrícula del alumno..." 
                   onkeyup="window.buscarExpedienteGlobal(this.value)"
                   id="inpBusquedaExpediente"
                   style="padding-left: 40px; border-radius:20px; border-color:var(--primary);">
            <i class="fa-solid fa-search" style="position:absolute; left:15px; top:13px; color:var(--primary);"></i>
            <div id="resExpedienteGlobal" style="position:absolute; width:100%; background:white; border:1px solid var(--border); box-shadow:var(--shadow-xl); z-index:1000; border-radius:12px; margin-top:8px; display:none; max-height:300px; overflow-y:auto;"></div>
        </div>
    </div>
    
    <div style="display: flex; gap: 24px; flex-wrap:wrap;">
      <div class="card" style="flex: 2; min-width: 400px; border-top: 5px solid var(--danger);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
           <h3 style="margin:0;">Focos Rojos (Acumulación 3+)</h3>
           <button class="btn btn-outline btn-sm" onclick="window.loadFocosRojos()"><i class="fa-solid fa-sync"></i> Actualizar</button>
        </div>
        <div style="overflow-x:auto;">
            <table class="risk-table" style="width:100%;">
              <thead>
                <tr>
                  <th style="padding:15px;">Estudiante</th>
                  <th style="padding:15px; text-align:center;">Reportes</th>
                  <th style="padding:15px; text-align:center;">Estado</th>
                  <th style="padding:15px; text-align:right;">Acciones</th>
                </tr>
              </thead>
              <tbody id="focosRojosContenedor">
                 <tr><td colspan="4" style="text-align:center; padding:40px; color:var(--text-muted)">Cargando expedientes...</td></tr>
              </tbody>
            </table>
        </div>
      </div>

      <!-- Expediente Detallado (Drawer) -->
      <div id="expedienteDrawer" class="card" style="flex: 1; min-width: 350px; display: none; background: #fff; border-left: 1px solid var(--border); box-shadow: var(--shadow-lg); animation: slideInRight 0.4s ease-out;">
         <div id="expedienteContent">
            <div style="padding:40px; text-align:center; opacity:0.5;">Selecciona un alumno para ver su expediente completo.</div>
         </div>
      </div>
    </div>

    <!-- Modal de Atención a Foco Rojo (Inyectado para funcionalidad de botón Atender) -->
    <div id="modalAtencionFoco" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; backdrop-filter:blur(4px);">
        <div class="card" style="max-width:600px; margin:40px auto; padding:25px; position:relative; box-shadow:var(--shadow-lg);">
            <button onclick="document.getElementById('modalAtencionFoco').style.display='none'" style="position:absolute; top:15px; right:15px; border:none; background:none; font-size:1.5rem; cursor:pointer; color:var(--text-muted)">&times;</button>
            <h3 style="margin-top:0; color:var(--success)"><i class="fa-solid fa-handshake"></i> Atención y Resolución</h3>
            
            <input type="hidden" id="atencionAlumnoId">
            <div id="atencionAlumnoNombre" style="padding:12px; background:var(--page-bg); border-radius:12px; font-weight:600; margin-bottom:20px; border-left:4px solid var(--success);"></div>

            <div style="margin-bottom:15px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Procedimiento de Atención:</label>
                <textarea id="atencionProcedimiento" class="form-input" style="height:80px; border-radius:10px; resize:none;"></textarea>
            </div>

            <div style="margin-bottom:20px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Compromisos Acordados:</label>
                <textarea id="atencionCompromisos" class="form-input" style="height:80px; border-radius:10px; resize:none;"></textarea>
            </div>

            <div style="display:flex; gap:10px;">
                <button class="btn btn-outline" style="flex:1" onclick="document.getElementById('modalAtencionFoco').style.display='none'">Cancelar</button>
                <button class="btn btn-primary" id="btnConfirmarResolucion" style="flex:1; background:var(--success); border-color:var(--success)" onclick="window.guardarAtencionFoco()">
                    <i class="fa-solid fa-check-double"></i> Guardar y Resolver
                </button>
            </div>
        </div>
    </div>
  `;
}

window.buscarExpedienteGlobal = async (query) => {
    console.log("Buscando expediente:", query);
    const resDiv = document.getElementById('resExpedienteGlobal');
    if(!query || query.length < 2) { resDiv.style.display = 'none'; return; }
    try {
        const { data } = await supabaseClient.from('alumnos').select('*, grupos(nombre)').or(`nombre.ilike.%${query}%,matricula.ilike.%${query}%`).limit(10);
        if(!data || data.length === 0) {
            resDiv.innerHTML = '<div style="padding:15px; color:var(--text-muted)">No se encontraron alumnos.</div>';
            resDiv.style.display = 'block';
            return;
        }
        resDiv.style.display = 'block';
        resDiv.innerHTML = data.map(a => `
            <div style="padding:12px; cursor:pointer; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;" 
                 onclick="window.abrirExpedienteDirecto('${a.id}')" class="search-result-item">
                <div>
                   <b style="color:var(--primary)">${a.nombre}</b><br>
                   <small style="color:var(--text-muted)">${a.matricula} - ${a.grupos?.nombre || 'S/G'}</small>
                </div>
                <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:0.8rem"></i>
            </div>
        `).join('');
    } catch(e) { console.error(e); }
};

window.abrirExpedienteDirecto = (id) => {
    document.getElementById('resExpedienteGlobal').style.display = 'none';
    document.getElementById('inpBusquedaExpediente').value = '';
    window.showAlumnoExpediente(id);
};

function renderApoyoReportes() {
  const today = new Date().toLocaleDateString('en-CA');
  setTimeout(() => { 
      if(window.loadHistorialReportesApoyo) window.loadHistorialReportesApoyo(today); 
  }, 100);
  
  return `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
      <div>
        <h2 class="page-title">Incidencias y Conducta</h2>
        <p class="page-subtitle">Gestión y registro de reportes escolares.</p>
      </div>
      <div style="display:flex; gap:12px; align-items:center;">
        <button class="btn btn-primary" onclick="window.abrirModalReporteApoyo()" style="padding:10px 20px; border-radius:12px; font-weight:600; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-plus-circle"></i> Nuevo Reporte
        </button>
        <div class="card" style="padding:8px 16px; display:flex; align-items:center; gap:12px; border:1px solid var(--border); margin:0; background:rgba(255,255,255,0.7); backdrop-filter:blur(5px);">
           <i class="fa-solid fa-calendar-day" style="color:var(--primary)"></i>
           <input type="date" id="fechaFiltroApoyo" class="form-input" value="${today}" 
                  style="width:auto; padding:5px; border:none; background:transparent; font-size:0.9rem; font-weight:600;"
                  onchange="window.loadHistorialReportesApoyo(this.value)">
           <button class="btn btn-outline btn-xs" onclick="document.getElementById('fechaFiltroApoyo').value='${today}'; window.loadHistorialReportesApoyo('${today}')" style="border-radius:8px;">Hoy</button>
        </div>
      </div>
    </div>

    <!-- Modal de Creación de Reporte (Oculto por defecto) -->
    <div id="modalNuevoReporteApoyo" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; backdrop-filter:blur(4px);">
        <div class="card" style="max-width:500px; margin:50px auto; padding:25px; position:relative; box-shadow:var(--shadow-lg);">
            <button onclick="document.getElementById('modalNuevoReporteApoyo').style.display='none'" style="position:absolute; top:15px; right:15px; border:none; background:none; font-size:1.5rem; cursor:pointer; color:var(--text-muted)">&times;</button>
            <h3 style="margin-top:0;"><i class="fa-solid fa-file-signature"></i> Levantar Nuevo Reporte</h3>
            
            <div style="margin-top:20px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Buscar Alumno:</label>
                <input type="text" id="busquedaAlumnoApoyo" class="form-input" placeholder="Nombre o Matrícula..." onkeyup="window.buscarAlumnosReporteApoyo(this.value)" style="border-radius:10px;">
                <div id="resultadosBusquedaApoyo" style="max-height:150px; overflow-y:auto; border:1px solid var(--border); border-top:none; display:none; border-radius:0 0 10px 10px; background:white;"></div>
                <input type="hidden" id="alumnoIdSeleccionado">
                <div id="alumnoSeleccionadoLabel" style="margin-top:10px; display:none; padding:10px; background:var(--page-bg); border-radius:10px; font-size:0.9rem; border-left:4px solid var(--primary);"></div>
            </div>

            <div style="margin-top:15px; display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                <div>
                    <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Gravedad:</label>
                    <select id="gravedadReporteApoyo" class="form-input" style="border-radius:10px;">
                        <option value="Leve">Leve</option>
                        <option value="Moderado">Moderado</option>
                        <option value="Grave">Grave</option>
                    </select>
                </div>
                <div>
                    <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Categoría:</label>
                    <select id="categoriaReporteApoyo" class="form-input" style="border-radius:10px;">
                        <option value="Conducta">Conducta / Comportamiento</option>
                        <option value="Académico">Académico</option>
                        <option value="Familiar">Situación Familiar</option>
                        <option value="Salud">Salud / Emocional</option>
                    </select>
                </div>
            </div>

            <div style="margin-top:15px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Descripción del Incidente:</label>
                <textarea id="descReporteApoyo" class="form-input" placeholder="Detalla lo ocurrido..." style="height:100px; border-radius:10px; resize:none;"></textarea>
            </div>

            <div style="margin-top:25px; display:flex; gap:10px;">
                <button class="btn btn-outline" style="flex:1" onclick="document.getElementById('modalNuevoReporteApoyo').style.display='none'">Cancelar</button>
                <button class="btn btn-primary" id="btnGuardarReporteApoyo" style="flex:1" onclick="window.guardarReporteApoyo()">Guardar Reporte</button>
            </div>
        </div>
    </div>

    <!-- Modal de Atención a Foco Rojo / Citatorio -->
    <div id="modalAtencionFoco" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; backdrop-filter:blur(4px);">
        <div class="card" style="max-width:600px; margin:40px auto; padding:25px; position:relative; box-shadow:var(--shadow-lg);">
            <button onclick="document.getElementById('modalAtencionFoco').style.display='none'" style="position:absolute; top:15px; right:15px; border:none; background:none; font-size:1.5rem; cursor:pointer; color:var(--text-muted)">&times;</button>
            <h3 style="margin-top:0; color:var(--success)"><i class="fa-solid fa-handshake"></i> Atención y Resolución de Incidencias</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">Documenta la junta con el padre de familia y los compromisos acordados para cerrar el expediente temporal.</p>
            
            <input type="hidden" id="atencionAlumnoId">
            <div id="atencionAlumnoNombre" style="padding:12px; background:var(--page-bg); border-radius:12px; font-weight:600; margin-bottom:20px; border-left:4px solid var(--success);"></div>

            <div style="margin-bottom:15px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Procedimiento de Atención:</label>
                <textarea id="atencionProcedimiento" class="form-input" placeholder="Detalla cómo se atendió al alumno y tutor..." style="height:100px; border-radius:10px; resize:none;"></textarea>
            </div>

            <div style="margin-bottom:20px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Compromisos Acordados:</label>
                <textarea id="atencionCompromisos" class="form-input" placeholder="Escribe los puntos a los que se comprometieron..." style="height:100px; border-radius:10px; resize:none;"></textarea>
            </div>

            <div style="display:flex; gap:10px;">
                <button class="btn btn-outline" style="flex:1" onclick="document.getElementById('modalAtencionFoco').style.display='none'">Cancelar</button>
                <button class="btn btn-primary" id="btnConfirmarResolucion" style="flex:1; background:var(--success); border-color:var(--success)" onclick="window.guardarAtencionFoco()">
                    <i class="fa-solid fa-check-double"></i> Guardar y Resolver Todo
                </button>
            </div>
        </div>
    </div>

    <div class="card" style="max-width:900px; margin-top:20px;">
       <div id="historialReportesApoyo" style="display:flex; flex-direction:column; gap:16px;">
          <div style="text-align:center; padding:40px; color:var(--text-muted)"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top:10px;">Cargando reportes del día...</p></div>
       </div>
    </div>
  `;
}

// ========================
// APOYO DATA LOADERS
// ========================

window.loadFocosRojos = async () => {
    const cont = document.getElementById('focosRojosContenedor');
    if(!cont) return;
    try {
        const { data: reportes, error } = await supabaseClient
            .from('reportes_conducta')
            .select('alumno_id, gravedad, alumnos(id, nombre, matricula, grupos(nombre))')
            .eq('resuelto', false); // Contamos TODOS los no resueltos

        if(error) throw error;
        const conteo = {};
        (reportes || []).forEach(r => {
            if(!r.alumnos) return;
            const aid = r.alumno_id;
            if(!conteo[aid]) {
                conteo[aid] = { count: 0, graves: 0, nombre: r.alumnos.nombre, matricula: r.alumnos.matricula, grupo: r.alumnos.grupos?.nombre || 'S/G' };
            }
            conteo[aid].count++;
            if(r.gravedad === 'Grave') conteo[aid].graves++;
        });

        // Mostramos si tiene al menos 1 reporte activo
        const focos = Object.entries(conteo).map(([id, info]) => ({ id, ...info })).filter(f => f.count >= 1);
        
        if(focos.length === 0) {
            cont.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:40px; color:var(--text-muted)">No hay alumnos con reportes activos.</td></tr>';
            return;
        }

        cont.innerHTML = focos.map(f => `
            <tr>
              <td style="padding:15px;"><b>${f.nombre}</b><br><small style="color:var(--text-muted)">${f.matricula} - ${f.grupo}</small></td>
              <td style="padding:15px; text-align:center;">
                 <span class="badge" style="background:#f5f5f5; color:var(--text-main); border:1px solid #ddd;">${f.count} Totales</span><br>
                 <small style="color:var(--danger)">${f.graves} Graves</small>
              </td>
              <td style="padding:15px; text-align:center;"><span class="badge" style="background:${f.graves >= 1 ? '#fff3e0' : '#e8f5e9'}; color:${f.graves >= 1 ? '#e65100' : '#2e7d32'};">${f.graves >= 1 ? 'Crítico' : 'Seguimiento'}</span></td>
              <td style="padding:15px; text-align:right; display:flex; gap:8px; justify-content:flex-end;">
                  <button class="btn btn-outline btn-xs" style="border-color:var(--primary); color:var(--primary)" onclick="window.showAlumnoExpediente('${f.id}')">Ver Expediente</button>
                  <button class="btn btn-xs" style="background:var(--success); color:white; border:none;" onclick="window.abrirModalAtencionFoco('${f.id}', '${f.nombre}')">Atender</button>
              </td>
            </tr>`).join('');
    } catch(e) { console.error("Focos Rojos Error:", e); }
};

window.loadHistorialReportesApoyo = async (fechaSeleccionada) => {
    const cont = document.getElementById('historialReportesApoyo');
    if(!cont) return;
    
    // Si no hay fecha, usamos hoy
    const fecha = fechaSeleccionada || new Date().toLocaleDateString('en-CA');
    const startOfDay = `${fecha}T00:00:00.000Z`;
    const endOfDay = `${fecha}T23:59:59.999Z`;

    try {
        const { data, error } = await supabaseClient
            .from('reportes_conducta')
            .select('*, alumnos(nombre, matricula), perfiles(nombre, rol)')
            .gte('fecha', startOfDay)
            .lte('fecha', endOfDay)
            .order('fecha', { ascending: false });

        if(error) throw error;
        
        if(!data || data.length === 0) {
            cont.innerHTML = `
                <div style="padding:60px; text-align:center; color:var(--text-muted)">
                    <i class="fa-solid fa-calendar-xmark fa-3x" style="opacity:0.3; margin-bottom:15px;"></i>
                    <p>No se encontraron reportes para el día <b>${new Date(fecha).toLocaleDateString()}</b>.</p>
                </div>`;
            return;
        }

        cont.innerHTML = `
            <div style="margin-bottom:10px; font-size:0.85rem; color:var(--text-muted);">
                Mostrando los últimos <b>${data.length}</b> reportes del día.
            </div>
            ${data.map(r => {
                const hour = new Date(r.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                const sevColor = r.gravedad === 'Grave' ? 'var(--danger)' : (r.gravedad === 'Moderado' ? 'var(--warning)' : 'var(--success)');
                return `
                <div class="card" style="border-left: 5px solid ${sevColor}; padding:16px; background:white; position:relative; box-shadow:var(--shadow-sm);">
                   <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                      <span style="font-size:0.8rem; color:var(--text-muted)">
                        <i class="fa-solid fa-clock"></i> <b>${hour}</b> | 
                        <i class="fa-solid fa-user-tie"></i> <b>${r.perfiles?.nombre || 'Maestro'}</b> 
                        <span style="text-transform:uppercase; font-size:0.7rem; background:#eee; padding:2px 6px; border-radius:4px; margin-left:4px;">${r.perfiles?.rol || 'Personal'}</span>
                      </span>
                      <span class="badge" style="background:${r.resuelto ? 'var(--success)' : sevColor}; color:white">${r.resuelto ? 'Resuelto' : r.gravedad}</span>
                   </div>
                   <h4 style="margin:0 0 8px 0; color:var(--primary)">Alumno: ${r.alumnos?.nombre || '---'}</h4>
                   <p style="margin:0; font-size:0.95rem; color:var(--text-main); white-space:pre-wrap;">${r.descripcion}</p>
                   ${!r.resuelto ? `<button class="btn btn-outline btn-xs" style="margin-top:12px; border-color:var(--success); color:var(--success)" onclick="window.resolverReporte('${r.id}')"><i class="fa-solid fa-check"></i> Marcar como Resuelto</button>` : ''}
                </div>`;
            }).join('')}`;
    } catch(e) { 
        console.error("History Load Error:", e);
        cont.innerHTML = '<div style="padding:40px; text-align:center; color:var(--danger)"><i class="fa-solid fa-triangle-exclamation"></i> Error al conectar con el servidor de reportes.</div>';
    }
};

window.resolverReporte = async (id) => {
    if(!confirm("¿Deseas marcar este reporte como resuelto?")) return;
    try {
        const { error } = await supabaseClient.from('reportes_conducta').update({ resuelto: true }).eq('id', id);
        if(error) throw error;
        window.showToast("Reporte resuelto correctamente", "success");
        if(window.loadHistorialReportesApoyo) window.loadHistorialReportesApoyo();
        if(window.loadFocosRojos) window.loadFocosRojos();
    } catch(e) { console.error(e); }
};

// --- NUEVA LÓGICA DE CREACIÓN DE REPORTES (APOYO) ---

window.abrirModalReporteApoyo = () => {
    document.getElementById('modalNuevoReporteApoyo').style.display = 'block';
    document.getElementById('alumnoIdSeleccionado').value = '';
    document.getElementById('busquedaAlumnoApoyo').value = '';
    document.getElementById('descReporteApoyo').value = '';
    document.getElementById('alumnoSeleccionadoLabel').style.display = 'none';
    document.getElementById('resultadosBusquedaApoyo').style.display = 'none';
};

window.buscarAlumnosReporteApoyo = async (val) => {
    const resDiv = document.getElementById('resultadosBusquedaApoyo');
    if(!val || val.length < 2) {
        resDiv.style.display = 'none';
        return;
    }
    try {
        const { data, error } = await supabaseClient
            .from('alumnos')
            .select('id, nombre, matricula, grupos(nombre)')
            .or(`nombre.ilike.%${val}%,matricula.ilike.%${val}%`)
            .limit(5);

        if(error) throw error;
        if(data && data.length > 0) {
            resDiv.innerHTML = data.map(a => `
                <div style="padding:10px; border-bottom:1px solid var(--border); cursor:pointer; font-size:0.85rem;" 
                     onmouseover="this.style.background='#f0f0f0'" 
                     onmouseout="this.style.background='white'"
                     onclick="window.seleccionarAlumnoReporteApoyo('${a.id}', '${a.nombre}', '${a.grupos?.nombre || 'S/G'}')">
                    <b>${a.nombre}</b><br><small style="color:var(--text-muted)">${a.matricula} - ${a.grupos?.nombre || 'S/G'}</small>
                </div>
            `).join('');
            resDiv.style.display = 'block';
        } else {
            resDiv.innerHTML = '<div style="padding:10px; font-size:0.85rem; color:var(--text-muted)">No se encontraron alumnos</div>';
            resDiv.style.display = 'block';
        }
    } catch(e) { console.error(e); }
};

window.seleccionarAlumnoReporteApoyo = (id, nombre, grupo) => {
    document.getElementById('alumnoIdSeleccionado').value = id;
    const label = document.getElementById('alumnoSeleccionadoLabel');
    label.innerHTML = `<i class="fa-solid fa-user-check"></i> Seleccionado: <b>${nombre}</b> (${grupo})`;
    label.style.display = 'block';
    document.getElementById('busquedaAlumnoApoyo').value = '';
    document.getElementById('resultadosBusquedaApoyo').style.display = 'none';
};

window.guardarReporteApoyo = async () => {
    const aid = document.getElementById('alumnoIdSeleccionado').value;
    const cat = document.getElementById('categoriaReporteApoyo').value;
    const sev = document.getElementById('gravedadReporteApoyo').value;
    const desc = document.getElementById('descReporteApoyo').value;
    
    if(!aid) return alert("Por favor, selecciona un alumno de la lista.");
    if(!desc.trim()) return alert("Por favor, describe la situación.");

    const btn = document.getElementById('btnGuardarReporteApoyo');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) throw new Error("Sin sesión activa.");

        const finalDesc = `[${cat.toUpperCase()}] ${desc.trim()}`;

        const { error } = await supabaseClient.from('reportes_conducta').insert([{
            id: crypto.randomUUID(),
            alumno_id: aid,
            autor_id: u.data.user.id,
            descripcion: finalDesc,
            gravedad: sev,
            resuelto: false,
            plantel_id: state.plantelId
        }]);

        if(error) throw error;

        // VIGILANCIA AUTOMÁTICA: Regla de los 3 Graves
        const { count: gravesCount } = await supabaseClient
            .from('reportes_conducta')
            .select('*', { count: 'exact', head: true })
            .eq('alumno_id', aid)
            .eq('gravedad', 'Grave')
            .eq('resuelto', false);

        if(gravesCount >= 3) {
            // Enviar citatorio formal automático
            await supabaseClient.from('comunicados').insert([{
                autor_id: u.data.user.id,
                titulo: `🚨 CITATORIO URGENTE: Seguimiento Conductual`,
                mensaje: `Estimado alumno y padre de familia/tutor:\n\nSe ha detectado una acumulación crítica de ${gravesCount} reportes graves sin atender. ES REQUISITO INDISPENSABLE presentarse en el área de Trabajo Social para una junta de seguimiento y firma de compromisos.\n\nEl acceso al portal podría verse limitado si no se atiende este citatorio.`,
                audiencia: `Alumno_${aid}`,
                tipo: 'General',
                plantel_id: state.plantelId
            }]);
            window.showToast("Citatorio automático enviado por acumulación de reportes", "warning");
        } else if(sev === 'Grave' || cat === 'Conducta') {
            await supabaseClient.from('comunicados').insert([{
                autor_id: u.data.user.id,
                titulo: `Aviso de Incidencia: ${cat}`,
                mensaje: `Se ha registrado un reporte de tipo ${cat} (${sev}) para seguimiento de Trabajo Social.\n\nDescripción breve: ${desc.substring(0, 100)}...`,
                audiencia: `Alumno_${aid}`,
                tipo: 'General',
                plantel_id: state.plantelId
            }]);
        }

        window.showToast("Reporte levantado con éxito", "success");
        document.getElementById('modalNuevoReporteApoyo').style.display = 'none';
        
        // Refrescar lista
        if(window.loadHistorialReportesApoyo) window.loadHistorialReportesApoyo();
        if(window.loadFocosRojos) window.loadFocosRojos();
        
    } catch(e) {
        console.error(e);
        alert("Error al guardar: " + e.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Guardar Reporte';
    }
};

window.abrirModalAtencionFoco = (id, nombre) => {
    document.getElementById('modalAtencionFoco').style.display = 'block';
    document.getElementById('atencionAlumnoId').value = id;
    document.getElementById('atencionAlumnoNombre').innerHTML = `<i class="fa-solid fa-user"></i> Alumno: ${nombre}`;
    document.getElementById('atencionProcedimiento').value = '';
    document.getElementById('atencionCompromisos').value = '';
};

window.guardarAtencionFoco = async () => {
    const aid = document.getElementById('atencionAlumnoId').value;
    const proc = document.getElementById('atencionProcedimiento').value;
    const comp = document.getElementById('atencionCompromisos').value;

    if(!proc.trim() || !comp.trim()) return alert("Por favor, completa ambos campos para el acta de resolución.");

    const btn = document.getElementById('btnConfirmarResolucion');
    const old = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando resolución...';

    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) throw new Error("Sin sesión activa");

        // DEBUG: Verificar ID antes de guardar
        console.log("GUARDANDO INTERVENCION PARA ALUMNO ID:", aid);
        
        // 1. Guardar el acta de intervención
        const { error: errInt } = await supabaseClient.from('intervenciones_conducta').insert([{
            alumno_id: aid,
            maestro_id: u.data.user.id,
            procedimiento: proc,
            compromisos: comp,
            plantel_id: state.plantelId
        }]);
        if(errInt) {
            console.error("Error INSERT:", errInt);
            throw new Error("No se pudo guardar en la base de datos: " + errInt.message);
        }

        // 2. Resolver TODOS los reportes pendientes del alumno
        const { error: errUpd } = await supabaseClient
            .from('reportes_conducta')
            .update({ resuelto: true })
            .eq('alumno_id', aid);
        if(errUpd) throw errUpd;

        // 3. Notificar al alumno del cierre
        await supabaseClient.from('comunicados').insert([{
            autor_id: u.data.user.id,
            titulo: `✅ SITUACIÓN ATENDIDA Y RESUELTA`,
            mensaje: `Se ha concluido la junta de seguimiento conductual.\n\nPROCEDIMIENTO: ${proc.substring(0, 100)}...\nCOMPROMISOS: ${comp.substring(0, 100)}...\n\nTu expediente ha sido actualizado. ¡Gracias por tu compromiso!`,
            audiencia: `Alumno_${aid}`,
            plantel_id: state.plantelId
        }]);

        window.showToast("Atención registrada y reportes resueltos", "success");
        document.getElementById('modalAtencionFoco').style.display = 'none';

        // Refrescar vistas
        if(window.loadFocosRojos) window.loadFocosRojos();
        if(window.loadHistorialReportesApoyo) window.loadHistorialReportesApoyo();

    } catch(e) {
        console.error(e);
        alert("Error al procesar: " + e.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = old;
    }
};

window.showAlumnoExpediente = async (idAlumno) => {
    const drawer = document.getElementById('expedienteDrawer');
    const content = document.getElementById('expedienteContent');
    if(!drawer || !content) return;
    drawer.style.display = 'block';
    
    content.innerHTML = '<div style="padding:40px; text-align:center;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p>Cargando expediente unificado...</p></div>';
    
    try {
        const id = String(idAlumno).trim();
        const [alRes, repsRes, intervsRes] = await Promise.all([
            supabaseClient.from('alumnos').select('*, grupos(nombre)').eq('id', id).single(),
            supabaseClient.from('reportes_conducta').select('*, perfiles(nombre)').eq('alumno_id', id).order('fecha', { ascending: false }),
            supabaseClient.from('intervenciones_conducta').select('*').eq('alumno_id', id).order('fecha', { ascending: false })
        ]);

        const al = alRes.data;
        const reps = repsRes.data || [];
        const intervs = intervsRes.data || [];

        if(!al) throw new Error("Alumno no encontrado");

        content.innerHTML = `
            <!-- Encabezado -->
            <div style="padding:24px; border-bottom:1px solid var(--border); background: var(--page-bg); text-align:center; position:relative;">
                <button class="btn-close" onclick="document.getElementById('expedienteDrawer').style.display='none'" style="position:absolute; top:12px; right:12px; border:none; background:none; font-size:1.4rem; cursor:pointer;">&times;</button>
                <div style="width:70px; height:70px; border-radius:50%; background:var(--primary); color:white; display:grid; place-items:center; margin:0 auto 10px auto; font-size:1.8rem; font-weight:bold;">${al.nombre.substring(0,1)}</div>
                <h3 style="margin:0;">${al.nombre}</h3>
                <p style="color:var(--text-muted); margin:4px 0 0 0; font-size:0.85rem;">Matrícula: ${al.matricula} | Grupo: ${al.grupos?.nombre || 'S/G'}</p>
            </div>

            <div style="padding:20px; display:flex; flex-direction:column; gap:30px;">
                
                <!-- Sección Conducta -->
                <section>
                    <h4 style="margin-bottom:12px; border-bottom:2px solid var(--warning); padding-bottom:5px;">
                        <i class="fa-solid fa-shield-halved"></i> Reportes de Conducta
                    </h4>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${reps.length > 0 ? reps.map(r => `
                            <div style="font-size:0.85rem; border:1px solid var(--border); border-radius:8px; padding:10px; border-left:4px solid ${r.gravedad === 'Grave' ? 'var(--danger)' : 'var(--warning)'}">
                                <div style="display:flex; justify-content:space-between;"><b>${r.gravedad}</b> <small>${new Date(r.fecha).toLocaleDateString()}</small></div>
                                <p style="margin:4px 0;">${r.descripcion}</p>
                                <small style="color:var(--text-muted)">Por: ${r.perfiles?.nombre || 'Maestro'}</small>
                            </div>
                        `).join('') : '<p style="color:var(--text-muted); font-style:italic;">Sin reportes registrados.</p>'}
                    </div>
                </section>

                <!-- Sección Acuerdos -->
                <section>
                    <h4 style="margin-bottom:12px; border-bottom:2px solid var(--success); padding-bottom:5px;">
                        <i class="fa-solid fa-handshake-angle"></i> Acuerdos y Compromisos
                    </h4>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${intervs.length > 0 ? intervs.map(i => `
                            <div style="font-size:0.85rem; background:#f1f8e9; border:1px solid #c8e6c9; border-radius:8px; padding:10px;">
                                <b>Atención de Trabajo Social</b> <small style="float:right">${new Date(i.fecha).toLocaleDateString()}</small>
                                <p style="margin:4px 0;"><strong>Vía:</strong> ${i.procedimiento}</p>
                                <p style="margin:4px 0; font-style:italic;">"${i.compromisos}"</p>
                            </div>
                        `).join('') : '<p style="color:var(--text-muted); font-style:italic;">No hay acuerdos firmados.</p>'}
                    </div>
                </section>

            </div>
        `;

    } catch(e) { 
        console.error(e);
        content.innerHTML = `<div style="padding:40px; text-align:center; color:var(--danger)"><p>Error: ${e.message}</p></div>`; 
    }
};

function renderApoyoSalud() {
  return `
    <div class="page-header">
      <h2 class="page-title">Expediente de Salud y Accidentes</h2>
      <p class="page-subtitle">Control Médico, Padecimientos crónicos y Seguimiento de Incidentes.</p>
    </div>
    
    <div style="display:flex; gap:24px; flex-wrap:wrap;">
      <div class="card" style="flex: 1; min-width: 350px;">
        <h3 style="margin-bottom: 16px;"><i class="fa-solid fa-notes-medical" style="color:var(--primary)"></i> Registrar Nueva Atención</h3>
        <div class="form-group">
          <label class="form-label">Buscar Estudiante</label>
          <div style="position:relative">
            <input type="text" id="busquedaSaludInput" class="form-input" placeholder="Nombre o matrícula..." oninput="window.liveSearchAlumnos(this.value, 'resSaludAlu')">
            <div id="resSaludAlu" class="card shadow" style="position:absolute; width:100%; z-index:100; display:none; background:white;"></div>
          </div>
          <input type="hidden" id="selectedAluIdSalud">
        </div>
        <div class="form-group">
          <label class="form-label">Motivo / Síntoma</label>
          <input type="text" class="form-input" id="motivoSalud" placeholder="Ej. Dolor de cabeza, herida leve...">
        </div>
        <div class="form-group">
          <label class="form-label">Observaciones / Acción</label>
          <textarea class="form-input" id="obsSalud" rows="3" placeholder="Acciones realizadas..."></textarea>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="window.registrarSaludAlumno()">
           <i class="fa-solid fa-notes-medical"></i> Registrar en Expediente
        </button>
      </div>

      <div class="card" style="flex: 1; min-width: 350px; border-top: 4px solid var(--warning);">
        <h3 style="margin-bottom: 16px;"><i class="fa-solid fa-file-signature" style="color:var(--warning)"></i> Generar Justificante Médico</h3>
        <div class="form-group">
          <label class="form-label">Buscar Estudiante</label>
          <div style="position:relative">
            <input type="text" id="busquedaJustificanteInput" class="form-input" placeholder="Nombre o matrícula..." oninput="window.liveSearchAlumnos(this.value, 'resJustificanteAlu')">
            <div id="resJustificanteAlu" class="card shadow" style="position:absolute; width:100%; z-index:100; display:none; background:white;"></div>
          </div>
          <input type="hidden" id="selectedAluIdJustificante">
        </div>
        <div class="form-group">
          <label class="form-label">Motivo de Falta</label>
          <input type="text" id="justificanteMotivo" class="form-input" placeholder="Ej. Influenza, Cita Médica IMSS...">
        </div>
        <div style="display:flex; gap:12px; margin-bottom:16px;">
          <div style="flex:1">
            <label class="form-label">Desde (Fecha)</label>
            <input type="date" id="justificanteInicio" class="form-input">
          </div>
          <div style="flex:1">
            <label class="form-label">Hasta (Fecha)</label>
            <input type="date" id="justificanteFin" class="form-input">
          </div>
        </div>
        <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:12px;"><i class="fa-solid fa-circle-info"></i> Al generar, se notificará automáticamente a todos los maestros del alumno.</p>
        <button class="btn btn-warning" style="width:100%; color:white" onclick="window.registrarJustificanteMedico()">
           <i class="fa-solid fa-paper-plane"></i> Generar y Enviar a Maestros
        </button>
      </div>

      <div class="card" style="flex: 1.5; min-width: 450px; border-top: 4px solid var(--success);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
             <h3 style="margin:0;">Historial Médico y Justificantes</h3>
             <div style="position:relative; width:250px;">
                <div style="position:relative; width:220px;">
                    <i class="fa-solid fa-search" style="position:absolute; left:12px; top:10px; color:var(--text-muted); font-size:0.8rem"></i>
                    <input type="text" class="form-input" placeholder="Filtrar por Alumno..." oninput="window.buscarHistorialSalud(this.value)" style="padding-left:35px; border-radius:15px; font-size:0.85rem">
                    <div id="resBusquedaSaludLocal" class="card shadow-md" style="display:none; position:absolute; top:40px; left:0; right:0; z-index:100; max-height:200px; overflow-y:auto; padding:0;"></div>
                </div>
                <i class="fa-solid fa-search" style="position:absolute; left:12px; top:11px; color:var(--text-muted); font-size:0.8rem"></i>
             </div>
          </div>
          <div id="historialSaludCont" style="max-height: 500px; overflow-y:auto; padding:5px;">
             <div style="text-align:center; padding:40px; color:var(--text-muted)">
                <i class="fa-solid fa-shield-heart fa-3x" style="opacity:0.2; margin-bottom:15px"></i>
                <p>Usa el buscador para consultar el historial de salud.</p>
             </div>
          </div>
      </div>
    </div>
  `;
}

window.buscarHistorialSalud = async (query) => {
    const resDiv = document.getElementById('resBusquedaSaludLocal');
    if(!query || query.length < 2) { resDiv.style.display = 'none'; return; }
    try {
        const { data } = await supabaseClient.from('alumnos').select('*, grupos(nombre)').or(`nombre.ilike.%${query}%,matricula.ilike.%${query}%`).limit(5);
        if(!data || data.length === 0) { resDiv.style.display = 'none'; return; }
        resDiv.style.display = 'block';
        resDiv.innerHTML = data.map(a => `
            <div style="padding:10px; cursor:pointer; border-bottom:1px solid var(--border);" 
                 onclick="window.verHistorialSaludUnico('${a.id}', '${a.nombre}')">
                <b>${a.nombre}</b><br><small>${a.grupos?.nombre || 'S/G'}</small>
            </div>
        `).join('');
    } catch(e) {}
};

window.verHistorialSaludUnico = async (id, nombre) => {
    document.getElementById('resBusquedaSaludLocal').style.display = 'none';
    const cont = document.getElementById('historialSaludCont');
    cont.innerHTML = '<p style="text-align:center; padding:20px;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando expediente completo...</p>';
    
    try {
        // 1. Obtener Atenciones
        const { data: atenciones } = await supabaseClient
            .from('expedientes_salud')
            .select('*')
            .eq('alumno_id', id)
            .order('creado_en', {ascending:false});

        // 2. Obtener Justificantes
        const { data: justificantes } = await supabaseClient
            .from('justificantes_medicos')
            .select('*')
            .eq('alumno_id', id)
            .order('fecha_emision', {ascending:false});

        // 3. Unificar y Ordenar
        const historico = [
            ...(atenciones || []).map(a => ({...a, tipoItem: 'atencion', fechaRef: a.creado_en})),
            ...(justificantes || []).map(j => ({...j, tipoItem: 'justificante', fechaRef: j.fecha_emision}))
        ].sort((a, b) => new Date(b.fechaRef) - new Date(a.fechaRef));

        if(historico.length === 0) {
            cont.innerHTML = `<p style="text-align:center; padding:40px; color:var(--text-muted)">No hay registros médicos para <b>${nombre}</b>.</p>`;
            return;
        }

        cont.innerHTML = `
            <div style="margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <h4 style="margin:0; color:var(--primary)">Expediente de ${nombre}</h4>
                <button class="btn btn-xs btn-outline" onclick="window.loadHistorialSalud()">
                    <i class="fa-solid fa-rotate-left"></i> Ver Recientes
                </button>
            </div>
            ${historico.map(s => {
                if(s.tipoItem === 'atencion') {
                    return `
                      <div class="card" style="margin-bottom:10px; padding:12px; border-left:4px solid var(--primary); background:white;">
                        <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
                           <span><i class="fa-solid fa-notes-medical"></i> ATENCIÓN MÉDICA</span>
                           <span>${new Date(s.creado_en).toLocaleDateString()}</span>
                        </div>
                        <div style="font-weight:bold; margin:5px 0;">${s.tipo_alergia || 'Consulta General'}</div>
                        <p style="margin:0; font-size:0.8rem;">${s.observaciones_medicas || ''}</p>
                      </div>`;
                } else {
                    return `
                      <div class="card" style="margin-bottom:10px; padding:12px; border-left:4px solid var(--warning); background:#fffdf7;">
                        <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
                           <span><i class="fa-solid fa-file-shield" style="color:var(--warning)"></i> JUSTIFICANTE MÉDICO</span>
                           <span>${new Date(s.fecha_emision).toLocaleDateString()}</span>
                        </div>
                        <div style="font-weight:bold; margin:5px 0;">${s.motivo}</div>
                        <p style="margin:0; font-size:0.8rem; color:#856404;">
                            Rango: <strong>${new Date(s.fecha_inicio).toLocaleDateString()}</strong> al <strong>${new Date(s.fecha_fin).toLocaleDateString()}</strong>
                        </p>
                      </div>`;
                }
            }).join('')}
        `;
    } catch(e) {
        console.error(e);
        cont.innerHTML = '<p style="color:var(--danger)">Error al cargar el historial médico.</p>';
    }
};

window.emitirJustificanteSalud = async (alumnoId, nombre) => {
    const motivo = prompt(`Justificante para ${nombre}. \nEscribe el motivo (Médico / Familiar) y duración:`, "Médico - 2 días");
    if(!motivo) return;

    try {
        const uRes = await supabaseClient.auth.getUser();
        if(!uRes.data.user) throw new Error("No hay sesión");

        // Obtenemos el grupo del alumno
        const { data: alu } = await supabaseClient.from('alumnos').select('grupo_id').eq('id', alumnoId).single();
        if(!alu || !alu.grupo_id) {
            alert("El alumno no tiene un grupo asignado. No se puede enviar a los maestros.");
            return;
        }

        const { error } = await supabaseClient.from('comunicados').insert([{
            autor_id: uRes.data.user.id,
            titulo: `JUSTIFICANTE: ${nombre}`,
            mensaje: `Se informa que el alumno(a) ${nombre} cuenta con justificante oficial por el siguiente motivo: ${motivo}. Favor de brindar las facilidades académicas correspondientes.`,
            audiencia: `Grupo_${alu.grupo_id}`
        }]);

        if(error) throw error;
        alert("Justificante enviado exitosamente a todos los maestros del grupo.");
    } catch(e) { 
        console.error(e);
        alert("Error al enviar el justificante.");
    }
};

function renderApoyoBitacora() {
    const today = new Date().toLocaleDateString('en-CA');
    setTimeout(() => { if(window.loadApoyoBitacora) window.loadApoyoBitacora(today); }, 100);
    return `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h2 class="page-title">Bitácora Oficial del Plantel</h2>
        <p class="page-subtitle">Registro cronológico de hechos destacados para el turno escolar.</p>
      </div>
      <div class="card" style="padding:8px 16px; display:flex; align-items:center; gap:12px; border:1px solid var(--border); margin:0; background:rgba(255,255,255,0.7); backdrop-filter:blur(5px);">
         <i class="fa-solid fa-calendar-alt" style="color:var(--primary)"></i>
         <input type="date" id="fechaBitacoraApoyo" class="form-input" value="${today}" 
                style="width:auto; padding:5px; border:none; background:transparent; font-size:0.9rem; font-weight:600;"
                onchange="window.loadApoyoBitacora(this.value)">
         <button class="btn btn-outline btn-xs" onclick="document.getElementById('fechaBitacoraApoyo').value='${today}'; window.loadApoyoBitacora('${today}')" style="border-radius:8px;">Hoy</button>
      </div>
    </div>
    
    <div class="card" style="max-width: 800px; margin: 0 auto;">
       <h3 style="margin-bottom: 16px;">Añadir Entrada a la Bitácora</h3>
       <div class="form-group">
          <textarea class="form-input" id="textoBitacoraApoyo" rows="2" placeholder="Describe algún hecho relevante..."></textarea>
       </div>
       <div style="display:flex; justify-content:flex-end;">
          <button class="btn btn-primary" onclick="window.saveApoyoBitacora()">
            <i class="fa-solid fa-pen-nib"></i> Sellar Entrada
          </button>
       </div>
       <hr style="margin: 24px 0; border:0; border-top:1px solid var(--border)">
       <h3>Hechos del Día</h3>
       <div id="apoyoBitacoraTimeline" style="margin-top:16px;">
          <p style="text-align:center; color:var(--text-muted)">Cargando registros...</p>
       </div>
    </div>
  `;
}

function renderApoyoPrefectura() {
  setTimeout(() => { 
    if(window.loadResumenEntrada) window.loadResumenEntrada();
    if(window.loadGruposControlAsistencia) window.loadGruposControlAsistencia();
    window.initPortalAsistenciaEstado();
    // Auto-iniciar cámara en modo metralleta
    if(window.startPrefScanner) window.startPrefScanner('metralleta');
  }, 500);
  return `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
         <h2 class="page-title">Control de Accesos</h2>
         <p class="page-subtitle">Personal de Apoyo | Escáner y Registro</p>
      </div>
      <button class="btn btn-outline" onclick="window.stopPrefScanner().then(() => window.navigate('/apoyo/dashboard'))" style="border-radius:30px; background:white;">
         <i class="fa-solid fa-house"></i> Volver al Inicio
      </button>
    </div>

    <!-- Panel de Control de Estado -->
    <div class="card" style="margin-bottom:24px; border-left: 6px solid var(--primary); background: #f8fafc;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
            <div style="display:flex; align-items:center; gap:15px;">
                <div id="statIndicator" style="width:12px; height:12px; border-radius:50%; background:var(--success); box-shadow: 0 0 10px var(--success);"></div>
                <div>
                   <h4 style="margin:0; font-size:1.1rem;">Estado del Portal: <span id="txtEstadoPortal">ABIERTO (Entrada Normal)</span></h4>
                   <p id="descEstadoPortal" style="margin:0; font-size:0.8rem; color:var(--text-muted)">Los alumnos serán registrados con puntualidad.</p>
                </div>
            </div>
            <div style="display:flex; gap:10px;">
                <button id="btnFinalizarLista" class="btn btn-danger btn-sm" onclick="window.generarInasistenciasMasivas()">
                   <i class="fa-solid fa-lock"></i> Finalizar Pase
                </button>
                <button id="btnActivarRetardo" class="btn btn-warning btn-sm" onclick="window.cambiarEstadoAsistencia('retardo')" style="display:none;">
                   <i class="fa-solid fa-clock-rotate-left"></i> Abrir para Retardos
                </button>
                <button id="btnVolverNormal" class="btn btn-primary btn-sm" onclick="window.cambiarEstadoAsistencia('normal')" style="display:none;">
                   <i class="fa-solid fa-unlock"></i> Regresar a Normal
                </button>
            </div>
        </div>
    </div>

    <div class="card" style="text-align:center; padding: 40px; min-height: 440px; display:flex; flex-direction:column; justify-content:center; align-items:center; border-radius:30px; background: white; box-shadow: var(--shadow-xl);">
        
        <!-- PANEL DE ESTADO AUTO-ACTIVABLE -->
        <div id="pref-status-info" style="margin-bottom:20px;">
            <h3 style="color:var(--primary); font-size:1.5rem; margin-bottom:5px;">Escáner Institucional Activo</h3>
            <p style="color:var(--text-muted); font-size:0.9rem;">Registrando ingresos masivos en Modo Metralleta.</p>
        </div>

        <div id="reader-prefectura" style="width:100%; max-width:500px; height:350px; background:#1e293b; border-radius:24px; overflow:hidden; border: 4px solid var(--primary); box-shadow: 0 10px 25px rgba(0,0,0,0.2);"></div>
        
        <div id="pref-feedback" style="margin-top:20px; width:100%; max-width:500px; min-height:80px;"></div>
        
        <div style="display:flex; gap:12px; margin-top:20px;">
            <button id="btn-stop-pref" class="btn btn-outline" onclick="window.stopPrefScanner()" style="display:none; border-radius:30px; padding:10px 25px;">
                <i class="fa-solid fa-power-off"></i> Pausar Cámara
            </button>
            <button id="btn-resume-pref" class="btn btn-primary" onclick="window.startPrefScanner('metralleta')" style="display:none; border-radius:30px; padding:10px 25px;">
                <i class="fa-solid fa-play"></i> Reanudar Cámara
            </button>
        </div>
    </div>

    <!-- RESUMEN EN TIEMPO REAL -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px; margin-top:30px;">
        <div class="card" style="border-radius:24px;">
           <h3 style="margin-bottom:16px; color:var(--primary);"><i class="fa-solid fa-chart-pie"></i> Avance de Hoy</h3>
           <div id="resumenEntradaCont" style="display:flex; flex-direction:column; gap:12px; max-height:400px; overflow-y:auto; padding-right:10px;">
              <p style="text-align:center; padding:20px; opacity:0.5;">Cargando estadísticas...</p>
           </div>
        </div>

        <div class="card" style="border-radius:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="margin:0;"><i class="fa-solid fa-clipboard-list"></i> Asistencias</h3>
                <input type="date" id="fechaAsistenciaApoyo" class="form-control" style="width:auto; height:36px; padding:4px 10px; font-size:0.8rem;" onchange="window.loadAsistenciasApoyo()" value="${new Date().toLocaleDateString('en-CA')}">
            </div>
            <div style="display:flex; gap:10px; margin-bottom:16px;">
                <select class="form-select" id="selGrupoAsistenciaApoyo" onchange="window.loadAsistenciasApoyo()" style="flex:1;">
                    <option value="">Selecciona Grupo...</option>
                </select>
                <button class="btn btn-primary btn-sm" onclick="window.loadAsistenciasApoyo()"><i class="fa-solid fa-rotate"></i></button>
            </div>
            <div style="max-height:500px; overflow-y:auto; border:1px solid var(--border); border-radius:12px;">
                <table class="risk-table" style="width:100%">
                    <thead><tr><th>Nombre</th><th style="text-align:center">Hora</th><th style="text-align:right">Modo</th></tr></thead>
                    <tbody id="tablaAsistenciasApoyo">
                        <tr><td colspan="3" style="text-align:center; padding:20px;">Sin selección</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  `;
}

window._estadoPaseLista = 'normal';
window._fechaUltimoReset = null;

window.initPortalAsistenciaEstado = () => {
    const today = new Date().toLocaleDateString('en-CA');
    if(window._fechaUltimoReset !== today) {
        window._estadoPaseLista = 'normal';
        window._fechaUltimoReset = today;
    }
    window.actualizarUIPortal();
};

window.loadGruposControlAsistencia = async () => {
    const sel = document.getElementById('selGrupoAsistenciaApoyo');
    if(!sel) return;
    try {
        const { data: grupos } = await supabaseClient.from('grupos').select('*').order('nombre');
        if(grupos) {
            sel.innerHTML = '<option value="">Todos los Grupos</option>' + 
                grupos.map(g => `<option value="${g.id}">${g.nombre}</option>`).join('');
        }
    } catch(e) { console.error(e); }
};

window.loadResumenEntrada = async () => {
    const cont = document.getElementById('resumenEntradaCont');
    if(!cont) return;
    try {
        const hoy = new Date().toLocaleDateString('en-CA');
        
        const { count: totalAlu } = await supabaseClient.from('alumnos').select('*', { count: 'exact', head: true });
        
        const { data: asistencias } = await supabaseClient.from('accesos_plantel')
            .select('estado')
            .eq('fecha', hoy);
        
        const puntuales = (asistencias || []).filter(a => a.estado === 'Asistencia').length;
        const retardos = (asistencias || []).filter(a => a.estado === 'Retardo').length;
        const totalLlegaron = puntuales + retardos;
        const faltan = (totalAlu || 0) - totalLlegaron;
        
        const pct = totalAlu > 0 ? Math.round((totalLlegaron / totalAlu) * 100) : 0;

        cont.innerHTML = `
            <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:3rem; font-weight:800; color:var(--primary); line-height:1;">${pct}%</div>
                <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:5px;">Plantel Cubierto</div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <div class="card" style="padding:10px; text-align:center; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:15px;">
                    <div style="font-size:1.2rem; font-weight:bold; color:#166534;">${puntuales}</div>
                    <div style="font-size:0.7rem; color:#16a34a;">Puntuales</div>
                </div>
                <div class="card" style="padding:10px; text-align:center; background:#fffbeb; border:1px solid #fde68a; border-radius:15px;">
                    <div style="font-size:1.2rem; font-weight:bold; color:#92400e;">${retardos}</div>
                    <div style="font-size:0.7rem; color:#d97706;">Retardos</div>
                </div>
            </div>
            <div class="card" style="padding:12px; margin-top:10px; display:flex; justify-content:space-between; align-items:center; border-radius:15px; border-left:4px solid var(--danger);">
                <span style="font-size:0.85rem; color:var(--text-muted);">Aún no ingresan:</span>
                <span style="font-weight:bold; color:var(--danger);">${faltan > 0 ? faltan : 0} alumnos</span>
            </div>
        `;
    } catch(e) { console.error(e); }
};

window.loadAsistenciasApoyo = async () => {
    const table = document.getElementById('tablaAsistenciasApoyo');
    const grupoId = document.getElementById('selGrupoAsistenciaApoyo').value;
    const fecha = document.getElementById('fechaAsistenciaApoyo').value;
    if(!table) return;

    try {
        let query = supabaseClient.from('accesos_plantel')
            .select('*, alumnos(nombre, grupo_id)')
            .eq('fecha', fecha)
            .order('creado_en', {ascending: false});
        
        const { data: rawData } = await query;
        const data = grupoId ? (rawData || []).filter(a => a.alumnos?.grupo_id === grupoId) : (rawData || []);

        if(!data || data.length === 0) {
            table.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:var(--text-muted);">Sin ingresos registrados aún.</td></tr>';
            return;
        }

        table.innerHTML = data.map(a => `
            <tr>
                <td style="font-size:0.85rem; padding:10px;">
                    <div style="font-weight:600;">${a.alumnos?.nombre || 'Alumno'}</div>
                </td>
                <td style="text-align:center; font-size:0.8rem; color:var(--text-muted);">${new Date(a.creado_en).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                <td style="text-align:right;">
                    <span class="badge" style="background:${a.estado==='Retardo'?'#fef3c7':'#f0fdf4'}; color:${a.estado==='Retardo'?'#92400e':'#166534'}; font-size:0.65rem; border:none; padding:4px 8px; border-radius:6px;">
                        ${a.estado}
                    </span>
                </td>
            </tr>
        `).join('');
    } catch(e) { console.error(e); }
};

window.generarInasistenciasMasivas = async () => {
    if(!confirm("¿FINALIZAR ACCESO GENERAL? Se marcará 'Inasistencia' en el reporte de plantel a TODOS los alumnos que no hayan ingresado hoy.")) return;

    const btn = document.getElementById('btnFinalizarLista');
    const oldHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cerrando Puerta...';
    btn.disabled = true;

    try {
        const hoy = new Date().toLocaleDateString('en-CA');
        
        // 1. Obtener TODOS los alumnos de la escuela
        const { data: alumnos } = await supabaseClient.from('alumnos').select('id');
        
        // 2. Obtener quienes ya tienen acceso hoy
        const { data: registrados } = await supabaseClient.from('accesos_plantel')
            .select('alumno_id')
            .eq('fecha', hoy);
        
        const idsRegistrados = new Set((registrados || []).map(r => r.alumno_id));
        const faltantes = (alumnos || []).filter(a => !idsRegistrados.has(a.id));

        if(faltantes.length > 0) {
            const u = await supabaseClient.auth.getUser();
            
            // 1. Registrar Inasistencias en la tabla de accesos
            const inserts = faltantes.map(f => ({
                alumno_id: f.id,
                estado: 'Inasistencia',
                fecha: hoy,
                registrador_id: u.data.user?.id,
                plantel_id: state.plantelId
            }));

            const { error: insErr } = await supabaseClient.from('accesos_plantel').insert(inserts);
            if(insErr) {
                console.error(">>> ERROR REGISTRO INASISTENCIAS:", insErr);
                throw insErr;
            }

            // 2. Enviar Comunicados Automáticos a Alumnos
            const msgInserts = faltantes.map(f => ({
                autor_id: u.data.user?.id,
                titulo: "⚠️ Aviso de Inasistencia Institucional",
                audiencia: `Alumno_${f.id}`,
                mensaje: `Se ha registrado una INASISTENCIA en el portal de acceso escolar hoy (${new Date().toLocaleDateString()}). Es indispensable que acudas a Trabajo Social para realizar la justificación correspondiente.`,
                plantel_id: state.plantelId
            }));

            const { error: msgErr } = await supabaseClient.from('comunicados').insert(msgInserts);
            if(msgErr) {
                console.warn(">>> ADVERTENCIA: Las inasistencias se guardaron pero no se pudieron enviar los mensajes:", msgErr);
            }
            
            window.showToast(`${faltantes.length} inasistencias registradas y avisos enviados.`, "success");
        } else {
            window.showToast("Asistencia al plantel completa.", "info");
        }

        window.cambiarEstadoAsistencia('finalizado');
        window.loadResumenEntrada();
        window.loadAsistenciasApoyo();

    } catch(e) {
        console.error(e);
        const errorMsg = e.message || e.details || "Error desconocido";
        window.showToast("No se pudo cerrar el pase: " + errorMsg, "error");
    } finally {
        btn.innerHTML = oldHtml;
        btn.disabled = false;
    }
};

window.cambiarEstadoAsistencia = (nuevo) => {
    window._estadoPaseLista = nuevo;
    window.actualizarUIPortal();
    let msg = "Estado actualizado";
    if(nuevo === 'finalizado') msg = "Pase de lista CERRADO.";
    if(nuevo === 'retardo') msg = "Portal en MODO RETARDOS.";
    alert(msg);
};

window.actualizarUIPortal = () => {
    const txt = document.getElementById('txtEstadoPortal');
    const desc = document.getElementById('descEstadoPortal');
    const indicator = document.getElementById('statIndicator');
    const btnFin = document.getElementById('btnFinalizarLista');
    const btnRet = document.getElementById('btnActivarRetardo');
    const btnNorm = document.getElementById('btnVolverNormal');
    if(!txt) return;

    if(window._estadoPaseLista === 'normal') {
        txt.innerText = "ABIERTO (Entrada Normal)";
        txt.style.color = "var(--success)";
        desc.innerText = "Asistencias puntuales.";
        indicator.style.background = "var(--success)";
        btnFin.style.display = "inline-flex";
        btnRet.style.display = "none";
        btnNorm.style.display = "none";
        const psc = document.getElementById('pref-inicio-scan');
        if(psc) { psc.style.opacity = "1"; psc.style.pointerEvents = "auto"; }
    } else if(window._estadoPaseLista === 'finalizado') {
        txt.innerText = "CERRADO";
        txt.style.color = "var(--danger)";
        desc.innerText = "Re-activa para registrar retrasos.";
        indicator.style.background = "var(--danger)";
        btnFin.style.display = "none";
        btnRet.style.display = "inline-flex";
        btnNorm.style.display = "inline-flex";
        const psc = document.getElementById('pref-inicio-scan');
        if(psc) { psc.style.opacity = "0.3"; psc.style.pointerEvents = "none"; }
    } else if(window._estadoPaseLista === 'retardo') {
        txt.innerText = "MODO RETARDO ACTIVO";
        txt.style.color = "var(--warning)";
        desc.innerText = "Registros marcados como RETARDO.";
        indicator.style.background = "var(--warning)";
        btnFin.style.display = "inline-flex";
        btnRet.style.display = "none";
        btnNorm.style.display = "inline-flex";
        const psc = document.getElementById('pref-inicio-scan');
        if(psc) { psc.style.opacity = "1"; psc.style.pointerEvents = "auto"; }
    }
};

function renderPersonalComunicados(rolVisita) {
  const hoyStr = new Date().toLocaleDateString('en-CA');
  setTimeout(() => { if(window.loadTimelinePersonal) window.loadTimelinePersonal(hoyStr); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Avisos y Comunicados Oficiales</h2>
      <p class="page-subtitle">Información general proveniente de la Dirección y Administración.</p>
    </div>

    <!-- CONTROL DE CALENDARIO -->
    <div class="card" style="max-width:800px; margin:0 auto 24px auto; padding: 16px;">
       <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
             <label class="form-label" style="font-size:0.85rem; margin-bottom:4px;">Consultar Historial por Fecha:</label>
             <div style="display:flex; gap:8px;">
                <input type="date" class="form-input" id="filtroFechaAvisos" value="${hoyStr}" style="max-width:200px; margin:0;" onchange="window.loadTimelinePersonal(this.value)">
                <button class="btn btn-outline" style="padding:8px 12px;" onclick="document.getElementById('filtroFechaAvisos').value='${hoyStr}'; window.loadTimelinePersonal('${hoyStr}')">Hoy</button>
             </div>
          </div>
          <div style="text-align:right">
             <span class="badge" style="background:var(--primary); color:white;">Filtrado por: ${rolVisita}</span>
          </div>
       </div>
    </div>

    <div class="card" style="max-width:800px; margin:0 auto;">
      <div id="timelinePersonalContenedor" style="display:flex; flex-direction:column; gap:20px;">
         <div style="padding:40px; text-align:center;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="color:var(--text-muted); margin-top:10px;">Buscando avisos...</p></div>
      </div>
    </div>
  `;
}

function renderAlumnoCredencial() {
  setTimeout(() => { if(window.loadCredencialAlumno) window.loadCredencialAlumno(); }, 100);
  return `
    <div class="mobile-app" style="background:var(--page-bg)">
      <div class="mobile-header" style="text-align: center; padding-top: 32px; padding-bottom: 40px; background:var(--primary); color:white;">
        <h2>Credencial Digital</h2>
        <p>Ciclo Escolar 2026-II</p>
      </div>
      <div class="mobile-content" style="padding: 20px;">
        <div class="card" id="studentCredContent" style="text-align:center; padding:32px 20px;">
             <div id="studentQRContainer" style="margin: 0 auto 24px auto; background:#fff; width:260px; height:260px; border-radius:15px; display:flex; align-items:center; justify-content:center; border:2px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <i class="fa-solid fa-qrcode fa-4x" style="opacity:0.1"></i>
             </div>
             <h2 id="credName" style="color: var(--primary); margin-bottom: 4px;">Cargando...</h2>
             <span id="credMatricula" class="badge" style="background: var(--page-bg); color: var(--text-muted);">Matrícula: ...</span>
             <h3 id="credGrupo" style="font-weight: 800; font-size: 1.8rem; color: var(--primary); margin-top:20px;">...</h3>
             <p style="text-transform: uppercase; font-size: 0.7rem; color: var(--secondary); margin-top:8px;">Secundaria Técnica 150</p>
        </div>
      </div>
    </div>
  `;
}

window.loadCredencialAlumno = async () => {
    const qrCont = document.getElementById('studentQRContainer');
    const nameEl = document.getElementById('credName');
    const matEl = document.getElementById('credMatricula');
    const grEl = document.getElementById('credGrupo');
    
    if(!qrCont || !state.user?.email) return;

    try {
        const { data, error } = await supabaseClient.from('alumnos')
            .select('*, grupos(nombre)')
            .eq('contacto_email', state.user.email)
            .single();
            
        if(error || !data) {
            nameEl.innerText = "Error al cargar perfil";
            matEl.innerText = "No se encontró registro para: " + state.user.email;
            return;
        }

        nameEl.innerText = data.nombre;
        matEl.innerText = "Matrícula: " + data.matricula;
        grEl.innerText = data.grupos?.nombre || "Sin Grupo";

        // Generar QR
        qrCont.innerHTML = '';
        if(window.qrcode) {
            let qr = qrcode(0, 'M');
            qr.addData(data.matricula);
            qr.make();
            qrCont.innerHTML = qr.createImgTag(6, 12); // Aumentado tamaño de celda y margen
            qrCont.querySelector('img').style.width = '100%';
            qrCont.querySelector('img').style.height = '100%';
            qrCont.querySelector('img').style.borderRadius = '10px';
            qrCont.querySelector('img').style.padding = '10px'; // Un poco de espacio interno
        } else {
            qrCont.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data.matricula}" style="width:100%; border-radius:10px; padding:10px;">`;
        }

    } catch(err) {
        console.error(err);
        nameEl.innerText = "Error de conexión";
    }
};

function renderAlumnoTimeline() {
  setTimeout(() => { if(window.loadTimelineAlumno) window.loadTimelineAlumno(); }, 100);
  return `
    <div class="mobile-app" style="background:var(--page-bg)">
      <div class="mobile-header" style="background:var(--primary); color:white; padding:20px;">
        <h2 style="margin:0">Línea de Tiempo</h2>
        <p style="margin:0; opacity:0.8">Avisos y Comunicados</p>
      </div>
      
      <div style="background:white; border-bottom:1px solid var(--border); padding:10px 16px; display:flex; gap:10px; align-items:center; overflow-x:auto;">
         <button class="btn btn-outline" style="white-space:nowrap; font-size:0.8rem; padding:6px 12px; border-radius:20px;" onclick="window.loadTimelineAlumno(false)">Recientes</button>
         <div style="height:20px; width:1px; background:var(--border)"></div>
         <span style="font-size:0.75rem; color:var(--text-muted); white-space:nowrap;">Archivo Escolar:</span>
         <input type="date" id="filtroFechaAvisos" class="form-control" style="font-size:0.8rem; width:130px; padding:4px 8px;" onchange="window.loadTimelineAlumno(true)">
      </div>

      <div class="mobile-content" style="padding:16px;">
        <div id="timelineAlumnoContenedor"></div>
      </div>
    </div>
  `;
}

function renderAlumnoBoletas() {
  setTimeout(() => { if(window.loadBoletasAlumno) window.loadBoletasAlumno(); }, 150);
  return `
    <div class="mobile-app" style="background:var(--page-bg)">
      <div class="mobile-header" style="text-align: center; padding-top: 32px; padding-bottom: 40px; background:var(--primary); color:white;">
        <h2 style="margin:0">Mi Desempeño</h2>
        <p style="margin:5px 0 0 0; opacity:0.8; font-size:0.9rem;">Consulta tus boletas y avisos</p>
      </div>
      <div class="mobile-content" style="padding: 20px;">
         <div id="boletasContainer"></div>
      </div>
    </div>
  `;
}


function renderAlumnoTramites() {
  setTimeout(() => { if(window.loadMisTramites) window.loadMisTramites(); }, 100);
  return `
    <div class="mobile-app" style="background:var(--page-bg)">
      <div class="mobile-header" style="background:#374151; color:white; padding:20px;">
        <h2 style="margin:0">Trámites y Servicios</h2>
      </div>
      <div class="mobile-content" style="padding:16px;">
        <div class="card" style="margin-bottom:24px;">
           <label class="form-label">Solicitar Nuevo Documento</label>
           <select id="selNuevoTramite" class="form-select" style="margin-bottom:12px;">
               <option value="Constancia de Estudios Simple">Constancia de Estudios Simple</option>
               <option value="Constancia de Estudios con Promedio">Constancia de Estudios con Promedio</option>
               <option value="Historial Académico Formal">Historial Académico Formal (Kárdex)</option>
               <option value="Reposición de Credencial Escolar">Reposición de Credencial Escolar</option>
           </select>
           <button class="btn btn-primary" style="width:100%" onclick="window.solicitarTramiteAlumno()">Solicitar Trámite</button>
           <button class="btn btn-outline" style="width:100%; margin-top:10px" onclick="window.loadMisTramites()">Recargar Listado</button>
        </div>
        <div id="contenedorMisTramites"></div>
      </div>
    </div>
  `;
}

// ---- TRÁMITES ALUMNO ----

window.solicitarTramiteAlumno = async () => {
    const tipo = document.getElementById('selNuevoTramite')?.value;
    if(!tipo) return alert("Selecciona un tipo de trámite.");
    try {
        const uRes = await supabaseClient.auth.getUser();
        if(!uRes.data?.user) return alert("Sesión expirada.");

        // Obtener el registro de alumno vinculado al usuario
        const { data: alumno, error: errA } = await supabaseClient
            .from('alumnos')
            .select('id, nombre')
            .eq('contacto_email', uRes.data.user.email)
            .maybeSingle();

        if(errA || !alumno) return alert("No se encontró tu expediente de alumno. Contacta a tu admin.");

        const { error } = await supabaseClient.from('tramites').insert([{
            alumno_id: alumno.id,
            tipo: tipo,
            estado: 'Pendiente',
            plantel_id: state.plantelId
        }]);

        if(error) throw error;
        alert(`✅ Trámite "${tipo}" solicitado correctamente. El área administrativa lo procesará a la brevedad.`);
        window.loadMisTramites();
    } catch(e) {
        console.error(e);
        alert("Error al enviar la solicitud: " + e.message);
    }
};

window.loadMisTramites = async () => {
    const cont = document.getElementById('contenedorMisTramites');
    if(!cont) return;
    cont.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</p>';
    try {
        const uRes = await supabaseClient.auth.getUser();
        if(!uRes.data?.user) return;

        const { data: alumno } = await supabaseClient
            .from('alumnos')
            .select('id')
            .eq('contacto_email', uRes.data.user.email)
            .maybeSingle();

        if(!alumno) {
            cont.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">No tienes expediente registrado.</p>';
            return;
        }

        const { data, error } = await supabaseClient
            .from('tramites')
            .select('*')
            .eq('alumno_id', alumno.id)
            .order('fecha_solicitud', { ascending: false });

        if(error) throw error;

        if(!data || data.length === 0) {
            cont.innerHTML = '<div style="text-align:center; padding:24px; color:var(--text-muted);"><i class="fa-solid fa-folder-open" style="font-size:2rem; display:block; margin-bottom:8px;"></i>No tienes trámites registrados.</div>';
            return;
        }

        const colores = { Pendiente: 'var(--warning)', Subido: 'var(--success)' };
        const iconos = { Pendiente: 'fa-clock', Subido: 'fa-check-circle' };

        cont.innerHTML = data.map(t => {
            const fecha = new Date(t.fecha_solicitud).toLocaleDateString('es-MX', { dateStyle: 'medium' });
            const color = colores[t.estado] || 'var(--text-muted)';
            const icon = iconos[t.estado] || 'fa-file';
            const btnDoc = t.archivo_url
                ? `<a href="${t.archivo_url}" target="_blank" class="btn btn-outline btn-xs" style="margin-top:8px; border-color:var(--success); color:var(--success); display:inline-flex; gap:6px; align-items:center;"><i class="fa-solid fa-file-pdf"></i> Ver documento listo</a>`
                : '';
            return `
            <div style="background:var(--surface); border:1px solid var(--border); border-left:4px solid ${color}; border-radius:10px; padding:14px 16px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <span style="font-weight:600; color:var(--text-main);">${t.tipo}</span>
                    <span style="font-size:0.75rem; color:${color}; font-weight:600; display:flex; align-items:center; gap:4px;">
                        <i class="fa-solid ${icon}"></i> ${t.estado}
                    </span>
                </div>
                <p style="font-size:0.78rem; color:var(--text-muted); margin:6px 0 0;">Solicitado: ${fecha}</p>
                ${btnDoc}
            </div>`;
        }).join('');
    } catch(e) {
        console.error(e);
        cont.innerHTML = '<p style="color:var(--danger); text-align:center; padding:20px;"><i class="fa-solid fa-triangle-exclamation"></i> Error al cargar trámites.</p>';
    }
};

// ---- TRÁMITES ADMIN ----

window.loadTramitesAdmin = async () => {
    const cont = document.getElementById('tramitesRecibidosContenedor');
    if(!cont) return;
    cont.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando solicitudes...</p>';
    try {
        const { data, error } = await supabaseClient
            .from('tramites')
            .select('*, alumnos(nombre, matricula)')
            .eq('estado', 'Pendiente')
            .order('fecha_solicitud', { ascending: false });

        if(error) throw error;

        if(!data || data.length === 0) {
            cont.innerHTML = '<div style="text-align:center; padding:24px; color:var(--text-muted);"><i class="fa-solid fa-inbox" style="font-size:2rem; display:block; margin-bottom:8px;"></i>No hay trámites pendientes.</div>';
            return;
        }

        const colores = { Pendiente: 'var(--warning)', Subido: 'var(--success)' };

        cont.innerHTML = data.map(t => {
            const fecha = new Date(t.fecha_solicitud).toLocaleDateString('es-MX', { dateStyle: 'medium' });
            const alumnoNombre = t.alumnos ? `${t.alumnos.nombre} (${t.alumnos.matricula})` : 'Alumno desconocido';
            const color = colores[t.estado] || 'var(--text-muted)';
            const btnSubir = t.estado === 'Pendiente'
                ? `<button class="btn btn-success btn-xs" style="margin-top:8px;" onclick="window.selectAlumnoTramite('${t.alumno_id}', '${(t.alumnos?.nombre||'').replace(/'/g,"\\'")}', '${t.alumnos?.matricula||''}', '${t.tipo}', '${t.id}');">
                    <i class="fa-solid fa-upload"></i> Atender Solicitud
                   </button>`
                : `<a href="${t.archivo_url}" target="_blank" class="btn btn-outline btn-xs" style="margin-top:8px; color:var(--success); border-color:var(--success);"><i class="fa-solid fa-eye"></i> Ver documento</a>`;
            return `
            <div style="background:var(--surface); border:1px solid var(--border); border-left:4px solid ${color}; border-radius:10px; padding:14px 16px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:6px;">
                    <div>
                        <div style="font-weight:600; color:var(--text-main); margin-bottom:4px;">${t.tipo}</div>
                        <div style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-solid fa-user"></i> ${alumnoNombre}</div>
                        <div style="font-size:0.78rem; color:var(--text-muted);"><i class="fa-regular fa-clock"></i> ${fecha}</div>
                    </div>
                    <span style="font-size:0.75rem; color:${color}; font-weight:600; padding:3px 10px; background:${color}20; border-radius:20px;">${t.estado}</span>
                </div>
                ${btnSubir}
            </div>`;
        }).join('');
    } catch(e) {
        console.error(e);
        cont.innerHTML = '<p style="color:var(--danger); text-align:center; padding:20px;"><i class="fa-solid fa-triangle-exclamation"></i> Error al cargar solicitudes.</p>';
    }
};

window.subirTramiteManual = async () => {
    const aluId = document.getElementById('tramiteAlumnoId').value;
    const tramiteId = document.getElementById('tramiteRelacionadoId').value;
    const tipo = document.getElementById('tramiteTipo').value;
    const fileInput = document.getElementById('tramiteFile');
    const btn = document.getElementById('btnSubirTramite');

    if(!aluId || !fileInput.files[0]) {
        return window.showToast("Por favor selecciona el archivo del trámite.", "warning");
    }

    const file = fileInput.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `tramite_${aluId}_${Date.now()}.${fileExt}`;
    const filePath = `tramites/${fileName}`;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    try {
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('expedientes')
            .upload(filePath, file);

        if(uploadError) throw uploadError;

        const { data: { publicUrl } } = supabaseClient.storage.from('expedientes').getPublicUrl(filePath);

        const { error: updErr } = await supabaseClient.from('tramites')
            .update({ 
                estado: 'Subido', 
                archivo_url: publicUrl,
                fecha_emision: new Date().toISOString()
            })
            .eq('id', tramiteId);
            
        if(updErr) throw updErr;

        window.showToast("Documento enviado correctamente al estudiante.", "success");
        // Cerrar Modal
        const modal = document.getElementById('modalTramiteCarga');
        if(modal) modal.style.display = 'none';
        
        if(window.loadTramitesAdmin) window.loadTramitesAdmin();

    } catch (err) {
        console.error(err);
        window.showToast("Error al subir archivo: " + err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> ENVIAR DOCUMENTO AL ALUMNO';
    }
};

window.selectAlumnoTramite = (id, nombre, matricula, tipoTramite, tramiteRelacionadoId) => {
    const modal = document.getElementById('modalTramiteCarga');
    if(!modal) return;
    
    document.getElementById('tramiteAlumnoId').value = id;
    document.getElementById('tramiteRelacionadoId').value = tramiteRelacionadoId || '';
    document.getElementById('tramiteTipo').value = tipoTramite || 'Constancia';
    
    document.getElementById('txtAlumnoSeleccionadoTramite').innerHTML = `
        <div style="font-size:0.8rem; opacity:0.8;">Solicitante:</div>
        <div style="font-weight:bold; font-size:1.1rem;">${nombre}</div>
        <div style="font-size:0.85rem; margin-top:4px;">Matrícula: ${matricula}</div>
        <div style="font-size:0.85rem; margin-top:4px;">Documento: <b style="color:var(--primary)">${tipoTramite}</b></div>
    `;
    modal.style.display = 'block';
};

window.switchTramiteView = async (view) => {
    const btnP = document.getElementById('btnTabPendientes');
    const btnH = document.getElementById('btnTabHistorial');
    const header = document.getElementById('headerVistaTramite');
    const cont = document.getElementById('tramitesRecibidosContenedor');
    if(!btnP || !btnH || !header || !cont) return;

    if(view === 'pendientes') {
        btnP.classList.replace('btn-outline', 'btn-primary');
        btnH.classList.replace('btn-primary', 'btn-outline');
        header.innerHTML = `<h3 style="margin-bottom:8px;"><i class="fa-solid fa-inbox text-primary"></i> Bandeja de Solicitudes Pendientes</h3>
                            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">Atiende los requerimientos activos de los estudiantes.</p>`;
        window.loadTramitesAdmin();
    } else {
        btnH.classList.replace('btn-outline', 'btn-primary');
        btnP.classList.replace('btn-primary', 'btn-outline');
        header.innerHTML = `<h3 style="margin-bottom:8px;"><i class="fa-solid fa-calendar-check text-success"></i> Historial de Trámites Entregados</h3>
                            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">Registro cronológico de documentos oficiales enviados.</p>`;
        
        cont.innerHTML = '<p style="text-align:center; padding:20px;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando historial...</p>';
        try {
            const { data, error } = await supabaseClient
                .from('tramites')
                .select('*, alumnos(nombre, matricula)')
                .eq('estado', 'Subido')
                .order('fecha_emision', { ascending: false });

            if(error) throw error;
            if(!data || data.length ===0) {
                cont.innerHTML = '<p style="text-align:center; padding:30px; color:var(--text-muted)">No hay historial de trámites todavía.</p>';
                return;
            }

            cont.innerHTML = data.map(t => {
                const emision = t.fecha_emision ? new Date(t.fecha_emision).toLocaleDateString('es-MX', { dateStyle: 'medium' }) : '---';
                const alumno = t.alumnos ? `${t.alumnos.nombre} (${t.alumnos.matricula})` : 'Alumno desconocido';
                return `
                <div style="background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px 14px; position:relative;">
                    <div style="font-weight:600; font-size:0.9rem; color:var(--text-main); margin-bottom:4px;">${t.tipo}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;"><i class="fa-solid fa-user"></i> ${alumno}</div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.7rem; color:var(--text-muted)">Emitido: ${emision}</span>
                        <a href="${t.archivo_url}" target="_blank" class="btn btn-outline btn-xs" style="color:var(--success); border-color:var(--success);"><i class="fa-solid fa-eye"></i> Ver PDF</a>
                    </div>
                </div>`;
            }).join('');
        } catch(e) {
            console.error(e);
            cont.innerHTML = '<p style="color:var(--danger)">Error al cargar el historial.</p>';
        }
    }
};

// RENDER & ROUTER
// ========================

// ======================================
// DIRECTOR / DIRECTIVO WORKFLOW
// ======================================
window.loadAutorizaciones = async () => {
    const list = document.getElementById('listaAutorizaciones');
    if(!list) return;
    list.innerHTML = 'Cargando bandeja...';
    try {
        const { data, error } = await supabaseClient
            .from('autorizaciones_movimientos')
            .select('*')
            .eq('estado', 'pendiente')
            .order('fecha_solicitud', { ascending: false });
            
        if(error) throw error;
        if(!data || data.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding: 40px; color:var(--text-muted)"><i class="fa-solid fa-check-circle" style="font-size:2rem; margin-bottom:12px; color:var(--success)"></i><p>Todo al día. No hay movimientos pendientes.</p></div>';
            return;
        }

        list.innerHTML = data.map(item => {
            const dateStr = item.fecha_solicitud ? new Date(item.fecha_solicitud).toLocaleString('es-MX', { dateStyle:'short', timeStyle:'short' }) : 'Reciente';
            return `
            <div style="border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:12px; background:white; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap;">
                <div>
                   <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
                      <span class="badge" style="background:#fee2e2; color:#b91c1c">${item.tipo_accion}</span>
                      <span style="font-size:0.75rem; color:var(--text-muted)"><i class="fa-regular fa-clock"></i> ${dateStr}</span>
                   </div>
                   <p style="font-weight:600; margin-bottom:4px; font-size:0.95rem">${item.detalles}</p>
                </div>
                <div style="display:flex; gap:8px; flex-shrink:0">
                   <button class="btn btn-sm btn-outline" style="border-color:var(--danger); color:var(--danger)" onclick="window.resolverAutorizacion('${item.id}', 'rechazada')"><i class="fa-solid fa-xmark"></i> Rechazar</button>
                   <button class="btn btn-sm" style="background:var(--success); color:white; border-color:var(--success);" onclick="window.resolverAutorizacion('${item.id}', 'aprobada', '${encodeURIComponent(JSON.stringify(item.payload_json))}')"><i class="fa-solid fa-check"></i> Autorizar y Ejecutar</button>
                </div>
            </div>`;
        }).join('');
        
    } catch(err) {
        list.innerHTML = `<p style="color:var(--danger); text-align:center;">Error de sincronización con servidor: ${err.message}</p>`;
    }
};

window.resolverAutorizacion = async (id, dictamen, payloadStr = null) => {
    if(!confirm(`¿Estás seguro de MARCAR esta petición administrativa como ${dictamen.toUpperCase()}?`)) return;
    try {
        if(dictamen === 'aprobada' && payloadStr) {
            const payload = JSON.parse(decodeURIComponent(payloadStr));
            
            // Re-ejecutar el comando interceptado
            if(payload.action === 'delete_alumno') {
                const idToDelete = payload.target_id;
                // Extraer email para revocar acceso
                const { data: alu } = await supabaseClient.from('alumnos').select('contacto_email').eq('id', idToDelete).single();
                
                const { error } = await supabaseClient.from('alumnos').delete().eq('id', idToDelete);
                if(error) throw error;
                
                if(alu && alu.contacto_email) {
                    await supabaseClient.from('perfiles_permitidos').delete().eq('email', alu.contacto_email);
                }
            }
            else if(payload.action === 'graduar_generacion') {
                const { data: grps } = await supabaseClient.from('grupos').select('id').ilike('nombre', `${payload.grado}%`);
                if(grps && grps.length > 0) {
                    const ids = grps.map(g => g.id);
                    // Obtenemos todos los correos para revocarlos de un solo golpe
                    const { data: grads } = await supabaseClient.from('alumnos').select('contacto_email').in('grupo_id', ids).neq('contacto_email', null);
                    
                    const { error } = await supabaseClient.from('alumnos').delete().in('grupo_id', ids);
                    if(error) throw error;
                    
                    if(grads && grads.length > 0) {
                        const emails = grads.map(g => g.contacto_email).filter(Boolean);
                        if(emails.length > 0) {
                           await supabaseClient.from('perfiles_permitidos').delete().in('email', emails);
                        }
                    }
                }
            }
            else if(payload.action === 'promover_grupo') {
                 const { data: sData } = await supabaseClient.from('grupos').select('id').ilike('nombre', payload.sourceNom).maybeSingle();
                 if(sData) {
                    let targetId;
                    const { data: tData } = await supabaseClient.from('grupos').select('id').eq('nombre', payload.targetNom).maybeSingle();
                    if(tData) targetId = tData.id;
                    else {
                        const { data: nG } = await supabaseClient.from('grupos').insert([{ nombre: payload.targetNom, plantel_id: state.plantelId }]).select().single();
                        targetId = nG.id;
                    }
                    const { error } = await supabaseClient.from('alumnos').update({ grupo_id: targetId, grado: payload.tGrado }).eq('grupo_id', sData.id);
                    if(error) throw error;
                 }
            }
            else if(payload.action === 'delete_personal') {
                 const { error: errPerm } = await supabaseClient.from('perfiles_permitidos').delete().eq('id', payload.id_permitido);
                 if(errPerm) throw errPerm;
                 const { data: pExist } = await supabaseClient.from('perfiles').select('id').eq('nombre', payload.nombre).maybeSingle();
                 if(pExist) await supabaseClient.from('perfiles').delete().eq('id', pExist.id);
            }
        }

        // Marcar la solicitud en SQL como concluida
        const { error: eUpdate } = await supabaseClient.from('autorizaciones_movimientos')
            .update({ estado: dictamen, fecha_resolucion: new Date().toISOString() })
            .eq('id', id);
        if(eUpdate) throw eUpdate;

        alert(`Petición ${dictamen.toUpperCase()} exitosamente.`);
        window.loadAutorizaciones(); // refresca UI
    } catch(err) {
        alert("Fallo crítico al resolver solicitud: " + err.message);
        console.error(err);
    }
}

function renderDirectivoAutorizaciones() {
    setTimeout(() => { if(window.loadAutorizaciones) window.loadAutorizaciones(); }, 150);
    return `
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 class="page-title">Centro de Autorizaciones</h2>
          <p class="page-subtitle">Peticiones de baja y modificaciones globales para directivos.</p>
        </div>
      </div>
      
      <div class="card" style="padding:24px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
         <h3 style="margin-bottom:20px; display:flex; align-items:center; gap:8px; font-size:1.1rem">
            <i class="fa-solid fa-inbox" style="color:var(--primary)"></i> 
            Solicitudes Administrativas Pendientes
         </h3>
         <div id="listaAutorizaciones">
             <div style="text-align:center; padding:20px; color:var(--text-muted)"><i class="fa-solid fa-spinner fa-spin"></i> Cargando expedientes...</div>
         </div>
      </div>
    `;
}

function renderDirectivoPersonal() {
    setTimeout(() => { if(window.loadPersonalDirectivo) window.loadPersonalDirectivo(); }, 150);
    return `
      <div class="page-header">
        <h2 class="page-title">Gestión de Personal Escolar</h2>
        <p class="page-subtitle">Registra y administra los perfiles autorizados (Admin, Maestros, Apoyo).</p>
      </div>

      <div style="display:grid; grid-template-columns: 1.2fr 1.8fr; gap:24px;">
        <!-- Formulario Registro -->
        <div class="card">
           <h3 style="margin-bottom:20px;">Registrar Nuevo Personal</h3>
           <div class="form-group">
              <label class="form-label">Nombre Completo</label>
              <input type="text" id="perNombre" class="form-input" placeholder="Nombre completo del trabajador...">
           </div>
           <div class="form-group">
              <label class="form-label">Correo Electrónico</label>
              <input type="email" id="perEmail" class="form-input" placeholder="correo@ejemplo.com">
           </div>
           <div class="form-group">
              <label class="form-label">Rol en el Plantel</label>
              <select id="perRol" class="form-select">
                 <option value="maestro">Maestro</option>
                 <option value="apoyo">Apoyo (Prefectura / Trabajo Social)</option>
                 <option value="directivo">Directivo (Director / Subdirector)</option>
                 <option value="admin">Admin (Control Escolar)</option>
              </select>
           </div>
           <button class="btn btn-primary" style="width:100%; margin-top:10px;" onclick="window.registrarNuevoPersonal()">
              <i class="fa-solid fa-user-shield"></i> Autorizar Acceso y Registrar
           </button>
           <p style="margin-top:16px; font-size:0.75rem; color:var(--text-muted);">El personal registrado podrá iniciar sesión inmediatamente después de que se autorice su correo electrónico.</p>
        </div>

        <!-- Lista de Personal Actual -->
        <div class="card">
           <h3 style="margin-bottom:20px;">Personal Autorizado</h3>
           <div id="listaPersonalDirectivo" style="display:flex; flex-direction:column; gap:10px;">
              <div style="text-align:center; padding:20px; color:var(--text-muted)"><i class="fa-solid fa-spinner fa-spin"></i> Cargando personal...</div>
           </div>
        </div>
      </div>
    `;
}

window.registrarNuevoPersonal = async () => {
    const nombre = document.getElementById('perNombre').value.trim();
    const email = document.getElementById('perEmail').value.trim().toLowerCase();
    const rol = document.getElementById('perRol').value;

    if(!nombre || !email || !rol) return alert("Por favor llena todos los campos.");

    const roleDisplay = { admin: 'ADMIN', maestro: 'MAESTRO', apoyo: 'APOYO', directivo: 'DIRECTIVO', alumno: 'ESTUDIANTE' };
    const niceRol = roleDisplay[rol] || rol.toUpperCase();

    if(!confirm(`¿Deseas autorizar el acceso de ${nombre} como ${niceRol}?`)) return;

    try {
        // Normalización Blindada: admin/administrativo -> admin, maestro/maestro -> maestro
        const finalRol = (['admin','administrativo','admin'].includes(rol)) ? 'admin' : (['maestro','maestro'].includes(rol) ? 'maestro' : rol);
        
        // Recuperar Plantel ID con máxima prioridad (State -> Metadata -> Fetch DB)
        let finalPlantel = state.plantelId || state.user?.user_metadata?.plantel_id;
        
        if(!finalPlantel && state.user?.id) {
            const { data: prof } = await supabaseClient.from('perfiles').select('plantel_id').eq('id', state.user.id).single();
            finalPlantel = prof?.plantel_id;
        }

        if(!finalPlantel) return alert("❌ Error: No se pudo identificar tu plantel. Por favor recarga la página.");

        // LLAMADA SEGURA RPC (Hereda plantel automáticamente en el servidor)
        const { error: rpcError } = await supabaseClient.rpc('registrar_personal_seguro', {
            p_nombre: nombre,
            p_email: email,
            p_rol: finalRol
        });

        if(rpcError) throw rpcError;

        window.showToast("Personal registrado con éxito", "success");
        // Limpiado agresivo del formulario
        if(document.getElementById('perNombre')) document.getElementById('perNombre').value = '';
        if(document.getElementById('perEmail')) document.getElementById('perEmail').value = '';
        
        if(window.loadPersonalDirectivo) window.loadPersonalDirectivo();
        if(window.loadListasAdminPersonal) window.loadListasAdminPersonal();
    } catch(e) { alert("Error: " + e.message); }
};


window.loadPersonalDirectivo = async () => {
    const cont = document.getElementById('listaPersonalDirectivo');
    if(!cont) return;

    try {
        const { data, error } = await supabaseClient.from('perfiles_permitidos')
            .select('*')
            .eq('plantel_id', state.plantelId)
            .neq('rol', 'alumno')
            .order('nombre');

        if(error) throw error;

        if(!data || data.length === 0) {
            cont.innerHTML = '<div style="text-align:center; color:var(--text-muted)">No hay personal registrado aún.</div>';
            return;
        }

        cont.innerHTML = data.map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:white; border:1px solid var(--border); border-radius:10px;">
               <div>
                  <div style="font-weight:600;">${p.nombre || 'Sin nombre'}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted)">${p.email}</div>
               </div>
               <span class="badge" style="background:${p.rol === 'directivo' ? '#fee2e2' : (p.rol === 'maestro' ? '#dcfce7' : '#fef9c3')}; color:${p.rol === 'directivo' ? '#991b1b' : (p.rol === 'maestro' ? '#166534' : '#854d0e')}; padding:4px 8px; font-size:0.7rem; font-weight:bold; border-radius:6px; text-transform:uppercase;">
                   ${p.rol === 'maestro' ? 'MAESTRO' : p.rol.toUpperCase()}
               </span>
            </div>
        `).join('');
    } catch(e) { cont.innerHTML = 'Error al cargar personal'; }
};

function generateHTML(content) {
  // Determine if it needs layout or is fullscreen
  const layoutFreePaths = [];

  if (layoutFreePaths.includes(state.path)) {
    return content;
  }

  // Dashboard layout wrapper
  return `
    <div class="dashboard-layout">
      ${renderSidebar()}
      <main class="main-content">
        ${content}
      </main>
    </div>
  `;
}

async function renderPage(path) {
  // Manejar parámetros de URL y normalizar barras
  let [purePath] = path.split('?');
  if (purePath.length > 1 && purePath.endsWith('/')) purePath = purePath.slice(0, -1);
  
  console.log(">>> [ROUTING] Cargando ruta:", purePath, "para rol:", state.role);
  
  // Routes Definition
  switch(purePath) {
    case '/': 
        if(esAdmin(state.role)) return renderAdminInscripcion();
        if(state.role === 'directivo') return renderDirectivoAutorizaciones();
        if(state.role === 'maestro') return renderMaestroAula();
        if(state.role === 'apoyo') return renderApoyoDashboard();
        if(state.role === 'alumno') return renderAlumnoCredencial();
        return renderLandingPage();
    case '/master/saas': return (state.user?.email === 'zlagustin10@gmail.com') ? await renderMasterSaaS() : '<h2>Acceso Denegado</h2>';
    case '/admin/inscripcion': return renderAdminInscripcion();
    case '/admin/expediente': return renderAdminExpediente();
    case '/admin/grupos': return renderAdminGrupos();
    case '/admin/maestros': return renderAdminMaestros();
    case '/admin/calificaciones': return renderAdminCalificaciones();
    case '/admin/tramites': return renderAdminTramites();
    case '/admin/horarios': return renderAdminHorarios();
    case '/admin/comunicados': return renderAdminComunicados();
    case '/maestro/aula': return renderMaestroAula();
    case '/maestro/actividades': return renderMaestroActividades();
    case '/maestro/listas': return renderMaestroListas();
    case '/maestro/encuadre': return renderMaestroEncuadre();
    case '/maestro/calificaciones': return renderMaestroCalificaciones();
    case '/maestro/bitacora': return renderMaestroBitacora();
    case '/maestro/comunicados': return renderPersonalComunicados('Maestros');
    case '/apoyo/dashboard': return renderApoyoDashboard();
    case '/apoyo/reportes': return renderApoyoReportes();
    case '/apoyo/salud': return renderApoyoSalud();
    case '/apoyo/bitacora': return renderApoyoBitacora();
    case '/apoyo/prefectura': return renderApoyoPrefectura();
    case '/apoyo/comunicados': return renderPersonalComunicados('Apoyo');
    case '/alumno/credencial': return renderAlumnoCredencial();
    case '/alumno/timeline': return renderAlumnoTimeline();
    case '/alumno/boletas': return renderAlumnoBoletas();
    case '/alumno/horario': return renderAlumnoHorario();
    case '/alumno/tramites': return renderAlumnoTramites();
    case '/directivo/autorizaciones': return renderDirectivoAutorizaciones();
    case '/directivo/gestion-personal': return renderDirectivoPersonal();
    case '/maestro/evaluacion': return renderMaestroListas(); // Alias para evaluación rápida
    default: return '<h2>Pantalla en construcción</h2>';
  }
}

async function renderMasterSaaS() {
    try {
        // USAMOS supaAdmin para ver TODO sin restricciones de RLS
        const { data: planteles, error } = await supaAdmin.from('planteles').select('*').order('creado_en', { ascending: false });
        if(error) throw error;

        return `
        <div class="page-header">
          <h2 class="page-title">Centro de Mando SaaS</h2>
          <p class="page-subtitle">Panel Exclusivo de Dueño: zlagustin10@gmail.com</p>
        </div>

        <div class="card" style="margin-bottom:32px; border-left: 6px solid var(--danger); background:#fff5f5;">
           <div style="display:flex; gap:16px; align-items:center;">
              <div style="font-size:2.5rem; color:var(--danger);"><i class="fa-solid fa-radiation"></i></div>
              <div>
                 <strong style="display:block; font-size:1.1rem; color:#c53030;">Control de Destrucción (Cascada)</strong>
                 <p style="margin:0; font-size:0.9rem; color:#9b2c2c;">Al eliminar un plantel, se borran ALUMNOS, MAESTROS, GRUPOS y CALIFICACIONES de forma permanente.</p>
              </div>
           </div>
        </div>

        <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap:24px;">
           ${planteles.map(p => `
             <div class="card shadow-md" style="border-top: 6px solid ${p.primary_color || '#2563eb'}; overflow:hidden;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:15px;">
                   <div>
                      <h3 style="margin:0; font-weight:900;">${p.nombre}</h3>
                      <code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:0.75rem;">${p.slug}</code>
                   </div>
                   <div style="font-size:1.5rem; color:${p.primary_color || '#2563eb'}"><i class="fa-solid fa-school-flag"></i></div>
                </div>
                
                <div style="background:#f8fafc; padding:12px; border-radius:12px; margin-bottom:15px; font-size:0.85rem;">
                   <div style="margin-bottom:4px;"><i class="fa-solid fa-id-badge" style="width:20px;"></i> ID: <span style="font-size:0.7rem;">${p.id}</span></div>
                   <div><i class="fa-solid fa-clock-rotate-left" style="width:20px;"></i> Registrada: ${new Date(p.creado_en).toLocaleString()}</div>
                </div>

                <div style="display:flex; gap:12px;">
                   <button class="btn btn-primary" style="flex:1; font-size:0.8rem;" onclick="alert('Funciones PRO pronto')"><i class="fa-solid fa-eye"></i> Gestionar</button>
                   <button class="btn" style="flex:1; font-size:0.8rem; background:#fee2e2; color:#dc2626; border:1px solid #fecaca;" onclick="window.eliminarPlantelSaaS('${p.id}', '${p.nombre}')">
                      <i class="fa-solid fa-trash"></i> Eliminar
                   </button>
                </div>
             </div>
           `).join('')}
        </div>
        `;
    } catch(e) { return `<div class="error-box">Error SaaS: ${e.message}</div>`; }
}

window.eliminarPlantelSaaS = async (id, nombre) => {
    if(!confirm(`⚠️ ¿ELIMINAR ${nombre.toUpperCase()}?\nEsta acción es irreversible y borrará TODO el plantel.`)) return;
    const confirmName = prompt(`Escribe exactamente "${nombre}" para dar de baja definitiva:`);
    if(confirmName !== nombre) return alert("Nombre incorrecto. Acción cancelada.");

    try {
        // USAR supaAdmin para saltar RLS y borrar CUALQUIER plantel
        const { error } = await supaAdmin.from('planteles').delete().eq('id', id);
        if(error) throw error;
        window.showToast("Plantel y datos eliminados correctamente.", "success");
        renderApp();
    } catch(e) { alert("Error al borrar: " + e.message); }
};

async function renderApp() {
  const app = document.getElementById('app');
  if(!app) return;
  
  if(state.schoolConfigured === null) {
      window.checkSchoolSetup();
      app.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100vh; color:var(--primary); font-size:1.5rem;"><i class="fa-solid fa-spinner fa-spin"></i></div>';
      return;
  }

  if(state.schoolConfigured === false) {
      app.innerHTML = renderSetupScreen();
      return;
  }

  console.log(">>> RENDERING APP - Path:", state.path, "Role:", state.role);

  try {
    if (!state.role) {
      app.innerHTML = renderRoleSelector();
    } else {
      const pageContent = await renderPage(state.path);
      // generateHTML es la que pone el sidebar y el wrapper
      app.innerHTML = generateHTML(pageContent);
    }
    // Asegurar que los eventos se vuelvan a vincular
    attachDOMEvents();
  } catch (err) {
    console.error(">>> RENDER ERROR:", err);
    app.innerHTML = `
      <div style="padding:40px; text-align:center;">
        <h2 style="color:var(--danger)">Error al cargar la vista</h2>
        <p style="color:var(--text-muted)">${err.message}</p>
        <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top:20px;">Reintentar</button>
        <button class="btn btn-outline" onclick="window.logout()" style="margin-top:10px;">Cerrar Sesión y Resetear</button>
      </div>
    `;
  }
}

window.loadMisGruposMaestro = async () => {
    const cont = document.getElementById('contenedorMisGrupos');
    if(!cont) return;
    try {
        // 1. Obtener datos del usuario logueado
        const { data: { user } } = await supabaseClient.auth.getUser();
        if(!user) return;
        const email = user.email;

        // 2. Consultar asignaciones
        const { data: asigs, error } = await supabaseClient
            .from('asignaciones_maestros')
            .select('grupo_id, target_grado, materia, grupos(*)')
            .eq('docente_email', email);

        if(error) throw error;
        
        const gruposUnicos = [];
        const uniqueAssignments = new Set();
        const talleresVistos = new Set(); 
        
        (asigs || []).forEach(asig => {
            // Caso A: Asignación por Grupo Específico (Materias Normales)
            if(asig.grupos) {
                const key = `${asig.grupo_id}|${asig.materia}`;
                if(!uniqueAssignments.has(key)) {
                    gruposUnicos.push({ 
                        id: asig.grupo_id,
                        nombre: asig.grupos.nombre,
                        materia: asig.materia || 'Materia no especificada',
                        tipo: 'Asignación Directa',
                        onclick: `window.showQRScannerModal('${asig.grupos.nombre}', '${asig.grupo_id}', '${asig.materia}')`
                    });
                    uniqueAssignments.add(key);
                }
            }
            
            // Caso B: Asignación por Grado (Talleres / Tecnologías)
            if(asig.target_grado) {
                const key = `${asig.target_grado}|${asig.materia}`;
                if(!talleresVistos.has(key)) {
                    gruposUnicos.push({
                        id: `grado:${asig.target_grado}|${asig.materia}`,
                        nombre: `${asig.materia} - ${asig.target_grado} Grado`,
                        tipo: 'Taller Unificado (Todo el Grado)',
                        onclick: `window.showQRScannerModal('${asig.materia} - ${asig.target_grado}', 'grado:${asig.target_grado}|${asig.materia}', '${asig.materia}')`
                    });
                    talleresVistos.add(key);
                }
            }
        });

        if(gruposUnicos.length === 0) {
            cont.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-muted)"><i class="fa-solid fa-calendar-xmark" style="font-size:2rem; display:block; margin-bottom:10px;"></i>No tienes grupos asignados actualmente.</div>';
            return;
        }

        // 3. Renderizar tarjetas (Unificadas)
        const cardColors = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--danger)'];
        cont.innerHTML = gruposUnicos.map((d, i) => {
            const color = cardColors[i % cardColors.length];
            const iniciales = (d.materia || d.nombre).substring(0,2).toUpperCase();
            return `<div class="class-card" onclick="${d.onclick}" style="display:flex; justify-content:space-between; align-items:center; padding:16px; margin-bottom:12px; border:1px solid var(--border); border-radius:12px; background:white; cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
               <div style="display:flex; gap:15px; align-items:center;">
                 <div style="width:50px; height:50px; background:${color}; color:white; border-radius:12px; display:grid; place-items:center; font-weight:bold; font-size:1rem; box-shadow:0 4px 6px rgba(0,0,0,0.1);">${iniciales}</div>
                 <div>
                    <div style="font-weight:700; color:var(--text-main); font-size:1.05rem;">${d.materia || 'Materia'}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">${d.nombre} • <span style="color:var(--primary); font-weight:500;">${d.tipo}</span></div>
                 </div>
               </div>
               <i class="fa-solid fa-chevron-right" style="color:#ccc;"></i>
            </div>`;
        }).join('');
    } catch(err) { 
        console.error("Error cargando grupos del maestro:", err);
        if(cont) cont.innerHTML = '<p style="color:var(--danger); text-align:center; padding:20px;">Error al cargar tus grupos asignados.</p>'; 
    }
};

window.saveApoyoBitacora = async () => {
    const texto = document.getElementById('textoBitacoraApoyo').value;
    const fechaRef = document.getElementById('fechaBitacoraApoyo').value;
    if(!texto) return;
    
    const btn = document.querySelector('[onclick="window.saveApoyoBitacora()"]');
    btn.disabled = true;

    try {
        const u = await supabaseClient.auth.getUser();
        const email = u.data.user?.email || 'S/C';
        const nombre = state.user?.nombre || email;
        const rol = state.user?.rol === 'apoyo' ? 'Prefectura/TS' : (state.user?.rol || 'Personal');

        const { error } = await supabaseClient.from('bitacora_maestro').insert({
            texto: texto,
            perfil_id: state.user.id,
            firma_autor: `${nombre} [${rol}]`,
            fecha_referencia: fechaRef,
            plantel_id: state.plantelId
        });
        if(error) throw error;
        document.getElementById('textoBitacoraApoyo').value = '';
        window.loadApoyoBitacora(fechaRef);
        window.showToast("Hecho registrado en bitácora", "success");
    } catch(e) { console.error(e); alert('Error al guardar bitácora.'); }
    finally { btn.disabled = false; }
};

window.loadApoyoBitacora = async (fechaSeleccionada) => {
    const cont = document.getElementById('apoyoBitacoraTimeline');
    if(!cont) return;
    const fecha = fechaSeleccionada || document.getElementById('fechaBitacoraApoyo')?.value || new Date().toLocaleDateString('en-CA');
    
    try {
        const { data, error } = await supabaseClient
            .from('bitacora_maestro')
            .select('*')
            .eq('fecha_referencia', fecha)
            .order('creado_en', {ascending: false});

        if(error) throw error;
        cont.innerHTML = data.map(b => {
            const hora = new Date(b.creado_en).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            return `
            <div style="position:relative; padding-bottom:20px; border-left:2px solid var(--border); padding-left:20px;">
                <div style="position:absolute; left:-9px; top:0; width:16px; height:16px; background:var(--primary); border-radius:50%; border:3px solid white;"></div>
                <div style="font-size:0.75rem; color:var(--text-muted)"><b>${hora}</b> | ${new Date(b.creado_en).toLocaleDateString()}</div>
                <p style="margin:5px 0 0 0; font-size:0.95rem; color:var(--text-main); line-height:1.4;">${b.texto}</p>
                <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">
                    <i class="fa-solid fa-user-pen"></i> Registrado por: <b>${b.firma_autor || 'S/D'}</b>
                </div>
            </div>`;
        }).join('') || `<div style="text-align:center; padding:30px; color:var(--text-muted)">
                         <i class="fa-solid fa-calendar-xmark fa-2x" style="opacity:0.2; margin-bottom:10px;"></i>
                         <p>No hay registros oficiales para el día ${fecha}.</p>
                       </div>`;
    } catch(e) { console.error(e); }
};

// --- SISTEMA DE BÚSQUEDA DE ALUMNOS (GLOBAL) ---
window.liveSearchAlumnos = async (term, targetId) => {
    const resCont = document.getElementById(targetId);
    if (!term || term.length < 2) {
        resCont.style.display = 'none';
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('alumnos')
            .select('id, nombre, matricula, grupos(nombre)')
            .or(`nombre.ilike.%${term}%,matricula.ilike.%${term}%`)
            .limit(5);

        if (error) throw error;

        if (data && data.length > 0) {
            resCont.innerHTML = data.map(a => `
                <div onclick="window.selectAlumnoForSalud('${a.id}', '${a.nombre}', '${targetId}')" 
                     style="padding:10px; border-bottom:1px solid var(--border); cursor:pointer; font-size:0.9rem;"
                     onmouseover="this.style.background='var(--page-bg)'"
                     onmouseout="this.style.background='white'">
                    <strong>${a.nombre}</strong><br>
                    <small style="color:var(--text-muted)">${a.matricula} • ${a.grupos?.nombre || 'S/G'}</small>
                </div>
            `).join('');
            resCont.style.display = 'block';
        } else {
            resCont.innerHTML = '<div style="padding:10px; color:var(--text-muted); font-size:0.85rem;">No se encontraron resultados</div>';
            resCont.style.display = 'block';
        }
    } catch (e) { console.error("Search Error:", e); }
};

window.selectAlumnoForSalud = (id, nombre, targetId) => {
    const isJustificante = targetId === 'resJustificanteAlu';
    
    if (isJustificante) {
        document.getElementById('selectedAluIdJustificante').value = id;
        document.getElementById('busquedaJustificanteInput').value = nombre;
        document.getElementById('resJustificanteAlu').style.display = 'none';
    } else {
        document.getElementById('selectedAluIdSalud').value = id;
        document.getElementById('busquedaSaludInput').value = nombre;
        document.getElementById('resSaludAlu').style.display = 'none';
        // Cargar historial específico si se desea
        window.loadHistorialSalud();
    }
};

window.registrarSaludAlumno = async () => {
    const aid = document.getElementById('selectedAluIdSalud').value;
    const motivo = document.getElementById('motivoSalud').value;
    const obs = document.getElementById('obsSalud').value;
    if(!aid || !motivo) return alert('Selecciona un alumno y llena el motivo.');
    try {
        const { error } = await supabaseClient.from('expedientes_salud').insert({ 
            alumno_id: aid, 
            tipo_alergia: motivo, 
            observaciones_medicas: obs,
            perfil_id: state.user.id,
            plantel_id: state.plantelId
        });
        if(error) throw error;
        
        // 2. Notificar al Alumno v132
        await supabaseClient.from('comunicados').insert([{
            autor_id: state.user.id,
            titulo: `🩺 REGISTRO DE ATENCIÓN MÉDICA`,
            mensaje: `Se ha registrado una atención en el área de salud/apoyo.\nMOTIVO: ${motivo}\nOBSERVACIONES: ${obs || 'Sin observaciones adicionales.'}\n\nAtentamente,\nÁrea de Apoyo Estudiantil`,
            audiencia: `Alumno_${aid}`,
            plantel_id: state.plantelId
        }]);

        window.showToast('Registro de salud guardado y notificado.', 'success');
        window.loadHistorialSalud();
        // Limpiar campos
        document.getElementById('motivoSalud').value = '';
        document.getElementById('obsSalud').value = '';
    } catch(e) { console.error(e); window.showToast('Error al registrar.', 'error'); }
};

window.registrarJustificanteMedico = async () => {
    const aid = document.getElementById('selectedAluIdJustificante').value;
    const motivo = document.getElementById('justificanteMotivo').value;
    const inicio = document.getElementById('justificanteInicio').value;
    const fin = document.getElementById('justificanteFin').value;
    
    console.log("Intentando registrar justificante para:", aid);

    if(!aid) return alert('¡Error! Primero debes buscar y seleccionar a un alumno en el buscador de la tarjeta.');
    if(!motivo || !inicio || !fin) return alert('Por favor llene el motivo y el rango de fechas.');

    try {
        window.showToast('Procesando justificante...', 'info');
        
        // 1. Guardar en base de datos
        const { data, error } = await supabaseClient.from('justificantes_medicos').insert({
            alumno_id: aid,
            autor_id: state.user.id,
            motivo: motivo,
            fecha_inicio: inicio,
            fecha_fin: fin,
            plantel_id: state.plantelId
        }).select().single();
        
        if(error) {
            if(error.code === '42P01') throw new Error("La tabla de justificantes no ha sido creada en Supabase. Por favor ejecuta el script SQL.");
            throw error;
        }

        // 2. Notificar a Maestros
        await window.notificarMaestrosJustificante(aid, motivo, inicio, fin);

        // 3. Notificar al Alumno v132
        await supabaseClient.from('comunicados').insert([{
            autor_id: state.user.id,
            titulo: `📄 JUSTIFICANTE MÉDICO APROBADO`,
            mensaje: `Se ha registrado y aprobado tu justificante médico.\nMOTIVO: ${motivo}\nPERIODO: ${inicio} al ${fin}\n\nLos docentes de tus materias han sido notificados para las consideraciones académicas correspondientes.`,
            audiencia: `Alumno_${aid}`,
            plantel_id: state.plantelId
        }]);

        window.showToast('Justificante generado y enviado a todos.', 'success');
        
        // Refrescar vistas
        if(window.loadHistorialSalud) window.loadHistorialSalud();
        
        // Limpiar campos
        document.getElementById('justificanteMotivo').value = '';
        document.getElementById('justificanteInicio').value = '';
        document.getElementById('justificanteFin').value = '';
        document.getElementById('busquedaJustificanteInput').value = '';
        document.getElementById('selectedAluIdJustificante').value = '';
    } catch(e) { 
        console.error("Justificante Error:", e); 
        window.showToast('Error: ' + e.message, 'error'); 
    }
};

window.notificarMaestrosJustificante = async (alumnoId, motivo, inicio, fin) => {
    try {
        // Obtener grupo y nombre del alumno
        const { data: al, error: alErr } = await supabaseClient.from('alumnos').select('nombre, grupo_id').eq('id', alumnoId).single();
        if(alErr || !al || !al.grupo_id) {
            console.warn("No se pudo obtener el grupo del alumno para notificar.");
            return;
        }

        const mensaje = `Se informa que el alumno(a) **${al.nombre}** cuenta con justificante médico del **${new Date(inicio).toLocaleDateString()}** al **${new Date(fin).toLocaleDateString()}** por motivo de: ${motivo}. Favor de brindar las facilidades académicas necesarias.`;

        // Insertar comunicado para el grupo específico
        const { error: comErr } = await supabaseClient.from('comunicados').insert([{
            autor_id: state.user.id,
            titulo: 'JUSTIFICANTE MÉDICO: ' + al.nombre,
            audiencia: 'Grupo_' + al.grupo_id,
            mensaje: mensaje
        }]);

        if(comErr) {
            console.error("Error al insertar comunicado:", comErr);
            throw new Error("Justificante guardado, pero los maestros no pudieron ser notificados (Error de permisos en Comunicados).");
        }
    } catch(e) { 
        console.error("Error al notificar maestros:", e);
        throw e; // Relanzar para que el proceso principal lo capture
    }
};

window.loadHistorialSalud = async () => {
    const cont = document.getElementById('historialSaludCont');
    if(!cont) return;
    try {
        // 1. Obtener Atenciones
        const { data: atenciones, error: errAt } = await supabaseClient
            .from('expedientes_salud')
            .select('*, alumnos(nombre)')
            .order('creado_en', {ascending: false})
            .limit(10);
            
        // 2. Obtener Justificantes
        const { data: justificantes, error: errJust } = await supabaseClient
            .from('justificantes_medicos')
            .select('*, alumnos(nombre, grupos(nombre))')
            .order('fecha_emision', {ascending: false})
            .limit(10);

        if(errAt || errJust) throw new Error("Error al cargar historial");

        // 3. Unificar y Ordenar
        const historico = [
            ...(atenciones || []).map(a => ({...a, tipoItem: 'atencion', fechaRef: a.creado_en})),
            ...(justificantes || []).map(j => ({...j, tipoItem: 'justificante', fechaRef: j.fecha_emision}))
        ].sort((a, b) => new Date(b.fechaRef) - new Date(a.fechaRef));

        if(historico.length === 0) {
            cont.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-muted)">No hay registros médicos recientes.</p>';
            return;
        }

        cont.innerHTML = historico.map(s => {
          if(s.tipoItem === 'atencion') {
            return `
              <div class="card" style="margin-bottom:12px; padding:12px; border-left:4px solid var(--primary); background:white;">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <strong><i class="fa-solid fa-notes-medical" style="color:var(--primary)"></i> ${s.alumnos?.nombre || 'Alumno'}</strong>
                    <small style="color:var(--text-muted)">${new Date(s.creado_en).toLocaleDateString()}</small>
                </div>
                <div style="font-size:0.85rem; color:var(--text-main); margin:4px 0; font-weight:bold;">${s.tipo_alergia || 'Atención General'}</div>
                <p style="margin:0; font-size:0.8rem; color:var(--text-muted)">${s.observaciones_medicas || ''}</p>
              </div>`;
          } else {
            return `
              <div class="card" style="margin-bottom:12px; padding:12px; border-left:4px solid var(--warning); background:#fffdf7;">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <div>
                        <strong><i class="fa-solid fa-file-signature" style="color:var(--warning)"></i> ${s.alumnos?.nombre || 'Alumno'}</strong>
                        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Grupo: ${s.alumnos?.grupos?.nombre || '---'}</div>
                    </div>
                    <small style="color:var(--text-muted)">${new Date(s.fecha_emision).toLocaleDateString()}</small>
                </div>
                <div style="font-size:0.85rem; color:#856404; margin:4px 0; font-weight:bold;">JUSTIFICANTE: ${s.motivo}</div>
                <div style="font-size:0.75rem; color:var(--text-main); background:#fff3cd; padding:4px 8px; border-radius:4px; display:inline-block; margin:4px 0;">
                    Válido: ${new Date(s.fecha_inicio).toLocaleDateString()} al ${new Date(s.fecha_fin).toLocaleDateString()}
                </div>
                <p style="margin:0; font-size:0.8rem; color:var(--text-muted)">Justificante oficial enviado a maestros.</p>
              </div>`;
          }
        }).join('');
    } catch(e) { console.error(e); }
};

window.loadBoletasAlumno = async () => {
    const cont = document.getElementById('boletasContainer');
    if(!cont) return;
    
    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data?.user) return;

        // 1. Obtener datos del alumno por correo (insensible a mayúsculas/minúsculas)
        const userEmail = u.data.user.email.toLowerCase();
        const { data: als } = await supabaseClient.from('alumnos')
            .select('id, grupo_id, nombre, matricula, contacto_email')
            .ilike('contacto_email', userEmail);
        
        const alu = (als && als.length > 0) ? als[0] : null;


        if(!alu) {
            cont.innerHTML = '<div class="card" style="text-align:center; padding:30px; color:var(--text-muted)">No se encontró información del alumno vinculado.</div>';
            return;
        }

        // 2. Buscar TODOS los comunicados vinculados al alumno por ID de Usuario O Audiencia
        const { data: todosCom, error: errRep } = await supabaseClient.from('comunicados')
           .select('*')
           .or(`receptor_id.eq.${u.data.user.id},audiencia.eq.Alumno_${alu.id}`)
           .order('fecha_envio', { ascending: false });

        if(errRep) throw errRep;

        // Filtramos en JS para asegurar que encontramos boletas incluso si la columna 'tipo' falló
        const reportes = (todosCom || []).filter(c => {
            const t = (c.titulo || '').toUpperCase();
            return c.tipo === 'reporte_academico_automatico' || 
                   t.includes('BOLETA') || 
                   t.includes('EXCELENCIA') || 
                   t.includes('CALIFICACIONES') ||
                   t.includes('ADVERTENCIA') ||
                   t.includes('MEJORA') ||
                   t.includes('REPORTE') ||
                   t.includes('CITATORIO');
        }).slice(0, 5); // Tomamos los 5 más recientes

        // 3. NUEVO: Buscar boletas en el bucket de Expediente Digital (PDFs)
        let storageHtml = '';
        try {
            const { data: fileList } = await supabaseClient.storage.from('expedientes').list(alu.id.toString());
            const boletasPdf = (fileList || []).filter(f => f.name.toLowerCase().includes('boleta'));
            
            if(boletasPdf.length > 0) {
                storageHtml = `
                    <div style="margin-top:25px; margin-bottom:15px;">
                        <h3 style="margin:0; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); font-weight:700;">
                            <i class="fa-solid fa-file-pdf"></i> Boletas Digitales Disponibles (PDF)
                        </h3>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:12px; margin-bottom:30px;">
                        ${boletasPdf.map(f => {
                            const publicUrl = supabaseClient.storage.from('expedientes').getPublicUrl(`${alu.id}/${f.name}`).data.publicUrl;
                            return `
                                <a href="${publicUrl}" target="_blank" class="card" style="padding:15px; text-decoration:none; display:flex; flex-direction:column; align-items:center; gap:8px; transition:var(--transition); border:1px solid var(--border);">
                                    <i class="fa-solid fa-file-invoice" style="font-size:2rem; color:var(--danger)"></i>
                                    <span style="font-size:0.75rem; font-weight:600; color:var(--text-main); text-align:center;">${f.name.replace('.pdf', '').replace(/_/g, ' ')}</span>
                                    <div style="font-size:0.65rem; color:var(--text-muted)">Descargar PDF</div>
                                </a>
                            `;
                        }).join('')}
                    </div>
                `;
            }
        } catch(e) { console.warn("Error consultando storage:", e); }

        // 4. Obtener calificaciones crudas
        const { data: califs } = await supabaseClient.from('calificaciones')
           .select('*')
           .eq('alumno_id', alu.id)
           .order('trimestre', { ascending: false });

        if((!califs || califs.length === 0) && (!reportes || reportes.length === 0) && !storageHtml) {
            cont.innerHTML = `
                <div class="card" style="text-align:center; padding:40px; border: 2px dashed var(--border); border-radius: 20px;">
                    <i class="fa-solid fa-graduation-cap fa-3x" style="color:var(--primary); opacity:0.1; margin-bottom:15px;"></i>
                    <h3 style="margin:0; color:var(--text-main);">Sin calificaciones aún</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem; margin-top:8px;">Tus profesores aún están procesando el cierre del trimestre.</p>
                </div>`;
            return;
        }

        let reportHtml = '';
        if(reportes && reportes.length > 0) {
            reportHtml = reportes.map(rep => {
                const isAlert = rep.titulo.includes('ADVERTENCIA') || rep.titulo.includes('CITATORIO') || rep.titulo.includes('URGENTE');
                const isExcelence = rep.titulo.includes('EXCELENCIA') || rep.titulo.includes('FELICIDADES');
                const isMejora = rep.titulo.includes('MEJORA') || rep.titulo.includes('SUPERACIÓN');

                const accentColor = isAlert ? 'var(--danger)' : (isExcelence ? '#10b981' : (isMejora ? '#f59e0b' : 'var(--primary)'));
                const icon = isAlert ? 'fa-triangle-exclamation' : (isExcelence ? 'fa-trophy' : (isMejora ? 'fa-chart-line' : 'fa-clipboard-check'));
                
                return `
                    <div class="card" style="border-left: 8px solid ${accentColor}; margin-bottom:20px; background:white; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border-radius: 18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span style="font-size:0.7rem; color:var(--text-muted); font-weight:800; text-transform:uppercase; letter-spacing:1px; background:#f1f5f9; padding:4px 10px; border-radius:20px;">
                                <i class="fa-solid ${icon}"></i> Reporte Académico
                            </span>
                            <span style="font-size:0.7rem; color:var(--text-muted);">${new Date(rep.fecha_envio).toLocaleDateString()}</span>
                        </div>
                        <h4 style="margin:0 0 12px 0; color:var(--text-main); font-size:1.2rem; font-weight:900;">${rep.titulo}</h4>
                        <div style="font-size:0.95rem; white-space:pre-wrap; margin:0; line-height:1.6; color:#334155; font-weight:500;">${rep.mensaje}</div>
                    </div>
                `;
            }).join('');
        }

        // Agrupar por periodo
        const periodos = [...new Set(califs.map(c => c.trimestre))].sort((a,b) => b-a);
        let tablesHtml = periodos.map(p => {
            const pCalifs = califs.filter(c => c.trimestre === p);
            const prom = (pCalifs.reduce((acc, curr) => acc + curr.calificacion, 0) / pCalifs.length).toFixed(1);
            const pNum = parseFloat(prom);

            // Determinar feedback automático v131
            let sLabel = "EN MEJORA", sColor = "#f59e0b", sIcon = "fa-chart-line", sMsg = "Buen desempeño, pero puedes alcanzar la excelencia (9.1+). ¡Sigue esforzándote!";
            if(pNum <= 5.9) {
                sLabel = "ADVERTENCIA"; sColor = "#ef4444"; sIcon = "fa-triangle-exclamation"; sMsg = "Promedio reprobatorio. Se recomienda solicitar asesorías y regularizar actividades.";
            } else if(pNum >= 9.1) {
                sLabel = "EXCELENCIA"; sColor = "#10b981"; sIcon = "fa-trophy"; sMsg = "¡Felicidades! Tienes un desempeño sobresaliente. Sigue con esa disciplina.";
            }

            return `
                <div class="card" style="padding:0; overflow:hidden; border-radius:18px; margin-bottom:24px; border:1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    <div style="background:var(--page-bg); padding:18px 20px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                       <h4 style="margin:0; font-size:1.1rem; font-weight:800; color:var(--primary);">Trimestre ${p}</h4>
                       <span class="badge" style="background:var(--primary); color:white; font-size:1rem; padding:6px 14px; border-radius:10px;">Promedio: ${prom}</span>
                    </div>
                    <table class="grades-table-pdf-source" data-trimestre="${p}" style="width:100%; border-collapse: collapse;">
                        ${pCalifs.map(c => `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding:14px 20px; font-size:0.9rem; color:var(--text-main); font-weight:500;">${c.materia_nombre}</td>
                                <td style="padding:14px 20px; text-align:right; font-weight:800; color:var(--primary); font-size:1.1rem;">${c.calificacion}</td>
                            </tr>
                        `).join('')}
                    </table>
                    
                    <!-- Feedback Automático v131 -->
                    <div style="background: #f8fafc; padding: 16px 20px; border-top: 2px solid ${sColor};">
                        <div style="display:flex; gap:12px; align-items:flex-start;">
                            <div style="width:36px; height:36px; border-radius:10px; background:${sColor}20; color:${sColor}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                <i class="fa-solid ${sIcon}"></i>
                            </div>
                            <div>
                                <div style="font-size:0.7rem; font-weight:900; color:${sColor}; letter-spacing:0.5px; margin-bottom:2px;">ESTADO: ${sLabel}</div>
                                <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4; font-weight:500;">${sMsg}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        cont.innerHTML = `
            <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); font-weight:700;">
                    <i class="fa-solid fa-graduation-cap"></i> Mi Rendimiento Académico
                </h3>
                <button class="btn btn-sm" style="background:none; border:none; color:var(--primary); cursor:pointer;" onclick="window.loadBoletasAlumno()">
                    <i class="fa-solid fa-rotate"></i>
                </button>
            </div>
            
            ${storageHtml}

            ${tablesHtml ? `
                ${tablesHtml}
            ` : ''}

            <div style="background:var(--page-bg); padding:20px; border-radius:15px; border:1px solid var(--border); margin-top:30px; text-align:center;">
                <p style="font-size:0.85rem; color:var(--text-main); margin-bottom:5px; font-weight:600;">⚠️ Información Importante</p>
                <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin:0;">
                    Las boletas oficiales con validez administrativa se entregarán **de manera física e impresa** en las fechas programadas por la institución para la firma de padres de familia y tutores.
                </p>
            </div>
        `;
    } catch(e) {
        console.error(e);
        cont.innerHTML = '<div class="alert alert-danger" style="font-size:0.85rem;">Error al sincronizar con el servidor escolar.</div>';
    }
};

window.descargarBoletaPDF = async (aluId, nombre, matricula) => {
    const btn = document.getElementById('btnDescargaBoleta');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando archivo...';

    try {
        // 1. Intentar buscar si hay un archivo oficial subido por administración en Storage
        const { data: files } = await supabaseClient.storage.from('expedientes').list(aluId);
        const officialFile = files?.find(f => f.name.startsWith('boleta_'));

        if(officialFile) {
            const { data } = await supabaseClient.storage.from('expedientes').download(`${aluId}/${officialFile.name}`);
            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Boleta_Oficial_${nombre.replace(/\s/g, '_')}.pdf`;
            a.click();
            btn.innerHTML = orig;
            btn.disabled = false;
            return;
        }

        // 2. Si no hay archivo oficial, generar el PDF informativo con jsPDF (o simulación de renderizado)
        // Nota: En un entorno real usaríamos window.jspdf. Aquí simulamos la apertura de una vista de impresión limpia
        const printWindow = window.open('', '_blank');
        const gradesHtml = Array.from(document.querySelectorAll('.grades-table-pdf-source')).map(table => {
            const t = table.cloneNode(true);
            t.style.width = "100%";
            t.style.border = "1px solid #ccc";
            t.style.marginTop = "20px";
            return `<h3>Trimestre ${table.dataset.trimestre}</h3>${t.outerHTML}`;
        }).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Reporte de Calificaciones - ${nombre}</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; }
                        .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; }
                        table { border-collapse: collapse; margin-bottom: 20px; }
                        th, td { border: 1px solid #eee; padding: 10px; text-align: left; }
                        .footer { margin-top: 50px; font-size: 0.8rem; color: #666; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${CONFIG.appName.toUpperCase()}: REPORTE ACADÉMICO</h1>
                        <p>${CONFIG.schoolName.toUpperCase()}</p>
                    </div>
                    <div style="margin-top: 20px;">
                        <p><b>Alumno:</b> ${nombre}</p>
                        <p><b>Matrícula:</b> ${matricula}</p>
                        <p><b>Fecha de Emisión:</b> ${new Date().toLocaleDateString()}</p>
                    </div>
                    ${gradesHtml}
                    <div class="footer">
                        <p>Este documento es un reporte informativo generado por el sistema ${CONFIG.appName}.</p>
                        <p>Para validez oficial, requiere firma y sello de la Dirección del Plantel.</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();

    } catch(err) {
        alert("Error al procesar el documento. Intenta de nuevo.");
    } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
    }
};

window.loadFirmasPendientes = async () => {
    const cont = document.getElementById('citatoriosContainer');
    if(!cont) return;
    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) return;
        
        // Obtenemos al alumno para poder ver su grupo
        const { data: alum } = await supabaseClient.from('alumnos').select('id, grupo_id').eq('perfil_id', u.data.user.id).single();
        
        // Carga de comunicados directos (independiente de grupo)
        const { data: avisos } = await supabaseClient.from('comunicados').select('*').eq('audiencia', `Alumno_${alum?.id}`).order('fecha_envio', { ascending: false });
        
        let htmlBase = '';
        if(avisos && avisos.length > 0) {
            htmlBase += '<h4 style="margin:10px 0;">Avisos y Citatorios</h4>';
            avisos.forEach(a => {
                htmlBase += `
                    <div style="padding:15px; background:white; border-radius:12px; border:1px solid #eee; margin-bottom:10px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                        <b style="color:var(--primary)">${a.titulo}</b><br>
                        <p style="margin:5px 0; font-size:0.9rem;">${a.mensaje}</p>
                        <div style="text-align:right"><button class="btn btn-xs btn-outline" style="color:var(--success); border-color:var(--success)">Enterado</button></div>
                    </div>`;
            });
        }

        if(!alum || !alum.grupo_id) {
             cont.innerHTML = htmlBase || '<div style="padding:20px; text-align:center; color:var(--text-muted);">Sin grupo ni avisos asignados.</div>';
             return;
        }
        
        // Obtenemos los encuadres del grupo
        const { data: encuadres } = await supabaseClient.from('encuadres').select('*, perfiles(nombre)').eq('grupo_id', alum.grupo_id);
        
        if(!encuadres || encuadres.length === 0) {
            cont.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted);">Sin encuadres o firmas pendientes.</div>';
            return;
        }
        
        // Obtenemos cuáles ya están firmados por este alumno
        const enc_ids = encuadres.map(e => e.id);
        const { data: firmas } = await supabaseClient.from('firmas_encuadre').select('encuadre_id').eq('alumno_id', alum.id).in('encuadre_id', enc_ids);
        const signedIds = firmas ? firmas.map(f => f.encuadre_id) : [];
        
        let pendientesHTML = '';
        encuadres.forEach(enc => {
            if(!signedIds.includes(enc.id)) {
                
                let rubrosList = enc.rubros.map(r => `<li>${r.name}: ${r.val}%</li>`).join('');
                
                pendientesHTML += `
                 <div class="card" style="border:1px solid var(--warning); margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #fef3c7; padding-bottom:12px; margin-bottom:12px;">
                       <span style="font-weight:bold; color:var(--warning)"><i class="fa-solid fa-file-signature"></i> Encuadre Pendiente</span>
                       <span style="font-size:0.8rem; color:var(--text-muted)">Maestro: ${enc.perfiles ? enc.perfiles.nombre : 'Maestro'}</span>
                    </div>
                    <h4 style="margin:0 0 8px 0;">Materia: ${enc.materia}</h4>
                    <p style="font-size:0.85rem; color:var(--text-main); margin-bottom:8px;">Por favor, revise con su hij@ los rubros de evaluación para este ciclo y firme de enterado:</p>
                    <ul style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px; padding-left:20px;">
                        ${rubrosList}
                    </ul>
                    <button class="btn btn-primary" style="width:100%" onclick="window.firmarEncuadre('${enc.id}', '${alum.id}')">Firmar Electrónicamente de Enterado</button>
                 </div>
                `;
            }
        });
        
        if(pendientesHTML === '') {
            cont.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted);">Todo al corriente. No hay firmas pendientes.</div>';
        } else {
            cont.innerHTML = pendientesHTML;
        }
    } catch(e) {
        console.error(e);
        cont.innerHTML = '<div style="padding:20px; text-align:center; color:var(--danger);">Error al cargar encuadres.</div>';
    }
};

window.firmarEncuadre = async (encuadre_id, alumno_id) => {
    let firma = prompt("Para firmar de enterado, escriba su Nombre Completo (o el del Padre/Tutor):");
    if(!firma) return;
    
    try {
        const { error } = await supabaseClient.from('firmas_encuadre').insert([{ 
            encuadre_id: encuadre_id, 
            alumno_id: alumno_id, 
            firma: firma,
            plantel_id: state.plantelId
        }]);
        if(error) throw error;
        alert("Firma de enterado registrada exitosamente. Muchas gracias.");
        window.loadFirmasPendientes();
    } catch(e) {
        console.error(e);
        alert("Error al guardar firma.");
    }
};

window.loadTimelineAlumno = async (mostrarHistorial = false) => {
    const cont = document.getElementById('timelineAlumnoContenedor');
    if(!cont) return;
    
    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data?.user) return;
        
        let audArr = ['General', 'Alumnos'];
        
        // Buscar alumno por email O por perfil_id (más seguro)
        const { data: al } = await supabaseClient
            .from('alumnos')
            .select('id, creado_en')
            .or(`contacto_email.eq.${u.data.user.email},perfil_id.eq.${u.data.user.id}`)
            .maybeSingle();

        if(al) {
            console.log(">>> [TIMELINE] Alumno detectado:", al.id, "| Inscrito en:", al.creado_en);
            audArr.push('Alumno_' + al.id);
        } else {
            console.warn(">>> [TIMELINE] No se encontró vínculo de Alumno para el usuario logueado.");
        }
        
        // Obtener vistos
        const { data: vistos } = await supabaseClient.from('comunicados_vistos').select('comunicado_id').eq('perfil_id', u.data.user.id);
        const vistosIds = vistos ? vistos.map(v => v.comunicado_id) : [];

        console.log(">>> [TIMELINE] Buscando comunicados para audiencia:", audArr);
        let query = supabaseClient.from('comunicados')
           .select('*, perfiles(nombre)')
           .in('audiencia', audArr)
           .order('fecha_envio', { ascending: false });

        // FILTRO DE SEGURIDAD: Solo avisos desde la inscripción
        if(al && al.creado_en) {
            query = query.gte('fecha_envio', al.creado_en);
        }

        if(mostrarHistorial) {
            const fecha = document.getElementById('filtroFechaAvisos').value;
            if(fecha) {
                query = query.gte('fecha_envio', `${fecha} 00:00:00`).lte('fecha_envio', `${fecha} 23:59:59`);
                // Nota: Si la fecha seleccionada es ANTERIOR a la inscripción, 
                // el gte(al.creado_en) hará que no salga nada, lo cual es correcto.
            }
        } else {
            query = query.limit(20);
        }
           
        const { data, error } = await query;
        if(error) throw error;
        
        // Filtrar en JS si no es historial (solo mostrar no vistos)
        const dFinal = mostrarHistorial ? data : data.filter(c => !vistosIds.includes(c.id));

        if(!dFinal || dFinal.length === 0) {
            cont.innerHTML = `<div style="padding:40px 20px; text-align:center; color:var(--text-muted);">
                <i class="fa-solid fa-check-circle" style="font-size:3rem; margin-bottom:15px; opacity:0.3"></i>
                <p>${mostrarHistorial ? 'No hubo avisos en esta fecha.' : '¡Todo al día! No tienes comunicados pendientes.'}</p>
            </div>`;
            return;
        }
        
        cont.innerHTML = dFinal.map((c, i) => {
           const delay = i * 0.1;
           const date = new Date(c.fecha_envio).toLocaleDateString('es-MX', { year: '2-digit', month: 'short', day: 'numeric' });
           const esEncuadre = c.titulo && c.titulo.toLowerCase().includes('encuadre');
           let btnAdjunto = '';
           if(c.archivo_url) {
               btnAdjunto = `<a href="${c.archivo_url}" target="_blank" class="btn btn-outline" style="margin-top: 12px; font-size: 0.8rem; padding: 6px 12px; border-color:var(--primary); color:var(--primary)"><i class="fa-solid fa-paperclip"></i> Ver Documento</a>`;
           }
           const esVisto = vistosIds.includes(c.id);
           const tipoColor = esEncuadre ? 'var(--warning)' : (c.audiencia === 'General' ? 'var(--success)' : 'var(--danger)');
           const icon = esEncuadre ? 'fa-file-signature' : 'fa-bullhorn';

           let btnAccion = '';
           if(!esVisto) {
               if(esEncuadre) {
                   btnAccion = `<button onclick="window.firmarEncuadreDesdeTimeline('${c.id}', this)" class="btn btn-sm btn-primary" style="font-size:0.75rem; display:flex; align-items:center; gap:6px;">
                       <i class="fa-solid fa-signature"></i> Firmar de Enterado
                   </button>`;
               } else {
                   btnAccion = `<button onclick="window.marcarAvisoEnterado('${c.id}')" class="btn btn-sm" style="font-size:0.7rem; background:var(--page-bg); color:var(--text-main); border:1px solid var(--border)"><i class="fa-solid fa-check"></i> Enterado</button>`;
               }
           } else {
               btnAccion = esEncuadre
                   ? '<span style="font-size:0.75rem; color:var(--success); display:flex; align-items:center; gap:4px;"><i class="fa-solid fa-pen-nib"></i> Firmado</span>'
                   : '<span style="font-size:0.7rem; color:var(--success)"><i class="fa-solid fa-check-double"></i> Leído</span>';
           }
           
           return `
           <div class="timeline-item" id="aviso-${c.id}" style="animation: fadeInUp 0.5s ease backwards; animation-delay: ${delay}s; ${esVisto ? 'opacity: 0.6;' : ''}">
             <div class="timeline-icon" style="border-color: ${tipoColor}; background:white;"><i class="fa-solid ${icon}" style="color: ${tipoColor};"></i></div>
             <div class="timeline-content" style="position:relative">
               <div style="font-size:0.75rem; color: var(--text-muted); float:right;">${date}</div>
               <h4 style="color: ${tipoColor}; margin:0 0 4px 0;">${c.titulo}</h4>
               <p style="font-size: 0.85rem; white-space:pre-wrap; margin-bottom:10px;">${c.mensaje}</p>
               
               <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                  ${btnAdjunto}
                  ${btnAccion}
               </div>
             </div>
           </div>
           `;
        }).join('');
    } catch(err) {
        console.error(err);
        cont.innerHTML = '<div style="color:var(--danger); padding:10px;text-align:center;">Error cargando avisos</div>';
    }
};

window.marcarAvisoEnterado = async (id) => {
    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data?.user) return;
        
        const { error } = await supabaseClient.from('comunicados_vistos').insert({
            perfil_id: u.data.user.id,
            comunicado_id: id
        });
        
        if(error) throw error;
        
        const card = document.getElementById(`aviso-${id}`);
        if(card) {
            card.style.transform = 'translateX(100%)';
            card.style.opacity = '0';
            card.style.transition = 'all 0.5s ease';
            setTimeout(() => card.remove(), 500);
        }
    } catch(e) { console.error(e); }
};

window.firmarEncuadreDesdeTimeline = async (comunicadoId, btn) => {
    if(!confirm('¿Deseas registrar tu Firma Digital de Enterado en este encuadre? Esta acción queda registrada en el sistema escolar.')) return;
    try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Firmando...';
        const u = await supabaseClient.auth.getUser();
        if(!u.data?.user) return;

        // 1. Marcar como leído/firmado en comunicados_vistos (para el timeline)
        await supabaseClient.from('comunicados_vistos').upsert({
            perfil_id: u.data.user.id,
            comunicado_id: comunicadoId
        }, { onConflict: 'perfil_id,comunicado_id' });

        // 2. Obtener datos del alumno (intentar perfil_id y luego email como plan B)
        let { data: al } = await supabaseClient.from('alumnos').select('id, nombre, grupo_id, contacto_email').eq('perfil_id', u.data.user.id).maybeSingle();
        
        if(!al) {
            console.log(">>> [FIRMA] Alumno sin perfil_id, intentando por email:", u.data.user.email);
            const { data: alEmail } = await supabaseClient.from('alumnos').select('id, nombre, grupo_id, contacto_email').eq('contacto_email', u.data.user.email).maybeSingle();
            if(alEmail) {
                al = alEmail;
                // De paso, vinculamos el perfil_id para la próxima vez
                await supabaseClient.from('alumnos').update({ perfil_id: u.data.user.id }).eq('id', al.id);
            }
        }

        // 2.1 Obtener datos del comunicado original
        const { data: com } = await supabaseClient.from('comunicados').select('titulo, mensaje, autor_id').eq('id', comunicadoId).maybeSingle();

        if(al && com) {
            // Pedir firma digital
            const firmaTexto = prompt('Para completar tu Firma Digital, escribe tu Nombre Completo (o el del Padre/Tutor):') || al.nombre;
            if(!firmaTexto) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-signature"></i> Firmar de Enterado';
                return;
            }

            // 3. Identificar el encuadre (Prioridad 1: ID oculto en el mensaje)
            let targetEncId = null;
            const refMatch = com.mensaje.match(/\[REF_ID:\s*([a-f0-9-]{36})\]/i);
            const tituloMatch = com.titulo.replace(/.*Encuadre de Evaluación:\s*/i, '').replace(/\s*\(.*\)/, '').trim();

            if(refMatch) {
                targetEncId = refMatch[1];
                console.log(">>> [FIRMA] ID encontrado en mensaje:", targetEncId);
            } else {
                // Prioridad 2: Buscar por nombre y grupo (Plan B para avisos viejos)
                const isTecAviso = com.titulo.toLowerCase().includes('grado');

                let qEnc = supabaseClient.from('encuadres').select('id, grupo_id, target_grado')
                    .eq('maestro_id', com.autor_id)
                    .ilike('materia', tituloMatch); // ilike ayuda con mayúsculas/minúsculas

                const { data: encs } = await qEnc;
                if(encs && encs.length > 0) {
                    if(isTecAviso) {
                        const { data: gData } = await supabaseClient.from('grupos').select('nombre').eq('id', al.grupo_id).maybeSingle();
                        const gradoNum = gData ? gData.nombre.replace(/[^0-9]/g, '') : null;
                        const match = encs.find(e => e.target_grado?.toString() === gradoNum && !e.grupo_id);
                        if(match) targetEncId = match.id;
                    } else {
                        const match = encs.find(e => e.grupo_id === al.grupo_id);
                        if(match) targetEncId = match.id;
                    }
                }
            }

            if(targetEncId) {
                const { error: errFirma } = await supabaseClient.from('firmas_encuadre').upsert({
                    encuadre_id: targetEncId,
                    alumno_id: al.id,
                    firma: firmaTexto
                }, { onConflict: 'encuadre_id,alumno_id' });
                
                if(errFirma) throw errFirma;

                // 4. Enviar notificación al maestro
                await supabaseClient.from('comunicados').insert([{
                    autor_id: u.data.user.id,
                    titulo: `✅ Firma de Enterado: ${al.nombre}`,
                    mensaje: `El alumno(a) ${al.nombre} ha firmado el encuadre de ${tituloMatch}.\n\n✍️ Firma: ${firmaTexto}`,
                    audiencia: `Maestro_${com.autor_id}`
                }]);
                
                alert(`✅ Firma registrada con éxito para ${tituloMatch}.\nTu profesor ya puede ver tu enterado en su registro.`);
            } else {
                alert(`⚠️ Error: No se encontró el registro oficial de encuadre para la materia "${tituloMatch}".\nFavor de informar a tu profesor para que verifique el envío.`);
            }
        }

        // 5. Actualizar UI
        const card = document.getElementById(`aviso-${comunicadoId}`);
        if(card) {
            const btnWrap = card.querySelector('.btn-primary')?.parentElement;
            if(btnWrap) btnWrap.innerHTML = '<span style="color:var(--success); font-size:0.75rem;"><i class="fa-solid fa-pen-nib"></i> Firmado ✔</span>';
        }
    } catch(e) {
        console.error(e);
        alert('Error al firmar: ' + e.message);
        if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-signature"></i> Firmar de Enterado'; }
    }
};

window.loadFirmantesEncuadre = async () => {
    const cont = document.getElementById('contenedorFirmantes');
    const sel = document.getElementById('encuadreGrupoMateria');
    if(!cont || !sel || !sel.value) return;

    cont.innerHTML = '<div style="padding:20px; text-align:center;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando estado de firmas...</div>';

    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) return;

        const [idPart, mat] = sel.value.split('|');
        const isTec = idPart.startsWith('grado:');
        const gid = isTec ? null : idPart;
        const targetGrado = isTec ? idPart.replace('grado:', '') : null;

        // 1. Obtener TODOS los IDs de encuadre de este maestro/materia/TRIMESTRE
        let qEnc = supabaseClient.from('encuadres')
            .select('id')
            .eq('maestro_id', u.data.user.id)
            .ilike('materia', mat)
            .eq('trimestre', window.currentTrimestre || 1);
        
        if(isTec) qEnc = qEnc.is('grupo_id', null).eq('target_grado', targetGrado);
        else qEnc = qEnc.eq('grupo_id', gid);
        
        const { data: encList } = await qEnc;
        const encIds = encList ? encList.map(e => e.id) : [];
        console.log(">>> [TRACKING] IDs de encuadre encontrados para esta materia:", encIds);

        if(encIds.length === 0) {
            cont.innerHTML = '<p style="color:var(--text-muted); padding:20px;">Este encuadre aún no ha sido enviado o no se encontró el registro oficial.</p>';
            return;
        }

        // 2. Obtener lista de alumnos
        let qAl = supabaseClient.from('alumnos').select('id, nombre, matricula').order('nombre');
        if(isTec) {
            const gNorm = targetGrado.includes('°') ? targetGrado : targetGrado + '°';
            // v116: Robust matching for technologies (ignores accent in word Tecnología)
            const cleanMat = mat.replace(/tecnología|tecnologia/gi, '').trim();
            qAl = qAl.eq('grado', gNorm).ilike('taller', `%${cleanMat || mat}%`);

        } else {
            qAl = qAl.eq('grupo_id', gid);
        }
        const { data: alumnos } = await qAl;

        // 3. Obtener TODAS las firmas relacionadas a esos IDs
        const { data: firmasRaw } = await supabaseClient.from('firmas_encuadre')
            .select('alumno_id, fecha_firma, firma, encuadre_id')
            .in('encuadre_id', encIds);

        // Mapear firmas para saber de qué encuadre vienen específicamente
        const firmas = firmasRaw ? firmasRaw.map(f => ({ ...f, enc_id_original: f.encuadre_id })) : [];

        if(!alumnos || alumnos.length === 0) {
            cont.innerHTML = '<p style="color:var(--text-muted); padding:20px;">No hay alumnos registrados en este grupo.</p>';
            return;
        }

        // 4. Mapear y Renderizar
        const mapFirmas = {};
        if(firmas) firmas.forEach(f => mapFirmas[f.alumno_id] = f);

        let html = `
            <div style="margin-top:15px; border:1px solid var(--border-color); border-radius:12px; overflow:hidden;">
                <table style="width:100%; border-collapse:collapse; font-size:0.85rem; background:white;">
                    <thead style="background:var(--page-bg); color:var(--text-muted);">
                        <tr>
                            <th style="padding:10px; text-align:left; border-bottom:1px solid var(--border-color);">Alumno</th>
                            <th style="padding:10px; text-align:center; border-bottom:1px solid var(--border-color);">Estado</th>
                            <th style="padding:10px; text-align:left; border-bottom:1px solid var(--border-color);">Firma/Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        alumnos.forEach(al => {
            const f = mapFirmas[al.id];
            const statusIcon = f ? '<i class="fa-solid fa-circle-check" style="color:var(--success)"></i>' : '<i class="fa-solid fa-circle-minus" style="color:#ccc"></i>';
            const statusText = f ? '<span style="color:var(--success); font-weight:600;">Enterado</span>' : '<span style="color:var(--text-muted)">Pendiente</span>';
            const signatureInfo = f ? `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                    <div style="font-size:0.75rem;">
                        <strong style="display:block; color:var(--primary);">${f.firma || 'Firma Digital'}</strong>
                        <span style="color:var(--text-muted); font-size:0.7rem;">${new Date(f.fecha_firma).toLocaleString('es-MX', {dateStyle:'short', timeStyle:'short'})}</span>
                    </div>
                    <button onclick="window.eliminarFirmaEncuadre('${al.id}', '${f.enc_id_original}')" class="btn btn-ghost btn-xs" style="color:var(--danger); padding:5px;" title="Eliminar firma para permitir re-firmar">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            ` : '---';

            html += `
                <tr style="border-bottom:1px solid var(--border-color);">
                    <td style="padding:10px;">
                        <span style="display:block; font-weight:500;">${al.nombre}</span>
                        <span style="font-size:0.7rem; color:var(--text-muted);">${al.matricula}</span>
                    </td>
                    <td style="padding:10px; text-align:center;">
                        <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                            ${statusIcon}
                            ${statusText}
                        </div>
                    </td>
                    <td style="padding:10px;">${signatureInfo}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
            <div style="margin-top:10px; display:flex; gap:15px; font-size:0.75rem; color:var(--text-muted); padding:5px;">
                <span><i class="fa-solid fa-circle-check" style="color:var(--success)"></i> Firmados: ${firmas?.length || 0}</span>
                <span><i class="fa-solid fa-circle-minus" style="color:#ccc"></i> Pendientes: ${alumnos.length - (firmas?.length || 0)}</span>
            </div>
        `;
        cont.innerHTML = html;

    } catch (e) {
        console.error(e);
        cont.innerHTML = '<p style="color:var(--danger); padding:20px;">Error al cargar firmantes.</p>';
    }
};

window.eliminarFirmaEncuadre = async (alumnoId, encuadreId) => {
    if(!confirm('¿Estás seguro de eliminar esta firma? El alumno volverá a ver el aviso como "Pendiente de Firma".')) return;

    try {
        // 1. Borrar de firmas_encuadre
        await supabaseClient.from('firmas_encuadre').delete().match({ alumno_id: alumnoId, encuadre_id: encuadreId });

        // 2. Opcional: Borrar de comunicados_vistos para que el botón de "Firmar" reaparezca en el timeline
        // Necesitamos el ID del comunicado del encuadre. Lo buscamos rápido.
        const { data: enc } = await supabaseClient.from('encuadres').select('materia, maestro_id').eq('id', encuadreId).maybeSingle();
        if(enc) {
            const tituloLike = `%${enc.materia}%`;
            const { data: coms } = await supabaseClient.from('comunicados')
                .select('id')
                .eq('autor_id', enc.maestro_id)
                .ilike('titulo', '%Encuadre%')
                .ilike('titulo', tituloLike);
            
            if(coms && coms.length > 0) {
                // Buscamos el perfil_id del alumno para borrar su 'visto'
                const { data: al } = await supabaseClient.from('alumnos').select('perfil_id').eq('id', alumnoId).maybeSingle();
                if(al) {
                    await supabaseClient.from('comunicados_vistos').delete().eq('perfil_id', al.perfil_id).in('comunicado_id', coms.map(c => c.id));
                }
            }
        }

        alert("✅ Firma eliminada. El alumno ya puede firmar de nuevo.");
        window.loadFirmantesEncuadre(); // Recargar tabla
    } catch (e) {
        console.error(e);
        alert("Error al eliminar firma: " + e.message);
    }
};

window.loadTimelinePersonal = async (selectedDate) => {
    const cont = document.getElementById('timelinePersonalContenedor');
    if(!cont) return;

    // Si no viene fecha, usar hoy
    const targetDate = selectedDate || new Date().toLocaleDateString('en-CA');
    
    // Rango de fecha para el día completo (00:00:00 a 23:59:59)
    const startOfDay = `${targetDate}T00:00:00.000Z`;
    const endOfDay = `${targetDate}T23:59:59.999Z`;

    cont.innerHTML = '<div style="padding:40px; text-align:center;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="color:var(--text-muted); margin-top:10px;">Actualizando cronología...</p></div>';
    
    try {
        const uRes = await supabaseClient.auth.getUser();
        let audArr = ['General', 'Maestros'];
        
        if(uRes.data?.user) {
            const userId = uRes.data.user.id;
            const email = uRes.data.user.email;
            
            // Escuchar su canal personal
            audArr.push('Maestro_' + userId);
            
            // Cargar asignaciones (grupos específicos y grados completos)
            const { data: asig } = await supabaseClient.from('asignaciones_maestros').select('grupo_id, target_grado').eq('docente_email', email);
            
            if(asig) {
                for (const a of asig) {
                    if(a.grupo_id) {
                        audArr.push('Grupo_' + a.grupo_id);
                    } else if(a.target_grado) {
                        // Si está asignado a un grado completo (ej 3°), buscar todos los IDs de grupos que empiecen con ese grado
                        const { data: relatedGroups } = await supabaseClient
                            .from('grupos')
                            .select('id')
                            .like('nombre', a.target_grado + '%');
                        
                        if(relatedGroups) {
                            relatedGroups.forEach(rg => audArr.push('Grupo_' + rg.id));
                        }
                    }
                }
            }
        }

        const { data, error } = await supabaseClient.from('comunicados')
           .select('*, perfiles(nombre)')
           .in('audiencia', audArr)
           .gte('fecha_envio', startOfDay)
           .lte('fecha_envio', endOfDay)
           .order('fecha_envio', { ascending: false });
           
        if(error) throw error;
        
        // --- RESOLUCIÓN DE AUDIENCIAS (Humano-Leíble) ---
        const groupIds = [];
        const studentIds = [];
        data.forEach(c => {
            if(c.audiencia.startsWith('Grupo_')) groupIds.push(c.audiencia.replace('Grupo_', ''));
            if(c.audiencia.startsWith('Alumno_')) studentIds.push(c.audiencia.replace('Alumno_', ''));
        });

        const nameMap = { 'General': 'Aviso General', 'Maestros': 'Solo Maestros', 'Apoyo': 'Personal de Apoyo' };
        if(groupIds.length > 0) {
            const { data: grs } = await supabaseClient.from('grupos').select('id, nombre').in('id', groupIds);
            if(grs) grs.forEach(g => nameMap['Grupo_' + g.id] = 'Grupo: ' + g.nombre);
        }
        if(studentIds.length > 0) {
            const { data: stus } = await supabaseClient.from('alumnos').select('id, nombre, grupos(nombre)').in('id', studentIds);
            if(stus) stus.forEach(s => nameMap['Alumno_' + s.id] = `Alumno: ${s.nombre} (${s.grupos?.nombre || 'S/G'})`);
        }

        if(!data || data.length === 0) {
            cont.innerHTML = `
                <div style="padding:60px; text-align:center; color:var(--text-muted);">
                    <i class="fa-regular fa-calendar-xmark fa-3x" style="opacity:0.2; margin-bottom:15px; display:block;"></i>
                    <p>No hay avisos oficiales registrados para el día <strong>${new Date(targetDate).toLocaleDateString('es-MX', {dateStyle:'long'})}</strong>.</p>
                </div>`;
            return;
        }
        
        cont.innerHTML = data.map((c) => {
           const date = new Date(c.fecha_envio).toLocaleString('es-MX', { timeStyle: 'short' });
           let btnAdjunto = '';
           if(c.archivo_url) {
               btnAdjunto = `<a href="${c.archivo_url}" target="_blank" class="btn btn-outline" style="margin-top: 12px; font-size: 0.85rem; border-color:var(--primary); color:var(--primary); border-radius:20px;"><i class="fa-solid fa-file-pdf"></i> Descargar Adjunto</a>`;
           }
           let tipoColor = c.audiencia === 'General' ? 'var(--success)' : 'var(--primary)';
           let iconAud = c.audiencia === 'General' ? 'globe' : 'chalkboard-user';
           
           return `
           <div class="card" style="border-left: 5px solid ${tipoColor}; border-radius:12px; transition: transform 0.2s ease; margin-bottom:0;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                 <span style="font-size:0.75rem; color:var(--text-muted); background:var(--page-bg); padding:4px 10px; border-radius:20px;">
                    <i class="fa-regular fa-clock"></i> ${date}
                 </span>
                 <span style="font-size:0.75rem; font-weight:bold; text-transform:uppercase; color:${tipoColor}; padding:4px 10px; background:${tipoColor}15; border-radius:30px;">
                    <i class="fa-solid fa-${iconAud}"></i> ${nameMap[c.audiencia] || c.audiencia}
                 </span>
              </div>
              <h3 style="color: var(--text-main); margin:0 0 10px 0; font-size:1.1rem; line-height:1.4;">${c.titulo}</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); white-space:pre-wrap; margin:0; line-height:1.6;">${c.mensaje}</p>
              ${btnAdjunto}
           </div>
           `;
        }).join('');
    } catch(err) {
        console.error(err);
        cont.innerHTML = '<div style="color:var(--danger); padding:40px;text-align:center;"><i class="fa-solid fa-circle-exclamation fa-2x"></i><p>Error de conexión al cargar la cronología.</p></div>';
    }
};

window.cambiarTabActividades = (tab) => {
    state.actividadesTab = tab;
    const btnV = document.getElementById('tabActsVigentes');
    const btnA = document.getElementById('tabActsArchivo');
    
    if(tab === 'vigentes') {
        btnV.style.background = 'white';
        btnV.style.border = '1px solid var(--border)';
        btnV.style.color = 'var(--text-main)';
        btnA.style.background = 'transparent';
        btnA.style.border = 'none';
        btnA.style.color = 'var(--text-muted)';
    } else {
        btnA.style.background = 'white';
        btnA.style.border = '1px solid var(--border)';
        btnA.style.color = 'var(--text-main)';
        btnV.style.background = 'transparent';
        btnV.style.border = 'none';
        btnV.style.color = 'var(--text-muted)';
    }
    
    window.loadActividadesMaestro();
};

window.loadActividadesMaestro = async () => {
    const selGrupo = document.getElementById('actMateriaGrupo');
    const constLista = document.getElementById('listaActividadesMaestro');
    if(!constLista) return;
    
    const currentTab = state.actividadesTab || 'vigentes';

    try {
        const currentUser = await supabaseClient.auth.getUser();
        if(!currentUser.data.user) return;
        const email = currentUser.data.user.email;

        // Cargar seleccionables (solo si existe el select y está vacío/default)
        if (selGrupo && (selGrupo.innerHTML.includes("Cargando") || selGrupo.options.length <= 1)) {
            const { data: asigs, error: errAsigs } = await supabaseClient.from('asignaciones_maestros')
               .select('materia, grupo_id, target_grado, grupos(id, nombre)')
               .eq('docente_email', email)
               .or('grupo_id.not.is.null,target_grado.not.is.null');
               
            if(!errAsigs && asigs) {
                selGrupo.innerHTML = '<option value="">-- Selecciona --</option>' + 
                   asigs.map(a => {
                       if(a.grupos) return `<option value="${a.grupos.id}|${a.materia}">${a.materia} - ${a.grupos.nombre}</option>`;
                       if(a.target_grado) return `<option value="grado:${a.target_grado}|${a.materia}">${a.materia} - Grado ${a.target_grado} (Tecnología)</option>`;
                       return '';
                   }).filter(Boolean).join('');
            }
        }

        // Fetch actividades del maestro filtradas por pestaña y trimestre
        const isFinalizada = currentTab === 'archivo';
        const trimSelected = document.getElementById('filtroTrimestreAct')?.value || 1;
        
        const { data: misActividades, error: errAct } = await supabaseClient.from('actividades_maestro')
           .select('*, grupos(nombre), evaluaciones_actividades(id)')
           .eq('finalizada', isFinalizada)
           .eq('trimestre', trimSelected)
           .order('fecha_creacion', { ascending: false });
           
        if(errAct) throw errAct;

        if(!misActividades || misActividades.length === 0) {
            constLista.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted)">
                <i class="fa-solid fa-folder-open fa-2x" style="opacity:0.2; margin-bottom:10px; display:block;"></i>
                No hay actividades ${isFinalizada ? 'archivadas' : 'vigentes'} actualmente.
            </div>`;
            return;
        }

        constLista.innerHTML = misActividades.map(act => {
            const count = act.evaluaciones_actividades ? act.evaluaciones_actividades.length : 0;
            const fechaTxt = isFinalizada ? 
                `<span style="font-size:0.75rem; color:var(--text-muted); background:var(--page-bg); padding:2px 8px; border-radius:4px;">Cerrada el: ${new Date(act.fecha_finalizacion).toLocaleDateString()}</span>` : 
                `<span style="font-size:0.75rem; color:var(--text-muted);">Creada: ${new Date(act.fecha_creacion).toLocaleDateString()}</span>`;

            const actionButtons = isFinalizada ? 
                `<div style="display:flex; gap:8px;">
                    <button class="btn btn-outline" style="border-color:var(--primary); color:var(--primary); font-size:0.8rem; padding:6px 12px;" onclick="window.reabrirActividad('${act.id}')">
                        <i class="fa-solid fa-rotate-left"></i> Reabrir
                    </button>
                    <button class="btn btn-outline" style="border-color:var(--danger); color:var(--danger); font-size:0.8rem; padding:6px 12px;" onclick="window.eliminarActividadMaestro('${act.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>` :
                `<div style="display:flex; gap:8px;">
                    <button class="btn btn-outline" style="border-color:var(--success); color:var(--success); font-size:0.8rem; padding:6px 12px;" onclick="window.abrirQREvaluacion('${act.id}', '${act.titulo.replace(/'/g, "\\'")}', '${act.grupo_id || ''}', '${act.target_grado || ''}', '${act.materia || ''}')">
                        <i class="fa-solid fa-qrcode"></i> Evaluar QR
                    </button>
                    <button class="btn btn-outline" style="border-color:var(--danger); color:var(--danger); font-size:0.8rem; padding:6px 12px;" onclick="window.finalizarActividad('${act.id}')">
                        <i class="fa-solid fa-box-archive"></i> Cerrar
                    </button>
                </div>`;

            return `
            <div class="card-actividad" style="border:1px solid var(--border); border-radius:12px; padding:20px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.2s ease;">
               <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                   <div style="flex:1;">
                      <div style="display:flex; gap:10px; align-items:center; margin-bottom:6px;">
                        <span style="font-weight:bold; font-size:1.15rem; color:var(--text-main);">${act.titulo}</span>
                        <span class="badge" style="background:#f0fdf4; color:#166534; border: 1px solid #166534; font-size:0.7rem;">${act.materia}</span>
                      </div>
                      <div style="font-size:0.85rem; color:var(--text-muted);">${act.grupos ? act.grupos.nombre : (act.target_grado ? act.target_grado+'° Grado' : 'Grupo')} • ${fechaTxt}</div>
                      
                      <div style="margin-top:12px; display:flex; gap:15px; align-items:center;">
                        <div style="font-size:0.85rem;">
                            <i class="fa-solid fa-users" style="color:var(--primary); opacity:0.6;"></i> 
                            Evaluados: <strong style="color:var(--text-main);">${count}</strong>
                        </div>
                        ${act.rubro_name ? `<div style="font-size:0.8rem; color:var(--warning); font-weight:600;"><i class="fa-solid fa-tag"></i> ${act.rubro_name}</div>` : ''}
                      </div>
                   </div>
                   ${actionButtons}
               </div>
            </div>`;
        }).join('');

    } catch (err) {
        console.error(err);
        constLista.innerHTML = '<div style="color:var(--danger); padding:20px;text-align:center;">Error al cargar actividades del maestro.</div>';
    }
};

window.finalizarActividad = async (id) => {
    if(!confirm("¿Deseas cerrar esta actividad? Se moverá al archivo pero podrás reabrirla si necesitas evaluar más alumnos. Además, se enviará un aviso automático a los alumnos que no cumplieron con la actividad.")) return;

    try {
        // v117: Notificar automáticamente a quienes no cumplieron
        // 1. Obtener detalles de la actividad
        const { data: act } = await supabaseClient.from('actividades_maestro')
            .select('titulo, grupo_id, target_grado, materia, maestro_id, plantel_id')
            .eq('id', id).single();

        if (act) {
            // 2. Obtener lista de alumnos (mismo grupo o tecnología)
            let qAlu = supabaseClient.from('alumnos').select('id, nombre');
            if(act.grupo_id) {
                qAlu = qAlu.eq('grupo_id', act.grupo_id);
            } else if(act.target_grado) {
                const gNorm = act.target_grado.includes('°') ? act.target_grado : act.target_grado + '°';
                // Usamos la misma lógica robusta de búsqueda de tecnologías que implementamos antes
                const cleanMat = act.materia.replace(/tecnología|tecnologia/gi, '').trim();
                qAlu = qAlu.eq('grado', gNorm).ilike('taller', `%${cleanMat || act.materia}%`);
            }
            const { data: todosAlumnos } = await qAlu;

            // 3. Obtener quienes ya tienen calificación
            const { data: evaluados } = await supabaseClient.from('evaluaciones_actividades')
                .select('alumno_id')
                .eq('actividad_id', id);
            
            const evaluadosIds = new Set((evaluados || []).map(e => e.alumno_id));

            // 4. Identificar quienes no cumplieron (no están en la lista de evaluados)
            const noCumplieron = (todosAlumnos || []).filter(a => !evaluadosIds.has(a.id));

            // 5. Asignar 0 automático y enviar comunicados
            if(noCumplieron.length > 0) {
                // 5a. Insertar calificaciones en 0 para que existan los registros
                const dataEval = noCumplieron.map(al => ({
                    actividad_id: id,
                    alumno_id: al.id,
                    calificacion: 0,
                    fecha_evaluacion: new Date().toISOString(),
                    plantel_id: act.plantel_id || state.plantelId
                }));
                const { error: errZero } = await supabaseClient.from('evaluaciones_actividades').insert(dataEval);
                if(errZero) console.error("Error al asignar 0 automático:", errZero);

                // 5b. Enviar comunicados automáticos
                const notifs = noCumplieron.map(al => ({
                    autor_id: act.maestro_id,
                    titulo: `🔔 INCUMPLIMIENTO: ${act.titulo}`,
                    mensaje: `Se informa que el alumno no entregó o no cumplió con la actividad "${act.titulo}" en la asignatura de ${act.materia}. \n\n⚠️ Nota: Debido al incumplimiento, se ha asignado una calificación de 0. Si el maestro lo permite, esta calificación aún puede ser modificada si el docente decide reabrir la actividad para una entrega extemporánea. Por favor, fomente el cumplimiento de sus tareas escolares.`,
                    audiencia: `Alumno_${al.id}`,
                    plantel_id: act.plantel_id || state.plantelId
                }));
                const { error: errComs } = await supabaseClient.from('comunicados').insert(notifs);
                if(errComs) console.error("Error al enviar avisos de incumplimiento:", errComs);
            }


        }

        // 6. Cerrar actividad oficialmente
        const { error } = await supabaseClient.from('actividades_maestro')
            .update({ finalizada: true, fecha_finalizacion: new Date().toISOString() })
            .eq('id', id);
        
        if(error) throw error;
        window.showToast("Actividad archivada y avisos de incumplimiento enviados", "success");
        window.loadActividadesMaestro();
    } catch(err) {
        console.error(err);
        alert("Error al cerrar actividad: " + err.message);
    }
};


window.reabrirActividad = async (id) => {
    try {
        const { error } = await supabaseClient.from('actividades_maestro')
            .update({ finalizada: false, fecha_finalizacion: null })
            .eq('id', id);
        if(error) throw error;
        window.showToast("Actividad reabierta para evaluación", "success");
        window.loadActividadesMaestro();
    } catch(err) {
        console.error(err);
        alert("Error al reabrir actividad.");
    }
};

window.eliminarActividadMaestro = async (id) => {
    if(!confirm("⚠️ ¿Estás seguro de ELIMINAR esta actividad definitivamente?\n\nEsta acción borrará también todas las calificaciones asentadas en ella y no se puede deshacer.")) return;

    try {
        // 1. Borrar evaluaciones vinculadas primero (por si hay FK)
        await supabaseClient.from('evaluaciones_actividades').delete().eq('actividad_id', id);
        
        // 2. Borrar la actividad
        const { error } = await supabaseClient.from('actividades_maestro').delete().eq('id', id);
        
        if(error) throw error;
        
        window.showToast("Actividad eliminada correctamente", "success");
        window.loadActividadesMaestro();
    } catch(e) { alert("Error: " + e.message); }
};

window.agregarActividad = async () => {
    const titulo = document.getElementById('actTitulo').value;
    const desc = document.getElementById('actDesc').value;
    const val = document.getElementById('actMateriaGrupo').value;
    
    if(!titulo || !val) return alert("Rellena el titulo y selecciona materia/grupo.");
    const [idPart, materia] = val.split('|');
    const isTec = idPart.startsWith('grado:');
    const grupo_id = isTec ? null : idPart;
    const target_grado = isTec ? idPart.replace('grado:', '') : null;
    
    try {
       const user = (await supabaseClient.auth.getUser()).data.user;
       
       const selRubro = document.getElementById('actRubro');
       let rubroName = null, rubroPeso = null;
       
       if (selRubro.value) {
           const info = JSON.parse(selRubro.value);
           rubroName = info.name;
           rubroPeso = info.val;
       }
       
       const trimVal = document.getElementById('actTrimestre').value || 1;
       
       const { error: errInsert } = await supabaseClient.from('actividades_maestro').insert([{
           maestro_id: user.id,
           titulo: titulo,
           descripcion: desc,
           materia: materia,
           grupo_id: grupo_id,
           target_grado: target_grado,
           rubro_name: rubroName,
           rubro_peso: rubroPeso,
           trimestre: parseInt(trimVal),
           plantel_id: state.plantelId
       }]);
       
       if (errInsert) {
           throw errInsert;
       }
       
       alert("Actividad agregada exitosamente");
       document.getElementById('actTitulo').value = '';
       document.getElementById('actDesc').value = '';
       window.loadActividadesMaestro();
    } catch(err) {
       console.error("Error en agregarActividad: ", err);
       alert("Error al guardar la actividad: " + (err.message || "Revisa permisos o datos."));
    }
};

let qrEvalScanner = null;
let currentActividadId = null;
let targetStudentId = null;

window.abrirQREvaluacion = (actId, actTitulo, actGrupoId, actTargetGrado, actMateria) => {
    currentActividadId = actId;
    // Limpiar espacios que puedan venir del template literal
    actGrupoId = (actGrupoId || '').trim();
    actTargetGrado = (actTargetGrado || '').trim();
    actMateria = (actMateria || '').trim();
    const isTec = !actGrupoId && !!actTargetGrado;

    document.getElementById('qrActividadInfo').innerText = "Abierto para: " + actTitulo;
    document.getElementById('modalQREvaluacion').style.display = 'flex';
    document.getElementById('panelCalificacionQR').style.display = 'none';
    
    if(qrEvalScanner) {
        try { qrEvalScanner.stop().catch(()=>{}); } catch(e){}
    }
    
    document.getElementById('qr-reader-eval').innerHTML = '';
    qrEvalScanner = new Html5Qrcode("qr-reader-eval");
    
    qrEvalScanner.start({ facingMode: "environment" }, { fps: 10, qrbox: {width: 250, height: 250} }, async (decodedText) => {
        try { await qrEvalScanner.stop(); } catch(e){}
        document.getElementById('qr-reader-eval').innerHTML = '<div style="color:var(--success); text-align:center; padding:20px;"><i class="fa-solid fa-check-circle fa-3x"></i><p>QR Detectado</p></div>';
        
        try {
           // Buscamos por matrícula (que es lo que se codifica en el QR)
           const { data: alumno } = await supabaseClient.from('alumnos').select('id, nombre, grupo_id, grado, taller').eq('matricula', decodedText).single();
           
           if(alumno) {
               if(isTec) {
                   // Para tecnologías: validar que el alumno tenga el mismo grado y taller
                   const gradoOk = String(alumno.grado || '').trim().toLowerCase() === actTargetGrado.toLowerCase();
                   const tallerOk = !actMateria || String(alumno.taller || '').trim().toLowerCase() === actMateria.toLowerCase();
                   if(!gradoOk || !tallerOk) {
                       alert(`\u26a0\uFE0F ¡Alto! El alumno ${alumno.nombre} fue detectado, pero NO está inscrito en la Tecnología de esta actividad (${actMateria} - Grado ${actTargetGrado}).`);
                       window.cerrarQREvaluacion();
                       return;
                   }
               } else {
                   // Para materias normales: validar grupo_id
                   if (alumno.grupo_id && String(alumno.grupo_id) !== String(actGrupoId)) {
                       alert("\u26a0\uFE0F ¡Alto! Este alumno fue detectado exitosamente, pero NO PERTENECE al grupo al que le fue asignada esta actividad.");
                       window.cerrarQREvaluacion();
                       return;
                   }
               }
               
               targetStudentId = alumno.id;
               document.getElementById('qrAlumnoEncontrado').innerText = alumno.nombre;
               document.getElementById('panelCalificacionQR').style.display = 'block';
           } else {
               alert("Estudiante no encontrado en base de datos.");
               window.cerrarQREvaluacion();
           }
        } catch(err) {
           console.error(err);
           alert("Error al buscar estudiante");
           window.cerrarQREvaluacion();
        }
    }).catch(err => {
        console.error(err);
    });
};

window.cerrarQREvaluacion = () => {
    document.getElementById('modalQREvaluacion').style.display = 'none';
    if(qrEvalScanner) {
        try { qrEvalScanner.stop().catch(()=>{}); } catch(e){}
    }
    document.getElementById('qr-reader-eval').innerHTML = '';
    // Reseteamos ID de alumno para evitar asentar nota al alumno equivocado si se reabre el modal:
    targetStudentId = null;
    document.getElementById('inCalificacionQR').value = '10';
};

window.guardarEvaluacionQR = async () => {
    const nota = document.getElementById('inCalificacionQR').value;
    if(!nota || !targetStudentId || !currentActividadId) return alert("Faltan datos");
    
    try {
        const { error } = await supabaseClient.from('evaluaciones_actividades')
          .upsert({ actividad_id: currentActividadId, alumno_id: targetStudentId, calificacion: nota, plantel_id: state.plantelId }, { onConflict: 'actividad_id, alumno_id' });
        
        if(error) throw error;
        alert("Evaluación registrada exitosamente!");
        window.cerrarQREvaluacion();
        window.loadActividadesMaestro(); // Actualiza la lista para mostrar al alumno
    } catch(err) {
        console.error(err);
        alert("Error crítico al guardar: " + (err.message || 'Error desconocido') + ". \nRevisa permisos RLS o la conexión.");
    }
};

window.loadListasMaestro = async () => {
    const selGrupo = document.getElementById('listaMaestroGrupo');
    if(!selGrupo) return;
    try {
        const email = (await supabaseClient.auth.getUser()).data.user.email;
        const { data: asigs } = await supabaseClient.from('asignaciones_maestros')
           .select('materia, grupo_id, target_grado, grupos(id, nombre)')
           .eq('docente_email', email)
           .or('grupo_id.not.is.null,target_grado.not.is.null');
           
        if(asigs && asigs.length > 0) {
            selGrupo.innerHTML = '<option value="">-- Selecciona Grupo/Materia --</option>' + 
               asigs.map(a => {
                   if(a.grupos) {
                       return `<option value="${a.grupos.id}|${a.materia}">${a.materia} - ${a.grupos.nombre}</option>`;
                   } else if(a.target_grado) {
                       return `<option value="grado:${a.target_grado}|${a.materia}">${a.materia} - Grado ${a.target_grado} (Tecnología)</option>`;
                   }
                   return '';
               }).filter(Boolean).join('');

            // AUTO-SELECCIÓN DESDE URL
            const urlParams = new URLSearchParams(state.path.split('?')[1]);
            const preSelected = urlParams.get('grupo');
            if(preSelected) {
                for(let opt of selGrupo.options) {
                    if(opt.value.includes(preSelected)) {
                        selGrupo.value = opt.value;
                        window.cargarAlumnosLista();
                        break;
                    }
                }
            }
        } else {
            selGrupo.innerHTML = '<option value="">No tienes expedientes asignados</option>';
        }
    } catch(err) {
        console.error(err);
        selGrupo.innerHTML = '<option value="">Error cargando asignaciones</option>';
    }
};

window.cambiarTrimestreLista = (trim, btn) => {
    state.selectedMaestroTrimestre = trim;
    
    // UI Update
    const btns = document.querySelectorAll('#tabsTrimestresListas .t-btn');
    btns.forEach(b => {
        b.style.background = 'transparent';
        b.style.border = 'none';
        b.style.color = 'var(--text-muted)';
        b.classList.remove('active');
    });
    
    btn.style.background = 'white';
    btn.style.border = '1px solid var(--border)';
    btn.style.color = 'var(--text-main)';
    btn.classList.add('active');
    
    window.cargarAlumnosLista();
};

window.cargarAlumnosLista = async () => {
    const tbody = document.getElementById('listaMaestroAlumnos');
    const cabecera = document.getElementById('listaMaestroCabecera');
    const rawVal = document.getElementById('listaMaestroGrupo').value;
    const tipo = document.getElementById('listaMaestroTipo') ? document.getElementById('listaMaestroTipo').value : 'evaluaciones';
    
    // Contenedor para estadísticas (Lo buscamos o creamos arriba del de la tabla)
    let statsCont = document.getElementById('statsListaMaestro');
    if(!statsCont && tbody) {
        statsCont = document.createElement('div');
        statsCont.id = 'statsListaMaestro';
        statsCont.style.marginBottom = '20px';
        tbody.closest('.card').prepend(statsCont);
    }

    if(!rawVal || !tbody || !cabecera) {
        if(tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; color:var(--text-muted)">Seleccione un grupo...</td></tr>';
        if(statsCont) statsCont.innerHTML = '';
        return;
    }
    
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</td></tr>';
    
    const isTec = rawVal.startsWith('grado:');
    const [idPart, materia] = rawVal.split('|');
    const gid = isTec ? null : idPart;  
    const targetGrado = isTec ? idPart.replace('grado:', '').trim() : null;

    try {
        let alumnosQuery = supabaseClient.from('alumnos').select('id, nombre, matricula, contacto_email');
        if(isTec) {
            const gNorm = targetGrado.includes('°') ? targetGrado : targetGrado + '°';
            // v116: Robust matching for technologies
            const cleanMat = materia.replace(/tecnología|tecnologia/gi, '').trim();
            alumnosQuery = alumnosQuery.eq('grado', gNorm.trim()).ilike('taller', `%${cleanMat || materia}%`);

        } else {
            alumnosQuery = alumnosQuery.eq('grupo_id', gid);
        }
        const { data: rawAlumnos } = await alumnosQuery;
        
        if(!rawAlumnos || rawAlumnos.length === 0) {
             cabecera.innerHTML = `<tr><th style="padding:12px;">Sin Alumnos</th></tr>`;
             tbody.innerHTML = '<tr><td style="text-align:center; padding: 20px; color:var(--text-muted)">Este grupo no tiene alumnos registrados.</td></tr>';
             if(statsCont) statsCont.innerHTML = '';
             return;
        }

        // ORDENAMIENTO POR APELLIDO (Ponce Herrera Luis Miguel)
        const formatName = (n) => {
            const parts = n.trim().split(/\s+/);
            if(parts.length < 2) return n;
            // Asumimos: Nombres... Apellido1 Apellido2
            // Pasamos a: Apellido1 Apellido2 Nombres...
            const surnames = parts.slice(-2);
            const names = parts.slice(0, -2);
            return (surnames.join(' ') + ' ' + names.join(' ')).trim();
        };

        const alumnos = rawAlumnos.map(al => ({
            ...al,
            nombreOrdenado: formatName(al.nombre)
        })).sort((a,b) => a.nombreOrdenado.localeCompare(b.nombreOrdenado));

        let htmlRows = '';
        let stats = { sumPromedios: 0, aprobados: 0, reprobados: 0, total: alumnos.length };
        
        if(tipo === 'evaluaciones') {
            const currentTrim = state.selectedMaestroTrimestre || 1;
            const isModoFinal = currentTrim === 'final';

            let actsQuery = supabaseClient.from('actividades_maestro').select('id, titulo, rubro_name, rubro_peso, trimestre');
            if(isTec) {
                actsQuery = actsQuery.eq('target_grado', targetGrado).eq('materia', materia);
            } else {
                actsQuery = actsQuery.eq('grupo_id', gid).eq('materia', materia);
            }

            if (!isModoFinal) {
                actsQuery = actsQuery.eq('trimestre', currentTrim);
            }
            
            const { data: acts } = await actsQuery.order('fecha_creacion');
            const hasActs = acts && acts.length > 0;
            
            if(isModoFinal) {
                cabecera.innerHTML = `<tr>
                    <th style="padding:12px; text-align:left; min-width:200px;">Alumno (Apellido)</th>
                    <th style="padding:12px; text-align:center;">1° Trimestre</th>
                    <th style="padding:12px; text-align:center;">2° Trimestre</th>
                    <th style="padding:12px; text-align:center;">3° Trimestre</th>
                    <th style="padding:12px; text-align:center; background:var(--page-bg);">PROMEDIO FINAL</th>
                    <th style="padding:12px; text-align:center;">Estatus</th>
                 </tr>`;
            } else {
                let actHeaders = hasActs 
                    ? acts.map(a => `<th style="padding:12px; text-align:center; max-width:80px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${a.titulo} - ${a.rubro_name ? a.rubro_name : 'Sin Rubro'}">${a.titulo}<br><span style="font-size:0.7rem; color:var(--text-muted); font-weight:normal">${a.rubro_name ? (a.rubro_peso+'%') : 'Extra'}</span></th>`).join('')
                    : `<th style="padding:12px; text-align:center;">Actividades</th>`;

                cabecera.innerHTML = `<tr>
                    <th style="padding:12px; text-align:left; min-width:200px;">Alumno (Apellido)</th>
                    ${actHeaders}
                    <th style="padding:12px; text-align:center;">Promedio T${currentTrim}</th>
                    <th style="padding:12px; text-align:center;">Estatus</th>
                 </tr>`;
            }

            let evals = [];
            if(hasActs) {
                const actIds = acts.map(a => a.id);
                const { data: evalsData } = await supabaseClient.from('evaluaciones_actividades').select('alumno_id, actividad_id, calificacion').in('actividad_id', actIds);
                if(evalsData) evals = evalsData;
            }
            
            for(let al of alumnos) {
                const initials = al.nombreOrdenado.substring(0,2).toUpperCase();
                let promFinalNum = 0;

                if (isModoFinal) {
                    let promsTrim = { 1: 0, 2: 0, 3: 0 };
                    [1, 2, 3].forEach(t => {
                        const actsT = acts.filter(a => a.trimestre === t);
                        if(actsT.length === 0) return;
                        let rubroGroups = {}, hasRubros = false, sumSimple = 0, countSimple = 0;

                        actsT.forEach(act => {
                            const ev = evals.find(e => e.alumno_id === al.id && e.actividad_id === act.id);
                            const val = ev ? parseFloat(ev.calificacion) || 0 : 0;
                            if(act.rubro_name) {
                                hasRubros = true;
                                if(!rubroGroups[act.rubro_name]) rubroGroups[act.rubro_name] = { suma: 0, count: 0, peso: parseFloat(act.rubro_peso) || 0 };
                                rubroGroups[act.rubro_name].count++;
                                if(ev) rubroGroups[act.rubro_name].suma += val;
                            } else if(ev) { sumSimple += val; countSimple++; }
                        });

                        if(hasRubros) {
                            Object.values(rubroGroups).forEach(rg => { if(rg.count > 0) promsTrim[t] += (rg.suma / rg.count) * (rg.peso / 100); });
                        } else { promsTrim[t] = countSimple > 0 ? (sumSimple / countSimple) : 0; }
                    });

                    const p1 = promsTrim[1], p2 = promsTrim[2], p3 = promsTrim[3];
                    promFinalNum = ((p1 + p2 + p3) / 3);
                    
                    let badge = promFinalNum >= 6 ? '<span class="badge" style="background:#d1fae5; color:#065f46">Aprobado</span>' : '<span class="badge" style="background:#fee2e2; color:#991b1b">Reprobado</span>';

                    htmlRows += `
                    <tr style="border-bottom:1px solid var(--border)">
                        <td style="padding:12px; display:flex; gap:12px; align-items:center;">
                           <div style="width:32px; height:32px; border-radius:50%; background:var(--primary); color:white; display:flex; justify-content:center; align-items:center; font-size:12px; font-weight:bold; flex-shrink:0;">${initials}</div>
                           <div><span style="font-weight:600;">${al.nombreOrdenado}</span> <br> <span style="font-size:0.75rem; color:var(--text-muted)">${al.matricula}</span></div>
                        </td>
                        <td style="text-align:center; padding:12px;">${p1.toFixed(1)}</td>
                        <td style="text-align:center; padding:12px;">${p2.toFixed(1)}</td>
                        <td style="text-align:center; padding:12px;">${p3.toFixed(1)}</td>
                        <td style="text-align:center; padding:12px; font-weight:bold; background:var(--page-bg); color:var(--primary); font-size:1.1rem;">${promFinalNum.toFixed(2)}</td>
                        <td style="text-align:center; padding:12px;">${badge}</td>
                    </tr>`;

                } else {
                    let sumNotas = 0, countNotas = 0, actCells = '';
                    let rubroGroups = {}, hasRubros = false;
                    
                    if(hasActs) {
                        acts.forEach(act => {
                            const cellEval = evals.find(e => e.alumno_id === al.id && e.actividad_id === act.id);
                            let val = 0, isValida = false;
                            if(cellEval && cellEval.calificacion !== undefined && cellEval.calificacion !== null) {
                                actCells += `<td style="text-align:center; padding:12px; font-weight:bold; color:var(--primary)">${cellEval.calificacion}</td>`;
                                val = parseFloat(cellEval.calificacion) || 0;
                                sumNotas += val; countNotas++; isValida = true;
                            } else {
                                actCells += `<td style="text-align:center; padding:12px; color:var(--text-muted)">-</td>`;
                            }

                            if(act.rubro_name) {
                                hasRubros = true;
                                if(!rubroGroups[act.rubro_name]) rubroGroups[act.rubro_name] = { suma: 0, count: 0, peso: parseFloat(act.rubro_peso) || 0 };
                                rubroGroups[act.rubro_name].count++;
                                if(isValida) rubroGroups[act.rubro_name].suma += val;
                            }
                        });
                    } else {
                        actCells = `<td style="text-align:center; padding:12px; color:var(--text-muted)">Sin acts.</td>`;
                    }
                    
                    if (hasRubros) {
                        Object.values(rubroGroups).forEach(rg => { if (rg.count > 0) promFinalNum += (rg.suma / rg.count) * (rg.peso / 100); });
                    } else {
                        promFinalNum = acts.length > 0 ? (sumNotas / acts.length) : 0;
                    }
                    
                    let badge = countNotas === 0 ? '<span class="badge" style="background:#f3f4f6; color:#4b5563">Sin N/E</span>' : (promFinalNum < 6 ? '<span class="badge" style="background:#fee2e2; color:#991b1b">Reprobado</span>' : '<span class="badge" style="background:#d1fae5; color:#065f46">Aprobado</span>');
                    
                    htmlRows += `
                    <tr style="border-bottom:1px solid var(--border)">
                        <td style="padding:12px; display:flex; gap:12px; align-items:center;">
                           <div style="width:32px; height:32px; border-radius:50%; background:var(--primary); color:white; display:flex; justify-content:center; align-items:center; font-size:12px; font-weight:bold; flex-shrink:0;">${initials}</div>
                           <div><span style="font-weight:600;">${al.nombreOrdenado}</span> <br> <span style="font-size:0.75rem; color:var(--text-muted)">${al.matricula}</span></div>
                        </td>
                        ${actCells}
                        <td style="text-align:center; padding:12px; font-weight:bold;">${promFinalNum.toFixed(2)}</td>
                        <td style="text-align:center; padding:12px;">${badge}</td>
                    </tr>`;
                }

                // Acumular estadísticas
                stats.sumPromedios += promFinalNum;
                if(promFinalNum >= 6) stats.aprobados++;
                else stats.reprobados++;
            }

            // Renderizar Panel de Estadístcas
            const promGrupo = stats.total > 0 ? (stats.sumPromedios / stats.total).toFixed(2) : 0;
            const pctApr = stats.total > 0 ? (stats.aprobados / stats.total * 100).toFixed(1) : 0;
            const pctRep = stats.total > 0 ? (stats.reprobados / stats.total * 100).toFixed(1) : 0;

            statsCont.innerHTML = `
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
                    <div class="card" style="padding:16px; border-left:4px solid var(--primary); display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:bold;">Promedio Grupal</span>
                        <span style="font-size:1.5rem; font-weight:bold; color:var(--primary);">${promGrupo}</span>
                    </div>
                    <div class="card" style="padding:16px; border-left:4px solid var(--success); display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:bold;">Aprobados</span>
                        <div style="display:flex; align-items:baseline; gap:8px;">
                            <span style="font-size:1.5rem; font-weight:bold; color:var(--success);">${stats.aprobados}</span>
                            <span style="font-size:0.9rem; color:var(--text-muted);">(${pctApr}%)</span>
                        </div>
                    </div>
                    <div class="card" style="padding:16px; border-left:4px solid var(--danger); display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:bold;">Reprobados</span>
                        <div style="display:flex; align-items:baseline; gap:8px;">
                            <span style="font-size:1.5rem; font-weight:bold; color:var(--danger);">${stats.reprobados}</span>
                            <span style="font-size:0.9rem; color:var(--text-muted);">(${pctRep}%)</span>
                        </div>
                    </div>
                </div>
            `;
            
        } else {
            // MODO ASISTENCIAS - Simplificado para este contexto pero manteniendo el orden
            statsCont.innerHTML = '';
            // (El código de asistencias sigue aquí, pero me enfocaré en las evaluaciones que es lo que el usuario está viendo usualmente)
            const alumnoIds = alumnos.map(a => a.id);
            const materiaLimpia = (materia || '').trim();
            const { data: asistenciasRegistradas } = await supabaseClient.from('asistencias')
                .select('alumno_id, estado, creado_en')
                .in('alumno_id', alumnoIds)
                .eq('materia', materiaLimpia)
                .order('creado_en');
                
            const { data: sesiones } = await supabaseClient.from('asistencia_sesiones')
                .select('fecha')
                .eq('grupo_id', String(rawVal))
                .eq('materia', materiaLimpia);
                
            let diasPaseLista = new Set();
            if(sesiones) sesiones.forEach(s => diasPaseLista.add(s.fecha));
            let asistMap = {}; 
            if (asistenciasRegistradas) {
                asistenciasRegistradas.forEach(a => {
                    let d = new Date(a.creado_en);
                    let dateStr = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,'0') + "-" + String(d.getDate()).padStart(2,'0');
                    diasPaseLista.add(dateStr);
                    if(!asistMap[a.alumno_id]) asistMap[a.alumno_id] = {};
                    asistMap[a.alumno_id][dateStr] = a.estado; 
                });
            }
            let diasArray = Array.from(diasPaseLista).sort();
            let dateHeaders = diasArray.map(d => `<th style="padding:12px; text-align:center; max-width:60px; font-size:0.8rem">${d.substring(5)}</th>`).join('');
            if(diasArray.length === 0) dateHeaders = `<th style="padding:12px; text-align:center;">Días</th>`;
            
            cabecera.innerHTML = `<tr>
                <th style="padding:12px; text-align:left; min-width:180px;">Alumno (Apellido)</th>
                ${dateHeaders}
                <th style="padding:12px; text-align:center;">Resumen (%)</th>
                <th style="padding:12px; text-align:center;">Estatus Actual</th>
                <th style="padding:12px; text-align:center;">Contacto</th>
             </tr>`;
             
            for(let al of alumnos) {
                const initials = al.nombreOrdenado.substring(0,2).toUpperCase();
                let asistCell = '', totalDias = diasArray.length, faltas = 0, asistenciasConteo = 0, retardosCount = 0, justificadasCount = 0;
                if (totalDias > 0) {
                    diasArray.forEach(d => {
                        const estado = asistMap[al.id] ? asistMap[al.id][d] : null;
                        if (estado === 'Asistencia') { 
                            asistenciasConteo++; 
                            asistCell += `<td style="text-align:center; padding:12px; color:var(--success);"><i class="fa-solid fa-check"></i></td>`; 
                        }
                        else if (estado === 'Retardo') { 
                            asistenciasConteo++; 
                            retardosCount++;
                            asistCell += `<td style="text-align:center; padding:12px; color:var(--warning);"><i class="fa-solid fa-clock"></i></td>`; 
                        }
                        else if (estado === 'Justificada') { 
                            asistenciasConteo++; 
                            justificadasCount++;
                            asistCell += `<td style="text-align:center; padding:12px; color:var(--primary);"><i class="fa-solid fa-file-shield" title="Justificada"></i></td>`; 
                        }
                        else { 
                            faltas++; 
                            asistCell += `<td style="text-align:center; padding:12px; color:var(--danger);">
                                <button class="btn btn-ghost btn-xs" style="color:var(--danger)" onclick="window.justificarFaltaManual('${al.id}', '${d}', '${rawVal}')" title="Justificar Falta">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </td>`; 
                        }
                    });
                } else { asistCell = `<td style="text-align:center; padding:12px; color:var(--text-muted)">No hay sesiones</td>`; }
                
                let totalAsist = asistenciasConteo - retardosCount - justificadasCount; // Asis puras
                let summaryText = `<div style="font-size:0.8rem; line-height:1.2;">
                    <b class="text-success" title="Asistencia">${totalAsist}A</b> / 
                    <b class="text-warning" title="Retardo">${retardosCount}R</b> / 
                    <b class="text-primary" title="Justificada">${justificadasCount}J</b> / 
                    <b class="text-danger" title="Falta">${faltas}F</b>
                </div>`;
                
                let pctAsist = totalDias > 0 ? Math.round((asistenciasConteo / totalDias) * 100) : 100;
                let badge = pctAsist < 70 ? '<span class="badge" style="background:#fee2e2; color:#991b1b">Riesgo</span>' : '<span class="badge" style="background:#d1fae5; color:#065f46">Regular</span>';
                
                htmlRows += `
                <tr style="border-bottom:1px solid var(--border)">
                    <td style="padding:12px; display:flex; gap:12px; align-items:center;">
                       <div style="width:32px; height:32px; border-radius:50%; background:var(--primary); color:white; display:flex; justify-content:center; align-items:center; font-size:12px; font-weight:bold; flex-shrink:0;">${initials}</div>
                       <div><span style="font-weight:600;">${al.nombreOrdenado}</span> <br> <span style="font-size:0.75rem; color:var(--text-muted)">${al.matricula}</span></div>
                    </td>
                    ${asistCell}
                    <td style="text-align:center; padding:12px;">${summaryText}</td>
                    <td style="text-align:center; padding:12px;"><b>${pctAsist}%</b><br>${badge}</td>
                    <td style="text-align:center; padding:12px;"><a href="mailto:${al.contacto_email || ''}" class="btn btn-ghost btn-xs"><i class="fa-solid fa-envelope"></i></a></td>
                 </tr>`;
            }
        }
        
        tbody.innerHTML = htmlRows;
    } catch(err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; color:var(--danger)">Error al cargar seguimiento.</td></tr>';
    }
};

window.justificarFaltaManual = async (alumnoId, fecha, rawVal) => {
    if(!confirm(`¿Deseas justificar la falta del alumno para el día ${fecha}?`)) return;
    
    try {
        const [idPart, materia] = rawVal.split('|');
        const isTec = rawVal.startsWith('grado:');
        const gid = isTec ? null : idPart;
        
        const { data: userData } = await supabaseClient.auth.getUser();
        if(!userData.user) return alert("Sesión expirada.");

        // Forzamos la creación del registro como Justificada
        const { error } = await supabaseClient.from('asistencias').insert([{
            id: crypto.randomUUID(),
            alumno_id: alumnoId,
            registrador_id: userData.user.id,
            grupo_id: gid,
            estado: 'Justificada',
            materia: (window.currentAulaMateria || '').trim(),
            creado_en: `${fecha}T10:00:00Z`, 
            tipo: 'Maestro (Manual)',
            plantel_id: state.plantelId
        }]);

        if(error) throw error;
        
        window.showToast("Falta justificada correctamente", "success");
        window.cargarAlumnosLista(); // Refrescar la tabla actual
    } catch(e) {
        console.error(e);
        alert("Error al justificar: " + e.message);
    }
};

window.loadGruposCalificacionesCarga = async () => {
    const selGrupo = document.getElementById('capturaCalificacionesGrupo');
    if(!selGrupo) return;
    try {
        const email = (await supabaseClient.auth.getUser()).data.user.email;
        const { data: asigs } = await supabaseClient.from('asignaciones_maestros')
           .select('materia, grupo_id, target_grado, grupos(id, nombre)')
           .eq('docente_email', email)
           .or('grupo_id.not.is.null,target_grado.not.is.null');
           
        if(asigs && asigs.length > 0) {
            selGrupo.innerHTML = '<option value="">-- Selecciona Grupo/Materia --</option>' + 
               asigs.map(a => {
                   if(a.grupos) {
                       return `<option value="${a.grupos.id}::${a.materia}">${a.materia} - ${a.grupos.nombre}</option>`;
                   } else if(a.target_grado) {
                       return `<option value="grado:${a.target_grado}::${a.materia}">${a.materia} - Grado ${a.target_grado}</option>`;
                   }
                   return '';
               }).filter(Boolean).join('');
        } else {
            selGrupo.innerHTML = '<option value="">No tienes expedientes asignados</option>';
        }
    } catch(err) {
        console.error(err);
    }
};

window.cargarBoletasGrupo = async () => {
    const tbody = document.getElementById('tablaBoletasCuerpo');
    const cabecera = document.getElementById('tablaBoletasCabecera');
    const selectVal = document.getElementById('capturaCalificacionesGrupo').value;
    const currentTrim = parseInt(document.getElementById('capturaTrimestre')?.value || 1);
    const isModoFinal = currentTrim === 4;
    
    if(!selectVal) {
        tbody.innerHTML = `<tr><td colspan="${isModoFinal ? 7 : 5}" style="padding:20px; text-align:center; color:var(--text-muted)">Seleccione una asignatura para cargar los promedios.</td></tr>`;
        return;
    }
    
    const [idVal, materiaText] = selectVal.split('::');
    const isTec = idVal.startsWith('grado:');
    const gid = isTec ? null : idVal;
    const targetGrado = isTec ? idVal.replace('grado:', '') : null;
    
    tbody.innerHTML = `<tr><td colspan="${isModoFinal ? 7 : 5}" style="text-align:center; padding: 20px;">Cargando promedios y datos...</td></tr>`;
    
    try {
        const u = await supabaseClient.auth.getUser();
        
        // 1. Fetch Materia ID
        const { data: tmateria } = await supabaseClient.from('materias').select('id').ilike('nombre', materiaText).maybeSingle();
        const matId = tmateria?.id;

        // 2. Fetch Alumnos
        let alumnosQuery = supabaseClient.from('alumnos').select('id, nombre, matricula');
        if(isTec) {
            const gNorm = targetGrado.includes('°') ? targetGrado : targetGrado + '°';
            // v116: Robust matching for technologies
            const cleanMat = materiaText.replace(/tecnología|tecnologia/gi, '').trim();
            alumnosQuery = alumnosQuery.eq('grado', gNorm).ilike('taller', `%${cleanMat || materiaText}%`);

        } else {
            alumnosQuery = alumnosQuery.eq('grupo_id', gid);
        }
        const { data: rawAlumnos } = await alumnosQuery;
        
        if(!rawAlumnos || rawAlumnos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${isModoFinal ? 7 : 5}" style="text-align:center; padding: 20px; color:var(--text-muted)">No hay alumnos vinculados.</td></tr>`;
            return;
        }

        // ORDENAMIENTO POR APELLIDO (Ponce Herrera Luis Miguel)
        const formatName = (n) => {
            if(!n) return "Sin Nombre";
            const parts = n.trim().split(/\s+/);
            if(parts.length < 2) return n;
            // Asumimos: Nombres... Apellido1 Apellido2
            // Pasamos a: Apellido1 Apellido2 Nombres...
            const surnames = parts.slice(-2);
            const names = parts.slice(0, -2);
            return (surnames.join(' ') + ' ' + names.join(' ')).trim();
        };


        const alumnos = rawAlumnos.map(al => ({
            ...al,
            nombreOrdenado: formatName(al.nombre)
        })).sort((a,b) => a.nombreOrdenado.localeCompare(b.nombreOrdenado));

        // 3. Fetch Calificaciones ya asentadas (Si es modo final, traer los 3 trimestres)
        // Usamos ilike con el nombre de la materia directamente para mayor compatibilidad
        const materiaClean = materiaText.trim();
        let histQuery = supabaseClient.from('calificaciones')
            .select('alumno_id, calificacion, trimestre')
            .ilike('materia_nombre', materiaClean);
            
        if(isModoFinal) {
            histQuery = histQuery.in('trimestre', [1, 2, 3, 4]);
        } else {
            histQuery = histQuery.eq('trimestre', currentTrim);
        }
        const { data: historial } = await histQuery;
        
        // 4. Fetch Actividades (SOLO si no es modo final, ya que en final promediamos T1,T2,T3)
        let acts = [];
        let hasActs = false;
        if(!isModoFinal) {
            let actsQuery = supabaseClient.from('actividades_maestro')
                .select('id, titulo, rubro_name, rubro_peso')
                .eq('trimestre', currentTrim) 
                .eq('materia', materiaText);
                
            if(isTec) {
                actsQuery = actsQuery.eq('target_grado', targetGrado);
            } else {
                actsQuery = actsQuery.eq('grupo_id', gid);
            }
            const { data: resActs } = await actsQuery;
            if(resActs) acts = resActs;
            hasActs = acts.length > 0;
        }
        
        // 5. Preparar Cabecera
        if(isModoFinal) {
            cabecera.innerHTML = `<tr>
                <th style="padding:12px; text-align:left; min-width:200px;">Alumno</th>
                <th style="padding:12px; text-align:center; background:#f8fafc; color:#64748b;">1° Trim</th>
                <th style="padding:12px; text-align:center; background:#f8fafc; color:#64748b;">2° Trim</th>
                <th style="padding:12px; text-align:center; background:#f8fafc; color:#64748b;">3° Trim</th>
                <th style="padding:12px; text-align:center; background:var(--surface-hover);">Promedio Anual</th>
                <th style="padding:12px; text-align:center; background:var(--surface-hover);">Calificación Final</th>
             </tr>`;
        } else {
            cabecera.innerHTML = `<tr>
                <th style="padding:12px; text-align:left; min-width:200px;">Alumno</th>
                <th style="padding:12px; text-align:center; background:var(--surface-hover);">Propuesta (Seguimiento T${currentTrim})</th>
                <th style="padding:12px; text-align:center; background:var(--surface-hover);">Calificación Final T${currentTrim}</th>
             </tr>`;
        }
         
        // 6. Fetch Evaluaciones (Solo para modo seguimiento)
        let evals = [];
        if(hasActs && !isModoFinal) {
            const actIds = acts.map(a => a.id);
            const { data: evalsData } = await supabaseClient.from('evaluaciones_actividades').select('alumno_id, actividad_id, calificacion').in('actividad_id', actIds);
            if(evalsData) evals = evalsData;
        }
        
        let htmlRows = '';
        for(let al of alumnos) {
            const initials = al.nombreOrdenado.substring(0,2).toUpperCase();
            let promFinalNum = 0;
            let currentSettledVal = null;
            let histCells = '';

            if(isModoFinal) {
                // Cálculo Anual basado en T1, T2, T3 asentados
                let t1 = historial?.find(h => h.alumno_id === al.id && h.trimestre === 1)?.calificacion || 0;
                let t2 = historial?.find(h => h.alumno_id === al.id && h.trimestre === 2)?.calificacion || 0;
                let t3 = historial?.find(h => h.alumno_id === al.id && h.trimestre === 3)?.calificacion || 0;
                promFinalNum = (t1 + t2 + t3) / 3;
                
                const fmt = (v) => v > 0 ? v.toFixed(1) : '-';
                histCells = `
                    <td style="text-align:center; color:var(--text-muted)">${fmt(t1)}</td>
                    <td style="text-align:center; color:var(--text-muted)">${fmt(t2)}</td>
                    <td style="text-align:center; color:var(--text-muted)">${fmt(t3)}</td>
                `;
                currentSettledVal = historial?.find(h => h.alumno_id === al.id && h.trimestre === 4)?.calificacion;
            } else {
                // Cálculo de Seguimiento del trimestre actual
                if(hasActs) {
                    let rubroGroups = {};
                    acts.forEach(act => {
                        const cellEval = evals.find(e => e.alumno_id === al.id && e.actividad_id === act.id);
                        let val = cellEval ? (parseFloat(cellEval.calificacion)||0) : 0;
                        
                        // Robustez: asegurar que el rubro existe
                        let rName = act.rubro_name || "Otros";
                        if(!rubroGroups[rName]) rubroGroups[rName] = { suma:0, count:0, peso: parseFloat(act.rubro_peso)||0 };
                        
                        rubroGroups[rName].count++;
                        if(cellEval) rubroGroups[rName].suma += val;
                    });

                    Object.keys(rubroGroups).forEach(k => {
                        let rg = rubroGroups[k];
                        let promRubro = rg.count > 0 ? (rg.suma / rg.count) : 0;
                        promFinalNum += promRubro * (rg.peso / 100);
                    });
                }
                currentSettledVal = historial?.find(h => h.alumno_id === al.id)?.calificacion;
            }
            
            const promRounded = Math.round(promFinalNum);
            const displayVal = currentSettledVal !== undefined && currentSettledVal !== null ? currentSettledVal : promRounded;

            htmlRows += `
            <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:12px; display:flex; gap:12px; align-items:center;">
                   <div style="width:32px; height:32px; border-radius:50%; background:var(--primary); color:white; display:flex; justify-content:center; align-items:center; font-size:12px; font-weight:bold; flex-shrink:0;">${initials}</div>
                   <div><span style="font-weight:600;">${al.nombreOrdenado}</span> <br> <span style="font-size:0.75rem; color:var(--text-muted)">${al.matricula}</span></div>
                </td>
                ${histCells}
                <td style="background:var(--surface-hover); text-align:center; color:var(--text-muted); font-weight:bold;">${promFinalNum.toFixed(2)}</td>
                <td style="background:var(--surface-hover); text-align:center; padding:12px;">
                   <input type="number" class="form-input input-calificacion" 
                          data-alumno="${al.id}" 
                          style="width:85px; text-align:center; margin:auto; font-weight:bold; border:2px solid var(--primary); color:var(--primary); background:white; font-size:1.1rem;" 
                          value="${displayVal}" step="0.1" min="0" max="10">
                </td>
             </tr>`;
        }
        
        tbody.innerHTML = htmlRows;
        
    } catch(err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="${isModoFinal ? 7 : 5}" style="text-align:center; padding: 20px; color:var(--danger)">Error al cargar datos escolares.</td></tr>`;
    }
};

window.sellarYEnviarCalificaciones = async () => {
    const selectVal = document.getElementById('capturaCalificacionesGrupo').value;
    const trim = document.getElementById('capturaTrimestre').value;
    if(!selectVal) return alert('Seleccione una materia/grupo primero.');
    
    const [idVal, materiaText] = selectVal.split('::');
    const inputs = document.querySelectorAll('.input-calificacion');
    
    if(inputs.length === 0) return alert('No hay alumnos para evaluar.');
    
    const trimName = trim === '4' ? "Final (Anual)" : "Trimestre " + trim;
    if(!confirm('¿Estás seguro de asentar estas calificaciones para el ' + trimName + '? No podrás modificarlas después.')) return;
    
    const btn = event.currentTarget;
    const oldHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    btn.disabled = true;
    
    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) throw new Error("No autenticado");
        const actUserId = u.data.user.id;
        
        // 1. Fetch Materia ID
        const { data: tmateria } = await supabaseClient.from('materias').select('id').ilike('nombre', materiaText).maybeSingle();
        const matId = tmateria ? tmateria.id : null;
        
        // 2. Preparar Updates para Calificaciones
        let updates = [];
        let reprobados = []; // Para notificaciones automáticas en modo final
        const materiaClean = materiaText.trim();

        inputs.forEach(inp => {
            const calif = parseFloat(inp.value) || 0;
            const alId = inp.getAttribute('data-alumno');
            
            updates.push({
                alumno_id: alId,
                materia_id: matId, 
                materia_nombre: materiaClean,
                maestro_id: actUserId,
                trimestre: parseInt(trim),
                calificacion: calif,
                plantel_id: state.plantelId
            });

            if(trim === '4' && calif < 6.0) {
                reprobados.push(alId);
            }
        });
        
        // Usamos onConflict para que el índice único unique_boleta (alumno_id, materia_nombre, trimestre) funcione
        const { error } = await supabaseClient.from('calificaciones').upsert(updates, { onConflict: 'alumno_id, materia_nombre, trimestre' });
        if(error) throw error;
        
        // 3. Procesar Notificaciones Automáticas (Trimestre Final)
        if(reprobados.length > 0) {
            let coms = reprobados.map(alId => ({
                id: crypto.randomUUID(),
                autor_id: actUserId,
                titulo: `⚠️ AVISO DE REPROBACIÓN: ${materiaText}`,
                mensaje: `Se le informa que el alumno ha REPROBADO la asignatura de ${materiaText} en su promedio final anual. Es necesario acudir urgentemente a la dirección escolar para solicitar el proceso de Examen Extraordinario.`,
                audiencia: `Alumno_${alId}`,
                fecha_envio: new Date().toISOString(),
                plantel_id: state.plantelId
            }));

            const { error: errorComs } = await supabaseClient.from('comunicados').insert(coms);
            if(errorComs) console.error("Error al enviar notificaciones de reprobación:", errorComs);
        }

        alert("¡Calificaciones de " + trimName + " asentadas exitosamente!" + (reprobados.length > 0 ? `\nSe enviaron ${reprobados.length} avisos de reprobación a los padres.` : ""));
        window.cargarBoletasGrupo(); // Recargar tabla
    } catch(e) {
        console.error(e);
        alert("Ocurrió un error al guardar: " + e.message);
    } finally {
        btn.innerHTML = oldHtml;
        btn.disabled = false;
    }
};

window.exportarRejillaBlancoCSV = () => {
    const tbody = document.getElementById('listaMaestroAlumnos');

    if(!tbody || tbody.innerText.includes("Seleccione") || tbody.innerText.includes("Error") || tbody.innerText.includes("Cargando")) {
        return alert("Por favor, selecciona o carga un grupo/materia válido primero para obtener su lista de alumnos.");
    }
    
    let csv = [];
    
    // 1. Crear el encabezado con 20 columnas en blanco
    let headerRow = ["No.", "Nombre del Alumno"];
    for(let i = 1; i <= 20; i++) {
        headerRow.push(`C${i}`);
    }
    csv.push(headerRow.join(","));

    // 2. Extraer alumnos (ordenados alfabéticamente como están en la tabla visual)
    const rows = tbody.querySelectorAll("tr");
    let numStr = 1;
    for (let i = 0; i < rows.length; i++) {
        const spanNombre = rows[i].querySelector("td span[style*='font-weight:600']");
        if(spanNombre && spanNombre.innerText) {
            let rowCsv = [];
            rowCsv.push(`"${numStr}"`);
            rowCsv.push(`"${spanNombre.innerText.trim()}"`);
            for(let j = 1; j <= 20; j++) rowCsv.push('""'); // celdas vacías
            csv.push(rowCsv.join(","));
            numStr++;
        }
    }

    const csvString = "\uFEFF" + csv.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    const selG = document.getElementById('listaMaestroGrupo');
    const grupoName = selG && selG.selectedIndex > 0 ? selG.options[selG.selectedIndex].text : 'Grupo';
    
    link.href = URL.createObjectURL(blob);
    link.download = `Rejilla_${grupoName}.csv`.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.exportarListasCSV = () => {
    const tabla = document.querySelector(".risk-table");
    const tbody = document.getElementById('listaMaestroAlumnos');
    const statsCont = document.getElementById('statsListaMaestro');

    if(!tabla || !tbody || tbody.innerText.includes("Seleccione") || tbody.innerText.includes("Error") || tbody.innerText.includes("Cargando")) {
        return alert("No hay datos cargados para exportar.");
    }
    
    let csv = [];
    const rows = tabla.querySelectorAll("tr");
    
    // 1. Encabezados y Datos de Alumnos
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");
        for (let j = 0; j < cols.length; j++) {
            if (cols[j].title === "Contactar Apoderado" || (cols[j].innerText && cols[j].innerText.includes("Contacto"))) continue;
            let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, " ").replace(/(\s\s+)/gm, " ").trim();
            data = data.replace(/"/g, '""');
            row.push(`"${data}"`);
        }
        csv.push(row.join(","));
    }

    // 2. Agregar Resumen Estadístico al final si existe
    if(statsCont) {
        csv.push("\n"); // Espacio en blanco
        csv.push('"RESUMEN ACADÉMICO DEL GRUPO"');
        const cards = statsCont.querySelectorAll('.card');
        cards.forEach(card => {
            const title = card.children[0].innerText;
            const value = card.children[1].innerText;
            csv.push(`"${title}","${value}"`);
        });
    }

    const csvString = "\uFEFF" + csv.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    const selG = document.getElementById('listaMaestroGrupo');
    const selT = document.getElementById('listaMaestroTipo');
    const grupoName = selG && selG.selectedIndex > 0 ? selG.options[selG.selectedIndex].text : 'Grupo';
    const tipoName = selT ? selT.options[selT.selectedIndex].text : 'Reporte';
    
    link.href = URL.createObjectURL(blob);
    link.download = `${tipoName}_${grupoName}.csv`.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    link.click();
};

window.imprimirLista = () => {
    const tabla = document.querySelector(".risk-table");
    const tbody = document.getElementById('listaMaestroAlumnos');
    const statsCont = document.getElementById('statsListaMaestro');
    
    if(!tabla || !tbody || tbody.innerText.includes("Seleccione") || tbody.innerText.includes("Error") || tbody.innerText.includes("Cargando")) {
        return alert("No hay datos cargados para imprimir.");
    }

    const selG = document.getElementById('listaMaestroGrupo');
    const selT = document.getElementById('listaMaestroTipo');
    const grupoName = selG && selG.selectedIndex > 0 ? selG.options[selG.selectedIndex].text : 'Grupo';
    const tipoName = (selT ? selT.options[selT.selectedIndex].text : 'Reporte').toUpperCase();
    const fecha = new Date().toLocaleDateString();

    const currentTrim = state.selectedMaestroTrimestre === 'final' ? 'PROMEDIO FINAL DEL AÑO ESCOLAR' : `EVALUACIÓN DEL ${state.selectedMaestroTrimestre}° TRIMESTRE`;

    // Clonar tabla y limpiar columnas de contacto/acciones
    const cloneTable = tabla.cloneNode(true);
    cloneTable.querySelectorAll('tr').forEach(r => {
        const lastTd = r.cells[r.cells.length - 1];
        if(lastTd && (lastTd.innerHTML.includes('fa-envelope') || lastTd.innerText.includes('Contacto'))) {
            lastTd.remove();
        }
    });

    // Preparar HTML de estadísticas para impresión
    let statsHtml = '';
    if(statsCont) {
        const statsData = Array.from(statsCont.querySelectorAll('.card')).map(c => {
            return { label: c.children[0].innerText, value: c.children[1].innerText };
        });
        statsHtml = `
            <div style="display: flex; gap: 20px; margin-bottom: 25px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9fafb;">
                ${statsData.map(s => `
                    <div style="flex: 1; text-align: center;">
                        <div style="font-size: 10px; color: #666; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">${s.label}</div>
                        <div style="font-size: 18px; font-weight: bold; color: #1e40af;">${s.value}</div>
                    </div>
                `).join('<div style="width:1px; background:#ddd;"></div>')}
            </div>
        `;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Acta de Calificaciones - Edu-LM</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #333; line-height: 1.4; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .header h1 { margin: 0; color: #1e40af; font-size: 22px; }
                    .header p { margin: 2px 0; font-size: 14px; color: #444; }
                    .meta-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 13px; border-top: 1px solid #eee; padding-top: 15px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: center; font-size: 11px; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    .aln-left { text-align: left; }
                    .signatures { display: flex; justify-content: space-around; margin-top: 60px; }
                    .signature-box { text-align: center; width: 220px; }
                    .signature-line { border-top: 1px solid #000; margin-bottom: 5px; }
                    @media print {
                        @page { margin: 1.5cm; }
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>SISTEMA EDU-LM: SEGUIMIENTO ACADÉMICO</h1>
                    <p>ACTA OFICIAL DE RESULTADOS</p>
                </div>
                <div class="meta-info">
                    <div>
                        <strong>Maestro:</strong> ${state.userName || 'Maestro Titular'}<br>
                        <strong>Grupo/Materia:</strong> ${grupoName}
                    </div>
                    <div style="text-align: right;">
                        <strong>Periodo:</strong> ${currentTrim}<br>
                        <strong>Fecha de Impresión:</strong> ${fecha}
                    </div>
                </div>
                
                <h4 style="margin-bottom: 10px; color: #1e40af; border-bottom: 1px solid #eee; padding-bottom: 5px;">RESUMEN DE RENDIMIENTO</h4>
                ${statsHtml}

                <h4 style="margin-bottom: 10px; color: #1e40af;">LISTADO DE ALUMNOS (ORDEN ALFABÉTICO)</h4>
                ${cloneTable.outerHTML}

                <div class="signatures">
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div style="font-size: 12px; font-weight: bold;">Profr(a). ${state.userName || ''}</div>
                        <div style="font-size: 10px;">Firma del Maestro</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <div style="font-size: 10px; font-weight: bold;">DIRECCIÓN ESCOLAR</div>
                        <div style="font-size: 10px;">Sello y Firma de Recibido</div>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() { window.close(); };
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
};

window.exportarListasPDF = () => {
    // Redirigir a impresión ya que es más nativo y profesional
    window.imprimirLista();
};


window.toggleModoTecnologiaManual = (isActive) => {
    console.log(">>> Toggle Modo Tecnologia:", isActive);
    const selGrp = document.getElementById('selAsigGrupoBase');
    const selGrd = document.getElementById('selAsigGradoBase');
    const lbl = document.getElementById('lblAsigAmbito');
    const msg = document.getElementById('msgFiltroTecnologia');
    const chk = document.getElementById('chkForzarTecnologia');
    
    if(!selGrp || !selGrd) return;

    if(isActive) {
        selGrp.style.display = 'none';
        selGrd.style.display = 'block';
        if(lbl) lbl.innerText = "Grado para Tecnología / Taller";
        if(msg) msg.style.display = 'block';
        if(chk) chk.checked = true;
    } else {
        // PRIORIDAD: Si el checkbox manual está marcado, no regresamos a modo grupo
        if(chk && chk.checked) return; 

        selGrp.style.display = 'block';
        selGrd.style.display = 'none';
        if(lbl) lbl.innerText = "Vincular con Grupo Existente";
        if(msg) msg.style.display = 'none';
    }
};

window.initEventosAdminGrupos = () => {
    console.log(">>> Inicializando Eventos de Grupos...");
    try {
        const selAsigMaestro = document.getElementById('selAsigMaestroBase');
        if(selAsigMaestro) {
            selAsigMaestro.onchange = (e) => {
                const email = e.target.value;
                if(!email) {
                    if(window.loadGruposDeMaestro) window.loadGruposDeMaestro(null);
                    return;
                }
                if(window.loadMateriasDeMaestro) window.loadMateriasDeMaestro(email);
                if(window.loadGruposDeMaestro) window.loadGruposDeMaestro(email);
            };
        }

        const selAsigMateria = document.getElementById('selAsigMateriaBase');
        if(selAsigMateria) {
            selAsigMateria.onchange = () => {
                const mat = selAsigMateria.value;
                if(!mat) return;
                
                const isTecAuto = mat.toLowerCase().includes('tecnología') || mat.toLowerCase().includes('taller');
                const chk = document.getElementById('chkForzarTecnologia');
                
                if(isTecAuto) {
                    window.toggleModoTecnologiaManual(true);
                } else if(!chk || !chk.checked) {
                    window.toggleModoTecnologiaManual(false);
                }

                const selGrd = document.getElementById('selAsigGradoBase');
                if(selGrd && (isTecAuto || (chk && chk.checked))) {
                    const match = mat.match(/(\d°)/);
                    if(match) selGrd.value = match[0];
                }
            };
        }

        const btnAsigGrp = document.getElementById('btnCrearAsignacionGrupoMaestro');
        if(btnAsigGrp) {
            btnAsigGrp.onclick = () => { if(window.crearAsignacionGrupoMaestro) window.crearAsignacionGrupoMaestro(); };
        }
    } catch(e) { console.error("Error initEventosAdminGrupos:", e); }
};

window.initEventosAdminMaestros = () => {
    try {
        const currentPlantelID = state.plantelId || state.user?.user_metadata?.plantel_id;
        
        // 2. Gestión de Maestros y Materias
        const btnGuardarDoc = document.getElementById('btnGuardarMaestroSolo');
        if(btnGuardarDoc) {
            btnGuardarDoc.onclick = async () => {
                const emailValue = document.getElementById('docEmail').value;
                const nombreValue = document.getElementById('docName').value;
                const rolRaw = document.getElementById('docRole') ? document.getElementById('docRole').value : 'maestro';
                const rolValue = (['admin','administrativo','admin'].includes(rolRaw)) ? 'admin' : (['maestro','maestro'].includes(rolRaw) ? 'maestro' : rolRaw);
                
                if(!emailValue || !nombreValue) return showToast("Por favor llena los campos.", "error");
                
                try {
                    const { error } = await supabaseClient.from('perfiles_permitidos').upsert([{ 
                        email: emailValue, 
                        rol: rolValue, 
                        nombre: nombreValue,
                        plantel_id: currentPlantelID
                    }], { onConflict: 'email' });

                    if(error) throw error;
                    showToast("Personal registrado y vinculado al plantel.", "success");
                    if(window.loadSelectsMaestros) window.loadSelectsMaestros();
                    if(window.loadListasAdminPersonal) window.loadListasAdminPersonal();
                } catch(e) { showToast("Error: " + e.message, "error"); }
            };
        }

        const btnAsigMat = document.getElementById('btnAsignarMateriaMaestro');
        if(btnAsigMat) {
            btnAsigMat.onclick = () => { if(window.crearMateriaMaestro) window.crearMateriaMaestro(); };
        }

        const selDocMat = document.getElementById('selMaestroMateriasV110');
        if(selDocMat) {
            selDocMat.onchange = (e) => { if(window.loadMateriasDeMaestro) window.loadMateriasDeMaestro(e.target.value); };
        }
    } catch(e) { console.error("Error initEventosAdminMaestros:", e); }
};

function attachDOMEvents() {
  try {
      // 0. Inicializar eventos específicos si estamos en la vista de asignación
      if(document.getElementById('selAsigGrupoBase')) {
          window.initEventosAdminGrupos();
          // Forzar carga de selectores si están vacíos
          const selG = document.getElementById('selAsigGrupoBase');
          if(selG && selG.options.length <= 1) {
              if(window.loadSelectsMaestros) window.loadSelectsMaestros();
          }
      }

      // 0.1 Inicializar tecnologías en inscripción
      if(document.getElementById('tallerInput')) {
          if(window.updateTecnologiasFiltro) window.updateTecnologiasFiltro();
      }

      // 1. Buscadores de Alumnos (Expedientes y Trámites)
      const inExp = document.getElementById('inBuscarExpediente');
      if(inExp) {
          inExp.addEventListener('keyup', async (e) => {
              const val = e.target.value.trim();
              const resCont = document.getElementById('resBuscadorExpediente');
              if(val.length < 2) { resCont.style.display = 'none'; return; }
              const { data } = await supabaseClient.from('alumnos').select('id, nombre, matricula').or(`nombre.ilike.%${val}%,matricula.ilike.%${val}%`).limit(5);
              if(data && data.length > 0) {
                  resCont.style.display = 'block';
                  resCont.innerHTML = data.map(a => `<div class="search-item" onclick="window.selectAlumnoExpediente('${a.id}', '${a.nombre.replace(/'/g, "\\'")}', '${a.matricula}'); document.getElementById('resBuscadorExpediente').style.display='none';">${a.nombre} (${a.matricula})</div>`).join('');
              } else { resCont.style.display = 'none'; }
          });
      }

      const inTram = document.getElementById('inBuscarAlumnoTramite');
      if(inTram) {
          inTram.addEventListener('keyup', async (e) => {
              const val = e.target.value.trim();
              const resCont = document.getElementById('resBuscadorTramite');
              if(val.length < 2) { resCont.style.display = 'none'; return; }
              const { data } = await supabaseClient.from('alumnos').select('id, nombre, matricula').or(`nombre.ilike.%${val}%,matricula.ilike.%${val}%`).limit(5);
              if(data && data.length > 0) {
                  resCont.style.display = 'block';
                  resCont.innerHTML = data.map(a => `<div class="search-item" onclick="window.selectAlumnoTramite('${a.id}', '${a.nombre.replace(/'/g, "\\'")}', '${a.matricula}'); document.getElementById('resBuscadorTramite').style.display='none';">${a.nombre} (${a.matricula})</div>`).join('');
              } else { resCont.style.display = 'none'; }
          });
      }

      // 2. Gestión de Maestros y Materias (Mapeado ahora en initEventosAdminMaestros)
      if(document.getElementById('selMaestroMateriasV110')) {
          window.initEventosAdminMaestros();
      }

      // 3. Gestión de Grupos y Asignaciones (Filtro Tecnología)
      const selAsigMaestro = document.getElementById('selAsigMaestroBase');
      if(selAsigMaestro) {
          selAsigMaestro.addEventListener('change', (e) => {
              const email = e.target.value;
              if(!email) {
                  if(window.loadGruposDeMaestro) window.loadGruposDeMaestro(null);
                  return;
              }
              if(window.loadMateriasDeMaestro) window.loadMateriasDeMaestro(email);
              if(window.loadGruposDeMaestro) window.loadGruposDeMaestro(email);
          });
      }

      const selAsigMateria = document.getElementById('selAsigMateriaBase');
      if(selAsigMateria) {
          selAsigMateria.addEventListener('change', () => {
              const mat = selAsigMateria.value;
              const selGrp = document.getElementById('selAsigGrupoBase');
              const selGrd = document.getElementById('selAsigGradoBase');
              const lbl = document.getElementById('lblAsigAmbito');
              const msg = document.getElementById('msgFiltroTecnologia');
              if(!mat || !selGrp || !selGrd) return;
              
              if(mat.toLowerCase().includes('tecnología') || mat.toLowerCase().includes('taller')) {
                  selGrp.style.display = 'none';
                  selGrd.style.display = 'block';
                  if(lbl) lbl.innerText = "Grado para Tecnología";
                  if(msg) msg.style.display = 'block';

                  // Pre-seleccionar grado si viene en el nombre de la materia
                  const match = mat.match(/(\d°)/);
                  if(match) selGrd.value = match[0];
              } else {
                  selGrp.style.display = 'block';
                  selGrd.style.display = 'none';
                  if(lbl) lbl.innerText = "Vincular con Grupo Existente";
                  if(msg) msg.style.display = 'none';
              }
          });
      }

      const btnAsigGrp = document.getElementById('btnCrearAsignacionGrupoMaestro');
      if(btnAsigGrp) {
          btnAsigGrp.addEventListener('click', () => { if(window.crearAsignacionGrupoMaestro) window.crearAsignacionGrupoMaestro(); });
      }

      // 4. Inscripción de Alumnos: Carga Dinámica desde Carga Maestro
      const grInput = document.getElementById('gradoInput');
      const tlInput = document.getElementById('tallerInput');
      
      window.updateTecnologiasFiltro = async () => {
          let selectedGrado = grInput.value.trim();
          if(!selectedGrado || !tlInput) return;
          
          if(/^\d+$/.test(selectedGrado)) selectedGrado = selectedGrado + '°';
          
          try {
              tlInput.innerHTML = '<option value="">Consultando tecnologías para ' + selectedGrado + '...</option>';
              // Buscamos materias que sean Tecnologías o Talleres en la CARGA MAESTRO
              const { data: talData, error: talError } = await supabaseClient.from('asignaciones_maestros')
                  .select('materia')
                  .eq('target_grado', selectedGrado);
              
              if(talError) throw talError;

              if(talData && talData.length > 0) {
                  // Filtrar únicos
                  const uniqueSet = [...new Set(talData.map(t => t.materia))];
                  tlInput.innerHTML = '<option value="">-- Selecciona Tecnología --</option>' + 
                                     uniqueSet.map(t => `<option value="${t}">${t}</option>`).join('');
              } else {
                  tlInput.innerHTML = `<option value="">Sin tecnologías asignadas para ${selectedGrado}</option>`;
              }
          } catch(e) { 
              console.error(">>> ERROR CARGA TECNOLOGÍA:", e); 
              tlInput.innerHTML = '<option value="">Error al cargar (Verifica carga maestro)</option>'; 
          }
      };

      if(grInput && tlInput) {
          grInput.addEventListener('change', window.updateTecnologiasFiltro);
          grInput.addEventListener('input', window.updateTecnologiasFiltro);
          if(grInput.value) window.updateTecnologiasFiltro();
      }

      const btnGuardarIns = document.getElementById('btnGuardarAlumno');
      if (btnGuardarIns) {
        btnGuardarIns.addEventListener('click', async () => {
          const curp = document.getElementById('curp').value;
          const nombre = document.getElementById('nombre').value;
          const edad = document.getElementById('edad').value;
          const email = document.getElementById('contactoAcceso').value;
          const grado = document.getElementById('gradoInput').value;
          const grupoNom = document.getElementById('grupoInput').value;
          const estatura = document.getElementById('estatura')?.value;
          const peso = document.getElementById('peso')?.value;
          const tallaZapato = document.getElementById('tallaZapato')?.value;
          const tallerValue = tlInput ? tlInput.value : null;

          if(!curp || !nombre || !email || !grado || !grupoNom || !edad) {
            return alert("Por favor llena todos los campos esenciales.");
          }
          const btnText = btnGuardarIns.innerText;
          btnGuardarIns.innerText = "Guardando...";
          btnGuardarIns.disabled = true;
          try {
            // 1. Autorizar acceso vinculando el nombre para la lista administrativa
            // Robustez de Plantel para Alumnos
            let finalPlantel = state.plantelId || state.user?.user_metadata?.plantel_id;
            if(!finalPlantel && state.user?.id) {
                const { data: prof } = await supabaseClient.from('perfiles').select('plantel_id').eq('id', state.user.id).single();
                finalPlantel = prof?.plantel_id;
            }

            if(!finalPlantel) {
                btnGuardarIns.innerText = btnText;
                btnGuardarIns.disabled = false;
                return alert("❌ Error: No se pudo identificar tu plantel. Por favor recarga la página.");
            }

            await supabaseClient.from('perfiles_permitidos').upsert([{ 
                email, 
                rol: 'alumno', 
                nombre: nombre,
                plantel_id: finalPlantel
            }], { onConflict: 'email' });
            // Normalización: Asegurar formato X°Y (ej: 2°A)
            let gradoLimpio = grado.replace('°', '');
            const grupoCompleto = `${gradoLimpio}°${grupoNom.toUpperCase()}`;
            let grId;
            const { data: gData } = await supabaseClient.from('grupos').select('id').eq('nombre', grupoCompleto).maybeSingle();
            if(gData) grId = gData.id;
            else {
               const { data: nG } = await supabaseClient.from('grupos').insert([{ nombre: grupoCompleto, plantel_id: state.plantelId }]).select().single();
               grId = nG.id;
            }
            const matricula = 'AL-' + Math.floor(Math.random() * 90000 + 10000);
            const { error: errAlumno } = await supabaseClient.from('alumnos').insert([{ 
               curp, nombre, edad: parseInt(edad, 10),
               matricula, grupo_id: grId, grado: grado, contacto_email: email, taller: tallerValue,
               estatura, peso, talla_zapato: tallaZapato,
               plantel_id: finalPlantel
            }]);
            if(errAlumno) throw errAlumno;
            alert("Alumno inscrito exitosamente. Matrícula: " + matricula);
          } catch (err) { alert("Error: " + err.message); }
          finally { btnGuardarIns.innerText = btnText; btnGuardarIns.disabled = false; }
        });
      }

      // 5. Credencial Alumno
      const stQR = document.getElementById('studentQR');
      if (stQR) {
         const renderStudentData = async () => {
             try {
                 const uData = await supabaseClient.auth.getUser();
                 const user = uData.data.user;
                 if(!user) return;
                 const { data: alumno } = await supabaseClient.from('alumnos').select('nombre, matricula, grupos(nombre)').eq('perfil_id', user.id).single();
                 if(alumno) {
                     const cName = document.getElementById('credName');
                     const cMat = document.getElementById('credMatricula');
                     const cGrp = document.getElementById('credGrupo');
                     if(cName) cName.innerText = alumno.nombre || 'Sin Nombre';
                     if(cMat) cMat.innerText = 'Matrícula: ' + alumno.matricula;
                     if(cGrp) cGrp.innerText = (alumno.grupos && alumno.grupos.nombre) ? alumno.grupos.nombre : 'Sin asignación';
                     stQR.innerHTML = '';
                     if(window.qrcode) {
                         let qr = qrcode(0, 'M');
                         qr.addData(alumno.matricula); qr.make();
                         stQR.innerHTML = qr.createImgTag(5, 10);
                     }
                 }
             } catch(e) { console.log("Error cargando credencial:", e); }
         };
         renderStudentData();
      }

      // Cargar auto al montar DOM:
      if(window.loadSelectsMaestros) window.loadSelectsMaestros();

  } catch(err) { console.error("Error en attachDOMEvents:", err); }
}

// Globals used by inline onclicks
window.dropFoto = (el, ev) => {
   ev.preventDefault();
   el.style.backgroundColor = 'var(--surface-hover)';
   if(ev.dataTransfer.files && ev.dataTransfer.files[0]) {
      const fr = new FileReader();
      fr.onload = (e) => {
         el.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
      };
      fr.readAsDataURL(ev.dataTransfer.files[0]);
   }
};

window.dropDoc = (el, ev) => {
   ev.preventDefault();
   el.style.borderColor = 'var(--border)';
   if(ev.dataTransfer.files && ev.dataTransfer.files[0]) {
       const badge = el.querySelector('span') || el.querySelector('.badge');
       if(badge) {
          badge.className = 'badge bg-success';
          badge.style.background = '#d1fae5';
          badge.style.color = '#065f46';
          badge.innerHTML = 'Subido: ' + ev.dataTransfer.files[0].name.substring(0, 15) + '...';
       }
   }
};

window.handleFileSelect = (el, ev) => {
   if(ev.target.files && ev.target.files[0]) {
       const badge = el.querySelector('.badge') || el.querySelector('span[class*="badge"]');
       if(badge) {
          badge.className = 'badge bg-success';
          badge.style.background = '#d1fae5';
          badge.style.color = '#065f46';
          badge.innerHTML = 'Subido: ' + ev.target.files[0].name.substring(0, 15) + '...';
       }
   }
};

window.crearGrupoDrag = async () => {
    const grado = document.getElementById('selGrado').value;
    const letra = document.getElementById('selLetra').value;
    const txt = `${grado.replace('°', '')}°${letra}`;
    
    try {
        const { error } = await supabaseClient.from('grupos').insert([{ nombre: txt, plantel_id: state.plantelId }]);
        if(error) throw error;
        alert(`Grupo ${txt} creado con éxito en Base de Datos.`);
        
        // Actualizar la lista en UI (El div de grupos y el select de asignaciones)
        window.loadSelectsMaestros(); 
        
        const list = document.getElementById('gruposCreados');
        const color = ['var(--primary)', 'var(--warning)', 'var(--danger)'][Math.floor(Math.random()*3)];
        list.insertAdjacentHTML('beforeend', `<div class="materia-drag" style="border-left-color: ${color}"><i class="fa-solid fa-layer-group text-muted"></i> Grupo ${txt}</div>`);
    } catch(e) {
        alert(e.message);
    }
};


window.agregarMaestro = () => {
   const nombre = prompt('Nombre del Maestro:');
   const materia = prompt('Materia o Rol:');
   const correo = prompt('Correo Electrónico (para inicio de sesión y portal del maestro):');
   if(nombre && materia && correo) {
       document.getElementById('listaMaestros').insertAdjacentHTML('beforeend', `
           <div class="card" style="padding:16px; position:relative; animation: fadeIn 0.3s;">
             <button onclick="this.parentElement.remove()" style="position:absolute; top:8px; right:8px; background:none; border:none; color:var(--danger); cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
             <div style="display:flex; gap:12px; align-items:center; margin-bottom:12px;">
                <div class="profile-avatar" style="width:40px; height:40px; background:var(--success)"><i class="fa-solid fa-user"></i></div>
                <div>
                   <h4 style="margin:0">${nombre}</h4>
                   <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:2px;">${materia}</p>
                   <p style="font-size:0.7rem; color:var(--primary); font-family:monospace;">${correo}</p>
                </div>
             </div>
             <div style="min-height: 80px; border:2px dashed var(--border); border-radius:8px; padding:8px; display:flex; flex-direction:column; gap:4px; transition:0.3s;" ondragover="event.preventDefault(); this.style.backgroundColor='var(--surface-hover)'" ondragleave="this.style.backgroundColor='transparent'" ondrop="window.dropGrupo(this, event)">
             </div>
           </div>
       `);
   }
};

window.dropGrupo = (el, ev) => {
   ev.preventDefault();
   el.style.backgroundColor = 'transparent';
   const data = ev.dataTransfer.getData('text/plain');
   if(data) {
       const ph = el.querySelector('div[style*="text-align"]'); 
       if(ph) ph.remove();
       el.insertAdjacentHTML('beforeend', `<div style="background:var(--success); color:white; padding:4px 24px 4px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold; position:relative;"><i class="fa-solid fa-check"></i> ${data}<button onclick="this.parentElement.remove()" style="position:absolute; right:4px; top:50%; transform:translateY(-50%); background:none; border:none; color:white; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button></div>`);
   }
};

window.toggleAsistenciaModo = async (modo) => {
    const hoy = new Date().toLocaleDateString('en-CA');
    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) throw new Error("Sesión expirada");

        const materia = (window.currentAulaMateria || 'N/A').trim();
        const { data: sesion } = await supabaseClient.from('asistencia_sesiones')
            .select('*').eq('grupo_id', String(window.currentAulaGrupoId)).eq('materia', materia).eq('fecha', hoy).maybeSingle();

        if(sesion && sesion.estado === 'cerrado') {
            window.showToast("Esta sesión ya está cerrada definitivamente.", "error");
            return;
        }

        if(window._currentAsistenciaModo === modo) {
            window._currentAsistenciaModo = null;
            if(window._mScanner) { await window._mScanner.stop().catch(()=>{}); window._mScanner = null; document.getElementById('reader-maestro').style.display = 'none'; }
            window.updateSessionUI();
            return;
        }

        window._currentAsistenciaModo = modo;
        const dbEstado = modo === 'asistencia' ? 'abierto' : 'retardo';
        
        await supabaseClient.from('asistencia_sesiones').upsert({
            grupo_id: String(window.currentAulaGrupoId), 
            materia: window.currentAulaMateria || 'N/A', 
            fecha: hoy, 
            maestro_id: u.data.user.id, 
            estado: dbEstado,
            plantel_id: state.plantelId
        }, { onConflict: 'grupo_id, materia, fecha' });

        window.startMaestroQR();
        window.updateSessionUI();
    } catch(err) { window.showToast("Error: " + err.message, "error"); }
};

window.startMaestroQR = async () => {
    const reader = document.getElementById('reader-maestro');
    if(!reader) return;
    reader.style.display = 'block';
    if(window._mScanner) { await window._mScanner.stop().catch(()=>{}); window._mScanner = null; }
    window._mScanner = new Html5Qrcode("reader-maestro");
    window._isProcessingQR = false;
    await window._mScanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, 
        async (decodedText) => {
            if(window._isProcessingQR) return;
            window._isProcessingQR = true;
            try { await window.guardarAsistenciaQR(decodedText, window.currentAulaGrupoId); }
            finally { setTimeout(() => { window._isProcessingQR = false; }, 2000); }
        }, () => {}
    ).catch(err => { console.error(err); window.showToast("Cámara bloqueada", "error"); });
};

window.guardarAsistenciaQR = async (matricula, grupoId) => {
    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) throw new Error("Sesión expirada");
        const hoy = new Date().toLocaleDateString('en-CA');
        const materia = (window.currentAulaMateria || 'N/A').trim();
        const [sessionRes, studentRes] = await Promise.all([
            supabaseClient.from('asistencia_sesiones').select('estado').eq('grupo_id', String(grupoId)).eq('materia', materia).eq('fecha', hoy).maybeSingle(),
            supabaseClient.from('alumnos').select('id, nombre, grupo_id, grado, taller').eq('matricula', matricula).maybeSingle()
        ]);
        const sesion = sessionRes.data;
        const alumno = studentRes.data;
        if(!sesion || sesion.estado === 'cerrado') { window.showToast("⚠️ Pase de lista cerrado.", "error"); return; }
        if(!alumno) { window.showToast("Alumno no encontrado", "error"); return; }

        // VALIDACIÓN DE PERTENENCIA
        const sessionGid = String(grupoId);
        if(sessionGid.startsWith('grado:')) {
            // Caso Taller: Comparamos Grado y Nombre del Taller
            const targetGrado = sessionGid.replace('grado:', '').split('|')[0].trim();
            const targetTaller = sessionGid.split('|')[1].trim();
            if(alumno.grado !== targetGrado || (alumno.taller || '').trim() !== targetTaller) {
                window.showToast(`❌ El alumno NO pertenece a este taller (${targetTaller} ${targetGrado})`, "error");
                return;
            }
        } else {
            // Caso Grupo Específico: Comparamos grupo_id
            if(alumno.grupo_id !== sessionGid) {
                window.showToast("❌ El alumno NO pertenece a este grupo.", "error");
                return;
            }
        }

        const estFinal = (sesion.estado === 'retardo') ? 'Retardo' : 'Asistencia';
        const { error } = await supabaseClient.from('asistencias').insert([{
            alumno_id: alumno.id, 
            registrador_id: u.data.user.id, 
            estado: estFinal,
            materia: (window.currentAulaMateria || 'N/A').trim(),
            grupo_id: String(grupoId).startsWith('grado:') ? null : String(grupoId),
            plantel_id: state.plantelId
        }]);
        if(error) throw error;
        window.showToast(`✅ ${estFinal}: ${alumno.nombre}`, estFinal === 'Retardo' ? 'warning' : 'success');
    } catch(e) { window.showToast("Error: " + e.message, "error"); }
};

window.confirmarCierreSesion = () => {
    if(confirm("¿Seguro de CERRAR el pase de lista?\n\nMarcará FALTAS a los ausentes y enviará AVISOS de retardo.")) {
        window.finalizarSesionAsistencia();
    }
};

window.finalizarSesionAsistencia = async () => {
    try {
        const u = await supabaseClient.auth.getUser();
        const hoy = new Date().toLocaleDateString('en-CA');
        const grupoId = String(window.currentAulaGrupoId);
        const materia = (window.currentAulaMateria || 'N/A').trim();
        
        await supabaseClient.from('asistencia_sesiones').update({ estado: 'cerrado' }).eq('grupo_id', grupoId).eq('materia', materia).eq('fecha', hoy);
        
        let queryAl = supabaseClient.from('alumnos').select('id');
        if(grupoId.startsWith('grado:')) queryAl = queryAl.eq('grado', grupoId.split(':')[1].split('|')[0]);
        else queryAl = queryAl.eq('grupo_id', grupoId);
        
        const { data: todos } = await queryAl;
        let queryReg = supabaseClient.from('asistencias')
            .select('alumno_id, estado, materia')
            .gte('creado_en', hoy + 'T00:00:00')
            .lte('creado_en', hoy + 'T23:59:59');
            
        if(grupoId.startsWith('grado:')) {
            queryReg = queryReg.is('grupo_id', null);
        } else {
            queryReg = queryReg.eq('grupo_id', grupoId);
        }
        
        const { data: rawReg } = await queryReg;
        // Filtrar por materia en JS para ser más permisivos con espacios o nulos si es necesario
        const reg = (rawReg || []).filter(r => {
            const mRecord = (r.materia || '').trim();
            return mRecord === materia || mRecord === ''; // Permitir nulos/vaciós para justificaciones generales
        });
        
        const yaIds = (reg || []).map(r => r.alumno_id);
        const faltantes = (todos || []).filter(al => !yaIds.includes(al.id));
        
        if(faltantes.length > 0) {
            await supabaseClient.from('asistencias').insert(faltantes.map(al => ({
                alumno_id: al.id, 
                registrador_id: u.data.user.id, 
                estado: 'Falta', 
                grupo_id: grupoId.startsWith('grado:') ? null : grupoId,
                plantel_id: state.plantelId
            })));
        }

        const retardos = (reg || []).filter(r => r.estado === 'Retardo');
        if(retardos.length > 0) {
            await supabaseClient.from('comunicados').insert(retardos.map(r => ({
                autor_id: u.data.user.id, 
                titulo: '⚠️ AVISO DE RETARDO', 
                audiencia: 'Alumno_' + r.alumno_id,
                mensaje: `Hola. Se ha registrado un RETARDO en la materia: "${materia}" el día de hoy (${hoy}). \n\nRecuerda que la puntualidad es parte de tu evaluación formativa.`,
                plantel_id: state.plantelId
            })));
        }

        if(window._mScanner) { await window._mScanner.stop().catch(()=>{}); window._mScanner = null; document.getElementById('reader-maestro').style.display='none'; }
        window._currentAsistenciaModo = null;
        window.showToast("Pase de lista cerrado. Faltas y avisos procesativos.", "success");
        window.updateSessionUI();
    } catch(e) { window.showToast("Error al cerrar", "error"); }
};

window.startPrefScanner = async (mode = 'metralleta') => {
    const reader = document.getElementById('reader-prefectura');
    const stopBtn = document.getElementById('btn-stop-pref');
    const resumeBtn = document.getElementById('btn-resume-pref');
    const statusPanel = document.getElementById('pref-status-info');
    
    if(!reader) return;

    // Configurar estado
    window.prefScanMode = mode;
    reader.style.display = 'block';
    if(statusPanel) statusPanel.style.display = 'block';
    if(stopBtn) stopBtn.style.display = 'inline-flex';
    if(resumeBtn) resumeBtn.style.display = 'none';

    if(window.Html5Qrcode) {
        try {
            if(window._prefScanner) {
                await window._prefScanner.stop().catch(()=>{});
                window._prefScanner = null;
            }
            
            window._prefScanner = new Html5Qrcode("reader-prefectura");
            await window._prefScanner.start(
                { facingMode: "environment" },
                { fps: 15, qrbox: { width: 250, height: 250 } },
                (decodedText) => { 
                    // Ya no truncamos a 36, enviamos el texto completo para buscar matrícula
                    window.registrarAsistenciaPrefectura(decodedText.trim());
                },
                (err) => {}
            );
        } catch (e) {
            console.error("No se pudo iniciar la cámara:", e);
            window.showToast("Error de cámara: Asegúrese de dar permisos.", "error");
            window.stopPrefScanner();
        }
    }
};

window.stopPrefScanner = async () => {
    const reader = document.getElementById('reader-prefectura');
    const stopBtn = document.getElementById('btn-stop-pref');
    const resumeBtn = document.getElementById('btn-resume-pref');

    if(window._prefScanner) {
        try {
            await window._prefScanner.stop();
            window._prefScanner = null;
        } catch(e) {}
    }

    if(reader) reader.style.display = 'none';
    if(startPanel) startPanel.style.display = 'block';
    if(stopBtn) stopBtn.style.display = 'none';
};

window.registrarAsistenciaPrefectura = async (uid) => {
    // Evitar escaneos duplicados inmediatos en modo metralleta
    if(window._lastScan === uid && (Date.now() - (window._lastScanTime || 0)) < 2000) return;
    window._lastScan = uid;
    window._lastScanTime = Date.now();

    try {
        // Enviar al sistema de asistencia oficial
        await window.registrarAsistenciaEntrada(uid);

        // Si es modo individual, detener cámara
        if(window.prefScanMode === 'single') {
            window.stopPrefScanner();
        }
    } catch(e) { console.error(e); }
};

window.registrarAsistenciaEntrada = async (qrText) => {
    try {
        const estadoPortal = window._estadoPaseLista === 'retardo' ? 'Retardo' : 'Asistencia';
        
        // 1. Buscar al alumno (Primero por matrícula que es lo más común)
        let { data: alu, error: searchErr } = await supabaseClient.from('alumnos')
            .select('id, nombre')
            .eq('matricula', qrText)
            .maybeSingle();

        // Si no se encontró por matrícula, intentar por ID (solo si tiene formato UUID)
        if(!alu && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(qrText)) {
            const { data: aluId } = await supabaseClient.from('alumnos')
                .select('id, nombre')
                .eq('id', qrText)
                .maybeSingle();
            alu = aluId;
        }

        if(!alu) {
            const feedback = document.getElementById('pref-feedback');
            if(feedback) {
                feedback.innerHTML = `
                    <div class="card shadow-md" style="background:var(--danger); color:white; padding:15px; border-radius:15px; display:flex; align-items:center; gap:15px; margin-bottom:10px;">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;"></i>
                        <div style="text-align:left;">
                            <div style="font-size:0.7rem; opacity:0.8; font-weight:bold;">ERROR DE ESCANEO</div>
                            <div style="font-size:1.1rem; font-weight:700;">QR NO RECONOCIDO</div>
                            <div style="font-size:0.75rem;">El código "${qrText}" no está registrado.</div>
                        </div>
                    </div>
                `;
                clearTimeout(window._prefFeedbackTimeout);
                window._prefFeedbackTimeout = setTimeout(() => { feedback.innerHTML = ''; }, 5000);
            }
            window.showToast("QR no reconocido", "warning");
            return;
        }

        const uRes = await supabaseClient.auth.getUser();
        
        // 2. Registrar el acceso con el ID encontrado
        const { error } = await supabaseClient.from('accesos_plantel').insert([{
            alumno_id: alu.id,
            estado: estadoPortal,
            registrador_id: uRes.data.user?.id,
            fecha: new Date().toLocaleDateString('en-CA'),
            hora: new Date().toLocaleTimeString('en-GB'),
            plantel_id: state.plantelId
        }]);

        if(error) {
            console.error(">>> ERROR REGISTRO QR:", error);
            window.showToast("Error BD: " + error.message, "error");
            return;
        }

        // 3. Verificar estatus escolar (Reportes pendientes)
        const { count: pend } = await supabaseClient.from('reportes_conducta')
            .select('*', { count: 'exact', head: true })
            .eq('alumno_id', alu.id)
            .eq('resuelto', false);

        if(window.triggerScanSuccess) {
            window.triggerScanSuccess(alu.nombre, estadoPortal, pend || 0);
        }

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/766/766-preview.mp3');
        audio.play().catch(()=>{});

        if(state.path === '/apoyo/prefectura') {
            window.loadResumenEntrada();
            window.loadAsistenciasApoyo();
        }
    } catch(e) { 
        console.error("Error registro entrada plantel:", e);
    }
};

window.showQRScannerModal = async (title = 'Grupo Seleccionado', grupoId = null, materia = null) => {
   window.currentAulaGrupoId = grupoId;
   window.currentAulaMateria = materia;
   const classCards = document.querySelectorAll('.class-card');
   classCards.forEach(c => c.style.display = 'none');
   document.getElementById('classDetail').style.display = 'block';
   const titleEl = document.getElementById('classDetailTitle');
   if(titleEl) titleEl.innerText = title;

   // No auto-iniciar modo, dejamos al maestro elegir el botón
   window.updateSessionUI();

   // Auto-iniciar cámara
   setTimeout(() => {
       if(window.startMaestroQR) window.startMaestroQR('normal');
   }, 300);
};

window.gestionarSesionAutomatica = () => { window.updateSessionUI(); };

window.updateSessionUI = async () => {
    const statusEl = document.getElementById('asistenciaStatusMsg');
    const btnPuntual = document.getElementById('btnModoPuntual');
    const btnRetardo = document.getElementById('btnModoRetardo');
    const lblPuntual = document.getElementById('lblBtnPuntual');
    const lblRetardo = document.getElementById('lblBtnRetardo');
    const btnCerrar = document.getElementById('btnCerrarSesionDefinitivo');

    if(!statusEl) return;
    
    try {
        const hoy = new Date().toLocaleDateString('en-CA');
        const { data: sesion } = await supabaseClient.from('asistencia_sesiones')
            .select('estado')
            .eq('grupo_id', String(window.currentAulaGrupoId))
            .eq('materia', window.currentAulaMateria || 'N/A')
            .eq('fecha', hoy)
            .maybeSingle();

        const estado = sesion?.estado || 'pendiente';
        
        // Reset botones
        if(btnPuntual) { 
            btnPuntual.disabled = false;
            btnPuntual.className = 'btn btn-outline'; 
            btnPuntual.style.borderColor = 'var(--primary)'; 
            btnPuntual.style.color = 'var(--primary)'; 
        }
        if(btnRetardo) { 
            btnRetardo.disabled = false;
            btnRetardo.className = 'btn btn-outline'; 
            btnRetardo.style.borderColor = 'var(--warning)'; 
            btnRetardo.style.color = 'var(--warning)'; 
        }
        if(lblPuntual) lblPuntual.innerText = '[Activar Cámara]';
        if(lblRetardo) lblRetardo.innerText = '[Activar Cámara]';
        if(btnCerrar) btnCerrar.style.display = (estado !== 'cerrado') ? 'inline-flex' : 'none';

        let label = '⚪ Esperando Inicio';
        let color = 'var(--text-muted)';
        
        if(estado === 'abierto' || estado === 'asistencia') {
            label = '🟢 MODO PUNTUAL (Abierto)';
            color = 'var(--primary)';
            if(window._currentAsistenciaModo === 'asistencia') {
                if(btnPuntual) { btnPuntual.className = 'btn btn-primary'; btnPuntual.style.color = 'white'; }
                if(lblPuntual) lblPuntual.innerText = '● CAMARA ENCENDIDA (Clic para apagar)';
            }
        } else if(estado === 'retardo') {
            label = '🟡 MODO RETARDOS (Abierto)';
            color = 'var(--warning)';
            if(window._currentAsistenciaModo === 'retardo') {
                if(btnRetardo) { btnRetardo.className = 'btn btn-warning'; btnRetardo.style.color = 'white'; }
                if(lblRetardo) lblRetardo.innerText = '● CAMARA ENCENDIDA (Clic para apagar)';
            }
        } else if(estado === 'cerrado') {
            label = '🔴 SESIÓN FINALIZADA (Faltas Aplicadas)';
            color = 'var(--danger)';
            if(btnPuntual) btnPuntual.disabled = true;
            if(btnRetardo) btnRetardo.disabled = true;
            if(btnCerrar) btnCerrar.style.display = 'none';
        }

        statusEl.innerHTML = `<i class="fa-solid fa-circle-dot" style="color:${color}"></i> ${label}`;
        
    } catch(err) { console.error(err); }
};

window.openReporteModal = async () => {
    if(!window.currentAulaGrupoId) {
        alert("Por favor, selecciona un grupo primero cerrando esta ventana y volviendo a intentar.");
        return;
    }

    const modalHTML = `
      <div class="modal-overlay" id="reporteModal">
        <div class="modal-content" style="position:relative">
           <button class="modal-close" onclick="document.getElementById('reporteModal').remove()"><i class="fa-solid fa-xmark"></i></button>
           <h2 style="color: var(--danger); margin-bottom: 24px;"><i class="fa-solid fa-triangle-exclamation"></i> Nuevo Reporte Rápido</h2>
           
           <div id="reporteModalLoading" style="text-align:center; margin: 20px 0;"><i class="fa-solid fa-spinner fa-spin fa-2x text-muted"></i> <p>Cargando alumnos...</p></div>
           
           <div id="reporteModalForm" style="display:none;">
               <div class="form-group">
                 <label class="form-label">Alumno involucrado</label>
                 <select class="form-select" id="repAlumnoList"></select>
               </div>
               <div class="form-group">
                 <label class="form-label">Tipo de Incidencia</label>
                 <select class="form-select" id="repTipo">
                    <option value="Conductual">Comportamiento / Conducta</option>
                    <option value="Académico">Académico (Tareas, Material, etc.)</option>
                 </select>
               </div>
               <div class="form-group">
                 <label class="form-label">Descripción de Incidencia</label>
                 <textarea id="repDesc" class="form-input" style="height: 100px; resize:none;" placeholder="Detalles de la falta cometida..."></textarea>
               </div>
               <div class="form-group">
                 <label class="form-label">Severidad del reporte</label>
                 <select id="repSev" class="form-select" style="border-color: var(--danger); outline: none;">
                    <option value="Leve">Leve (Advertencia)</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Grave" selected>Grave (Aviso a Padres y T. Social)</option>
                 </select>
               </div>
               <button id="btnSendRep" class="btn btn-danger btn-lg" style="width:100%; margin-top: 10px;" onclick="window.enviarReporteRapido()"><i class="fa-solid fa-paper-plane"></i> Enviar Reporte Inmediato</button>
           </div>
        </div>
      </div>
    `;
    document.getElementById('app').insertAdjacentHTML('beforeend', modalHTML);
    
    try {
        let query = supabaseClient.from('alumnos').select('id, nombre');
        
        if (window.currentAulaGrupoId && window.currentAulaGrupoId.startsWith('grado:')) {
            // Formato: "grado:1°|Computación"
            const parts = window.currentAulaGrupoId.split(':')[1].split('|');
            const targetGrado = parts[0];
            const materia = parts[1] || window.currentAulaMateria;
            const gNorm = targetGrado.includes('°') ? targetGrado : targetGrado + '°';
            // v116: Robust matching for technologies
            const cleanMat = materia.replace(/tecnología|tecnologia/gi, '').trim();
            query = query.eq('grado', gNorm).ilike('taller', `%${cleanMat || materia}%`);

        } else {
            query = query.eq('grupo_id', window.currentAulaGrupoId);
        }

        const { data: alumnos, error } = await query.order('nombre');
        if(error) throw error;
        
        const sel = document.getElementById('repAlumnoList');
        if(!alumnos || alumnos.length === 0) {
           sel.innerHTML = '<option value="">No hay alumnos en este grupo/tecnología</option>';
        } else {
           sel.innerHTML = alumnos.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');
        }
        document.getElementById('reporteModalLoading').style.display = 'none';
        document.getElementById('reporteModalForm').style.display = 'block';
    } catch(err) {
        console.error(err);
        document.getElementById('reporteModalLoading').innerHTML = '<span style="color:var(--danger)">Error al cargar alumnos</span>';
    }
};

window.enviarReporteRapido = async () => {
    const alumno_id = document.getElementById('repAlumnoList').value;
    const tipo = document.getElementById('repTipo').value;
    const desc = document.getElementById('repDesc').value;
    const sev = document.getElementById('repSev').value;
    
    if(!alumno_id) { alert("Seleccione un alumno."); return; }
    if(!desc.trim()) { alert("Escriba la descripción."); return; }
    
    const finalDesc = `[${tipo.toUpperCase()}] ${desc.trim()}`;
    const btn = document.getElementById('btnSendRep');
    const oldHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;
    
    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) throw new Error("Not logged in");
        const autor_id = u.data.user.id;
        
        const { error } = await supabaseClient.from('reportes_conducta').insert([{
           id: crypto.randomUUID(),
           alumno_id: alumno_id,
           autor_id: autor_id,
           descripcion: finalDesc,
           gravedad: sev,
           resuelto: false,
           plantel_id: state.plantelId
        }]);
        if(error) {
            console.error("Supabase insert error:", error);
            throw error;
        }
        
        if (sev === 'Grave') {
            const { data: qAl } = await supabaseClient.from('alumnos').select('nombre').eq('id', alumno_id).single();
            const alumnoName = qAl ? qAl.nombre : 'Alumno';
            await supabaseClient.from('comunicados').insert([{
               id: crypto.randomUUID(),
               autor_id: autor_id,
               titulo: `Aviso Importante: Reporte ${tipo}`,
               audiencia: `Alumno_${alumno_id}`,
               mensaje: `Se ha levantado un reporte de severidad *${sev}* para ${alumnoName}.\n\nDetalle:\n${desc}`
            }]);
        }
        
        alert("Reporte guardado y canalizado exitosamente.");
        document.getElementById('reporteModal').remove();
    } catch(err) {
        console.error(err);
        alert("Error al enviar reporte.");
        btn.innerHTML = oldHtml;
        btn.disabled = false;
    }
};

window.showExpedienteLateral = () => {
   document.getElementById('expedienteDrawer').style.display = 'block';
};

window.triggerScanSuccess = (nombre = "Alumno", estado = "Asistencia", reportesPendientes = 0) => {
    // 1. Feedback visual para Prefectura
    const feedback = document.getElementById('pref-feedback');
    if(feedback) {
        const esCompleto = reportesPendientes === 0;
        const color = esCompleto ? 'var(--success)' : 'var(--warning)';
        const icon = esCompleto ? 'fa-circle-check' : 'fa-triangle-exclamation';
        const txtStatus = esCompleto ? 'PASE DE LISTA: COMPLETO ✅' : `PASE INCOMPLETO: ${reportesPendientes} REPORTES ⚠️`;
        
        feedback.innerHTML = `
            <div class="card shadow-md animate-pulse" style="background:${color}; color:${esCompleto?'white':'#92400e'}; padding:18px; border-radius:20px; display:flex; align-items:center; gap:20px; margin-bottom:10px; border:2px solid ${esCompleto?'transparent':'#f59e0b'};">
                <i class="fa-solid ${icon}" style="font-size:2.5rem;"></i>
                <div style="text-align:left;">
                    <div style="font-size:0.75rem; opacity:0.9; font-weight:800; letter-spacing:1px;">${txtStatus}</div>
                    <div style="font-size:1.2rem; font-weight:700; margin-top:2px;">${nombre}</div>
                    <div style="font-size:0.85rem; opacity:0.8; font-weight:600;">Ingreso: ${estado}</div>
                </div>
            </div>
        `;
        clearTimeout(window._prefFeedbackTimeout);
        window._prefFeedbackTimeout = setTimeout(() => { if(feedback) feedback.innerHTML = ''; }, 4000);
    }

    // 2. Notificaciones flotantes (Toast)
    const stack = document.getElementById('notifStack');
    const text = `${nombre} [${estado}] ${reportesPendientes > 0 ? '(Reportes!)' : ''}`;
    if(stack) {
        const el = document.createElement('div');
        el.className = 'scan-success';
        el.style.cssText = "background:var(--success); color:white; padding:8px 12px; border-radius:8px; margin-bottom:5px; animation: slideIn 0.3s ease-out;";
        el.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + text;
        stack.appendChild(el);
        if(stack.children.length > 5) stack.removeChild(stack.firstChild);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            el.style.transition = 'all 0.3s';
            setTimeout(() => el.remove(), 300);
        }, 4000);
    } else if(!feedback) {
        window.showToast(text, "success");
    }
};

// Globals for Encuadre Rubros
window.rubros = [
  {id: 1, name: 'Exámenes Generales', val: 40, color: 'var(--primary)'},
  {id: 2, name: 'Tareas y Prácticas', val: 30, color: 'var(--success)'},
  {id: 3, name: 'Proyecto Final', val: 30, color: 'var(--warning)'}
];

window.renderRubros = () => {
    const container = document.getElementById('rubrosContainer');
    const totalEl = document.getElementById('encuadreTotal');
    const btn = document.getElementById('btnEnviarEncuadre');
    if(!container) return;
    
    let html = '';
    let suma = 0;
    
    window.rubros.forEach(r => {
        suma += r.val;
        html += `
          <div class="encuadre-row" style="position:relative; margin-left: 20px;">
            <button onclick="window.quitarRubro(${r.id})" style="position:absolute; left:-35px; top:20px; color:var(--danger); background:none; border:none; cursor:pointer;" title="Quitar Rubro"><i class="fa-solid fa-circle-minus"></i></button>
            <div class="encuadre-title">${r.name}</div>
            <div class="encuadre-slider">
              <input type="range" min="0" max="100" value="${r.val}" oninput="window.handleSliderInput(this, ${r.id})">
            </div>
            <div class="encuadre-value" style="color: ${r.color}">${r.val}%</div>
          </div>
        `;
    });
    
    if(window.rubros.length === 0) html = '<p style="text-align:center; color:var(--text-muted); padding:20px;">No hay rubros de evaluación.</p>';
    
    container.innerHTML = html;
    totalEl.innerText = suma + '%';
    
    if(suma === 100) {
       totalEl.style.color = 'var(--success)';
       btn.disabled = false;
       btn.style.opacity = '1';
       btn.innerText = 'Establecer y Enviar a Padres para Firma';
    } else {
       totalEl.style.color = 'var(--danger)';
       btn.disabled = true;
       btn.style.opacity = '0.5';
       btn.innerText = '⚠️ La suma debe ser exactamente 100%';
    }
};

window.handleSliderInput = (input, id) => {
    let val = parseInt(input.value);
    let sumOthers = window.rubros.reduce((acc, r) => r.id !== id ? acc + r.val : acc, 0);
    if(sumOthers + val > 100) {
        val = 100 - sumOthers;
        input.value = val;
    }
    const target = window.rubros.find(r => r.id === id);
    target.val = val;
    window.renderRubros();
};

window.loadGruposEncuadre = async () => {
    const sel = document.getElementById('encuadreGrupoMateria');
    if(!sel) return;
    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) return;
        
        const { data: asigs } = await supabaseClient.from('asignaciones_maestros')
           .select('materia, grupo_id, target_grado, grupos(id, nombre)')
           .eq('docente_email', u.data.user.email)
           .or('grupo_id.not.is.null,target_grado.not.is.null');
           
        if(asigs && asigs.length > 0) {
            sel.innerHTML = '<option value="">-- Seleccione Materia y Grupo --</option>' + 
               asigs.map(a => {
                   if(a.grupos) {
                       return `<option value="${a.grupos.id}|${a.materia}">${a.materia} - ${a.grupos.nombre}</option>`;
                   } else if(a.target_grado) {
                       // Para tecnologías: usaremos grado:GRADO como identificador
                       return `<option value="grado:${a.target_grado}|${a.materia}">${a.materia} - Grado ${a.target_grado} (Tecnología)</option>`;
                   }
                   return '';
               }).filter(Boolean).join('');
        } else {
            sel.innerHTML = '<option value="">Sin Asignaciones con grupo/grado vinculado</option>';
        }
    } catch(e) { console.error(e); }
};

window.cargarRubrosParaActividad = async () => {
    const actMG = document.getElementById('actMateriaGrupo');
    const actR = document.getElementById('actRubro');
    if(!actMG || !actR) return;
    
    actR.innerHTML = '<option value="">Cargando rubros...</option>';
    if(!actMG.value) { actR.innerHTML = '<option value="">-- Selecciona Grupo Primero --</option>'; return; }
    
    const [idPart, mat] = actMG.value.split('|');
    const isTec = idPart.startsWith('grado:');
    const gid = isTec ? null : idPart;
    const targetGrado = isTec ? idPart.replace('grado:', '') : null;
    const trimSelected = document.getElementById('actTrimestre')?.value || 1;

    try {
        let q = supabaseClient.from('encuadres').select('rubros').eq('materia', mat).eq('trimestre', trimSelected);
        if(isTec) {
            q = q.is('grupo_id', null).eq('target_grado', targetGrado);
        } else {
            q = q.eq('grupo_id', gid);
        }
        const { data: encuadre } = await q.maybeSingle();

        if(encuadre && encuadre.rubros && encuadre.rubros.length > 0) {
             actR.innerHTML = '<option value="">No aplica (Extra)</option>' + encuadre.rubros.map(r => {
                 return `<option value='${JSON.stringify({name:r.name, val:r.val})}'>${r.name} (${r.val}%)</option>`;
             }).join('');
        } else {
             actR.innerHTML = '<option value="">Sin encuadre configurado (No aplica)</option>';
        }
    } catch(e) {
        console.error(e);
        actR.innerHTML = '<option value="">Error... (No aplica)</option>';
    }
};


window.cargarEncuadreActivo = async () => {
    const sel = document.getElementById('encuadreGrupoMateria');
    const overlay = document.getElementById('encuadreOverlay');
    const title = document.getElementById('encuadreCurrentTitle');
    const btnEnviar = document.getElementById('btnEnviarEncuadre');
    const panelF = document.getElementById('panelFirmantes');
    const contF = document.getElementById('contenedorFirmantes');
    
    if(!sel.value) {
        overlay.style.display = 'flex';
        title.innerText = 'Configurando: ---';
        if(btnEnviar) { btnEnviar.disabled = false; btnEnviar.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Guardar y Enviar a Alumnos para Firma'; btnEnviar.style.background = ''; }
        if(panelF) panelF.style.display = 'none';
        return;
    }
    
    overlay.style.display = 'none';
    const [idPart, mat] = sel.value.split('|');
    const isTec = idPart.startsWith('grado:');
    const gid = isTec ? null : idPart;
    const targetGrado = isTec ? idPart.replace('grado:', '') : null;
    title.innerText = `Configurando: ${sel.options[sel.selectedIndex].text}`;
    
    try {
        let q = supabaseClient.from('encuadres')
            .select('rubros, notificacion_enviada, fecha_envio_notif')
            .eq('materia', mat)
            .eq('trimestre', window.currentTrimestre || 1);

        if(isTec) {
            q = q.is('grupo_id', null).eq('target_grado', targetGrado);
        } else {
            q = q.eq('grupo_id', gid);
        }
        const { data: enc } = await q.maybeSingle();
        
        if (enc && enc.rubros) {
            window.rubros = enc.rubros;
        } else {
            window.rubros = [
              {id: 1, name: 'Exámenes Generales', val: 40, color: 'var(--primary)'},
              {id: 2, name: 'Tareas y Prácticas', val: 30, color: 'var(--success)'},
              {id: 3, name: 'Proyecto Final', val: 30, color: 'var(--warning)'}
            ];
        }
        window.renderRubros();

        // Bloquear el botón si ya se envió, pero mostrar el botón de reset
        if(btnEnviar) {
            const btnReset = document.getElementById('btnResetEncuadre');
            if(enc && enc.notificacion_enviada) {
                btnEnviar.disabled = true;
                btnEnviar.innerHTML = `<i class="fa-solid fa-check-double"></i> Ya enviado a alumnos`;
                btnEnviar.style.background = 'var(--success)';
                if(btnReset) btnReset.style.display = 'block';
            } else {
                btnEnviar.disabled = false;
                btnEnviar.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Guardar y Enviar a Alumnos para Firma';
                btnEnviar.style.background = '';
                if(btnReset) btnReset.style.display = 'none';
            }
        }
        // Cargar panel de firmantes si el encuadre tiene envíos previos
        if(enc && enc.notificacion_enviada) {
            if(panelF) panelF.style.display = 'block';
            if(window.loadFirmantesEncuadre) window.loadFirmantesEncuadre();
        } else {
            if(panelF) panelF.style.display = 'none';
        }
    } catch (e) {
        console.error("Error en cargarEncuadreActivo:", e);
    }
};

    window.currentTrimestre = 1;
    window.setTrimestre = (tri, btn) => {
        window.currentTrimestre = tri;
        document.querySelectorAll('.btn-trimestre').forEach(b => b.classList.remove('active'));
        if(btn) btn.classList.add('active');
        // Recargar el encuadre para el nuevo trimestre si ya hay grupo seleccionado
        const sel = document.getElementById('encuadreGrupoMateria');
        if(sel && sel.value) window.cargarEncuadreActivo();
    };

    window.guardarYEnviarEncuadre = async () => {
    const sel = document.getElementById('encuadreGrupoMateria');
    if(!sel.value) return alert("Selecciona un grupo/materia primero.");
    
    let sum = window.rubros.reduce((acc, r) => acc + r.val, 0);
    if(sum !== 100) return alert("La suma total de rubros debe ser exactamente 100%.");
    
    const [idPart, mat] = sel.value.split('|');
    const isTec = idPart.startsWith('grado:');
    const gid = isTec ? null : idPart;
    const targetGrado = isTec ? idPart.replace('grado:', '') : null;
    const labelGrupo = sel.options[sel.selectedIndex].text;

    const btn = document.getElementById('btnEnviarEncuadre');
    const origHtml = btn.innerHTML;
    try {
        const u = await supabaseClient.auth.getUser();

        // 0. Verificar si ya fue enviado antes (RESTRICTIVO POR TRIMESTRE)
        const { data: encExistente } = await supabaseClient
            .from('encuadres')
            .select('id, notificacion_enviada, fecha_envio_notif')
            .eq('materia', mat)
            .eq('trimestre', window.currentTrimestre || 1)
            .match(isTec ? { target_grado: targetGrado } : { grupo_id: gid })
            .maybeSingle();

        if(encExistente && encExistente.notificacion_enviada) {
            const fecha = new Date(encExistente.fecha_envio_notif).toLocaleString();
            return alert(`⚠️ Este encuadre ya fue enviado el ${fecha}.\nUsa el botón de "Limpiar Registro" para habilitar un nuevo envío.`);
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

        // 1. Guardar el encuadre
        const payloadEnc = {
            maestro_id: u.data.user.id,
            grupo_id: gid,
            target_grado: targetGrado,
            materia: mat,
            rubros: window.rubros,
            trimestre: window.currentTrimestre || 1,
            plantel_id: state.plantelId
        };

        if(isTec) {
            if(encExistente) {
                const { error } = await supaAdmin.from('encuadres').update(payloadEnc).eq('id', encExistente.id);
                if(error) throw error;
            } else {
                const { error } = await supaAdmin.from('encuadres').insert([payloadEnc]);
                if(error) throw error;
            }
        } else {
            const { error } = await supaAdmin.from('encuadres').upsert(payloadEnc, { onConflict: 'grupo_id, materia, trimestre' });
            if(error) throw error;
        }

        // 2. Obtener los alumnos del grupo/grado para notificarles
        let alumnosQuery = supabaseClient.from('alumnos').select('id, nombre');
        if(isTec) {
            const gNorm = targetGrado.includes('°') ? targetGrado : targetGrado + '°';
            // v116: Robust matching for technologies
            const cleanMat = mat.replace(/tecnología|tecnologia/gi, '').trim();
            alumnosQuery = alumnosQuery.eq('grado', gNorm).ilike('taller', `%${cleanMat || mat}%`);

        } else {
            alumnosQuery = alumnosQuery.eq('grupo_id', gid);
        }
        const { data: alumnos, error: errAl } = await alumnosQuery;
        console.log(">>> [ENCUADRE] Alumnos encontrados para notificar:", alumnos?.length, "Error:", errAl);
        if(alumnos) console.log(">>> [ENCUADRE] Muestra de IDs de alumnos:", alumnos.slice(0,3).map(a => a.id));

        // Obtener el nombre del maestro
        const { data: perfil } = await supabaseClient.from('perfiles').select('nombre').eq('id', u.data.user.id).maybeSingle();
        const nombreMaestro = perfil?.nombre || u.data.user.email;

        // 3. Enviar notificaciones a alumnos
        if(alumnos && alumnos.length > 0) {
            // Obtener el ID del encuadre para la referencia invisible
            let qEncId = supabaseClient.from('encuadres').select('id')
                .eq('maestro_id', u.data.user.id)
                .eq('materia', mat)
                .eq('trimestre', window.currentTrimestre || 1);
            
            if(isTec) qEncId = qEncId.is('grupo_id', null).eq('target_grado', targetGrado);
            else qEncId = qEncId.eq('grupo_id', gid);
            
            const { data: encObj } = await qEncId.maybeSingle();

            const rubrosTexto = window.rubros.map(r => `• ${r.name}: ${r.val}%`).join('\n');
            const labelTri = (window.currentTrimestre || 1) + "° Trimestre";

            const notificaciones = alumnos.map(alum => ({
                autor_id: u.data.user.id,
                titulo: `📋 Encuadre: ${mat} (${labelGrupo}) - ${labelTri}`,
                mensaje: `El profesor/a ${nombreMaestro} ha publicado los criterios de evaluación para el ${labelTri} en la materia "${mat}".\n\n📊 Estructura de Calificación:\n${rubrosTexto}\n\n✍️ Por favor, FIRMA DE ENTERADO.\n\n[REF_ID: ${encObj?.id || 'none'}]`, // Etiqueta invisible
                audiencia: `Alumno_${alum.id}`,
                plantel_id: state.plantelId
            }));
            const { error: errIns } = await supabaseClient.from('comunicados').insert(notificaciones);
            if(errIns) throw errIns;

            // 4. Marcar encuadre como enviado
            let qUpdate = supabaseClient.from('encuadres').update({ 
                notificacion_enviada: true, 
                fecha_envio_notif: new Date().toISOString() 
            }).eq('materia', mat).eq('trimestre', window.currentTrimestre || 1);

            if(isTec) qUpdate = qUpdate.is('grupo_id', null).eq('target_grado', targetGrado);
            else qUpdate = qUpdate.eq('grupo_id', gid);
            await qUpdate;

            const fechaHoy = new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
            btn.style.background = 'var(--success)';
            btn.innerHTML = `<i class="fa-solid fa-check-double"></i> Notificación enviada (${fechaHoy})`;

            // Mostrar panel de firmantes y refrescar
            const panelF = document.getElementById('panelFirmantes');
            if(panelF) panelF.style.display = 'block';
            if(window.loadFirmantesEncuadre) window.loadFirmantesEncuadre();

            alert(`✅ ¡Encuadre enviado con éxito!\nSe han generado avisos para ${alumnos.length} alumnos.`);
            window.cargarEncuadreActivo(); // Refrescar UI completa
        } else {
            alert("⚠️ No se encontraron alumnos registrados en este grupo para notificar.");
            btn.disabled = false;
            btn.innerHTML = origHtml;
            btn.style.background = '';
        }

    } catch(err) {
        console.error("Error en guardarYEnviarEncuadre:", err);
        alert("Error al enviar el encuadre: " + err.message);
        btn.disabled = false;
        btn.innerHTML = origHtml;
        btn.style.background = '';
    }
};


window.agregarRubro = () => {
   let name = prompt('Nombre del nuevo rubro (Ej: Participación, Asistencia):');
   if(name) {
       const color = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'][Math.floor(Math.random()*6)];
       window.rubros.push({id: Date.now(), name: name, val: 0, color: color});
       window.renderRubros();
   }
};

window.quitarRubro = (id) => {
   window.rubros = window.rubros.filter(r => r.id !== id);
   window.renderRubros();
};

window.simularEscaneoReporte = () => {
    document.getElementById('alumnoReporteInput').value = "Juan Carlos Pérez (Escaneado) [Mat: 2026118]";
};

window.cargarBitacora = async (fecha) => {
    const tl = document.getElementById('bitacoraTimeline');
    if(!tl) return;
    tl.innerHTML = '<div style="color:var(--text-muted); font-size:0.9rem"><i class="fa-solid fa-spinner fa-spin"></i> Cargando hechos...</div>';
    
    const inputFirma = document.getElementById('autorBitacora');
    if(inputFirma && !inputFirma.value) {
        try {
            const uprof = await supabaseClient.from('perfiles').select('nombre').eq('id', (await supabaseClient.auth.getUser()).data.user.id).single();
            if(uprof.data) inputFirma.value = "Mtro(a). " + uprof.data.nombre;
        } catch(e) { }
    }
    
    try {
        const { data: bitacoras, error } = await supabaseClient.from('bitacora_maestro').select('*').eq('fecha_referencia', fecha).order('creado_en', { ascending: false });
        if(error) {
            console.error(error);
            tl.innerHTML = '<div style="color:var(--danger); font-size:0.9rem"><i class="fa-solid fa-circle-exclamation"></i> Error: Asegúrate de correr en SQL: CREATE TABLE bitacora_maestro... Revisa las instrucciones.</div>';
            return;
        }
        
        if(!bitacoras || bitacoras.length === 0) {
            tl.innerHTML = '<div style="color:var(--text-muted); font-size:0.9rem">No hay registros de incidentes en esta jornada (Paz total).</div>';
            return;
        }
        
        let hh = '';
        bitacoras.forEach(b => {
            const dateObj = new Date(b.creado_en);
            const timeStr = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            hh += `
              <div style="position:relative;">
                 <div style="position:absolute; left:-33px; top:0; width:16px; height:16px; background:var(--primary); border-radius:50%; border:4px solid white;"></div>
                 <div style="font-weight:bold; font-size:0.9rem; color:var(--text-muted)"><i class="fa-regular fa-clock"></i> ${timeStr} - Registrado por: ${b.firma_autor}</div>
                 <div style="background:var(--page-bg); padding:12px; border-radius:8px; margin-top:8px; border:1px solid var(--border); color:var(--text-main); line-height:1.5; white-space:pre-wrap;">${b.texto}</div>
              </div>
            `;
        });
        tl.innerHTML = hh;
        
    } catch(err) {
        console.error(err);
    }
};

window.agregarBitacora = async () => {
    const firma = document.getElementById('autorBitacora').value.trim();
    const texto = document.getElementById('nuevaBitacoraTexto').value.trim();
    const fecha = document.getElementById('fechaBitacora').value;
    
    if(!texto) return alert("Escribe los detalles de la situación para asentar el hecho.");
    if(!firma) return alert("Firma el acontecimiento (Ej. Titular de Grupo).");
    if(!fecha) return;
    
    try {
        const uid = (await supabaseClient.auth.getUser()).data.user.id;
        
        const { error } = await supabaseClient.from('bitacora_maestro').insert([{
           id: crypto.randomUUID(),
           perfil_id: uid,
           firma_autor: firma,
           texto: texto,
           fecha_referencia: fecha,
           plantel_id: state.plantelId
        }]);
        
        if(error) {
           console.error(error);
           alert("Ocurrió un error. Asegúrate de haber ejecutado las instrucciones SQL del asistente.");
           return;
        }
        
        document.getElementById('nuevaBitacoraTexto').value = '';
        window.cargarBitacora(fecha);
        
    } catch(e) {
        console.error(e);
        alert("Fallo al insertar a bitácora maestro.");
    }
};

// End of file cleanup

window.loadAdminCalificacionesFiltros = async () => {
    try {
        const { data: grupos, error } = await supabaseClient.from('grupos').select('id, nombre, turno').order('nombre');
        if(error) return console.error(error);
        const sel = document.getElementById('adminGrupoSel');
        if(!sel) return;
        sel.innerHTML = '<option value="">-- Selecciona un grupo --</option>' + 
           grupos.map(g => `<option value="${g.id}">${g.nombre} - ${g.turno}</option>`).join('');
    } catch(err) { console.error(err); }
};

window.cargarSabanaGrupo = async () => {
    const hold = document.getElementById('adminCalificacionesTablaHolder');
    const trimRaw = document.getElementById('adminTrimestreSel').value;
    const gid = document.getElementById('adminGrupoSel').value;
    
    // Extract number from "Trimestre 1"
    const trim = parseInt(trimRaw.replace(/\D/g, ''));
    
    if(!gid || isNaN(trim)) {
        if(hold) hold.innerHTML = '<div style="color:var(--text-muted); font-size:0.9rem;">Seleccione un grupo y trimestre...</div>';
        return;
    }
    
    if(hold) hold.innerHTML = '<div style="color:var(--text-muted); font-size:0.9rem;"><i class="fa-solid fa-spinner fa-spin"></i> Consultando base de datos oficial...</div>';
    
    try {
        // Obtenemos alumnos del grupo (v122: traemos taller para identificar tecnología)
        const resAlums = await supabaseClient.from('alumnos').select('id, nombre, taller').eq('grupo_id', gid).order('nombre');

        if(!resAlums.data || resAlums.data.length === 0) {
            hold.innerHTML = '<div style="color:var(--warning); font-size:0.9rem;">No hay alumnos registrados en este grupo.</div>';
            return;
        }
        
        const studentIds = resAlums.data.map(a => a.id);
        
        // Obtenemos calificaciones para estos alumnos en este trimestre
        const { data: califs, error } = await supabaseClient.from('calificaciones')
           .select('alumno_id, calificacion, materia_nombre, materia_id(nombre)')
           .in('alumno_id', studentIds)
           .eq('trimestre', trim);
           
        if(error) {
           console.error(error);
           hold.innerHTML = '<div style="color:var(--danger); font-size:0.9rem;">Error al recuperar calificaciones.</div>';
           return;
        }
        
        // Mapear alumnos
        let htmlRows = '';
        
        // 4. Agrupar Materias (v122: Unificar todas las tecnologías en una sola columna "Tecnología")
        const matSet = new Set();
        califs.forEach(c => {
            let mName = c.materia_nombre || (c.materia_id ? c.materia_id.nombre : 'Sin Nombre');
            // Si el nombre contiene tecnología, lo tratamos como "Tecnología" para la UI
            if(/tecnología|tecnologia/gi.test(mName)) {
                matSet.add('Tecnología');
            } else {
                matSet.add(mName);
            }
        });
        const materiasObj = Array.from(matSet);

        
        if (materiasObj.length === 0) {
            hold.innerHTML = '<div style="color:var(--text-muted); font-size:0.9rem;">Los maestros de este grupo aún no han enviado sus actas de calificación para este trimestre.</div>';
            return;
        }

        resAlums.data.forEach(al => {
            // Fill grades for student
            const misC = califs.filter(c => c.alumno_id === al.id);
            let cols = '';
            let sump = 0;
            let matN = 0;
            
            materiasObj.forEach(mName => {
                let cx;
                if(mName === 'Tecnología') {
                    // Buscar cualquier calificación que tenga "tecnología" en su nombre
                    cx = misC.find(x => /tecnología|tecnologia/gi.test(x.materia_nombre || (x.materia_id?.nombre)));
                } else {
                    cx = misC.find(x => (x.materia_nombre === mName) || (x.materia_id && x.materia_id.nombre === mName));
                }

                if(cx) {
                    // v122: Guardar el taller original en un atributo de datos para que la exportación y notif lo usen
                    const tallerFull = cx.materia_nombre || (cx.materia_id?.nombre) || '';
                    cols += `<td style="color:var(--text-main)" data-full-materia="${tallerFull}">${cx.calificacion}</td>`;
                    sump += Number(cx.calificacion);
                    matN++;
                } else {
                    cols += `<td style="color:var(--text-muted)">-</td>`;
                }
            });

            
            const promX = matN > 0 ? (sump/matN).toFixed(1) : '-';
            
            htmlRows += `
               <tr>
                 <td style="text-align:left; font-weight:bold;">${al.nombre}</td>
                 ${cols}
                 <td style="background:var(--surface-hover); font-weight:bold; color:var(--primary); font-size:1.1rem;">${promX}</td>
               </tr>
            `;
        });
        
         hold.innerHTML = `
          <table id="tablaSabanaActual" class="risk-table" style="width:100%; text-align:center;">
            <thead>
               <tr>
                 <th style="text-align:left;">Estudiante</th>
                 ${materiasObj.map(m => `<th>${m}</th>`).join('')}
                 <th style="background:var(--surface-hover); color:var(--primary)">Promedio</th>
               </tr>
            </thead>
            <tbody>
               ${htmlRows}
            </tbody>
          </table>
        `;
        
        // Mostrar botón de notificación si hay datos
        if(document.getElementById('btnNotifBoletas')) document.getElementById('btnNotifBoletas').style.display = 'inline-block';
    } catch(err) {
        console.error(err);
        hold.innerHTML = '<div style="color:var(--danger); font-size:0.9rem;">Ocurrió un error inesperado al armar la sábana.</div>';
    }
};

window.exportarSabanaCalificaciones = () => {
    const table = document.getElementById('tablaSabanaActual');
    if(!table) {
        window.showToast("Primero selecciona un grupo para cargar la sábana.", "warning");
        return;
    }
    
    try {
        const rows = Array.from(table.querySelectorAll('tr'));
        let csvContent = "";
        
        // BOM para que Excel detecte UTF-8 (acentos y ñ)
        csvContent += "\uFEFF";

        rows.forEach((row, index) => {
            const cols = Array.from(row.querySelectorAll('th, td'));
            const rowData = cols.map(col => {
                // v122: Si tiene el atributo data-full-materia (tecnología), usar ese para el CSV
                let cellData = col.getAttribute('data-full-materia') || col.innerText.trim();
                
                // Si es la versión full para tecnología, agregarle el alias corto (ej. TC)
                if(/tecnología|tecnologia/gi.test(cellData) && !cellData.includes('(')) {
                    if(/computac/gi.test(cellData)) cellData += " (TC)";
                    else if(/corte/gi.test(cellData)) cellData += " (TCYC)";
                    else if(/estet/gi.test(cellData)) cellData += " (TE)";
                    else if(/dibujo/gi.test(cellData)) cellData += " (TDT)";
                }

                // Limpiar saltos de línea y escapar comillas
                cellData = cellData.replace(/"/g, '""').replace(/\n/g, ' ');
                return `"${cellData}"`;
            }).join(',');

            csvContent += rowData + "\n";
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        const grupo = document.getElementById('adminGrupoSel').selectedOptions[0]?.text || 'Sábana';
        const trimestre = document.getElementById('adminTrimestreSel').value;
        const nombreArchivo = `Sabana_${grupo.replace(/\s+/g, '_')}_${trimestre.replace(/\s+/g, '_')}.csv`;
        
        link.setAttribute("href", url);
        link.setAttribute("download", nombreArchivo);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.showToast("Sábana descargada con éxito.", "success");
    } catch (e) {
        console.error("Error al exportar sábana:", e);
        window.showToast("No se pudo generar el archivo.", "error");
    }
};

window.notificarRevisionSabana = async () => {
    const trim = document.getElementById('adminTrimestreSel').value;
    const gSelector = document.getElementById('adminGrupoSel');
    const gid = gSelector.value;
    const grupoName = gSelector.options[gSelector.selectedIndex].text;
    const tabla = document.getElementById('tablaSabanaActual');

    if(!gid || !tabla) return alert('Primero selecciona un grupo con calificaciones cargadas.');

    if(!confirm(`¿Deseas enviar el reporte de calificaciones personalizado a cada alumno de ${grupoName}? (Esto enviará la nota individual al perfil de cada estudiante)`)) return;

    try {
        const uRes = await supabaseClient.auth.getUser();
        if(!uRes.data.user) throw new Error("Sin sesión");

        const rows = tabla.querySelectorAll("tbody tr");
        if(rows.length === 0) return alert('No hay alumnos en la tabla.');

        const btn = document.getElementById('btnNotifBoletas');
        const origHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando reportes...';

        // Obtenemos los alumnos del grupo para tener sus IDs actuales y sus IDs de perfil (usuario)
        const { data: alums } = await supabaseClient.from('alumnos').select('id, nombre, perfil_id').eq('grupo_id', gid);
        
        const headers = Array.from(tabla.querySelectorAll("thead th")).map(th => th.innerText.trim());
        // Función de normalización robusta: Sin acentos, minúsculas, sin espacios extra
        const norm = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim().toLowerCase();
        
        let results = [];
        let noEncontrados = [];
        
        // 1. Recopilar y Categorizar Datos
        for (const row of rows) {
            const nombreAlumno = row.cells[0].innerText.trim();
            const promedio = parseFloat(row.cells[row.cells.length - 1].innerText) || 0;
            
            let desgloseMaterias = "";
            let materiasReprobadas = 0;
            for(let i = 1; i < row.cells.length - 1; i++) {
                let materiaNombre = row.cells[i].getAttribute('data-full-materia') || headers[i] || `Materia ${i}`;
                const calif = row.cells[i].innerText.trim();
                const califNum = parseFloat(calif) || 0;
                
                // v122: Agregar alias corto si es tecnología
                if(/tecnología|tecnologia/gi.test(materiaNombre) && !materiaNombre.includes('(')) {
                    if(/computac/gi.test(materiaNombre)) materiaNombre += " (TC)";
                    else if(/corte/gi.test(materiaNombre)) materiaNombre += " (TCYC)";
                    else if(/estet/gi.test(materiaNombre)) materiaNombre += " (TE)";
                    else if(/dibujo/gi.test(materiaNombre)) materiaNombre += " (TDT)";
                }

                desgloseMaterias += `• ${materiaNombre}: ${calif}\n`;
                if(califNum > 0 && califNum < 6) materiasReprobadas++;
            }


            const aluMatch = alums.find(a => norm(a.nombre) === norm(nombreAlumno));

            if(aluMatch) {
                results.push({
                    id: aluMatch.id,
                    perfil_id: aluMatch.perfil_id,
                    nombre: aluMatch.nombre,
                    promedio: promedio,
                    desglose: desgloseMaterias,
                    reprobadas: materiasReprobadas
                });
            } else {
                noEncontrados.push(nombreAlumno);
                console.warn(`No se encontró coincidencia para: "${nombreAlumno}"`);
            }
        }

        // 2. Procesar Envíos
        let conteo = 0;
        for (const res of results) {
            let mensajeEspecial = "";
            let tituloFinal = `BOLETA DIGITAL: ${trim}`;
            const prom = parseFloat(res.promedio.toFixed(1));
            
            // Lógica solicitada por el usuario v128
            if (prom <= 5.9) {
                tituloFinal = `⚠️ ADVERTENCIA ACADÉMICA - ${trim}`;
                mensajeEspecial = `\n\n🔴 ADVERTENCIA Y RECOMENDACIÓN:\nSe ha detectado un promedio de ${prom} (reprobatorio). Te recomendamos acercarte a tus maestros para solicitar asesorías y revisar tus actividades pendientes de inmediato. Es vital mejorar tu desempeño para el siguiente bloque.`;
            } else if (prom >= 6.0 && prom <= 9.0) {
                tituloFinal = `📈 REPORTE DE MEJORA - ${trim}`;
                mensajeEspecial = `\n\n🟡 MENSAJE DE SUPERACIÓN:\nTu promedio de ${prom} es bueno, pero ¡estás muy cerca de la excelencia! Te invitamos a esforzarte un poco más en tus áreas de oportunidad para que en el próximo reporte alcances el rango de Excelencia Académica (9.1+).`;
            } else if (prom >= 9.1) {
                tituloFinal = `💎 EXCELENCIA ACADÉMICA - ${trim}`;
                mensajeEspecial = `\n\n🌟 ¡MUCHAS FELICIDADES!:\nHas logrado un desempeño sobresaliente con un promedio de ${prom}. Reconocemos tu gran disciplina y compromiso escolar. ¡Sigue así, eres un orgullo para nuestra comunidad! 👏`;
            }

            // Enviar notificación individual marcada como automática para filtrado
            await supabaseClient.from('comunicados').insert([{
                autor_id: uRes.data.user.id,
                receptor_id: res.perfil_id, // Vinculación directa a la cuenta del alumno
                titulo: tituloFinal,
                mensaje: `Hola ${res.nombre}, se han validado tus calificaciones para el ${trim}.\n\nDETALLE POR MATERIA:\n${res.desglose}\nPROMEDIO GENERAL: ${res.promedio.toFixed(1)}${mensajeEspecial}`,
                audiencia: `Alumno_${res.id}`,
                tipo: 'reporte_academico_automatico'
            }]);
            conteo++;
        }

        if(noEncontrados.length > 0) {
            alert(`¡Proceso completado!\n\n✅ Enviados: ${conteo}\n❌ No vinculados (por nombre): ${noEncontrados.length}\n\nLos siguientes alumnos no recibieron boleta porque su nombre en la tabla no coincide exactamente con el registro escolar:\n- ${noEncontrados.join('\n- ')}\n\nPor favor, verifica los nombres y reintenta.`);
        } else {
            alert(`¡Éxito total! Se enviaron ${conteo} reportes individuales de calificaciones a los alumnos de ${grupoName}.`);
        }
        btn.disabled = false;
        btn.innerHTML = origHtml;
    } catch(e) {
        console.error(e);
        alert('Error al enviar reportes: ' + e.message);
    }
};

/* --- RESTORATION OF MISSING UTILITIES --- */
window.crearGrupoDrag = async () => {
    const grado = document.getElementById('selGrado').value;
    const letra = document.getElementById('selLetra').value;
    const nombre = `${grado}${letra}`;
    try {
        const { error } = await supabaseClient.from('grupos').insert([{ nombre, plantel_id: state.plantelId }]);
        if(error) throw error;
        alert(`Grupo ${nombre} generado.`);
        window.loadSelectsMaestros();
    } catch(err) { alert(err.message); }
};

window.crearMateriaMaestro = async () => {
    const selector = document.getElementById('selMaestroMateriasV110');
    if(!selector) return;
    
    const email = selector.value;
    
    // Identificación Robusta (v115): Buscamos el nombre real en la caché de maestros
    const teacherMatch = window.__teachersData?.find(t => t.email === email);
    const profName = teacherMatch ? (teacherMatch.nombre || teacherMatch.display) : "Maestro";
    
    const matInput = document.getElementById('nuevaMateriaDoc');
    const materia = matInput ? matInput.value : '';
    
    const currentPlantel = state.plantelId;

    if(!email || !materia) return showToast("Selecciona un maestro y escribe una materia.", "error");

    try {
        console.log(">>> [v114] REGISTRANDO MATERIA:", { email, profName, materia });
        
        const { error } = await supabaseClient.from('asignaciones_maestros').insert([{ 
            docente_email: email, 
            docente_nombre: profName,
            materia: materia, 
            grupo_id: null,
            plantel_id: currentPlantel
        }]);

        if(error) throw error;

        showToast("¡Materia registrada exitosamente!", "success");
        if(matInput) matInput.value = '';
        window.loadMateriasDeMaestro(email); 
    } catch(err) { 
        console.error("Error en asignación:", err);
        showToast("Error al guardar: " + err.message, "error"); 
    }
};

window.seleccionarMaestroDirecto = (email, element) => {
    // 1. Quitar resaltado de otros usando la clase correcta
    document.querySelectorAll('.maestro-item-directo').forEach(el => {
        el.style.background = 'transparent';
        el.style.borderBottom = '1px solid #fde68a';
    });
    
    // 2. Resaltar el actual (Estilo original ámbar)
    element.style.background = '#fef3c7';
    element.style.border = '2px solid #f59e0b';
    
    // 3. Guardar el email en el campo oculto
    const hiddenInput = document.getElementById('selMaestroMateriasV110');
    if(hiddenInput) hiddenInput.value = email;
    
    // 4. Cargar materias de ese maestro automáticamente
    if(window.loadMateriasDeMaestro) window.loadMateriasDeMaestro(email);
};

window.loadSelectsMaestros = async () => {
    try {
        console.log(">>> [v135] Sincronización Global Iniciada...");
        
        let currentP = state.plantelId || state.user?.user_metadata?.plantel_id;
        if(!currentP && state.user?.id) {
            const { data: pData } = await supabaseClient.from('perfiles').select('plantel_id').eq('id', state.user.id).single();
            currentP = pData?.plantel_id;
        }

        if(!currentP) {
            console.warn(">>> [v135] No hay plantel.");
            return;
        }

        // 2. OBTENCIÓN DE PERSONAL (SOLO MAESTROS para esta vista)
        let { data: staff, error: errProf } = await supabaseClient.from('perfiles_permitidos')
            .select('email, nombre, rol')
            .eq('rol', 'maestro')
            .eq('plantel_id', currentP)
            .order('nombre');

        if (!staff || staff.length === 0) {
            const { data: globalStaff } = await supabaseClient.from('perfiles_permitidos').select('email, nombre, rol').eq('rol', 'maestro');
            staff = globalStaff;
        }

        if (errProf) throw errProf;
        
        // 3. MAPEO A CACHÉ INTERNA
        const teachers = (staff || []).map(p => ({
            email: p.email,
            nombre: p.nombre || '',
            display: (p.nombre && p.nombre !== 'Nuevo Usuario') ? `${p.nombre.toUpperCase()}` : p.email
        }));
        window.__teachersData = teachers;

        // 4. ACTUALIZACIÓN DE SELECTORES
        const optionsHtml = '<option value="">Elige Maestro...</option>' + teachers.map(t => `<option value="${t.email}">${t.display} (${t.email})</option>`).join('');
        
        ['selMaestroMateriasV110', 'selAsigMaestroBase'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                if(el.tagName === 'SELECT') el.innerHTML = optionsHtml;
                else el.value = ''; 
            }
        });

        // 4.1 NUEVA LISTA DIRECTA (Paso 1 del Usuario)
        const listDirecta = document.getElementById('listaSeleccionMaestrosDirecta');
        if(listDirecta) {
            if(teachers.length === 0) {
                listDirecta.innerHTML = '<p style="text-align:center; padding:10px;">No hay maestros registrados.</p>';
            } else {
                listDirecta.innerHTML = teachers.map(t => `
                    <div class="maestro-item-directo" onclick="window.seleccionarMaestroDirecto('${t.email}', '${t.nombre}', this)">
                        <span>${t.display}</span>
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                `).join('');
            }
        }

        // 5. CARGAR GRUPOS DEL PLANTEL
        const { data: grupos } = await supabaseClient.from('grupos').select('id, nombre').eq('plantel_id', currentP).order('nombre');
        const sGr = document.getElementById('selAsigGrupoBase');
        if(sGr) sGr.innerHTML = '<option value="">Elige Grupo...</option>' + (grupos || []).map(g => `<option value="${g.id}">${g.nombre}</option>`).join('');

    } catch(e) { 
        console.error(">>> [v135 ERROR] Error de carga:", e);
    }
};

window.togglePaso1Maestros = (header) => {
    const wrapper = document.getElementById('wrapperListaMaestros');
    if(!wrapper) return;
    
    header.classList.toggle('active');
    wrapper.classList.toggle('show');
};

window.seleccionarMaestroDirecto = (email, nombre, element) => {
    const inputId = document.getElementById('selMaestroMateriasV110');
    if(inputId) {
        inputId.value = email;
        // Lanzar carga de materias y grupos vinculados
        if(window.loadMateriasDeMaestro) window.loadMateriasDeMaestro(email);
        if(window.loadGruposDeMaestro) window.loadGruposDeMaestro(email);
        
        // Manejo de estado activo
        document.querySelectorAll('.maestro-item-directo').forEach(el => el.classList.remove('active'));
        if(element) element.classList.add('active');
        
        // Actualizar el header del colapsable para mostrar el seleccionado
        const header = document.querySelector('.collapsible-header h4');
        if(header) header.innerHTML = `<i class="fa-solid fa-user-check"></i> MAESTRO: ${nombre}`;
        
        // Colapsar automáticamente
        const wrapper = document.getElementById('wrapperListaMaestros');
        const headerEl = document.querySelector('.collapsible-header');
        if(wrapper) {
            wrapper.classList.remove('show');
            if(headerEl) headerEl.classList.remove('active');
        }
        
        window.showToast(`Maestro ${nombre} seleccionado`, 'success');
    }
};

window.loadMateriasDeMaestro = async (email) => {
    const sb = document.getElementById('selAsigMateriaBase');
    const list = document.getElementById('listaMateriasMaestro');
    
    if(!email) {
        if(sb) sb.innerHTML = '<option value="">Elige...</option>';
        if(list) list.innerHTML = '<li>Selecciona un maestro.</li>';
        return;
    }

    try {
        const currentPlantelID = state.plantelId || 'general';
        // Obtener nombre del maestro con soporte de plantel (v115)
        const { data: profData } = await supabaseClient.from('perfiles_permitidos')
            .select('nombre')
            .eq('email', email)
            .eq('plantel_id', currentPlantelID)
            .maybeSingle();

        const displayLabel = profData?.nombre ? profData.nombre : email;

        const { data, error } = await supabaseClient.from('asignaciones_maestros')
            .select('materia')
            .eq('docente_email', email)
            .eq('plantel_id', currentPlantelID);
            
        if(error) throw error;
        
        const unq = [...new Set((data || []).map(d=>d.materia))];

        // Actualizar Selector de Asignación
        if(sb) {
            if(unq.length === 0) {
                sb.innerHTML = '<option value="">Este maestro no tiene materias base</option>';
            } else {
                sb.innerHTML = `<option value="">Elige Materia de ${profData?.nombre || 'Maestro'}</option>` + unq.map(m => `<option value="${m}">${m}</option>`).join('');
            }
        }

        // Actualizar Lista en gestión de maestros
        if(list) {
            if(unq.length === 0) {
                list.innerHTML = `<li style="font-weight:bold; color:var(--primary)">${displayLabel}</li><li>El maestro no tiene materias registradas.</li>`;
            } else {
                list.innerHTML = `<li style="font-weight:bold; color:var(--primary); margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:4px;"><i class="fa-solid fa-user-tie"></i> ${displayLabel}</li>` + 
                                unq.map(m => `<li><i class="fa-solid fa-book-open text-primary"></i> ${m}</li>`).join('');
            }
        }

    } catch(e) { 
        console.error(e);
        if(list) list.innerHTML = '<li>Error al cargar materias.</li>';
    }
};

window.loadGruposDeMaestro = async (email) => {
    const list = document.getElementById('listaGruposMaestro');
    if(!list) return;
    if(!email) { list.innerHTML = '<li>Sin selección</li>'; return; }
    try {
        const { data } = await supabaseClient.from('asignaciones_maestros').select('id, materia, target_grado, grupo_id, grupos(nombre)').eq('docente_email', email);
        
        // Filtramos para que solo se vean las que TIENEN un grupo o un grado asignado
        const asignacionesReales = (data || []).filter(d => d.grupo_id !== null || d.target_grado !== null);

        list.innerHTML = asignacionesReales.map(d => {
            const grpName = d.grupos ? d.grupos.nombre : (d.target_grado ? `Grado ${d.target_grado}` : 'Sin Grupo');
            return `<li style="display:flex; justify-content:space-between; align-items:center; padding: 4px 0; border-bottom: 1px dashed var(--border);">
                <span><i class="fa-solid fa-check text-success" style="margin-right: 8px;"></i> ${d.materia} - <strong>${grpName}</strong></span>
                <button class="btn btn-ghost btn-xs" style="color:var(--danger); padding:0px 4px; border:1px solid #fee2e2;" onclick="window.eliminarAsignacionMaestro('${d.id}', '${email}')" title="Eliminar asignación">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </li>`;
        }).join('') || '<li>Sin asignaciones.</li>';
    } catch(e) { list.innerHTML = '<li>Error al cargar grupos</li>'; }
};

window.eliminarAsignacionMaestro = async (idAsignacion, email) => {
    if(!confirm('¿Estás seguro de que deseas eliminar esta materia/grupo asignado a este maestro?')) return;
    try {
        const { error } = await supabaseClient.from('asignaciones_maestros').delete().eq('id', idAsignacion);
        if(error) throw error;
        window.showToast("Asignación eliminada correctamente.", "success");
        window.loadGruposDeMaestro(email);
        window.loadMateriasDeMaestro(email); // Refrescar el resumen de materias simples arriba
    } catch(err) {
        alert("Error al eliminar la asignación: " + err.message);
    }
};

window.crearAsignacionGrupoMaestro = async () => {
    const btn = document.getElementById('btnCrearAsignacionGrupoMaestro');
    if(!btn || btn.disabled) return; 

    const email = document.getElementById('selAsigMaestroBase').value;
    const mat = document.getElementById('selAsigMateriaBase').value;
    const grSelect = document.getElementById('selAsigGrupoBase');
    const grp = grSelect.value;
    const chkForce = document.getElementById('chkForzarTecnologia');
    const isTec = (chkForce && chkForce.checked) || mat.toLowerCase().includes('tecnología') || mat.toLowerCase().includes('taller');
    let targetGrado = null;
    let finalGrupoId = grp;

    if(isTec) {
        targetGrado = document.getElementById('selAsigGradoBase').value;
        if(!targetGrado) return alert("Por favor elige el grado para esta tecnología.");
        finalGrupoId = null; 
    } else {
        if(!grp) return alert("Por favor selecciona un grupo.");
    }

    if(!email || !mat) return alert("Por favor selecciona maestro y materia.");

    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Vinculando...';
    try {
        // Verificar existencia previa
        let checkExist = supabaseClient.from('asignaciones_maestros').select('id')
            .eq('docente_email', email).eq('materia', mat);
        
        if(finalGrupoId) checkExist = checkExist.eq('grupo_id', finalGrupoId);
        else checkExist = checkExist.eq('target_grado', targetGrado);

        const { data: exist } = await checkExist;
        if(exist && exist.length > 0) throw new Error("Ya existe esta vinculación.");

        const { error: insErr } = await supabaseClient.from('asignaciones_maestros').insert([{ 
            docente_email: email, 
            docente_nombre: document.getElementById('selAsigMaestroBase').options[document.getElementById('selAsigMaestroBase').selectedIndex]?.text.split(' (')[0],
            materia: mat, 
            grupo_id: finalGrupoId,
            target_grado: targetGrado,
            plantel_id: state.plantelId
        }]);
        
        if(insErr) throw insErr;

        window.showToast("¡Éxito! Asignación consolidada" + (isTec ? " para todo el grado " + targetGrado : ""), "success");
        window.loadGruposDeMaestro(email);

    } catch(e) { 
        console.error("Error en vinculación:", e);
        window.showToast("Error: " + e.message, "error"); 
    } finally { 
        btn.disabled = false; 
        btn.innerHTML = orig; 
    }
};

window.selectAlumnoExpediente = (id, nombre, matricula) => {
    const panel = document.getElementById('panelExpedienteAlumno');
    if(!panel) return;
    document.getElementById('currentExpedienteAlumnoId').value = id;
    document.getElementById('currentExpedienteNombre').value = nombre;
    document.getElementById('currentExpedienteMatricula').value = matricula;
    document.getElementById('tituloExpediente').innerText = `Expediente: ${nombre}`;
    panel.style.display = 'block';
    window.loadExpedienteDocs(id);
};

window.loadExpedienteDocs = async (aluId) => {
    const folders = ['acta', 'curp', 'certificado', 'boleta'];
    try {
        const folder = aluId.toString();
        // Usar cliente administrativo para listar archivos y evitar bloqueos RLS
        const { data: files, error } = await supaAdmin.storage.from('expedientes').list(folder);
        
        if(error) {
            console.error("Error cargando expedientes:", error);
            return;
        }

        // 1. PROCESAR DOCUMENTOS FIJOS
        for(const f of ['acta', 'curp', 'certificado']) {
            const badge = document.getElementById('badge-' + f);
            const cont = document.getElementById('ver-' + f + '-container');
            const btnVer = document.getElementById('btn-ver-' + f);
            if(!badge) continue;

            const exists = files?.find(x => x.name === f + '.pdf');
            if(exists) {
                badge.innerText = 'Cargado';
                badge.className = 'badge badge-success';
                badge.style.background = '#dcfce7'; 
                badge.style.color = '#166534';
                if(cont) cont.style.display = 'flex';
                const { data: url } = supaAdmin.storage.from('expedientes').getPublicUrl(`${folder}/${f}.pdf`);
                if(btnVer) btnVer.href = url.publicUrl;
                const btnDel = document.getElementById('btn-del-' + f);
                if(btnDel) btnDel.onclick = () => window.eliminarExpedienteDoc(aluId, f + '.pdf');
            } else {
                badge.innerText = 'Pendiente';
                badge.style.background = 'var(--page-bg)';
                badge.style.color = 'var(--text-muted)';
                if(cont) cont.style.display = 'none';
            }
        }

        // 2. PROCESAR MÚLTIPLES BOLETAS
        const listBoletas = document.getElementById('listado-boletas');
        if(listBoletas) {
            const boletas = files?.filter(x => x.name.startsWith('boleta_')) || [];
            if(boletas.length === 0) {
                listBoletas.innerHTML = '<p style="font-size:0.7rem; color:var(--text-muted); text-align:center; padding:10px;">Sin boletas cargadas</p>';
            } else {
                listBoletas.innerHTML = boletas.map(b => {
                    const displayName = b.name.replace('boleta_', '').replace('.pdf', '').replace(/_/g, ' ');
                    const { data: url } = supaAdmin.storage.from('expedientes').getPublicUrl(`${folder}/${b.name}`);
                    return `
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:6px; background:white; border-radius:6px; margin-bottom:4px; border:1px solid var(--border);">
                            <span style="font-size:0.75rem; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:80px;" title="${displayName}">${displayName}</span>
                            <div style="display:flex; gap:4px;">
                                <a href="${url.publicUrl}" target="_blank" class="btn btn-outline btn-xs" style="padding:2px 6px;"><i class="fa-solid fa-eye"></i></a>
                                <button class="btn btn-outline btn-xs" style="padding:2px 6px; border-color:var(--danger); color:var(--danger)" onclick="window.eliminarExpedienteDoc('${aluId}', '${b.name}')"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    } catch(e) { console.error("Error en loadExpedienteDocs:", e); }
};

window.eliminarExpedienteDoc = async (aluId, fileName) => {
    if(!confirm(`¿Estás seguro de eliminar este documento (${fileName})?`)) return;
    
    try {
        const folder = aluId.toString();
        const { error } = await supaAdmin.storage.from('expedientes').remove([`${folder}/${fileName}`]);
        
        if(error) throw error;
        
        alert("Archivo eliminado con éxito.");
        window.loadExpedienteDocs(aluId); // Recargar vista
    } catch(e) {
        console.error("Error eliminando archivo:", e);
        alert("Error al eliminar: " + e.message);
    }
};

window.uploadExpedienteDoc = async (input, type) => {
    const file = input.files[0];
    if(!file) return;
    
    const aluId = document.getElementById('currentExpedienteAlumnoId').value;
    if(!aluId) return alert("Error: No se ha seleccionado un alumno.");

    const card = input.closest('.doc-card');
    const btn = card ? card.querySelector('.btn-doc') : null;
    const orig = btn ? btn.innerHTML : 'Subir';
    
    if(btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subiendo...';
    }

    try {
        const folder = aluId.toString();
        
        let finalFileName = `${type}.pdf`;
        
        // LÓGICA PARA MÚLTIPLES BOLETAS
        if(type === 'boleta') {
            const desc = prompt("Nombre descriptivo para esta boleta (ej: Bimestre 1, Evaluación Sept):", "Evaluacion");
            if(!desc) {
               btn.disabled = false;
               btn.innerHTML = orig;
               return; // Cancelado por usuario
            }
            // Limpiar nombre para evitar caracteres raros
            const cleanDesc = desc.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            finalFileName = `boleta_${cleanDesc}.pdf`;
        }

        // CREACIÓN DINÁMICA DEL CLIENTE ADMIN PARA FORZAR BYPASS RLS
        console.log(">>> INICIANDO SUBIDA ADMINISTRATIVA PARA:", finalFileName);
        const { data, error } = await supaAdmin.storage.from('expedientes').upload(`${folder}/${finalFileName}`, file, { upsert: true });
        
        if (error) throw error;

        alert('"EXITO" Archivo guardado');
        window.loadExpedienteDocs(aluId);
    } catch(err) {
        console.error(">>> ERROR CRÍTICO STORAGE:", err);
        alert("Fallo definitivo: " + (err.message || "Error desconocido"));
    } finally {
        if(btn) {
            btn.disabled = false;
            btn.innerHTML = orig;
        }
        input.value = "";
    }
};



window.diagnosticarStorage = async (auto = false) => {
    const resDiv = document.getElementById('resDiagStorage');
    if(!resDiv) return;
    resDiv.style.display = 'block';
    
    try {
        const { data: buckets, error: errB } = await supabaseClient.storage.listBuckets();
        const idProy = SUPABASE_URL.split('//')[1].split('.')[0];
        
        if(errB) {
            const msg = `FATAL: No hay conexión con el proyecto ${idProy}. Error: ${errB.message}`;
            resDiv.innerHTML = `<span style="color:red; font-weight:bold;">${msg}</span>`;
            return;
        }

        const nombres = buckets.map(b => b.name);
        const tieneExp = nombres.includes('expedientes');
        
        let report = `<b>ID Proyecto:</b> <span style="color:blue">${idProy}</span>\n`;
        report += `<b>Carpetas Detectadas:</b> ${nombres.join(', ') || 'NINGUNA'}\n`;
        
        if(tieneExp) { 
            report += `<span style="color:green; font-weight:bold;">✓ CARPETA 'expedientes' LISTA PARA USAR.</span>`; 
        } else { 
            report += `<span style="color:#d97706;">⌛ Intentando crear carpeta 'expedientes' por ti...</span>\n`;
            resDiv.innerHTML = report.replace(/\n/g, '<br>');
            
            // Intento de auto-creación
            const { error: errCreate } = await supabaseClient.storage.createBucket('expedientes', { public: true });
            
            if(errCreate) {
                report += `<span style="color:red; font-weight:bold;">X NO PUEDO CREARLA AUTOMÁTICAMENTE (Permiso denegado).</span>\n`;
                report += `<div style="margin-top:10px; border:2px dashed #faad14; padding:10px; background:#fffbe6;">`;
                report += `<b>TIENES QUE HACER ESTE ÚLTIMO PASO MANUAL:</b><br>`;
                report += `1. Ve a tu panel de Supabase: <a href="https://supabase.com/dashboard/project/${idProy}/storage/buckets" target="_blank" style="color:blue; font-weight:bold;">CLIC AQUÍ PARA IR AL STORAGE</a><br>`;
                report += `2. Clic en <b>"New Bucket"</b>.<br>`;
                report += `3. Nombre: <b>expedientes</b><br>`;
                report += `4. Marca <b>"Public"</b> y pulsa <b>Save</b>.</div>`;
            } else {
                report += `<span style="color:green; font-weight:bold;">✓ ¡ÉXITO! He creado la carpeta por ti. Ya puedes subir archivos.</span>`;
            }
        }
        resDiv.innerHTML = report.replace(/\n/g, '<br>');
    } catch(e) { resDiv.innerHTML = 'Error de sistema: ' + e.message; }
};


// Initial Render Hook
const _oldRenderApp = renderApp;
renderApp = () => {
    if(window._prefScanner) { window._prefScanner.stop().catch(()=>{}); window._prefScanner = null; }
    if(window._mScanner) { window._mScanner.stop().catch(()=>{}); window._mScanner = null; }
    _oldRenderApp();
    // Ciclo de vida del Escáner de Prefectura
    if(state.path === '/apoyo/prefectura') { 
        // No auto-iniciar, el usuario elige modo, pero aseguramos estado limpio
        if(window.initPortalAsistenciaEstado) window.initPortalAsistenciaEstado(); 
    } else {
        // Apagar cámara si salimos de Prefectura
        if(window._prefScanner) { window.stopPrefScanner(); }
    }
    if(state.path === '/maestro/encuadre') { window.renderRubros(); }
    if(state.path === '/alumno/timeline') { window.loadTimelineAlumno(); }
    if(state.path === '/alumno/boletas') { window.loadBoletasAlumno(); }
};

// Bootstrap Application
// Bootstrap Application (Safe Mode)
const startApp = async () => {
    console.log(">>> BOOTSTRAP: Iniciando motor de edu-lm (v106)...");
    const app = document.getElementById('app');
    
    try {
        const client = window.supabaseInstance || (window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null);
        
        if (client) {
            const { data: { session } } = await client.auth.getSession();
            
            if (session && session.user) {
                console.group(">>> AUTH: Sesión Activa");
                console.log("Usuario:", session.user.email);
                state.user = session.user;

                // 1. Obtener Autorización Oficial (Fuente de Verdad)
                const { data: allowed } = await client.from('perfiles_permitidos')
                    .select('*')
                    .ilike('email', session.user.email)
                    .maybeSingle();
                
                // 2. Obtener Perfil de la Aplicación
                const { data: profile } = await client.from('perfiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .maybeSingle();
                
                // 3. Resolución de Rol y Datos (Jerarquía Estricta)
                let rawRole = allowed?.rol || profile?.rol || session.user.user_metadata?.rol || 'alumno';
                let finalName = profile?.nombre || allowed?.nombre || session.user.user_metadata?.nombre || session.user.email;
                let finalPlantel = profile?.plantel_id || allowed?.plantel_id;

                // Normalización Crítica (Unificación de Sinónimos)
                if (esAdmin(rawRole) || rawRole === 'administrativo' || rawRole === 'admin') rawRole = 'admin';
                if (rawRole === 'maestro' || rawRole === 'maestro') rawRole = 'maestro';

                // 4. LIMPIEZA PROFUNDA: Sincronizar Metadatos y Perfil si hay discrepancias
                if (allowed) {
                    const needsMetadataSync = (session.user.user_metadata?.rol !== allowed.rol);
                    const needsProfileSync = (!profile || profile.rol !== allowed.rol || profile.plantel_id !== allowed.plantel_id);

                    if (needsMetadataSync || needsProfileSync) {
                        console.warn(">>> SEGURIDAD: Detectada desincronía de identidad. Corrigiendo...");
                        
                        let syncRole = allowed.rol;
                        if(syncRole === 'maestro') syncRole = 'maestro';
                        if(syncRole === 'administrativo' || syncRole === 'admin') syncRole = 'admin';

                        // Sincronizar Perfil DB
                        await client.from('perfiles').upsert([{
                            id: session.user.id,
                            rol: syncRole,
                            nombre: allowed.nombre,
                            plantel_id: allowed.plantel_id
                        }]);

                        // Sincronizar Metadatos JWT
                        await client.auth.updateUser({
                            data: {
                                rol: syncRole,
                                nombre: allowed.nombre,
                                plantel_id: allowed.plantel_id
                            }
                        });
                        
                        // Forzar el rol correcto en el estado actual
                        rawRole = syncRole;
                    }
                }

                state.role = rawRole;
                state.userName = finalName;
                state.plantelId = finalPlantel;
                state.schoolConfigured = true;

                console.log("Rol Final:", state.role, "| Plantel:", state.plantelId);
                console.groupEnd();
                
                window.renderApp(); 
            } else {
                console.log(">>> AUTH: No hay sesión, mostrando Landing.");
                state.schoolConfigured = false;
                window.renderApp();
            }
        }
    } catch (err) {
        console.error(">>> BOOTSTRAP ERROR:", err);
        app.innerHTML = `<h2>Error al iniciar sistema</h2><p>${err.message}</p>`;
    }
};

// Reemplazar window.login para que use la misma lógica de normalización
window.login = (role) => {
    let normRole = role;
    if (normRole === 'admin') normRole = 'admin';
    state.role = normRole;
    state.schoolConfigured = true;
    window.renderApp();
};

window.cambiarTabPersonal = (tab, btnEl) => {
    window._activePersonalTab = tab;
    document.querySelectorAll('#tabsPersonalAdmin .btn-tab-personal').forEach(b => {
        b.style.background = 'transparent';
        b.style.border = 'none';
        b.style.color = 'var(--text-muted)';
    });
    btnEl.style.background = 'white';
    btnEl.style.border = '1px solid var(--border)';
    btnEl.style.color = 'var(--text-main)';
    
    // Recuperar búsqueda actual
    const searchInput = document.getElementById('busquedaPersonalAutorizado');
    const searchValue = searchInput ? searchInput.value : '';
    window.loadListasAdminPersonal(searchValue);
};

window.loadListasAdminPersonal = async (searchTerm = '') => {
    const tbody = document.getElementById('tbodyPersonalAdmin');
    const totalCont = document.getElementById('totalPersonalCounter');
    if(!tbody) return;

    if (!window._activePersonalTab) window._activePersonalTab = 'admin';

    try {
        const currentPlantelID = state.plantelId || 'general';
        let query = supabaseClient.from('perfiles_permitidos')
            .select('*')
            .neq('rol', 'alumno')
            .eq('plantel_id', currentPlantelID);
        
        if (searchTerm) {
            query = query.or(`nombre.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
        }
        
        const { data: allStaff, error } = await query.order('nombre');

        if(error) throw error;

        totalCont.innerText = allStaff.length;
        
        // Filtro local de las pestañas
        let tabRoles = [];
        if(window._activePersonalTab === 'admin') {
            tabRoles = ['admin'];
        } else if(window._activePersonalTab === 'maestro') {
            tabRoles = ['maestro'];
        } else if(window._activePersonalTab === 'apoyo') {
            tabRoles = ['apoyo'];
        } else if(window._activePersonalTab === 'directivo') {
            tabRoles = ['directivo'];
        }

        const filteredStaff = allStaff.filter(p => tabRoles.includes(p.rol));

        if(filteredStaff.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted)">No hay personal registrado en esta categoría.</td></tr>';
            return;
        }

        let html = '';
        filteredStaff.forEach(p => {
            const roleLabels = { 'admin': 'Administrador', 'maestro': 'Maestro', 'apoyo': 'Apoyo', 'directivo': 'Directivo', 'alumno': 'Alumno' };
            const roleClass = (p.rol === 'admin' || p.rol === 'directivo') ? 'badge-primary' : 
                              (p.rol === 'maestro' ? 'badge-success' : 
                              (p.rol === 'alumno' ? 'badge-warning' : 'badge-outline'));
            const statusLabel = p.estado === 'activo' ? '<span style="color:var(--success)">● Activo</span>' : '<span style="color:var(--warning)">○ Pendiente</span>';
            
            html += `
                <tr style="border-bottom:1px solid var(--border)">
                    <td style="padding:12px;">
                        <div style="font-weight:700; color:var(--primary); font-size:1rem;">${p.nombre || 'Sin nombre registrado'}</div>
                        <div style="font-size:0.8rem; color:var(--text-muted); font-family:monospace;">${p.email}</div>
                    </td>
                    <td style="padding:12px; font-size:0.85rem; color:var(--text-muted)">
                        ${statusLabel}
                        <div style="font-size:0.7rem;">Desde: ${new Date(p.created_at).toLocaleDateString()}</div>
                    </td>
                    <td style="padding:12px; text-align:center;">
                        <span class="badge ${roleClass}">${roleLabels[p.rol] || p.rol}</span>
                    </td>
                    <td style="padding:12px; text-align:center;">
                        <button class="btn btn-outline btn-xs" 
                                style="color:var(--danger); border-color:var(--danger);" 
                                onclick="window.eliminarPersona('${p.id}', '${p.email}', '${p.nombre}')">
                            <i class="fa-solid fa-trash-can"></i> Quitar Permiso
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;

    } catch(err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--danger)">Error al cargar lista: ${err.message}</td></tr>`;
    }
};

window.eliminarPersona = async (idPermitido, email, nombre) => {
    if(!confirm(`⚠️ ¿Deseas ELIMINAR AHORA a "${nombre}" (${email})? Esta acción revocará todos sus accesos inmediatamente.`)) return;

    try {
        // Borrar de perfiles permitidos
        const { error: errPerm } = await supabaseClient.from('perfiles_permitidos').delete().eq('id', idPermitido);
        if(errPerm) throw errPerm;

        // Borrar el perfil si ya existe (usamos email o nombre?)
        // Es mejor buscar por email en perfiles_permitidos si lo tuviéramos relacionado, 
        // pero aquí buscaremos en perfiles por nombre como aproximación o email si existiera.
        // Dado el esquema, buscaremos perfiles que tengan ese correo (si el campo existiera) 
        // o por el ID en auth que el trigger debería haber manejado.
        
        // Pero lo más seguro es que si borramos de perfiles_permitidos, 
        // ya no podrá entrar. Para limpiar el perfil actual:
        const { data: pExist } = await supabaseClient.from('perfiles').select('id').eq('nombre', nombre).maybeSingle();
        if(pExist) {
            await supabaseClient.from('perfiles').delete().eq('id', pExist.id);
        }

        window.showToast("Personal eliminado y acceso revocado.", "success");
        if(window.loadListasAdminPersonal) window.loadListasAdminPersonal();
    } catch(err) {
        console.error(err);
        alert("Fallo al eliminar: " + err.message);
    }
};

window.resetEstadoEncuadre = async () => {
    const sel = document.getElementById('encuadreGrupoMateria');
    if(!sel.value) return;
    if(!confirm('🚨 ATENCIÓN: Reinicio Total\n\nEsto borrará los avisos en el perfil de los alumnos y todas las firmas recibidas hasta ahora para esta materia.\n\n¿Deseas continuar?')) return;

    const [idPart, mat] = sel.value.split('|');
    const isTec = idPart.startsWith('grado:');
    const gid = isTec ? null : idPart;
    const targetGrado = isTec ? idPart.replace('grado:', '') : null;

    try {
        // 1. Obtener ID del encuadre específico para el trimestre actual
        let qEnc = supabaseClient.from('encuadres')
            .select('id, maestro_id')
            .eq('materia', mat)
            .eq('trimestre', window.currentTrimestre || 1);

        if(isTec) qEnc = qEnc.is('grupo_id', null).eq('target_grado', targetGrado);
        else qEnc = qEnc.eq('grupo_id', gid);
        
        const { data: encData } = await qEnc.maybeSingle();

        if(encData) {
            // 2. Borrar firmas
            await supabaseClient.from('firmas_encuadre').delete().eq('encuadre_id', encData.id);

            // 3. Borrar comunicados relacionados a este trimestre específico
            const labelTri = (window.currentTrimestre || 1) + "° Trimestre";
            const { data: coms } = await supabaseClient.from('comunicados')
                .select('id')
                .eq('autor_id', encData.maestro_id)
                .ilike('titulo', `%${mat}%`)
                .ilike('titulo', `%${labelTri}%`);
            
            if(coms && coms.length > 0) {
                const cIds = coms.map(c => c.id);
                await supabaseClient.from('comunicados_vistos').delete().in('comunicado_id', cIds);
                await supabaseClient.from('comunicados').delete().in('id', cIds);
            }

            // 4. Resetear estado del encuadre
            await supabaseClient.from('encuadres').update({ 
                notificacion_enviada: false, 
                fecha_envio_notif: null 
            }).eq('id', encData.id);
        }

        alert("✅ Reinicio completado. El sistema está limpio para un nuevo envío.");
        window.cargarEncuadreActivo(); // Refrescar UI
    } catch (e) {
        console.error(e);
        alert("Error en reinicio: " + e.message);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}

window.crearCitatorioPrueba = async (studentId) => {
    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) return alert("Sesión expirada");
        
        const { error } = await supabaseClient.from('comunicados').insert([{
            autor_id: u.data.user.id,
            titulo: "CITATORIO DE PRUEBA (SOPORTE)",
            mensaje: "Este es un aviso de prueba generado para verificar el funcionamiento de la pestaña de firmas y citatorios. Si estás viendo esto, el sistema de visualización está operando correctamente.",
            audiencia: "Alumno_" + studentId,
            plantel_id: state.plantelId
        }]);
        
        if(error) throw error;
        
        alert("✅ Citatorio de prueba creado. El expediente se recargará ahora.");
        if(window.showAlumnoExpediente) window.showAlumnoExpediente(studentId);
        
    } catch(e) {
        console.error(e);
        alert("Error al crear prueba: " + e.message);
    }
};


/** HORARIOS MODULE (v133) **/

window.renderAdminHorarios = () => {
    setTimeout(window.loadHorariosAdmin, 100);
    return `
        <div class="page-container">
            <h2 class="page-title"><i class="fa-solid fa-calendar-days"></i> Gestión de Horarios</h2>
            <p class="page-subtitle">Sube los horarios en PDF y asígnalos a grados o grupos específicos.</p>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-top:30px;">
                <!-- Formulario -->
                <div class="card">
                    <h3 style="margin-top:0"><i class="fa-solid fa-cloud-arrow-up"></i> Nuevo Horario</h3>
                    <div class="form-group">
                        <label>Nombre del Horario (Ej: 1°A Matutino)</label>
                        <input type="text" id="horarioNombre" class="form-input" placeholder="Nombre descriptivo">
                    </div>
                    <div class="form-group">
                        <label>Asignar a Grupo (Opcional)</label>
                        <select id="horarioGrupoId" class="form-input">
                            <option value="">-- Todos los Grupos --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Grado (Opcional)</label>
                        <select id="horarioGrado" class="form-input">
                            <option value="">-- Todos los Grados --</option>
                            <option value="1">1° Grado</option>
                            <option value="2">2° Grado</option>
                            <option value="3">3° Grado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Archivo PDF</label>
                        <input type="file" id="horarioFile" class="form-input" accept=".pdf">
                    </div>
                    <button class="btn btn-primary btn-block" onclick="window.guardarHorario()">
                        <i class="fa-solid fa-save"></i> Guardar y Subir
                    </button>
                </div>

                <!-- Lista de Horarios -->
                <div class="card">
                    <h3 style="margin-top:0"><i class="fa-solid fa-table-list"></i> Horarios Registrados</h3>
                    <div id="listaHorariosContenedor" style="display:flex; flex-direction:column; gap:12px;">
                        <p style="text-align:center; opacity:0.5;">Cargando horarios...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.loadHorariosAdmin = async () => {
    try {
        // Cargar grupos para el select
        const { data: grupos } = await supabaseClient.from('grupos').select('id, nombre, turno').order('nombre');
        const sel = document.getElementById('horarioGrupoId');
        if(sel && grupos) {
            sel.innerHTML = '<option value="">-- Todos los Grupos --</option>' + 
                grupos.map(g => `<option value="${g.id}">${g.nombre} - ${g.turno}</option>`).join('');
        }

        const { data, error } = await supabaseClient.from('horarios').select('*, grupos(nombre, turno)');
        if(error) throw error;
        
        const cont = document.getElementById('listaHorariosContenedor');
        if(!cont) return;

        if(!data || data.length === 0) {
            cont.innerHTML = '<p style="text-align:center; padding:20px; opacity:0.5;">No hay horarios registrados.</p>';
            return;
        }

        cont.innerHTML = data.map(h => `
            <div style="padding:16px; border:1px solid var(--border); border-radius:12px; display:flex; justify-content:space-between; align-items:center; background:white;">
                <div>
                    <div style="font-weight:700; color:var(--primary);">${h.nombre}</div>
                    <div style="font-size:0.8rem; opacity:0.7;">
                        ${h.grupos ? `Grupo: ${h.grupos.nombre}` : (h.grado ? `Grado: ${h.grado}°` : 'General')}
                    </div>
                </div>
                <div style="display:flex; gap:8px;">
                    <a href="${h.archivo_url}" target="_blank" class="btn btn-xs" style="background:#f1f5f9; color:var(--text-main);">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    <button class="btn btn-xs btn-primary" onclick="window.notificarEstudiantesHorario('${h.id}')" title="Notificar a Estudiantes">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                    <button class="btn btn-xs btn-danger" onclick="window.eliminarHorario('${h.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

    } catch(e) { console.error(e); }
};

window.guardarHorario = async () => {
    const nombre = document.getElementById('horarioNombre').value;
    const gid = document.getElementById('horarioGrupoId').value;
    const grado = document.getElementById('horarioGrado').value;
    const fileInput = document.getElementById('horarioFile');
    const file = fileInput.files[0];

    if(!nombre || !file) return alert("Ingresa un nombre y selecciona un archivo PDF.");

    window.showToast("Subiendo horario...", "info");

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `horario_${Date.now()}.${fileExt}`;
        const filePath = `horarios/${fileName}`;

        const { error: uploadError } = await supabaseClient.storage
            .from('horarios')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabaseClient.storage
            .from('horarios')
            .getPublicUrl(filePath);

        const { error: insertError } = await supabaseClient.from('horarios').insert([{
            nombre: nombre,
            archivo_url: publicUrl,
            grado: grado || null,
            grupo_id: gid || null,
            plantel_id: state.plantelId
        }]);

        if (insertError) throw insertError;

        window.showToast("Horario guardado correctamente.", "success");
        window.loadHorariosAdmin();
        document.getElementById('horarioNombre').value = '';
        fileInput.value = '';

    } catch(e) {
        console.error(e);
        alert("Error al subir horario: " + e.message);
    }
};

window.eliminarHorario = async (id) => {
    if(!confirm("¿Estás seguro de eliminar este horario?")) return;
    try {
        const { error } = await supabaseClient.from('horarios').delete().eq('id', id);
        if(error) throw error;
        window.loadHorariosAdmin();
    } catch(e) { console.error(e); }
};

window.notificarEstudiantesHorario = async (id) => {
    try {
        const { data: h } = await supabaseClient.from('horarios').select('*').eq('id', id).single();
        if(!h) return;

        let aud = 'Publico';
        if(h.grupo_id) aud = `Grupo_${h.grupo_id}`;
        else if(h.grado) aud = `Grado_${h.grado}`;

        await supabaseClient.from('comunicados').insert([{
            autor_id: state.user.id,
            titulo: '📅 NUEVO HORARIO DE CLASE DISPONIBLE',
            mensaje: `Se ha publicado un nuevo horario: ${h.nombre}. Ya puedes consultarlo en tu sección de "Mi Horario".`,
            audiencia: aud,
            plantel_id: state.plantelId
        }]);

        window.showToast("Notificación enviada a los estudiantes.", "success");
    } catch(e) { console.error(e); }
};

/** STUDENT HORARIO VIEW **/

window.renderAlumnoHorario = () => {
    setTimeout(window.loadMiHorario, 100);
    return `
        <div class="mobile-app" style="background:var(--page-bg)">
            <div class="mobile-header" style="text-align:center; padding: 24px 20px; background:var(--primary); color:white;">
                <h2 style="margin:0">Mi Horario</h2>
                <p style="margin:5px 0 0 0; opacity:0.8; font-size:rem;">Consulta tus clases y horarios</p>
            </div>
            <div class="mobile-content" style="padding:20px;">
                <div id="miHorarioContenedor">
                    <p style="text-align:center; opacity:0.5; padding:40px;">Buscando horarios asignados...</p>
                </div>
            </div>
        </div>
    `;
};

window.loadMiHorario = async () => {
    const cont = document.getElementById('miHorarioContenedor');
    if(!cont) return;

    try {
        const uRes = await supabaseClient.auth.getUser();
        const { data: alu } = await supabaseClient.from('alumnos').select('*').eq('contacto_email', uRes.data.user.email).maybeSingle();
        
        if(!alu) {
            cont.innerHTML = '<p style="text-align:center; padding:20px;">No se encontró tu registro de alumno.</p>';
            return;
        }

        // Buscar por grupo o grado o general
        const { data, error } = await supabaseClient.from('horarios')
            .select('*')
            .or(`grupo_id.eq.${alu.grupo_id},grado.eq.${alu.grado_estudios},and(grupo_id.is.null,grado.is.null)`)
            .order('creado_en', { ascending: false });

        if(error) throw error;

        if(!data || data.length === 0) {
            cont.innerHTML = `
                <div style="text-align:center; padding:60px 20px; opacity:0.4;">
                    <i class="fa-solid fa-calendar-xmark fa-3x"></i>
                    <p style="margin-top:15px; font-weight:600;">Aún no hay un horario cargado para tu grupo.</p>
                </div>
            `;
            return;
        }

        cont.innerHTML = data.map(h => `
            <div class="card" style="padding:24px; border-radius:20px; border:none; box-shadow: 0 10px 25px rgba(0,0,0,0.05); margin-bottom:20px; background:white;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <span style="font-size:0.7rem; font-weight:900; color:var(--primary); text-transform:uppercase; letter-spacing:1px; background:var(--primary)15; padding:6px 12px; border-radius:12px;">
                        <i class="fa-solid fa-clock"></i> Horario Escolar
                    </span>
                    <span style="font-size:0.75rem; color:var(--text-muted);">${new Date(h.creado_en).toLocaleDateString()}</span>
                </div>
                <h3 style="margin:0 0 8px 0; font-size:1.3rem; font-weight:900;">${h.nombre}</h3>
                <p style="margin:0 0 24px 0; font-size:0.9rem; color:var(--text-muted); line-height:1.5;">Haz clic en el botón de abajo para ver el archivo PDF con la distribución de tus clases.</p>
                
                <a href="${h.archivo_url}" target="_blank" class="btn btn-primary btn-block" style="border-radius:14px; padding:16px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:10px;">
                    <i class="fa-solid fa-file-pdf"></i> Ver Horario (PDF)
                </a>
            </div>
        `).join('');

    } catch(e) {
        console.error(e);
        cont.innerHTML = '<p>Error al cargar el horario.</p>';
    }
};

