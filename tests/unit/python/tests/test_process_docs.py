import pytest
import tempfile
import os
from pathlib import Path
from unittest.mock import mock_open, patch, MagicMock
import process_docs


class TestProcessDocs:
    """Test the process_docs.py script"""

    def test_has_frontmatter_true(self):
        """Test detecting files with frontmatter"""
        content = "---\ntitle: Test\n---\n\nContent here"
        assert process_docs.has_frontmatter(content) == True

    def test_has_frontmatter_false(self):
        """Test detecting files without frontmatter"""
        content = "# Test Title\n\nContent here"
        assert process_docs.has_frontmatter(content) == False

    def test_has_frontmatter_false_with_dashes(self):
        """Test that dashes in content don't trigger false positives"""
        content = "Content with --- dashes --- in middle"
        assert process_docs.has_frontmatter(content) == False

    def test_add_frontmatter_index_file(self):
        """Test adding frontmatter to index.md files"""
        content = "# MC Journey\n\nThis is the main page"
        result = process_docs.add_frontmatter(content, "mc-journey/index.md", "mc-journey")
        
        assert result.startswith("---\n")
        assert "layout: pasta" in result
        assert "title: MC Journey" in result
        assert "# MC Journey" in result

    def test_add_frontmatter_regular_file(self):
        """Test adding frontmatter to regular markdown files"""
        content = "# GPIO Basics\n\nContent about GPIO"
        result = process_docs.add_frontmatter(content, "concepts/gpio-basics.md", "mc-journey")
        
        assert result.startswith("---\n")
        assert "layout: default" in result
        assert "title: GPIO Basics" in result
        assert "# GPIO Basics" in result

    def test_add_frontmatter_file_without_title(self):
        """Test adding frontmatter when no title heading is found"""
        content = "Some content without title heading"
        result = process_docs.add_frontmatter(content, "concepts/test-file.md", "mc-journey")
        
        assert "title: Test File" in result
        assert "layout: default" in result

    def test_add_frontmatter_index_without_title(self):
        """Test adding frontmatter to index.md without title heading"""
        content = "Some index content"
        result = process_docs.add_frontmatter(content, "some-folder/index.md", "mc-journey")
        
        assert "title: Some Folder" in result
        assert "layout: pasta" in result

    def test_add_frontmatter_root_index(self):
        """Test adding frontmatter to root index.md"""
        content = "Root content"
        result = process_docs.add_frontmatter(content, "mc-journey-attempt/index.md", "mc-journey-attempt")
        
        assert "title: mc-journey-attempt" in result
        assert "layout: pasta" in result

    def test_update_frontmatter_layout_non_index(self):
        """Test that non-index files are not modified"""
        content = "---\nlayout: default\ntitle: Test\n---\n\nContent"
        result = process_docs.update_frontmatter_layout(content, "test.md")
        
        assert result == content

    def test_update_frontmatter_layout_no_frontmatter(self):
        """Test that files without frontmatter are not modified"""
        content = "# Test\n\nContent"
        result = process_docs.update_frontmatter_layout(content, "index.md")
        
        assert result == content

    def test_update_frontmatter_layout_existing_layout(self):
        """Test updating existing layout in frontmatter"""
        content = "---\nlayout: default\ntitle: Test Index\n---\n\nContent"
        result = process_docs.update_frontmatter_layout(content, "index.md")
        
        assert "layout: pasta" in result
        assert "title: Test Index" in result
        assert "default" not in result

    def test_update_frontmatter_layout_missing_layout(self):
        """Test adding layout when missing from frontmatter"""
        content = "---\ntitle: Test Index\nauthor: Someone\n---\n\nContent"
        result = process_docs.update_frontmatter_layout(content, "index.md")
        
        assert "layout: pasta" in result
        assert "title: Test Index" in result
        assert "author: Someone" in result

    def test_update_frontmatter_layout_windows_line_endings(self):
        """Test handling Windows line endings in frontmatter"""
        content = "---\r\nlayout: default\r\ntitle: Test\r\n---\r\n\r\nContent"
        result = process_docs.update_frontmatter_layout(content, "index.md")
        
        assert "layout: pasta" in result
        assert "title: Test" in result

    @patch('builtins.open', new_callable=mock_open)
    @patch('pathlib.Path.mkdir')
    def test_process_file_without_frontmatter(self, mock_mkdir, mock_file):
        """Test processing a file without existing frontmatter"""
        mock_file.return_value.read.return_value = "# Test Title\n\nContent"
        
        source_file = Path("source.md")
        target_file = Path("target.md")
        
        process_docs.process_file(source_file, target_file, "mc-journey")
        
        # Check that file was read and written
        mock_file.assert_any_call(source_file, 'r', encoding='utf-8')
        mock_file.assert_any_call(target_file, 'w', encoding='utf-8')
        
        # Check that frontmatter was added
        written_content = mock_file.return_value.__enter__.return_value.write.call_args[0][0]
        assert "---\n" in written_content
        assert "layout: default" in written_content
        assert "title: Test Title" in written_content

    @patch('builtins.open', new_callable=mock_open)
    @patch('pathlib.Path.mkdir')
    def test_process_file_with_frontmatter_index(self, mock_mkdir, mock_file):
        """Test processing an index.md file with existing frontmatter"""
        mock_file.return_value.read.return_value = "---\nlayout: default\ntitle: Test\n---\n\nContent"
        
        source_file = Path("index.md")
        target_file = Path("target/index.md")
        
        process_docs.process_file(source_file, target_file, "mc-journey")
        
        # Check that layout was updated to pasta
        written_content = mock_file.return_value.__enter__.return_value.write.call_args[0][0]
        assert "layout: pasta" in written_content
        assert "layout: default" not in written_content

    @patch('sys.argv', ['process_docs.py', 'fake-source', 'fake-target', 'test-repo'])
    @patch('process_docs.target_dir')
    @patch('process_docs.source_dir')
    @patch('shutil.rmtree')
    @patch('pathlib.Path.exists')
    @patch('pathlib.Path.mkdir')
    @patch('pathlib.Path.rglob')
    @patch('process_docs.process_file')
    def test_main_function(self, mock_process_file, mock_rglob, mock_mkdir, mock_exists, mock_rmtree, mock_source_dir, mock_target_dir):
        """Test the main function workflow"""
        # Mock paths and files
        mock_target_dir.exists.return_value = True
        mock_source_dir.exists.return_value = True
        
        mock_md_files = [
            MagicMock(spec=Path),
            MagicMock(spec=Path)
        ]
        mock_md_files[0].relative_to.return_value = Path("file1.md")
        mock_md_files[1].relative_to.return_value = Path("file2.md")
        mock_rglob.return_value = mock_md_files
        
        # Run main function
        process_docs.main()
        
        # Verify cleanup and processing
        mock_rmtree.assert_called_once()
        mock_mkdir.assert_called()
        assert mock_process_file.call_count == 2

    @patch('sys.argv', ['script.py', 'fake-source', 'fake-target', 'test-repo'])
    @patch('pathlib.Path.exists')
    @patch('pathlib.Path.mkdir')
    def test_main_function_no_source_dir(self, mock_mkdir, mock_exists):
        """Test main function when source directory doesn't exist"""
        # First check is target_dir.exists (True), second is source_dir.exists (False)
        mock_exists.side_effect = [False, False]
        
        with patch('builtins.print') as mock_print:
            process_docs.main()
            # Should print the warning message
            mock_print.assert_any_call("Warning: docs directory not found in source repository")

    def test_title_extraction_complex_heading(self):
        """Test extracting title from various heading formats"""
        test_cases = [
            ("# Simple Title", "Simple Title"),
            ("# Title with Multiple Words", "Title with Multiple Words"),
            ("## Not First Level", None),  # Should not match h2
            ("Content\n# Title in Middle", "Title in Middle"),
            ("# Title with `code`", "Title with `code`"),
            ("No heading content", None)
        ]
        
        for content, expected_title in test_cases:
            result = process_docs.add_frontmatter(content, "test.md", "mc-journey")
            if expected_title:
                assert f"title: {expected_title}" in result
            else:
                # Should fall back to filename-based title
                assert "title: Test" in result

    def test_filename_title_conversion(self):
        """Test conversion of filenames to titles"""
        test_cases = [
            ("gpio-basics.md", "Gpio Basics"),
            ("test_file.md", "Test File"),
            ("simple.md", "Simple"),
            ("complex-file_name.md", "Complex File Name"),
            ("README.md", "Readme")
        ]
        
        for filename, expected_title in test_cases:
            content = "Content without heading"
            result = process_docs.add_frontmatter(content, filename, "mc-journey")
            assert f"title: {expected_title}" in result

    def test_path_handling_edge_cases(self):
        """Test handling of various path formats"""
        test_cases = [
            ("folder/subfolder/index.md", "folder", "pasta", "Subfolder"),
            ("mc-journey-attempt/index.md", "mc-journey-attempt", "pasta", "mc-journey-attempt"),
            ("single-word-folder/index.md", "single-word-folder", "pasta", "single-word-folder")
        ]
        
        for filepath, repo_title, expected_layout, expected_title in test_cases:
            content = "Content without heading"
            result = process_docs.add_frontmatter(content, filepath, repo_title)
            assert f"layout: {expected_layout}" in result
            assert f"title: {expected_title}" in result

    def test_frontmatter_format(self):
        """Test that generated frontmatter has correct YAML format"""
        content = "# Test Title\n\nContent"
        result = process_docs.add_frontmatter(content, "test.md", "mc-journey")
        
        lines = result.split('\n')
        
        # Check structure
        assert lines[0] == "---"
        assert lines[1].startswith("layout: ")
        assert lines[2].startswith("title: ")
        assert lines[3] == "---"
        assert lines[4] == ""  # Empty line after frontmatter
        assert lines[5] == "# Test Title"

    @patch('builtins.open')
    def test_file_encoding_handling(self, mock_open_func):
        """Test that files are properly handled with UTF-8 encoding"""
        mock_file = mock_open(read_data="# Título com Acentos\n\nConteúdo")()
        mock_open_func.return_value = mock_file
        
        source_file = Path("test.md")
        target_file = Path("output.md")
        
        process_docs.process_file(source_file, target_file, "mc-journey")
        
        # Verify UTF-8 encoding was used
        mock_open_func.assert_any_call(source_file, 'r', encoding='utf-8')
        mock_open_func.assert_any_call(target_file, 'w', encoding='utf-8')