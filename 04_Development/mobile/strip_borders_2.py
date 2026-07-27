import os
import re

base_dir = r"C:\Users\Sravan\Projects\YRecall\04_Development\mobile\app"
src_dir = r"C:\Users\Sravan\Projects\YRecall\04_Development\mobile\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove all borders that look dark (primary borders and outline borders)
    # The user wants NO dark borders on these cards.
    new_content = re.sub(r'\bborder border-primary/\d+\b', '', content)
    new_content = re.sub(r'\bborder border-outline-variant(?:/\d+)?\b', '', new_content)
    new_content = re.sub(r'\bborder-primary/\d+\b', '', new_content)
    new_content = re.sub(r'\bborder-outline-variant(?:/\d+)?\b', '', new_content)
    # Also clean up double spaces left behind
    new_content = re.sub(r'  +', ' ', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Removed borders: {filepath}")

for d in [base_dir, src_dir]:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

print("Done stripping all borders.")
