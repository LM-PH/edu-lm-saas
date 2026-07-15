import os

def modify_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. Update renderBibliotecaPrestamos (UI fields)
    old_bib_btn = """            <button class="btn btn-primary" onclick="window.guardarPrestamoBiblioteca()" style="width:100%;">
               <i class="fa-solid fa-plus"></i> Registrar Préstamo
            </button>"""
    new_bib_btn = """            <div class="form-group">
               <label class="form-label">Profesor que solicita (Opcional)</label>
               <input type="text" id="bibProfSolicitante" class="form-input" placeholder="Ej. Mtro. Juan Pérez">
            </div>
            
            <div class="form-group">
               <label class="form-label">Módulo/Materia (Opcional)</label>
               <input type="text" id="bibModuloSolicitante" class="form-input" placeholder="Ej. Matemáticas I">
            </div>
            
            <button class="btn btn-primary" onclick="window.guardarPrestamoBiblioteca()" style="width:100%;">
               <i class="fa-solid fa-plus"></i> Registrar Préstamo
            </button>"""
    content = content.replace(old_bib_btn, new_bib_btn)

    # 2. Update guardarPrestamoBiblioteca (Save function)
    old_bib_guardar = """    const condicion_entrega = document.getElementById('bibCondEntrega').value.trim();
    
    if(!alumno_id) return window.showToast("Selecciona un alumno.", "error");
    if(!recurso) return window.showToast("Escribe el nombre del libro o equipo.", "error");
    
    try {
        const { error } = await supabaseClient.from('biblioteca_prestamos').insert([{
            alumno_id, tipo, recurso, condicion_entrega, plantel_id: state.plantelId
        }]);
        if(error) throw error;
        
        window.showToast("Préstamo registrado exitosamente.", "success");
        document.getElementById('bibRecurso').value = '';
        document.getElementById('bibCondEntrega').value = '';"""
        
    new_bib_guardar = """    const condicion_entrega = document.getElementById('bibCondEntrega').value.trim();
    const profesor_solicitante = document.getElementById('bibProfSolicitante')?.value.trim() || null;
    const modulo_solicitante = document.getElementById('bibModuloSolicitante')?.value.trim() || null;
    
    if(!alumno_id) return window.showToast("Selecciona un alumno.", "error");
    if(!recurso) return window.showToast("Escribe el nombre del libro o equipo.", "error");
    
    try {
        const { error } = await supabaseClient.from('biblioteca_prestamos').insert([{
            alumno_id, tipo, recurso, condicion_entrega, profesor_solicitante, modulo_solicitante, plantel_id: state.plantelId
        }]);
        if(error) throw error;
        
        window.showToast("Préstamo registrado exitosamente.", "success");
        document.getElementById('bibRecurso').value = '';
        document.getElementById('bibCondEntrega').value = '';
        if(document.getElementById('bibProfSolicitante')) document.getElementById('bibProfSolicitante').value = '';
        if(document.getElementById('bibModuloSolicitante')) document.getElementById('bibModuloSolicitante').value = '';"""
    content = content.replace(old_bib_guardar, new_bib_guardar)

    # 3. Update loadBibliotecaPrestamos (List view)
    old_bib_list = """                     ${p.condicion_entrega ? `<div style="margin-top:4px; font-size:0.75rem; background:#fffbeb; color:#d97706; padding:4px 8px; border-radius:4px; display:inline-block;"><i class="fa-solid fa-triangle-exclamation"></i> Entregado con: ${p.condicion_entrega}</div>` : ''}
                  </div>
                  <div>
                     <button class="btn btn-primary btn-sm" onclick="window.bibDevolverPrestamo('${p.id}')">"""
    
    new_bib_list = """                     ${p.condicion_entrega ? `<div style="margin-top:4px; font-size:0.75rem; background:#fffbeb; color:#d97706; padding:4px 8px; border-radius:4px; display:inline-block;"><i class="fa-solid fa-triangle-exclamation"></i> Entregado con: ${p.condicion_entrega}</div>` : ''}
                     ${p.profesor_solicitante ? `<div style="margin-top:4px; font-size:0.75rem; color:var(--text-muted);"><i class="fa-solid fa-chalkboard-user"></i> Solicitado por: ${p.profesor_solicitante} ${p.modulo_solicitante ? `(${p.modulo_solicitante})` : ''}</div>` : ''}
                  </div>
                  <div>
                     <button class="btn btn-primary btn-sm" onclick="window.bibDevolverPrestamo('${p.id}')">"""
    content = content.replace(old_bib_list, new_bib_list)

    # 4. Update imprimirHistorialBiblioteca (Print view)
    old_bib_print = """                <p><strong>Condición Inicial:</strong> ${p.condicion_entrega || 'Buena'}</p>
                <div class="text-muted" style="margin-top: 10px;">
                    <strong>Estado:</strong> ${estado}"""
                    
    new_bib_print = """                <p><strong>Condición Inicial:</strong> ${p.condicion_entrega || 'Buena'}</p>
                ${p.profesor_solicitante ? `<p><strong>Solicitado por Profesor:</strong> ${p.profesor_solicitante} ${p.modulo_solicitante ? `(${p.modulo_solicitante})` : ''}</p>` : ''}
                <div class="text-muted" style="margin-top: 10px;">
                    <strong>Estado:</strong> ${estado}"""
    content = content.replace(old_bib_print, new_bib_print)
    
    # Check if loadHistorialBiblioteca also renders it? I didn't see loadHistorialBiblioteca having it.
    old_bib_hist_list = """                     ${p.condicion_entrega ? `<div style="margin-top:4px; font-size:0.75rem; color:var(--text-muted);">Condición inicial: ${p.condicion_entrega}</div>` : ''}
                  </div>
                  <div style="text-align:right;">
                     <div style="margin-bottom:4px;">${estado}</div>"""
    
    new_bib_hist_list = """                     ${p.condicion_entrega ? `<div style="margin-top:4px; font-size:0.75rem; color:var(--text-muted);">Condición inicial: ${p.condicion_entrega}</div>` : ''}
                     ${p.profesor_solicitante ? `<div style="margin-top:4px; font-size:0.75rem; color:var(--text-muted);"><i class="fa-solid fa-chalkboard-user"></i> Solicitado por: ${p.profesor_solicitante} ${p.modulo_solicitante ? `(${p.modulo_solicitante})` : ''}</div>` : ''}
                  </div>
                  <div style="text-align:right;">
                     <div style="margin-bottom:4px;">${estado}</div>"""
    content = content.replace(old_bib_hist_list, new_bib_hist_list)

    with open(filepath, "w") as f:
        f.write(content)

modify_file("edu_lm_v112_universal.js")
print("Done")
