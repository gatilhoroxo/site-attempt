#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

class FrontmatterValidator {
  constructor(siteRoot) {
    this.siteRoot = siteRoot;
    this.errors = [];
    this.warnings = [];
    this.config = this.loadValidationConfig();
  }

  loadValidationConfig() {
    try {
      const configPath = path.join(this.siteRoot, 'tests', 'validation', 'validation_config.yml');
      const configContent = fs.readFileSync(configPath, 'utf8');
      return yaml.parse(configContent);
    } catch (error) {
      this.addError(`Failed to load validation config: ${error.message}`);
      return {};
    }
  }

  async validateAll() {
    console.log('🔍 Starting frontmatter validation...');
    
    await this.validateContentFiles();
    await this.validateProjectFiles();
    await this.validatePostFiles();
    
    this.reportResults();
    
    return this.errors.length === 0;
  }

  async validateContentFiles() {
    console.log('  📝 Validating content files...');
    
    const contentDir = path.join(this.siteRoot, 'content');
    await this.validateDirectory(contentDir, 'content');
  }

  async validateProjectFiles() {
    console.log('  🚀 Validating project files...');
    
    const projectsDir = path.join(this.siteRoot, 'content', 'projects');
    await this.validateDirectory(projectsDir, 'projects');
  }

  async validatePostFiles() {
    console.log('  📄 Validating post files...');
    
    const postsDir = path.join(this.siteRoot, 'content', 'posts');
    await this.validateDirectory(postsDir, 'posts');
  }

  async validateDirectory(dirPath, context) {
    if (!fs.existsSync(dirPath)) {
      this.addWarning(`Directory not found: ${dirPath}`);
      return;
    }

    const files = this.getAllMarkdownFiles(dirPath);
    
    for (const file of files) {
      await this.validateFile(file, context);
    }
  }

