// Global Configuration & Branding (VERSIÓN UNIVERSAL v112 - HUMANIZACIÓN FORZADA)
const CONFIG = {
  appName: "Edu-LM",
  schoolName: "Portal Educativo"
};

// Supabase Configuration
console.log("%c>>> EDU-LM V112 UNIVERSAL CARGADA: VIGILANCIA HUMANA ACTIVA", "color: yellow; background: black; padding: 12px; font-weight: 1000; border: 2px solid yellow;");
const SUPABASE_URL = "https://yphflvrvfcqazqdqdfgg.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaGZsdnJ2ZmNxYXpxZHFkZmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODg0NjMsImV4cCI6MjA5MTI2NDQ2M30.-Y5pwEHhmcXPuyh0gYALNTaMMAyK7Dm883Fohq3DtV0";
const SUPABASE_KEY = SUPABASE_ANON_KEY;

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
// supabaseClient eliminado por seguridad (V112 Blindada)

// Global State
const ADMIN_ROLES = ['admin', 'administrativo', 'master'];
const esAdmin = (rol) => ADMIN_ROLES.includes(rol);

let _state = {
  role: null, 
  user: null,
  userName: '',
  isMaster: false,
  plantelId: null,
  path: '/',
  schoolConfigured: false,
  cameraMode: 'environment'
};

window.toggleCameraMode = () => {
  state.cameraMode = (state.cameraMode === 'environment') ? 'user' : 'environment';
  window.showToast(`Cámara cambiada a: ${state.cameraMode === 'environment' ? 'Trasera' : 'Frontal'}`, "info");
  
  // Reiniciar escáner activo si existe
  if(window._mScanner) { window.startMaestroQR(); }
  if(window._prefScanner) { window.startPrefScanner(window.prefScanMode || 'metralleta'); }
  
  const evalModal = document.getElementById('modalQREvaluacion');
  if(evalModal && evalModal.style.display === 'flex' && window._lastEvalParams) {
      window.abrirQREvaluacion(...window._lastEvalParams);
  }
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
  if(document.body.classList.contains('sidebar-open')) {
      document.body.classList.remove('sidebar-open');
  }
  renderApp();
};

