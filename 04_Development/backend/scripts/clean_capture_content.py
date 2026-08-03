import os
import sys
import argparse
import re
from sqlalchemy.orm import Session
from urllib.parse import unquote

# Add backend directory to sys.path to allow importing from app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.modules.captures.models import Capture
from app.modules.users.models import User
from app.modules.migration.models import MigrationJob

def clean_content(content_text: str):
    """
    Strips AI generated content like '### Detailed Summary' and '### Transcript'
    from the content_text, leaving the original text intact.
    """
    if not content_text:
        return content_text, False

    original_text = content_text
    modified = False

    # Regex patterns for the injected AI content
    patterns_to_remove = [
        r"### Detailed Analysis\n+.*?(?=\n\n###|\n\n---\n\n|$)",
        r"### Transcript\n+.*?(?=\n\n###|\n\n---\n\n|$)",
        r"### Scanned Text\n+.*?(?=\n\n###|\n\n---\n\n|$)",
        r"### Detailed Summary\n+.*?(?=\n\n###|\n\n---\n\n|$)",
        r"## Summary of the Document:\n+.*?(?=\n\n##|\n\n---\n\n|$)",
        r"---\n\n"
    ]
    
    # Try to find and isolate the original text if it was appended after "---"
    parts = content_text.split("\n\n---\n\n")
    if len(parts) > 1:
        # The last part usually contains the original text in text captures
        cleaned_text = parts[-1].strip()
        if cleaned_text != original_text.strip():
            modified = True
            return cleaned_text, modified

    # For media captures where text is just prepended and appended
    cleaned_text = content_text
    for pattern in patterns_to_remove:
        new_text = re.sub(pattern, "", cleaned_text, flags=re.DOTALL)
        if new_text != cleaned_text:
            cleaned_text = new_text
            modified = True
            
    # Remove any trailing keywords if they seem to be at the end (naive approach, 
    # but the '---' split handles most text/note captures).
    
    return cleaned_text.strip(), modified

def main():
    parser = argparse.ArgumentParser(description="Clean corrupted content_text in Captures.")
    parser.add_argument("--execute", action="store_true", help="Actually execute the cleanup and save to DB.")
    args = parser.parse_args()

    db: Session = SessionLocal()
    
    try:
        captures = db.query(Capture).filter(Capture.content_text.isnot(None)).all()
        
        affected_count = 0
        total_count = len(captures)
        
        print(f"Auditing {total_count} captures...")
        print("-" * 50)
        
        for capture in captures:
            cleaned_text, modified = clean_content(capture.content_text)
            
            if modified:
                affected_count += 1
                print(f"Capture ID: {capture.id} (Type: {capture.type})")
                print(f"--- ORIGINAL ---")
                print(capture.content_text[:200] + "..." if len(capture.content_text) > 200 else capture.content_text)
                print(f"--- CLEANED ---")
                print(cleaned_text[:200] + "..." if len(cleaned_text) > 200 else cleaned_text)
                print("-" * 50)
                
                if args.execute:
                    capture.content_text = cleaned_text
        
        if args.execute and affected_count > 0:
            db.commit()
            print(f"Successfully cleaned {affected_count} captures.")
        else:
            print(f"[DRY RUN] Would have cleaned {affected_count} captures out of {total_count} total.")
            if not args.execute:
                print("Run with --execute to apply changes.")
                
    finally:
        db.close()

if __name__ == "__main__":
    main()