  getAllMarkdownFiles(dirPath) {
    const files = [];
    
    const scanDirectory = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanDirectory(itemPath);
        } else if (item.endsWith('.md')) {
          files.push(itemPath);
        }
      }
    };
    
    scanDirectory(dirPath);
    return files;
  }

  async validateFile(filePath, context) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(this.siteRoot, filePath);
      
      // Check if file has frontmatter
      if (!content.startsWith('---')) {
        this.addError(`${relativePath}: Missing frontmatter`);
        return;
      }

      const frontmatter = this.extractFrontmatter(content);
      if (!frontmatter) {
        this.addError(`${relativePath}: Invalid frontmatter format`);
        return;
      }

      // Validate based on file type and layout
      this.validateFileStructure(relativePath, frontmatter, context);
      this.validateRequiredFields(relativePath, frontmatter);
      this.validateFieldFormats(relativePath, frontmatter);
      
    } catch (error) {
      this.addError(`${filePath}: Failed to validate - ${error.message}`);
    }
  }

  extractFrontmatter(content) {
    const parts = content.split('---');
    
    if (parts.length < 3) {
      return null;
    }

    try {
      return yaml.parse(parts[1]);
    } catch (error) {
      return null;
    }
  }

  validateFileStructure(filePath, frontmatter, context) {
    const fileName = path.basename(filePath);
    const isIndex = fileName === 'index.md';
    const isInProjects = filePath.includes('projects');
    const isInPosts = filePath.includes('posts');
    
    // Validate layout based on file location
    if (isIndex && !frontmatter.layout) {
      this.addError(`${filePath}: Index files should have a layout`);
    }
    
    if (isIndex && frontmatter.layout !== 'pasta') {
      this.addWarning(`${filePath}: Index files should use 'pasta' layout`);
    }
    
    if (!isIndex && frontmatter.layout === 'pasta') {
      this.addWarning(`${filePath}: 'pasta' layout should only be used for index files`);
    }
    
    // Validate project-specific requirements
    if (isInProjects && !isIndex) {
      // Project files should have specific layouts
      const validProjectLayouts = ['default', 'post', 'diario', 'gatilho'];
      if (frontmatter.layout && !validProjectLayouts.includes(frontmatter.layout)) {
        this.addWarning(`${filePath}: Project files should use standard layouts`);
      }
    }
    
    // Validate post-specific requirements
    if (isInPosts && !isIndex) {
      if (frontmatter.layout !== 'post' && frontmatter.layout !== 'default') {
        this.addWarning(`${filePath}: Post files should use 'post' or 'default' layout`);
      }
    }
  }

  validateRequiredFields(filePath, frontmatter) {
    const layout = frontmatter.layout || 'default';
    const schema = this.config.frontmatter_schema || {};
    const layoutSchema = schema[`${layout}_layout`] || schema['default_layout'];
    
    if (!layoutSchema) {
      return;
    }

    const requiredFields = layoutSchema.required_fields || [];
    
    for (const field of requiredFields) {
      if (!frontmatter.hasOwnProperty(field)) {
        this.addError(`${filePath}: Missing required field '${field}'`);
      } else if (this.isEmpty(frontmatter[field])) {
        this.addError(`${filePath}: Required field '${field}' is empty`);
      }
    }

    // Validate layout exists
    if (frontmatter.layout) {
      this.validateLayoutExists(filePath, frontmatter.layout);
    }
  }

  validateLayoutExists(filePath, layout) {
    // Check in src/_layouts as per Jekyll config
    const layoutPath = path.join(this.siteRoot, 'src', '_layouts', `${layout}.html`);
    
    if (!fs.existsSync(layoutPath)) {
      this.addError(`${filePath}: References non-existent layout '${layout}'`);
    }
  }

  validateFieldFormats(filePath, frontmatter) {
    // Validate date format
    if (frontmatter.date) {
      if (!this.isValidDate(frontmatter.date)) {
        this.addError(`${filePath}: Invalid date format '${frontmatter.date}'`);
      }
    }

    // Validate title format
    if (frontmatter.title) {
      if (typeof frontmatter.title !== 'string') {
        this.addError(`${filePath}: Title should be a string`);
      } else if (frontmatter.title.length > 200) {
        this.addWarning(`${filePath}: Title is very long (${frontmatter.title.length} chars)`);
      }
    }

    // Validate description format
    if (frontmatter.description) {
      if (typeof frontmatter.description !== 'string') {
        this.addError(`${filePath}: Description should be a string`);
      } else if (frontmatter.description.length > 500) {
        this.addWarning(`${filePath}: Description is very long (${frontmatter.description.length} chars)`);
      }
    }

    // Validate tags format
    if (frontmatter.tags) {
      if (!Array.isArray(frontmatter.tags)) {
        this.addError(`${filePath}: Tags should be an array`);
      } else {
        for (const [index, tag] of frontmatter.tags.entries()) {
          if (typeof tag !== 'string') {
            this.addError(`${filePath}: Tag ${index} should be a string`);
          }
        }
      }
    }

    // Validate categories format
    if (frontmatter.categories) {
      if (!Array.isArray(frontmatter.categories)) {
        this.addError(`${filePath}: Categories should be an array`);
      }
    }

    // Validate author format
    if (frontmatter.author && typeof frontmatter.author !== 'string') {
      this.addError(`${filePath}: Author should be a string`);
    }

    // Validate boolean fields
    const booleanFields = ['published', 'featured', 'sticky'];
    for (const field of booleanFields) {
      if (frontmatter.hasOwnProperty(field) && typeof frontmatter[field] !== 'boolean') {
        this.addWarning(`${filePath}: ${field} should be true/false`);
      }
    }
  }

  isValidDate(dateString) {
    try {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date) && date.toISOString().startsWith(dateString.substring(0, 10));
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
    console.log('\n📊 Frontmatter Validation Results:');
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
      console.log('  ✅ All frontmatter validations passed!');
    }
  }
}

// Main execution
if (require.main === module) {
  const siteRoot = process.argv[2] || process.cwd();
  const validator = new FrontmatterValidator(siteRoot);
  
  validator.validateAll().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error(`Validation failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { FrontmatterValidator };