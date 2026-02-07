#!/usr/bin/env python3
"""
Process and copy documentation from mc-journey-attempt repository.
Adds frontmatter to markdown files and ensures proper layout configuration.
"""

import os
import re
from pathlib import Path
from datetime import datetime


# Paths
source_dir = Path('temp-repo/docs')
target_dir = Path('content/projects/mc-journey')


def has_frontmatter(content):
    """Check if file already has YAML frontmatter"""
    return content.startswith('---\n')


def add_frontmatter(content, filepath):
    """Add appropriate frontmatter to markdown file"""
    filename = os.path.basename(filepath)
    
    # Determine layout
    if filename == 'index.md':
        layout = 'pasta'
        # Try to extract title from first heading or use folder name
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if title_match:
            title = title_match.group(1).strip()
        else:
            folder_name = os.path.basename(os.path.dirname(filepath))
            if folder_name == 'mc-journey-attempt':
                title = 'MC Journey'
            else:
                title = folder_name.replace('-', ' ').replace('_', ' ').title()
    else:
        layout = 'default'
        # Extract title from first heading or filename
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if title_match:
            title = title_match.group(1).strip()
        else:
            title = filename.replace('.md', '').replace('-', ' ').replace('_', ' ').title()
    
    # Build frontmatter (using explicit newlines to avoid YAML parsing issues)
    frontmatter = "---\n"
    frontmatter += f"layout: {layout}\n"
    frontmatter += f"title: {title}\n"
    frontmatter += "---\n\n"
    
    return frontmatter + content


def update_frontmatter_layout(content, filepath):
    """Update or add layout in frontmatter for index.md files"""
    filename = os.path.basename(filepath)
    
    if filename != 'index.md':
        return content
    
    # Check if has frontmatter
    if not content.startswith('---\n') and not content.startswith('---\r\n'):
        return content
    
    # Find end of frontmatter (handle both \n and \r\n)
    end_match = re.search(r'\r?\n---(?:\r?\n|$)', content[4:])
    if not end_match:
        return content
    
    frontmatter_end = end_match.start() + 4
    closing_match = end_match.group(0)
    frontmatter = content[4:frontmatter_end].strip()
    rest = content[frontmatter_end + len(closing_match):]
    
    # Parse and update layout
    lines = [line.strip() for line in frontmatter.split('\n') if line.strip()]
    new_lines = []
    layout_found = False
    
    for line in lines:
        if line.startswith('layout:'):
            new_lines.append('layout: pasta')
            layout_found = True
        else:
            new_lines.append(line)
    
    # Add layout if not found
    if not layout_found:
        new_lines.insert(0, 'layout: pasta')
    
    # Rebuild content
    new_frontmatter = '\n'.join(new_lines)
    return f"---\n{new_frontmatter}\n---\n{rest}"


def process_file(source_file, target_file):
    """Process a single markdown file"""
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add frontmatter if not present
    if not has_frontmatter(content):
        content = add_frontmatter(content, source_file)
    else:
        # Force layout: pasta for index.md files
        content = update_frontmatter_layout(content, source_file)
    
    # Write to target
    target_file.parent.mkdir(parents=True, exist_ok=True)
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(content)


def main():
    """Main processing function"""
    # Clean target directory
    if target_dir.exists():
        import shutil
        shutil.rmtree(target_dir)
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Process all markdown files
    if source_dir.exists():
        for md_file in source_dir.rglob('*.md'):
            # Calculate relative path
            rel_path = md_file.relative_to(source_dir)
            target_file = target_dir / rel_path
            
            print(f"Processing: {rel_path}")
            process_file(md_file, target_file)
        
        print(f"\nSync completed at {datetime.now().isoformat()}")
    else:
        print(f"Warning: docs directory not found in source repository")


if __name__ == '__main__':
    main()
