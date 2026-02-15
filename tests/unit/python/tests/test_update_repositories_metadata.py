import pytest
import tempfile
import os
from pathlib import Path
from unittest.mock import mock_open, patch, MagicMock
import yaml
import json
import update_repositories_metadata


class TestUpdateRepositoriesMetadata:
    """Test the update_repositories_metadata.py script"""

    @pytest.fixture
    def sample_repo_data(self):
        """Sample repository data for testing"""
        return {
            'name': 'test-repo',
            'description': 'A test repository',
            'html_url': 'https://github.com/user/test-repo',
            'language': 'Python',
            'topics': ['python', 'testing'],
            'stargazers_count': 10,
            'forks_count': 2,
            'updated_at': '2024-01-15T10:00:00Z',
            'created_at': '2023-01-01T00:00:00Z'
        }

    @pytest.fixture
    def sample_repositories_yaml(self):
        """Sample repositories.yml content"""
        return """repositories:
  - name: existing-repo
    description: An existing repository
    url: https://github.com/user/existing-repo
    language: JavaScript
    tags: [javascript, web]
    stars: 5
    forks: 1
    updated: 2023-12-01T00:00:00Z
    
  - name: test-repo
    description: Old description
    url: https://github.com/user/test-repo
    language: Java
    tags: [java]
    stars: 1
    forks: 0
    updated: 2023-01-01T00:00:00Z
"""

    def test_format_date_valid_iso(self):
        """Test formatting valid ISO date"""
        iso_date = "2024-01-15T10:30:45Z"
        result = update_repositories_metadata.format_date(iso_date)
        assert result == "2024-01-15T10:30:45Z"

    def test_format_date_invalid_format(self):
        """Test formatting invalid date returns None"""
        invalid_date = "invalid-date-format"
        result = update_repositories_metadata.format_date(invalid_date)
        assert result is None

    def test_format_date_none_input(self):
        """Test formatting None input returns None"""
        result = update_repositories_metadata.format_date(None)
        assert result is None

    def test_format_date_empty_string(self):
        """Test formatting empty string returns None"""
        result = update_repositories_metadata.format_date("")
        assert result is None

    def test_convert_repo_to_yaml_entry_complete(self, sample_repo_data):
        """Test converting complete repository data to YAML entry"""
        result = update_repositories_metadata.convert_repo_to_yaml_entry(sample_repo_data)
        
        expected = {
            'name': 'test-repo',
            'description': 'A test repository',
            'url': 'https://github.com/user/test-repo',
            'language': 'Python',
            'tags': ['python', 'testing'],
            'stars': 10,
            'forks': 2,
            'updated': '2024-01-15T10:00:00Z',
            'created': '2023-01-01T00:00:00Z'
        }
        
        assert result == expected

    def test_convert_repo_to_yaml_entry_minimal(self):
        """Test converting minimal repository data"""
        minimal_repo = {
            'name': 'minimal-repo',
            'description': None,
            'html_url': 'https://github.com/user/minimal-repo',
            'language': None,
            'topics': [],
            'stargazers_count': 0,
            'forks_count': 0,
            'updated_at': '2024-01-01T00:00:00Z',
            'created_at': None
        }
        
        result = update_repositories_metadata.convert_repo_to_yaml_entry(minimal_repo)
        
        expected = {
            'name': 'minimal-repo',
            'description': '',
            'url': 'https://github.com/user/minimal-repo',
            'language': '',
            'tags': [],
            'stars': 0,
            'forks': 0,
            'updated': '2024-01-01T00:00:00Z',
            'created': None
        }
        
        assert result == expected

    def test_convert_repo_to_yaml_entry_missing_fields(self):
        """Test converting repository data with missing fields"""
        incomplete_repo = {
            'name': 'incomplete-repo',
            'html_url': 'https://github.com/user/incomplete-repo'
        }
        
        result = update_repositories_metadata.convert_repo_to_yaml_entry(incomplete_repo)
        
        # Should handle missing fields gracefully
        assert result['name'] == 'incomplete-repo'
        assert result['url'] == 'https://github.com/user/incomplete-repo'
        assert result['description'] == ''
        assert result['language'] == ''
        assert result['tags'] == []
        assert result['stars'] == 0
        assert result['forks'] == 0

    def test_update_or_add_repository_new_repo(self, sample_repo_data):
        """Test adding a new repository to empty list"""
        repositories = []
        new_entry = update_repositories_metadata.convert_repo_to_yaml_entry(sample_repo_data)
        
        result = update_repositories_metadata.update_or_add_repository(repositories, new_entry)
        
        assert len(result) == 1
        assert result[0]['name'] == 'test-repo'
        assert result[0]['description'] == 'A test repository'

    def test_update_or_add_repository_update_existing(self, sample_repo_data):
        """Test updating existing repository"""
        existing_repo = {
            'name': 'test-repo',
            'description': 'Old description',
            'url': 'https://github.com/user/test-repo',
            'language': 'Java',
            'tags': ['java'],
            'stars': 1,
            'forks': 0,
            'updated': '2023-01-01T00:00:00Z'
        }
        
        repositories = [existing_repo]
        new_entry = update_repositories_metadata.convert_repo_to_yaml_entry(sample_repo_data)
        
        result = update_repositories_metadata.update_or_add_repository(repositories, new_entry)
        
        assert len(result) == 1
        assert result[0]['name'] == 'test-repo'
        assert result[0]['description'] == 'A test repository'  # Updated
        assert result[0]['language'] == 'Python'  # Updated
        assert result[0]['stars'] == 10  # Updated

    def test_update_or_add_repository_preserve_other_repos(self, sample_repo_data):
        """Test that other repositories are preserved when updating"""
        other_repo = {
            'name': 'other-repo',
            'description': 'Another repository',
            'url': 'https://github.com/user/other-repo',
            'language': 'JavaScript',
            'tags': ['js'],
            'stars': 5,
            'forks': 1,
            'updated': '2023-12-01T00:00:00Z'
        }
        
        existing_repo = {
            'name': 'test-repo',
            'description': 'Old description',
            'url': 'https://github.com/user/test-repo',
            'language': 'Java',
            'tags': ['java'],
            'stars': 1,
            'forks': 0,
            'updated': '2023-01-01T00:00:00Z'
        }
        
        repositories = [other_repo, existing_repo]
        new_entry = update_repositories_metadata.convert_repo_to_yaml_entry(sample_repo_data)
        
        result = update_repositories_metadata.update_or_add_repository(repositories, new_entry)
        
        assert len(result) == 2
        # Other repo should be unchanged
        assert result[0] == other_repo
        # Test repo should be updated
        assert result[1]['name'] == 'test-repo'
        assert result[1]['description'] == 'A test repository'

    @patch('builtins.open', new_callable=mock_open, read_data="""repositories:
  - name: existing-repo
    description: An existing repository
    url: https://github.com/user/existing-repo
    language: JavaScript
    tags: [javascript, web]
    stars: 5
    forks: 1
    updated: 2023-12-01T00:00:00Z
    
  - name: test-repo
    description: Old description
    url: https://github.com/user/test-repo
    language: Java
    tags: [java]
    stars: 1
    forks: 0
    updated: 2023-01-01T00:00:00Z
""")
    def test_load_repositories_yaml_success(self, mock_file):
        """Test successful loading of repositories.yml"""
        
        result = update_repositories_metadata.load_repositories_yaml(Path('test.yml'))
        
        assert 'repositories' in result
        assert len(result['repositories']) == 2
        assert result['repositories'][0]['name'] == 'existing-repo'
        assert result['repositories'][1]['name'] == 'test-repo'

    @patch('builtins.open', side_effect=FileNotFoundError)
    def test_load_repositories_yaml_file_not_found(self, mock_file):
        """Test handling of missing repositories.yml file"""
        result = update_repositories_metadata.load_repositories_yaml(Path('missing.yml'))
        
        assert result == {'repositories': []}

    @patch('builtins.open', new_callable=mock_open)
    def test_load_repositories_yaml_invalid_yaml(self, mock_file):
        """Test handling of invalid YAML content"""
        mock_file.return_value.read.return_value = "invalid: yaml: content: ["
        
        result = update_repositories_metadata.load_repositories_yaml(Path('invalid.yml'))
        
        assert result == {'repositories': []}

    @patch('builtins.open', new_callable=mock_open)
    def test_load_repositories_yaml_missing_repositories_key(self, mock_file):
        """Test handling YAML without repositories key"""
        mock_file.return_value.read.return_value = "other_key: value"
        
        result = update_repositories_metadata.load_repositories_yaml(Path('test.yml'))
        
        assert result == {'repositories': []}

    @patch('pathlib.Path.mkdir')
    def test_save_repositories_yaml(self, mock_mkdir):
        """Test saving repositories data to YAML file"""
        import tempfile
        
        data = {
            'repositories': [
                {
                    'name': 'test-repo',
                    'description': 'Test repository',
                    'url': 'https://github.com/user/test-repo',
                    'language': 'Python',
                    'tags': ['python'],
                    'stars': 5,
                    'forks': 1,
                    'updated': '2024-01-01T00:00:00Z'
                }
            ]
        }
        
        # Use a temporary file for testing
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yml', delete=False) as tmp:
            tmp_path = Path(tmp.name)
        
        try:
            update_repositories_metadata.save_repositories_yaml(tmp_path, data)
            
            # Read back and verify
            with open(tmp_path, 'r', encoding='utf-8') as f:
                parsed_yaml = yaml.safe_load(f)
            
            assert parsed_yaml == data
        finally:
            tmp_path.unlink()

    @patch('update_repositories_metadata.datetime')
    def test_update_all_repositories(self, mock_datetime):
        """Test updating all repositories with current date"""
        # Mock datetime to return predictable date
        mock_now = MagicMock()
        mock_now.strftime.return_value = '16/02/2026'
        mock_datetime.now.return_value = mock_now
        
        data = {
            'repositories': [
                {
                    'name': 'repo1',
                    'updated': 'old-date'
                },
                {
                    'name': 'repo2',
                    'updated': 'old-date'
                }
            ]
        }
        
        update_repositories_metadata.update_all_repositories(data)
        
        # Verify all repos were updated with new date
        assert data['repositories'][0]['updated'] == '16/02/2026'
        assert data['repositories'][1]['updated'] == '16/02/2026'

    def test_repo_sorting_by_name(self):
        """Test that repositories are sorted by name"""
        repos = [
            {'name': 'z-repo', 'description': 'Last alphabetically'},
            {'name': 'a-repo', 'description': 'First alphabetically'},
            {'name': 'm-repo', 'description': 'Middle alphabetically'}
        ]
        
        # Add each repo one by one to test sorting
        result = []
        for repo in repos:
            result = update_repositories_metadata.update_or_add_repository(result, repo)
        
        # Should be sorted by name
        names = [repo['name'] for repo in result]
        assert names == sorted(names)

    def test_special_character_handling(self):
        """Test handling of special characters in repository data"""
        repo_data = {
            'name': 'special-chars-repo',
            'description': 'Repository with "quotes" and émojis 🚀',
            'html_url': 'https://github.com/user/special-chars-repo',
            'language': 'C++',
            'topics': ['c++', 'émojis', 'spéciäl'],
            'stargazers_count': 10,
            'forks_count': 2,
            'updated_at': '2024-01-15T10:00:00Z',
            'created_at': '2023-01-01T00:00:00Z'
        }
        
        result = update_repositories_metadata.convert_repo_to_yaml_entry(repo_data)
        
        assert result['description'] == 'Repository with "quotes" and émojis 🚀'
        assert result['language'] == 'C++'
        assert 'émojis' in result['tags']
        assert 'spéciäl' in result['tags']

    def test_yaml_formatting_consistency(self):
        """Test that YAML output has consistent formatting"""
        import tempfile
        
        data = {
            'repositories': [
                {
                    'name': 'test-repo',
                    'description': 'A test repository',
                    'url': 'https://github.com/user/test-repo',
                    'language': 'Python',
                    'tags': ['python', 'testing', 'automation'],
                    'stars': 10,
                    'forks': 2,
                    'updated': '2024-01-15T10:00:00Z',
                    'created': '2023-01-01T00:00:00Z'
                }
            ]
        }
        
        # Use a temporary file for testing
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yml', delete=False) as tmp:
            tmp_path = Path(tmp.name)
        
        try:
            update_repositories_metadata.save_repositories_yaml(tmp_path, data)
            
            # Read back the written content
            with open(tmp_path, 'r', encoding='utf-8') as f:
                written_content = f.read()
            
            # Check YAML formatting characteristics
            assert 'repositories:' in written_content
            assert '- name: test-repo' in written_content
            assert '  description: A test repository' in written_content
            assert '  tags:' in written_content
            assert '  - python' in written_content
            assert '  - testing' in written_content
        finally:
            tmp_path.unlink()

    def test_empty_repositories_list_handling(self):
        """Test handling of empty repositories list"""
        github_repos = []
        existing_repos = [
            {
                'name': 'existing-repo',
                'description': 'Should be preserved',
                'url': 'https://github.com/user/existing-repo',
                'language': 'Python',
                'tags': ['python'],
                'stars': 5,
                'forks': 1,
                'updated': '2023-12-01T00:00:00Z'
            }
        ]
        
        result = existing_repos.copy()
        for repo in github_repos:
            entry = update_repositories_metadata.convert_repo_to_yaml_entry(repo)
            result = update_repositories_metadata.update_or_add_repository(result, entry)
        
        # Existing repos should be preserved even when no new repos
        assert len(result) == 1
        assert result[0]['name'] == 'existing-repo'

    def test_large_numbers_handling(self):
        """Test handling of large star/fork counts"""
        repo_data = {
            'name': 'popular-repo',
            'description': 'Very popular repository',
            'html_url': 'https://github.com/user/popular-repo',
            'language': 'Python',
            'topics': ['python'],
            'stargazers_count': 999999,
            'forks_count': 50000,
            'updated_at': '2024-01-15T10:00:00Z',
            'created_at': '2023-01-01T00:00:00Z'
        }
        
        result = update_repositories_metadata.convert_repo_to_yaml_entry(repo_data)
        
        assert result['stars'] == 999999
        assert result['forks'] == 50000
        assert isinstance(result['stars'], int)
        assert isinstance(result['forks'], int)