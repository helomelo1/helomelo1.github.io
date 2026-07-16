import os
import json

NOTES_DIR = 'notes'
OUTPUT_FILE = 'notes.json'

def generate_notes():
    if not os.path.exists(NOTES_DIR):
        os.makedirs(NOTES_DIR)
        print(f"Created {NOTES_DIR} directory. Drop PDF files here.")

    notes = []
    
    for filename in os.listdir(NOTES_DIR):
        if filename.endswith('.pdf'):
            filepath = os.path.join(NOTES_DIR, filename)
            
            # Use filename without extension as the title
            title = filename.rsplit('.', 1)[0].replace('-', ' ').replace('_', ' ').title()
            
            # Get file modification time
            mtime = os.path.getmtime(filepath)
            
            notes.append({
                'filename': filename,
                'title': title,
                'date': mtime
            })
            
    # Sort notes by date descending (newest first)
    notes.sort(key=lambda x: x['date'], reverse=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(notes, f, indent=2)
        
    print(f"Generated {OUTPUT_FILE} with {len(notes)} PDF notes.")

if __name__ == '__main__':
    generate_notes()
