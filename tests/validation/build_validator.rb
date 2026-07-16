#!/usr/bin/env ruby
# frozen_string_literal: true

require 'yaml'
require 'pathname'
require 'json'

class BuildValidator
  def initialize(site_root)
    @site_root = Pathname.new(site_root)
    @config = load_validation_config
    @jekyll_config = load_jekyll_config
    @errors = []
    @warnings = []
  end

  def validate_all
    puts "🔍 Starting build validation..."
    
    validate_jekyll_config
    validate_directory_structure
    validate_required_files
    validate_data_files
    validate_frontmatter
    validate_search_index
    
    report_results
    
    @errors.empty?
  end

  private

  def load_validation_config
    config_path = @site_root / 'tests' / 'validation' / 'validation_config.yml'
    YAML.load_file(config_path)
  rescue StandardError => e
    puts "⚠️  Failed to load validation config: #{e.message}"
    {}
  end

  def load_jekyll_config
    config_path = @site_root / '_config.yml'
    YAML.load_file(config_path)
  rescue StandardError => e
    puts "⚠️  Failed to load Jekyll config: #{e.message}"
    {}
  end

  def validate_jekyll_config
    puts "  ✅ Validating Jekyll configuration..."
    
    config_file = @site_root / '_config.yml'
    unless config_file.exist?
      add_error("Jekyll _config.yml not found")
      return
    end

    begin
      config = YAML.load_file(config_file)
      required_fields = @config.dig('build_validation', 'required_config') || []
      
      required_fields.each do |field|
        unless config.key?(field)
          add_error("Missing required config field: #{field}")
        end
      end

      # Validate specific config values
      if config['baseurl'] && !config['baseurl'].start_with?('/')
        add_warning("baseurl should start with '/' or be empty")
      end

      if config['url'] && !config['url'].match?(/^https?:\/\//)
        add_warning("url should be a complete URL with protocol")
      end

    rescue StandardError => e
      add_error("Failed to parse Jekyll config: #{e.message}")
    end
  end

  def validate_directory_structure
    puts "  📁 Validating directory structure..."
    
    # Use Jekyll config for custom directory paths
    layouts_dir = @jekyll_config['layouts_dir'] || '_layouts'
    includes_dir = @jekyll_config['includes_dir'] || '_includes'
    data_dir = @jekyll_config['data_dir'] || '_data'
    sass_dir = @jekyll_config.dig('sass', 'sass_dir') || '_sass'
    
    required_dirs = {
      'layouts' => layouts_dir,
      'includes' => includes_dir,
      'sass' => sass_dir,
      'data' => data_dir
    }
    
    required_dirs.each do |name, dir|
      dir_path = @site_root / dir
      unless dir_path.directory?
        add_error("Required #{name} directory missing: #{dir}")
      end
    end

    # Check for common directories
    %w[assets content].each do |dir|
      dir_path = @site_root / dir
      unless dir_path.directory?
        add_warning("Directory not found: #{dir}")
      end
    end
  end

  def validate_required_files
    puts "  📄 Validating required files..."
    
    # Validate layout files using Jekyll config
    layouts_dir = @site_root / (@jekyll_config['layouts_dir'] || '_layouts')
    required_layouts = @config.dig('build_validation', 'required_layouts') || []
    
    required_layouts.each do |layout|
      layout_path = layouts_dir / layout
      unless layout_path.exist?
        add_error("Required layout file missing: #{layout}")
      end
    end

    # Validate essential files
    essential_files = ['index.md', 'Gemfile', 'Makefile']
    essential_files.each do |file|
      file_path = @site_root / file
      unless file_path.exist?
        add_warning("Essential file missing: #{file}")
      end
    end
  end

  def validate_data_files
    puts "  💾 Validating data files..."
    
    data_dir = @site_root / (@jekyll_config['data_dir'] || '_data')
    required_data = @config.dig('build_validation', 'required_data') || []
    
    required_data.each do |data_file|
      data_path = data_dir / data_file
      unless data_path.exist?
        add_warning("Data file not found: #{data_file}")
        next
      end

      # Validate YAML syntax
      begin
        YAML.load_file(data_path)
      rescue StandardError => e
        add_error("Invalid YAML in #{data_file}: #{e.message}")
      end
    end

    # Validate specific data file structures
    validate_navigation_data(data_dir / 'navigation.yml')
    validate_repositories_data(data_dir / 'repositories.yml')
  end

  def validate_navigation_data(nav_file)
    return unless nav_file.exist?

    begin
      nav_data = YAML.load_file(nav_file)
      
      # Support both 'items' and 'sections' structure
      nav_items = nav_data['items'] || nav_data['sections']
      
      unless nav_data.is_a?(Hash) && nav_items
        add_error("navigation.yml should have 'items' or 'sections' key with array of navigation items")
        return
      end

      nav_items.each_with_index do |item, index|
        unless item.is_a?(Hash)
          add_error("Navigation item #{index} should be a hash")
          next
        end

        # Validate required fields (name/title and url/path)
        name_field = item['name'] || item['title']
        path_field = item['url'] || item['path']
        
        unless name_field && path_field
          add_error("Navigation item #{index} missing required 'name/title' or 'url/path'")
        end

        # Validate children if present
        if item['children']
          unless item['children'].is_a?(Array)
            add_error("Navigation item '#{name_field}' children should be an array")
          end
        end
      end

    rescue StandardError => e
      add_error("Failed to validate navigation.yml: #{e.message}")
    end
  end

  def validate_repositories_data(repo_file)
    return unless repo_file.exist?

    begin
      repo_data = YAML.load_file(repo_file)
      
      unless repo_data.is_a?(Hash) && repo_data.key?('repositories')
        add_error("repositories.yml should have 'repositories' key")
        return
      end

      repo_data['repositories'].each_with_index do |repo, index|
        # Check for required fields - support both old and new schema
        required_fields = ['name', 'description']
        required_fields.each do |field|
          unless repo.key?(field)
            add_error("Repository #{index} missing required field: #{field}")
          end
        end
        
        # Validate URL field (github_url or url)
        unless repo['github_url'] || repo['url']
          add_error("Repository #{index} missing required field: url or github_url")
        end

        # Validate URL format
        repo_url = repo['github_url'] || repo['url']
        if repo_url && !repo_url.match?(/^https:\/\/github\.com\//)
          add_warning("Repository '#{repo['name']}' URL should be a GitHub URL")
        end

        # Validate numeric fields if present
        %w[stars forks].each do |field|
          if repo[field] && !repo[field].is_a?(Integer)
            add_error("Repository '#{repo['name']}' #{field} should be an integer")
          end
        end
      end

    rescue StandardError => e
      add_error("Failed to validate repositories.yml: #{e.message}")
    end
  end

  def validate_frontmatter
    puts "  📝 Validating frontmatter..."
    
    content_files = Dir.glob("#{@site_root}/content/**/*.md")
    schema = @config['frontmatter_schema'] || {}

    content_files.each do |file|
      validate_file_frontmatter(file, schema)
    end
  end

  def validate_file_frontmatter(file, schema)
    content = File.read(file)
    
    # Check if file has frontmatter
    unless content.start_with?('---')
      # With jekyll-optional-front-matter plugin, this is OK
      if @jekyll_config.dig('plugins')&.include?('jekyll-optional-front-matter')
        return  # Skip validation for files without frontmatter
      else
        add_warning("File missing frontmatter: #{file}")
        return
      end
    end

    # Extract frontmatter
    begin
      parts = content.split('---', 3)
      return unless parts.length >= 3

      # Use safe_load and treat dates as strings
      frontmatter = YAML.safe_load(parts[1], permitted_classes: [], aliases: true) || {}
      layout = frontmatter['layout']
      
      # Determine if this is a strict validation file type
      is_post = file.include?('/posts/') && !file.end_with?('/index.md')
      is_diario = file.include?('/diario-de-aprendizado/') && file.match?(/dia-\d{4}-\d{2}-\d{2}\.md$/)
      
      # Get schema for layout
      layout_schema = if layout
        schema["#{layout}_layout"] || schema['default_layout']
      else
        schema['default_layout']
      end
      
      return unless layout_schema

      # Validate required fields (with exceptions for optional frontmatter)
      required_fields = layout_schema['required_fields'] || []
      required_fields.each do |field|
        next if field == 'layout' && @jekyll_config.dig('plugins')&.include?('jekyll-optional-front-matter')
        
        # Only require 'date' for actual posts and diary entries
        if field == 'date'
          next unless is_post || is_diario
        end
        
        unless frontmatter.key?(field)
          add_error("#{file}: Missing required frontmatter field: #{field}")
        end
      end

      # Validate field formats
      validate_frontmatter_formats(file, frontmatter)

    rescue StandardError => e
      add_error("#{file}: Invalid frontmatter YAML: #{e.message}")
    end
  end

  def validate_frontmatter_formats(file, frontmatter)
    # Validate date format if present
    if frontmatter['date']
      begin
        require 'date' unless defined?(::Date)
        ::Date.parse(frontmatter['date'].to_s)
      rescue StandardError => e
        add_error("#{file}: Invalid date format in frontmatter (#{e.class}: #{e.message})")
      end
    end

    # Validate layout exists using Jekyll config (only if specified)
    if frontmatter['layout']
      layouts_dir = @site_root / (@jekyll_config['layouts_dir'] || '_layouts')
      layout_file = layouts_dir / "#{frontmatter['layout']}.html"
      unless layout_file.exist?
        add_error("#{file}: References non-existent layout: #{frontmatter['layout']}")
      end
    elsif !@jekyll_config.dig('plugins')&.include?('jekyll-optional-front-matter')
      # Only warn if optional frontmatter plugin is not enabled
      add_warning("#{file}: No layout specified (will use default)")
    end

    # Validate title is not empty
    if frontmatter['title'] && frontmatter['title'].to_s.strip.empty?
      add_warning("#{file}: Empty title in frontmatter")
    end
  end

  def validate_search_index
    puts "  🔍 Validating search index..."
    
    search_index_file = @site_root / 'src' / 'assets' / 'json' / 'search-index.json'
    return unless search_index_file.exist?

    begin
      # For Jekyll liquid template, we can't validate the final JSON
      # But we can check the template structure
      template_content = File.read(search_index_file)
      
      required_fields = @config.dig('search_index', 'required_fields') || []
      
      required_fields.each do |field|
        unless template_content.include?(field)
          add_warning("Search index template missing field reference: #{field}")
        end
      end

      # Check for proper JSON structure in template
      unless template_content.include?('[') && template_content.include?(']')
        add_error("Search index template should generate JSON array")
      end

    rescue StandardError => e
      add_error("Failed to validate search index: #{e.message}")
    end
  end

  def add_error(message)
    @errors << message
    puts "    ❌ ERROR: #{message}"
  end

  def add_warning(message)
    @warnings << message
    puts "    ⚠️  WARNING: #{message}"
  end

  def report_results
    puts "\n📊 Build Validation Results:"
    puts "  Errors: #{@errors.length}"
    puts "  Warnings: #{@warnings.length}"
    
    if @errors.any?
      puts "\n❌ Errors found:"
      @errors.each { |error| puts "  - #{error}" }
    end

    if @warnings.any?
      puts "\n⚠️  Warnings:"
      @warnings.each { |warning| puts "  - #{warning}" }
    end

    if @errors.empty? && @warnings.empty?
      puts "  ✅ All validations passed!"
    end
  end
end

# Main execution
if __FILE__ == $0
  site_root = ARGV[0] || Dir.pwd
  validator = BuildValidator.new(site_root)
  
  success = validator.validate_all
  exit(success ? 0 : 1)
end