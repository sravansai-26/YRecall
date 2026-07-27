import os
import re

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex for border-b not followed by anything else (like -2 or color)
    # but followed by space or quote or backtick
    new_content = re.sub(r'\s+border-b(?=[\s\"\`])', '', content)
    
    # regex for border not followed by anything else (like -2 or color)
    # but followed by space or quote or backtick
    new_content = re.sub(r'\s+border(?=[\s\"\`])', '', new_content)
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Removed borders in: {path}")

for root, dirs, files in os.walk('app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
