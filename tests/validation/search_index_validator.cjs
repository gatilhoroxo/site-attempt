#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SearchIndexValidator {
  constructor(siteRoot) {
    this.siteRoot = siteRoot;
    this.errors = [];
    this.warnings = [];
    this.siteUrl = '';
  }

  async validateAll() {
    console.log('🔍 Starting search index validation...');
    
    await this.validateSearchIndex();
    await this.validateSearchFunctionality();
    
    this.reportResults();
    
    return this.errors.length === 0;
  }

  async validateSearchIndex() {
    console.log('  📋 Validating search index structure...');
    
    const searchIndexPath = path.join(this.siteRoot, '_site', 'assets', 'json', 'search-index.json');
    
    if (!fs.existsSync(searchIndexPath)) {
      this.addError('Search index file not found. Site needs to be built first.');
      return;
    }

    try {
      const indexContent = fs.readFileSync(searchIndexPath, 'utf8');
      const searchIndex = JSON.parse(indexContent);
      
      if (!Array.isArray(searchIndex)) {
        this.addError('Search index should be a JSON array');
        return;
      }

      console.log(`  Found ${searchIndex.length} entries in search index`);
      
      // Validate each entry
      this.validateSearchEntries(searchIndex);
      
      // Validate content coverage
      this.validateContentCoverage(searchIndex);
      
    } catch (error) {
      this.addError(`Failed to parse search index: ${error.message}`);
    }
  }

  validateSearchEntries(searchIndex) {
    const requiredFields = ['title', 'url'];
    const optionalFields = ['content', 'date', 'categories', 'tags', 'layout', 'excerpt'];
    
    searchIndex.forEach((entry, index) => {
      // Check required fields
      requiredFields.forEach(field => {
        if (!entry.hasOwnProperty(field)) {
          this.addError(`Search index entry ${index}: Missing required field '${field}'`);
        } else if (this.isEmpty(entry[field])) {
          this.addError(`Search index entry ${index}: Required field '${field}' is empty`);
        }
      });

      // Validate field formats
      this.validateEntryFields(entry, index);
      
      // Check content size
      if (entry.content && entry.content.length > 10000) {
        this.addWarning(`Search index entry ${index}: Content is very large (${entry.content.length} chars)`);
      }

      // Validate URL format
      if (entry.url && !entry.url.startsWith('/')) {
        this.addWarning(`Search index entry ${index}: URL should start with '/' (${entry.url})`);
      }
    });
  }

  validateEntryFields(entry, index) {
    // Validate title
    if (entry.title) {
      if (typeof entry.title !== 'string') {
        this.addError(`Search index entry ${index}: Title should be a string`);
      } else if (entry.title.length === 0) {
        this.addError(`Search index entry ${index}: Title cannot be empty`);
      } else if (entry.title.length > 200) {
        this.addWarning(`Search index entry ${index}: Title is very long (${entry.title.length} chars)`);
      }
    }

    // Validate URL
    if (entry.url) {
      if (typeof entry.url !== 'string') {
        this.addError(`Search index entry ${index}: URL should be a string`);
      } else if (!entry.url.startsWith('/')) {
        this.addWarning(`Search index entry ${index}: URL should be relative path starting with '/'`);
      }
    }

    // Validate content
    if (entry.content) {
      if (typeof entry.content !== 'string') {
        this.addError(`Search index entry ${index}: Content should be a string`);
      } else {
        // Check for HTML tags in content - should be plain text
        if (entry.content.includes('<') && entry.content.includes('>')) {
          this.addWarning(`Search index entry ${index}: Content contains HTML tags - should be plain text`);
        }
        
        // Check content quality
        if (entry.content.length < 10) {
          this.addWarning(`Search index entry ${index}: Content is very short`);
        }
      }
    }

    // Validate date format
    if (entry.date && !this.isValidDate(entry.date)) {
      this.addError(`Search index entry ${index}: Invalid date format '${entry.date}'`);
    }

    // Validate categories
    if (entry.categories && !Array.isArray(entry.categories)) {
      this.addError(`Search index entry ${index}: Categories should be an array`);
    }

    // Validate tags
    if (entry.tags && !Array.isArray(entry.tags)) {
      this.addError(`Search index entry ${index}: Tags should be an array`);
    }
  }

  validateContentCoverage(searchIndex) {
    console.log('  📈 Validating content coverage...');
    
    const indexedUrls = new Set(searchIndex.map(entry => entry.url));
    
    // Check for expected pages
    const expectedPages = [
      '/site-attempt/',
      '/site-attempt/content/',
      '/site-attempt/content/posts/',
      '/site-attempt/content/projects/',
      '/site-attempt/content/gatilhos/'
    ];

    expectedPages.forEach(page => {
      if (!indexedUrls.has(page)) {
        this.addWarning(`Expected page not found in search index: ${page}`);
      }
    });

    // Analyze content distribution
    this.analyzeContentDistribution(searchIndex);
  }

  analyzeContentDistribution(searchIndex) {
    const layoutCounts = {};
    const categoryCounts = {};
    const tagCounts = {};

    searchIndex.forEach(entry => {
      // Count layouts
      const layout = entry.layout || 'unknown';
      layoutCounts[layout] = (layoutCounts[layout] || 0) + 1;

      // Count categories
      if (entry.categories) {
        entry.categories.forEach(category => {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
      }

      // Count tags
      if (entry.tags) {
        entry.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    console.log('  📊 Content distribution:');
    console.log(`    Layouts: ${Object.keys(layoutCounts).join(', ')}`);
    console.log(`    Categories: ${Object.keys(categoryCounts).length} unique`);
    console.log(`    Tags: ${Object.keys(tagCounts).length} unique`);

    // Check for missing content types
    if (!layoutCounts.pasta) {
      this.addWarning('No "pasta" layout pages found in search index');
    }

    if (!layoutCounts.post && !layoutCounts.default) {
      this.addWarning('No post or default layout pages found in search index');
    }
  }

  async validateSearchFunctionality() {
    console.log('  🔍 Validating search functionality...');
    
    // Check if search JavaScript exists
    const searchJsPath = path.join(this.siteRoot, 'src', 'assets', 'js', 'search-engine.js');
    
    if (!fs.existsSync(searchJsPath)) {
      this.addError('Search JavaScript module not found');
      return;
    }

    try {
      const searchJs = fs.readFileSync(searchJsPath, 'utf8');
      
      // Check for essential search functionality
      const requiredFunctions = [
        'loadSearchIndex',
        'performSearch',
        'displayResults',
        'highlightText'
      ];

      requiredFunctions.forEach(func => {
        if (!searchJs.includes(func)) {
          this.addWarning(`Search JavaScript missing function: ${func}`);
        }
      });

      // Check for search index loading
      if (!searchJs.includes('search-index.json')) {
        this.addError('Search JavaScript does not reference search-index.json');
      }

      // Check for search input handling
      if (!searchJs.includes('input') || !searchJs.includes('addEventListener')) {
        this.addWarning('Search JavaScript may not handle input events properly');
      }

    } catch (error) {
      this.addError(`Failed to validate search JavaScript: ${error.message}`);
    }
  }

  isValidDate(dateString) {
    try {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date);
    } catch {
      return false;
    }
  }

  isEmpty(value) {
    return value === null || value === undefined || 
           (typeof value === 'string' && value.trim() === '') ||
           (Array.isArray(value) && value.length === 0);
  }

  addError(message) {
    this.errors.push(message);
    console.log(`    ❌ ERROR: ${message}`);
  }

  addWarning(message) {
    this.warnings.push(message);
    console.log(`    ⚠️  WARNING: ${message}`);
  }

  reportResults() {
    console.log('\n📊 Search Index Validation Results:');
    console.log(`  Errors: ${this.errors.length}`);
    console.log(`  Warnings: ${this.warnings.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors found:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('  ✅ All search index validations passed!');
    }
  }
}

// Main execution
if (require.main === module) {
  const siteRoot = process.argv[2] || process.cwd();
  const validator = new SearchIndexValidator(siteRoot);
  
  validator.validateAll().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error(`Validation failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { SearchIndexValidator };