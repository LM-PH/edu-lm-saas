const fs = require('fs');

const files = ['edu_lm_v112_universal.js', 'app_v105.js'];
const safeKeys = ['plantel_id', 'eq(\'id\'', 'eq("id"', 'in(\'id\'', 'in("id"', 'eq(\'grupo_id\'', 'in(\'grupo_id\'', 'eq(\'alumno_id\'', 'in(\'alumno_id\'', 'eq(\'perfil_id\'', 'in(\'perfil_id\'', 'eq(\'contacto_email\'', 'rpc(', 'auth.getUser()'];

let totalVulnerabilities = 0;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Match supabaseClient.from(...) until a semicolon or the next supabaseClient.from
    const regex = /supabase[A-Za-z0-9_]*\.from\(['"]([^'"]+)['"]\)([\s\S]*?)(?=;|\n\s*supabase|\n\s*\/\/|\n\s*const|\n\s*let)/g;
    
    let match;
    while ((match = regex.exec(content)) !== null) {
        const table = match[1];
        let statement = match[0];
        
        // Skip tables that are inherently global or single-tenant references
        if (['perfiles', 'planteles', 'conexiones_log', 'suscripciones'].includes(table)) continue;
        
        // For 'alumnos', check if it's safe
        let isSafe = false;
        for (const key of safeKeys) {
            if (statement.includes(key)) {
                isSafe = true;
                break;
            }
        }
        
        // If updating or inserting, check if the object has plantel_id
        if (!isSafe && (statement.includes('insert(') || statement.includes('update(') || statement.includes('upsert('))) {
             if (statement.includes('plantel_id')) isSafe = true;
        }

        // Sometimes the query is built over multiple lines, e.g., 
        // let q = supabaseClient.from(...)
        // if(X) q = q.eq('plantel_id', ...)
        // We need to look ahead in the next 10 lines to see if plantel_id is appended
        if (!isSafe) {
            const index = match.index;
            const lookahead = content.substring(index, index + 500);
            if (lookahead.includes('plantel_id')) {
                isSafe = true;
            }
        }

        if (!isSafe) {
            // Let's get the line number
            const lines = content.substring(0, match.index).split('\n');
            const lineNum = lines.length;
            console.log(`[!] Vulnerability found in ${file} at line ${lineNum} (Table: ${table})`);
            console.log(`    Code: ${statement.split('\n').join(' ').substring(0, 150)}...`);
            totalVulnerabilities++;
        }
    }
});

console.log(`Total potential vulnerabilities found: ${totalVulnerabilities}`);
