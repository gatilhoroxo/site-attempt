# frozen_string_literal: true

require 'jekyll'
require 'rspec'
require 'rspec/mocks'

# Configure Jekyll for testing
Jekyll.logger.log_level = :error

# RSpec configuration
RSpec.configure do |config|
  # Enable all filters
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
    expectations.syntax = :expect
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
    mocks.syntax = :expect
  end

  # Share examples between tests
  config.shared_context_metadata_behavior = :apply_to_host_groups

  # Random order
  config.order = :random
  Kernel.srand config.seed

  # Print slowest examples
  config.profile_examples = 5 if ENV['RSPEC_PROFILE']

  # Helper methods
  config.include(Module.new do
    # Create a mock Jekyll site for testing
    def mock_jekyll_site(config_overrides = {})
      config = Jekyll.configuration(
        {
          'source' => File.expand_path('fixtures', __dir__),
          'destination' => File.expand_path('spec/_site'),
          'safe' => true,
          'plugins' => [],
          'quiet' => true
        }.merge(config_overrides)
      )
      
      site = Jekyll::Site.new(config)
      site.data = {}
      site
    end

    # Create mock Jekyll page
    def mock_jekyll_page(site, path, frontmatter = {}, content = '')
      page = Jekyll::Page.new(site, site.source, File.dirname(path), File.basename(path))
      page.data = frontmatter
      page.content = content
      page
    end

    # Create mock navigation data
    def mock_navigation_data
      {
        'main' => {
          'enabled' => true,
          'sort_by' => 'title',
          'include_folders' => ['content', 'docs'],
          'exclude_patterns' => ['_*', '.git*']
        }
      }
    end
    
    # Helper to suppress Jekyll output during tests
    def suppress_output
      original_stdout = $stdout
      original_stderr = $stderr
      $stdout = StringIO.new
      $stderr = StringIO.new
      
      yield
      
      ensure
        $stdout = original_stdout
        $stderr = original_stderr
    end
  end)
end