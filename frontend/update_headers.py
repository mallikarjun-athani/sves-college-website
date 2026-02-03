import os
import re

# Base directory for frontend files
directory = r"c:/xampp1/htdocs/SVES website/frontend/"
files = [
    'about.html', 'admissions.html', 'contact.html', 'courses.html',
    'departments.html', 'faculty.html', 'gallery.html', 'notes.html',
    'placements.html', 'student-corner.html'
]

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Update Logo Block (Replace inline styles with classes)
    # Matches the specific h2 inline style line
    content = re.sub(
        r'<h2 style="color: var\(--white\); font-size: 1.5rem; line-height: 1;">SVES College</h2>',
        '<h2 class="logo-title">SVES College</h2>', 
        content
    )
    # Matches the span inline style line (handling potential whitespace/newlines)
    content = re.sub(
        r'<span\s+style="color: var\(--secondary\);[^>]*>Harugeri</span>',
        '<span class="logo-subtitle">Harugeri</span>',
        content
    )

    # 2. Remove Buttons
    # Remove Admin Login (matches simple link)
    content = re.sub(r'\s*<a href="admin/login\.html">Admin Login</a>', '', content)
    
    # Remove Apply Now (Desktop - matches extensive style string)
    content = re.sub(r'\s*<a href="admissions\.html" class="btn btn-secondary"\s*style="padding: 8px 20px; color: var\(--primary\) !important;">Apply Now</a>', '', content)
    
    # Remove Apply Now (Mobile - matches margin-top style)
    content = re.sub(r'\s*<a href="admissions\.html" class="btn btn-secondary" style="margin-top: 20px; text-align: center;">Apply\s*Now</a>', '', content)

    # 3. Remove Internal CSS Block for Header (matches header.scrolled rules)
    # Handles header.scrolled .logo-text h2
    content = re.sub(r'\s*header\.scrolled \.logo-text h2\s*\{\s*color: var\(--primary\);\s*\}', '', content)
    # Handles header.scrolled .mobile-menu-toggle
    content = re.sub(r'\s*header\.scrolled \.mobile-menu-toggle\s*\{\s*color: var\(--primary\);\s*\}', '', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes for {filepath}")

if __name__ == "__main__":
    print("Starting Header Updates...")
    for filename in files:
        path = os.path.join(directory, filename)
        if os.path.exists(path):
            update_file(path)
        else:
            print(f"File not found: {path} (Skipping)")
    print("Header Updates Completed.")
