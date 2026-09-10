const fs = require('fs');
const file = 'edu_lm_v112_universal.js';
const safeKeys = ['plantel_id', 'eq(\'id\'', 'eq("id"', 'in(\'id\'', 'in("id"', 'eq(\'grupo_id\'', 'in(\'grupo_id\'', 'eq(\'alumno_id\'', 'in(\'alumno_id\'', 'eq(\'perfil_id\'', 'in(\'perfil_id\'', 'eq(\'contacto_email\'', 'rpc(', 'auth.getUser()'];
let total = 0;

const content = fs.readFileSync(file, 'utf8');
const regex = /supabase[A-Za-z0-9_]*\.from\(['"]([^'"]+)['"]\)([\s\S]*?)(?=;|\n\s*supabase|\n\s*\/\/|\n\s*const|\n\s*let)/g;
let match;
while ((match = regex.exec(content)) !== null) {
    const table = match[1];
    let statement = match[0];
    
    if (['perfiles', 'planteles', 'conexiones_log', 'suscripciones'].includes(table)) continue;
    
    let isSafe = false;
    for (const key of safeKeys) { if (statement.includes(key)) { isSafe = true; break; } }
    if (!isSafe && (statement.includes('insert(') || statement.includes('update(') || statement.includes('upsert('))) {
         if (statement.includes('plantel_id')) isSafe = true;
    }
    if (!isSafe) {
        const lookahead = content.substring(match.index, match.index + 500);
        if (lookahead.includes('plantel_id')) isSafe = true;
    }
    if (!isSafe) {
        const lineNum = content.substring(0, match.index).split('\n').length;
        console.log(`[!] Vulnerability in ${file}:${lineNum} (Table: ${table})`);
        console.log(`    Code: ${statement.split('\n').join(' ').substring(0, 150)}...`);
        total++;
    }
}
console.log(`Total: ${total}`);
