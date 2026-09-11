const { createClient } = require('@supabase/supabase-js');
const supabase = createClient("https://eexgjaydpuioncenlsmv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleGdqYXlkcHVpb25jZW5sc212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NTM0MDAsImV4cCI6MjEwMDQyOTQwMH0.vrJGn_Bg04OBBntL-w21-I27XuvO61HcUNrphMYYSlY");

async function checkBrenda() {
    let { data, error } = await supabase.from('perfiles_permitidos').select('*').ilike('email', '%brenda%');
    console.log("Perfiles Permitidos:", data);
    
    let { data: perfiles } = await supabase.from('perfiles').select('*').ilike('nombre', '%brenda%');
    console.log("Perfiles Reales:", perfiles);
    
    let { data: alumnos } = await supabase.from('alumnos').select('*').ilike('contacto_email', '%brenda%');
    console.log("Alumnos:", alumnos.length);
}
checkBrenda();
