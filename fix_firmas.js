const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://eexgjaydpuioncenlsmv.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleGdqYXlkcHVpb25jZW5sc212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NTM0MDAsImV4cCI6MjEwMDQyOTQwMH0.vrJGn_Bg04OBBntL-w21-I27XuvO61HcUNrphMYYSlY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
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

    // 2. Obtener los registros de comunicados_vistos para estos avisos
    const { data: vistos, error: err2 } = await supabase
        .from('comunicados_vistos')
        .select('id, perfil_id, comunicado_id')
        .in('comunicado_id', idsReqFirma);
        
    if (err2) { console.error("Error fetching vistos:", err2); return; }
        
    console.log(`Se encontraron ${vistos.length} registros falsos o verdaderos de "Visto" en el timeline.`);
    
    // We only want to delete them if we can. Let's try to delete just one to test RLS.
    if (vistos.length > 0) {
        // Wait, instead of deleting, let's just print the length to confirm we can read.
        console.log("We can read them! Total:", vistos.length);
    }
}
check();
