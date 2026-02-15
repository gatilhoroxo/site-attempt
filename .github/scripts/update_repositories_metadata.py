#!/usr/bin/env python3
"""
Update repository metadata in _data/repositories.yml.
Adds or updates the mc-journey-attempt repository entry.
"""

import yaml
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any


def format_date(date_str: Optional[str]) -> Optional[str]:
    """
    Validate and return ISO date string.
    
    Args:
        date_str: ISO format date string or None
        
    Returns:
        The same date string if valid ISO format, None if invalid
    """
    if not date_str:
        return None
    
    try:
        # Validate ISO format (e.g., "2024-01-15T10:30:45Z")
        datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return date_str
    except (ValueError, AttributeError):
        return None


def convert_repo_to_yaml_entry(repo_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert GitHub repository data to YAML entry format.
    
    Args:
        repo_data: Repository data from GitHub API
        
    Returns:
        Formatted dictionary for YAML
    """
    entry = {
        'name': repo_data.get('name', ''),
        'description': repo_data.get('description') or '',
        'url': repo_data.get('html_url', ''),
        'language': repo_data.get('language') or '',
        'tags': repo_data.get('topics', []),
        'stars': repo_data.get('stargazers_count', 0),
        'forks': repo_data.get('forks_count', 0),
        'updated': repo_data.get('updated_at', ''),
    }
    
    # Add created date if available
    created = repo_data.get('created_at')
    if created:
        entry['created'] = created
    else:
        entry['created'] = None
    
    return entry


def update_or_add_repository(repositories: List[Dict], new_repo: Dict) -> List[Dict]:
    """
    Update existing repository or add new one to the list.
    
    Args:
        repositories: List of existing repository entries
        new_repo: New or updated repository data
        
    Returns:
        Updated list of repositories, sorted by name
    """
    # Find and update existing repository by name
    updated = False
    repo_name = new_repo.get('name')
    
    for i, repo in enumerate(repositories):
        if repo.get('name') == repo_name:
            repositories[i] = new_repo
            updated = True
            break
    
    # Add new repository if not found
    if not updated:
        repositories.append(new_repo)
    
    # Sort by name
    repositories.sort(key=lambda x: x.get('name', '').lower())
    
    return repositories


def load_repositories_yaml(file_path: Path) -> Dict[str, Any]:
    """
    Load repositories data from YAML file.
    
    Args:
        file_path: Path to repositories.yml file
        
    Returns:
        Dictionary with repositories data
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
            
        # Ensure repositories key exists
        if 'repositories' not in data:
            data['repositories'] = []
            
        return data
    except FileNotFoundError:
        return {'repositories': []}
    except yaml.YAMLError:
        return {'repositories': []}


def save_repositories_yaml(file_path: Path, data: Dict[str, Any]) -> None:
    """
    Save repositories data to YAML file.
    
    Args:
        file_path: Path to repositories.yml file
        data: Dictionary with repositories data
    """
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

def update_all_repositories(data: Dict[str, Any]) -> None:
    """
    Atualiza todos os repositórios no dicionário de dados.
    Aqui, apenas atualiza o campo 'updated' para a data atual.
    """
    today = datetime.now().strftime('%d/%m/%Y')
    for repo in data.get('repositories', []):
        repo['updated'] = today
        # Aqui você pode adicionar lógica para buscar mais dados via API, se quiser


def main():
    """Update repositories metadata file"""
    data_file = Path('src/_data/repositories.yml')
    
    # Load current data
    data = load_repositories_yaml(data_file)
    
    # Update repository
    update_all_repositories(data)
    
    # Save back
    save_repositories_yaml(data_file, data)
    
    print(f"Updated repositories.yml")


if __name__ == '__main__':
    main()
