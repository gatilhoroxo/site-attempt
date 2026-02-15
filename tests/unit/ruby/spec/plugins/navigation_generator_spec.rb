# frozen_string_literal: true

require 'spec_helper'
require_relative '../../../../../src/_plugins/navigation_generator'

RSpec.describe 'NavigationGenerator' do
  let(:site) { mock_jekyll_site }
  let(:navigation_data) { mock_navigation_data }

  before do
    site.data['navigation'] = navigation_data
    
    # Create mock pages for testing
    @pages = [
      mock_page('content/gatilhos/index.md', { 'title' => 'Gatilhos' }),
      mock_page('content/gatilhos/conceitos-fundamentais/index.md', { 'title' => 'Conceitos Fundamentais' }),
      mock_page('content/gatilhos/conceitos-fundamentais/variaveis.md', { 'title' => 'Variáveis' }),
      mock_page('content/gatilhos/conceitos-fundamentais/funcoes.md', { 'title' => 'Funções' }),
      mock_page('content/gatilhos/diario-de-aprendizado/dia-2025-12-25.md', { 
        'title' => 'Dia 25 Dezembro', 
        'date' => Date.new(2025, 12, 25) 
      }),
      mock_page('content/posts/introducao.md', { 'title' => 'Introdução' }),
      mock_page('docs/getting-started.md', { 'title' => 'Getting Started' })
    ]
    
    site.pages = @pages
  end

  describe 'Jekyll hook integration' do
    it 'should skip processing without navigation configuration' do
      site.data.delete('navigation')
      
      expect(Jekyll.logger).to receive(:warn).with("Navigation:", "No navigation.yml or sections found")
      
      # Trigger the hook
      Jekyll::Hooks.trigger :site, :post_read, site
      
      expect(site.data['navigation_tree']).to be_nil
    end
  end

  describe '#build_navigation_tree' do
    let(:gatilhos_pages) do
      @pages.select { |p| p.path.start_with?('content/gatilhos/') && p.path != 'content/gatilhos/index.md' }
    end

    it 'should build tree structure correctly' do
      tree = build_navigation_tree(gatilhos_pages, 'content/gatilhos', 'title', 2, 0)
      
      expect(tree).to be_a(Hash)
      expect(tree).to have_key('files')
      expect(tree).to have_key('folders')
      expect(tree['folders']).to have_key('conceitos-fundamentais')
      expect(tree['folders']).to have_key('diario-de-aprendizado')
    end

    it 'should respect max depth limit' do
      tree = build_navigation_tree(gatilhos_pages, 'content/gatilhos', 'title', 1, 0)
      
      # With max_depth=1, should only process immediate files, no folders
      expect(tree['folders']).to be_empty
    end

    it 'should handle empty pages array' do
      tree = build_navigation_tree([], 'content/empty', 'title', 2, 0)
      
      expect(tree['files']).to be_empty
      expect(tree['folders']).to be_empty
    end

    it 'should detect index pages in folders' do
      tree = build_navigation_tree(gatilhos_pages, 'content/gatilhos', 'title', 2, 0)
      
      conceitos_folder = tree['folders']['conceitos-fundamentais']
      expect(conceitos_folder).to have_key('index_url')
      expect(conceitos_folder).to have_key('index_title')
      expect(conceitos_folder['index_title']).to eq('Conceitos Fundamentais')
    end

    it 'should exclude index pages from files list' do
      tree = build_navigation_tree(gatilhos_pages, 'content/gatilhos', 'title', 2, 0)
      
      conceitos_folder = tree['folders']['conceitos-fundamentais']
      file_paths = conceitos_folder['files'].map { |f| f['path'] }
      
      expect(file_paths).not_to include('content/gatilhos/conceitos-fundamentais/index.md')
      expect(file_paths).to include('content/gatilhos/conceitos-fundamentais/variaveis.md')
      expect(file_paths).to include('content/gatilhos/conceitos-fundamentais/funcoes.md')
    end
  end

  describe '#sort_files' do
    let(:test_files) do
      [
        { 'title' => 'Zebra', 'path' => 'z.md', 'date' => Date.new(2025, 1, 1) },
        { 'title' => 'Alpha', 'path' => 'a.md', 'date' => Date.new(2025, 12, 31) },
        { 'title' => 'Beta', 'path' => 'b.md', 'date' => nil }
      ]
    end

    it 'should sort by title (default)' do
      sorted = sort_files(test_files, 'title')
      titles = sorted.map { |f| f['title'] }
      
      expect(titles).to eq(['Alpha', 'Beta', 'Zebra'])
    end

    it 'should sort by name/path' do
      sorted = sort_files(test_files, 'name')
      paths = sorted.map { |f| f['path'] }
      
      expect(paths).to eq(['a.md', 'b.md', 'z.md'])
    end

    it 'should sort by date (newest first)' do
      sorted = sort_files(test_files, 'date')
      dates = sorted.map { |f| f['date'] }
      
      # Should be: newest (2025-12-31), oldest (2025-1-1), then nil dates (treated as epoch)
      expect(dates.first).to eq(Date.new(2025, 12, 31))
      expect(dates.last).to be_nil
    end

    it 'should handle files with nil dates' do
      files_with_nils = [
        { 'title' => 'File 1', 'date' => nil },
        { 'title' => 'File 2', 'date' => Date.new(2025, 1, 1) }
      ]
      
      sorted = sort_files(files_with_nils, 'date')
      
      # Files with dates should come first, nil dates last
      expect(sorted.first['title']).to eq('File 2')
      expect(sorted.last['title']).to eq('File 1')
    end
  end

  describe '#filename_as_title' do
    it 'should convert filename to readable title' do
      page = mock_page('test-file.md', {})
      title = filename_as_title(page)
      
      expect(title).to eq('Test File')
    end

    it 'should handle underscores' do
      page = mock_page('my_test_file.md', {})
      title = filename_as_title(page)
      
      expect(title).to eq('My Test File')
    end

    it 'should handle mixed separators' do
      page = mock_page('complex-file_name.md', {})
      title = filename_as_title(page)
      
      expect(title).to eq('Complex File Name')
    end

    it 'should handle single word' do
      page = mock_page('introduction.md', {})
      title = filename_as_title(page)
      
      expect(title).to eq('Introduction')
    end

    it 'should ignore file extension' do
      page = mock_page('test.html', {})
      title = filename_as_title(page)
      
      expect(title).to eq('Test')
    end
  end

  describe 'navigation configuration parsing' do
    it 'should process sections from navigation.yml' do
      navigation_data['sections'] = [
        { 'path' => 'gatilhos', 'name' => 'Gatilhos', 'max_depth' => 2 },
        { 'path' => 'posts', 'name' => 'Posts', 'max_depth' => 1 }
      ]
      site.data['navigation'] = navigation_data
      
      Jekyll::Hooks.trigger :site, :post_read, site
      
      tree = site.data['navigation_tree']
      expect(tree).to be_an(Array)
      expect(tree.size).to eq(2)
      expect(tree.map { |s| s['name'] }).to contain_exactly('Gatilhos', 'Posts')
    end

    it 'should handle docs section without content prefix' do
      navigation_data['sections'] = [
        { 'path' => 'docs', 'name' => 'Documentation', 'max_depth' => 1 }
      ]
      site.data['navigation'] = navigation_data
      
      Jekyll::Hooks.trigger :site, :post_read, site
      
      tree = site.data['navigation_tree']
      docs_section = tree.find { |s| s['name'] == 'Documentation' }
      
      expect(docs_section).not_to be_nil
      expect(docs_section['path_prefix']).to eq('')
    end

    it 'should skip empty sections' do
      navigation_data['sections'] = [
        { 'path' => 'nonexistent', 'name' => 'Empty Section', 'max_depth' => 2 }
      ]
      site.data['navigation'] = navigation_data
      
      Jekyll::Hooks.trigger :site, :post_read, site
      
      tree = site.data['navigation_tree']
      expect(tree).to be_empty
    end
  end

  describe 'edge cases and error handling' do
    it 'should handle pages without titles' do
      pages_without_titles = [
        mock_page('content/test/no-title.md', {})
      ]
      
      tree = build_navigation_tree(pages_without_titles, 'content/test', 'title', 1, 0)
      
      expect(tree['files'].first['title']).to eq('No Title')
    end

    it 'should handle malformed paths' do
      malformed_pages = [
        mock_page('content//double-slash.md', { 'title' => 'Double Slash' }),
        mock_page('content/trailing-slash/.md', { 'title' => 'Trailing Slash' })
      ]
      
      # Should not crash
      expect {
        build_navigation_tree(malformed_pages, 'content', 'title', 2, 0)
      }.not_to raise_error
    end

    it 'should filter out files starting with underscore' do
      pages_with_underscores = @pages + [
        mock_page('content/gatilhos/_private.md', { 'title' => 'Private' })
      ]
      site.pages = pages_with_underscores
      
      navigation_data['sections'] = [
        { 'path' => 'gatilhos', 'name' => 'Gatilhos', 'max_depth' => 2 }
      ]
      site.data['navigation'] = navigation_data
      
      Jekyll::Hooks.trigger :site, :post_read, site
      
      # Should not include the _private.md file
      tree = site.data['navigation_tree']
      gatilhos_section = tree.find { |s| s['name'] == 'Gatilhos' }
      all_files = extract_all_files(gatilhos_section['tree'])
      
      file_paths = all_files.map { |f| f['path'] }
      expect(file_paths).not_to include('content/gatilhos/_private.md')
    end
  end

  describe 'integration test' do
    it 'should generate complete navigation tree' do
      navigation_data['sections'] = [
        { 'path' => 'gatilhos', 'name' => 'Gatilhos', 'max_depth' => 3, 'sort_by' => 'title' }
      ]
      site.data['navigation'] = navigation_data
      
      # Suppress Jekyll output during test
      suppress_output do
        Jekyll::Hooks.trigger :site, :post_read, site
      end
      
      tree = site.data['navigation_tree']
      expect(tree).to be_an(Array)
      expect(tree.size).to eq(1)
      
      gatilhos_section = tree.first
      expect(gatilhos_section['name']).to eq('Gatilhos')
      expect(gatilhos_section['path']).to eq('gatilhos')
      expect(gatilhos_section['tree']).to have_key('folders')
      
      # Check structure
      folders = gatilhos_section['tree']['folders']
      expect(folders).to have_key('conceitos-fundamentais')
      expect(folders).to have_key('diario-de-aprendizado')
      
      # Check that conceitos-fundamentais has files
      conceitos_files = folders['conceitos-fundamentais']['files']
      expect(conceitos_files.size).to eq(2) # variaveis.md and funcoes.md
      expect(conceitos_files.map { |f| f['title'] }).to contain_exactly('Variáveis', 'Funções')
    end
  end

  # Helper methods for tests
  private

  def mock_page(path, frontmatter)
    page = double('Jekyll::Page')
    allow(page).to receive(:path).and_return(path)
    allow(page).to receive(:url).and_return('/' + path.gsub(/\.md$/, '/').gsub(/\/index\/$/, '/'))
    allow(page).to receive(:data).and_return(frontmatter)
    page
  end

  def extract_all_files(tree)
    files = tree['files'] || []
    tree['folders'].each_value do |folder|
      files += extract_all_files(folder)
    end
    files
  end
end