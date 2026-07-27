import json
import re
import os

colors_file = 'src/shared/theme/colors.ts'
tailwind_file = 'tailwind.config.js'
global_css_file = 'src/global.css'

with open(colors_file, 'r') as f:
    colors_content = f.read()

# Extract colors object from TS file
colors_str = colors_content.split('export const colors = {')[1].split('} as const;')[0]

colors_map = {}
for line in colors_str.split('\n'):
    line = line.strip()
    if ':' in line:
        parts = line.split(':')
        key = parts[0].strip().strip("'").strip('"')
        val = parts[1].split(',')[0].strip().strip("'").strip('"')
        if key and val:
            colors_map[key] = val

# Hand-crafted high-quality Dark Mode mapping based on Material 3 principles
dark_colors_map = dict(colors_map)

# Surface & Background (Deep dark gray/black)
dark_colors_map['background'] = '#121212'
dark_colors_map['on-background'] = '#e3e3e3'
dark_colors_map['surface'] = '#121212'
dark_colors_map['on-surface'] = '#e3e3e3'
dark_colors_map['surface-variant'] = '#44474e'
dark_colors_map['on-surface-variant'] = '#c4c7c5'

# Surface Containers (Elevated levels of dark gray)
dark_colors_map['surface-container-lowest'] = '#0f0f0f'
dark_colors_map['surface-container-low'] = '#1d1d1d'
dark_colors_map['surface-container'] = '#212121'
dark_colors_map['surface-container-high'] = '#2b2b2b'
dark_colors_map['surface-container-highest'] = '#363636'

# Primary (Use light's inverse-primary for dark primary)
dark_colors_map['primary'] = colors_map['inverse-primary'] # '#a7c8ff'
dark_colors_map['on-primary'] = colors_map['primary'] # '#001e40'
dark_colors_map['primary-container'] = '#003366'
dark_colors_map['on-primary-container'] = '#d5e3ff'
dark_colors_map['inverse-primary'] = colors_map['primary']

# Secondary
dark_colors_map['secondary'] = '#90efef' # Lighter cyan
dark_colors_map['on-secondary'] = '#003737'
dark_colors_map['secondary-container'] = '#004f4f'
dark_colors_map['on-secondary-container'] = '#abfafa'

# Tertiary
dark_colors_map['tertiary'] = '#88d982'
dark_colors_map['on-tertiary'] = '#00390f'
dark_colors_map['tertiary-container'] = '#00531a'
dark_colors_map['on-tertiary-container'] = '#a3f69c'

# Error
dark_colors_map['error'] = '#ffb4ab'
dark_colors_map['on-error'] = '#690005'
dark_colors_map['error-container'] = '#93000a'
dark_colors_map['on-error-container'] = '#ffdad6'

# Outlines
dark_colors_map['outline'] = '#8e918f'
dark_colors_map['outline-variant'] = '#44474e'

# Inverse Surface
dark_colors_map['inverse-surface'] = '#e3e3e3'
dark_colors_map['inverse-on-surface'] = '#121212'

css_vars_light = []
css_vars_dark = []

for k, v in colors_map.items():
    if k not in ['white', 'black', 'transparent']:
        css_vars_light.append(f"  --color-{k}: {v};")

for k, v in dark_colors_map.items():
    if k not in ['white', 'black', 'transparent']:
        css_vars_dark.append(f"  --color-{k}: {v};")

global_css = f"""@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {{
  :root {{
{chr(10).join(css_vars_light)}
  }}
  .dark {{
{chr(10).join(css_vars_dark)}
  }}
}}
"""

with open(global_css_file, 'w') as f:
    f.write(global_css)

print(f"Generated {global_css_file}")

with open(tailwind_file, 'r') as f:
    tw_content = f.read()

# Update tailwind.config.js
colors_block = "{\n"
for k in colors_map.keys():
    if k in ['white', 'black', 'transparent']:
        colors_block += f"        '{k}': '{colors_map[k]}',\n"
    else:
        colors_block += f"        '{k}': 'var(--color-{k})',\n"
colors_block += "      }"

tw_content = re.sub(r'colors:\s*{[^}]+\s*},?', f'colors: {colors_block},\n', tw_content, flags=re.DOTALL)

if "darkMode: 'class'" not in tw_content:
    tw_content = tw_content.replace('theme: {', "darkMode: 'class',\n  theme: {")

with open(tailwind_file, 'w') as f:
    f.write(tw_content)

print(f"Updated {tailwind_file}")
