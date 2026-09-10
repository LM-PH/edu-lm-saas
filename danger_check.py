import re

with open('edu_lm_v112_universal.js', 'r') as f:
    content = f.read()

for match in re.finditer(r'\.from\(\'(.*?)\'\)\s*\.(update|delete)\((.*?)\)(.*?)(;)', content, re.DOTALL):
    table = match.group(1)
    action = match.group(2)
    payload = match.group(3)
    chain = match.group(4)
    
    if table in ['perfiles', 'perfiles_permitidos', 'conexiones_log', 'comunicados_vistos', 'planteles']: 
        continue
        
    has_plantel = 'plantel_id' in chain or 'pId' in chain
    has_id = ".eq('id'" in chain or '.eq("id"' in chain or '.in(\'id\'' in chain or '.match(' in chain
    has_specific = ".eq('alumno_id'" in chain or ".eq('actividad_id'" in chain or ".eq('encuadre_id'" in chain or ".eq('grupo_id'" in chain
    
    if not has_plantel and not has_id and not has_specific:
        # cleanup newlines in chain
        clean_chain = chain.replace('\n', ' ')
        print(f"POSSIBLE DANGER {action.upper()}: {table} -> {clean_chain.strip()[:100]}")
