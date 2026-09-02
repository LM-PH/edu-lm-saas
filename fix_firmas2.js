const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://eexgjaydpuioncenlsmv.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleGdqYXlkcHVpb25jZW5sc212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NTM0MDAsImV4cCI6MjEwMDQyOTQwMH0.vrJGn_Bg04OBBntL-w21-I27XuvO61HcUNrphMYYSlY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fix() {
    console.log("Iniciando...");
    // 1. Obtener todos los comunicados que requieren firma
    const { data: comsReqFirma, error: err1 } = await supabase
        .from('comunicados')
        .select('id, tipo, titulo')
        .or('tipo.eq.aviso_firma_boleta,titulo.ilike.%encuadre%');
        
    if (err1) { console.error("Error fetching comunicados:", err1); return; }
    
    if (!comsReqFirma || comsReqFirma.length === 0) {
        console.log("No se encontraron avisos que requieran firma.");
        return;
    }
    const idsReqFirma = comsReqFirma.map(c => c.id);
    console.log(`Se encontraron ${idsReqFirma.length} avisos que requieren firma.`);

    // 2. Intentar borrar de comunicados_vistos
    // Supabase permite .in() para borrar
    const { data: deleted, error: err2 } = await supabase
        .from('comunicados_vistos')
        .delete()
        .in('comunicado_id', idsReqFirma)
        .select('*'); // Try to return the deleted rows if RLS allows it
        
    if (err2) { 
        console.error("Error al borrar vistos:", err2); 
    } else {
        console.log("Borrado completado. Registros afectados:", deleted ? deleted.length : 'desconocido (RLS no retornó data)');
    }
}
fix();
