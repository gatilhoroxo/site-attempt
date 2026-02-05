#!/usr/bin/env python3
"""
Update repository metadata in _data/repositories.yml.
Adds or updates the mc-journey-attempt repository entry.
"""

import yaml
from datetime import datetime
from pathlib import Path


def main():
    """Update repositories metadata file"""
    data_file = Path('_data/repositories.yml')
    
    # Read current data if exists
    if data_file.exists():
        with open(data_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
    else:
        data = {}
    
    # Ensure repositories list exists
    if 'repositories' not in data:
        data['repositories'] = []
    
    # Update mc-journey-attempt entry
    mc_journey = None
    for repo in data['repositories']:
        if repo.get('id') == 'mc-journey-attempt':
            mc_journey = repo
            break
    
    if mc_journey:
        mc_journey['updated'] = datetime.now().strftime('%d/%m/%Y')
    else:
        data['repositories'].append({
            'id': 'mc-journey-attempt',
            'name': 'MC Journey',
            'github_url': 'https://github.com/gatilhoroxo/mc-journey-attempt',
            'local_path': '/projects/mc-journey/',
            'description': 'Jornada de aprendizado em Minecraft',
            'updated': datetime.now().strftime('%d/%m/%Y'),
            'topics': ['minecraft', 'modding', 'java']
        })
    
    # Write back
    data_file.parent.mkdir(parents=True, exist_ok=True)
    with open(data_file, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, allow_unicode=True, sort_keys=False)
    
    print(f"Updated repositories.yml")


if __name__ == '__main__':
    main()
