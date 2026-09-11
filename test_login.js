const { createClient } = require('@supabase/supabase-js');
const supabase = createClient("https://eexgjaydpuioncenlsmv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleGdqYXlkcHVpb25jZW5sc212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NTM0MDAsImV4cCI6MjEwMDQyOTQwMH0.vrJGn_Bg04OBBntL-w21-I27XuvO61HcUNrphMYYSlY");

async function test() {
    let { data, error } = await supabase.auth.signInWithPassword({ email: 'zlagustin10@gmail.com', password: 'wrongpassword' });
    console.log("Master login attempt with wrong password:");
    console.log("Error:", error?.message);

    let res = await supabase.auth.signInWithPassword({ email: 'brenda', password: 'wrongpassword' });
    console.log("Brenda login attempt with wrong password:");
    console.log("Error:", res.error?.message);
}
test();