window.toggleSidebar = () => {
    document.body.classList.toggle('sidebar-open');
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
    else if(role === 'admin') state.path = '/admin/maestros';
    else if(role === 'directivo') state.path = '/directivo/autorizaciones';
    else if(role === 'maestro') state.path = '/maestro/aula';
    else if(role === 'apoyo') state.path = '/apoyo/dashboard';
    else if(role === 'alumno') state.path = '/alumno/credencial';
    else if(role === 'biblioteca') state.path = '/biblioteca/dashboard';
    
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
  const passwordInput = document.getElementById('fb-password');
  const btn = document.querySelector('.btn-login');
  const errorMsg = document.getElementById('auth-error-msg');
  
  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';
  
  if(!email || !password) {
    if(errorMsg) errorMsg.innerText = 'Correo y contraseña requeridos.';
    return;
  }
  
  if(btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando...';
  }

  try {
    // 1. Intento de Login Oficial (Primero validamos que la cuenta exista en Supabase Auth)
    const { data: authData, error: authErr } = await supabaseClient.auth.signInWithPassword({ email, password });
    
    if (authErr) {
        if (authErr.message === 'Invalid login credentials') {
            throw new Error('Credenciales incorrectas. Verifique su correo y contraseña.');
        }
        throw authErr;
    }

    // 2. Recuperar el perfil real de la base de datos para ver quién es
    let { data: profile, error: profErr } = await supabaseClient
        .from('perfiles')
        .select('*, planteles(id, nombre)')
        .eq('id', authData.user.id)
        .maybeSingle();

    // 3. Verificación de Autorización
    // Es válido si: Es el Master (marcado en DB) O el correo dueño (fallback) O está en el padrón
    const isMasterByDB = profile?.es_master || profile?.rol === 'master';
    const isMasterByEmail = (email === 'zlagustin10@gmail.com');
    const isMasterUser = isMasterByDB || isMasterByEmail;
    
    console.log(">>> [AUTH DEBUG]", { isMasterByDB, isMasterByEmail, profileFound: !!profile });

    if (!isMasterUser) {
        // Validación estricta de escuela
        if (state.plantelId) {
            if (profile) {
                // El usuario ya existe, verificar que pertenezca a la escuela seleccionada
                if (profile.plantel_id !== state.plantelId) {
                    await supabaseClient.auth.signOut();
                    throw new Error(`Tu cuenta no pertenece a esta escuela (${CONFIG.schoolName || 'seleccionada'}).`);
                }
            } else {
                // Es un usuario nuevo (o sin perfil), verificar en perfiles_permitidos para ESTA escuela
                const { data: allowed } = await supabaseClient
                    .from('perfiles_permitidos')
                    .select('*')
                    .ilike('email', email)
                    .eq('plantel_id', state.plantelId)
                    .maybeSingle();

                if (!allowed) {
                    await supabaseClient.auth.signOut();
                    throw new Error(`No estás registrado en esta escuela (${CONFIG.schoolName || 'seleccionada'}) o tu correo es incorrecto.`);
                }
                
                // Si estaba permitido, creamos el perfil vinculado a la escuela actual
                const newProf = {
                    id: authData.user.id,
                    rol: allowed.rol,
                    nombre: allowed.nombre,
                    plantel_id: allowed.plantel_id
                };
                await supabaseClient.from('perfiles').upsert(newProf);
                profile = newProf; // Asignar para el paso 4
            }
        } else {
            // Lógica original de respaldo (si no hay escuela seleccionada)
            const { data: allowed } = await supabaseClient
                .from('perfiles_permitidos')
                .select('*')
                .ilike('email', email)
                .maybeSingle();

            if (!allowed && !profile) {
                await supabaseClient.auth.signOut();
                throw new Error('Su cuenta no tiene autorización activa para acceder a ningún plantel.');
            }
            
            if (!profile && allowed) {
                const newProf = {
                    id: authData.user.id,
                    rol: allowed.rol,
                    nombre: allowed.nombre,
                    plantel_id: allowed.plantel_id
                };
                await supabaseClient.from('perfiles').upsert(newProf);
                profile = newProf; // Asignar para el paso 4
            }
        }
    }

    // 4. Sincronizar Estado Global
    const finalProfile = profile || { rol: 'invitado' }; // Fallback de seguridad
    state.user = authData.user;
    state.isMaster = isMasterUser;
    state.role = isMasterUser ? 'master' : profile?.rol;
    state.userName = profile?.nombre || authData.user.email;
    state.plantelId = profile?.plantel_id || state.plantelId;
    
    if (isMasterUser) {
        CONFIG.schoolName = 'Administración Global SaaS';
    }

    window.showToast(`Bienvenido(a), ${state.userName}`, 'success');
    window.login(state.role);

  } catch (err) {
    console.error(">>> LOGIN ERROR:", err);
    if(errorMsg) {
        errorMsg.innerText = err.message;
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

window.activarLoginMaster = () => {
    state.schoolConfigured = true;
    CONFIG.schoolName = 'Acceso Restringido SaaS';
    state.isMasterMode = true;
    renderApp();
};

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
               <div style="padding:12px; border: 1.5px solid #e2e8f0; border-radius:12px; background:#f8fafc; cursor:pointer;" onclick="window.activarLoginMaster()">
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
                <div class="form-group" style="margin-bottom:20px;">
                    <label class="form-label" style="font-weight:600; margin-bottom:8px; display:block;">Tu Correo Institucional</label>
                    <input type="email" id="setupCorreo" class="form-input" 
                           style="height:60px; text-align:center; border-radius:12px; font-size:16px;" 
                           placeholder="director@escuela.com"
                           inputmode="email" autocomplete="email">
                </div>
                <div class="form-group" style="margin-bottom:32px;">
                    <label class="form-label" style="font-weight:600; margin-bottom:8px; display:block;">Crea tu Contraseña de Acceso</label>
                    <input type="password" id="setupPass" class="form-input" 
                           style="height:60px; text-align:center; border-radius:12px; font-size:16px;" 
                           placeholder="Mínimo 6 caracteres..."
                           autocomplete="new-password">
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
    const pas = document.getElementById('setupPass').value.trim();

    if(!esc || !dir || !cor || !pas) return alert("Por favor completa todos los campos, incluyendo la contraseña.");
    if(pas.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");
    
    if(btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';
    }

    try {
        // 1. Preparamos la base de datos (crea escuela y da permiso al correo)
        const { data: prepData, error: prepErr } = await supabaseClient.rpc('preparar_registro_director', {
            p_email: cor,
            p_nombre_director: dir,
            p_nombre_escuela: esc
        });
        if (prepErr) throw prepErr;
        if (prepData && prepData.success === false) throw new Error(prepData.error);

        // 2. Creamos al usuario OFICIALMENTE en Supabase (Esto evita el "Invalid credentials")
        const { data: authData, error: authErr } = await supabaseClient.auth.signUp({
            email: cor,
            password: pas,
            options: {
                data: { nombre: dir, rol: 'directivo', plantel_id: prepData.plantel_id }
            }
        });

        if(authErr) {
            // Si ya existía de un intento anterior, simplemente iniciamos sesión
            if (authErr.message.toLowerCase().includes("already registered")) {
                const { error: loginErr } = await supabaseClient.auth.signInWithPassword({ email: cor, password: pas });
                if(loginErr) throw loginErr;
            } else {
                throw authErr;
            }
        }

        // 3. Aseguramos que su perfil público exista
        const userId = (await supabaseClient.auth.getUser()).data.user?.id;
        if (userId) {
            await supabaseClient.from('perfiles').upsert({
                id: userId,
                nombre: dir,
                rol: 'directivo',
                plantel_id: prepData.plantel_id
            });
        }

        window.showToast("¡Plantel registrado con éxito!", "success");

        // Recargamos para entrar fresco
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch(e) { 
        console.error("Setup Error:", e);
        alert("Error en Setup: " + e.message); 
        if(btn) {
            btn.disabled = false;
            btn.innerHTML = 'Finalizar Registro';
        }
    }
};

window.checkSchoolSetup = async () => {
    // Si startApp ya está en proceso o terminó, no interferir
    if(state.schoolConfigured !== null && state.role !== null) return;
    
    // REGLA DE ORO: Priorizar sesión REAL sobre parches locales
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    try {
        // 1. Ver si hay un usuario logueado
        if(session && session.user) {
            const { data: profile } = await supabaseClient.from('perfiles')
                .select('plantel_id, rol, nombre, es_master, planteles(id, nombre)')
                .eq('id', session.user.id)
                .maybeSingle();
            
            const isActuallyMaster = profile?.es_master || profile?.rol === 'master';

            if(!profile || (!isActuallyMaster && !profile.planteles)) {
                console.warn(">>> [SEGURIDAD] Sesión huérfana detectada. Limpiando...");
                await supabaseClient.auth.signOut();
                state.schoolConfigured = false;
                await renderApp();
                return;
            }

            state.user = session.user;
            state.userName = profile.nombre || session.user.email;
            state.isMaster = isActuallyMaster;
            
            // NORMALIZACIÓN DE ROL
            let normRole = isActuallyMaster ? 'master' : profile.rol;
            if (['admin', 'administrativo'].includes(normRole)) normRole = 'admin';

            state.role = normRole; 
            state.plantelId = profile.plantel_id;
            
            if (isActuallyMaster) {
                CONFIG.schoolName = 'Administración Global SaaS';
            } else {
                CONFIG.schoolName = profile.planteles?.nombre || 'Edu-LM';
            }
            
            state.schoolConfigured = true;

            // DETERMINAR RUTA SEGÚN ROL RECUPERADO
            if(state.role === 'master') state.path = '/master/saas';
            else if(state.role === 'directivo') state.path = '/directivo/autorizaciones';
            else if(state.role === 'admin') state.path = '/admin/maestros';
            else if(state.role === 'maestro') state.path = '/maestro/aula';
            else if(state.role === 'apoyo') state.path = '/apoyo/dashboard';
            else if(state.role === 'alumno') state.path = '/alumno/credencial';
            else if(state.role === 'biblioteca') state.path = '/biblioteca/dashboard';

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
        
        <div class="form-group" style="text-align:left; margin-bottom:15px;">
          <label class="form-label">Correo Electrónico</label>
          <input type="email" id="fb-email" class="form-input" 
                 placeholder="ejemplo@escuela.edu.mx" 
                 inputmode="email" 
                 autocomplete="email" 
                 style="font-size:16px; height:50px;">
        </div>

        <div class="form-group" style="text-align:left; margin-bottom:20px;">
          <label class="form-label">Contraseña</label>
          <input type="password" id="fb-password" class="form-input" 
                 placeholder="********" 
                 style="font-size:16px; height:50px;"
                 autocomplete="current-password">
        </div>

        <div id="auth-error-msg" style="color:var(--danger); font-size:0.85rem; text-align:center; min-height:20px; margin-bottom:12px; font-weight:500;"></div>

        <div style="margin-bottom:20px;">
          <button class="btn btn-primary" style="width:100%; border-radius:12px; height:60px; font-size:1.1rem; font-weight:700; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);" onclick="window.handleLogin()">
            <i class="fa-solid fa-right-to-bracket"></i> Acceder al Portal
          </button>
        </div>

        <div style="text-align:center; padding:15px; border-top:1px dashed #e2e8f0; margin-top:10px; ${state.isMasterMode ? 'display:none;' : ''}">
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

function renderSetPasswordScreen() {
  return `
    <div class="role-selector-view">
      <div class="card shadow-lg" style="width:100%; max-width:420px; padding:40px; border-radius:30px; text-align:center;">
        <h2 style="color:var(--primary); margin-bottom:15px; font-weight:900;">Configura tu Acceso</h2>
        <p style="color:var(--text-muted); margin-bottom:25px; font-size:0.95rem;">Hola, por favor establece tu nueva contraseña para poder entrar al portal.</p>
        
        <div class="form-group" style="text-align:left;">
          <label class="form-label">Nueva Contraseña</label>
          <input type="password" id="new-p1" class="form-input" placeholder="Mínimo 6 caracteres" style="height:50px;">
        </div>

        <div class="form-group" style="text-align:left; margin-bottom:25px;">
          <label class="form-label">Confirmar Contraseña</label>
          <input type="password" id="new-p2" class="form-input" placeholder="Repite la contraseña" style="height:50px;">
        </div>

        <button class="btn btn-primary" style="width:100%; height:55px; border-radius:12px; font-weight:700;" onclick="window.saveNewPassword()">
          <i class="fa-solid fa-lock"></i> Guardar y Continuar
        </button>
      </div>
    </div>
  `;
}

window.saveNewPassword = async () => {
    const p1 = document.getElementById('new-p1').value.trim();
    const p2 = document.getElementById('new-p2').value.trim();
    if(!p1 || p1.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");
    if(p1 !== p2) return alert("Las contraseñas no coinciden.");

    const btn = event.currentTarget;
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

    try {
        const { error } = await supabaseClient.auth.updateUser({ password: p1 });
        if(error) throw error;
        
        alert("¡Contraseña configurada con éxito! Ya puedes iniciar sesión.");
        window.location.hash = "";
        state.isUpdatingPassword = false;
        state.role = null; 
        renderApp();
    } catch(e) {
        alert("Error al actualizar: " + e.message);
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }
}

window.handleMagicLink = async () => {
    const email = document.getElementById('fb-email').value.trim();
    if(!email) return alert("Escribe tu correo primero.");
    
    const errDiv = document.getElementById('auth-error-msg');
    try {
        const { error } = await supabaseClient.from('perfiles_permitidos')
            .select('email').eq('email', email).maybeSingle();
        
        // Excepción Maestra: Master puede entrar aunque no esté en una escuela
        if (!state.isMaster && (!error)) {
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
  if (['admin', 'administrativo'].includes(userRole)) userRole = 'admin';
  if (userRole === 'maestro') userRole = 'maestro';

  const menus = {
    master: [
      { name: 'Administración SaaS', path: '/master/saas', icon: 'fa-globe' },
      ...(state.plantelId ? [
          { type: 'divider', text: `Gestionando: ${CONFIG.schoolName}` },
          { name: 'Directorio de Gestión', path: '/master/gestion-perfiles', icon: 'fa-address-book' }
      ] : [])
    ],
    admin: [
      { name: 'Maestros y Materias', path: '/admin/maestros', icon: 'fa-chalkboard-user' },
      { name: 'Grupos y Asignación', path: '/admin/grupos', icon: 'fa-users-gear' },
      { name: 'Inscripción', path: '/admin/inscripcion', icon: 'fa-user-plus' },
      { name: 'Expediente Digital', path: '/admin/expediente', icon: 'fa-folder-open' },
      { name: 'Horarios de Clase', path: '/admin/horarios', icon: 'fa-calendar-days' },
      { name: 'Calendario de Evaluación', path: '/admin/calendario', icon: 'fa-calendar-check' },
      { name: 'Boletas y Calificaciones', path: '/admin/calificaciones', icon: 'fa-star-half-stroke' },
      { name: 'Trámites y Constancias', path: '/admin/tramites', icon: 'fa-file-signature' },
      { name: 'Comunicados Oficiales', path: '/admin/comunicados', icon: 'fa-bullhorn' },
    ],
    maestro: [
      { name: 'Gestión de Aula y Pase de Lista', path: '/maestro/aula', icon: 'fa-users-rectangle' },
      { name: 'Actividades', path: '/maestro/actividades', icon: 'fa-clipboard-list' },
      { name: 'Listas y Seguimiento', path: '/maestro/listas', icon: 'fa-list-check' },
      { name: 'Encuadre', path: '/maestro/encuadre', icon: 'fa-sliders' },
      { name: 'Subir Calificaciones', path: '/maestro/calificaciones', icon: 'fa-cloud-arrow-up' },
      { name: 'Aula de Medios', path: '/maestro/aula-medios', icon: 'fa-desktop' },
      { name: 'Bitácora de Maestro', path: '/maestro/bitacora', icon: 'fa-book-journal-whills' },
      { name: 'Reportes Escolares', path: '/maestro/reportes', icon: 'fa-file-signature' },
      { name: 'Avisos Oficiales', path: '/maestro/comunicados', icon: 'fa-bullhorn' },
    ],
    apoyo: [
      { name: 'Focos Rojos', path: '/apoyo/dashboard', icon: 'fa-triangle-exclamation' },
      { name: 'Riesgo Académico', path: '/apoyo/riesgo', icon: 'fa-user-graduate' },
      { name: 'Reportes Escolares', path: '/apoyo/reportes', icon: 'fa-file-signature' },
      { name: 'Expediente Salud', path: '/apoyo/salud', icon: 'fa-notes-medical' },
      { name: 'Estudio Biopsicosocial', path: '/apoyo/psicosocial', icon: 'fa-brain' },
      { name: 'Bitácora Diaria', path: '/apoyo/bitacora', icon: 'fa-book-journal-whills' },
      { name: 'Escáner Entrada', path: '/apoyo/prefectura', icon: 'fa-qrcode' },
      { name: 'Escáner de Salida', path: '/apoyo/ts_escaner', icon: 'fa-person-walking-arrow-right' },
      { name: 'Avisos Oficiales', path: '/apoyo/comunicados', icon: 'fa-bullhorn' },
    ],
    directivo: [
      { name: 'Autorizaciones', path: '/directivo/autorizaciones', icon: 'fa-stamp' },
      { name: 'Gestión de Personal', path: '/directivo/gestion-personal', icon: 'fa-id-card-clip' },
      { name: 'Comunicados Oficiales', path: '/directivo/comunicados', icon: 'fa-bullhorn' }
    ],
    alumno: [
      { name: 'Credencial Digital', path: '/alumno/credencial', icon: 'fa-id-card' },
      { name: 'Boletas y Calificaciones', path: '/alumno/boletas', icon: 'fa-star-half-stroke' },
      { name: 'Avisos y Timeline', path: '/alumno/timeline', icon: 'fa-bell' },
      { name: 'Mi Horario', path: '/alumno/horario', icon: 'fa-calendar-days' },
      { name: 'Trámites Escolares', path: '/alumno/tramites', icon: 'fa-file-pdf' },
    ],
    biblioteca: [
      { name: 'Préstamos y Control', path: '/biblioteca/dashboard', icon: 'fa-book-bookmark' },
      { name: 'Historial de Préstamos', path: '/biblioteca/historial', icon: 'fa-calendar-days' },
      { name: 'Reservaciones de Aula', path: '/biblioteca/reservas', icon: 'fa-calendar-plus' },
      { name: 'Bitácora', path: '/biblioteca/bitacora', icon: 'fa-book-journal-whills' },
      { name: 'Avisos Oficiales', path: '/biblioteca/comunicados', icon: 'fa-bullhorn' }
    ]
  };


  // Protección: Si el rol no existe en el menú, usar Alumno por defecto
  const menuList = menus[userRole] ? [...menus[userRole]] : [...menus['alumno']];

  const navItems = menuList.map(item => {
    if (item.type === 'divider') {
      return `<div style="padding:15px 20px 8px; font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.12em; font-weight:800; border-top:1px solid rgba(0,0,0,0.05); margin-top:8px;">${item.text}</div>`;
    }
    
    let badgeHtml = '';
    if (item.icon === 'fa-bullhorn' || item.icon === 'fa-bell') {
        badgeHtml = `<span id="notif-badge-avisos" style="display:none; margin-left:auto; background:var(--danger); color:white; font-size:0.65rem; padding:2px 6px; border-radius:10px; font-weight:bold;"></span>`;
    }

    return `
      <a class="nav-item ${state.path === item.path ? 'active' : ''}" onclick="window.navigate('${item.path}')">
        <div style="display:flex; align-items:center; width:100%;">
          <i class="fa-solid ${item.icon} w-5 text-center" style="margin-right:8px;"></i>
          <span>${item.name}</span>
          ${badgeHtml}
        </div>
      </a>
    `;
  }).join('');

  const roleNames = { master: 'Creador del Sistema', admin: 'Admin', directivo: 'Directivo', maestro: 'Maestro', apoyo: 'Trabajo Social', alumno: 'Estudiante', administrativo: 'Admin', biblioteca: 'Biblioteca / Aula Medios' };

  const userName = (state.isMaster) ? 'M.C Luis Miguel Ponce Herrera' : (state.userName || state.user?.user_metadata?.nombre || state.user?.email || 'Usuario');
  const shortName = (state.isMaster) ? 'Luis Miguel' : userName.split(' ').slice(0, 2).join(' ');

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
            <input type="text" id="grupoInput" class="form-input" placeholder="Ej. A o 101" maxlength="10">
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
             <input type="text" id="promSourceGrupo" class="form-input" placeholder="Ej. A o 101" style="padding:6px">
          </div>
          <div style="padding-bottom:10px; color:var(--text-muted);"><i class="fa-solid fa-arrow-right"></i></div>
          <div class="form-group" style="margin:0">
             <label style="font-size:0.7rem; color:var(--text-muted);">Nuevo Grado</label>
             <input type="text" id="promTargetGrado" class="form-input" list="gradoList" placeholder="2°" style="padding:6px">
          </div>
          <div class="form-group" style="margin:0">
             <label style="font-size:0.7rem; color:var(--text-muted);">Nuevo Grupo</label>
             <input type="text" id="promTargetGrupo" class="form-input" placeholder="Ej. A o 101" style="padding:6px">
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
    let sGrado = document.getElementById('promSourceGrado').value.trim();
    let sGrupo = document.getElementById('promSourceGrupo').value.trim();
    let tGrado = document.getElementById('promTargetGrado').value.trim();
    let tGrupo = document.getElementById('promTargetGrupo').value.trim();

    if(!sGrado || !sGrupo || !tGrado || !tGrupo) return alert('Por favor completa todos los campos de origen y destino.');

    const formatearGrupo = (grado, grupo) => {
        let g = grado.replace(/[^0-9]/g, ''); 
        let l = grupo.trim().toUpperCase();
        return `${g}°${l}`;
    };

    const sourceNom = formatearGrupo(sGrado, sGrupo);
    const targetNom = formatearGrupo(tGrado, tGrupo);
    tGrado = tGrado.replace(/[^0-9]/g, '') + '°';

    const isDirectivo = state.role === 'directivo';
    const confirmMsg = isDirectivo 
        ? `⚠️ ¿Deseas ejecutar AHORA la promoción de TODOS los alumnos de ${sourceNom} a ${targetNom}?`
        : `⚠️ ¿Deseas SOLICITAR LA PROMOCIÓN de todos los alumnos de ${sourceNom} a ${targetNom}? El Directivo deberá autorizar este cambio.`;

    if(!confirm(confirmMsg)) return;

    try {
        if (isDirectivo) {
            // Acción directa para Directivos
            const { data: sData, error: sError } = await supabaseClient.from('grupos').select('id').ilike('nombre', sourceNom).eq('plantel_id', state.plantelId).maybeSingle();
            if(sError) throw sError;
            if(!sData) return alert(`No se encontró el grupo "${sourceNom}"`);

            let targetId;
            const { data: tData } = await supabaseClient.from('grupos').select('id').ilike('nombre', targetNom).eq('plantel_id', state.plantelId).maybeSingle();
            if(tData) targetId = tData.id;
            else {
                const { data: nG, error: eG } = await supabaseClient.from('grupos').insert([{ nombre: targetNom, plantel_id: state.plantelId }]).select().single();
                if(eG) throw eG;
                targetId = nG.id;
            }

            const { error: errUpdate } = await supabaseClient.from('alumnos').update({ grupo_id: targetId, grado: tGrado }).eq('grupo_id', sData.id);
            if(errUpdate) throw errUpdate;

            alert(`✅ ¡Éxito! Alumnos de ${sourceNom} promovidos a ${targetNom}.`);
        } else {
            // Solicitud para Admins
            const { error: errReq } = await supabaseClient.from('autorizaciones_movimientos').insert([{
                plantel_id: state.plantelId,
                tipo_accion: 'PROMOCIÓN MASIVA',
                detalles: `Mover grupo ${sourceNom} a ${targetNom}`,
                estado: 'pendiente',
                payload_json: {
                    action: 'promover_grupo',
                    sourceNom: sourceNom,
                    targetNom: targetNom,
                    tGrado: tGrado
                }
            }]);
            if(errReq) throw errReq;
            window.showToast("Solicitud de promoción masiva enviada al Directivo.", "info");
        }

        // Limpiar campos
        document.getElementById('promSourceGrado').value = '';
        document.getElementById('promSourceGrupo').value = '';
        document.getElementById('promTargetGrado').value = '';
        document.getElementById('promTargetGrupo').value = '';

    } catch(e) { 
        console.error(e); 
        alert('Error: ' + e.message); 
    }
};

window.graduarGeneracion = async () => {
    const grado = document.getElementById('gradoGraduacion').value.trim();
    if(!grado) return alert('Por favor indica el grado que se va a graduar.');

    const isDirectivo = state.role === 'directivo';
    const confirmMsg = isDirectivo 
        ? `🚨 ATENCIÓN: Esta acción eliminará permanentemente a TODOS los alumnos de ${grado}° y revocará sus accesos. ¿Estas seguro?`
        : `⚠️ ¿Deseas SOLICITAR LA GRADUACIÓN MASIVA de ${grado}°? Esta acción requiere autorización del Directivo.`;

    if(!confirm(confirmMsg)) return;
    
    if (isDirectivo) {
        const confirmacionExtra = prompt(`Escribe "GRADUAR" para confirmar la baja masiva:`);
        if(confirmacionExtra !== 'GRADUAR') return;
    }

    try {
        if (isDirectivo) {
            // Acción directa
            const { data: grps } = await supabaseClient.from('grupos').select('id').ilike('nombre', `${grado}%`).eq('plantel_id', state.plantelId);
            if(!grps || grps.length === 0) throw new Error("No se encontraron grupos para ese grado.");
            const ids = grps.map(g => g.id);
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
        } else {
            // Solicitud para Admins
            const { error: errReq } = await supabaseClient.from('autorizaciones_movimientos').insert([{
                plantel_id: state.plantelId,
                tipo_accion: 'GRADUACIÓN MASIVA',
                detalles: `Baja permanente de todos los grupos de ${grado}°`,
                estado: 'pendiente',
                payload_json: {
                    action: 'graduar_generacion',
                    grado: grado
                }
            }]);
            if(errReq) throw errReq;
            window.showToast("Solicitud de graduación enviada al Directivo.", "info");
        }
        document.getElementById('gradoGraduacion').value = '';
    } catch(e) { console.error(e); alert('Error: ' + e.message); }
};

window.liveSearchGestion = async (q) => {
    const res = document.getElementById('resGestionGral');
    if(!res) return;
    if(q.length < 2) { res.style.display='none'; return; }
    try {
        const { data } = await supabaseClient.from('alumnos').select('*, grupos(nombre)').eq('plantel_id', state.plantelId).or(`nombre.ilike.%${q}%,matricula.ilike.%${q}%`).limit(50);
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
    const isDirectivo = state.role === 'directivo';
    const confirmMsg = isDirectivo 
        ? `⚠️ ¿Deseas dar de BAJA DEFINITIVA a ${nombre}?`
        : `⚠️ ¿Deseas SOLICITAR LA BAJA DEFINITIVA de ${nombre}? El Directivo deberá autorizar este movimiento.`;

    if(!confirm(confirmMsg)) return;

    try {
        if (isDirectivo) {
            const { data: alu } = await supabaseClient.from('alumnos').select('contacto_email').eq('id', id).single();
            const { error } = await supabaseClient.from('alumnos').delete().eq('id', id);
            if(error) throw error;
            if(alu && alu.contacto_email) {
                await supabaseClient.from('perfiles_permitidos').delete().eq('email', alu.contacto_email);
            }
            alert('Alumno dado de baja exitosamente.');
        } else {
            const { error: errReq } = await supabaseClient.from('autorizaciones_movimientos').insert([{
                plantel_id: state.plantelId,
                tipo_accion: 'BAJA DE ALUMNO',
                detalles: `Baja definitiva de student: ${nombre}`,
                estado: 'pendiente',
                payload_json: {
                    action: 'delete_alumno',
                    target_id: id,
                    nombre: nombre
                }
            }]);
            if(errReq) throw errReq;
            window.showToast("Solicitud de baja enviada al Directivo.", "info");
        }
        document.getElementById('resGestionGral').style.display = 'none';
        document.getElementById('inBuscarGestionGral').value = '';
    } catch(e) { console.error(e); alert('Error: ' + e.message); }
}

window.promoverGradoAlumno = async (id) => {
    const isDirectivo = state.role === 'directivo';
    const nuevoGrado = prompt('Ingresa el nuevo GRADO (ej. 2°, 3°):');
    if(!nuevoGrado) return;
    const nuevoGrupo = prompt('Ingresa el nuevo GRUPO (ej. A, B o 101):');
    if(!nuevoGrupo) return;
    
    const nombreCompletoGrupo = `${nuevoGrado}${nuevoGrupo}`;

    try {
        if (isDirectivo) {
            // 1. Buscar o crear el grupo
            let grId;
            const { data: gData } = await supabaseClient.from('grupos').select('id').eq('nombre', nombreCompletoGrupo).eq('plantel_id', state.plantelId).maybeSingle();
            if(gData) {
               grId = gData.id;
            } else {
               const { data: nG, error: eG } = await supabaseClient.from('grupos').insert([{ nombre: nombreCompletoGrupo, plantel_id: state.plantelId }]).select().single();
               if(eG) throw eG;
               grId = nG.id;
            }

            // 2. Actualizar el grupo_id del alumno
            const { error } = await supabaseClient.from('alumnos').update({ grupo_id: grId, grado: nuevoGrado }).eq('id', id);
            if(error) throw error;

            alert(`Alumno promovido exitosamente a ${nombreCompletoGrupo}.`);
        } else {
            // Solicitud para Admins
            const { error: errReq } = await supabaseClient.from('autorizaciones_movimientos').insert([{
                plantel_id: state.plantelId,
                tipo_accion: 'PROMOCIÓN INDIVIDUAL',
                detalles: `Promover alumno a: ${nombreCompletoGrupo}`,
                estado: 'pendiente',
                payload_json: {
                    action: 'promover_alumno',
                    target_id: id,
                    targetNom: nombreCompletoGrupo,
                    tGrado: nuevoGrado
                }
            }]);
            if(errReq) throw errReq;
            window.showToast("Solicitud de promoción enviada al Directivo.", "info");
        }
        document.getElementById('resGestionGral').style.display = 'none';
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

window.switchAdminCalificacionesTab = (tab) => {
    const btnConcentrado = document.getElementById('btn-tab-concentrado');
    const btnEstadisticas = document.getElementById('btn-tab-estadisticas');
    const btnFirmaQR = document.getElementById('btn-tab-firma-qr');
    
    const allBtns = [btnConcentrado, btnEstadisticas, btnFirmaQR].filter(Boolean);
    allBtns.forEach(b => { b.className = 'btn btn-outline'; b.style.background = 'white'; });

    const allViews = ['view-concentrado','view-estadisticas','view-firma-qr'];
    allViews.forEach(v => { const el = document.getElementById(v); if(el) el.style.display = 'none'; });

    if(tab === 'concentrado') {
        if(btnConcentrado) { btnConcentrado.className = 'btn btn-primary'; btnConcentrado.style.background = ''; }
        const el = document.getElementById('view-concentrado');
        if(el) el.style.display = 'flex';
    } else if(tab === 'estadisticas') {
        if(btnEstadisticas) { btnEstadisticas.className = 'btn btn-primary'; btnEstadisticas.style.background = ''; }
        const el = document.getElementById('view-estadisticas');
        if(el) el.style.display = 'flex';
        if(window.loadAdminEstadisticasFiltros) window.loadAdminEstadisticasFiltros();
    } else if(tab === 'firma-qr') {
        if(btnFirmaQR) { btnFirmaQR.className = 'btn btn-primary'; btnFirmaQR.style.background = ''; }
        const el = document.getElementById('view-firma-qr');
        if(el) el.style.display = 'flex';
        if(window.initFirmaBoletasQR) window.initFirmaBoletasQR();
    }
};

window.handleAlcanceEstadisticaChange = () => {
    const alcance = document.getElementById('adminAlcanceEstadisticaSel').value;
    const gradoContainer = document.getElementById('adminGradoEstadisticaContainer');
    const grupoContainer = document.getElementById('adminGrupoEstadisticaContainer');
    gradoContainer.style.display = 'none';
    grupoContainer.style.display = 'none';
    
    if(alcance === 'grado') {
        gradoContainer.style.display = 'block';
    } else if(alcance === 'grupo') {
        grupoContainer.style.display = 'block';
    }
};

function renderAdminCalificaciones() {
  setTimeout(() => { if (window.loadAdminCalificacionesFiltros) window.loadAdminCalificacionesFiltros(); }, 100);
  return `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
      <div>
          <h2 class="page-title">Monitor Curricular y Boletas</h2>
          <p class="page-subtitle">Revisión de avance de subida de calificaciones oficiales, y estadística académica.</p>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button id="btn-tab-concentrado" class="btn btn-primary" onclick="window.switchAdminCalificacionesTab('concentrado')"><i class="fa-solid fa-list-check"></i> Concentrado por Grupo</button>
          <button id="btn-tab-estadisticas" class="btn btn-outline" onclick="window.switchAdminCalificacionesTab('estadisticas')" style="background:white;"><i class="fa-solid fa-chart-pie"></i> Estadística de Aprobación</button>
          <button id="btn-tab-firma-qr" class="btn btn-outline" onclick="window.switchAdminCalificacionesTab('firma-qr')" style="background:white;"><i class="fa-solid fa-qrcode"></i> Firma por QR</button>
      </div>
    </div>

    <!-- VISTA 1: CONCENTRADO POR GRUPO -->
    <div id="view-concentrado" style="display:flex; gap:24px; flex-wrap:wrap;">
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
         <div style="margin-top:20px; padding-top:20px; border-top:1px dashed var(--border); position:relative;">
            <h4 style="margin-bottom:10px; font-size:0.9rem;"><i class="fa-solid fa-file-pdf"></i> Impresión de Boleta Individual (PDF)</h4>
            <div class="form-group">
                <input type="text" id="adminSearchAlumnoDownload" class="form-input" placeholder="Nombre del alumno..." onkeyup="window.liveSearchAlumnoCalificaciones(this.value)">
                <div id="resSearchAlumnoDownload" style="display:none; background:white; border:1px solid var(--border); border-radius:8px; margin-top:5px; max-height:200px; overflow-y:auto; position:absolute; width: 100%; z-index: 100; box-shadow: var(--shadow-lg);"></div>
            </div>
         </div>
      </div>
      
      <!-- Bloque: Revisión Detallada por Grupo -->
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

    <!-- VISTA 2: ESTADISTICAS DE APROBACIÓN -->
    <div id="view-estadisticas" style="display:none; gap:24px; flex-wrap:wrap;">
      <div class="card" style="flex:1; min-width:320px; align-self: flex-start;">
         <h3 style="margin-bottom:12px">Filtros Estadísticos</h3>
         <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">Configura los filtros para visualizar la estadística de aprobación y reprobación.</p>
         
         <div class="form-group">
            <label class="form-label">Trimestre</label>
            <select class="form-select" id="adminTrimestreEstadisticaSel">
                <option value="Todos">Todos los Trimestres</option>
                <option value="1">Trimestre 1</option>
                <option value="2">Trimestre 2</option>
                <option value="3">Trimestre 3</option>
            </select>
         </div>
         
         <div class="form-group">
            <label class="form-label">Alcance</label>
            <select class="form-select" id="adminAlcanceEstadisticaSel" onchange="window.handleAlcanceEstadisticaChange()">
                <option value="escuela">Toda la Escuela</option>
                <option value="grado">Por Grado</option>
                <option value="grupo">Por Grupo</option>
            </select>
         </div>

         <div class="form-group" id="adminGradoEstadisticaContainer" style="display:none;">
            <label class="form-label">Grado</label>
            <select class="form-select" id="adminGradoEstadisticaSel">
                <option value="1°">1° Grado</option>
                <option value="2°">2° Grado</option>
                <option value="3°">3° Grado</option>
            </select>
         </div>

         <div class="form-group" id="adminGrupoEstadisticaContainer" style="display:none;">
            <label class="form-label">Grupo</label>
            <select class="form-select" id="adminGrupoEstadisticaSel">
               <option value="">Cargando grupos...</option>
            </select>
         </div>

         <button class="btn btn-primary" style="width:100%; margin-top:10px;" onclick="window.generarEstadisticaAprobacion()">
            <i class="fa-solid fa-chart-bar"></i> Generar Estadística
         </button>
      </div>

      <div class="card" style="flex:3; min-width:400px; width: 100%;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="margin:0;">Dashboard Académico</h3>
          <button class="btn btn-success btn-sm" onclick="window.descargarEstadisticaCSV()" id="btnDownloadEstadisticaCSV" style="display:none;">
             <i class="fa-solid fa-file-csv"></i> Exportar CSV
          </button>
        </div>
        
        <div id="estadisticasDashboardContent" style="min-height:300px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
           <i class="fa-solid fa-chart-line" style="font-size:3rem; color:var(--border); margin-bottom:15px;"></i>
           <p style="color:var(--text-muted);">Selecciona los filtros y haz clic en "Generar Estadística" para visualizar los datos.</p>
        </div>
      </div>
    </div>

    <!-- VISTA 3: FIRMA POR QR -->
    <div id="view-firma-qr" style="display:none; gap:24px; flex-wrap:wrap;">
      <!-- Panel Izquierdo: Escáner Rápido -->
      <div class="card" style="flex:1; min-width:320px; align-self:flex-start;">
        <h3 style="margin-bottom:8px;"><i class="fa-solid fa-bolt" style="color:#d97706;"></i> Escáner Rápido de Firma</h3>
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px;">Selecciona el trimestre y escanea. El aviso se envía <strong>automáticamente</strong> al padre/tutor.</p>
        
        <div class="form-group" style="margin-bottom:12px;">
          <label class="form-label" style="font-size:0.8rem;">Trimestre activo</label>
          <select class="form-select" id="firmaTrimestreSel" style="font-weight:700; font-size:1rem; border:2px solid var(--primary);">
            <option value="Trimestre 1">Trimestre 1</option>
            <option value="Trimestre 2">Trimestre 2</option>
            <option value="Trimestre 3">Trimestre 3</option>
          </select>
        </div>

        <div id="firmaQrReader" style="width:100%; border-radius:12px; overflow:hidden; border:2px solid var(--border);"></div>
        <p id="firmaQrStatus" style="text-align:center; font-size:0.85rem; color:var(--text-muted); margin-top:10px; min-height:20px;"></p>

        <!-- Log de escaneos rápidos -->
        <div id="firmaQrScanLog" style="margin-top:12px; max-height:250px; overflow-y:auto;"></div>

        <!-- Hidden info panel para compatibilidad -->
        <div id="firmaAlumnoInfo" style="display:none;">
          <span id="firmaAlumnoNombre"></span>
          <span id="firmaAlumnoGrupo"></span>
          <span id="firmaTrimNombrePreview"></span>
        </div>
      </div>

      <!-- Panel Derecho: Historial de Firmas Registradas -->
      <div class="card" style="flex:2; min-width:360px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <h3 style="margin:0;"><i class="fa-solid fa-clock-rotate-left" style="color:var(--primary);"></i> Historial de Firmas</h3>
          <div style="display:flex; gap:10px; align-items:center;">
             <select class="form-select" id="firmaFiltroGrupo" onchange="window.loadHistorialFirmas()" style="padding:4px 8px; font-size:0.85rem; border-radius:6px; min-width:120px;">
                <option value="">Todos los grupos</option>
             </select>
             <button class="btn btn-outline btn-sm" onclick="window.loadHistorialFirmas()"><i class="fa-solid fa-rotate-right"></i> Actualizar</button>
          </div>
        </div>
        <div id="firmaHistorialContainer">
          <p style="text-align:center; color:var(--text-muted); padding:30px 0;"><i class="fa-solid fa-signature" style="font-size:2.5rem; display:block; margin-bottom:10px; opacity:0.3;"></i>Las firmas registradas aparecerán aquí.</p>
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
    if(!window._activePersonalTab) window._activePersonalTab = 'directivo';
    if(window.loadListasAdminPersonal) window.loadListasAdminPersonal();
    if(window.initEventosAdminMaestros) window.initEventosAdminMaestros();
    if(window.loadSelectsMaestros) await window.loadSelectsMaestros();
    if(window.loadFiltrosAlumnosDinamicos) await window.loadFiltrosAlumnosDinamicos();
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
            <option value="biblioteca">Biblioteca / Aula de Medios</option>
          </select>
        </div>

        <button class="btn btn-primary" id="btnGuardarMaestroSolo" style="width:100%">
          <i class="fa-solid fa-floppy-disk"></i> Registrar Personal
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

        <div id="tabsPersonalAdmin" style="display:flex; background:var(--page-bg); padding:4px; border-radius:10px; gap:4px; border:1px solid var(--border); margin-bottom: 12px; width: max-content; overflow-x: auto; max-width:100%;">
            <button class="btn btn-sm btn-tab-personal ${window._activePersonalTab === 'directivo' || !window._activePersonalTab ? 'active' : ''}" onclick="window.cambiarTabPersonal('directivo', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:${window._activePersonalTab === 'directivo' || !window._activePersonalTab ? 'white' : 'transparent'}; border:${window._activePersonalTab === 'directivo' || !window._activePersonalTab ? '1px solid var(--border)' : 'none'}; cursor:pointer; color:${window._activePersonalTab === 'directivo' || !window._activePersonalTab ? 'var(--text-main)' : 'var(--text-muted)'}">Directivos</button>
            <button class="btn btn-sm btn-tab-personal ${window._activePersonalTab === 'maestro' ? 'active' : ''}" onclick="window.cambiarTabPersonal('maestro', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:${window._activePersonalTab === 'maestro' ? 'white' : 'transparent'}; border:${window._activePersonalTab === 'maestro' ? '1px solid var(--border)' : 'none'}; cursor:pointer; color:${window._activePersonalTab === 'maestro' ? 'var(--text-main)' : 'var(--text-muted)'}">Maestros</button>
            <button class="btn btn-sm btn-tab-personal ${window._activePersonalTab === 'admin' ? 'active' : ''}" onclick="window.cambiarTabPersonal('admin', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:${window._activePersonalTab === 'admin' ? 'white' : 'transparent'}; border:${window._activePersonalTab === 'admin' ? '1px solid var(--border)' : 'none'}; cursor:pointer; color:${window._activePersonalTab === 'admin' ? 'var(--text-main)' : 'var(--text-muted)'}">Administrativos</button>
            <button class="btn btn-sm btn-tab-personal ${window._activePersonalTab === 'apoyo' ? 'active' : ''}" onclick="window.cambiarTabPersonal('apoyo', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:${window._activePersonalTab === 'apoyo' ? 'white' : 'transparent'}; border:${window._activePersonalTab === 'apoyo' ? '1px solid var(--border)' : 'none'}; cursor:pointer; color:${window._activePersonalTab === 'apoyo' ? 'var(--text-main)' : 'var(--text-muted)'}">Personal de Apoyo</button>
            <button class="btn btn-sm btn-tab-personal ${window._activePersonalTab === 'biblioteca' ? 'active' : ''}" onclick="window.cambiarTabPersonal('biblioteca', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:${window._activePersonalTab === 'biblioteca' ? 'white' : 'transparent'}; border:${window._activePersonalTab === 'biblioteca' ? '1px solid var(--border)' : 'none'}; cursor:pointer; color:${window._activePersonalTab === 'biblioteca' ? 'var(--text-main)' : 'var(--text-muted)'}">Biblioteca</button>
            <button class="btn btn-sm btn-tab-personal ${window._activePersonalTab === 'alumno' ? 'active' : ''}" onclick="window.cambiarTabPersonal('alumno', this)" style="padding:6px 12px; font-size:0.8rem; font-weight:bold; border-radius:6px; background:${window._activePersonalTab === 'alumno' ? 'white' : 'transparent'}; border:${window._activePersonalTab === 'alumno' ? '1px solid var(--border)' : 'none'}; cursor:pointer; color:${window._activePersonalTab === 'alumno' ? 'var(--text-main)' : 'var(--text-muted)'}">Alumnos</button>
        </div>

        <div id="subTabsAlumnos" style="display:none; gap:12px; align-items:center; margin-bottom:20px; background:var(--page-bg); padding:10px; border-radius:10px; border:1px solid var(--border);">
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">Grado:</div>
            <select id="selGradoAlumnoTab" class="form-input" style="width:105px; font-size:0.8rem; padding:4px 8px; margin:0;" onchange="window.loadListasAdminPersonal()">
                <option value="">Todos</option>
            </select>
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-left:10px;">Grupo:</div>
            <select id="selGrupoAlumnoTab" class="form-input" style="width:105px; font-size:0.8rem; padding:4px 8px; margin:0;" onchange="window.loadListasAdminPersonal()">
                <option value="">Todos</option>
            </select>
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
            <option value="Maestros">Maestros</option>
            <option value="Personal">Maestros, personal de apoyo y biblioteca</option>
            <option value="Alumnos">Alumnos</option>
            <option value="General">Toda la comunidad</option>
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

        // Mostrar comunicados generales (todos los valores posibles de audiencia institucional)
        query = query.in('audiencia', ['General', 'Todos', 'Maestros', 'Alumnos', 'Apoyo', 'Personal']);

        if(state.plantelId) {
            query = query.eq('plantel_id', state.plantelId);
        }

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
            'Todos':   'var(--primary)',
            'Maestros': '#8b5cf6',
            'Alumnos': 'var(--warning)',
            'Apoyo':   '#f97316',
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
        
        if (window.updateNotificationBadge) setTimeout(() => window.updateNotificationBadge(true), 1000);
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
             <button class="btn btn-info btn-xs" onclick="window.toggleCameraMode()" style="border-radius:20px; margin-left:10px;">
                <i class="fa-solid fa-camera-rotate"></i> Girar Cámara
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
          <div style="text-align:right; margin-bottom:10px;">
             <button class="btn btn-xs btn-info" onclick="window.toggleCameraMode()"><i class="fa-solid fa-camera-rotate"></i> Girar</button>
          </div>
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
      <p class="page-subtitle">Asienta las calificaciones definitivas por alumno y grupo. <span id="maestroDeadlineStatus" style="font-weight:bold; color:var(--success)">Cargando estatus del periodo...</span>.</p>
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
function renderApoyoRiesgoAcademico() {
  setTimeout(() => { if(window.loadApoyoRiesgoFiltros) window.loadApoyoRiesgoFiltros(); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Riesgo Académico</h2>
      <p class="page-subtitle">Identificación automática de alumnos con 3 o más materias reprobadas.</p>
    </div>

    <div style="display:flex; gap:24px; flex-wrap:wrap;">
      <div class="card" style="flex:1; min-width:320px; align-self:flex-start;">
         <h3 style="margin-bottom:12px"><i class="fa-solid fa-filter"></i> Filtros de Búsqueda</h3>
         
         <div class="form-group">
            <label class="form-label">Trimestre</label>
            <select class="form-select" id="riesgoTrimestreSel">
                <option value="Todos">Todos los Trimestres (Promedio general u orientativo)</option>
                <option value="1">Trimestre 1</option>
                <option value="2">Trimestre 2</option>
                <option value="3">Trimestre 3</option>
            </select>
         </div>

         <div class="form-group">
            <label class="form-label">Grado</label>
            <select class="form-select" id="riesgoGradoSel" onchange="window.handleRiesgoGradoChange()">
                <option value="Todos">Toda la Escuela</option>
                <option value="1°">1° Grado</option>
                <option value="2°">2° Grado</option>
                <option value="3°">3° Grado</option>
            </select>
         </div>

         <div class="form-group" id="riesgoGrupoContainer" style="display:none;">
            <label class="form-label">Grupo</label>
            <select class="form-select" id="riesgoGrupoSel">
               <option value="Todos">Todos los grupos del grado</option>
            </select>
         </div>

         <div class="form-group">
            <label class="form-label">Umbral de Alerta</label>
            <select class="form-select" id="riesgoUmbralSel">
                <option value="1-2">De 1 a 2 materias reprobadas</option>
                <option value="3+" selected>3 o más materias reprobadas</option>
            </select>
         </div>

         <button class="btn btn-primary" style="width:100%; margin-top:10px;" onclick="window.loadApoyoRiesgoData()">
            <i class="fa-solid fa-search"></i> Detectar Alumnos
         </button>
      </div>

      <div class="card" style="flex:3; min-width:400px; width:100%;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="margin:0;"><i class="fa-solid fa-triangle-exclamation" style="color:var(--danger);"></i> Alumnos en Riesgo</h3>
          <span id="riesgoTotalBadge" class="badge" style="background:var(--danger); color:white; display:none;">0 detectados</span>
        </div>
        
        <div id="riesgoDataContainer" style="min-height:300px;">
           <div style="text-align:center; padding:40px; color:var(--text-muted);">
             <i class="fa-solid fa-user-graduate" style="font-size:3rem; margin-bottom:15px; color:var(--border);"></i>
             <p>Ajusta los filtros y haz clic en "Detectar Alumnos".</p>
           </div>
        </div>
      </div>
    </div>
  `;
}

function renderApoyoDashboard() {
  setTimeout(() => { if(window.loadFocosRojos) window.loadFocosRojos(); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title" style="color: var(--danger)">Pantalla de Trabajo Social</h2>
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
        const { data } = await supabaseClient.from('alumnos').select('*, grupos(nombre)').eq('plantel_id', state.plantelId).or(`nombre.ilike.%${query}%,matricula.ilike.%${query}%`).limit(10);
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
  const isMaestro = state.role === 'maestro' || state.role === 'docente';
  const today = new Date().toLocaleDateString('en-CA');
  setTimeout(() => { 
      if(!isMaestro && window.loadCitatoriosApoyo) window.loadCitatoriosApoyo();
  }, 100);
  
  const subtitle = isMaestro ? 'Reportes de Incidencias Disciplinarias' : 'Personal de Apoyo | Triage y Mediación Escolar';
  
  const citatoriosBtn = isMaestro ? '' : `
        <button class="btn btn-outline" onclick="window.abrirModalCitatorio()" style="padding:10px 20px; border-radius:12px; font-weight:600; display:flex; align-items:center; gap:8px; border:1.5px solid var(--primary); color:var(--primary);">
            <i class="fa-solid fa-envelope-open-text"></i> Crear Citatorio
        </button>
  `;

  const citatoriosSection = isMaestro ? '' : `
        <!-- SECCIÓN 1: CITATORIOS VIGENTES -->
        <div class="card" style="width:100%; border-top:4px solid var(--warning);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
                <div>
                    <h3 style="margin-bottom:4px;"><i class="fa-solid fa-envelope-open-text text-warning"></i> Citatorios de Padres</h3>
                    <p style="font-size:0.85rem; color:var(--text-muted);">Seguimiento de firmas y atención a tutores.</p>
                </div>
                <button class="btn btn-outline btn-sm" onclick="window.loadCitatoriosApoyo()">
                    <i class="fa-solid fa-sync"></i> Actualizar
                </button>
            </div>
            <div id="contenedorCitatoriosApoyo" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:20px;">
                <div style="text-align:center; padding:30px; color:var(--text-muted); grid-column:1/-1;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando citatorios...</div>
            </div>
        </div>
  `;

  return `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
      <div>
        <h2 class="page-title">Incidencias y Conducta</h2>
        <p class="page-subtitle">${subtitle}</p>
      </div>
      <div style="display:flex; gap:12px; align-items:center;">
        ${citatoriosBtn}
        <button class="btn btn-primary" onclick="window.abrirModalReporteApoyo()" style="padding:10px 20px; border-radius:12px; font-weight:600; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-plus-circle"></i> Nuevo Reporte
        </button>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1fr; gap:30px; margin-top:20px;">
        ${citatoriosSection}
    </div>

    <!-- Modal de Creación de Reporte -->
    <div id="modalNuevoReporteApoyo" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; backdrop-filter:blur(4px);">
        <div class="card" style="max-width:500px; margin:50px auto; padding:25px; position:relative; box-shadow:var(--shadow-lg);">
            <button onclick="document.getElementById('modalNuevoReporteApoyo').style.display='none'" style="position:absolute; top:15px; right:15px; border:none; background:none; font-size:1.5rem; cursor:pointer; color:var(--text-muted)">&times;</button>
            <h3 style="margin-top:0;"><i class="fa-solid fa-file-signature"></i> Levantar Nuevo Reporte</h3>
            
            <div style="margin-top:20px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Buscar Alumno:</label>
                <input type="text" id="busquedaAlumnoApoyo" class="form-input" placeholder="Nombre o Matrícula..." onkeyup="window.buscarAlumnosReporteApoyo(this.value, 'reporte')" style="border-radius:10px;">
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

    <!-- Modal Nuevo Citatorio -->
    <div id="modalNuevoCitatorio" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; backdrop-filter:blur(4px);">
        <div class="card" style="max-width:500px; margin:50px auto; padding:25px; position:relative; box-shadow:var(--shadow-lg);">
            <button onclick="document.getElementById('modalNuevoCitatorio').style.display='none'" style="position:absolute; top:15px; right:15px; border:none; background:none; font-size:1.5rem; cursor:pointer; color:var(--text-muted)">&times;</button>
            <h3 style="margin-top:0; color:#856404;"><i class="fa-solid fa-envelope-circle-check"></i> Redactar Nuevo Citatorio</h3>
            
            <div style="margin-top:20px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Buscar Alumno:</label>
                <input type="text" id="busquedaAlumnoCitatorio" class="form-input" placeholder="Nombre o Matrícula..." onkeyup="window.buscarAlumnosReporteApoyo(this.value, 'citatorio')" style="border-radius:10px;">
                <div id="resultadosBusquedaCitatorio" style="max-height:150px; overflow-y:auto; border:1px solid var(--border); border-top:none; display:none; border-radius:0 0 10px 10px; background:white;"></div>
                <input type="hidden" id="alumnoIdCitatorio">
                <div id="alumnoSeleccionadoLabelCitatorio" style="margin-top:10px; display:none; padding:10px; background:#fffbeb; border-radius:10px; font-size:0.9rem; border-left:4px solid #f6e05e;"></div>
            </div>

            <div style="margin-top:15px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Fecha y Hora Sugerida (Opcional):</label>
                <input type="datetime-local" id="fechaCitaCitatorio" class="form-input" style="border-radius:10px;">
            </div>

            <div style="margin-top:15px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Motivo del Citatorio:</label>
                <textarea id="motivoCitatorio" class="form-input" placeholder="Ej: Junta para seguimiento académico o conductual..." style="height:120px; border-radius:10px; resize:none;"></textarea>
            </div>

            <div style="margin-top:25px; display:flex; gap:10px;">
                <button class="btn btn-outline" style="flex:1" onclick="document.getElementById('modalNuevoCitatorio').style.display='none'">Cancelar</button>
                <button class="btn" id="btnGuardarCitatorio" style="flex:1; background:#f97316; color:white; border:none;" onclick="window.guardarCitatorio()">Enviar Citatorio</button>
            </div>
        </div>
    </div>

    <!-- Modal de Atención a Citatorio / RESOLUCIÓN -->
    <div id="modalAtencionFoco" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; backdrop-filter:blur(4px);">
        <div class="card" style="max-width:600px; margin:40px auto; padding:25px; position:relative; box-shadow:var(--shadow-lg);">
            <button onclick="document.getElementById('modalAtencionFoco').style.display='none'" style="position:absolute; top:15px; right:15px; border:none; background:none; font-size:1.5rem; cursor:pointer; color:var(--text-muted)">&times;</button>
            <h3 style="margin-top:0; color:var(--success)"><i class="fa-solid fa-handshake"></i> Atención y Resolución de Incidencias</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">Documenta la junta con el padre de familia y los compromisos acordados.</p>
            
            <input type="hidden" id="atencionAlumnoId">
            <input type="hidden" id="atencionCitatorioId">
            <div id="atencionAlumnoNombre" style="padding:12px; background:var(--page-bg); border-radius:12px; font-weight:600; margin-bottom:20px; border-left:4px solid var(--success);"></div>

            <div style="margin-bottom:15px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Procedimiento de Atención:</label>
                <textarea id="atencionProcedimiento" class="form-input" placeholder="Detalla cómo se atendió al alumno..." style="height:100px; border-radius:10px; resize:none;"></textarea>
            </div>

            <div style="margin-bottom:20px;">
                <label style="display:block; font-size:0.85rem; margin-bottom:5px; font-weight:600;">Compromisos Acordados:</label>
                <textarea id="atencionCompromisos" class="form-input" placeholder="Escribe los puntos acordados..." style="height:100px; border-radius:10px; resize:none;"></textarea>
            </div>

            <div style="display:flex; gap:10px;">
                <button class="btn btn-outline" style="flex:1" onclick="document.getElementById('modalAtencionFoco').style.display='none'">Cancelar</button>
                <button class="btn btn-primary" id="btnConfirmarResolucion" style="flex:1; background:var(--success); border-color:var(--success)" onclick="window.guardarAtencionFoco()">
                    <i class="fa-solid fa-check-double"></i> Guardar y Finalizar
                </button>
            </div>
        </div>
    </div>
  `;
}

// ========================
// APOYO DATA LOADERS
// ========================

window.loadApoyoRiesgoFiltros = async () => {
    try {
        const { data: grupos } = await supabaseClient.from('grupos')
            .select('*')
            .eq('plantel_id', state.plantelId)
            .order('nombre');
        
        window._riesgoGruposCacheados = grupos || [];
    } catch(e) { console.error("Error cargando grupos riesgo", e); }
};

window.handleRiesgoGradoChange = () => {
    const grado = document.getElementById('riesgoGradoSel').value;
    const container = document.getElementById('riesgoGrupoContainer');
    const selGrupo = document.getElementById('riesgoGrupoSel');
    
    if(grado === 'Todos') {
        container.style.display = 'none';
        selGrupo.value = 'Todos';
    } else {
        container.style.display = 'block';
        const filtrados = (window._riesgoGruposCacheados || []).filter(g => g.nombre.startsWith(grado));
        let html = '<option value="Todos">Todos los grupos del grado</option>';
        filtrados.forEach(g => {
            html += `<option value="${g.id}">${g.nombre}</option>`;
        });
        selGrupo.innerHTML = html;
    }
};

window.loadApoyoRiesgoData = async () => {
    const hold = document.getElementById('riesgoDataContainer');
    const badge = document.getElementById('riesgoTotalBadge');
    const trim = document.getElementById('riesgoTrimestreSel').value;
    const grado = document.getElementById('riesgoGradoSel').value;
    const grupo = document.getElementById('riesgoGrupoSel') ? document.getElementById('riesgoGrupoSel').value : 'Todos';
    const umbral = document.getElementById('riesgoUmbralSel').value || '3+';

    hold.innerHTML = '<p style="text-align:center; padding:30px;">Analizando calificaciones...</p>';
    badge.style.display = 'none';

    try {
        let query = supabaseClient.from('calificaciones')
            .select('calificacion, materia_nombre, alumnos!inner(id, nombre, grado, grupo_id, grupos(nombre))')
            .eq('plantel_id', state.plantelId)
            .lt('calificacion', 6); // Solo buscar reprobadas (< 6)

        if(trim !== 'Todos') {
            query = query.eq('trimestre', parseInt(trim));
        }

        if(grado !== 'Todos') {
            query = query.eq('alumnos.grado', grado);
        }

        if(grupo !== 'Todos') {
            query = query.eq('alumnos.grupo_id', grupo);
        }

        const { data, error } = await query;
        if(error) throw error;

        if(!data || data.length === 0) {
            hold.innerHTML = '<p style="text-align:center; padding:30px; color:var(--success);"><i class="fa-solid fa-check-circle" style="font-size:2rem; display:block; margin-bottom:10px;"></i>No se detectaron alumnos con calificaciones reprobatorias bajo estos filtros.</p>';
            return;
        }

        const mapaAlumnos = {};
        data.forEach(row => {
            const aId = row.alumnos.id;
            if(!mapaAlumnos[aId]) {
                mapaAlumnos[aId] = {
                    id: aId,
                    nombre: row.alumnos.nombre,
                    grado: row.alumnos.grado,
                    grupo: row.alumnos.grupos ? row.alumnos.grupos.nombre : 'Sin grupo',
                    materias: new Set()
                };
            }
            mapaAlumnos[aId].materias.add(row.materia_nombre);
        });

        const alumnosEnRiesgo = Object.values(mapaAlumnos)
            .map(a => ({ ...a, materias: Array.from(a.materias) }))
            .filter(a => {
                if (umbral === '1-2') return a.materias.length >= 1 && a.materias.length <= 2;
                if (umbral === '3+') return a.materias.length >= 3;
                return false;
            })
            .sort((a,b) => b.materias.length - a.materias.length);

        if(alumnosEnRiesgo.length === 0) {
            let msg = umbral === '1-2' ? 'de 1 a 2 materias reprobadas' : '3 o más materias reprobadas';
            hold.innerHTML = `<p style="text-align:center; padding:30px; color:var(--success);">No hay alumnos con ${msg}.</p>`;
            return;
        }

        badge.style.display = 'inline-block';
        badge.innerText = `${alumnosEnRiesgo.length} detectados`;

        let html = `
            <div style="overflow-x:auto;">
                <table class="risk-table" style="width:100%;">
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            <th>Grado/Grupo</th>
                            <th style="text-align:center;">Materias Reprobadas</th>
                            <th>Asignaturas</th>
                            <th style="text-align:center;">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        alumnosEnRiesgo.forEach(al => {
            const badgesMaterias = al.materias.map(m => `<span class="badge" style="background:#f1f5f9; color:#475569; margin:2px; font-weight:normal; border:1px solid #cbd5e1;">${m}</span>`).join('');
            
            html += `
                <tr>
                    <td style="font-weight:600;">${al.nombre}</td>
                    <td>${al.grado} - ${al.grupo}</td>
                    <td style="text-align:center;">
                        <span style="font-size:1.2rem; font-weight:bold; color:var(--danger);">${al.materias.length}</span>
                    </td>
                    <td style="max-width:300px; line-height:1.6;">${badgesMaterias}</td>
                    <td style="text-align:center;">
                        <button class="btn btn-primary btn-sm" onclick="window.navigate('/apoyo/reportes'); setTimeout(()=> { document.getElementById('searchAlumnoFoco').value='${al.nombre}'; window.searchAlumnoParaReporte(); }, 500);">
                            <i class="fa-solid fa-calendar-check"></i> Citar / Reporte
                        </button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table></div>';
        hold.innerHTML = html;

    } catch(err) {
        console.error(err);
        hold.innerHTML = '<p style="text-align:center; color:var(--danger);">Error al calcular el riesgo académico.</p>';
    }
};

window.loadFocosRojos = async () => {
    const cont = document.getElementById('focosRojosContenedor');
    if(!cont) return;
    try {
        const { data: reportes, error } = await supabaseClient
            .from('reportes_conducta')
            .select('alumno_id, gravedad, alumnos(id, nombre, matricula, grupos(nombre))')
            .eq('resuelto', false)
            .eq('plantel_id', state.plantelId); // Contamos TODOS los no resueltos de esta escuela

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

window.loadReportesRecientesApoyo = async () => {
    const cont = document.getElementById('contenedorReportesRecientesApoyo');
    if(!cont) return;

    try {
        const { data, error } = await supabaseClient
            .from('reportes_conducta')
            .select('*, alumnos!alumno_id(nombre, matricula), autor:perfiles!autor_id(nombre, rol)')
            .eq('plantel_id', state.plantelId)
            .order('creado_en', { ascending: false })
            .limit(15);

        if(error) {
            console.error("Error loading recent reports:", error);
            // Fallback sin joins
            const { data: fallback, error: e2 } = await supabaseClient
                .from('reportes_conducta')
                .select('*, alumnos!alumno_id(nombre, matricula)')
                .eq('plantel_id', state.plantelId)
                .order('creado_en', { ascending: false })
                .limit(15);
            
            if(e2) throw e2;
            renderListaReciente(fallback || [], cont);
        } else {
            renderListaReciente(data || [], cont);
        }
    } catch(e) { 
        console.error("Failed to load reports:", e);
        cont.innerHTML = `<div style="padding:20px; text-align:center; color:var(--danger)">No se pudo cargar la bitácora: ${e.message}</div>`;
    }
};

const renderListaReciente = (data, cont) => {
    if(!data || data.length === 0) {
        cont.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted)">No hay registros recientes.</div>';
        return;
    }

    cont.innerHTML = data.map(r => {
        const dateObj = new Date(r.creado_en);
        const fechaStr = dateObj.toLocaleDateString();
        const hour = dateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        const sevColor = r.gravedad === 'Grave' ? 'var(--danger)' : (r.gravedad === 'Moderado' ? 'var(--warning)' : 'var(--success)');
        const autorNombre = r.autor?.nombre || r.perfiles?.nombre || 'Personal';
        const metaStr = r.autor_metadata ? ` <span style="font-weight:normal; color:var(--text-muted);">(${r.autor_metadata})</span>` : '';

        return `
        <div style="padding:15px; border:1px solid var(--border); border-radius:12px; background:white; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.75rem; color:var(--text-muted)">
                    <i class="fa-solid fa-calendar-day"></i> ${fechaStr} ${hour} | <i class="fa-solid fa-user-tie"></i> <b>${autorNombre}</b>${metaStr}
                </span>
                <span class="badge" style="background:${r.resuelto ? 'var(--success)' : sevColor}; color:white; font-size:0.65rem;">${r.resuelto ? 'ATENDIDO' : r.gravedad.toUpperCase()}</span>
            </div>
            <div style="font-size:0.9rem;">
                <b>Alumno:</b> ${r.alumnos?.nombre || '---'} <span style="color:var(--text-muted); font-size:0.8rem;">(${r.alumnos?.matricula || 'N/A'})</span>
            </div>
            <p style="margin:0; font-size:0.85rem; color:var(--text-main); white-space:pre-wrap;">${r.descripcion}</p>
            ${!r.resuelto ? `
                <div style="display:flex; justify-content:flex-end;">
                    <button class="btn btn-outline btn-xs" onclick="window.resolverReporte('${r.id}', true)">
                        <i class="fa-solid fa-check"></i> Marcar Atendido
                    </button>
                </div>
            ` : ''}
        </div>
        `;
    }).join('');
};

window.resolverReporte = async (id, reloadRecent = false) => {
    if(!confirm("¿Marcar caso como atendido?")) return;
    try {
        const { error } = await supabaseClient.from('reportes_conducta').update({ resuelto: true }).eq('id', id);
        if(error) throw error;
        window.showToast("Reporte actualizado", "success");
        if(reloadRecent) window.loadReportesRecientesApoyo();
        else if(window.loadHistorialReportesApoyo) window.loadHistorialReportesApoyo();
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

window.buscarAlumnosReporteApoyo = async (val, mode = 'reporte') => {
    const resId = mode === 'reporte' ? 'resultadosBusquedaApoyo' : 'resultadosBusquedaCitatorio';
    const resDiv = document.getElementById(resId);
    if(!val || val.length < 2) {
        resDiv.style.display = 'none';
        return;
    }
    try {
        const { data, error } = await supabaseClient
            .from('alumnos')
            .select('id, nombre, matricula, grupos(nombre)')
            .eq('plantel_id', state.plantelId)
            .or(`nombre.ilike.%${val}%,matricula.ilike.%${val}%`)
            .limit(5);

        if(error) throw error;
        if(data && data.length > 0) {
            resDiv.innerHTML = data.map(a => `
                <div style="padding:10px; border-bottom:1px solid var(--border); cursor:pointer; font-size:0.85rem;" 
                     onmouseover="this.style.background='#f0f0f0'" 
                     onmouseout="this.style.background='white'"
                     onclick="window.seleccionarAlumnoReporteApoyo('${a.id}', '${a.nombre}', '${a.grupos?.nombre || 'S/G'}', '${mode}')">
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

window.seleccionarAlumnoReporteApoyo = (id, nombre, grupo, mode = 'reporte') => {
    if(mode === 'reporte') {
        document.getElementById('alumnoIdSeleccionado').value = id;
        const label = document.getElementById('alumnoSeleccionadoLabel');
        label.innerHTML = `<i class="fa-solid fa-user-check"></i> Seleccionado: <b>${nombre}</b> (${grupo})`;
        label.style.display = 'block';
        document.getElementById('busquedaAlumnoApoyo').value = '';
        document.getElementById('resultadosBusquedaApoyo').style.display = 'none';
    } else {
        document.getElementById('alumnoIdCitatorio').value = id;
        const label = document.getElementById('alumnoSeleccionadoLabelCitatorio');
        label.innerHTML = `<i class="fa-solid fa-envelope-open"></i> Citando a: <b>${nombre}</b> (${grupo})`;
        label.style.display = 'block';
        document.getElementById('busquedaAlumnoCitatorio').value = '';
        document.getElementById('resultadosBusquedaCitatorio').style.display = 'none';
    }
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
        
        let metaStr = null;
        if(state.role === 'maestro' || state.role === 'docente') {
            const { data: asig } = await supabaseClient.from('asignaciones_maestros').select('materia').eq('docente_email', state.user.email);
            if(asig && asig.length > 0) {
                const materias = [...new Set(asig.map(a => a.materia))].filter(Boolean).join(', ');
                if(materias) metaStr = 'Maestro(a) de ' + materias;
                else metaStr = 'Maestro(a)';
            } else {
                metaStr = 'Maestro(a)';
            }
        } else if (state.role === 'apoyo') {
            metaStr = 'Personal de Apoyo';
        } else if (state.role === 'directivo') {
            metaStr = 'Directivo';
        } else {
            metaStr = state.role ? state.role.charAt(0).toUpperCase() + state.role.slice(1) : 'Personal';
        }

        const { error } = await supabaseClient.from('reportes_conducta').insert([{
            id: crypto.randomUUID(),
            alumno_id: aid,
            autor_id: u.data.user.id,
            descripcion: finalDesc,
            gravedad: sev,
            resuelto: false,
            plantel_id: state.plantelId,
            autor_metadata: metaStr
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

window.abrirModalCitatorio = () => {
    document.getElementById('modalNuevoCitatorio').style.display = 'block';
    document.getElementById('alumnoIdCitatorio').value = '';
    document.getElementById('busquedaAlumnoCitatorio').value = '';
    document.getElementById('motivoCitatorio').value = '';
    document.getElementById('fechaCitaCitatorio').value = '';
    document.getElementById('alumnoSeleccionadoLabelCitatorio').style.display = 'none';
    document.getElementById('resultadosBusquedaCitatorio').style.display = 'none';
};

window.guardarCitatorio = async () => {
    const aid = document.getElementById('alumnoIdCitatorio').value;
    const motivo = document.getElementById('motivoCitatorio').value;
    const fecha = document.getElementById('fechaCitaCitatorio').value;
    
    if(!aid) return alert("Por favor, selecciona un alumno de la lista.");
    if(!motivo.trim()) return alert("Por favor, describe el motivo del citatorio.");

    const btn = document.getElementById('btnGuardarCitatorio');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) throw new Error("Sin sesión activa.");

        const { error } = await supabaseClient.from('citatorios').insert([{
            id: crypto.randomUUID(),
            alumno_id: aid,
            emisor_id: u.data.user.id,
            motivo: motivo.trim(),
            fecha_cita: fecha ? new Date(fecha).toISOString() : null,
            plantel_id: state.plantelId
        }]);

        if(error) throw error;

        // Notificar al alumno
        await supabaseClient.from('comunicados').insert([{
            autor_id: u.data.user.id,
            titulo: '📩 Tienes un Citatorio Pendiente de Firma',
            mensaje: `El área de Trabajo Social solicita tu presencia y la de tu padre/tutor.\nMotivo: ${motivo.substring(0, 50)}...\n\nPor favor, entra a tu perfil para firmar de enterado.`,
            audiencia: `Alumno_${aid}`,
            tipo: 'General',
            plantel_id: state.plantelId
        }]);

        window.showToast("Citatorio enviado y notificado", "success");
        document.getElementById('modalNuevoCitatorio').style.display = 'none';
        if(window.loadCitatoriosApoyo) window.loadCitatoriosApoyo();
    } catch(e) {
        console.error(e);
        window.showToast("Error al enviar citatorio", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Enviar Citatorio';
    }
};

window.switchTabApoyoConducta = (tab) => {
    // Esconder todas las secciones
    document.querySelectorAll('.tab-apoyo-conducta').forEach(s => s.style.display = 'none');
    // Resetear botones
    document.querySelectorAll('[id^="btnTabFiltro"]').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
    });

    // Mostrar sección
    if(tab === 'historial') {
        document.getElementById('seccionFiltroHistorial').style.display = 'block';
        document.getElementById('btnTabFiltroHistorial').classList.add('btn-primary');
        document.getElementById('btnTabFiltroHistorial').classList.remove('btn-outline');
        const hoy = new Date().toLocaleDateString('en-CA');
        if(window.loadHistorialReportesApoyo) window.loadHistorialReportesApoyo(hoy);
    } else if(tab === 'citatorios') {
        document.getElementById('seccionFiltroCitatorios').style.display = 'block';
        document.getElementById('btnTabFiltroCitatorios').classList.add('btn-primary');
        document.getElementById('btnTabFiltroCitatorios').classList.remove('btn-outline');
        if(window.loadCitatoriosApoyo) window.loadCitatoriosApoyo();
    }
};

window.loadCitatoriosApoyo = async () => {
    const cont = document.getElementById('contenedorCitatoriosApoyo');
    if(!cont) return;
    try {
        const { data, error } = await supabaseClient
            .from('citatorios')
            .select('*, alumnos(nombre, matricula)')
            .eq('plantel_id', state.plantelId)
            .neq('estado', 'atendido')
            .order('creado_en', { ascending: false });

        if(error) throw error;

        if(!data || data.length === 0) {
            cont.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); grid-column:1/-1;">No hay citatorios vigentes en este momento.</div>';
            return;
        }

        cont.innerHTML = data.map(c => {
            const isEnterado = c.estado === 'enterado';
            const dateCita = c.fecha_cita ? new Date(c.fecha_cita).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) : 'Pendiente acordar';
            return `
                <div class="card" style="padding:15px; border:1px solid ${isEnterado ? '#bbf7d0' : '#fed7aa'}; background:white; position:relative; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span class="badge" style="background:${isEnterado ? '#22c55e' : (c.visto_por_alumno ? '#3b82f6' : '#f97316')}; color:white; font-size:0.75rem; padding:4px 10px; border-radius:8px;">
                            ${isEnterado ? '<i class="fa-solid fa-file-signature"></i> FIRMADO POR PADRE' : (c.visto_por_alumno ? '<i class="fa-solid fa-eye"></i> VISTO POR ALUMNO' : '<i class="fa-solid fa-clock"></i> PENDIENTE DE VISTA')}
                        </span>
                        <small style="color:var(--text-muted); font-size:0.75rem;">${new Date(c.creado_en).toLocaleDateString()}</small>
                    </div>
                    <h4 style="margin:0 0 5px 0; font-size:1rem; color:var(--primary);">${c.alumnos?.nombre || '---'}</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;"><b>Matrícula:</b> ${c.alumnos?.matricula || '---'}</p>
                    
                    <div style="background:var(--page-bg); padding:10px; border-radius:8px; margin-bottom:12px; font-size:0.85rem;">
                        <div style="margin-bottom:5px;"><b>Motivo:</b> ${c.motivo}</div>
                        <div><b>Cita sugerida:</b> ${dateCita}</div>
                    </div>

                    ${c.firma_enterado ? `
                        <div style="font-size:0.8rem; padding:8px; background:#f0fdf4; border-radius:8px; margin-bottom:12px; color:#166534; border:1px solid #bbf7d0;">
                            <i class="fa-solid fa-signature"></i> Firmado por: <b>${c.firma_enterado}</b><br>
                            <small>${new Date(c.fecha_enterado).toLocaleString()}</small>
                        </div>
                    ` : ''}

                    <button class="btn btn-primary btn-sm" style="width:100%; height:36px; ${!isEnterado ? 'opacity:0.6;' : ''}" 
                            onclick="window.abrirModalAtencionFoco('${c.alumno_id}', '${c.alumnos?.nombre}', '${c.id}')">
                        <i class="fa-solid fa-handshake"></i> Atender y Archivar
                    </button>
                    ${!isEnterado ? `<p style="margin:5px 0 0 0; font-size:0.65rem; text-align:center; color:var(--danger)">* Recomienda al alumno firmar en su portal</p>` : ''}
                </div>
            `;
        }).join('');
    } catch(e) { console.error("Error load citatorios:", e); }
};

window.abrirModalAtencionFoco = (id, nombre, citatorioId = null) => {
    const modals = document.querySelectorAll('#modalAtencionFoco');
    modals.forEach(m => {
        // En un SPA pueden quedar modales fantasma. Actualizamos todos pero solo mostramos el último/activo.
        const inAid = m.querySelector('#atencionAlumnoId'); if(inAid) inAid.value = id;
        const inCid = m.querySelector('#atencionCitatorioId'); if(inCid) inCid.value = citatorioId || '';
        const inNom = m.querySelector('#atencionAlumnoNombre'); if(inNom) inNom.innerHTML = `<i class="fa-solid fa-user"></i> Resolviendo para: <b>${nombre}</b>`;
        const inProc = m.querySelector('#atencionProcedimiento'); if(inProc) inProc.value = '';
        const inComp = m.querySelector('#atencionCompromisos'); if(inComp) inComp.value = '';
        m.style.display = 'block';
    });
};

window.guardarAtencionFoco = async () => {
    const modals = document.querySelectorAll('#modalAtencionFoco');
    let activeModal = modals[0];
    modals.forEach(m => { if(m.style.display !== 'none') activeModal = m; });
    if(!activeModal) activeModal = document; // fallback

    const aid = activeModal.querySelector('#atencionAlumnoId')?.value;
    const cid = activeModal.querySelector('#atencionCitatorioId')?.value || '';
    const proc = activeModal.querySelector('#atencionProcedimiento')?.value || '';
    const comp = activeModal.querySelector('#atencionCompromisos')?.value || '';

    if(!proc.trim() || !comp.trim()) {
        alert("Por favor, completa ambos campos para el acta de resolución.");
        return;
    }

    const btn = activeModal.querySelector('#btnConfirmarResolucion');
    const old = btn ? btn.innerHTML : '';
    if(btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...'; }

    try {
        const u = await supabaseClient.auth.getUser();
        if(!u.data.user) throw new Error("Sin sesión activa");

        // 1. Guardar en Seguimientos Sociales (TS)
        const { error: errSeg } = await supabaseClient.from('seguimientos_sociales').insert([{
            alumno_id: aid,
            perfil_id: u.data.user.id,
            asunto: 'Resolución de Citatorio / Incidencia',
            detalle: `PROCEDIMIENTO: ${proc}\n\nCOMPROMISOS: ${comp}`,
            estado: 'finalizado',
            plantel_id: state.plantelId
        }]);
        if(errSeg) throw new Error('Error en seguimientos_sociales: ' + errSeg.message);
        
        // 2. Guardar en Intervenciones Conducta (Para el expediente unificado)
        const { error: errInt } = await supabaseClient.from('intervenciones_conducta').insert([{
            alumno_id: aid,
            maestro_id: u.data.user.id,
            procedimiento: proc,
            compromisos: comp,
            plantel_id: state.plantelId
        }]);
        if(errInt) throw new Error('Error en intervenciones_conducta: ' + errInt.message);

        // 3. Resolver reportes pendientes del alumno (ignorar si no hay ninguno)
        const { error: errRep } = await supabaseClient
            .from('reportes_conducta')
            .update({ resuelto: true })
            .eq('alumno_id', aid)
            .eq('plantel_id', state.plantelId);
        if(errRep) console.warn('Advertencia al resolver reportes:', errRep.message);

        // 4. Si viene de un citatorio, actualizarlo y eliminarlo
        if(cid) {
            await supabaseClient.from('citatorios').update({ estado: 'atendido' }).eq('id', cid);
            await supabaseClient.from('citatorios').delete().eq('id', cid);
        }

        // 5. Notificar al alumno del cierre
        const { error: errCom } = await supabaseClient.from('comunicados').insert([{
            autor_id: u.data.user.id,
            titulo: `✅ SITUACIÓN ATENDIDA Y RESUELTA`,
            mensaje: `Se ha concluido la junta de seguimiento en Trabajo Social.\n\nPROCEDIMIENTO: ${proc.substring(0, 120)}\nCOMPROMISOS: ${comp.substring(0, 120)}\n\nTu expediente ha sido actualizado. ¡Gracias por tu compromiso!`,
            audiencia: `Alumno_${aid}`,
            fecha_envio: new Date().toISOString(),
            plantel_id: state.plantelId
        }]);
        if(errCom) console.warn('Advertencia al enviar comunicado al alumno:', errCom.message);

        window.showToast("Atención registrada, citatorio archivado y reportes resueltos", "success");
        document.getElementById('modalAtencionFoco').style.display = 'none';

        // Refrescar vistas
        if(window.loadCitatoriosApoyo) window.loadCitatoriosApoyo();
        if(window.loadFocosRojos) window.loadFocosRojos();
        if(window.loadHistorialReportesApoyo) window.loadHistorialReportesApoyo();

    } catch(e) {
        console.error(e);
        alert("Error al procesar resolución: " + e.message);
    } finally {
        if(btn) {
            btn.disabled = false;
            btn.innerHTML = old;
        }
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
                <button class="btn btn-outline btn-sm" onclick="window.imprimirExpediente('${al.id}')" style="position:absolute; top:12px; right:45px; border-color:var(--primary); color:var(--primary);"><i class="fa-solid fa-print"></i> Imprimir</button>
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

window.imprimirExpediente = async (idAlumno) => {
    try {
        const id = String(idAlumno).trim();
        const [alRes, repsRes, intervsRes, plantelRes] = await Promise.all([
            supabaseClient.from('alumnos').select('*, grupos(nombre)').eq('id', id).single(),
            supabaseClient.from('reportes_conducta').select('*, perfiles(nombre)').eq('alumno_id', id).order('fecha', { ascending: false }),
            supabaseClient.from('intervenciones_conducta').select('*').eq('alumno_id', id).order('fecha', { ascending: false }),
            supabaseClient.from('planteles').select('nombre').eq('id', state.plantelId).single()
        ]);

        const al = alRes.data;
        const reps = repsRes.data || [];
        const intervs = intervsRes.data || [];
        const schoolName = plantelRes.data?.nombre || 'Escuela';

        if(!al) throw new Error("Alumno no encontrado");

        const printWindow = window.open('', '_blank');
        const fechaImpresion = new Date().toLocaleDateString();

        let repsHtml = reps.length > 0 ? reps.map(r => `
            <div class="item-box ${r.gravedad === 'Grave' ? 'grave' : ''}">
                <div class="item-header">
                    <strong>${r.gravedad}</strong>
                    <span>${new Date(r.fecha).toLocaleDateString()}</span>
                </div>
                <p>${r.descripcion}</p>
                <small>Reportó: ${r.perfiles?.nombre || 'Maestro'}</small>
            </div>
        `).join('') : '<p class="text-muted">Sin reportes registrados.</p>';

        let intervsHtml = intervs.length > 0 ? intervs.map(i => `
            <div class="item-box success">
                <div class="item-header">
                    <strong>Intervención TS</strong>
                    <span>${new Date(i.fecha).toLocaleDateString()}</span>
                </div>
                <p><strong>Procedimiento:</strong> ${i.procedimiento}</p>
                <p><strong>Compromisos:</strong> ${i.compromisos}</p>
            </div>
        `).join('') : '<p class="text-muted">Sin intervenciones registradas.</p>';

        printWindow.document.write(`
            <html>
                <head>
                    <title>Expediente Alumno - ${al.nombre}</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 15px; }
                        .header h2 { font-size: 28px; margin: 0 0 5px 0; color: #000; text-transform: uppercase; }
                        .header h1 { margin: 0; color: #1e40af; font-size: 20px; text-transform: uppercase; }
                        .header p { margin: 5px 0; font-size: 14px; color: #555; font-weight: bold; }
                        .student-info { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px; }
                        .section-title { font-size: 18px; color: #1e40af; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; text-transform: uppercase; }
                        .item-box { border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 12px; page-break-inside: avoid; }
                        .item-box.grave { border-left: 4px solid #ef4444; }
                        .item-box.success { border-left: 4px solid #10b981; background: #f0fdf4; }
                        .item-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
                        .item-box p { margin: 4px 0; font-size: 13px; }
                        .item-box small { font-size: 11px; color: #64748b; }
                        .text-muted { color: #64748b; font-style: italic; font-size: 13px; }
                        .footer-signatures { display: flex; justify-content: space-around; margin-top: 60px; page-break-inside: avoid; }
                        .sig-line { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; font-size: 12px; }
                        @media print {
                            @page { margin: 2cm; }
                            body { padding: 0; }
                            .btn-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>${schoolName}</h2>
                        <h1>SISTEMA EDU-LM: DEPARTAMENTO DE TRABAJO SOCIAL</h1>
                        <p>EXPEDIENTE INTEGRAL DEL ALUMNO</p>
                    </div>
                    
                    <div class="student-info">
                        <div>
                            <strong>Nombre:</strong> ${al.nombre}<br>
                            <strong>Matrícula:</strong> ${al.matricula}<br>
                            <strong>Grado:</strong> ${al.grado || 'S/G'}
                        </div>
                        <div style="text-align:right;">
                            <strong>Grupo:</strong> ${al.grupos?.nombre || 'S/G'}<br>
                            <strong>Fecha de Impresión:</strong> ${fechaImpresion}
                        </div>
                    </div>

                    <div class="section-title">Historial de Conducta y Reportes</div>
                    ${repsHtml}

                    <div class="section-title">Intervenciones y Compromisos</div>
                    ${intervsHtml}

                    <div class="footer-signatures">
                        <div class="sig-line">
                            <strong>Firma Trabajo Social</strong><br>
                            Sello Oficial
                        </div>
                        <div class="sig-line">
                            <strong>Firma Padre/Tutor</strong><br>
                            Aceptación de Acuerdos
                        </div>
                    </div>

                    <script>
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                                window.close();
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    } catch (e) {
        alert("Error al generar el formato de impresión: " + e.message);
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
        const { data } = await supabaseClient.from('alumnos').select('*, grupos(nombre)').eq('plantel_id', state.plantelId).or(`nombre.ilike.%${query}%,matricula.ilike.%${query}%`).limit(5);
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
            .select('*, perfiles(nombre)')
            .eq('alumno_id', id)
            .order('creado_en', {ascending:false});

        // 2. Obtener Justificantes
        const { data: justificantes } = await supabaseClient
            .from('justificantes_medicos')
            .select('*, perfiles(nombre)')
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
                <div>
                    <button class="btn btn-xs btn-outline" onclick="window.imprimirExpedienteMedico('${id}')" style="margin-right:8px; border-color:var(--primary); color:var(--primary);">
                        <i class="fa-solid fa-print"></i> Imprimir
                    </button>
                    <button class="btn btn-xs btn-outline" onclick="window.loadHistorialSalud()">
                        <i class="fa-solid fa-rotate-left"></i> Ver Recientes
                    </button>
                </div>
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
                        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Por: ${s.perfiles?.nombre || 'Trabajo Social'}</div>
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
                        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Por: ${s.perfiles?.nombre || 'Trabajo Social'}</div>
                      </div>`;
                }
            }).join('')}
        `;
    } catch(e) {
        console.error(e);
        cont.innerHTML = '<p style="color:var(--danger)">Error al cargar el historial médico.</p>';
    }
};

window.imprimirExpedienteMedico = async (idAlumno) => {
    try {
        const id = String(idAlumno).trim();
        const [alRes, atencRes, justRes, plantelRes] = await Promise.all([
            supabaseClient.from('alumnos').select('*, grupos(nombre)').eq('id', id).single(),
            supabaseClient.from('expedientes_salud').select('*, perfiles(nombre)').eq('alumno_id', id).order('creado_en', { ascending: false }),
            supabaseClient.from('justificantes_medicos').select('*, perfiles(nombre)').eq('alumno_id', id).order('fecha_emision', { ascending: false }),
            supabaseClient.from('planteles').select('nombre').eq('id', state.plantelId).single()
        ]);

        const al = alRes.data;
        const atenciones = atencRes.data || [];
        const justificantes = justRes.data || [];
        const schoolName = plantelRes.data?.nombre || 'Escuela';

        if(!al) throw new Error("Alumno no encontrado");

        const printWindow = window.open('', '_blank');
        const fechaImpresion = new Date().toLocaleDateString();

        let atencHtml = atenciones.length > 0 ? atenciones.map(a => `
            <div class="item-box success">
                <div class="item-header">
                    <strong>Atención Médica: ${a.tipo_alergia || 'Consulta General'}</strong>
                    <span>${new Date(a.creado_en).toLocaleDateString()}</span>
                </div>
                <p><strong>Observaciones / Acciones:</strong> ${a.observaciones_medicas || 'Ninguna'}</p>
                <p class="text-muted" style="margin-top: 5px;">Por: ${a.perfiles?.nombre || 'Trabajo Social'}</p>
            </div>
        `).join('') : '<p class="text-muted">Sin atenciones registradas.</p>';

        let justHtml = justificantes.length > 0 ? justificantes.map(j => `
            <div class="item-box grave">
                <div class="item-header">
                    <strong>Justificante Médico</strong>
                    <span>Emitido: ${new Date(j.fecha_emision).toLocaleDateString()}</span>
                </div>
                <p><strong>Motivo:</strong> ${j.motivo}</p>
                <p><strong>Rango:</strong> ${new Date(j.fecha_inicio).toLocaleDateString()} al ${new Date(j.fecha_fin).toLocaleDateString()}</p>
                <p class="text-muted" style="margin-top: 5px;">Por: ${j.perfiles?.nombre || 'Trabajo Social'}</p>
            </div>
        `).join('') : '<p class="text-muted">Sin justificantes registrados.</p>';

        printWindow.document.write(`
            <html>
                <head>
                    <title>Expediente Médico - ${al.nombre}</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 15px; }
                        .header h2 { font-size: 28px; margin: 0 0 5px 0; color: #000; text-transform: uppercase; }
                        .header h1 { margin: 0; color: #1e40af; font-size: 20px; text-transform: uppercase; }
                        .header p { margin: 5px 0; font-size: 14px; color: #555; font-weight: bold; }
                        .student-info { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px; }
                        .section-title { font-size: 18px; color: #1e40af; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; text-transform: uppercase; }
                        .item-box { border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 12px; page-break-inside: avoid; }
                        .item-box.grave { border-left: 4px solid #ef4444; background: #fffdf7; }
                        .item-box.success { border-left: 4px solid #10b981; background: #f0fdf4; }
                        .item-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
                        .item-box p { margin: 4px 0; font-size: 13px; }
                        .text-muted { color: #64748b; font-style: italic; font-size: 13px; }
                        .footer-signatures { display: flex; justify-content: space-around; margin-top: 60px; page-break-inside: avoid; }
                        .sig-line { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; font-size: 12px; }
                        @media print {
                            @page { margin: 2cm; }
                            body { padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>${schoolName}</h2>
                        <h1>SISTEMA EDU-LM: ÁREA DE SALUD ESCOLAR</h1>
                        <p>EXPEDIENTE MÉDICO Y JUSTIFICANTES</p>
                    </div>
                    
                    <div class="student-info">
                        <div>
                            <strong>Nombre:</strong> ${al.nombre}<br>
                            <strong>Matrícula:</strong> ${al.matricula}<br>
                            <strong>Grado:</strong> ${al.grado || 'S/G'}
                        </div>
                        <div style="text-align:right;">
                            <strong>Grupo:</strong> ${al.grupos?.nombre || 'S/G'}<br>
                            <strong>Fecha de Impresión:</strong> ${fechaImpresion}
                        </div>
                    </div>

                    <div class="section-title">Atenciones Médicas en Plantel</div>
                    ${atencHtml}

                    <div class="section-title">Justificantes Médicos Emitidos</div>
                    ${justHtml}

                    <div class="footer-signatures">
                        <div class="sig-line">
                            <strong>Firma Área de Salud / TS</strong><br>
                            Sello Oficial
                        </div>
                        <div class="sig-line">
                            <strong>Firma Director/Coordinador</strong><br>
                            Vo.Bo.
                        </div>
                    </div>

                    <script>
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                                window.close();
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    } catch (e) {
        alert("Error al generar formato médico: " + e.message);
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
            audiencia: `Grupo_${alu.grupo_id}`,
            plantel_id: state.plantelId
        }]);

        if(error) throw error;
        alert("Justificante enviado exitosamente a todos los maestros del grupo.");
    } catch(e) { 
        console.error(e);
        alert("Error al enviar el justificante: " + e.message);
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
       <h3 style="margin-bottom: 8px;">Añadir Entrada a la Bitácora</h3>
       <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:15px; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-user-check text-primary"></i> 
          Firmando como: <b style="color:var(--text-main)">${state.user?.nombre || 'Personal Autorizado'}</b>
       </p>
       <div class="form-group">
          <textarea class="form-input" id="textoBitacoraApoyo" rows="3" placeholder="Describe algún hecho relevante..." style="border-radius:12px; border:1.5px solid var(--border); padding:15px;"></textarea>
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
            <button class="btn btn-info" onclick="window.toggleCameraMode()" style="border-radius:30px; padding:10px 25px;">
                <i class="fa-solid fa-camera-rotate"></i> Girar Cámara
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
    const sel1 = document.getElementById('selGrupoAsistenciaApoyo');
    const sel2 = document.getElementById('selGrupoAsistenciaApoyoTS');
    if(!sel1 && !sel2) return;
    try {
        const { data: grupos } = await supabaseClient.from('grupos').select('*').eq('plantel_id', state.plantelId).order('nombre');
        if(grupos) {
            const options = '<option value="">Todos los Grupos</option>' + 
                grupos.map(g => `<option value="${g.id}">${g.nombre}</option>`).join('');
            if(sel1) sel1.innerHTML = options;
            if(sel2) sel2.innerHTML = options;
        }
    } catch(e) { console.error(e); }
};

window.loadResumenEntrada = async () => {
    const cont = document.getElementById('resumenEntradaCont');
    if(!cont) return;
    try {
        const hoy = new Date().toLocaleDateString('en-CA');
        
        const { count: totalAlu } = await supabaseClient.from('alumnos').select('*', { count: 'exact', head: true }).eq('plantel_id', state.plantelId);
        
        const { data: asistencias } = await supabaseClient.from('accesos_plantel')
            .select('estado')
            .eq('fecha', hoy)
            .eq('plantel_id', state.plantelId);
        
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

window.loadResumenSalida = async () => {
    const cont = document.getElementById('resumenSalidaCont');
    if(!cont) return;
    try {
        const hoy = new Date().toLocaleDateString('en-CA');
        
        const { data: accesos } = await supabaseClient.from('accesos_plantel')
            .select('estado')
            .eq('fecha', hoy)
            .eq('plantel_id', state.plantelId);
        
        const entradas = (accesos || []).filter(a => a.estado === 'Asistencia' || a.estado === 'Retardo').length;
        const salidas = (accesos || []).filter(a => a.estado === 'Salida').length;
        
        const pct = entradas > 0 ? Math.round((salidas / entradas) * 100) : 0;
        const faltanSalir = entradas - salidas;

        cont.innerHTML = `
            <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:3rem; font-weight:800; color:var(--warning); line-height:1;">${pct}%</div>
                <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-top:5px;">Alumnos que han salido</div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <div class="card" style="padding:10px; text-align:center; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:15px;">
                    <div style="font-size:1.2rem; font-weight:bold; color:#166534;">${entradas}</div>
                    <div style="font-size:0.7rem; color:#16a34a;">Entraron Hoy</div>
                </div>
                <div class="card" style="padding:10px; text-align:center; background:#fffbeb; border:1px solid #fde68a; border-radius:15px;">
                    <div style="font-size:1.2rem; font-weight:bold; color:#92400e;">${salidas}</div>
                    <div style="font-size:0.7rem; color:#d97706;">Salieron</div>
                </div>
            </div>
            <div class="card" style="padding:12px; margin-top:10px; display:flex; justify-content:space-between; align-items:center; border-radius:15px; border-left:4px solid var(--danger);">
                <span style="font-size:0.85rem; color:var(--text-muted);">Aún en el plantel:</span>
                <span style="font-weight:bold; color:var(--danger);">${faltanSalir > 0 ? faltanSalir : 0} alumnos</span>
            </div>
        `;
    } catch(e) { console.error(e); }
};

window.loadAsistenciasApoyo = async () => {
    const table = document.getElementById('tablaAsistenciasApoyo');
    const elGrupo = document.getElementById('selGrupoAsistenciaApoyo') || document.getElementById('selGrupoAsistenciaApoyoTS');
    const elFecha = document.getElementById('fechaAsistenciaApoyo') || document.getElementById('fechaAsistenciaApoyoTS');
    
    const grupoId = elGrupo ? elGrupo.value : '';
    const fecha = elFecha ? elFecha.value : new Date().toLocaleDateString('en-CA');
    if(!table) return;

    try {
        let query = supabaseClient.from('accesos_plantel')
            .select('*, alumnos(nombre, grupo_id)')
            .eq('plantel_id', state.plantelId)
            .eq('fecha', fecha)
            .order('creado_en', {ascending: false});
        
        if (state.path === '/apoyo/ts_escaner') {
            query = query.eq('estado', 'Salida');
        } else if (state.path === '/apoyo/prefectura') {
            query = query.in('estado', ['Asistencia', 'Retardo']);
        }

        const { data: rawData } = await query;
        const data = grupoId ? (rawData || []).filter(a => a.alumnos?.grupo_id === grupoId) : (rawData || []);

        if(!data || data.length === 0) {
            table.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:var(--text-muted);">Sin registros aún.</td></tr>';
            return;
        }

        table.innerHTML = data.map(a => {
            let badgeBg = '#f0fdf4';
            let badgeColor = '#166534';
            if(a.estado === 'Retardo') { badgeBg = '#fef3c7'; badgeColor = '#92400e'; }
            if(a.estado === 'Salida') { badgeBg = '#fffbeb'; badgeColor = '#d97706'; }

            return `
            <tr>
                <td style="font-size:0.85rem; padding:10px;">
                    <div style="font-weight:600;">${a.alumnos?.nombre || 'Alumno'}</div>
                </td>
                <td style="text-align:center; font-size:0.8rem; color:var(--text-muted);">${new Date(a.creado_en).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                <td style="text-align:right;">
                    <span class="badge" style="background:${badgeBg}; color:${badgeColor}; font-size:0.65rem; border:none; padding:4px 8px; border-radius:6px;">
                        ${a.estado}
                    </span>
                </td>
            </tr>
            `;
        }).join('');
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
        
        // 1. Obtener TODOS los alumnos de ESTA escuela
        const { data: alumnos } = await supabaseClient.from('alumnos').select('id').eq('plantel_id', state.plantelId);
        
        // 2. Obtener quienes ya tienen acceso hoy
        const { data: registrados } = await supabaseClient.from('accesos_plantel')
            .select('alumno_id, estado')
            .eq('plantel_id', state.plantelId)
            .eq('fecha', hoy);
        
        const idsRegistrados = new Set((registrados || []).map(r => r.alumno_id));
        const faltantes = (alumnos || []).filter(a => !idsRegistrados.has(a.id));
        const retardos = (registrados || []).filter(r => r.estado === 'Retardo');

        const u = await supabaseClient.auth.getUser();

        // ACCIÓN A: Registrar y avisar INASISTENCIAS
        if(faltantes.length > 0) {
            const inserts = faltantes.map(f => ({
                alumno_id: f.id,
                estado: 'Inasistencia',
                fecha: hoy,
                registrador_id: u.data.user?.id,
                plantel_id: state.plantelId
            }));

            const { error: insErr } = await supabaseClient.from('accesos_plantel').insert(inserts);
            if(insErr) throw insErr;

            const msgInserts = faltantes.map(f => ({
                autor_id: u.data.user?.id,
                titulo: "⚠️ Aviso de Inasistencia Institucional",
                audiencia: `Alumno_${f.id}`,
                mensaje: `Se ha registrado una INASISTENCIA en el portal de acceso escolar hoy (${new Date().toLocaleDateString()}). Es indispensable que acudas a Trabajo Social para realizar la justificación correspondiente.`,
                plantel_id: state.plantelId
            }));
            await supabaseClient.from('comunicados').insert(msgInserts);
        }

        // ACCIÓN B: Avisar RETARDOS (aquellos que ya se registraron como tal hoy)
        if(retardos.length > 0) {
            const msgRetardoInserts = retardos.map(r => ({
                autor_id: u.data.user?.id,
                titulo: "⚠️ Aviso de Retardo Institucional",
                audiencia: `Alumno_${r.alumno_id}`,
                mensaje: `Se ha registrado un RETARDO en tu ingreso al plantel hoy (${new Date().toLocaleDateString()}). Se recomienda llegar con anticipación para evitar afectaciones en tu historial escolar.`,
                plantel_id: state.plantelId
            }));
            await supabaseClient.from('comunicados').insert(msgRetardoInserts);
        }

        window.showToast(`${faltantes.length} inasistencias y ${retardos.length} retardos notificados.`, "success");

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
        
        // El botón rojo en modo normal ahora solo cambia a Retardo, no marca inasistencias masivas
        btnFin.style.display = "inline-flex";
        btnFin.innerHTML = '<i class="fa-solid fa-clock"></i> Cerrar Normal e Ir a Retardos';
        btnFin.onclick = () => window.cambiarEstadoAsistencia('retardo');

        btnRet.style.display = "none";
        btnNorm.style.display = "none";
        const psc = document.getElementById('pref-inicio-scan');
        if(psc) { psc.style.opacity = "1"; psc.style.pointerEvents = "auto"; }
    } else if(window._estadoPaseLista === 'finalizado') {
        txt.innerText = "CERRADO DEFINITIVAMENTE";
        txt.style.color = "var(--danger)";
        desc.innerText = "Reporte de inasistencias generado.";
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
        
        // Solo en modo retardo el botón rojo dispara las inasistencias masivas
        btnFin.style.display = "inline-flex";
        btnFin.innerHTML = '<i class="fa-solid fa-lock"></i> Finalizar Pase (Enviar Faltas)';
        btnFin.onclick = () => window.generarInasistenciasMasivas();

        btnRet.style.display = "none";
        btnNorm.style.display = "inline-flex";
        const psc = document.getElementById('pref-inicio-scan');
        if(psc) { psc.style.opacity = "1"; psc.style.pointerEvents = "auto"; }
    }
};

window.actualizarUIPortalTS = () => {
    const txt = document.getElementById('txtEstadoPortalTS');
    const desc = document.getElementById('descEstadoPortalTS');
    const indicator = document.getElementById('statIndicatorTS');
    if(!txt) return;

    txt.innerText = "MODO SALIDA";
    txt.style.color = "var(--warning)";
    desc.innerText = "Registrando salida y notificando a padres.";
    indicator.style.background = "var(--warning)";
    indicator.style.boxShadow = "0 0 10px var(--warning)";
};

function renderApoyoTSEscaner() {
  setTimeout(() => { 
    if(window.loadResumenSalida) window.loadResumenSalida();
    if(window.loadGruposControlAsistencia) window.loadGruposControlAsistencia();
    window.actualizarUIPortalTS();
    if(window.startTSScanner) window.startTSScanner('metralleta');
  }, 500);
  return `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
         <h2 class="page-title">Control de Salidas</h2>
         <p class="page-subtitle">Escáner de Salida de Alumnos</p>
      </div>
      <button class="btn btn-outline" onclick="window.stopTSScanner().then(() => window.navigate('/apoyo/dashboard'))" style="border-radius:30px; background:white;">
         <i class="fa-solid fa-house"></i> Volver al Inicio
      </button>
    </div>

    <!-- Panel de Control de Estado TS -->
    <div class="card" style="margin-bottom:24px; border-left: 6px solid var(--warning); background: #fffbeb;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
            <div style="display:flex; align-items:center; gap:15px;">
                <div id="statIndicatorTS" style="width:12px; height:12px; border-radius:50%; background:var(--warning); box-shadow: 0 0 10px var(--warning);"></div>
                <div>
                   <h4 style="margin:0; font-size:1.1rem;">Estado del Portal: <span id="txtEstadoPortalTS">MODO SALIDA</span></h4>
                   <p id="descEstadoPortalTS" style="margin:0; font-size:0.8rem; color:var(--text-muted)">Registrando salida y notificando a padres.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="card" style="text-align:center; padding: 40px; min-height: 440px; display:flex; flex-direction:column; justify-content:center; align-items:center; border-radius:30px; background: white; box-shadow: var(--shadow-xl);">
        
        <div id="ts-status-info" style="margin-bottom:20px;">
            <h3 style="color:var(--warning); font-size:1.5rem; margin-bottom:5px;">Escáner de Salida Activo</h3>
            <p style="color:var(--text-muted); font-size:0.9rem;">Apunte el código QR a la cámara para registrar la salida del alumno.</p>
        </div>

        <div id="reader-ts" style="width:100%; max-width:500px; height:350px; background:#1e293b; border-radius:24px; overflow:hidden; border: 4px solid var(--primary); box-shadow: 0 10px 25px rgba(0,0,0,0.2);"></div>
        
        <div id="ts-feedback" style="margin-top:20px; width:100%; max-width:500px; min-height:80px;"></div>
        
        <div style="display:flex; gap:12px; margin-top:20px;">
            <button id="btn-stop-ts" class="btn btn-outline" onclick="window.stopTSScanner()" style="display:none; border-radius:30px; padding:10px 25px;">
                <i class="fa-solid fa-power-off"></i> Pausar Cámara
            </button>
            <button id="btn-resume-ts" class="btn btn-primary" onclick="window.startTSScanner('metralleta')" style="display:none; border-radius:30px; padding:10px 25px;">
                <i class="fa-solid fa-play"></i> Reanudar Cámara
            </button>
            <button class="btn btn-info" onclick="window.toggleCameraModeTS()" style="border-radius:30px; padding:10px 25px;">
                <i class="fa-solid fa-camera-rotate"></i> Girar Cámara
            </button>
        </div>
    </div>
    
    <!-- RESUMEN EN TIEMPO REAL -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px; margin-top:30px;">
        <div class="card" style="border-radius:24px;">
           <h3 style="margin-bottom:16px; color:var(--warning);"><i class="fa-solid fa-chart-pie"></i> Avance de Salida</h3>
           <div id="resumenSalidaCont" style="display:flex; flex-direction:column; gap:12px; max-height:400px; overflow-y:auto; padding-right:10px;">
              <p style="text-align:center; padding:20px; opacity:0.5;">Cargando estadísticas...</p>
           </div>
        </div>

        <div class="card" style="border-radius:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="margin:0;"><i class="fa-solid fa-clipboard-list"></i> Últimos Registros</h3>
                <input type="date" id="fechaAsistenciaApoyoTS" class="form-control" style="width:auto; height:36px; padding:4px 10px; font-size:0.8rem;" onchange="window.loadAsistenciasApoyo()" value="${new Date().toLocaleDateString('en-CA')}">
            </div>
            <div style="display:flex; gap:10px; margin-bottom:16px;">
                <select class="form-select" id="selGrupoAsistenciaApoyoTS" onchange="window.loadAsistenciasApoyo()" style="flex:1;">
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

function renderDirectivoComunicados() {
  setTimeout(() => {
    if(window.loadComunicadosAdmin) window.loadComunicadosAdmin();
  }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Comunicados y Anuncios Oficiales</h2>
      <p class="page-subtitle">Redacta y publica avisos para toda la comunidad escolar.</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1.5fr; gap:24px; align-items:start;">
      <!-- Creador de Comunicado -->
      <div class="card">
        <h3 style="margin-bottom:16px"><i class="fa-solid fa-pen-to-square text-primary"></i> Nuevo Comunicado</h3>
        <div class="form-group">
          <label class="form-label">Asunto o Título del Aviso</label>
          <input type="text" id="inComTitulo" class="form-input" placeholder="Ej. Junta de padres de familia...">
        </div>
        <div class="form-group">
          <label class="form-label">Dirigido a</label>
          <select id="selComAudiencia" class="form-input">
            <option value="Maestros">Maestros</option>
            <option value="Personal">Maestros, personal de apoyo y biblioteca</option>
            <option value="Alumnos">Alumnos</option>
            <option value="General">Toda la comunidad</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Mensaje del Comunicado</label>
          <textarea id="inComMensaje" class="form-input" style="height:140px; resize:vertical; font-family:inherit;" placeholder="Escribe el contenido del comunicado aquí..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Adjuntar Archivo (Opcional)</label>
          <input type="file" id="inComArchivo" class="form-input" accept=".pdf,.jpg,.png,.docx">
        </div>
        <button id="btnPublicarComunicado" class="btn btn-primary btn-lg" style="width:100%" onclick="window.publicarComunicado()">
          <i class="fa-solid fa-paper-plane"></i> Publicar Comunicado
        </button>
      </div>

      <!-- Historial de Comunicados -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="margin:0"><i class="fa-solid fa-clock-rotate-left text-success"></i> Historial Enviados</h3>
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="btn btn-outline" style="padding:4px 8px; font-size:0.7rem;" onclick="window.loadComunicadosAdmin(new Date().toLocaleDateString('en-CA'))">Hoy</button>
            <input type="date" id="filtroFechaComAdmin" class="form-input" style="padding:6px; font-size:0.85rem;" onchange="window.loadComunicadosAdmin(this.value)">
          </div>
        </div>
        <div id="divComHistorial" style="max-height:500px; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">
          <div style="text-align:center; padding:30px; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i></div>
        </div>
      </div>
    </div>
  `;
}

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

        // CHEQUEO DE ESTUDIO PSICOSOCIAL PENDIENTE
        const { data: psdata } = await supabaseClient.from('estudios_psicosociales').select('id, estado, cuestionarios_psicosociales(titulo, preguntas_json)').eq('alumno_id', data.id).eq('estado', 'pendiente').limit(1);
        if(psdata && psdata.length > 0) {
            window.psicosocialPendienteGlobal = psdata[0].id;
            window.psicoCuestionarioActual = psdata[0].cuestionarios_psicosociales;
            document.getElementById('app').innerHTML = renderAlumnoPsicosocial();
            if(window.loadAlumnoPsicosocialForm) window.loadAlumnoPsicosocialForm();
            return;
        }

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
        <div id="citatoriosPendientesAlumno" style="display:none; margin-bottom:20px;"></div>
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
            .eq('plantel_id', state.plantelId)
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
                .eq('plantel_id', state.plantelId)
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
            .eq('plantel_id', state.plantelId)
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
            if(payload.action === 'graduar_generacion') {
                const { data: grps } = await supabaseClient.from('grupos').select('id').ilike('nombre', `${payload.grado}%`).eq('plantel_id', state.plantelId);
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
                 const { data: sData } = await supabaseClient.from('grupos').select('id').ilike('nombre', payload.sourceNom).eq('plantel_id', state.plantelId).maybeSingle();
                 if(sData) {
                    let targetId;
                    const { data: tData } = await supabaseClient.from('grupos').select('id').eq('nombre', payload.targetNom).eq('plantel_id', state.plantelId).maybeSingle();
                    if(tData) targetId = tData.id;
                    else {
                        const { data: nG } = await supabaseClient.from('grupos').insert([{ nombre: payload.targetNom, plantel_id: state.plantelId }]).select().single();
                        targetId = nG.id;
                    }
                    const { error } = await supabaseClient.from('alumnos').update({ grupo_id: targetId, grado: payload.tGrado }).eq('grupo_id', sData.id);
                    if(error) throw error;
                 }
            }
            else if(payload.action === 'promover_alumno') {
                 let grId;
                 const { data: gData } = await supabaseClient.from('grupos').select('id').eq('nombre', payload.targetNom).eq('plantel_id', state.plantelId).maybeSingle();
                 if(gData) grId = gData.id;
                 else {
                    const { data: nG } = await supabaseClient.from('grupos').insert([{ nombre: payload.targetNom, plantel_id: state.plantelId }]).select().single();
                    grId = nG.id;
                 }
                 const { error } = await supabaseClient.from('alumnos').update({ grupo_id: grId, grado: payload.tGrado }).eq('id', payload.target_id);
                 if(error) throw error;
            }
            else if(payload.action === 'delete_personal') {
                 await supabaseClient.from('asignaciones_maestros').delete().eq('docente_email', payload.email).eq('plantel_id', state.plantelId);
                 const { error: errPerm } = await supabaseClient.from('perfiles_permitidos').delete().eq('id', payload.id_permitido);
                 if(errPerm) throw errPerm;
                 const { data: pExist } = await supabaseClient.from('perfiles').select('id').eq('nombre', payload.nombre).eq('plantel_id', state.plantelId).maybeSingle();
                 if(pExist) await supabaseClient.from('perfiles').delete().eq('id', pExist.id).eq('plantel_id', state.plantelId);
            }
            else if(payload.action === 'delete_alumno') {
                 const idToDelete = payload.id_permitido || payload.target_id;
                 const { error: errAlu } = await supabaseClient.from('alumnos').delete().eq('id', idToDelete);
                 if(errAlu) throw errAlu;
                 const { data: pExist } = await supabaseClient.from('perfiles').select('id').eq('nombre', payload.nombre).eq('plantel_id', state.plantelId).maybeSingle();
                 if(pExist) await supabaseClient.from('perfiles').delete().eq('id', pExist.id).eq('plantel_id', state.plantelId);
                 if(payload.email) await supabaseClient.from('perfiles_permitidos').delete().eq('email', payload.email);
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
                 <option value="biblioteca">Biblioteca / Aula de Medios</option>
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

        const autoPass = 'Edu' + Math.random().toString(36).substring(2, 8).toUpperCase() + '!';

        // 1. Registrar en perfiles_permitidos (Seguimiento de invitaciones)
        const { error: permError } = await supabaseClient.from('perfiles_permitidos').upsert({
            nombre: nombre,
            email: email,
            rol: finalRol,
            plantel_id: finalPlantel,
            temp_pass: autoPass
        }, { onConflict: 'email' });

        if(permError) throw permError;

        // 2. LLAMADA SEGURA AL SERVIDOR (RPC) - Sin exponer llaves secretas
        // Esta función crea el usuario en Auth y en Perfiles de un solo paso
        const { data: rpcData, error: rpcError } = await supabaseClient.rpc('crear_usuario_admin', {
            p_email: email,
            p_password: autoPass,
            p_nombre: nombre,
            p_rol: finalRol,
            p_plantel_id: finalPlantel
        });

        if(rpcError) throw rpcError;
        if(rpcData && rpcData.success === false) throw new Error(rpcData.error || "Error desconocido al crear usuario");

        window.showToast("Personal registrado con éxito. Contraseña: " + autoPass, "success");
        
        // Limpiar formulario
        if(document.getElementById('perNombre')) document.getElementById('perNombre').value = '';
        if(document.getElementById('perEmail')) document.getElementById('perEmail').value = '';
        
        if(window.loadPersonalDirectivo) window.loadPersonalDirectivo();
        if(window.loadListasAdminPersonal) window.loadListasAdminPersonal();
    } catch(e) { 
        console.error(">>> REGISTRATION ERROR:", e);
        alert("Error al registrar personal: " + e.message); 
    }
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
                  ${p.temp_pass ? `
                     <div style="margin-top:4px; display:flex; align-items:center; gap:8px;">
                        <div id="dir-pass-${p.email.replace(/@|\./g,'')}" style="display:none; font-size:0.75rem; color:var(--primary); font-weight:700;">
                           <i class="fa-solid fa-key"></i> ${p.temp_pass}
                        </div>
                        <a href="#" style="font-size:0.7rem; color:var(--primary); font-weight:bold; text-decoration:none;" onclick="event.preventDefault(); const e=document.getElementById('dir-pass-${p.email.replace(/@|\./g,'')}'); e.style.display=(e.style.display==='none'?'block':'none'); this.innerText=(e.style.display==='none'?'Ver Clave':'Ocultar')">Ver Clave</a>
                     </div>
                  ` : ''}
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
      <button class="mobile-nav-toggle" onclick="window.toggleSidebar()">
        <i class="fa-solid fa-bars"></i>
      </button>
      <button class="mobile-logout-btn" onclick="window.logout()" title="Cerrar Sesión">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
      <div class="sidebar-overlay" onclick="window.toggleSidebar()"></div>
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
        // PRIORIDAD MAESTRA v138
        if(state.role === 'master') return renderMasterSaaS();
        if(esAdmin(state.role)) return renderAdminMaestros();
        if(state.role === 'directivo') return renderDirectivoAutorizaciones();
        if(state.role === 'maestro') return renderMaestroAula();
        if(state.role === 'apoyo') return renderApoyoDashboard();
        if(state.role === 'biblioteca') return renderBibliotecaDashboard();
        if(state.role === 'alumno') return renderAlumnoCredencial();
        return `<div style="text-align:center; padding:50px;">
                    <h2>Página no encontrada</h2>
                    <button class="btn btn-primary" onclick="window.logout()">Cerrar sesión y volver</button>
                </div>`;
    case '/master/saas': return (state.isMaster) ? await renderMasterSaaS() : '<h2>Acceso Denegado</h2>';
    case '/master/gestion-perfiles': return (state.isMaster) ? await renderMasterGestionPerfiles() : '<h2>Acceso Denegado</h2>';
    case '/admin/inscripcion': return renderAdminInscripcion();
    case '/admin/expediente': return renderAdminExpediente();
    case '/admin/grupos': return renderAdminGrupos();
    case '/admin/maestros': return renderAdminMaestros();
    case '/admin/calificaciones': return renderAdminCalificaciones();
    case '/admin/tramites': return renderAdminTramites();
    case '/admin/horarios': return renderAdminHorarios();
    case '/admin/calendario': return renderAdminCalendario();
    case '/admin/comunicados': return renderAdminComunicados();
    case '/maestro/aula': return renderMaestroAula();
    case '/maestro/actividades': return renderMaestroActividades();
    case '/maestro/aula-medios': return renderMaestroAulaMedios();
    case '/biblioteca/dashboard': return renderBibliotecaDashboard();
    case '/biblioteca/prestamos': return renderBibliotecaPrestamos();
    case '/biblioteca/historial': return renderBibliotecaHistorial();
    case '/biblioteca/reservas': return renderBibliotecaReservas();
    case '/biblioteca/comunicados': return renderBibliotecaComunicados();
    case '/biblioteca/bitacora': return renderBibliotecaBitacora();
    case '/maestro/listas': return renderMaestroListas();
    case '/maestro/encuadre': return renderMaestroEncuadre();
    case '/maestro/calificaciones': return renderMaestroCalificaciones();
    case '/maestro/bitacora': return renderMaestroBitacora();
    case '/maestro/reportes': return renderApoyoReportes();
    case '/maestro/comunicados': return renderPersonalComunicados('Maestros');
    case '/apoyo/dashboard': return renderApoyoDashboard();
    case '/apoyo/riesgo': return renderApoyoRiesgoAcademico();
    case '/apoyo/reportes': return renderApoyoReportes();
    case '/apoyo/salud': return renderApoyoSalud();
    case '/apoyo/psicosocial': return renderApoyoPsicosocial();
    case '/apoyo/bitacora': return renderApoyoBitacora();
    case '/apoyo/prefectura': return renderApoyoPrefectura();
    case '/apoyo/ts_escaner': return renderApoyoTSEscaner();
    case '/apoyo/comunicados': return renderPersonalComunicados('Apoyo');
    case '/alumno/credencial': return renderAlumnoCredencial();
    case '/alumno/psicosocial': return renderAlumnoPsicosocial();
    case '/alumno/timeline': return renderAlumnoTimeline();
    case '/alumno/boletas': return renderAlumnoBoletas();
    case '/alumno/horario': return renderAlumnoHorario();
    case '/alumno/tramites': return renderAlumnoTramites();
    case '/directivo/autorizaciones': return renderDirectivoAutorizaciones();
    case '/directivo/gestion-personal': return renderDirectivoPersonal();
    case '/directivo/comunicados': return renderDirectivoComunicados();
    case '/maestro/evaluacion': return renderMaestroListas(); // Alias para evaluación rápida
    default: return '<h2>Pantalla en construcción</h2>';
  }
}

async function renderMasterSaaS() {
    try {
        // USAMOS supabaseClient para ver TODO sin restricciones de RLS
        const { data: planteles, error } = await supabaseClient.from('planteles').select('*').order('creado_en', { ascending: false });
        if(error) throw error;

        return `
        <div class="page-header">
          <h2 class="page-title">Centro de Mando SaaS</h2>
          <p class="page-subtitle">Panel Exclusivo de Dueño y Gestión SaaS</p>
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
                   <button class="btn btn-primary" style="flex:1; font-size:0.8rem;" onclick="window.gestionarPlantelSaaS('${p.id}', '${p.nombre}')">
                      <i class="fa-solid fa-eye"></i> Gestionar
                   </button>
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
        // USAR supabaseClient para saltar RLS y borrar CUALQUIER plantel
        const { error } = await supabaseClient.from('planteles').delete().eq('id', id);
        if(error) throw error;
        window.showToast("Plantel y datos eliminados correctamente.", "success");
        renderApp();
    } catch(e) { alert("Error al borrar: " + e.message); }
};

window.gestionarPlantelSaaS = (id, nombre) => {
    state.plantelId = id;
    CONFIG.schoolName = nombre;
    state.path = '/master/gestion-perfiles';
    window.showToast(`Entrando a modo gestión: ${nombre}`, 'success');
    renderApp();
};

window.eliminarPersonaMaster = async (idPermitido, email, nombre, rol = '') => {
    if(!confirm(`⚠️ ¿Deseas ELIMINAR AHORA a "${nombre}" (${email}) del plantel?\nEsta acción revocará su acceso.`)) return;
    try {
        if (rol === 'alumno') {
            await supabaseClient.from('alumnos').delete().eq('contacto_email', email).eq('plantel_id', state.plantelId);
        } else {
            await supabaseClient.from('asignaciones_maestros').delete().eq('docente_email', email).eq('plantel_id', state.plantelId);
        }
        const { error: errPerm } = await supabaseClient.from('perfiles_permitidos').delete().eq('id', idPermitido);
        if(errPerm) throw errPerm;
        const { data: pExist } = await supabaseClient.from('perfiles').select('id').eq('nombre', nombre).eq('plantel_id', state.plantelId).maybeSingle();
        if(pExist) await supabaseClient.from('perfiles').delete().eq('id', pExist.id).eq('plantel_id', state.plantelId);
        
        window.showToast("Usuario eliminado exitosamente.", "success");
        renderApp(); // Reload current view
    } catch(err) {
        console.error(err);
        alert("Fallo al eliminar: " + err.message);
    }
};

async function renderMasterGestionPerfiles() {
    try {
        const { data: users, error } = await supabaseClient.from('perfiles_permitidos')
            .select('*')
            .eq('plantel_id', state.plantelId)
            .order('nombre');
        
        if(error) throw error;

        const categorized = {
            alumno: users.filter(u => u.rol === 'alumno'),
            maestro: users.filter(u => u.rol === 'maestro'),
            apoyo: users.filter(u => u.rol === 'apoyo'),
            admin: users.filter(u => ['admin', 'administrativo', 'directivo'].includes(u.rol)),
            biblioteca: users.filter(u => u.rol === 'biblioteca')
        };

        const renderUserRow = (u) => `
            <div class="card shadow-sm" style="display:flex; flex-direction:column; gap:10px; padding:16px; border:1px solid #edf2f7; border-radius:12px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:40px; height:40px; border-radius:50%; background:#eff6ff; color:#3b82f6; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:1.1rem; border:1px solid #dbeafe;">
                        ${u.nombre?.charAt(0) || '?'}
                    </div>
                    <div style="flex:1; overflow:hidden;">
                        <div style="font-weight:600; font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${u.nombre || 'Sin nombre'}</div>
                        <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">${u.rol}</div>
                    </div>
                    <div style="display:flex; gap:6px;">
                        <button class="btn btn-outline btn-xs" style="padding:6px 10px; border-color:var(--danger); color:var(--danger);" onclick="window.eliminarPersonaMaster('${u.id}', '${u.email}', '${u.nombre}', '${u.rol}')" title="Eliminar Registro"><i class="fa-solid fa-trash"></i> Eliminar</button>
                    </div>
                </div>
                <div style="font-size:0.85rem; background:#f8fafc; padding:10px; border-radius:8px; border:1px dashed #cbd5e1; margin-top:4px;">
                    <div style="color:var(--text-main); margin-bottom:6px;"><i class="fa-solid fa-envelope" style="color:var(--text-muted); width:20px;"></i> <strong>${u.email}</strong></div>
                    <div style="color:var(--text-main);"><i class="fa-solid fa-key" style="color:var(--text-muted); width:20px;"></i> ${u.temp_pass || 'Contraseña configurada por usuario'}</div>
                </div>
            </div>
        `;

        const renderSection = (title, items, icon, color) => `
            <div style="margin-bottom:40px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px; border-bottom:2px solid ${color}22; padding-bottom:8px;">
                    <div style="width:36px; height:36px; border-radius:10px; background:${color}; color:white; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <h3 style="margin:0; font-weight:800; color:#1e293b;">${title} <span style="font-size:0.9rem; font-weight:400; color:var(--text-muted); margin-left:8px;">(${items.length})</span></h3>
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">
                    ${items.length === 0 ? `<div style="grid-column: 1/-1; padding:20px; text-align:center; background:#f8fafc; border-radius:12px; color:var(--text-muted); border:1px dashed #cbd5e1;">Ningún registro en este apartado.</div>` : 
                      items.map(u => renderUserRow(u)).join('')}
                </div>
            </div>
        `;

        return `
            <div class="page-header" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color:white; padding:32px; border-radius:24px; margin-bottom:32px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.1);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h2 class="page-title" style="color:white; margin:0 0 4px 0;">Gestión de Credenciales: ${CONFIG.schoolName}</h2>
                        <p style="margin:0; opacity:0.8; font-size:0.95rem;"><i class="fa-solid fa-fingerprint"></i> Has iniciado sesión como controlador global en esta sede.</p>
                    </div>
                    <button class="btn" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:white;" onclick="window.navigate('/master/saas')">
                        <i class="fa-solid fa-rotate-left"></i> Volver a Planteles
                    </button>
                </div>
            </div>
            
            ${renderSection('Padrón de Alumnos', categorized.alumno, 'fa-user-graduate', '#3b82f6')}
            ${renderSection('Cuerpo de Maestros', categorized.maestro, 'fa-chalkboard-user', '#8b5cf6')}
            ${renderSection('Personal de Apoyo', categorized.apoyo, 'fa-hand-holding-medical', '#10b981')}
            ${renderSection('Equipo Administrativo', categorized.admin, 'fa-user-tie', '#f59e0b')}
            ${renderSection('Biblioteca / Aula de Medios', categorized.biblioteca, 'fa-book-open', '#06b6d4')}
            
            <div style="margin-top:20px; padding:20px; background:#eff6ff; border-radius:16px; border:1px solid #dbeafe; display:flex; gap:16px; align-items:center;">
                <div style="font-size:1.5rem; color:#3b82f6;"><i class="fa-solid fa-circle-info"></i></div>
                <div style="font-size:0.85rem; color:#1e40af;">
                    <strong>Nota para el Creador:</strong> Desde este panel puedes auditar el correo y contraseña temporal de cada usuario. También puedes revocarlos de manera definitiva eliminando su registro de acceso.
                </div>
            </div>
        `;
    } catch(e) { 
        console.error(e);
        return `<div class="error-box" style="padding:40px; border-radius:20px;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size:3rem; margin-bottom:16px;"></i>
            <h3>Error de Conexión</h3>
            <p>${e.message}</p>
            <button class="btn btn-primary" onclick="renderApp()">Reintentar</button>
        </div>`; 
    }
}

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
    if(state.isUpdatingPassword) {
      app.innerHTML = renderSetPasswordScreen();
    } else if (!state.role) {
      app.innerHTML = renderRoleSelector();
    } else {
      const pageContent = await renderPage(state.path);
      // generateHTML es la que pone el sidebar y el wrapper
      app.innerHTML = generateHTML(pageContent);
      if(window.updateNotificationBadge) setTimeout(window.updateNotificationBadge, 500);
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

window.updateNotificationBadge = async (clearAll = false) => {
    if(!state.user || !state.plantelId || !state.role) return;
    try {
        let audArr = ['Todos', 'General'];
        const userRole = state.role || '';
        let creadoEn = null;
        let pId = state.user.id;

        if (userRole === 'maestro' || userRole === 'docente') {
            audArr.push('Maestros', 'Personal');
            audArr.push('Maestro_' + state.user.id);
            const { data: asig } = await supabaseClient.from('asignaciones_maestros').select('grupo_id, target_grado').eq('docente_email', state.user.email);
            if(asig) {
                for (const a of asig) {
                    if(a.grupo_id) audArr.push('Grupo_' + a.grupo_id);
                    else if(a.target_grado) {
                        const { data: grps } = await supabaseClient.from('grupos').select('id').like('nombre', a.target_grado + '%');
                        if(grps) grps.forEach(g => audArr.push('Grupo_' + g.id));
                    }
                }
            }
        } else if (userRole === 'apoyo' || userRole === 'biblioteca') {
            audArr.push('Personal');
        } else if (userRole === 'alumno' || userRole === 'estudiante') {
            audArr.push('Alumnos');
            const { data: al } = await supabaseClient.from('alumnos').select('id, creado_en, grupo_id').eq('contacto_email', state.user.email).maybeSingle();
            if(al) {
                audArr.push('Alumno_' + al.id);
                if(al.grupo_id) audArr.push('Grupo_' + al.grupo_id);
                creadoEn = al.creado_en;
            }
        } else if (userRole === 'directivo' || userRole === 'admin' || userRole === 'administrativo') {
            audArr.push('Maestros', 'Personal', 'Alumnos');
        }

        let query = supabaseClient.from('comunicados').select('id').in('audiencia', audArr).eq('plantel_id', state.plantelId);
        if(creadoEn) query = query.gte('fecha_envio', creadoEn);

        const { data: coms, error } = await query;
        if(error || !coms) return;

        const comIds = coms.map(c => c.id);
        const badgeEl = document.getElementById('notif-badge-avisos');
        
        if(comIds.length === 0) {
            if(badgeEl) badgeEl.style.display = 'none';
            return;
        }

        const { data: vistos } = await supabaseClient.from('comunicados_vistos').select('comunicado_id').eq('perfil_id', pId).in('comunicado_id', comIds);
        const vistosIds = vistos ? vistos.map(v => v.comunicado_id) : [];
        const unread = comIds.length - vistosIds.length;
        
        if (clearAll && unread > 0) {
            const missingIds = comIds.filter(id => !vistosIds.includes(id));
            const inserts = missingIds.map(id => ({ perfil_id: pId, comunicado_id: id }));
            // Insertar para limpiar el badge
            await supabaseClient.from('comunicados_vistos').upsert(inserts, { onConflict: 'perfil_id, comunicado_id', ignoreDuplicates: true });
            if(badgeEl) badgeEl.style.display = 'none';
            return;
        }

        if(badgeEl) {
            if(unread > 0) {
                badgeEl.innerText = unread > 99 ? '99+' : unread;
                badgeEl.style.display = 'inline-block';
            } else {
                badgeEl.style.display = 'none';
            }
        }
    } catch (e) {
        console.error("Error updating badge", e);
    }
};

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
        const nombre = state.userName || email;
        const rol = state.role === 'apoyo' ? 'Prefectura/TS' : (state.role || 'Personal');

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
                <div style="font-size:0.75rem; color:var(--primary); margin-top:6px; background:var(--primary-light); padding:2px 8px; border-radius:6px; width:fit-content; font-weight:600;">
                    <i class="fa-solid fa-user-pen"></i> Autenticado por: ${b.firma_autor ? b.firma_autor.replace(state.user?.email || '---', state.userName || (state.user?.email || 'S/D')) : 'S/D'}
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
            .eq('plantel_id', state.plantelId)
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
            mensaje: mensaje,
            plantel_id: state.plantelId
        }]);

        if(comErr) {
            console.error("Error al insertar comunicado:", comErr);
            throw new Error("Justificante guardado, pero los maestros no pudieron ser notificados. Detalles: " + comErr.message + " " + JSON.stringify(comErr));
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
            .select('*, alumnos(nombre), perfiles(nombre)')
            .order('creado_en', {ascending: false})
            .limit(10);
            
        // 2. Obtener Justificantes
        const { data: justificantes, error: errJust } = await supabaseClient
            .from('justificantes_medicos')
            .select('*, alumnos(nombre, grupos(nombre)), perfiles(nombre)')
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
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Por: ${s.perfiles?.nombre || 'Trabajo Social'}</div>
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
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Por: ${s.perfiles?.nombre || 'Trabajo Social'}</div>
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

        // 4b. Obtener firmas registradas de este alumno
        let firmasHtml = '';
        try {
            const { data: firmas } = await supabaseClient
                .from('firmas_boleta')
                .select('trimestre, nombre_tutor, fecha_firma')
                .eq('alumno_id', alu.id)
                .order('fecha_firma', { ascending: false });

            if(firmas && firmas.length > 0) {
                const firmasBadges = firmas.map(f => {
                    const fecha = new Date(f.fecha_firma).toLocaleDateString('es-MX', { day:'2-digit', month:'long', year:'numeric' });
                    return `
                    <div style="background:white; border:1px solid #d1fae5; border-radius:12px; padding:14px 16px; display:flex; gap:12px; align-items:center;">
                        <div style="width:40px; height:40px; border-radius:10px; background:#d1fae5; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            <i class="fa-solid fa-signature" style="color:#059669; font-size:1.1rem;"></i>
                        </div>
                        <div>
                            <div style="font-size:0.75rem; font-weight:800; color:#059669; text-transform:uppercase; letter-spacing:0.5px;">${f.trimestre} — FIRMADO ✓</div>
                            <div style="font-size:0.9rem; font-weight:600; color:var(--text-main); margin-top:2px;">${f.nombre_tutor}</div>
                            <div style="font-size:0.75rem; color:var(--text-muted);">${fecha}</div>
                        </div>
                    </div>`;
                }).join('');

                firmasHtml = `
                <div style="margin-top:20px; margin-bottom:20px;">
                    <h3 style="margin:0 0 12px 0; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); font-weight:700;">
                        <i class="fa-solid fa-signature"></i> Firmas de Boleta Registradas
                    </h3>
                    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:10px;">
                        ${firmasBadges}
                    </div>
                </div>`;
            }
        } catch(e) { console.warn('[FirmaQR] No se pudo cargar el historial de firmas del alumno:', e); }

        // 4. Obtener calificaciones crudas
        const { data: califs } = await supabaseClient.from('calificaciones')
           .select('*')
           .eq('alumno_id', alu.id)
           .order('trimestre', { ascending: false });


        if((!califs || califs.length === 0) && (!reportes || reportes.length === 0) && !storageHtml && !firmasHtml) {
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
        const periodos = [...new Set((califs || []).map(c => c.trimestre))].sort((a,b) => b-a);
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

            ${firmasHtml}

            ${reportHtml}

            ${tablesHtml || ''}

            <div style="background:var(--page-bg); padding:20px; border-radius:15px; border:1px solid var(--border); margin-top:30px; text-align:center;">
                <p style="font-size:0.85rem; color:var(--text-main); margin-bottom:5px; font-weight:600;">⚠️ Información Importante</p>
                <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin:0;">
                    Las boletas oficiales con validez administrativa se entregarán de manera física e impresa en las fechas programadas por la institución para la firma de padres de familia y tutores.
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

        // 2. Si no hay archivo oficial, generar el PDF informativo con vista de impresión institucional
        const printWindow = window.open('', '_blank');
        
        // Calcular ciclo escolar actual basado en el mes (Agosto inicia nuevo ciclo)
        const currentYear = new Date().getFullYear();
        const cicloEscolar = (new Date().getMonth() >= 7) ? `${currentYear} - ${currentYear + 1}` : `${currentYear - 1} - ${currentYear}`;
        
        const gradesHtml = Array.from(document.querySelectorAll('.grades-table-pdf-source')).map(table => {
            const t = table.cloneNode(true);
            t.style.width = "100%";
            t.style.borderCollapse = "collapse";
            t.style.marginBottom = "30px";
            
            // Forzar estilos de tabla institucionales
            t.querySelectorAll('th, td').forEach(cell => {
                cell.style.border = "1px solid #000";
                cell.style.padding = "8px 10px";
                cell.style.fontSize = "12px";
                if(cell.tagName.toLowerCase() === 'td') {
                    // Solo alinear al centro si es un número corto, la materia se deja a la izquierda
                    cell.style.textAlign = (cell.innerText.length > 5) ? "left" : "center";
                }
            });
            t.querySelectorAll('th').forEach(th => {
                th.style.backgroundColor = "#e5e7eb";
                th.style.fontWeight = "bold";
                th.style.textAlign = "center";
                th.style.textTransform = "uppercase";
            });
            
            return `<div class="trim-title">EVALUACIÓN DEL TRIMESTRE ${table.dataset.trimestre}</div>${t.outerHTML}`;
        }).join('');

        // 3. Buscar si existe una firma digital en firmas_boleta
        let firmaTutorHtml = `
            <div class="signature-line"></div>
            <div class="signature-title">Padre de Familia o Tutor</div>
            <div style="font-size:11px; margin-top:5px; color:#555;">Firma de Enterado</div>
        `;
        try {
            const { data: firma } = await supabaseClient.from('firmas_boleta')
                .select('nombre_tutor, fecha_firma')
                .eq('alumno_id', aluId)
                .order('fecha_firma', { ascending: false })
                .limit(1)
                .maybeSingle();
            
            if(firma) {
                const fechaFormat = new Date(firma.fecha_firma).toLocaleDateString('es-MX', { year:'numeric', month:'short', day:'numeric' });
                firmaTutorHtml = `
                    <div class="signature-line" style="display:flex; align-items:flex-end; justify-content:center; padding-bottom:4px;">
                        <span style="font-family:'Courier New', monospace; font-size:15px; font-weight:bold; color:#1e3a8a; font-style:italic;">${firma.nombre_tutor}</span>
                    </div>
                    <div class="signature-title">Padre de Familia o Tutor</div>
                    <div style="font-size:11px; margin-top:5px; color:#059669; font-weight:bold;">
                        <span style="font-family:sans-serif;">✔ Firmado digitalmente el ${fechaFormat}</span>
                    </div>
                `;
            }
        } catch(e) { console.warn('Error fetching firma:', e); }

        const plantelName = (typeof state !== 'undefined' && state && state.plantelNombre) ? state.plantelNombre : CONFIG.schoolName;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Reporte Individual de Calificaciones - ${nombre}</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.4; margin: 0; }
                        .header { text-align: center; margin-bottom: 20px; border-bottom: 4px double #1e3a8a; padding-bottom: 20px; }
                        .header h1 { margin: 0; color: #1e3a8a; font-size: 26px; text-transform: uppercase; letter-spacing: 1px; }
                        .header h2 { margin: 6px 0 0 0; color: #333; font-size: 16px; font-weight: bold; letter-spacing: 0.5px; }
                        .header h3 { margin: 4px 0 0 0; color: #555; font-size: 14px; font-weight: normal; }
                        
                        .meta-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; font-size: 14px; background: #f8fafc; padding: 18px; border: 1px solid #cbd5e1; border-radius: 8px; }
                        .meta-info div { margin-bottom: 6px; }
                        .meta-info strong { color: #1e3a8a; display: inline-block; width: 130px; }
                        
                        .trim-title { font-size: 15px; font-weight: bold; color: #1e3a8a; margin-bottom: 12px; border-left: 5px solid #1e3a8a; padding-left: 10px; text-transform: uppercase; background: #f1f5f9; padding-top: 4px; padding-bottom: 4px; }
                        
                        .signatures { display: flex; justify-content: space-around; margin-top: 70px; page-break-inside: avoid; }
                        .signature-box { text-align: center; width: 260px; }
                        .signature-line { border-bottom: 1px solid #000; height: 60px; margin-bottom: 10px; }
                        .signature-title { font-size: 13px; font-weight: bold; color: #111; text-transform: uppercase; }
                        
                        .footer { margin-top: 50px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 15px; }
                        
                        @media print {
                            body { padding: 0; margin: 20px; }
                            button { display: none; }
                            .meta-info { border: 1px solid #000; background: transparent; }
                            .header { border-bottom: 3px solid #000; }
                            .header h1, .header h2, .trim-title, .meta-info strong { color: #000; }
                            .trim-title { border-left: 5px solid #000; background: transparent; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${plantelName.toUpperCase()}</h1>
                        <h2>SISTEMA EDUCATIVO INSTITUCIONAL</h2>
                        <h3>BOLETA INDIVIDUAL DE EVALUACIONES</h3>
                    </div>
                    
                    <div class="meta-info">
                        <div>
                            <div><strong>Alumno(a):</strong> <span style="text-transform: uppercase; font-weight: bold;">${nombre}</span></div>
                            <div><strong>Matrícula/CURP:</strong> <span style="text-transform: uppercase;">${matricula || 'N/A'}</span></div>
                        </div>
                        <div>
                            <div><strong>Ciclo Escolar:</strong> ${cicloEscolar}</div>
                            <div><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' })}</div>
                        </div>
                    </div>

                    ${gradesHtml}

                    <div class="signatures">
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <div class="signature-title">Dirección del Plantel</div>
                            <div style="font-size:11px; margin-top:5px; color:#555;">Firma y Sello Oficial</div>
                        </div>
                        <div class="signature-box">
                            ${firmaTutorHtml}
                        </div>
                    </div>

                    <div class="footer">
                        <p>Documento de carácter informativo generado mediante la Plataforma de Control Escolar <strong>${CONFIG.appName}</strong>.</p>
                        <p>Para poseer validez oficial ante las autoridades educativas, este formato requiere las firmas y los sellos originales de la institución.</p>
                    </div>
                    
                    <script>
                        setTimeout(() => { window.print(); }, 800);
                    </script>
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
        
        const { data: al } = await supabaseClient
            .from('alumnos')
            .select('id, creado_en')
            .or(`contacto_email.eq.${u.data.user.email},perfil_id.eq.${u.data.user.id}`)
            .maybeSingle();

        if(al) {
            console.log(">>> [TIMELINE] Alumno detectado:", al.id, "| Inscrito en:", al.creado_en);
            audArr.push('Alumno_' + al.id);
            if(window.loadCitatoriosAlumno) window.loadCitatoriosAlumno(al.id);
        } else {
            console.warn(">>> [TIMELINE] No se encontró vínculo de Alumno para el usuario logueado.");
        }
        
        // Obtener vistos
        const { data: vistos } = await supabaseClient.from('comunicados_vistos').select('comunicado_id').eq('perfil_id', u.data.user.id);
        const vistosIds = vistos ? vistos.map(v => v.comunicado_id) : [];

        console.log(">>> [TIMELINE] Buscando comunicados para audiencia:", audArr);
        let query = supabaseClient.from('comunicados').select('*').in('audiencia', audArr).eq('plantel_id', state.plantelId);
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
           const esFirmaBoletaAviso = c.tipo === 'aviso_firma_boleta';
           const tipoColor = esFirmaBoletaAviso ? '#d97706' : (esEncuadre ? 'var(--warning)' : (c.audiencia === 'General' ? 'var(--success)' : 'var(--danger)'));
           const icon = esFirmaBoletaAviso ? 'fa-file-invoice' : (esEncuadre ? 'fa-file-signature' : 'fa-bullhorn');

           let btnAccion = '';
           if(!esVisto) {
               if(c.tipo === 'aviso_firma_boleta') {
                   btnAccion = `<button onclick="window.firmarBoletaDesdeTimeline('${c.id}', this)" class="btn btn-sm btn-primary" style="font-size:0.75rem; display:flex; align-items:center; gap:6px; background:#d97706; border-color:#d97706;">
                       <i class="fa-solid fa-signature"></i> Firmar de Enterado
                   </button>`;
               } else if(esEncuadre) {
                   btnAccion = `<button onclick="window.firmarEncuadreDesdeTimeline('${c.id}', this)" class="btn btn-sm btn-primary" style="font-size:0.75rem; display:flex; align-items:center; gap:6px;">
                       <i class="fa-solid fa-signature"></i> Firmar de Enterado
                   </button>`;
               } else {
                   btnAccion = `<button onclick="window.marcarAvisoEnterado('${c.id}')" class="btn btn-sm" style="font-size:0.7rem; background:var(--page-bg); color:var(--text-main); border:1px solid var(--border)"><i class="fa-solid fa-check"></i> Enterado</button>`;
               }
           } else {
               btnAccion = (esEncuadre || c.tipo === 'aviso_firma_boleta')
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
        
        if (window.updateNotificationBadge) setTimeout(() => window.updateNotificationBadge(true), 1000);
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

window.loadCitatoriosAlumno = async (alumnoId) => {
    const cont = document.getElementById('citatoriosPendientesAlumno');
    if(!cont) return;
    try {
        const { data, error } = await supabaseClient
            .from('citatorios')
            .select('*')
            .eq('alumno_id', alumnoId)
            .neq('estado', 'atendido')
            .order('creado_en', { ascending: false });

        if(error) throw error;
        if(!data || data.length === 0) {
            cont.style.display = 'none';
            return;
        }

        cont.style.display = 'block';
        cont.innerHTML = `
            <div style="background:#fff7ed; border:1px solid #ffedd5; border-radius:16px; padding:16px; box-shadow:var(--shadow-md); margin-bottom:24px;">
                <h3 style="color:#9a3412; margin-top:0; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                    <i class="fa-solid fa-envelope-open-text"></i> Citatorios de Padres
                </h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${data.map(c => {
                        const isEnterado = c.estado === 'enterado';
                        return `
                            <div style="background:white; border:1px solid #fed7aa; padding:14px; border-radius:12px; box-shadow:var(--shadow-sm);">
                                <div style="display:flex; justify-content:space-between; margin-bottom:8px; align-items:center;">
                                    <span class="badge" style="background:${isEnterado ? '#22c55e' : '#f97316'}; color:white; font-size:0.6rem; padding:2px 8px;">
                                        ${isEnterado ? '<i class="fa-solid fa-check"></i> ENTERADO' : '<i class="fa-solid fa-clock"></i> POR FIRMAR'}
                                    </span>
                                    <small style="color:var(--text-muted); font-size:0.7rem;">${new Date(c.creado_en).toLocaleDateString()}</small>
                                </div>
                                <p style="font-size:0.85rem; margin:0 0 10px 0; color:var(--text-main); line-height:1.4;"><b>Motivo:</b> ${c.motivo}</p>
                                ${c.fecha_cita ? `<p style="font-size:0.8rem; color:var(--primary); margin:0 0 10px 0;"><b>Cita programada:</b> ${new Date(c.fecha_cita).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}</p>` : ''}
                                
                                ${!isEnterado ? `
                                    <div style="border-top:1px dashed #fed7aa; padding-top:10px; margin-top:5px;">
                                        <p style="font-size:0.7rem; color:var(--danger); margin-bottom:8px;">* Se requiere que su padre o tutor firme de enterado ingresando su nombre:</p>
                                        <div style="display:flex; gap:8px;">
                                            <input type="text" id="firmaTutor-${c.id}" class="form-input" placeholder="Nombre completo..." style="height:38px; font-size:0.8rem; flex:1; border-color:#fed7aa;">
                                            <button class="btn btn-primary" style="height:38px; padding:0 20px; font-size:0.8rem; background:#9a3412; border:none;" onclick="window.firmarCitatorio('${c.id}')">Firmar</button>
                                        </div>
                                    </div>
                                ` : `
                                    <div style="background:#f0fdf4; padding:8px; border-radius:8px; border:1px solid #bbf7d0; font-size:0.75rem; color:#166534;">
                                        <i class="fa-solid fa-check-double"></i> <b>Acuse de Recibo:</b> ${c.firma_enterado}
                                    </div>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } catch(e) { console.error("Error load citatorios alumno:", e); }
};

window.firmarCitatorio = async (id) => {
    const inp = document.getElementById(`firmaTutor-${id}`);
    const firma = inp ? inp.value : '';
    if(!firma.trim()) return alert("Por favor, ingresa el nombre del padre o tutor para firmar.");
    
    try {
        const { error } = await supabaseClient
            .from('citatorios')
            .update({
                estado: 'enterado',
                firma_enterado: firma.trim(),
                fecha_enterado: new Date().toISOString()
            })
            .eq('id', id);

        if(error) throw error;
        window.showToast("Citatorio firmado por el tutor", "success");
        window.loadTimelineAlumno();
    } catch(e) { 
        console.error(e); 
        window.showToast("Error al firmar", "error"); 
    }
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
                    .eq('plantel_id', state.plantelId)
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
            .eq('plantel_id', state.plantelId)
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
        let qAl = supabaseClient.from('alumnos').select('id, nombre, matricula').eq('plantel_id', state.plantelId).order('nombre');
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
    
    // Rango de fecha con offset de zona horaria local (evita problemas UTC)
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localStart = new Date(`${targetDate}T00:00:00`);
    const localEnd = new Date(`${targetDate}T23:59:59`);
    const startOfDay = new Date(localStart.getTime() - tzOffset).toISOString();
    const endOfDay = new Date(localEnd.getTime() - tzOffset).toISOString();

    cont.innerHTML = '<div style="padding:40px; text-align:center;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="color:var(--text-muted); margin-top:10px;">Actualizando cronología...</p></div>';
    
    try {
        const uRes = await supabaseClient.auth.getUser();
        const userRole = state.role || '';

        // Base: siempre reciben 'Todos' (comunicados a toda la institución)
        let audArr = ['Todos', 'General'];

        // Añadir audiencias específicas según el rol
        if (userRole === 'maestro' || userRole === 'docente') {
            audArr.push('Maestros', 'Personal');
        } else if (userRole === 'apoyo' || userRole === 'biblioteca') {
            audArr.push('Personal');
        } else if (userRole === 'alumno' || userRole === 'estudiante') {
            audArr.push('Alumnos');
        } else if (userRole === 'directivo' || userRole === 'admin' || userRole === 'administrativo') {
            audArr.push('Maestros', 'Personal', 'Alumnos');
        }
        
        if(uRes.data?.user) {
            const userId = uRes.data.user.id;
            const email = uRes.data.user.email;
            
            // Canal personal del usuario
            audArr.push('Maestro_' + userId);
            
            // Cargar asignaciones (grupos específicos y grados completos)
            const { data: asig } = await supabaseClient.from('asignaciones_maestros').select('grupo_id, target_grado').eq('docente_email', email);
            
            if(asig) {
                for (const a of asig) {
                    if(a.grupo_id) {
                        audArr.push('Grupo_' + a.grupo_id);
                    } else if(a.target_grado) {
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


        let query = supabaseClient.from('comunicados')
           .select('*, perfiles(nombre)')
           .in('audiencia', audArr)
           .gte('fecha_envio', startOfDay)
           .lte('fecha_envio', endOfDay)
           .order('fecha_envio', { ascending: false });

        // Filtrar por plantel si el usuario tiene uno asignado
        if (state.plantelId) query = query.eq('plantel_id', state.plantelId);

        let { data, error } = await query;
           
        if(error) throw error;
        
        // Filtrar avisos de horarios (solo deben verse en el perfil de estudiante)
        if (data && userRole !== 'alumno') {
            data = data.filter(c => !c.titulo?.includes('HORARIO DE CLASE DISPONIBLE'));
        }
        
        // --- RESOLUCIÓN DE AUDIENCIAS (Humano-Leíble) ---
        const groupIds = [];
        const studentIds = [];
        data.forEach(c => {
            if(c.audiencia.startsWith('Grupo_')) groupIds.push(c.audiencia.replace('Grupo_', ''));
            if(c.audiencia.startsWith('Alumno_')) studentIds.push(c.audiencia.replace('Alumno_', ''));
        });

        const nameMap = { 'General': 'Toda la comunidad', 'Todos': 'Toda la comunidad', 'Maestros': 'Maestros', 'Personal': 'Maestros, personal de apoyo y biblioteca', 'Alumnos': 'Alumnos', 'Apoyo': 'Personal de Apoyo' };
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
        if (window.updateNotificationBadge) setTimeout(() => window.updateNotificationBadge(true), 1000);
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
               .eq('plantel_id', state.plantelId)
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
           .eq('plantel_id', state.plantelId)
           .eq('maestro_id', currentUser.data.user.id)
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
            let qAlu = supabaseClient.from('alumnos').select('id, nombre').eq('plantel_id', act.plantel_id);
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
    window._lastEvalParams = [actId, actTitulo, actGrupoId, actTargetGrado, actMateria];
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
    
    qrEvalScanner.start({ facingMode: state.cameraMode }, { fps: 10, qrbox: {width: 250, height: 250} }, async (decodedText) => {
        try { await qrEvalScanner.stop(); } catch(e){}
        document.getElementById('qr-reader-eval').innerHTML = '<div style="color:var(--success); text-align:center; padding:20px;"><i class="fa-solid fa-check-circle fa-3x"></i><p>QR Detectado</p></div>';
        
        try {
           // Buscamos por matrícula (que es lo que se codifica en el QR)
           const { data: alumno } = await supabaseClient.from('alumnos').select('id, nombre, grupo_id, grado, taller').eq('matricula', decodedText).eq('plantel_id', state.plantelId).single();
           
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
        let alumnosQuery = supabaseClient.from('alumnos').select('id, nombre, matricula, contacto_email').eq('plantel_id', state.plantelId);
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

            let actsQuery = supabaseClient.from('actividades_maestro').select('id, titulo, rubro_name, rubro_peso, trimestre').eq('plantel_id', state.plantelId);
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
                .eq('materia', materiaLimpia)
                .eq('plantel_id', state.plantelId);
                
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
    } finally {
        if(window.updateMaestroDeadlineStatus) window.updateMaestroDeadlineStatus();
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
        if(window.updateMaestroDeadlineStatus) window.updateMaestroDeadlineStatus();
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
        let alumnosQuery = supabaseClient.from('alumnos').select('id, nombre, matricula').eq('plantel_id', state.plantelId);
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
            .eq('plantel_id', state.plantelId)
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
                .eq('plantel_id', state.plantelId)
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

    // VALIDACIÓN DE PERIODO (v112+)
    try {
        const { data: periodo } = await supabaseClient.from('periodos_calificaciones').select('*').eq('trimestre', trim).eq('plantel_id', state.plantelId).maybeSingle();
        if(periodo) {
            if(periodo.bloqueado) {
                return alert("⚠️ El sistema de envío está BLOQUEADO por la administración para este trimestre.");
            }
            if(periodo.fecha_limite) {
                const deadline = new Date(periodo.fecha_limite);
                if(new Date() > deadline) {
                    return alert("⚠️ La fecha límite de envío ha pasado (" + deadline.toLocaleString() + "). Contacta a administración para una prórroga.");
                }
            }
        }
    } catch(e) { console.error("Error validando periodo:", e); }
    
    const [idVal, materiaText] = selectVal.split('::');
    const inputs = document.querySelectorAll('.input-calificacion');
    
    if(inputs.length === 0) return alert('No hay alumnos para evaluar.');
    
    const trimName = trim === '4' ? "Final (Anual)" : "Trimestre " + trim;
    if(!confirm('¿Estás seguro de asentar estas calificaciones para el ' + trimName + '? No podrás modificarlas después.')) return;
    
    const btn = document.querySelector('[onclick="window.sellarYEnviarCalificaciones()"]') 
             || document.getElementById('btnSellarCalificaciones');
    const oldHtml = btn ? btn.innerHTML : '';
    if(btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...'; btn.disabled = true; }
    
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
        if(btn) { btn.innerHTML = oldHtml; btn.disabled = false; }
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
                    const autoPass = 'Edu' + Math.random().toString(36).substring(2, 8).toUpperCase() + '!';

                    const { error } = await supabaseClient.from('perfiles_permitidos').upsert([{ 
                        email: emailValue, 
                        rol: rolValue, 
                        nombre: nombreValue,
                        plantel_id: currentPlantelID,
                        temp_pass: autoPass
                    }], { onConflict: 'email' });

                    if(error) throw error;

                    // REGISTRO SEGURO VÍA RPC (sin claves expuestas)
                    const { data: rpcData, error: rpcError } = await supabaseClient.rpc('crear_usuario_admin', {
                        p_email: emailValue,
                        p_password: autoPass,
                        p_nombre: nombreValue,
                        p_rol: rolValue,
                        p_plantel_id: currentPlantelID
                    });

                    if(rpcError) throw rpcError;
                    if(rpcData && rpcData.success === false) throw new Error(rpcData.error || "Error desconocido al crear usuario");

                    showToast("Personal registrado con éxito. Contraseña: " + autoPass, "success");

                    if(window.loadSelectsMaestros) window.loadSelectsMaestros();
                    if(window.loadListasAdminPersonal) window.loadListasAdminPersonal();
                } catch(e) { 
                    console.error("Error global en registro:", e);
                    showToast("Error: " + e.message, "error"); 
                }
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
              const { data } = await supabaseClient.from('alumnos').select('id, nombre, matricula').eq('plantel_id', state.plantelId).or(`nombre.ilike.%${val}%,matricula.ilike.%${val}%`).limit(5);
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
              const { data } = await supabaseClient.from('alumnos').select('id, nombre, matricula').eq('plantel_id', state.plantelId).or(`nombre.ilike.%${val}%,matricula.ilike.%${val}%`).limit(5);
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

            const autoPass = 'st' + Math.floor(Math.random() * 9000 + 1000);

            await supabaseClient.from('perfiles_permitidos').upsert([{ 
                email, 
                rol: 'alumno', 
                nombre: nombre,
                plantel_id: finalPlantel,
                temp_pass: autoPass,
                estado: 'activo'
            }], { onConflict: 'email' });

            // Normalización: Asegurar formato X°Y (ej: 2°A)
            let gradoLimpio = grado.replace('°', '');
            const grupoCompleto = `${gradoLimpio}°${grupoNom.toUpperCase()}`;
            let grId;
            const { data: gData } = await supabaseClient.from('grupos').select('id').eq('nombre', grupoCompleto).eq('plantel_id', state.plantelId).maybeSingle();
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

            // CREAR CUENTA DE ACCESO EN AUTH (sin esto el alumno no puede iniciar sesión)
            const { data: rpcData, error: rpcError } = await supabaseClient.rpc('crear_usuario_admin', {
                p_email: email,
                p_password: autoPass,
                p_nombre: nombre,
                p_rol: 'alumno',
                p_plantel_id: finalPlantel
            });
            if(rpcError) throw rpcError;
            if(rpcData && rpcData.success === false) throw new Error(rpcData.error || 'Error al crear cuenta de acceso');

            alert(`✅ Alumno inscrito exitosamente.\n\nMatrícula: ${matricula}\nCorreo: ${email}\nContraseña Temporal: ${autoPass}`);
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
            .select('*').eq('grupo_id', String(window.currentAulaGrupoId)).eq('materia', materia).eq('fecha', hoy).eq('plantel_id', state.plantelId).maybeSingle();

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
        }, { onConflict: 'plantel_id, grupo_id, materia, fecha' });

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
    await window._mScanner.start({ facingMode: state.cameraMode }, { fps: 10, qrbox: { width: 250, height: 250 } }, 
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
            supabaseClient.from('asistencia_sesiones').select('estado').eq('grupo_id', String(grupoId)).eq('materia', materia).eq('fecha', hoy).eq('plantel_id', state.plantelId).maybeSingle(),
            supabaseClient.from('alumnos').select('id, nombre, grupo_id, grado, taller').eq('matricula', matricula).eq('plantel_id', state.plantelId).maybeSingle()
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
        
        await supabaseClient.from('asistencia_sesiones').update({ estado: 'cerrado' }).eq('grupo_id', grupoId).eq('materia', materia).eq('fecha', hoy).eq('plantel_id', state.plantelId);
        
        let queryAl = supabaseClient.from('alumnos').select('id').eq('plantel_id', state.plantelId);
        if(grupoId.startsWith('grado:')) queryAl = queryAl.eq('grado', grupoId.split(':')[1].split('|')[0]);
        else queryAl = queryAl.eq('grupo_id', grupoId);
        
        const { data: todos } = await queryAl;
        let queryReg = supabaseClient.from('asistencias')
            .select('alumno_id, estado, materia')
            .gte('creado_en', hoy + 'T00:00:00')
            .lte('creado_en', hoy + 'T23:59:59')
            .eq('plantel_id', state.plantelId);
            
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
            // 1. Registrar las faltas en la tabla de asistencias
            await supabaseClient.from('asistencias').insert(faltantes.map(al => ({
                alumno_id: al.id, 
                registrador_id: u.data.user.id, 
                estado: 'Falta', 
                materia: materia, // Importante registrar la materia
                grupo_id: grupoId.startsWith('grado:') ? null : grupoId,
                plantel_id: state.plantelId
            })));

            // 2. Enviar comunicados de inasistencia (Aviso a los alumnos/padres)
            await supabaseClient.from('comunicados').insert(faltantes.map(al => ({
                autor_id: u.data.user.id, 
                titulo: '⚠️ AVISO DE INASISTENCIA', 
                audiencia: 'Alumno_' + al.id,
                mensaje: `Se ha registrado una FALTA en la materia: "${materia}" el día de hoy (${hoy}). \n\nRecuerda que las inasistencias acumuladas afectan tu porcentaje de aprobación.`,
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
                { facingMode: state.cameraMode },
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
            .eq('plantel_id', state.plantelId)
            .maybeSingle();

        // Si no se encontró por matrícula, intentar por ID (solo si tiene formato UUID)
        if(!alu && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(qrText)) {
            const { data: aluId } = await supabaseClient.from('alumnos')
                .select('id, nombre')
                .eq('id', qrText)
                .eq('plantel_id', state.plantelId)
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

window.tsScanMode = 'metralleta';
window._tsCurrentCamera = "environment";
window.toggleCameraModeTS = () => {
    window._tsCurrentCamera = window._tsCurrentCamera === "environment" ? "user" : "environment";
    window.stopTSScanner().then(() => window.startTSScanner(window.tsScanMode));
};

window.stopTSScanner = async () => {
    try {
        if(window._tsScanner) {
            await window._tsScanner.stop().catch(()=>{});
            window._tsScanner = null;
        }
        document.getElementById('btn-stop-ts').style.display = 'none';
        document.getElementById('btn-resume-ts').style.display = 'inline-block';
    } catch(e) { console.error("Error stop TS scanner", e); }
};

window.startTSScanner = async (mode = 'metralleta') => {
    window.tsScanMode = mode;
    const reader = document.getElementById('reader-ts');
    if(!reader) return;

    document.getElementById('btn-stop-ts').style.display = 'inline-block';
    document.getElementById('btn-resume-ts').style.display = 'none';

    try {
        if(window._tsScanner) {
            await window._tsScanner.stop().catch(()=>{});
            window._tsScanner = null;
        }
        
        window._tsScanner = new Html5Qrcode("reader-ts");
        
        await window._tsScanner.start(
            { facingMode: window._tsCurrentCamera },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText, decodedResult) => {
                if(window.tsScanMode === 'metralleta') {
                    if(window._lastScanned !== decodedText) {
                        window._lastScanned = decodedText;
                        window.registrarAsistenciaTS(decodedText.trim());
                        setTimeout(() => { window._lastScanned = null; }, 3000);
                    }
                } else {
                    window.registrarAsistenciaTS(decodedText.trim());
                    window.stopTSScanner();
                }
            },
            (errorMessage) => { /* ignore */ }
        );
    } catch(e) { console.error(e); }
};

window.registrarAsistenciaTS = async (qrText) => {
    try {
        const estadoRegistro = 'Salida';
        
        let { data: alu, error: searchErr } = await supabaseClient.from('alumnos')
            .select('id, nombre')
            .eq('matricula', qrText)
            .eq('plantel_id', state.plantelId)
            .maybeSingle();

        if(!alu && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(qrText)) {
            const { data: aluId } = await supabaseClient.from('alumnos')
                .select('id, nombre')
                .eq('id', qrText)
                .eq('plantel_id', state.plantelId)
                .maybeSingle();
            alu = aluId;
        }

        if(!alu) {
            const feedback = document.getElementById('ts-feedback');
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
                clearTimeout(window._tsFeedbackTimeout);
                window._tsFeedbackTimeout = setTimeout(() => { feedback.innerHTML = ''; }, 5000);
            }
            window.showToast("QR no reconocido", "warning");
            return;
        }

        const uRes = await supabaseClient.auth.getUser();
        const fechaHoy = new Date().toLocaleDateString('en-CA');
        const horaActual = new Date().toLocaleTimeString('en-GB');
        
        const { error } = await supabaseClient.from('accesos_plantel').insert([{
            alumno_id: alu.id,
            estado: estadoRegistro,
            registrador_id: uRes.data.user?.id,
            fecha: fechaHoy,
            hora: horaActual,
            plantel_id: state.plantelId
        }]);

        if(error) {
            console.error(">>> ERROR REGISTRO QR:", error);
            window.showToast("Error BD: " + error.message, "error");
            return;
        }

        const { error: comErr } = await supabaseClient.from('comunicados').insert([{
            autor_id: uRes.data.user?.id,
            titulo: "Registro de Salida del Plantel",
            mensaje: `Estimado padre de familia/tutor: \nTu hijo(a) ${alu.nombre} ha registrado su salida del plantel el día de hoy a las ${horaActual}.`,
            audiencia: `Alumno_${alu.id}`,
            plantel_id: state.plantelId
        }]);
        if(comErr) console.error("Error al notificar salida:", comErr);

        const feedback = document.getElementById('ts-feedback');
        if(feedback) {
            const color = 'var(--warning)';
            feedback.innerHTML = `
                <div class="card shadow-md" style="background:${color}; color:white; padding:15px; border-radius:15px; display:flex; align-items:center; gap:15px; margin-bottom:10px; animation: popIn 0.3s ease-out;">
                    <i class="fa-solid fa-circle-check" style="font-size:2.5rem;"></i>
                    <div style="text-align:left;">
                        <div style="font-size:0.75rem; opacity:0.9; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">
                            SALIDA REGISTRADA
                        </div>
                        <div style="font-size:1.2rem; font-weight:800; line-height:1.2;">${alu.nombre}</div>
                        <div style="font-size:0.8rem; margin-top:3px; opacity:0.9;">${horaActual}</div>
                    </div>
                </div>
            `;
            clearTimeout(window._tsFeedbackTimeout);
            window._tsFeedbackTimeout = setTimeout(() => { feedback.innerHTML = ''; }, 3000);
        }

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/766/766-preview.mp3');
        audio.play().catch(()=>{});

        if(state.path === '/apoyo/ts_escaner') {
            window.loadResumenSalida();
            window.loadAsistenciasApoyo();
        }
    } catch(e) { 
        console.error("Error registro acceso TS:", e);
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
            .eq('plantel_id', state.plantelId)
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
        let query = supabaseClient.from('alumnos').select('id, nombre').eq('plantel_id', state.plantelId);
        
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
        let q = supabaseClient.from('encuadres').select('rubros').eq('plantel_id', state.plantelId).eq('materia', mat).eq('trimestre', trimSelected);
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
            .eq('plantel_id', state.plantelId)
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
            .eq('plantel_id', state.plantelId)
            .eq('maestro_id', u.data.user.id)
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
                const { error } = await supabaseClient.from('encuadres').update(payloadEnc).eq('id', encExistente.id);
                if(error) throw error;
            } else {
                const { error } = await supabaseClient.from('encuadres').insert([payloadEnc]);
                if(error) throw error;
            }
        } else {
            const { error } = await supabaseClient.from('encuadres').upsert(payloadEnc, { onConflict: 'grupo_id, materia, trimestre' });
            if(error) throw error;
        }

        // 2. Obtener los alumnos del grupo/grado para notificarles
        let alumnosQuery = supabaseClient.from('alumnos').select('id, nombre').eq('plantel_id', state.plantelId);
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
                .eq('plantel_id', state.plantelId)
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
            }).eq('plantel_id', state.plantelId).eq('maestro_id', u.data.user.id).eq('materia', mat).eq('trimestre', window.currentTrimestre || 1);

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
        const uid = (await supabaseClient.auth.getUser()).data.user.id;
        const { data: bitacoras, error } = await supabaseClient.from('bitacora_maestro')
            .select('*')
            .eq('fecha_referencia', fecha)
            .eq('plantel_id', state.plantelId)
            .eq('perfil_id', uid)
            .order('creado_en', { ascending: false });
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
        const { data: grupos, error } = await supabaseClient.from('grupos').select('id, nombre, turno').eq('plantel_id', state.plantelId).order('nombre');
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

window.loadAdminEstadisticasFiltros = async () => {
    try {
        const { data: grupos } = await supabaseClient.from('grupos')
            .select('*')
            .eq('plantel_id', state.plantelId)
            .order('nombre');
        
        const selGrupo = document.getElementById('adminGrupoEstadisticaSel');
        if(selGrupo && grupos) {
            selGrupo.innerHTML = grupos.map(g => `<option value="${g.id}">${g.nombre}</option>`).join('');
        }
    } catch(e) { console.error("Error al cargar grupos", e); }
};

window.generarEstadisticaAprobacion = async () => {
    const hold = document.getElementById('estadisticasDashboardContent');
    const btnDownload = document.getElementById('btnDownloadEstadisticaCSV');
    const trim = document.getElementById('adminTrimestreEstadisticaSel').value;
    const alcance = document.getElementById('adminAlcanceEstadisticaSel').value;
    const grado = document.getElementById('adminGradoEstadisticaSel').value;
    const grupoId = document.getElementById('adminGrupoEstadisticaSel').value;
    
    hold.innerHTML = '<p style="text-align:center; padding:20px;">Calculando estadísticas, por favor espere...</p>';
    btnDownload.style.display = 'none';

    try {
        let query = supabaseClient.from('calificaciones')
            .select('calificacion, materia_nombre, alumnos!inner(grado, grupo_id)')
            .eq('plantel_id', state.plantelId);

        if(trim !== 'Todos') {
            query = query.eq('trimestre', parseInt(trim));
        }

        if(alcance === 'grado') {
            query = query.eq('alumnos.grado', grado);
        } else if(alcance === 'grupo') {
            query = query.eq('alumnos.grupo_id', grupoId);
        }

        const { data, error } = await query;

        if(error) throw error;

        if(!data || data.length === 0) {
            hold.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-muted);">No se encontraron calificaciones para los filtros seleccionados.</p>';
            return;
        }

        let totalAprobados = 0;
        let totalReprobados = 0;
        const statsMateria = {};

        data.forEach(row => {
            const calif = parseFloat(row.calificacion);
            const mat = row.materia_nombre || 'Sin Asignatura';
            
            if(!statsMateria[mat]) statsMateria[mat] = { total: 0, aprobados: 0, reprobados: 0 };
            
            statsMateria[mat].total++;
            if(calif >= 6) {
                totalAprobados++;
                statsMateria[mat].aprobados++;
            } else {
                totalReprobados++;
                statsMateria[mat].reprobados++;
            }
        });

        const totalEvaluaciones = totalAprobados + totalReprobados;
        const pctReprobacionGeneral = totalEvaluaciones > 0 ? ((totalReprobados / totalEvaluaciones) * 100).toFixed(1) : 0;
        const pctAprobacionGeneral = totalEvaluaciones > 0 ? ((totalAprobados / totalEvaluaciones) * 100).toFixed(1) : 0;

        const materiasSorted = Object.keys(statsMateria).sort();

        let tableRows = '';
        materiasSorted.forEach(m => {
            const s = statsMateria[m];
            const pRep = s.total > 0 ? ((s.reprobados / s.total) * 100).toFixed(1) : 0;
            const pApr = s.total > 0 ? ((s.aprobados / s.total) * 100).toFixed(1) : 0;
            
            tableRows += `
                <tr>
                    <td style="text-align:left; font-weight:bold;">${m}</td>
                    <td>${s.total}</td>
                    <td style="color:var(--success); font-weight:bold;">${s.aprobados} <span style="font-size:0.7rem; font-weight:normal; color:#166534;">(${pApr}%)</span></td>
                    <td style="color:var(--danger); font-weight:bold;">${s.reprobados} <span style="font-size:0.7rem; font-weight:normal; color:#991b1b;">(${pRep}%)</span></td>
                </tr>
            `;
        });

        hold.innerHTML = `
            <div style="display:flex; justify-content:space-around; width:100%; margin-bottom:20px; flex-wrap:wrap; gap:15px;">
                <div style="text-align:center; background:#f8fafc; padding:15px; border-radius:12px; border:1px solid #e2e8f0; flex:1; min-width:150px;">
                    <div style="font-size:2rem; font-weight:800; color:#0f172a;">${totalEvaluaciones}</div>
                    <div style="font-size:0.8rem; color:#64748b; font-weight:600; text-transform:uppercase;">Evaluaciones</div>
                </div>
                <div style="text-align:center; background:#f0fdf4; padding:15px; border-radius:12px; border:1px solid #bbf7d0; flex:1; min-width:150px;">
                    <div style="font-size:2rem; font-weight:800; color:#166534;">${pctAprobacionGeneral}%</div>
                    <div style="font-size:0.8rem; color:#15803d; font-weight:600; text-transform:uppercase;">Aprobación Total</div>
                    <div style="font-size:0.7rem; color:#166534; margin-top:5px;">${totalAprobados} de ${totalEvaluaciones}</div>
                </div>
                <div style="text-align:center; background:#fef2f2; padding:15px; border-radius:12px; border:1px solid #fecaca; flex:1; min-width:150px;">
                    <div style="font-size:2rem; font-weight:800; color:#991b1b;">${pctReprobacionGeneral}%</div>
                    <div style="font-size:0.8rem; color:#b91c1c; font-weight:600; text-transform:uppercase;">Reprobación Total</div>
                    <div style="font-size:0.7rem; color:#991b1b; margin-top:5px;">${totalReprobados} de ${totalEvaluaciones}</div>
                </div>
            </div>

            <div style="width:100%; overflow-x:auto;">
                <table class="risk-table" style="width:100%; min-width:600px;" id="tablaEstadisticasAprobacion">
                    <thead>
                        <tr>
                            <th style="text-align:left;">Asignatura</th>
                            <th>Total Eval.</th>
                            <th>Aprobados (>=6)</th>
                            <th>Reprobados (<6)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
        
        btnDownload.style.display = 'inline-flex';
    } catch(err) {
        console.error(err);
        hold.innerHTML = '<p style="text-align:center; color:var(--danger);">Error al calcular estadísticas. Intente de nuevo.</p>';
    }
};

window.descargarEstadisticaCSV = () => {
    const table = document.getElementById('tablaEstadisticasAprobacion');
    if(!table) return;

    try {
        const rows = Array.from(table.querySelectorAll('tr'));
        let csvContent = "\uFEFF"; 
        
        rows.forEach(row => {
            const cols = Array.from(row.querySelectorAll('th, td'));
            const rowData = cols.map(col => {
                let text = col.innerText.replace(/\n/g, ' ').replace(/"/g, '""');
                return `"${text}"`;
            }).join(',');
            csvContent += rowData + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        const alcance = document.getElementById('adminAlcanceEstadisticaSel').value;
        const nombreArchivo = `Estadisticas_Aprobacion_${alcance}.csv`;
        
        link.setAttribute("href", url);
        link.setAttribute("download", nombreArchivo);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch(e) { console.error("Error desc CSV", e); }
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
                mensaje: `Hola ${res.nombre}, se han validado tus calificaciones para el ${trim}.\n\nDETALLE POR MATERIA:\n${res.desglose}\nPROMEDIO GENERAL: ${res.promedio.toFixed(1)}${mensajeEspecial}\n\n📌 NOTA IMPORTANTE:\nEl día de la firma de boletas, se registrará tu firma electrónica utilizando el código QR del alumno. Por favor, asegúrate de presentarte con el QR para agilizar el proceso.`,
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

/* ========================================================
   FIRMA DE BOLETAS POR QR - MÓDULO ADMIN
   ======================================================== */

// Estado interno del módulo de firma
window.__firmaQrState = { scanner: null, alumnoId: null, alumnoNombre: null, recentScans: new Set(), processing: false };

/**
 * Inicializa el escáner QR rápido para firma de boletas.
 */
window.initFirmaBoletasQR = () => {
    const readerEl = document.getElementById('firmaQrReader');
    if(!readerEl) return;

    if(window.__firmaQrState.scanner) {
        try { window.__firmaQrState.scanner.resume(); } catch(e) {}
        document.getElementById('firmaQrStatus').innerHTML = '📷 <strong>Listo.</strong> Escanea códigos QR uno tras otro.';
        window.loadHistorialFirmas();
        return;
    }

    // Cargar grupos para el filtro
    supabaseClient.from('grupos').select('id, nombre').eq('plantel_id', state.plantelId).then(({data}) => {
        const sel = document.getElementById('firmaFiltroGrupo');
        if(sel && data) {
            sel.innerHTML = '<option value="">Todos los grupos</option>' + data.map(g => `<option value="${g.id}">${g.nombre}</option>`).join('');
        }
    });

    readerEl.innerHTML = '';
    document.getElementById('firmaQrStatus').textContent = 'Iniciando cámara...';

    if(typeof Html5QrcodeScanner === 'undefined') {
        document.getElementById('firmaQrStatus').textContent = '⚠️ Librería QR no disponible. Recarga la página.';
        return;
    }

    const scanner = new Html5QrcodeScanner('firmaQrReader', {
        fps: 15,
        qrbox: { width: 220, height: 220 },
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
        aspectRatio: 1.0
    }, false);

    scanner.render(window.onFirmaQrScanSuccess, () => {});
    window.__firmaQrState.scanner = scanner;
    document.getElementById('firmaQrStatus').innerHTML = '📷 <strong>Listo.</strong> Escanea códigos QR uno tras otro.';

    window.loadHistorialFirmas();
};

/**
 * Agrega una entrada al log visual de escaneos rápidos.
 */
window._addScanLogEntry = (nombre, grupo, status, statusColor) => {
    const log = document.getElementById('firmaQrScanLog');
    if(!log) return;
    const hora = new Date().toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
    const entry = document.createElement('div');
    entry.style.cssText = `display:flex; align-items:center; gap:8px; padding:8px 10px; margin-bottom:4px; border-radius:8px; border-left:4px solid ${statusColor}; background:var(--page-bg); animation: fadeInUp 0.3s ease;`;
    entry.innerHTML = `
        <div style="flex:1; min-width:0;">
            <div style="font-weight:600; font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${nombre}</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">${grupo} · ${hora}</div>
        </div>
        <span style="font-size:0.75rem; font-weight:700; color:${statusColor}; white-space:nowrap;">${status}</span>
    `;
    log.prepend(entry);
    // Limitar a 20 entradas
    while(log.children.length > 20) log.removeChild(log.lastChild);
};

/**
 * Callback automático al detectar QR: busca alumno → envía aviso → reanuda escáner.
 */
window.onFirmaQrScanSuccess = async (decodedText) => {
    const statusEl = document.getElementById('firmaQrStatus');
    if(!statusEl) return;

    const code = decodedText.trim();

    // Evitar escaneos duplicados mientras se procesa
    if(window.__firmaQrState.processing) return;

    // Evitar re-escanear el mismo código en la sesión actual
    const trimestre = document.getElementById('firmaTrimestreSel')?.value || 'Trimestre 1';
    const scanKey = `${code}_${trimestre}`;
    if(window.__firmaQrState.recentScans.has(scanKey)) {
        // Ya se envió este — ignorar silenciosamente
        return;
    }

    window.__firmaQrState.processing = true;
    try { window.__firmaQrState.scanner?.pause(true); } catch(e) {}
    statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';

    try {
        // 1. Buscar alumno rápido
        let alumno = null;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code);

        if(isUUID) {
            const { data } = await supabaseClient
                .from('alumnos')
                .select('id, nombre, matricula, perfil_id, contacto_email, grupo_id, grupos(nombre)')
                .eq('id', code)
                .maybeSingle();
            alumno = data;
        }
        if(!alumno) {
            const { data } = await supabaseClient
                .from('alumnos')
                .select('id, nombre, matricula, perfil_id, contacto_email, grupo_id, grupos(nombre)')
                .eq('matricula', code)
                .maybeSingle();
            alumno = data;
        }

        if(!alumno) {
            window._addScanLogEntry(code.substring(0, 20), 'No encontrado', '❌ ERROR', '#ef4444');
            statusEl.innerHTML = '❌ Alumno no encontrado — escaneando siguiente...';
            window.__firmaQrState.processing = false;
            setTimeout(() => { try { window.__firmaQrState.scanner?.resume(); } catch(e) {} statusEl.innerHTML = '📷 <strong>Listo.</strong> Escanea el siguiente.'; }, 1200);
            return;
        }

        // 2. Verificar que tenga cuenta
        if(!alumno.perfil_id && !alumno.contacto_email) {
            window._addScanLogEntry(alumno.nombre, alumno.grupos?.nombre || 'N/A', '⚠️ SIN CUENTA', '#f59e0b');
            statusEl.innerHTML = `⚠️ ${alumno.nombre} no tiene cuenta — escaneando siguiente...`;
            window.__firmaQrState.processing = false;
            setTimeout(() => { try { window.__firmaQrState.scanner?.resume(); } catch(e) {} statusEl.innerHTML = '📷 <strong>Listo.</strong> Escanea el siguiente.'; }, 1200);
            return;
        }

        // 3. Verificar si ya tiene firma para este trimestre
        const { data: firmaExistente } = await supabaseClient
            .from('firmas_boleta')
            .select('id')
            .eq('alumno_id', alumno.id)
            .eq('trimestre', trimestre)
            .maybeSingle();

        if(firmaExistente) {
            window._addScanLogEntry(alumno.nombre, alumno.grupos?.nombre || 'N/A', '✅ YA FIRMÓ', '#10b981');
            window.__firmaQrState.recentScans.add(scanKey);
            statusEl.innerHTML = `✅ ${alumno.nombre} ya tiene firma — escaneando siguiente...`;
            window.__firmaQrState.processing = false;
            setTimeout(() => { try { window.__firmaQrState.scanner?.resume(); } catch(e) {} statusEl.innerHTML = '📷 <strong>Listo.</strong> Escanea el siguiente.'; }, 1000);
            return;
        }

        // 4. Enviar aviso automáticamente
        const uRes = await supabaseClient.auth.getUser();
        if(!uRes.data?.user) throw new Error('Sin sesión');

        const { error: errCom } = await supabaseClient.from('comunicados').insert([{
            autor_id: uRes.data.user.id,
            receptor_id: alumno.perfil_id || null,
            audiencia: `Alumno_${alumno.id}`,
            titulo: `✍️ Firma de Boleta Requerida — ${trimestre}`,
            mensaje: `Estimado padre de familia o tutor:\n\nSe te solicita firmar de enterado las calificaciones de ${alumno.nombre} correspondientes al ${trimestre}.\n\nPor favor presiona el botón "Firmar de Enterado" y escribe tu nombre completo para quedar registrado en el sistema escolar.\n\n📌 Esta firma digital tiene validez dentro del portal educativo.`,
            plantel_id: state.plantelId,
            tipo: 'aviso_firma_boleta',
            archivo_url: null
        }]);

        if(errCom) throw errCom;

        // Marcar como enviado para no repetir
        window.__firmaQrState.recentScans.add(scanKey);

        // Log visual
        window._addScanLogEntry(alumno.nombre, alumno.grupos?.nombre || 'N/A', '📨 ENVIADO', '#3b82f6');
        statusEl.innerHTML = `📨 Aviso enviado a <strong>${alumno.nombre}</strong> — escaneando siguiente...`;

        // Sonido de confirmación (beep sutil)
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.frequency.value = 880; gain.gain.value = 0.15;
            osc.start(); osc.stop(audioCtx.currentTime + 0.12);
        } catch(e) {}

    } catch(e) {
        console.error('[FirmaQR] Error:', e);
        window._addScanLogEntry('Error', e.message?.substring(0, 30) || 'Desconocido', '❌ ERROR', '#ef4444');
        statusEl.innerHTML = '❌ Error al enviar — escaneando siguiente...';
    }

    // 5. Reanudar escáner rápido
    window.__firmaQrState.processing = false;
    setTimeout(() => {
        try { window.__firmaQrState.scanner?.resume(); } catch(e) {}
        const s = document.getElementById('firmaQrStatus');
        if(s) s.innerHTML = '📷 <strong>Listo.</strong> Escanea el siguiente.';
    }, 1200);
};

/**
 * Limpia el estado del escáner.
 */
window.resetFirmaQR = () => {
    window.__firmaQrState.alumnoId = null;
    window.__firmaQrState.alumnoNombre = null;
    window.__firmaQrState.alumnoPerfilId = null;
    window.__firmaQrState.alumnoContactoEmail = null;
    window.__firmaQrState.processing = false;
    document.getElementById('firmaAlumnoInfo').style.display = 'none';
    document.getElementById('firmaQrStatus').innerHTML = '📷 <strong>Listo.</strong> Escanea códigos QR uno tras otro.';
    try { window.__firmaQrState.scanner?.resume(); } catch(e) {}
};

/**
 * Compatibilidad: el envío ahora es automático.
 */
window.enviarAvisoFirmaBoletaQR = () => {
    window.showToast('El aviso se envía automáticamente al escanear el QR.', 'info');
};

/**
 * Función llamada desde el timeline del alumno cuando el padre presiona "Firmar de Enterado".
 * Pide el nombre del padre y guarda la firma en firmas_boleta.
 */
window.firmarBoletaDesdeTimeline = async (comunicadoId, btn) => {
    const firmaTexto = prompt('Para completar tu Firma Digital de Enterado, escribe tu Nombre Completo (Padre o Tutor):');
    if(!firmaTexto || !firmaTexto.trim()) return;

    try {
        if(btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...'; }

        const u = await supabaseClient.auth.getUser();
        if(!u.data?.user) throw new Error('Sin sesión activa');

        // Marcar el comunicado como visto/firmado
        await supabaseClient.from('comunicados_vistos').upsert({
            perfil_id: u.data.user.id,
            comunicado_id: comunicadoId
        }, { onConflict: 'perfil_id,comunicado_id' });

        // Obtener datos del comunicado para extraer el alumno y trimestre
        const { data: com } = await supabaseClient
            .from('comunicados')
            .select('titulo, mensaje, audiencia, autor_id, plantel_id')
            .eq('id', comunicadoId)
            .maybeSingle();

        if(!com) throw new Error('Comunicado no encontrado');

        // Extraer alumno_id de la audiencia "Alumno_<uuid>"
        const alumnoIdMatch = (com.audiencia || '').match(/^Alumno_([a-f0-9-]{36})$/i);
        if(!alumnoIdMatch) throw new Error('No se pudo identificar al alumno del comunicado.');
        const alumnoId = alumnoIdMatch[1];

        // Extraer trimestre del título: "✍️ Firma de Boleta Requerida — Trimestre X"
        const trimestreMatch = (com.titulo || '').match(/Trimestre\s+\d+/i);
        const trimestre = trimestreMatch ? trimestreMatch[0] : 'Sin especificar';

        const pId = com.plantel_id || (state ? state.plantelId : null);

        // Registrar la firma en firmas_boleta
        const { error: errFirma } = await supabaseClient.from('firmas_boleta').upsert({
            alumno_id: alumnoId,
            plantel_id: pId,
            trimestre: trimestre,
            nombre_tutor: firmaTexto.trim(),
            fecha_firma: new Date().toISOString()
        }, { onConflict: 'alumno_id,trimestre' });

        if(errFirma) throw errFirma;

        // Notificar al administrador que el padre firmó
        if(com.autor_id) {
            await supabaseClient.from('comunicados').insert([{
                autor_id: u.data.user.id,
                receptor_id: com.autor_id,
                titulo: `✅ Boleta Firmada: ${firmaTexto.trim()}`,
                mensaje: `El padre/tutor ha firmado de enterado las calificaciones del ${trimestre}.\n\n✍️ Firma: ${firmaTexto.trim()}\n📅 Fecha: ${new Date().toLocaleString('es-MX')}`,
                audiencia: `Admin_Firma`,
                plantel_id: pId
            }]);
        }

        // Animar la eliminación del card del timeline
        const card = document.getElementById(`aviso-${comunicadoId}`);
        if(card) {
            card.style.transform = 'translateX(100%)';
            card.style.opacity = '0';
            card.style.transition = 'all 0.5s ease';
            setTimeout(() => card.remove(), 500);
        }

        alert(`✅ ¡Firma registrada con éxito!\n\nNombre: ${firmaTexto.trim()}\nTrimestre: ${trimestre}\n\nTu firma quedó registrada en el sistema escolar.`);

        // Refrescar boletas si estamos en esa vista
        if(window.loadBoletasAlumno) window.loadBoletasAlumno();

    } catch(e) {
        console.error('[FirmaQR] Error al registrar firma:', e);
        if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-signature"></i> Firmar de Enterado'; }
        alert('Error al registrar la firma: ' + e.message);
    }
};

/**
 * Carga y muestra el historial de firmas registradas en el panel admin.
 */
window.loadHistorialFirmas = async () => {
    const cont = document.getElementById('firmaHistorialContainer');
    if(!cont) return;

    const filtroGrupoId = document.getElementById('firmaFiltroGrupo')?.value;

    cont.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Cargando historial...</p>';

    try {
        let totalAlumnosGrupo = 0;
        let alumnosFiltroSet = null;

        if (filtroGrupoId) {
            const { data: alums } = await supabaseClient.from('alumnos').select('id').eq('grupo_id', filtroGrupoId);
            if (alums) {
                totalAlumnosGrupo = alums.length;
                alumnosFiltroSet = new Set(alums.map(a => a.id));
            }
        }

        const { data, error } = await supabaseClient
            .from('firmas_boleta')
            .select('*, alumnos(id, nombre, matricula, grupo_id, grupos(nombre))')
            .eq('plantel_id', state.plantelId)
            .order('fecha_firma', { ascending: false });

        if(error) throw error;

        let firmasFiltradas = data || [];
        if (filtroGrupoId && alumnosFiltroSet) {
            firmasFiltradas = firmasFiltradas.filter(f => f.alumnos && alumnosFiltroSet.has(f.alumno_id));
        } else {
            firmasFiltradas = firmasFiltradas.slice(0, 100);
        }

        // También cargar avisos pendientes (enviados pero aún no firmados)
        const { data: pendientes } = await supabaseClient
            .from('comunicados')
            .select('id, titulo, audiencia, fecha_envio')
            .eq('plantel_id', state.plantelId)
            .eq('tipo', 'aviso_firma_boleta')
            .order('fecha_envio', { ascending: false });

        let pendientesFiltrados = pendientes || [];
        if(filtroGrupoId && alumnosFiltroSet) {
            pendientesFiltrados = pendientesFiltrados.filter(p => {
                const match = (p.audiencia||'').match(/^Alumno_([a-f0-9-]{36})$/i);
                return match && alumnosFiltroSet.has(match[1]);
            });
        } else {
            pendientesFiltrados = pendientesFiltrados.slice(0, 50);
        }

        if(firmasFiltradas.length === 0 && pendientesFiltrados.length === 0) {
            cont.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px 0;"><i class="fa-solid fa-signature" style="font-size:2.5rem; display:block; margin-bottom:10px; opacity:0.3;"></i>No hay firmas registradas ni pendientes.</p>';
            return;
        }

        // Agrupar por trimestre
        const porTrimestre = {};
        firmasFiltradas.forEach(f => {
            if(!porTrimestre[f.trimestre]) porTrimestre[f.trimestre] = [];
            porTrimestre[f.trimestre].push(f);
        });

        let html = '';
        
        // Agregar barra de estadísticas si hay grupo seleccionado y al menos 1 alumno
        if (filtroGrupoId && totalAlumnosGrupo > 0) {
            const firmasRecientes = firmasFiltradas.length; // Todas las firmas de este grupo
            const pct = Math.min(100, Math.round((firmasRecientes / totalAlumnosGrupo) * 100)) || 0;
            const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
            
            html += `
            <div style="margin-bottom:20px; padding:16px; background:white; border-radius:10px; border:1px solid var(--border); box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span style="font-weight:bold; color:var(--text-color);"><i class="fa-solid fa-chart-pie" style="color:var(--primary);"></i> Progreso de Firmas del Grupo</span>
                    <span style="font-weight:bold; color:${color};">${pct}%</span>
                </div>
                <div style="width:100%; height:12px; background:#e2e8f0; border-radius:6px; overflow:hidden;">
                    <div style="width:${pct}%; height:100%; background:${color}; transition:width 0.5s;"></div>
                </div>
                <div style="margin-top:8px; font-size:0.8rem; color:var(--text-muted); text-align:right;">
                    <strong>${firmasRecientes}</strong> firmas de <strong>${totalAlumnosGrupo}</strong> alumnos registrados
                </div>
            </div>`;
        }

        // Mostrar pendientes al inicio si hay
        if(pendientesFiltrados.length > 0) {
            const firmaIds = new Set(firmasFiltradas.map(f => f.alumno_id + f.trimestre));
            const realPend = pendientesFiltrados.filter(p => {
                const alumnoIdM = (p.audiencia||'').match(/^Alumno_([a-f0-9-]{36})$/i);
                const trim = (p.titulo||'').match(/Trimestre\s+\d+/i)?.[0]||'';
                if(!alumnoIdM) return false;
                return !firmaIds.has(alumnoIdM[1] + trim);
            });
            if(realPend.length > 0) {
                html += `
                <div style="margin-bottom:20px; padding:12px 16px; background:#fef3c7; border-radius:10px; border:1px solid #fde68a;">
                    <p style="margin:0 0 8px 0; font-weight:700; font-size:0.85rem; color:#92400e;"><i class="fa-solid fa-hourglass-half"></i> Avisos en Espera de Firma (${realPend.length})</p>
                    <p style="font-size:0.78rem; color:#78350f; margin:0;">Estos alumnos recibieron el aviso pero aún no han firmado desde su dispositivo.</p>
                </div>`;
            }
        }

        Object.keys(porTrimestre).sort().forEach(trim => {
            const firmas = porTrimestre[trim];
            html += `
            <div style="margin-bottom:20px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; padding-bottom:8px; border-bottom:2px solid var(--primary);">
                <i class="fa-solid fa-layer-group" style="color:var(--primary);"></i>
                <strong style="color:var(--primary);">${trim}</strong>
                <span style="background:var(--primary); color:white; border-radius:20px; padding:2px 10px; font-size:0.8rem; margin-left:auto;">${firmas.length} firma(s)</span>
              </div>
              <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:10px;">
            `;
            firmas.forEach(f => {
                const alumno = f.alumnos;
                const fecha = new Date(f.fecha_firma).toLocaleString('es-MX', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
                html += `
                <div style="background:var(--surface); border:1px solid #d1fae5; border-radius:10px; padding:12px; display:flex; gap:10px; align-items:flex-start;">
                  <i class="fa-solid fa-signature" style="color:#059669; margin-top:3px; flex-shrink:0;"></i>
                  <div>
                    <div style="font-weight:600; font-size:0.9rem;">${alumno?.nombre || 'Desconocido'}</div>
                    <div style="font-size:0.78rem; color:var(--text-muted);">Grupo: ${alumno?.grupos?.nombre || 'N/A'} | Mat: ${alumno?.matricula || 'N/A'}</div>
                    <div style="font-size:0.82rem; margin-top:4px;"><i class="fa-solid fa-pen-nib" style="color:var(--primary);"></i> <strong>${f.nombre_tutor}</strong></div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;"><i class="fa-regular fa-clock"></i> ${fecha}</div>
                  </div>
                </div>`;
            });
            html += `</div></div>`;
        });

        cont.innerHTML = html;

    } catch(e) {
        console.error('[FirmaQR] Error al cargar historial:', e);
        cont.innerHTML = '<p style="text-align:center; color:var(--danger); padding:20px;">Error al cargar el historial. Verifica la conexión.</p>';
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

        // No global fallback to prevent cross-school data bleeding

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
        const { data: files, error } = await supabaseClient.storage.from('expedientes').list(folder);
        
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
                const { data: url } = supabaseClient.storage.from('expedientes').getPublicUrl(`${folder}/${f}.pdf`);
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
                    const { data: url } = supabaseClient.storage.from('expedientes').getPublicUrl(`${folder}/${b.name}`);
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
        const { error } = await supabaseClient.storage.from('expedientes').remove([`${folder}/${fileName}`]);
        
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
        const { data, error } = await supabaseClient.storage.from('expedientes').upload(`${folder}/${finalFileName}`, file, { upsert: true });
        
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
            // DETECTAR INVITACIÓN / RECUPERACIÓN V112
            const hash = window.location.hash;
            if (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) {
                state.isUpdatingPassword = true;
            }

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
                if ((rawRole === 'administrativo' || rawRole === 'admin')) rawRole = 'admin';
                if (rawRole === 'maestro') rawRole = 'maestro';

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
    
    // Mostrar/Ocultar Sub-tabs de Alumnos
    const subTabs = document.getElementById('subTabsAlumnos');
    if(subTabs) {
        subTabs.style.display = (tab === 'alumno') ? 'flex' : 'none';
    }

    // Recuperar búsqueda actual
    const searchInput = document.getElementById('busquedaPersonalAutorizado');
    const searchValue = searchInput ? searchInput.value : '';
    window.loadListasAdminPersonal(searchValue);
};

window.loadFiltrosAlumnosDinamicos = async () => {
    const sGrado = document.getElementById('selGradoAlumnoTab');
    const sGrupo = document.getElementById('selGrupoAlumnoTab');
    if(!sGrado || !sGrupo) return;
    
    try {
        const { data: grupos, error } = await supabaseClient.from('grupos')
            .select('nombre')
            .eq('plantel_id', state.plantelId);
        
        if(error) throw error;
        
        const gradosSet = new Set();
        const gruposSet = new Set();
        
        grupos.forEach(g => {
            const nom = g.nombre || ''; // Ej: "1°A"
            const matchGrado = nom.match(/^\d+°?/);
            if(matchGrado) gradosSet.add(matchGrado[0]);
            
            const soloGrupo = nom.replace(/^\d+°?/, '').trim();
            if(soloGrupo) gruposSet.add(soloGrupo);
        });
        
        const valGrado = sGrado.value;
        const valGrupo = sGrupo.value;
        
        sGrado.innerHTML = '<option value="">Grados</option>' + [...gradosSet].sort().map(g => `<option value="${g}">${g}${g.includes('°') ? '' : '°'}</option>`).join('');
        sGrupo.innerHTML = '<option value="">Grupos</option>' + [...gruposSet].sort().map(g => `<option value="${g}">${g}</option>`).join('');
        
        sGrado.value = valGrado;
        sGrupo.value = valGrupo;
    } catch(e) { console.error("Error cargando filtros dinámicos:", e); }
};

window.loadListasAdminPersonal = async (searchTerm = '') => {
    const tbody = document.getElementById('tbodyPersonalAdmin');
    const totalCont = document.getElementById('totalPersonalCounter');
    if(!tbody) return;

    if (!window._activePersonalTab) window._activePersonalTab = 'directivo';

    try {
        const currentPlantelID = state.plantelId || 'general';
        let itemsToRender = [];
        
        if (window._activePersonalTab === 'alumno') {
            const grado = document.getElementById('selGradoAlumnoTab')?.value || '';
            const grupo = document.getElementById('selGrupoAlumnoTab')?.value || '';
            
            if (!grado || !grupo) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:40px; color:var(--text-muted)"><i class="fa-solid fa-filter" style="font-size:2rem; display:block; margin-bottom:10px; opacity:0.3;"></i> Por favor selecciona un Grado y Grupo para ver la lista de alumnos.</td></tr>';
                totalCont.innerText = "0";
                return;
            }

            let q = supabaseClient.from('alumnos')
                .select('*, grupos(nombre)')
                .eq('plantel_id', currentPlantelID);
            
            if (searchTerm) q = q.or(`nombre.ilike.%${searchTerm}%,contacto_email.ilike.%${searchTerm}%`);
            
            const { data: students, error: sErr } = await q.order('nombre');
            if(sErr) throw sErr;
            
            // Recoger todos los correos para traer sus contraseñas temporales (v112)
            const allEmails = students.map(s => s.contacto_email).filter(Boolean);
            let passMap = {};
            if (allEmails.length > 0) {
                const { data: pData } = await supabaseClient.from('perfiles_permitidos').select('email, temp_pass').in('email', allEmails);
                if (pData) {
                    pData.forEach(pd => { if(pd.temp_pass) passMap[pd.email] = pd.temp_pass; });
                }
            }

            // Filtro por grado/grupo
            itemsToRender = students.filter(s => {
                const gName = (s.grupos?.nombre || '').toUpperCase();
                let ok = true;
                if(grado && !gName.startsWith(grado.toUpperCase())) ok = false;
                if(grupo && !gName.endsWith(grupo.toUpperCase())) ok = false;
                return ok;
            }).map(s => ({
                id: s.id,
                nombre: s.nombre,
                email: s.contacto_email || 'Sin correo',
                rol: 'alumno',
                created_at: s.creado_en || s.created_at,
                estado: 'activo', 
                grupo_nom: s.grupos?.nombre,
                temp_pass: passMap[s.contacto_email] || null
            }));
            
        } else {
            let query = supabaseClient.from('perfiles_permitidos')
                .select('*')
                .neq('rol', 'alumno')
                .eq('plantel_id', currentPlantelID);
            
            if (searchTerm) query = query.or(`nombre.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
            
            const { data: allStaff, error } = await query.order('nombre');
            if(error) throw error;
            
            let tabRoles = [];
            if(window._activePersonalTab === 'admin') tabRoles = ['admin'];
            else if(window._activePersonalTab === 'maestro') tabRoles = ['maestro'];
            else if(window._activePersonalTab === 'apoyo') tabRoles = ['apoyo'];
            else if(window._activePersonalTab === 'directivo') tabRoles = ['directivo'];
            else if(window._activePersonalTab === 'biblioteca') tabRoles = ['biblioteca'];
            
            itemsToRender = allStaff.filter(p => tabRoles.includes(p.rol));
        }

        // Ordenar por nombre (asumiendo Apellido Paterno al inicio)
        itemsToRender.sort((a, b) => (a.nombre || '').localeCompare((b.nombre || ''), 'es', { sensitivity: 'base' }));

        totalCont.innerText = itemsToRender.length;

        if(itemsToRender.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted)">No se encontraron registros en esta categoría.</td></tr>';
            return;
        }

        let html = '';
        itemsToRender.forEach(p => {
            const roleLabels = { 'admin': 'Administrador', 'maestro': 'Maestro', 'apoyo': 'Apoyo', 'directivo': 'Directivo', 'alumno': 'Alumno', 'biblioteca': 'Biblioteca' };
            const roleClass = (p.rol === 'admin' || p.rol === 'directivo') ? 'badge-primary' : 
                              (p.rol === 'maestro' ? 'badge-success' : 
                              (p.rol === 'alumno' ? 'badge-warning' : 'badge-outline'));
            const statusLabel = p.estado === 'activo' ? '<span style="color:var(--success)">● Activo</span>' : '<span style="color:var(--warning)">○ Pendiente</span>';
            
            html += `
                <tr style="border-bottom:1px solid var(--border)">
                    <td style="padding:12px;">
                        <div style="font-weight:700; color:var(--primary); font-size:1rem;">${p.nombre || 'Sin nombre registrado'}</div>
                        <div style="font-size:0.8rem; color:var(--text-muted); font-family:monospace;">${p.email}</div>
                        ${p.temp_pass ? `
                            <div style="margin-top:6px; display:flex; align-items:center; gap:8px;">
                                <div id="pass-${p.id || p.email.replace(/@|\./g,'')}" style="display:none; font-size:0.8rem; background:var(--primary); color:#fff; padding:3px 10px; border-radius:8px; font-weight:700;">
                                    <i class="fa-solid fa-key"></i> ${p.temp_pass}
                                </div>
                                <button class="btn btn-xs" style="padding:2px 8px; font-size:0.7rem; background:#f3f4f6; border:1px solid #d1d5db; height:22px;" onclick="const e=document.getElementById('pass-${p.id || p.email.replace(/@|\./g,'')}'); const isHid=e.style.display==='none'; e.style.display=isHid?'block':'none'; this.innerText=isHid?'Ocultar':'Ver Clave'">
                                    Ver Clave
                                </button>
                            </div>
                        ` : ''}
                    </td>
                    <td style="padding:12px; font-size:0.85rem; color:var(--text-muted)">
                        ${statusLabel}
                        <div style="font-size:0.7rem;">Desde: ${new Date(p.created_at).toLocaleDateString()}</div>
                    </td>
                    <td style="padding:12px; text-align:center;">
                        <span class="badge ${roleClass}">${p.grupo_nom ? `Grupo ${p.grupo_nom}` : (roleLabels[p.rol] || p.rol)}</span>
                    </td>
                    <td style="padding:12px; text-align:center;">
                        <button class="btn btn-outline btn-xs" 
                                style="color:var(--danger); border-color:var(--danger);" 
                                onclick="window.eliminarPersona('${p.id}', '${p.email}', '${p.nombre}', '${p.rol}')">
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

window.eliminarPersona = async (idPermitido, email, nombre, rol = '') => {
    const isDirectivo = state.role === 'directivo';
    const confirmMsg = isDirectivo 
        ? `⚠️ ¿Deseas ELIMINAR AHORA a "${nombre}" (${email})? Esta acción es inmediata.`
        : `⚠️ ¿Deseas SOLICITAR LA BAJA de "${nombre}" (${email})? El Directivo deberá autorizar este movimiento.`;

    if(!confirm(confirmMsg)) return;

    try {
        if (isDirectivo) {
            // Acción Directa para Directivos
            if (rol === 'alumno') {
                const { error: errAlu } = await supabaseClient.from('alumnos').delete().eq('id', idPermitido);
                if(errAlu) throw errAlu;
                const { data: pExist } = await supabaseClient.from('perfiles').select('id').eq('nombre', nombre).eq('plantel_id', state.plantelId).maybeSingle();
                if(pExist) await supabaseClient.from('perfiles').delete().eq('id', pExist.id).eq('plantel_id', state.plantelId);
                await supabaseClient.from('perfiles_permitidos').delete().eq('email', email);
                window.showToast("Alumno eliminado correctamente.", "success");
            } else {
                await supabaseClient.from('asignaciones_maestros').delete().eq('docente_email', email).eq('plantel_id', state.plantelId);
                const { error: errPerm } = await supabaseClient.from('perfiles_permitidos').delete().eq('id', idPermitido);
                if(errPerm) throw errPerm;
                const { data: pExist } = await supabaseClient.from('perfiles').select('id').eq('nombre', nombre).eq('plantel_id', state.plantelId).maybeSingle();
                if(pExist) await supabaseClient.from('perfiles').delete().eq('id', pExist.id).eq('plantel_id', state.plantelId);
                window.showToast("Personal eliminado y acceso revocado.", "success");
            }
        } else {
            // Solicitud para Admins
            const actionType = (rol === 'alumno') ? 'delete_alumno' : 'delete_personal';
            const reqType = (rol === 'alumno') ? 'BAJA DE ALUMNO' : 'BAJA DE PERSONAL';
            const { error: errReq } = await supabaseClient.from('autorizaciones_movimientos').insert([{
                plantel_id: state.plantelId,
                tipo_accion: reqType,
                detalles: `Eliminar acceso a: ${nombre} (${email})`,
                estado: 'pendiente',
                payload_json: {
                    action: actionType,
                    id_permitido: idPermitido,
                    email: email,
                    nombre: nombre
                }
            }]);
            if(errReq) throw errReq;
            window.showToast("Solicitud de baja enviada al Directivo.", "info");
        }
        
        if(window.loadListasAdminPersonal) window.loadListasAdminPersonal();
        if(window.loadPersonalDirectivo) window.loadPersonalDirectivo();
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
        const u = await supabaseClient.auth.getUser();
        // 1. Obtener ID del encuadre específico para el trimestre actual
        let qEnc = supabaseClient.from('encuadres')
            .select('id, maestro_id')
            .eq('plantel_id', state.plantelId)
            .eq('maestro_id', u.data?.user?.id)
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
                .eq('plantel_id', state.plantelId)
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
        const { data: grupos } = await supabaseClient.from('grupos').select('id, nombre, turno').eq('plantel_id', state.plantelId).order('nombre');
        const sel = document.getElementById('horarioGrupoId');
        if(sel && grupos) {
            sel.innerHTML = '<option value="">-- Todos los Grupos --</option>' + 
                grupos.map(g => `<option value="${g.id}">${g.nombre} - ${g.turno}</option>`).join('');
        }

        const { data, error } = await supabaseClient.from('horarios').select('*, grupos(nombre, turno)').eq('plantel_id', state.plantelId);
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

// ==========================================
// CALENDARIO DE EVALUACIÓN (ADMIN)
// ==========================================
async function renderAdminCalendario() {
    setTimeout(() => { if(window.loadAdminCalendario) window.loadAdminCalendario(); }, 100);
    return `
        <div class="page-header">
            <h2 class="page-title"><i class="fa-solid fa-calendar-days text-primary"></i> Calendario de Evaluación</h2>
            <p class="page-subtitle">Establece fechas límite para la captura de calificaciones por parte de los docentes.</p>
        </div>

        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
            ${[1, 2, 3, 4].map(trim => `
                <div class="card shadow-md" style="border-top: 4px solid var(--primary);">
                    <h3 style="margin-bottom: 15px;">${trim === 4 ? 'Calificación Final' : 'Trimestre ' + trim}</h3>
                    
                    <div class="form-group">
                        <label class="form-label">Fecha Límite de Envío</label>
                        <input type="datetime-local" id="deadline-trim-${trim}" class="form-input">
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:15px; border-top:1px solid var(--border);">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <label class="switch">
                                <input type="checkbox" id="block-trim-${trim}" onchange="window.toggleAdminDeadlineBlock(${trim})">
                                <span class="slider round"></span>
                            </label>
                            <span style="font-size:0.85rem; font-weight:600; color:var(--text-muted);">Bloquear Envíos</span>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="window.saveAdminDeadline(${trim})">
                            <i class="fa-solid fa-floppy-disk"></i> Guardar
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="card" style="margin-top: 32px; background: #f8fafc; border: 1px dashed var(--primary-light);">
            <div style="display:flex; gap:16px; align-items:center;">
                <div style="font-size:2rem; color:var(--primary);"><i class="fa-solid fa-circle-info"></i></div>
                <div style="font-size:0.9rem; color:var(--text-muted);">
                    <strong>Instrucciones:</strong> El bloqueo manual impide cualquier envío sin importar la fecha. Si el bloqueo está desactivado, el sistema solo permitirá envíos antes de la fecha límite establecida. Para permitir <strong>envíos extemporáneos</strong>, amplía la fecha límite o desactiva el bloqueo manual.
                </div>
            </div>
        </div>
    `;
}

window.loadAdminCalendario = async () => {
    try {
        const { data, error } = await supabaseClient.from('periodos_calificaciones').select('*').eq('plantel_id', state.plantelId).order('trimestre');
        if(error) throw error;

        data.forEach(p => {
            const dateInput = document.getElementById(`deadline-trim-${p.trimestre}`);
            const blockInput = document.getElementById(`block-trim-${p.trimestre}`);
            
            if(dateInput && p.fecha_limite) {
                const localDate = new Date(p.fecha_limite).toISOString().slice(0, 16);
                dateInput.value = localDate;
            }
            if(blockInput) {
                blockInput.checked = p.bloqueado;
            }
        });
    } catch(e) { console.error("Error cargando calendario:", e); }
};

window.saveAdminDeadline = async (trim) => {
    const dateVal = document.getElementById(`deadline-trim-${trim}`).value;
    if(!dateVal) return alert("Por favor selecciona una fecha.");

    try {
        const isoDate = new Date(dateVal).toISOString();
        const { data: exist } = await supabaseClient.from('periodos_calificaciones').select('*').eq('trimestre', trim).eq('plantel_id', state.plantelId).maybeSingle();
        const payload = { trimestre: trim, plantel_id: state.plantelId, fecha_limite: isoDate, ultima_modificacion: new Date().toISOString() };
        if (exist) payload.bloqueado = exist.bloqueado;
        const { error } = await supabaseClient.from('periodos_calificaciones').upsert(payload, { onConflict: 'trimestre, plantel_id' });

        if(error) throw error;
        window.showToast("Fecha límite actualizada con éxito", "success");
    } catch(e) { alert("Error al guardar: " + e.message); }
};

window.toggleAdminDeadlineBlock = async (trim) => {
    const isBlocked = document.getElementById(`block-trim-${trim}`).checked;
    try {
        const { data: exist } = await supabaseClient.from('periodos_calificaciones').select('*').eq('trimestre', trim).eq('plantel_id', state.plantelId).maybeSingle();
        const payload = { trimestre: trim, plantel_id: state.plantelId, bloqueado: isBlocked, ultima_modificacion: new Date().toISOString() };
        if (exist && exist.fecha_limite) payload.fecha_limite = exist.fecha_limite;
        const { error } = await supabaseClient.from('periodos_calificaciones').upsert(payload, { onConflict: 'trimestre, plantel_id' });

        if(error) throw error;
        window.showToast(`Trimestre ${trim} ${isBlocked ? 'bloqueado' : 'desbloqueado'}`, "info");
    } catch(e) { alert("Error al actualizar bloqueo: " + e.message); }
};

window.updateMaestroDeadlineStatus = async () => {
    const trim = document.getElementById('capturaTrimestre')?.value;
    const statusSpan = document.getElementById('maestroDeadlineStatus');
    if(!trim || !statusSpan) return;

    try {
        const { data: periodo } = await supabaseClient.from('periodos_calificaciones').select('*').eq('trimestre', trim).eq('plantel_id', state.plantelId).maybeSingle();
        if(!periodo) {
            statusSpan.innerHTML = "PERIODO ABIERTO";
            statusSpan.style.color = "var(--success)";
            return;
        }

        if(periodo.bloqueado) {
            statusSpan.innerHTML = "SISTEMA BLOQUEADO";
            statusSpan.style.color = "var(--danger)";
        } else if(periodo.fecha_limite) {
            const deadline = new Date(periodo.fecha_limite);
            const now = new Date();
            if(now > deadline) {
                statusSpan.innerHTML = `FECHA LÍMITE PASADA (${deadline.toLocaleString()})`;
                statusSpan.style.color = "var(--danger)";
            } else {
                statusSpan.innerHTML = `LÍMITE DE ENVÍO: ${deadline.toLocaleString()}`;
                statusSpan.style.color = "var(--warning)";
            }
        } else {
            statusSpan.innerHTML = "PERIODO ABIERTO";
            statusSpan.style.color = "var(--success)";
        }
    } catch(e) { console.error(e); }
};


window.liveSearchAlumnoCalificaciones = async (q) => {
    const res = document.getElementById('resSearchAlumnoDownload');
    if(!res) return;
    if(q.length < 2) { res.style.display='none'; return; }
    try {
        const { data } = await supabaseClient.from('alumnos').select('id, nombre, matricula, grupos(nombre)').eq('plantel_id', state.plantelId).or(`nombre.ilike.%${q}%,matricula.ilike.%${q}%`).limit(10);
        if(!data || data.length === 0) { res.innerHTML='<p style="padding:10px; color:var(--text-muted)">Sin resultados</p>'; res.style.display='block'; return; }
        res.style.display='block';
        res.innerHTML = data.map(a => `
            <div style="padding:10px; border-bottom:1px solid var(--border); cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="window.descargarBoletaAdminPDF('${a.id}', '${a.nombre}', '${a.matricula}')">
               <div>
                  <div style="font-weight:600; font-size:0.85rem;">${a.nombre}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted)">${a.grupos ? a.grupos.nombre : 'Sin Grupo'}</div>
               </div>
               <i class="fa-solid fa-file-pdf" style="color:var(--danger)"></i>
            </div>
        `).join('');
    } catch(e) { console.error(e); }
};

window.descargarBoletaAdminPDF = async (alumnoId, nombre, matricula) => {
    try {
        // Obtenemos todas las calificaciones del alumno
        const { data: califs, error } = await supabaseClient.from('calificaciones')
            .select('calificacion, trimestre, materia_nombre, materia_id(nombre)')
            .eq('alumno_id', alumnoId)
            .order('trimestre', { ascending: true });
        
        if(error) throw error;
        if(!califs || califs.length === 0) return alert("Este alumno no tiene calificaciones registradas aún.");

        // Agrupar por trimestre
        const porTrimestre = {};
        califs.forEach(c => {
            if(!porTrimestre[c.trimestre]) porTrimestre[c.trimestre] = [];
            porTrimestre[c.trimestre].push(c);
        });

        let gradesHtml = '';
        Object.keys(porTrimestre).sort().forEach(trim => {
            const materias = porTrimestre[trim];
            let suma = 0;
            let rows = '';
            materias.forEach(m => {
                const matNom = m.materia_nombre || (m.materia_id?.nombre) || 'Materia';
                suma += Number(m.calificacion);
                rows += `<tr><td style="border: 1px solid #000; padding: 8px 10px; font-size: 12px; text-align: left;">${matNom}</td><td style="border: 1px solid #000; padding: 8px 10px; font-size: 12px; text-align: center;">${m.calificacion}</td></tr>`;
            });
            const promedio = (suma / materias.length).toFixed(1);
            rows += `<tr><td style="border: 1px solid #000; padding: 8px 10px; font-size: 12px; text-align: right; font-weight: bold; background-color: #f8fafc;">PROMEDIO</td><td style="border: 1px solid #000; padding: 8px 10px; font-size: 12px; text-align: center; font-weight: bold; background-color: #f8fafc;">${promedio}</td></tr>`;

            gradesHtml += `
            <div class="trim-title">EVALUACIÓN DEL TRIMESTRE ${trim}</div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #000; padding: 8px 10px; font-size: 12px; background-color: #e5e7eb; font-weight: bold; text-align: center; text-transform: uppercase;">Materia</th>
                        <th style="border: 1px solid #000; padding: 8px 10px; font-size: 12px; background-color: #e5e7eb; font-weight: bold; text-align: center; text-transform: uppercase; width: 120px;">Calificación</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>`;
        });

        // Generar ventana de impresión (igual que en descargarBoletaPDF)
        const printWindow = window.open('', '_blank');
        const currentYear = new Date().getFullYear();
        const cicloEscolar = (new Date().getMonth() >= 7) ? `${currentYear} - ${currentYear + 1}` : `${currentYear - 1} - ${currentYear}`;
        
        let firmaTutorHtml = `
            <div class="signature-line"></div>
            <div class="signature-title">Padre de Familia o Tutor</div>
            <div style="font-size:11px; margin-top:5px; color:#555;">Firma de Enterado</div>
        `;
        try {
            const { data: firma } = await supabaseClient.from('firmas_boleta')
                .select('nombre_tutor, fecha_firma')
                .eq('alumno_id', alumnoId)
                .order('fecha_firma', { ascending: false })
                .limit(1)
                .maybeSingle();
            
            if(firma) {
                const fechaFormat = new Date(firma.fecha_firma).toLocaleDateString('es-MX', { year:'numeric', month:'short', day:'numeric' });
                firmaTutorHtml = `
                    <div class="signature-line" style="display:flex; align-items:flex-end; justify-content:center; padding-bottom:4px;">
                        <span style="font-family:'Courier New', monospace; font-size:15px; font-weight:bold; color:#1e3a8a; font-style:italic;">${firma.nombre_tutor}</span>
                    </div>
                    <div class="signature-title">Padre de Familia o Tutor</div>
                    <div style="font-size:11px; margin-top:5px; color:#059669; font-weight:bold;">
                        <span style="font-family:sans-serif;">✔ Firmado digitalmente el ${fechaFormat}</span>
                    </div>
                `;
            }
        } catch(e) { console.warn('Error fetching firma:', e); }

        const plantelName = (typeof state !== 'undefined' && state && state.plantelNombre) ? state.plantelNombre : CONFIG.schoolName;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Reporte Individual de Calificaciones - ${nombre}</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.4; margin: 0; }
                        .header { text-align: center; margin-bottom: 20px; border-bottom: 4px double #1e3a8a; padding-bottom: 20px; }
                        .header h1 { margin: 0; color: #1e3a8a; font-size: 26px; text-transform: uppercase; letter-spacing: 1px; }
                        .header h2 { margin: 6px 0 0 0; color: #333; font-size: 16px; font-weight: bold; letter-spacing: 0.5px; }
                        .header h3 { margin: 4px 0 0 0; color: #555; font-size: 14px; font-weight: normal; }
                        
                        .meta-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; font-size: 14px; background: #f8fafc; padding: 18px; border: 1px solid #cbd5e1; border-radius: 8px; }
                        .meta-info div { margin-bottom: 6px; }
                        .meta-info strong { color: #1e3a8a; display: inline-block; width: 130px; }
                        
                        .trim-title { font-size: 15px; font-weight: bold; color: #1e3a8a; margin-bottom: 12px; border-left: 5px solid #1e3a8a; padding-left: 10px; text-transform: uppercase; background: #f1f5f9; padding-top: 4px; padding-bottom: 4px; }
                        
                        .signatures { display: flex; justify-content: space-around; margin-top: 70px; page-break-inside: avoid; }
                        .signature-box { text-align: center; width: 260px; }
                        .signature-line { border-bottom: 1px solid #000; height: 60px; margin-bottom: 10px; }
                        .signature-title { font-size: 13px; font-weight: bold; color: #111; text-transform: uppercase; }
                        
                        .footer { margin-top: 50px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 15px; }
                        
                        @media print {
                            body { padding: 0; margin: 20px; }
                            button { display: none; }
                            .meta-info { border: 1px solid #000; background: transparent; }
                            .header { border-bottom: 3px solid #000; }
                            .header h1, .header h2, .trim-title, .meta-info strong { color: #000; }
                            .trim-title { border-left: 5px solid #000; background: transparent; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${plantelName.toUpperCase()}</h1>
                        <h2>SISTEMA EDUCATIVO INSTITUCIONAL</h2>
                        <h3>BOLETA INDIVIDUAL DE EVALUACIONES</h3>
                    </div>
                    
                    <div class="meta-info">
                        <div>
                            <div><strong>Alumno(a):</strong> <span style="text-transform: uppercase; font-weight: bold;">${nombre}</span></div>
                            <div><strong>Matrícula/CURP:</strong> <span style="text-transform: uppercase;">${matricula || 'N/A'}</span></div>
                        </div>
                        <div>
                            <div><strong>Ciclo Escolar:</strong> ${cicloEscolar}</div>
                            <div><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' })}</div>
                        </div>
                    </div>

                    ${gradesHtml}

                    <div class="signatures">
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <div class="signature-title">Dirección del Plantel</div>
                            <div style="font-size:11px; margin-top:5px; color:#555;">Firma y Sello Oficial</div>
                        </div>
                        <div class="signature-box">
                            ${firmaTutorHtml}
                        </div>
                    </div>

                    <div class="footer">
                        <p>Documento de carácter informativo generado mediante la Plataforma de Control Escolar <strong>${CONFIG.appName}</strong>.</p>
                        <p>Para poseer validez oficial ante las autoridades educativas, este formato requiere las firmas y los sellos originales de la institución.</p>
                    </div>
                    
                    <script>
                        setTimeout(() => { window.print(); }, 800);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
        
        window.showToast("Boleta PDF generada con éxito.", "success");
        document.getElementById('resSearchAlumnoDownload').style.display = 'none';
        document.getElementById('adminSearchAlumnoDownload').value = '';
    } catch(e) { console.error(e); alert("Error al generar boleta: " + e.message); }
};

// ==========================================
// MÓDULO BIBLIOTECA / AULA DE MEDIOS
// ==========================================

async function renderBibliotecaDashboard() {
    setTimeout(async () => {
        try {
            const { count: cP } = await supabaseClient.from('biblioteca_prestamos').select('*', {count: 'exact', head:true}).eq('plantel_id', state.plantelId).eq('devuelto', false);
            if(document.getElementById('countPrestamos')) document.getElementById('countPrestamos').innerText = cP || 0;
            const hoy = new Date().toISOString().split('T')[0];
            const { count: cR } = await supabaseClient.from('biblioteca_reservas').select('*', {count: 'exact', head:true}).eq('plantel_id', state.plantelId).eq('fecha', hoy);
            if(document.getElementById('countReservas')) document.getElementById('countReservas').innerText = cR || 0;
        } catch(e) {}
    }, 100);

    return `
      <div class="page-header" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:white; padding:32px; border-radius:24px; margin-bottom:32px;">
        <h2 class="page-title" style="color:white; margin:0 0 8px 0;"><i class="fa-solid fa-book-bookmark"></i> Panel de Biblioteca</h2>
        <p style="margin:0; opacity:0.8;">Gestión de préstamos y aula de medios.</p>
      </div>
      
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
         <div class="card stat-card" style="cursor:pointer;" onclick="window.navigate('/biblioteca/prestamos')">
            <div class="stat-icon" style="background:#eff6ff; color:#3b82f6;"><i class="fa-solid fa-laptop-file"></i></div>
            <div class="stat-info">
               <div class="stat-label">Préstamos Activos</div>
               <div class="stat-value" id="countPrestamos"><i class="fa-solid fa-spinner fa-spin"></i></div>
               <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">Clic para gestionar</p>
            </div>
         </div>
         <div class="card stat-card" style="cursor:pointer;" onclick="window.navigate('/biblioteca/reservas')">
            <div class="stat-icon" style="background:#fef2f2; color:#ef4444;"><i class="fa-solid fa-calendar-check"></i></div>
            <div class="stat-info">
               <div class="stat-label">Reservas de Aula Hoy</div>
               <div class="stat-value" id="countReservas"><i class="fa-solid fa-spinner fa-spin"></i></div>
               <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">Clic para ver calendario</p>
            </div>
         </div>
      </div>
    `;
}

async function renderBibliotecaPrestamos() {
    setTimeout(window.loadBibliotecaPrestamos, 100);
    return `
      <div class="page-header">
         <h2 class="page-title"><i class="fa-solid fa-hand-holding-hand"></i> Préstamos a Alumnos</h2>
      </div>
      
      <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap;">
         <div class="card" style="flex:1; min-width:300px;">
            <h3 style="margin-bottom:15px">Registrar Préstamo</h3>
            <div class="form-group" style="position:relative;">
               <label class="form-label">Buscar Alumno (Nombre o Matrícula)</label>
               <input type="text" id="bibSearchAlumno" class="form-input" placeholder="Escribe para buscar..." oninput="window.bibLiveSearchAlumno(this.value)">
               <div id="bibResSearchAlumno" style="display:none; position:absolute; top:100%; left:0; right:0; background:white; border:1px solid var(--border); border-radius:8px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); z-index:10; max-height:200px; overflow-y:auto;"></div>
            </div>
            
            <div id="bibAlumnoSeleccionado" style="display:none; padding:12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; margin-bottom:15px;">
               <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                     <div style="font-weight:600; color:#1e3a8a;" id="bibAluNom"></div>
                     <div style="font-size:0.8rem; color:#3b82f6;" id="bibAluGrp"></div>
                  </div>
                  <button class="btn btn-outline btn-xs" onclick="window.bibDeselectAlumno()">Cambiar</button>
               </div>
               <input type="hidden" id="bibAluId">
            </div>

            <div class="form-group">
               <label class="form-label">Tipo de Recurso</label>
               <select id="bibTipo" class="form-select">
                  <option value="libro">Libro / Material Lectura</option>
                  <option value="computadora">Computadora / Chromebook</option>
                  <option value="juego">Juego de Mesa / Didáctico</option>
                  <option value="otro">Otro Material / Equipo</option>
               </select>
            </div>
            
            <div class="form-group">
               <label class="form-label">Nombre del Libro o Número de Equipo</label>
               <input type="text" id="bibRecurso" class="form-input" placeholder="Ej. El Principito / Chromebook #12">
            </div>
            
            <div class="form-group" id="bibCondGrp">
               <label class="form-label">Condición o Detalles (Opcional)</label>
               <input type="text" id="bibCondEntrega" class="form-input" placeholder="Ej. Pantalla rayada, faltan piezas, etc.">
            </div>
            
            <button class="btn btn-primary" onclick="window.guardarPrestamoBiblioteca()" style="width:100%;">
               <i class="fa-solid fa-plus"></i> Registrar Préstamo
            </button>
         </div>
         
         <div class="card" style="flex:2; min-width:300px;">
            <h3 style="margin-bottom:15px">Préstamos Activos (No Devueltos)</h3>
            <div id="bibListaPrestamos">
               <div style="text-align:center; padding:20px; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</div>
            </div>
         </div>
      </div>
    `;
}

window.bibLiveSearchAlumno = async (q) => {
    const res = document.getElementById('bibResSearchAlumno');
    if(!res) return;
    if(q.length < 2) { res.style.display='none'; return; }
    try {
        const { data } = await supabaseClient.from('alumnos').select('id, nombre, matricula, grupos(nombre)').eq('plantel_id', state.plantelId).or(`nombre.ilike.%${q}%,matricula.ilike.%${q}%`).limit(8);
        if(!data || data.length === 0) { res.innerHTML='<p style="padding:10px; color:var(--text-muted)">Sin resultados</p>'; res.style.display='block'; return; }
        res.style.display='block';
        res.innerHTML = data.map(a => `
            <div style="padding:10px; border-bottom:1px solid var(--border); cursor:pointer;" onclick="window.bibSelectAlumno('${a.id}', '${a.nombre.replace(/'/g, "\\'")}', '${a.grupos?.nombre || ''}')">
               <div style="font-weight:600; font-size:0.85rem;">${a.nombre}</div>
               <div style="font-size:0.75rem; color:var(--text-muted)">${a.matricula || 'Sin matricula'} - ${a.grupos?.nombre || 'Sin Grupo'}</div>
            </div>
        `).join('');
    } catch(e) { console.error(e); }
};

window.bibSelectAlumno = (id, nombre, grupo) => {
    document.getElementById('bibAluId').value = id;
    document.getElementById('bibAluNom').innerText = nombre;
    document.getElementById('bibAluGrp').innerText = grupo;
    document.getElementById('bibAlumnoSeleccionado').style.display = 'block';
    document.getElementById('bibResSearchAlumno').style.display = 'none';
    document.getElementById('bibSearchAlumno').value = '';
    document.getElementById('bibSearchAlumno').parentElement.style.display = 'none';
};

window.bibDeselectAlumno = () => {
    document.getElementById('bibAluId').value = '';
    document.getElementById('bibAlumnoSeleccionado').style.display = 'none';
    document.getElementById('bibSearchAlumno').parentElement.style.display = 'block';
};

window.loadBibliotecaPrestamos = async () => {
    const container = document.getElementById('bibListaPrestamos');
    if(!container) return;
    try {
        const { data, error } = await supabaseClient.from('biblioteca_prestamos')
            .select('*, alumnos(nombre, grupos(nombre))')
            .eq('plantel_id', state.plantelId)
            .eq('devuelto', false)
            .order('fecha_prestamo', { ascending: false });
            
        if(error) throw error;
        
        if(!data || data.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-style:italic;">No hay préstamos activos. Todos han devuelto su material.</div>';
            return;
        }
        
        container.innerHTML = data.map(p => {
            let icon = '<i class="fa-solid fa-box" style="color:#f59e0b"></i>';
            let bg = '#fef3c7';
            if (p.tipo === 'libro') { icon = '<i class="fa-solid fa-book" style="color:#8b5cf6"></i>'; bg = '#f3e8ff'; }
            else if (p.tipo === 'computadora') { icon = '<i class="fa-solid fa-laptop" style="color:#3b82f6"></i>'; bg = '#eff6ff'; }
            else if (p.tipo === 'juego') { icon = '<i class="fa-solid fa-chess-knight" style="color:#10b981"></i>'; bg = '#d1fae5'; }
            const f = new Date(p.fecha_prestamo).toLocaleString([], {day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'});
            
            return `
               <div style="border:1px solid var(--border); border-radius:12px; padding:16px; margin-bottom:12px; display:flex; gap:16px; align-items:center;">
                  <div style="width:48px; height:48px; border-radius:12px; background:${bg}; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
                     ${icon}
                  </div>
                  <div style="flex:1;">
                     <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:4px;">${p.recurso}</div>
                     <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:2px;"><i class="fa-regular fa-user"></i> ${p.alumnos?.nombre || 'Alumno'} (${p.alumnos?.grupos?.nombre || ''})</div>
                     <div style="font-size:0.75rem; color:var(--text-muted);"><i class="fa-regular fa-clock"></i> Prestado: ${f}</div>
                     ${p.condicion_entrega ? `<div style="margin-top:4px; font-size:0.75rem; background:#fffbeb; color:#d97706; padding:4px 8px; border-radius:4px; display:inline-block;"><i class="fa-solid fa-triangle-exclamation"></i> Entregado con: ${p.condicion_entrega}</div>` : ''}
                  </div>
                  <div>
                     <button class="btn btn-primary btn-sm" onclick="window.bibDevolverPrestamo('${p.id}')"><i class="fa-solid fa-check"></i> Devolver</button>
                     <button class="btn btn-outline btn-sm" style="color:var(--danger); border-color:var(--danger); padding:6px 10px;" onclick="window.bibEliminarPrestamo('${p.id}')" title="Eliminar Registro"><i class="fa-solid fa-trash"></i></button>
                  </div>
               </div>
            `;
        }).join('');
        
    } catch(e) {
        console.error(e);
        container.innerHTML = '<div style="color:var(--danger);">Error al cargar préstamos.</div>';
    }
};

window.guardarPrestamoBiblioteca = async () => {
    const alumno_id = document.getElementById('bibAluId').value;
    const tipo = document.getElementById('bibTipo').value;
    const recurso = document.getElementById('bibRecurso').value.trim();
    const condicion_entrega = document.getElementById('bibCondEntrega').value.trim();
    
    if(!alumno_id) return window.showToast("Selecciona un alumno.", "error");
    if(!recurso) return window.showToast("Escribe el nombre del libro o equipo.", "error");
    
    try {
        const { error } = await supabaseClient.from('biblioteca_prestamos').insert([{
            alumno_id, tipo, recurso, condicion_entrega, plantel_id: state.plantelId
        }]);
        if(error) throw error;
        
        window.showToast("Préstamo registrado exitosamente.", "success");
        document.getElementById('bibRecurso').value = '';
        document.getElementById('bibCondEntrega').value = '';
        window.bibDeselectAlumno();
        window.loadBibliotecaPrestamos();
    } catch(e) {
        console.error(e);
        window.showToast("Error al registrar préstamo.", "error");
    }
};

function renderBibliotecaBitacora() {
  const tD = new Date().toLocaleDateString('en-CA');
  setTimeout(() => { if(window.cargarBitacora) window.cargarBitacora(tD); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title"><i class="fa-solid fa-book-journal-whills"></i> Bitácora de Biblioteca / Aula de Medios</h2>
      <p class="page-subtitle">Registro de incidencias, recados o reportes acontecidos en tu área. Compartible con Directivo y Trabajo Social.</p>
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
               <label class="form-label">Firma de Registro (Tu Nombre)</label>
               <input type="text" class="form-input" id="autorBitacora" placeholder="Escribe cómo quieres firmar...">
            </div>
            <div class="form-group" style="flex:2; min-width:300px; margin:0;">
               <label class="form-label">Añadir Acontecimiento</label>
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

window.bibDevolverPrestamo = async (id) => {
    const cond = prompt("¿En qué condición se devuelve? (Opcional, deja vacío si está bien)");
    if(cond === null) return; 
    
    try {
        const { error } = await supabaseClient.from('biblioteca_prestamos').update({
            devuelto: true,
            fecha_devolucion: new Date().toISOString(),
            condicion_devolucion: cond || null
        }).eq('id', id);
        
        if(error) throw error;
        window.showToast("Material devuelto correctamente.", "success");
        window.loadBibliotecaPrestamos();
    } catch(e) {
        console.error(e);
        window.showToast("Error al devolver.", "error");
    }
};

window.bibEliminarPrestamo = async (id) => {
    if(!confirm("¿Seguro que deseas ELIMINAR este registro de préstamo por completo?")) return;
    try {
        const { error } = await supabaseClient.from('biblioteca_prestamos').delete().eq('id', id);
        if(error) throw error;
        window.showToast("Registro eliminado.", "success");
        window.loadBibliotecaPrestamos();
    } catch(e) {
        console.error(e);
        window.showToast("Error al eliminar.", "error");
    }
};

async function renderBibliotecaReservas() {
    setTimeout(() => { window.loadBibliotecaReservas(true); }, 100);
    return `
      <div class="page-header">
         <h2 class="page-title"><i class="fa-solid fa-calendar-plus"></i> Reservaciones Aula de Medios</h2>
      </div>
      <div class="card">
         <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3 style="margin:0;">Horarios Apartados</h3>
            <input type="date" id="bibReservaFecha" class="form-input" style="width:auto;" value="${new Date().toISOString().split('T')[0]}" onchange="window.loadBibliotecaReservas(true)">
         </div>
         <div id="bibListaReservas">
            <div style="text-align:center; padding:20px; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</div>
         </div>
      </div>
    `;
}

window.loadBibliotecaReservas = async (isBib = false) => {
    const prefix = isBib ? 'bib' : 'maestro';
    const container = document.getElementById(prefix + 'ListaReservas');
    const fecha = document.getElementById(prefix + 'ReservaFecha')?.value;
    if(!container || !fecha) return;
    
    try {
        const { data, error } = await supabaseClient.from('biblioteca_reservas')
            .select('*, perfiles(nombre)')
            .eq('plantel_id', state.plantelId)
            .eq('fecha', fecha)
            .order('hora_inicio', { ascending: true });
            
        if(error) throw error;
        
        if(!data || data.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:30px; background:#f8fafc; border-radius:12px; color:var(--text-muted); border:1px dashed #cbd5e1;">No hay reservaciones para esta fecha.</div>';
            return;
        }
        
        container.innerHTML = data.map(r => {
            const hI = r.hora_inicio.substring(0,5);
            const hF = r.hora_fin.substring(0,5);
            const isMine = r.maestro_id === state.user.id || state.role === 'biblioteca' || state.role === 'admin';
            
            return `
               <div style="border-left:4px solid var(--primary); background:#f8fafc; padding:16px; margin-bottom:12px; border-radius:0 8px 8px 0; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                     <div style="font-weight:700; font-size:1.1rem; color:var(--text-main); margin-bottom:4px;">${hI} - ${hF}</div>
                     <div style="font-size:0.9rem; color:#475569; font-weight:500;"><i class="fa-solid fa-chalkboard-user" style="color:var(--text-muted)"></i> Maestro: ${r.perfiles?.nombre || 'Desconocido'}</div>
                     ${r.proposito ? `<div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;"><i class="fa-regular fa-comment-dots"></i> ${r.proposito}</div>` : ''}
                  </div>
                  ${isMine ? `<button class="btn btn-outline btn-sm" style="color:var(--danger); border-color:var(--danger);" onclick="window.bibEliminarReserva('${r.id}', ${isBib})"><i class="fa-solid fa-trash"></i> Cancelar</button>` : ''}
               </div>
            `;
        }).join('');
        
    } catch(e) {
        console.error(e);
        container.innerHTML = '<div style="color:var(--danger);">Error al cargar reservaciones.</div>';
    }
};

window.bibEliminarReserva = async (id, isBib) => {
    if(!confirm("¿Seguro que deseas cancelar esta reservación?")) return;
    try {
        const { error } = await supabaseClient.from('biblioteca_reservas').delete().eq('id', id);
        if(error) throw error;
        window.showToast("Reservación cancelada.", "success");
        window.loadBibliotecaReservas(isBib);
    } catch(e) { console.error(e); window.showToast("Error al cancelar.", "error"); }
};

async function renderMaestroAulaMedios() {
    setTimeout(() => { window.loadBibliotecaReservas(false); }, 100);
    return `
      <div class="page-header">
         <h2 class="page-title"><i class="fa-solid fa-desktop"></i> Reservar Aula de Medios</h2>
         <p style="opacity:0.8; margin:0;">Consulta disponibilidad y aparta el aula para tu clase.</p>
      </div>
      
      <div style="display:flex; gap:24px; align-items:flex-start; flex-wrap:wrap;">
         <div class="card" style="flex:1; min-width:300px;">
            <h3 style="margin-bottom:15px">Nueva Reservación</h3>
            
            <div class="form-group">
               <label class="form-label">Fecha</label>
               <input type="date" id="mReservaFecha" class="form-input" value="${new Date().toISOString().split('T')[0]}" onchange="document.getElementById('maestroReservaFecha').value = this.value; window.loadBibliotecaReservas(false)">
            </div>
            
            <div style="display:flex; gap:10px;">
                <div class="form-group" style="flex:1;">
                   <label class="form-label">Hora Inicio</label>
                   <input type="time" id="mReservaInicio" class="form-input" value="08:00">
                </div>
                <div class="form-group" style="flex:1;">
                   <label class="form-label">Hora Fin</label>
                   <input type="time" id="mReservaFin" class="form-input" value="09:00">
                </div>
            </div>
            
            <div class="form-group">
               <label class="form-label">Propósito / Grupo (Opcional)</label>
               <input type="text" id="mReservaProposito" class="form-input" placeholder="Ej. Práctica de Excel con 2do A">
            </div>
            
            <button class="btn btn-primary" onclick="window.maestroGuardarReserva()" style="width:100%;">
               <i class="fa-solid fa-calendar-check"></i> Confirmar Reservación
            </button>
            <p style="font-size:0.75rem; color:var(--text-muted); margin-top:10px;">* El sistema bloqueará empalmes de horario automáticamente.</p>
         </div>
         
         <div class="card" style="flex:1.5; min-width:300px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="margin:0;">Disponibilidad del Día</h3>
                <input type="hidden" id="maestroReservaFecha" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div id="maestroListaReservas">
               <div style="text-align:center; padding:20px; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</div>
            </div>
         </div>
      </div>
    `;
}

window.maestroGuardarReserva = async () => {
    const fecha = document.getElementById('mReservaFecha').value;
    const inicio = document.getElementById('mReservaInicio').value;
    const fin = document.getElementById('mReservaFin').value;
    const proposito = document.getElementById('mReservaProposito').value.trim();
    
    if(!fecha || !inicio || !fin) return window.showToast("Completa la fecha y horas.", "error");
    if(inicio >= fin) return window.showToast("La hora de fin debe ser mayor a la de inicio.", "error");
    
    try {
        // Verificar empalmes
        const { data: empalmes, error: errEmp } = await supabaseClient.from('biblioteca_reservas')
            .select('id')
            .eq('plantel_id', state.plantelId)
            .eq('fecha', fecha)
            .lte('hora_inicio', fin)
            .gte('hora_fin', inicio);
            
        if(errEmp) throw errEmp;
        
        if(empalmes && empalmes.length > 0) {
            return window.showToast("¡El aula ya está reservada en ese horario!", "error");
        }
        
        // Guardar
        const { error } = await supabaseClient.from('biblioteca_reservas').insert([{
            maestro_id: state.user.id,
            fecha: fecha,
            hora_inicio: inicio,
            hora_fin: fin,
            proposito: proposito,
            plantel_id: state.plantelId
        }]);
        
        if(error) throw error;
        
        window.showToast("Reservación confirmada.", "success");
        document.getElementById('mReservaProposito').value = '';
        window.loadBibliotecaReservas(false);
    } catch(e) {
        console.error(e);
        window.showToast("Error al reservar.", "error");
    }
};

async function renderBibliotecaComunicados() {
    return window.renderPersonalComunicados('Biblioteca'); 
}

function renderBibliotecaHistorial() {
  const today = new Date().toLocaleDateString('en-CA');
  setTimeout(() => { if(window.loadHistorialBiblioteca) window.loadHistorialBiblioteca(today); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title"><i class="fa-solid fa-calendar-days"></i> Historial de Préstamos</h2>
      <p class="page-subtitle">Consulta qué materiales se prestaron y devolvieron en fechas anteriores.</p>
    </div>
    <div class="card" style="max-width:800px; margin:0 auto;">
       <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border); padding-bottom:16px; flex-wrap:wrap; gap:15px;">
          <h3 style="margin:0;">Préstamos por Día</h3>
          <div style="display:flex; gap:10px; align-items:center;">
             <label style="font-size:0.8rem; font-weight:bold; color:var(--text-muted);">Selecciona una Fecha:</label>
             <input type="date" class="form-input" id="fechaHistorialBib" value="${today}" onchange="window.loadHistorialBiblioteca(this.value)" style="margin:0;">
          </div>
       </div>
       <div id="contenedorHistorialBib" style="display:flex; flex-direction:column; gap:12px;">
          <div style="text-align:center; padding:20px; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Cargando historial...</div>
       </div>
    </div>
  `;
}

window.loadHistorialBiblioteca = async (fecha) => {
    const cont = document.getElementById('contenedorHistorialBib');
    if(!cont) return;
    try {
        cont.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</div>';
        const start = fecha + "T00:00:00.000Z";
        const end = fecha + "T23:59:59.999Z";
        
        const { data, error } = await supabaseClient.from('biblioteca_prestamos')
            .select('*, alumnos(nombre, grupos(nombre))')
            .eq('plantel_id', state.plantelId)
            .gte('fecha_prestamo', start)
            .lte('fecha_prestamo', end)
            .order('fecha_prestamo', { ascending: false });
            
        if(error) throw error;
        
        if(!data || data.length === 0) {
            cont.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted);">No se registraron préstamos en esta fecha.</div>';
            return;
        }
        
        cont.innerHTML = data.map(p => {
            let icon = '<i class="fa-solid fa-box" style="color:#f59e0b"></i>';
            let bg = '#fef3c7';
            if (p.tipo === 'libro') { icon = '<i class="fa-solid fa-book" style="color:#8b5cf6"></i>'; bg = '#f3e8ff'; }
            else if (p.tipo === 'computadora') { icon = '<i class="fa-solid fa-laptop" style="color:#3b82f6"></i>'; bg = '#eff6ff'; }
            else if (p.tipo === 'juego') { icon = '<i class="fa-solid fa-chess-knight" style="color:#10b981"></i>'; bg = '#d1fae5'; }
            
            const f = new Date(p.fecha_prestamo).toLocaleString([], {hour:'2-digit', minute:'2-digit'});
            const estado = p.devuelto ? '<span style="color:var(--success); font-weight:bold;"><i class="fa-solid fa-check"></i> Devuelto</span>' : '<span style="color:var(--danger); font-weight:bold;"><i class="fa-solid fa-clock"></i> Pendiente</span>';
            
            return `
               <div style="border:1px solid var(--border); border-radius:12px; padding:16px; display:flex; gap:16px; align-items:center; background:${p.devuelto ? 'white' : '#fff5f5'};">
                  <div style="width:48px; height:48px; border-radius:12px; background:${bg}; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
                     ${icon}
                  </div>
                  <div style="flex:1;">
                     <div style="font-weight:700; font-size:1rem; color:var(--text-main); margin-bottom:4px;">${p.recurso}</div>
                     <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:2px;"><i class="fa-regular fa-user"></i> ${p.alumnos?.nombre || 'Alumno'} (${p.alumnos?.grupos?.nombre || ''})</div>
                     <div style="font-size:0.75rem; color:var(--text-muted);"><i class="fa-regular fa-clock"></i> Prestado: ${f}</div>
                     ${p.condicion_entrega ? `<div style="margin-top:4px; font-size:0.75rem; color:var(--text-muted);">Condición inicial: ${p.condicion_entrega}</div>` : ''}
                  </div>
                  <div style="text-align:right;">
                     <div style="margin-bottom:4px;">${estado}</div>
                     ${p.condicion_devolucion ? `<div style="margin-top:4px; font-size:0.7rem; background:#fffbeb; color:#d97706; padding:2px 6px; border-radius:4px; display:inline-block;"><i class="fa-solid fa-triangle-exclamation"></i> Detalle: ${p.condicion_devolucion}</div>` : ''}
                  </div>
               </div>
            `;
        }).join('');
    } catch(e) {
        console.error(e);
        cont.innerHTML = '<div style="color:var(--danger); text-align:center;">Error al cargar historial.</div>';
    }
};

// =====================================================================
// MÓDULO ESTUDIO BIOPSICOSOCIAL (TRABAJO SOCIAL & ALUMNO)
// =====================================================================

function renderApoyoPsicosocial() {
    setTimeout(() => { window.loadPsicosocialStats(); }, 100);
    return `
    <div class="page-header">
        <h2 class="page-title"><i class="fa-solid fa-brain" style="color:var(--primary)"></i> Estudio Biopsicosocial</h2>
        <p class="page-subtitle">Gestión de cuestionarios biopsicosociales para familias.</p>
    </div>

    <div class="tabs" style="margin-bottom:20px;">
        <button class="tab-btn active" onclick="window.switchTabPsico(this, 'tab-psico-stats')">Estadística General</button>
        <button class="tab-btn" onclick="window.switchTabPsico(this, 'tab-psico-enviar')">Enviar Cuestionarios</button>
        <button class="tab-btn" onclick="window.switchTabPsico(this, 'tab-psico-expediente')">Revisión Individual</button>
    </div>

    <!-- TAB ESTADISTICAS -->
    <div id="tab-psico-stats" class="tab-content" style="display:block;">
        <div class="card" style="padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="margin:0;">Análisis Biopsicosocial</h3>
                <button class="btn btn-sm btn-outline" onclick="window.loadPsicosocialStats()"><i class="fa-solid fa-rotate"></i> Actualizar</button>
            </div>
            <div style="background:#f8f9fa; padding:15px; border-radius:8px; border:1px solid var(--border); display:flex; gap:15px; margin-bottom:20px; align-items:flex-end;">
                <div style="flex:1;">
                    <label style="font-size:0.85rem; font-weight:bold; color:var(--text-main);">Analizar Por:</label>
                    <select id="psicoStatsFiltro" class="form-input" onchange="window.updatePsicoEspecifInput('psicoStatsFiltro', 'psicoStatsInputContainer', 'psicoStatsValor')">
                        <option value="todos">Todo el Plantel (Escuela)</option>
                        <option value="grado">Por Grado</option>
                        <option value="grupo">Por Grupo</option>
                        <option value="alumno">Por Alumno (ID o Nombre)</option>
                    </select>
                </div>
                <div style="flex:1;">
                    <label style="font-size:0.85rem; font-weight:bold; color:var(--text-main);">Valor Específico:</label>
                    <div id="psicoStatsInputContainer">
                        <input type="text" id="psicoStatsValor" class="form-input" placeholder="No aplica para 'Todos'" disabled>
                    </div>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="window.loadPsicosocialStats()"><i class="fa-solid fa-filter"></i> Filtrar Gráficos</button>
                </div>
            </div>
            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px; margin-bottom:20px;" id="psicoStatsCards">
                <div style="padding:20px; text-align:center; color:var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Cargando...</div>
            </div>
            <h4>Gráficos</h4>
            <div id="psicoChartsDynamicContainer" class="grid" style="grid-template-columns: 1fr 1fr; gap:20px;">
                <div style="color:var(--text-muted); font-size:0.9rem;">Los gráficos se generarán automáticamente en base a las respuestas recolectadas.</div>
            </div>
        </div>
    </div>

    <!-- TAB ENVIAR -->
    <div id="tab-psico-enviar" class="tab-content" style="display:none;">
        <div class="card" style="padding:20px;">
            <h3 style="margin-top:0;">Crear y Enviar Cuestionario</h3>
            <p style="color:var(--text-muted); font-size:0.9rem;">Diseña tu propio cuestionario biopsicosocial y selecciona a quién deseas enviarlo. Les aparecerá una alerta obligatoria en su pantalla de inicio.</p>
            
            <div style="margin-bottom:15px; margin-top:15px;">
                <label style="font-weight:bold;">Título del Estudio:</label>
                <input type="text" id="psicoBuilderTitulo" class="form-input" placeholder="Ej. Estudio Familiar 2026-A" value="Estudio Biopsicosocial General">
            </div>

            <div style="background:#f8f9fa; border:1px solid var(--border); border-radius:8px; padding:15px; margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h4 style="margin:0;">Preguntas del Cuestionario</h4>
                    <button class="btn btn-sm btn-outline" onclick="window.psicoBuilderAddQuestion()"><i class="fa-solid fa-plus"></i> Añadir Pregunta</button>
                </div>
                <div id="psicoBuilderPreguntas" style="display:flex; flex-direction:column; gap:5px;">
                    <!-- Preguntas dinámicas aquí -->
                </div>
            </div>
            
            <div style="margin:20px 0; display:flex; gap:15px; align-items:flex-end;">
                <div style="flex:1;">
                    <label style="font-weight:bold;">Filtro de Envío:</label>
                    <select id="psicoFiltroEnvio" class="form-input" onchange="window.updatePsicoEspecifInput('psicoFiltroEnvio', 'psicoEnvioInputContainer', 'psicoEspecifEnvio')">
                        <option value="todos">Todos los alumnos del plantel</option>
                        <option value="grado">Por Grado</option>
                        <option value="grupo">Por Grupo</option>
                        <option value="alumno">Por Alumno (ID o Nombre)</option>
                    </select>
                </div>
                <div style="flex:1;">
                    <label style="font-weight:bold;">Específico (Grado, Grupo, Nombre/ID):</label>
                    <div id="psicoEnvioInputContainer">
                        <input type="text" id="psicoEspecifEnvio" class="form-input" placeholder="No aplica para 'Todos'" disabled>
                    </div>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="window.enviarPsicosocial()"><i class="fa-solid fa-paper-plane"></i> Guardar y Enviar a Alumnos</button>
                </div>
            </div>
        </div>
    </div>

    <!-- TAB REVISIÓN INDIVIDUAL -->
    <div id="tab-psico-expediente" class="tab-content" style="display:none;">
        <div class="card" style="padding:20px;">
            <h3 style="margin-top:0;">Expediente Biopsicosocial del Alumno</h3>
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <input type="text" id="busquedaPsicoInput" class="form-input" placeholder="Buscar alumno por nombre o matrícula..." onkeyup="window.buscarAlumnoPsico(this.value)" style="flex:1;">
            </div>
            <div id="resPsicoAlu" style="position:relative; z-index:10; background:white; width:100%; border-radius:8px; box-shadow:var(--shadow); display:none; max-height:200px; overflow-y:auto; margin-top:-10px; margin-bottom:20px; border:1px solid var(--border);"></div>

            <div id="psicoExpedienteView" style="display:none; margin-top:20px; border-top:1px solid var(--border); padding-top:20px;">
                <!-- Aqui se renderiza el expediente -->
            </div>
        </div>
    </div>
    `;
}

window.switchTabPsico = (btn, tabId) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => {
        if (c.id && c.id.startsWith('tab-psico')) {
            c.style.display = 'none';
        }
    });
    btn.classList.add('active');
    document.getElementById(tabId).style.display = 'block';
};

window.buscarAlumnoPsicoGenerico = async (term, inputId, resId) => {
    const res = document.getElementById(resId);
    if(!term || term.length < 3) { res.style.display = 'none'; return; }
    
    try {
        const { data, error } = await supabaseClient.from('alumnos').select('id, nombre, matricula, grupos(nombre)').ilike('nombre', `%${term}%`).limit(5);
        if(error || !data) return;
        
        if(data.length === 0) { res.innerHTML = '<div style="padding:10px;">Sin resultados</div>'; res.style.display = 'block'; return; }
        
        res.innerHTML = data.map(a => `
            <div style="padding:10px; border-bottom:1px solid var(--border); cursor:pointer; background:white;" onclick="window.selectAlumnoPsicoGenerico('${a.id}', '${a.nombre}', '${inputId}', '${resId}')" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
                <strong style="color:var(--primary)">${a.nombre}</strong> <small style="color:var(--text-muted)">(${a.grupos?.nombre || 'Sin Grupo'}) - ${a.matricula}</small>
            </div>
        `).join('');
        res.style.display = 'block';
    } catch(e) { console.error(e); }
};

window.selectAlumnoPsicoGenerico = (id, nombre, inputId, resId) => {
    document.getElementById(resId).style.display = 'none';
    document.getElementById(inputId).value = id;
    window.showToast(`Alumno seleccionado: ${nombre}`, 'success');
};

window.buscarAlumnoPsico = async (term) => {
    const res = document.getElementById('resPsicoAlu');
    if(!term || term.length < 3) { res.style.display = 'none'; return; }
    
    try {
        const { data, error } = await supabaseClient.from('alumnos').select('id, nombre, matricula, grupos(nombre)').ilike('nombre', `%${term}%`).limit(5);
        if(error || !data) return;
        
        if(data.length === 0) { res.innerHTML = '<div style="padding:10px;">Sin resultados</div>'; res.style.display = 'block'; return; }
        
        res.innerHTML = data.map(a => `
            <div style="padding:10px; border-bottom:1px solid var(--border); cursor:pointer;" onclick="window.selectAlumnoPsico('${a.id}', '${a.nombre}')">
                <strong style="color:var(--primary)">${a.nombre}</strong> <small style="color:var(--text-muted)">(${a.grupos?.nombre || 'Sin Grupo'}) - ${a.matricula}</small>
            </div>
        `).join('');
        res.style.display = 'block';
    } catch(e) { console.error(e); }
};

window.selectAlumnoPsico = async (id, nombre) => {
    document.getElementById('resPsicoAlu').style.display = 'none';
    document.getElementById('busquedaPsicoInput').value = nombre;
    const view = document.getElementById('psicoExpedienteView');
    view.innerHTML = '<div style="text-align:center;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando expediente...</div>';
    view.style.display = 'block';

    try {
        const { data, error } = await supabaseClient.from('estudios_psicosociales').select('*').eq('alumno_id', id).order('fecha_envio', {ascending: false}).limit(1);
        
        if(error || !data || data.length === 0) {
            view.innerHTML = `<div class="alert alert-warning">No hay un estudio biopsicosocial registrado ni pendiente para ${nombre}.</div>`;
            return;
        }
        
        const est = data[0];
        
        if(est.estado === 'pendiente') {
            view.innerHTML = `<div class="alert alert-warning">El estudio fue enviado el ${new Date(est.fecha_envio).toLocaleDateString()}, pero la familia aún no lo ha respondido.</div>`;
            return;
        }

        const r = est.respuestas || {};
        
        let repHTML = '';
        Object.keys(r).forEach(k => {
            let val = Array.isArray(r[k]) ? r[k].join(', ') : r[k];
            repHTML += `<div style="background:#f8f9fa; padding:10px; border-radius:8px; border:1px solid var(--border);"><strong>${k}:</strong><br> ${val || '---'}</div>`;
        });
        
        view.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0; color:var(--primary);">Respuestas de la Familia</h3>
                <div>
                    <span class="badge" style="background:var(--success); color:white; margin-right:10px;">Completado el ${new Date(est.fecha_respuesta).toLocaleDateString()}</span>
                    <button class="btn btn-sm btn-outline" onclick="window.imprimirExpedientePsicosocial('${nombre}', '${est.id}')"><i class="fa-solid fa-print"></i> Imprimir Expediente</button>
                </div>
            </div>
            
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:20px;">
                ${repHTML}
            </div>

            <div style="background:#fffdf7; border:1px solid #ffeeba; padding:15px; border-radius:8px;">
                <h4 style="margin-top:0; color:#856404;"><i class="fa-solid fa-lock"></i> Notas Privadas de Trabajo Social</h4>
                <p style="font-size:0.8rem; color:#856404;">Estas notas son invisibles para la familia y maestros. Solo Trabajo Social/Directivos tienen acceso.</p>
                <textarea id="psicoNota_${est.id}" class="form-input" style="height:100px; margin-bottom:10px;" placeholder="Registrar situaciones particulares del estudiante o la familia aquí...">${est.notas_privadas || ''}</textarea>
                <button class="btn btn-sm" style="background:#856404; color:white;" onclick="window.guardarNotaPsico('${est.id}')">Guardar Nota</button>
            </div>
        `;
    } catch(e) { console.error(e); }
};

window.guardarNotaPsico = async (id) => {
    const txt = document.getElementById(`psicoNota_${id}`).value;
    window.showToast('Guardando...', 'info');
    try {
        const { error } = await supabaseClient.from('estudios_psicosociales').update({ notas_privadas: txt }).eq('id', id);
        if(error) throw error;
        window.showToast('Nota privada guardada', 'success');
    } catch(e) { console.error(e); window.showToast('Error al guardar', 'error'); }
};

window.imprimirExpedientePsicosocial = async (nombre, estId) => {
    try {
        const { data, error } = await supabaseClient.from('estudios_psicosociales').select('*, cuestionarios_psicosociales(titulo)').eq('id', estId).single();
        if(error) throw error;
        
        const r = data.respuestas || {};
        let tbl = `<table style="width:100%; border-collapse:collapse; margin-top:20px;">
                    <tbody>`;
        
        Object.keys(r).forEach(k => {
            let val = Array.isArray(r[k]) ? r[k].join(', ') : r[k];
            tbl += `<tr>
                        <td style="border:1px solid #ccc; padding:10px; width:40%; font-weight:bold; background:#f9f9f9;">${k}</td>
                        <td style="border:1px solid #ccc; padding:10px;">${val || '---'}</td>
                    </tr>`;
        });
        tbl += `</tbody></table>`;
        
        const title = data.cuestionarios_psicosociales?.titulo || "Estudio Biopsicosocial";
        const notasHTML = data.notas_privadas ? `<h3 style="margin-top:30px;">Notas Confidenciales</h3><p style="white-space:pre-wrap;">${data.notas_privadas}</p>` : '';
        
        const plantelRes = await supabaseClient.from('planteles').select('nombre').eq('id', state.plantelId).single();
        const schoolName = plantelRes.data?.nombre || CONFIG.schoolName || 'Escuela';
        
        const win = window.open('', '_blank');
        win.document.write(`
            <html><head><title>Expediente Biopsicosocial</title>
            <style>body{font-family:Arial,sans-serif; padding:20px;} h2,h3{color:#333; margin-bottom:5px;} .header{text-align:center; margin-bottom:20px; border-bottom:2px solid #000; padding-bottom:10px;}</style>
            </head><body>
                <div class="header">
                    <h2>${schoolName}</h2>
                    <h3>Expediente del ${title}</h3>
                </div>
                <p><strong>Alumno(a):</strong> ${nombre}</p>
                <p><strong>Fecha de Respuesta:</strong> ${new Date(data.fecha_respuesta).toLocaleDateString()}</p>
                ${tbl}
                ${notasHTML}
                <div style="margin-top:50px; text-align:center;">
                    <p>_____________________________________</p>
                    <p>Departamento de Trabajo Social</p>
                    <p>${state.user.nombre}</p>
                </div>
            </body></html>
        `);
        win.document.close();
        win.print();
    } catch(e) {
        console.error(e);
        window.showToast('Error al imprimir expediente', 'error');
    }
};

window.psicoBuilderAddQuestion = (q = null) => {
    const id = 'pq_' + Date.now() + Math.floor(Math.random()*1000);
    const pre = q || { titulo: '', tipo: 'select', opciones: 'Buena, Regular, Mala' };
    
    const div = document.createElement('div');
    div.id = id;
    div.style.cssText = 'background:white; border:1px solid var(--border); padding:15px; border-radius:8px; position:relative; margin-bottom:10px;';
    
    div.innerHTML = `
        <div style="position:absolute; top:10px; right:10px;">
            <button class="btn btn-sm" style="background:#ef4444; color:white; padding:4px 8px;" onclick="document.getElementById('${id}').remove()"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div style="display:flex; gap:15px; margin-bottom:10px; padding-right:30px;">
            <div style="flex:2;">
                <label style="font-size:0.8rem;">Pregunta:</label>
                <input type="text" class="form-input psico-q-titulo" placeholder="Ej. ¿Tipo de Vivienda?" value="${pre.titulo}" required>
            </div>
            <div style="flex:1;">
                <label style="font-size:0.8rem;">Tipo:</label>
                <select class="form-input psico-q-tipo" onchange="this.parentElement.nextElementSibling.style.display = (this.value==='select' || this.value==='checkbox') ? 'block' : 'none'">
                    <option value="select" ${pre.tipo==='select'?'selected':''}>Opción Múltiple (Desplegable)</option>
                    <option value="checkbox" ${pre.tipo==='checkbox'?'selected':''}>Casillas (Múltiples opciones)</option>
                    <option value="text" ${pre.tipo==='text'?'selected':''}>Texto Corto</option>
                    <option value="textarea" ${pre.tipo==='textarea'?'selected':''}>Párrafo (Texto Largo)</option>
                </select>
            </div>
        </div>
        <div class="psico-q-opciones-container" style="display:${(pre.tipo==='select' || pre.tipo==='checkbox') ? 'block':'none'};">
            <label style="font-size:0.8rem;">Opciones (separadas por coma):</label>
            <input type="text" class="form-input psico-q-opciones" placeholder="Ej. Propia, Rentada, Prestada" value="${pre.opciones || ''}">
        </div>
    `;
    document.getElementById('psicoBuilderPreguntas').appendChild(div);
};

window.psicoBuilderGetJSON = () => {
    const arr = [];
    document.getElementById('psicoBuilderPreguntas').querySelectorAll('div[id^="pq_"]').forEach(div => {
        const tit = div.querySelector('.psico-q-titulo').value.trim();
        const tipo = div.querySelector('.psico-q-tipo').value;
        const opc = div.querySelector('.psico-q-opciones').value.trim();
        if(tit) {
            arr.push({ id: div.id, titulo: tit, tipo: tipo, opciones: opc });
        }
    });
    return arr;
};

window.updatePsicoEspecifInput = async (filtroId, containerId, inputId) => {
    const filtro = document.getElementById(filtroId).value;
    const container = document.getElementById(containerId);
    if(!container) return;

    if (filtro === 'todos') {
        container.innerHTML = `<input type="text" id="${inputId}" class="form-input" placeholder="No aplica para 'Todos'" disabled>`;
    } else if (filtro === 'grado') {
        container.innerHTML = `<select id="${inputId}" class="form-input"><option>Cargando grados...</option></select>`;
        try {
            const { data } = await supabaseClient.from('grupos').select('nombre').eq('plantel_id', state.plantelId);
            if(data && data.length > 0) {
                const grados = [...new Set(data.map(g => parseInt(g.nombre)).filter(g => !isNaN(g)))].sort((a,b)=>a-b);
                if(grados.length > 0) {
                    container.innerHTML = `<select id="${inputId}" class="form-input">` + 
                        grados.map(g => `<option value="${g}">${g}</option>`).join('') + `</select>`;
                } else {
                    container.innerHTML = `<select id="${inputId}" class="form-input"><option value="">Sin grados registrados</option></select>`;
                }
            } else {
                container.innerHTML = `<select id="${inputId}" class="form-input"><option value="">Sin grados registrados</option></select>`;
            }
        } catch(e) {
            container.innerHTML = `<input type="text" id="${inputId}" class="form-input" placeholder="Error al cargar grados">`;
        }
    } else if (filtro === 'grupo') {
        container.innerHTML = `<select id="${inputId}" class="form-input"><option>Cargando grupos...</option></select>`;
        try {
            const { data } = await supabaseClient.from('grupos').select('id, nombre').eq('plantel_id', state.plantelId).order('nombre');
            if(data && data.length > 0) {
                container.innerHTML = `<select id="${inputId}" class="form-input">` + 
                    data.map(g => `<option value="${g.id}">${g.nombre}</option>`).join('') + `</select>`;
            } else {
                container.innerHTML = `<select id="${inputId}" class="form-input"><option value="">Sin grupos registrados</option></select>`;
            }
        } catch(e) {
            container.innerHTML = `<input type="text" id="${inputId}" class="form-input" placeholder="Error al cargar grupos">`;
        }
    } else if (filtro === 'alumno') {
        container.innerHTML = `
        <div style="position:relative;">
            <input type="text" id="${inputId}" class="form-input" placeholder="Nombre del alumno o ID" onkeyup="window.buscarAlumnoPsicoGenerico(this.value, '${inputId}', '${inputId}_res')" autocomplete="off">
            <div id="${inputId}_res" style="position:absolute; top:100%; left:0; right:0; background:white; border:1px solid var(--border); z-index:100; display:none; max-height:200px; overflow-y:auto; border-radius:0 0 8px 8px; box-shadow:0 4px 6px rgba(0,0,0,0.1);"></div>
        </div>`;
    }
};

window.enviarPsicosocial = async () => {
    const titulo = document.getElementById('psicoBuilderTitulo').value.trim();
    if(!titulo) return alert('Por favor, ingresa un título para el estudio.');
    
    const preguntasJson = window.psicoBuilderGetJSON();
    if(preguntasJson.length === 0) return alert('Debes agregar al menos una pregunta al cuestionario.');

    const filtro = document.getElementById('psicoFiltroEnvio').value;
    const esp = document.getElementById('psicoEspecifEnvio').value.trim();
    
    if(filtro !== 'todos' && !esp) return alert('Por favor, especifica el grado, grupo o ID de alumno en la caja de texto.');
    if(!confirm('¿Estás seguro de enviar este nuevo cuestionario? Esto creará una alerta obligatoria en el perfil de cada alumno seleccionado.')) return;
    
    window.showToast('Creando cuestionario y procesando envíos...', 'info');
    
    try {
        let query = supabaseClient.from('alumnos').select('id');
        if(filtro === 'grado') query = query.ilike('grado', `${esp}%`);
        if(filtro === 'grupo') query = query.eq('grupo_id', esp);
        if(filtro === 'alumno') {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(esp);
            if(isUUID) {
                query = query.eq('id', esp);
            } else {
                query = query.ilike('nombre', `%${esp}%`);
            }
        }
        
        const { data: alus, error } = await query;
        if(error) throw error;
        if(!alus || alus.length === 0) return alert('No se encontraron alumnos con ese filtro.');
        
        // 1. Crear el cuestionario
        const { data: cuestData, error: cuestErr } = await supabaseClient.from('cuestionarios_psicosociales').insert([{
            plantel_id: state.plantelId,
            titulo: titulo,
            preguntas_json: preguntasJson,
            creado_por: state.user.id
        }]).select('id').single();

        if(cuestErr) throw cuestErr;
        const cuestId = cuestData.id;

        // 2. Insertar los estudios
        const inserts = alus.map(a => ({
            alumno_id: a.id,
            plantel_id: state.plantelId,
            cuestionario_id: cuestId,
            estado: 'pendiente',
            creado_por: state.user.id
        }));
        
        const { error: insErr } = await supabaseClient.from('estudios_psicosociales').insert(inserts);
        if(insErr) throw insErr;
        
        window.showToast(`Cuestionario enviado a ${alus.length} alumnos correctamente.`, 'success');
        document.getElementById('psicoEspecifEnvio').value = '';
        window.loadPsicosocialStats();
    } catch(e) { 
        console.error(e); 
        window.showToast('Error: ' + (e.message || e.details || JSON.stringify(e)), 'error'); 
    }
};

window.loadPsicosocialStats = async () => {
    const cards = document.getElementById('psicoStatsCards');
    if(!cards) return;

    const filtro = document.getElementById('psicoStatsFiltro')?.value || 'todos';
    const esp = (document.getElementById('psicoStatsValor')?.value || '').trim();

    try {
        let { data, error } = await supabaseClient.from('estudios_psicosociales').select('*, alumnos(id, grado, grupo_id)').eq('plantel_id', state.plantelId);
        if(error) throw error;
        
        if (filtro !== 'todos' && esp) {
            if (filtro === 'grado') {
                data = data.filter(d => String(d.alumnos?.grado).startsWith(esp));
            } else if (filtro === 'grupo') {
                data = data.filter(d => String(d.alumnos?.grupo_id) === esp);
            } else if (filtro === 'alumno') {
                data = data.filter(d => String(d.alumno_id) === esp);
            }
        }
        
        const total = data.length;
        const completados = data.filter(d => d.estado === 'completado').length;
        const pendientes = total - completados;
        const pct = total === 0 ? 0 : Math.round((completados / total) * 100);
        
        cards.innerHTML = `
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:15px; text-align:center;">
                <h2 style="margin:0; color:#166534;">${completados}</h2>
                <span style="color:#15803d; font-size:0.85rem; font-weight:bold;">Completados (${pct}%)</span>
            </div>
            <div style="background:#fffbeb; border:1px solid #fef08a; border-radius:8px; padding:15px; text-align:center;">
                <h2 style="margin:0; color:#854d0e;">${pendientes}</h2>
                <span style="color:#a16207; font-size:0.85rem; font-weight:bold;">Pendientes</span>
            </div>
            <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:15px; text-align:center;">
                <h2 style="margin:0; color:#1e40af;">${total}</h2>
                <span style="color:#1d4ed8; font-size:0.85rem; font-weight:bold;">Total Solicitados</span>
            </div>
        `;

        const container = document.getElementById('psicoChartsDynamicContainer');
        if(container) {
            container.innerHTML = '';
            if(window.psicoChartInstances) {
                window.psicoChartInstances.forEach(c => c.destroy());
            }
            window.psicoChartInstances = [];

            if(window.Chart && completados > 0) {
                const res = data.filter(d => d.estado === 'completado' && d.respuestas).map(d => d.respuestas);
                const keys = new Set();
                res.forEach(r => Object.keys(r).forEach(k => keys.add(k)));
                
                const validKeys = Array.from(keys).filter(k => {
                    for(let r of res) {
                        if(r[k] !== undefined) {
                            if(typeof r[k] === 'string' && r[k].length < 60) return true;
                            if(Array.isArray(r[k])) return true;
                            break; 
                        }
                    }
                    return false;
                });

                if(validKeys.length > 0) {
                    const uiHtml = `
                    <div style="grid-column: 1 / -1; background:#fff; padding:20px; border-radius:12px; border:1px solid var(--border);">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; margin-bottom:20px;">
                            <div style="flex:1; min-width:250px;">
                                <label style="font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:5px;">Selecciona la Pregunta a Visualizar:</label>
                                <select id="chartQuestionSelect" class="form-input" style="margin:0;">
                                    ${validKeys.map((k, i) => `<option value="${i}">${k}</option>`).join('')}
                                </select>
                            </div>
                            <button id="btnDownloadChart" class="btn btn-outline" style="border-color:var(--primary); color:var(--primary);">
                                <i class="fa-solid fa-download"></i> Descargar Gráfico
                            </button>
                        </div>
                        <div style="position:relative; height:350px; width:100%;">
                            <canvas id="mainChartCanvas"></canvas>
                        </div>
                    </div>
                    `;
                    container.innerHTML = uiHtml;
                    
                    const canvas = document.getElementById('mainChartCanvas');
                    const select = document.getElementById('chartQuestionSelect');
                    const btnDl = document.getElementById('btnDownloadChart');
                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

                    const drawChart = (index) => {
                        const k = validKeys[index];
                        if(window.psicoChartInstances[0]) {
                            window.psicoChartInstances[0].destroy();
                        }
                        
                        const stats = res.reduce((acc, curr) => {
                            let val = curr[k];
                            if(val === undefined || val === '') return acc;
                            if(Array.isArray(val)) {
                                val.forEach(v => { acc[v] = (acc[v] || 0) + 1; });
                            } else {
                                acc[val] = (acc[val] || 0) + 1;
                            }
                            return acc;
                        }, {});

                        const chart = new Chart(canvas, {
                            type: Object.keys(stats).length > 4 ? 'bar' : 'pie',
                            data: {
                                labels: Object.keys(stats),
                                datasets: [{ label: 'Respuestas', data: Object.values(stats), backgroundColor: colors }]
                            },
                            options: { 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: {
                                    title: { display: true, text: k, font: { size: 16 } }
                                }
                            }
                        });
                        window.psicoChartInstances[0] = chart;
                    };
                    
                    drawChart(0);
                    
                    select.addEventListener('change', (e) => drawChart(e.target.value));
                    
                    btnDl.addEventListener('click', () => {
                        const link = document.createElement('a');
                        link.download = validKeys[select.value] + '_grafico.png';
                        link.href = canvas.toDataURL('image/png', 1.0);
                        link.click();
                    });
                } else {
                    container.innerHTML = '<div style="grid-column: 1 / -1; padding:20px; text-align:center; color:var(--text-muted); background:#f9f9f9; border-radius:8px;">No hay datos de opción múltiple para graficar aún.</div>';
                }
            } else {
                container.innerHTML = '<div style="grid-column: 1 / -1; padding:20px; text-align:center; color:var(--text-muted); background:#f9f9f9; border-radius:8px;">Aún no hay estudios completados para mostrar gráficas.</div>';
            }
        }
    } catch(e) { console.error(e); }
};

function renderAlumnoPsicosocial() {
    let titulo = window.psicoCuestionarioActual ? window.psicoCuestionarioActual.titulo : "Estudio Biopsicosocial Requerido";
    let preguntas = window.psicoCuestionarioActual ? window.psicoCuestionarioActual.preguntas_json : [];
    
    let htmlInputs = "";
    if(preguntas && preguntas.length > 0) {
        htmlInputs = preguntas.map(p => {
            let inputHtml = "";
            if(p.tipo === 'text') {
                inputHtml = `<input type="text" id="ans_${p.id}" name="${p.titulo}" class="form-input psico-ans-input" required>`;
            } else if(p.tipo === 'textarea') {
                inputHtml = `<textarea id="ans_${p.id}" name="${p.titulo}" class="form-input psico-ans-input" style="height:60px;" required></textarea>`;
            } else if(p.tipo === 'select') {
                let opts = p.opciones.split(',').map(o => `<option value="${o.trim()}">${o.trim()}</option>`).join('');
                inputHtml = `<select id="ans_${p.id}" name="${p.titulo}" class="form-input psico-ans-input" required><option value="">Seleccione...</option>${opts}</select>`;
            } else if(p.tipo === 'checkbox') {
                let opts = p.opciones.split(',').map(o => `
                    <label><input type="checkbox" name="ans_${p.id}" value="${o.trim()}" class="psico-ans-chk"> ${o.trim()}</label>
                `).join('');
                inputHtml = `<div style="display:flex; flex-direction:column; gap:5px; font-size:0.85rem; color:var(--text-muted);" id="ans_${p.id}" data-chk-name="${p.titulo}">${opts}</div>`;
            }
            
            return `
            <div style="margin-bottom:15px;">
                <label style="font-weight:bold; font-size:0.9rem; color:var(--text-main); display:block; margin-bottom:5px;">${p.titulo}</label>
                ${inputHtml}
            </div>
            `;
        }).join('');
    } else {
        htmlInputs = `<div class="alert alert-danger">Error: El cuestionario no tiene preguntas configuradas.</div>`;
    }

    return `
    <div class="mobile-app" style="background:var(--page-bg)">
        <div class="mobile-header" style="text-align: center; padding:30px 20px; background:var(--danger); color:white;">
            <div style="font-size:3rem; margin-bottom:10px;"><i class="fa-solid fa-file-contract"></i></div>
            <h2 style="margin:0;">${titulo}</h2>
            <p style="margin-top:5px; font-size:0.85rem; opacity:0.9;">Departamento de Trabajo Social</p>
        </div>
        <div class="mobile-content" style="padding: 20px;">
            <div class="alert alert-warning" style="margin-bottom:20px; font-size:0.85rem;">
                <strong>Aviso a Padres/Tutores:</strong> Por favor llene este cuestionario de forma veraz. La información es estrictamente confidencial.
            </div>

            <div class="card" style="padding:20px;">
                <form id="formPsicosocialAlumno" onsubmit="window.enviarRespuestasPsicosocial(event)">
                    ${htmlInputs}
                    <button type="submit" class="btn btn-primary" style="width:100%; padding:15px; font-size:1rem; border-radius:12px;">
                        <i class="fa-solid fa-check-circle"></i> Enviar Información Oficial
                    </button>
                </form>
            </div>
        </div>
    </div>
    `;
}

window.loadAlumnoPsicosocialForm = () => {
    // Inicializaciones si es necesario
};

window.enviarRespuestasPsicosocial = async (e) => {
    e.preventDefault();
    if(!window.psicosocialPendienteGlobal) return alert("Error: No se detectó estudio pendiente.");
    
    const respuestas = {};
    const preguntas = window.psicoCuestionarioActual ? window.psicoCuestionarioActual.preguntas_json : [];
    
    preguntas.forEach(p => {
        if(p.tipo === 'checkbox') {
            const checked = document.querySelectorAll(`input[name="ans_${p.id}"]:checked`);
            respuestas[p.titulo] = Array.from(checked).map(c => c.value);
        } else {
            const el = document.getElementById(`ans_${p.id}`);
            if(el) respuestas[p.titulo] = el.value;
        }
    });

    window.showToast('Enviando...', 'info');

    try {
        const { error } = await supabaseClient.from('estudios_psicosociales')
            .update({
                estado: 'completado',
                respuestas: respuestas,
                fecha_respuesta: new Date().toISOString()
            }).eq('id', window.psicosocialPendienteGlobal);

        if(error) throw error;
        
        window.psicosocialPendienteGlobal = null;
        alert("¡Muchas gracias! El estudio biopsicosocial ha sido guardado exitosamente.");
        document.getElementById('app').innerHTML = renderAlumnoCredencial();
        if(window.loadCredencialAlumno) window.loadCredencialAlumno();
        
    } catch(err) {
        console.error(err);
        window.showToast('Hubo un error al guardar.', 'error');
    }
};
