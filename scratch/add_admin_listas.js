function renderAdminListas() {
  setTimeout(() => { if(window.loadAdminListasGrupos) window.loadAdminListasGrupos(); }, 100);
  return `
    <div class="page-header">
      <h2 class="page-title">Listas Oficiales (Impresión)</h2>
      <p class="page-subtitle">Genera y descarga listas oficiales con membrete para cada grupo.</p>
    </div>
    
    <div class="card">
        <div style="display:flex; gap:16px; align-items:flex-end; margin-bottom: 24px; flex-wrap:wrap;">
            <div>
                <label style="font-weight:600; font-size:0.9rem; margin-bottom:4px; display:block;">Seleccionar Grupo:</label>
                <select class="form-select" id="adminListaGrupoSelect" onchange="window.cargarAdminListaPreview()">
                    <option value="">Cargando grupos...</option>
                </select>
            </div>
            <div>
                <button class="btn btn-outline" style="border-color:#6366f1; color:#6366f1" onclick="window.descargarAdminListaPDF(true)" title="Descargar plantilla de asistencia en blanco (30 columnas)">
                    <i class="fa-solid fa-calendar-check"></i> Formato Asistencia
                </button>
                <button class="btn btn-primary" onclick="window.descargarAdminListaPDF(false)">
                    <i class="fa-solid fa-file-pdf"></i> Lista Simple
                </button>
            </div>
        </div>
        
        <div id="adminListaPreviewCont" style="overflow-x:auto;">
            <table class="risk-table" style="width:100%">
               <thead>
                 <tr>
                    <th style="padding:12px; text-align:center; width:40px;">No.</th>
                    <th style="padding:12px; text-align:left;">Nombre del Alumno</th>
                    <th style="padding:12px; text-align:center;">Matrícula</th>
                 </tr>
               </thead>
               <tbody id="adminListaPreviewTbody">
                  <tr><td colspan="3" style="text-align:center; padding: 20px; color:var(--text-muted)">Seleccione un grupo para visualizar la lista.</td></tr>
               </tbody>
            </table>
        </div>
    </div>
  `;
}
window.renderAdminListas = renderAdminListas;

window.loadAdminListasGrupos = async () => {
    const sel = document.getElementById('adminListaGrupoSelect');
    if(!sel) return;
    try {
        const { data: grupos } = await supabaseClient.from('grupos')
           .select('id, nombre, grado')
           .eq('plantel_id', state.plantelId)
           .order('grado', {ascending: true})
           .order('nombre', {ascending: true});
           
        if(grupos && grupos.length > 0) {
            sel.innerHTML = '<option value="">-- Selecciona un Grupo --</option>' + 
               grupos.map(g => `<option value="${g.id}">${g.nombre}</option>`).join('');
        } else {
            sel.innerHTML = '<option value="">No hay grupos registrados</option>';
        }
    } catch (e) {
        console.error(e);
    }
};

window.cargarAdminListaPreview = async () => {
    const sel = document.getElementById('adminListaGrupoSelect');
    const tbody = document.getElementById('adminListaPreviewTbody');
    if(!sel || !tbody) return;
    
    const grupoId = sel.value;
    if(!grupoId) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px; color:var(--text-muted)">Seleccione un grupo para visualizar la lista.</td></tr>';
        return;
    }
    
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando alumnos...</td></tr>';
    
    try {
        const { data: alumnos, error } = await supabaseClient.from('alumnos')
            .select('id, nombre, matricula')
            .eq('plantel_id', state.plantelId)
            .eq('grupo_id', grupoId)
            .order('nombre');
            
        if(error) throw error;
        
        if(!alumnos || alumnos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px; color:var(--text-muted)">El grupo no tiene alumnos registrados.</td></tr>';
            return;
        }
        
        tbody.innerHTML = alumnos.map((a, i) => `
            <tr>
                <td style="text-align:center;">${i+1}</td>
                <td>${a.nombre}</td>
                <td style="text-align:center;">${a.matricula || '-'}</td>
            </tr>
        `).join('');
        
    } catch (err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px; color:var(--danger)">Error al cargar alumnos.</td></tr>';
    }
};

