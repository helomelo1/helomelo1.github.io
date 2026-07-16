import os
import json
import time

NOTES_DIR = 'notes'
OUTPUT_FILE = 'notes.json'

def generate_notes():
    if not os.path.exists(NOTES_DIR):
        os.makedirs(NOTES_DIR)
        print(f"Created {NOTES_DIR} directory. Drop markdown or text files here.")

    notes = []
    
    for filename in os.listdir(NOTES_DIR):
        if filename.endswith('.md') or filename.endswith('.txt'):
            filepath = os.path.join(NOTES_DIR, filename)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            if not lines:
                continue
                
            title = filename.rsplit('.', 1)[0].replace('-', ' ').title()
            content_lines = []
            
            # Simple parsing: if first line is a heading, use it as title
            if lines[0].startswith('# '):
                title = lines[0][2:].strip()
                lines = lines[1:]
                
            # Filter out empty lines at start
            for line in lines:
                if content_lines or line.strip():
                    content_lines.append(line.strip())
                    
            content = '\n'.join(content_lines)
            
            # Get file modification time
            mtime = os.path.getmtime(filepath)
            
            notes.append({
                'filename': filename,
                'title': title,
                'content': content,
                'date': mtime
            })
            
    # Sort notes by date descending (newest first)
    notes.sort(key=lambda x: x['date'], reverse=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(notes, f, indent=2)
        
    print(f"Generated {OUTPUT_FILE} with {len(notes)} notes.")

if __name__ == '__main__':
    generate_notes()
