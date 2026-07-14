import os

def fix_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()
    
    old_line = "${schoolLogo ? \\`<img src=\"\\${schoolLogo}\" class=\"logo-img\" alt=\"Logo\">\\` : \'\'}"
    new_line = "${schoolLogo ? `<img src=\"${schoolLogo}\" class=\"logo-img\" alt=\"Logo\">` : \'\'}"
    
    content = content.replace(old_line, new_line)
    
    with open(filepath, "w") as f:
        f.write(content)

fix_file("app_v105.js")
fix_file("edu_lm_v112_universal.js")
print("Done")