window.descargarAdminListaPDF = async (esVacia = false) => {
    const sel = document.getElementById('adminListaGrupoSelect');
    const tbody = document.getElementById('adminListaPreviewTbody');
    
    if(!sel || !sel.value || !tbody || tbody.innerText.includes("Seleccione") || tbody.innerText.includes("Cargando") || tbody.innerText.includes("No tiene")) {
        return alert("Seleccione un grupo con alumnos primero.");
    }

    const grupoName = sel.options[sel.selectedIndex].text;
    const fecha = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });

    let schoolName = CONFIG.schoolName || 'Escuela';
    let schoolLogo = null;
    let directorName = 'DIRECCIÓN ESCOLAR';
    try {
        if(state.plantelId) {
            const { data: pt } = await supabaseClient.from('planteles').select('nombre, logo_url, cct').eq('id', state.plantelId).maybeSingle();
            if(pt) {
                if(pt.nombre) schoolName = pt.nombre + (pt.cct ? '<br><span style="font-size:0.75em; color:#555; font-weight:normal;">C.C.T. ' + pt.cct + '</span>' : '');
                if(pt.logo_url) schoolLogo = window.getCleanLogoUrl(pt.logo_url);
            }
            const { data: dirData } = await supabaseClient.from('perfiles').select('nombre').eq('plantel_id', state.plantelId).eq('rol', 'directivo').maybeSingle();
            if(dirData && dirData.nombre) directorName = dirData.nombre;
        }
    } catch(e) {}

    const rowsList = Array.from(tbody.querySelectorAll("tr"));
    const n = Math.max(rowsList.length, 1);
    
    // Dynamic styles
    const totalCols = esVacia ? 32 : 3;
    const esHorizontal = esVacia;
    
    let fontSizePx = Math.max(5.0, Math.min(10.0, (240 / (n + 8)) - (totalCols > 8 ? 0.8 : 0)));
    let fontSize = fontSizePx.toFixed(1) + 'px';
    let padV = Math.max(0, Math.min(3.5, (120 / n) - 1.8)).toFixed(1) + 'px';
    let padH = Math.max(1, Math.min(4, (160 / n))).toFixed(1) + 'px';
    let paddingCell = `${padV} ${padH}`;
    let logoHeight = Math.max(18, Math.min(35, 450 / n)).toFixed(0) + 'px';
    
    let tableContentHtml = '';
    
    if (esVacia) {
        const numCols = 30;
        let headers = `<th style="width:20px;">No.</th><th style="text-align:left; min-width: 130px;">Nombre del Alumno</th>`;
        for(let i=1; i<=numCols; i++) headers += `<th style="width:12px; font-weight:normal; font-size:0.8em; color:#666;">${i}</th>`;
        tableContentHtml += `<thead><tr>${headers}</tr></thead><tbody>`;
        
        rowsList.forEach((tr, index) => {
            const nombre = tr.cells[1].innerText;
            let row = `<tr><td style="text-align:center;">${index + 1}</td><td><div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px;">${nombre}</div></td>`;
            for(let i=0; i<numCols; i++) row += `<td></td>`;
            row += `</tr>`;
            tableContentHtml += row;
        });
        tableContentHtml += '</tbody>';
    } else {
        tableContentHtml += `
          <thead>
             <tr>
                <th style="width:40px; text-align:center;">No.</th>
                <th style="text-align:left;">Nombre del Alumno</th>
                <th style="text-align:center;">Matrícula / Folio</th>
             </tr>
          </thead>
          <tbody>
        `;
        rowsList.forEach((tr, index) => {
            const nombre = tr.cells[1].innerText;
            const matricula = tr.cells[2].innerText;
            tableContentHtml += `
            <tr>
                <td style="text-align:center;">${index + 1}</td>
                <td>${nombre}</td>
                <td style="text-align:center;">${matricula}</td>
            </tr>`;
        });
        tableContentHtml += '</tbody>';
    }

    const htmlToPrint = `
    <div style="font-family: Arial, sans-serif; background:white; color:black; width:100%; height:100%; box-sizing:border-box; padding:20px;">
        <table style="width:100%; border-collapse:collapse; margin-bottom:5px;">
            <tr>
                <td style="width:15%; text-align:center; vertical-align:middle;">
                    ${schoolLogo ? `<img src="${schoolLogo}" style="max-height:${logoHeight}; max-width:60px; object-fit:contain;" crossorigin="anonymous">` : ''}
                </td>
                <td style="text-align:center; vertical-align:middle;">
                    <h2 style="margin:0; font-size:1.1em; color:#111;">${schoolName}</h2>
                    <p style="margin:2px 0 0 0; font-size:0.8em; color:#333;">LISTA OFICIAL DE GRUPO</p>
                    <p style="margin:2px 0 0 0; font-size:0.8em; font-weight:bold;">${grupoName}</p>
                </td>
                <td style="width:15%; text-align:center; vertical-align:middle; font-size:0.7em; color:#555;">
                    <div style="border:1px solid #ddd; padding:4px; border-radius:4px; background:#fafafa;">
                       <strong>Fecha:</strong><br>${fecha}
                    </div>
                </td>
            </tr>
        </table>
        
        <div style="border-top:1px solid #111; border-bottom:1px solid #111; height:3px; margin-bottom:10px;"></div>
        
        <table style="width:100%; border-collapse:collapse; font-size:${fontSize};" border="1" bordercolor="#ccc" cellpadding="2">
            ${tableContentHtml}
        </table>
        
        <div style="margin-top:20px; text-align:center;">
           <p style="margin:0; font-size:0.8em;">________________________________________________</p>
           <p style="margin:3px 0 0 0; font-size:0.8em; font-weight:bold;">${directorName}</p>
           <p style="margin:2px 0 0 0; font-size:0.7em; color:#555;">Sello y Firma (Dirección)</p>
        </div>
    </div>`;

    const opt = {
        margin:       0,
        filename:     `Lista_${grupoName}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: esHorizontal ? 'landscape' : 'portrait' }
    };

    try {
        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;
        
        await html2pdf().set(opt).from(htmlToPrint).save();
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    } catch(err) {
        console.error(err);
        alert("Error al generar PDF: " + err.message);
    }
};
