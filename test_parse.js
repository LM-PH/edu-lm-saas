const p = { logo_url: "###CONN###{\"lastUser\":\"Maestro Juan\",\"lastEmail\":\"juan@escuela.com\",\"lastRole\":\"MAESTRO\",\"lastTime\":\"2026-07-30T22:33:00.000Z\"}" };

let meta = null;
try {
    if (p.logo_url) {
        const raw = p.logo_url.includes('###CONN###')
            ? p.logo_url.split('###CONN###')[1]
            : p.logo_url;
        const parsed = JSON.parse(raw);
        if (parsed && parsed.lastUser) meta = parsed;
    }
} catch(e) {
    console.error("Parse error:", e);
}
console.log("Result:", meta);

// Test with base logo
const p2 = { logo_url: "https://example.com/logo.png###CONN###{\"lastUser\":\"Luis\"}" };
let meta2 = null;
try {
    if (p2.logo_url) {
        const raw = p2.logo_url.includes('###CONN###')
            ? p2.logo_url.split('###CONN###')[1]
            : p2.logo_url;
        const parsed = JSON.parse(raw);
        if (parsed && parsed.lastUser) meta2 = parsed;
    }
} catch(e) {}
console.log("Result 2:", meta2);

