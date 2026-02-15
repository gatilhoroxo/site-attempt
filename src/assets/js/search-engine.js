// Search Engine - Handles search functionality
export class SearchEngine {
  constructor(searchIndexUrl = '/assets/json/search-index.json') {
    this.searchIndex = [];
    this.searchIndexUrl = searchIndexUrl;
    this.searchInput = null;
    this.searchResults = null;
    this.searchTimeout = null;
    this.debounceDelay = 300;
  }

  async init() {
    this.searchInput = document.getElementById('search-input');
    this.searchResults = document.getElementById('search-results');
    
    if (!this.searchInput || !this.searchResults) {
      console.error('Search elements not found');
      return false;
    }
    
    // Initialize with placeholder to ensure container is visible
    this.searchResults.innerHTML = '<div class="search-placeholder">Digite pelo menos 2 caracteres para buscar</div>';
    
    // Load search index
    await this.loadSearchIndex();
    
    // Setup event listeners
    this.setupSearchListeners();
    
    return true;
  }

  async loadSearchIndex() {
    try {
      const response = await fetch(this.searchIndexUrl);
      this.searchIndex = await response.json();
      console.log(`Search index loaded: ${this.searchIndex.length} pages`);
      return true;
    } catch (error) {
      console.error('Error loading search index:', error);
      this.searchIndex = [];
      return false;
    }
  }

  setupSearchListeners() {
    if (!this.searchInput) return;

    // Search as you type (with debounce)
    this.searchInput.addEventListener('input', (e) => {
      this.debouncedSearch(e.target.value);
    });

    // Close search on ESC
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.clearSearch();
        if (window.SidebarStateManager) {
          window.SidebarStateManager.closeSidebar();
        }
      }
    });
  }

  debouncedSearch(query) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.performSearch(query);
    }, this.debounceDelay);
  }

  performSearch(query) {
    if (!query || query.trim().length < 2) {
      // For empty/short queries, show placeholder instead of empty container
      if (this.searchResults) {
        this.searchResults.innerHTML = '<div class="search-placeholder">Digite pelo menos 2 caracteres para buscar</div>';
      }
      return [];
    }

    const queryLower = query.toLowerCase().trim();
    const results = [];

    // Search through all index items
    this.searchIndex.forEach(item => {
      let score = 0;
      let excerpt = '';

      // Search in title
      if (item.title && item.title.toLowerCase().includes(queryLower)) {
        score += 10;
      }

      // Search in content
      if (item.content) {
        const contentLower = item.content.toLowerCase();
        const index = contentLower.indexOf(queryLower);
        
        if (index !== -1) {
          score += 5;
          
          // Extract content excerpt
          const start = Math.max(0, index - 40);
          const end = Math.min(item.content.length, index + queryLower.length + 40);
          excerpt = item.content.substring(start, end);
          
          // Add ellipsis if needed
          if (start > 0) excerpt = '...' + excerpt;
          if (end < item.content.length) excerpt = excerpt + '...';
        }
      }

      // Search in URL path
      if (item.url && item.url.toLowerCase().includes(queryLower)) {
        score += 2;
      }

      if (score > 0) {
        results.push({ ...item, score, excerpt });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.score - a.score);

    // Limit to 10 results
    const topResults = results.slice(0, 10);

    this.displayResults(topResults, queryLower);
    return topResults;
  }

  displayResults(results, query) {
    if (!this.searchResults) return;

    if (results.length === 0) {
      this.searchResults.innerHTML = '<div class="search-no-results">Nenhum resultado encontrado</div>';
      return;
    }

    let html = '';
    results.forEach(result => {
      const title = this.highlightText(result.title || 'Sem título', query);
      const path = result.url || '';
      const excerpt = result.excerpt ? this.highlightText(result.excerpt, query) : '';

      html += `
        <div class="search-result-item" data-search-result data-url="${path}">
          <div class="search-result-title">${title}</div>
          <div class="search-result-path">${path}</div>
          ${excerpt ? `<div class="search-result-excerpt">${excerpt}</div>` : ''}
        </div>
      `;
    });

    this.searchResults.innerHTML = html;
    this.setupResultListeners();
  }

  setupResultListeners() {
    if (!this.searchResults) return;

    document.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const url = e.currentTarget.getAttribute('data-url');
        if (url) {
          this.navigateToResult(url);
        }
      });
    });
  }

  navigateToResult(url) {
    // Close sidebar before navigating
    if (window.SidebarStateManager) {
      window.SidebarStateManager.closeSidebar();
    }
    window.location.href = url;
  }

  highlightText(text, query) {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  clearResults() {
    if (this.searchResults) {
      this.searchResults.innerHTML = '';
    }
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.clearResults();
  }

  focusSearchInput() {
    if (this.searchInput) {
      setTimeout(() => this.searchInput.focus(), 100);
    }
  }

  getSearchIndex() {
    return this.searchIndex;
  }

  getLastQuery() {
    return this.searchInput ? this.searchInput.value : '';
  }

  static create(searchIndexUrl) {
    return new SearchEngine(searchIndexUrl);
  }
}

// Register with sidebar state manager when available
function registerSearchState() {
  if (!window.SidebarStateManager) {
    setTimeout(registerSearchState, 50);
    return;
  }
  
  const searchMode = document.getElementById('search-mode');
  const searchToggle = document.getElementById('search-toggle');
  
  if (!searchMode || !searchToggle) {
    console.error('Search elements not found');
    return;
  }

  // Get search index URL from data attribute or use default
  const searchIndexUrl = searchMode.dataset.searchIndexUrl || '/assets/json/search-index.json';
  const searchEngine = SearchEngine.create(searchIndexUrl);
  
  // Register search state
  window.SidebarStateManager.registerState('search', {
    element: searchMode,
    button: searchToggle,
    onActivate: function() {
      searchEngine.init().then(() => {
        searchEngine.focusSearchInput();
      });
    },
    onDeactivate: function() {
      // Don't clear search on deactivate to preserve state during navigation
      // searchEngine.clearSearch();
    }
  });
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerSearchState);
} else {
  registerSearchState();
}