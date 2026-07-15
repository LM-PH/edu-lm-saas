import os

def modify_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. Update renderMaestroBitacora
    old_maestro_header = """    <div class="page-header">
      <h2 class="page-title">Bitácora de Maestros (Hechos)</h2>
      <p class="page-subtitle">Registro de incidencias, recados o reportes acontecidos dentro y fuera del salón durante la jornada. Compartible con Prefectura y Trabajo Social.</p>
    </div>"""
    new_maestro_header = """    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
      <div>
        <h2 class="page-title">Bitácora de Maestros (Hechos)</h2>
        <p class="page-subtitle">Registro de incidencias, recados o reportes acontecidos dentro y fuera del salón durante la jornada. Compartible con Prefectura y Trabajo Social.</p>
      </div>
      <button class="btn btn-outline" style="border-color:var(--primary); color:var(--primary); display:flex; align-items:center; gap:8px;" onclick="window.imprimirBitacoraGeneral()">
          <i class="fa-solid fa-print"></i> Imprimir Mis Hechos
      </button>
    </div>"""
    content = content.replace(old_maestro_header, new_maestro_header)

    # 2. Update renderBibliotecaBitacora
    old_biblio_header = """    <div class="page-header">
      <h2 class="page-title"><i class="fa-solid fa-book-journal-whills"></i> Bitácora de Biblioteca / Aula de Medios</h2>
      <p class="page-subtitle">Registro de incidencias, recados o reportes acontecidos en tu área. Compartible con Directivo y Trabajo Social.</p>
    </div>"""
    new_biblio_header = """    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
      <div>
        <h2 class="page-title"><i class="fa-solid fa-book-journal-whills"></i> Bitácora de Biblioteca / Aula de Medios</h2>
        <p class="page-subtitle">Registro de incidencias, recados o reportes acontecidos en tu área. Compartible con Directivo y Trabajo Social.</p>
      </div>
      <button class="btn btn-outline" style="border-color:var(--primary); color:var(--primary); display:flex; align-items:center; gap:8px;" onclick="window.imprimirBitacoraGeneral()">
          <i class="fa-solid fa-print"></i> Imprimir Mis Hechos
      </button>
    </div>"""
    content = content.replace(old_biblio_header, new_biblio_header)

    # 3. Add window.imprimirBitacoraGeneral before window.cargarBitacora
    imprimir_function = """window.imprimirBitacoraGeneral = async () => {
    const fecha = document.getElementById('fechaBitacora')?.value || new Date().toLocaleDateString('en-CA');
    try {
        const uid = state.user?.id || (await supabaseClient.auth.getUser()).data.user.id;
        const { data, error } = await supabaseClient
            .from('bitacora_maestro')
            .select('*')
            .eq('fecha_referencia', fecha)
            .eq('plantel_id', state.plantelId)
            .eq('perfil_id', uid)
            .order('creado_en', {ascending: true});

        if(error) throw error;
        
        if(!data || data.length === 0) {
            return alert("No hay registros tuyos para esta fecha.");
        }

        const { data: plantelData } = await supabaseClient.from('planteles').select('nombre, logo_url').eq('id', state.plantelId).single();
        const schoolName = plantelData?.nombre || 'Plantel Escolar';
        const schoolLogo = plantelData?.logo_url || '';
        
        const printWindow = window.open('', '_blank');
        const fechaImpresion = new Date().toLocaleDateString();

        const registrosHtml = data.map(b => {
            const hora = new Date(b.creado_en).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            return `
            <div class="item-box">
                <div class="item-header">
                    <strong>Hora: ${hora}</strong>
                </div>
                <p>${b.texto}</p>
                <div class="text-muted" style="margin-top: 10px;">Autenticado por: ${b.firma_autor || 'S/D'}</div>
            </div>`;
        }).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Bitácora - Mis Hechos</title>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 15px; }
                        .logo-img { max-height: 80px; margin-bottom: 10px; object-fit: contain; }
                        .header h2 { font-size: 28px; margin: 0 0 5px 0; color: #000; text-transform: uppercase; }
                        .header h1 { margin: 0; color: #1e40af; font-size: 20px; text-transform: uppercase; }
                        .header p { margin: 5px 0; font-size: 14px; color: #555; font-weight: bold; }
                        .info-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: flex; justify-content: space-between; font-size: 14px; }
                        .section-title { font-size: 18px; color: #1e40af; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; margin-top: 20px; margin-bottom: 15px; text-transform: uppercase; }
                        .item-box { border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 15px; page-break-inside: avoid; }
                        .item-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
                        .item-box p { margin: 4px 0; font-size: 14px; }
                        .text-muted { color: #64748b; font-style: italic; font-size: 12px; }
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
                        ${schoolLogo ? `<img src="${schoolLogo}" class="logo-img" alt="Logo">` : ''}
                        <h2>${schoolName}</h2>
                        <h1>REPORTE DE BITÁCORA - MIS HECHOS</h1>
                        <p>HECHOS DEL DÍA</p>
                    </div>
                    
                    <div class="info-box">
                        <div>
                            <strong>Fecha de Referencia:</strong> ${fecha}<br>
                            <strong>Elaborado por:</strong> ${state.userName || state.user?.email || 'Personal'}
                        </div>
                        <div style="text-align:right;">
                            <strong>Fecha de Impresión:</strong> ${fechaImpresion}
                        </div>
                    </div>

                    <div class="section-title">Registro Cronológico de Eventos</div>
                    ${registrosHtml}

                    <div class="footer-signatures">
                        <div class="sig-line">
                            <strong>${state.userName || state.user?.email || 'Firma'}</strong><br>
                            Sello Oficial
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
    } catch(e) {
        console.error(e);
        alert("Error al imprimir la bitácora: " + e.message);
    }
};

"""
    old_cargar = "window.cargarBitacora = async (fecha) => {"
    content = content.replace(old_cargar, imprimir_function + old_cargar)

    with open(filepath, "w") as f:
        f.write(content)

modify_file("edu_lm_v112_universal.js")
print("Done")
