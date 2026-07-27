import json
import re

# Read current tailwind config
with open('tailwind.config.js', 'r') as f:
    content = f.read()

# Extract colors object
colors_match = re.search(r'colors:\s*({[^}]+})', content, re.DOTALL)
if not colors_match:
    print("Could not find colors in tailwind.config.js")
    exit(1)

colors_str = colors_match.group(1)

# Clean up JS object to make it valid JSON (roughly)
import ast
colors_str = colors_str.replace("'", '"')
# We can use a simpler approach: parse it manually
lines = colors_str.split('\n')
colors_map = {}
for line in lines:
    if ':' in line:
        parts = line.split(':')
        key = parts[0].strip().strip('"').strip("'")
        val = parts[1].split(',')[0].strip().strip('"').strip("'")
        colors_map[key] = val

# Generate global.css
css_vars = []
for key, val in colors_map.items():
    css_vars.append(f"  --color-{key}: {val};")

# Let's create a basic dark mode by inverting/adjusting colors
# Real dark mode usually requires careful design, but for now we'll do a simple swap for demonstration
# surface is #fff8f1, so dark surface could be #1e1b17 (on-surface)
dark_colors_map = dict(colors_map)
dark_colors_map['surface'] = colors_map.get('on-surface', '#121212')
dark_colors_map['on-surface'] = colors_map.get('surface', '#ffffff')
dark_colors_map['background'] = colors_map.get('on-background', '#121212')
dark_colors_map['on-background'] = colors_map.get('background', '#ffffff')

# Primary colors
dark_colors_map['primary'] = colors_map.get('inverse-primary', '#a7c8ff')
dark_colors_map['on-primary'] = '#001e40'
dark_colors_map['primary-container'] = '#004786'
dark_colors_map['on-primary-container'] = '#d5e3ff'

dark_colors_map['surface-container-lowest'] = '#000000'
dark_colors_map['surface-container-low'] = '#121212'
dark_colors_map['surface-container'] = '#1e1e1e'
dark_colors_map['surface-container-high'] = '#2a2a2a'
dark_colors_map['surface-container-highest'] = '#363636'
dark_colors_map['outline-variant'] = '#43474f'

dark_css_vars = []
for key, val in dark_colors_map.items():
    dark_css_vars.append(f"  --color-{key}: {val};")

global_css = f"""@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {{
  :root {{
{chr(10).join(css_vars)}
  }}
  .dark {{
{chr(10).join(dark_css_vars)}
  }}
}}
"""

with open('src/global.css', 'w') as f:
    f.write(global_css)

# Update tailwind.config.js to use CSS variables
new_colors_str = "{\n"
for key in colors_map.keys():
    new_colors_str += f"        '{key}': 'var(--color-{key})',\n"
new_colors_str += "      }"

new_content = content[:colors_match.start(1)] + new_colors_str + content[colors_match.end(1):]

# Wait, NativeWind v4 requires dark mode strategy
# Let's add darkMode: 'class', to tailwind config
if 'darkMode' not in new_content:
    new_content = new_content.replace('theme: {', "darkMode: 'class',\n  theme: {")

with open('tailwind.config.js', 'w') as f:
    f.write(new_content)

print("Updated tailwind.config.js and src/global.css")
