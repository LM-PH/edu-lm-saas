const { createClient } = require('@supabase/supabase-js');
const supabase = createClient("https://eexgjaydpuioncenlsmv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleGdqYXlkcHVpb25jZW5sc212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NTM0MDAsImV4cCI6MjEwMDQyOTQwMH0.vrJGn_Bg04OBBntL-w21-I27XuvO61HcUNrphMYYSlY");

async function test() {
    let res = await supabase.auth.signInWithPassword({ email: 'fake@example.com', password: 'wrongpassword' });
    console.log("Keys in authData:", res.data ? Object.keys(res.data) : "No data");
    console.log("Keys in authData.user:", res.data?.user ? Object.keys(res.data.user) : "No user");
}
test();
