// Search Engine Tests
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SearchEngine } from '@/search-engine.js'

describe('SearchEngine', () => {
  let searchEngine
  let mockSearchInput
  let mockSearchResults
  let mockSearchIndex

  beforeEach(() => {
    // Setup DOM
    mockSearchInput = document.createElement('input')
    mockSearchInput.id = 'search-input'
    mockSearchResults = document.createElement('div')
    mockSearchResults.id = 'search-results'
    
    document.body.appendChild(mockSearchInput)
    document.body.appendChild(mockSearchResults)
    
    // Mock search index data
    mockSearchIndex = [
      {
        title: 'Introduction to Programming',
        content: 'This is a basic introduction to programming concepts and principles.',
        url: '/posts/intro-programming'
      },
      {
        title: 'Advanced JavaScript Concepts',
        content: 'Learn about closures, prototypes, and asynchronous programming in JavaScript.',
        url: '/posts/advanced-js'
      },
      {
        title: 'CSS Grid Layout',
        content: 'Master CSS Grid for modern web layouts and responsive design.',
        url: '/posts/css-grid'
      },
      {
        title: 'Python Data Analysis',
        content: 'Analyze data using Python libraries like pandas and numpy.',
        url: '/posts/python-data'
      }
    ]
    
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockSearchIndex)
    })
    
    // Create search engine instance
    searchEngine = new SearchEngine('/mock-search-index.json')
  })

  describe('initialization', () => {
    it('should initialize successfully with valid DOM elements', async () => {
      const result = await searchEngine.init()
      
      expect(result).toBe(true)
      expect(searchEngine.searchInput).toBe(mockSearchInput)
      expect(searchEngine.searchResults).toBe(mockSearchResults)
    })

    it('should fail initialization with missing DOM elements', async () => {
      mockSearchInput.remove()
      const result = await searchEngine.init()
      
      expect(result).toBe(false)
    })

    it('should load search index from URL', async () => {
      await searchEngine.loadSearchIndex()
      
      expect(global.fetch).toHaveBeenCalledWith('/mock-search-index.json')
      expect(searchEngine.getSearchIndex()).toEqual(mockSearchIndex)
    })

    it('should handle fetch errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))
      
      await searchEngine.init()
      
      expect(searchEngine.getSearchIndex()).toEqual([])
    })
  })

  describe('search functionality', () => {
    beforeEach(async () => {
      await searchEngine.init()
    })

    it('should perform basic search and return results', () => {
      const results = searchEngine.performSearch('programming')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].title).toContain('Programming')
      expect(results[0].score).toBeGreaterThan(0)
    })

    it('should return no results for empty query', () => {
      const results = searchEngine.performSearch('')
      
      expect(results).toEqual([])
      expect(mockSearchResults.innerHTML).toContain('Digite pelo menos 2 caracteres para buscar')
    })

    it('should return no results for short query', () => {
      const results = searchEngine.performSearch('a')
      
      expect(results).toEqual([])
    })

    it('should prioritize title matches over content matches', () => {
      const results = searchEngine.performSearch('javascript')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].title).toContain('JavaScript')
      expect(results[0].score).toBeGreaterThanOrEqual(10) // Title match score (may also match content)
    })

    it('should find content matches', () => {
      const results = searchEngine.performSearch('closures')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].content).toContain('closures')
      expect(results[0].score).toBe(5) // Content match score
    })

    it('should find URL path matches', () => {
      const results = searchEngine.performSearch('css-grid')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].url).toContain('css-grid')
      expect(results[0].score).toBe(2) // URL match score
    })

    it('should sort results by relevance score', () => {
      // Search for term that appears in both title and content of different items
      const results = searchEngine.performSearch('python')
      
      if (results.length > 1) {
        expect(results[0].score).toBeGreaterThanOrEqual(results[1].score)
      }
    })

    it('should limit results to 10 items', () => {
      // Mock a large search index
      const largeIndex = Array.from({ length: 20 }, (_, i) => ({
        title: `Test Item ${i}`,
        content: 'This is a test item for search testing.',
        url: `/test-item-${i}`
      }))
      searchEngine.searchIndex = largeIndex
      
      const results = searchEngine.performSearch('test')
      
      expect(results.length).toBeLessThanOrEqual(10)
    })
  })

  describe('search results display', () => {
    beforeEach(async () => {
      await searchEngine.init()
    })

    it('should display search results in DOM', () => {
      searchEngine.performSearch('programming')
      
      expect(mockSearchResults.innerHTML).toContain('search-result-item')
      expect(mockSearchResults.innerHTML).toContain('Programming')
    })

    it('should display no results message', () => {
      searchEngine.performSearch('nonexistentterm12345')
      
      expect(mockSearchResults.innerHTML).toContain('Nenhum resultado encontrado')
    })

    it('should highlight search terms in results', () => {
      searchEngine.displayResults([{
        title: 'JavaScript Programming',
        content: 'Learn JavaScript fundamentals',
        url: '/test',
        excerpt: 'Learn JavaScript fundamentals'
      }], 'javascript')
      
      expect(mockSearchResults.innerHTML).toContain('<mark>JavaScript</mark>')
    })

    it('should handle results without title', () => {
      searchEngine.displayResults([{
        title: '',
        content: 'Content without title',
        url: '/test',
        excerpt: 'Content without title'
      }], 'content')
      
      expect(mockSearchResults.innerHTML).toContain('Sem título')
    })
  })

  describe('text highlighting', () => {
    it('should highlight single word', () => {
      const result = searchEngine.highlightText('JavaScript is awesome', 'JavaScript')
      
      expect(result).toBe('<mark>JavaScript</mark> is awesome')
    })

    it('should be case insensitive', () => {
      const result = searchEngine.highlightText('JavaScript is awesome', 'javascript')
      
      expect(result).toBe('<mark>JavaScript</mark> is awesome')
    })

    it('should handle multiple occurrences', () => {
      const result = searchEngine.highlightText('JavaScript and JavaScript', 'JavaScript')
      
      expect(result).toBe('<mark>JavaScript</mark> and <mark>JavaScript</mark>')
    })

    it('should handle empty or null text', () => {
      expect(searchEngine.highlightText('', 'test')).toBe('')
      expect(searchEngine.highlightText('text', '')).toBe('text')
      expect(searchEngine.highlightText(null, 'test')).toBeNull()
    })
  })

  describe('regex escaping', () => {
    it('should escape special regex characters', () => {
      const escaped = searchEngine.escapeRegex('test.with*special+chars?')
      
      expect(escaped).toBe('test\\.with\\*special\\+chars\\?')
    })

    it('should escape all special characters', () => {
      const special = '.*+?^${}()|[]\\';
      const escaped = searchEngine.escapeRegex(special);
      
      expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    })
  })

  describe('search interaction', () => {
    beforeEach(async () => {
      await searchEngine.init()
    })

    it('should trigger search on input with debounce', async () => {
      const spy = vi.spyOn(searchEngine, 'performSearch')
      
      mockSearchInput.value = 'test'
      mockSearchInput.dispatchEvent(new Event('input'))
      
      // Should not be called immediately
      expect(spy).not.toHaveBeenCalled()
      
      // Fast forward timers
      vi.advanceTimersByTime(300)
      
      expect(spy).toHaveBeenCalledWith('test')
    })

    it('should clear search on ESC key', async () => {
      mockSearchInput.value = 'test search'
      searchEngine.performSearch('test')
      
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      mockSearchInput.dispatchEvent(escEvent)
      
      expect(mockSearchInput.value).toBe('')
      expect(mockSearchResults.innerHTML).toBe('')
    })
  })

  describe('result navigation', () => {
    beforeEach(async () => {
      await searchEngine.init()
      
      // Mock window.location
      delete window.location
      window.location = { href: '' }
      
      // Mock SidebarStateManager
      window.SidebarStateManager = {
        closeSidebar: vi.fn()
      }
    })

    it('should navigate to result when clicked', () => {
      searchEngine.displayResults([{
        title: 'Test Result',
        content: 'Test content',
        url: '/test-page',
        excerpt: 'Test content'
      }], 'test')
      
      const resultItem = mockSearchResults.querySelector('.search-result-item')
      resultItem.click()
      
      expect(window.location.href).toBe('/test-page')
      expect(window.SidebarStateManager.closeSidebar).toHaveBeenCalled()
    })
  })

  describe('utility methods', () => {
    beforeEach(async () => {
      await searchEngine.init()
    })

    it('should clear results', () => {
      mockSearchResults.innerHTML = 'Some content'
      searchEngine.clearResults()
      
      expect(mockSearchResults.innerHTML).toBe('')
    })

    it('should clear search input and results', () => {
      mockSearchInput.value = 'test'
      mockSearchResults.innerHTML = 'Some results'
      
      searchEngine.clearSearch()
      
      expect(mockSearchInput.value).toBe('')
      expect(mockSearchResults.innerHTML).toBe('')
    })

    it('should focus search input with delay', () => {
      const focusSpy = vi.spyOn(mockSearchInput, 'focus')
      
      searchEngine.focusSearchInput()
      
      vi.advanceTimersByTime(100)
      expect(focusSpy).toHaveBeenCalled()
    })

    it('should return last query', () => {
      mockSearchInput.value = 'last query'
      
      expect(searchEngine.getLastQuery()).toBe('last query')
    })
  })

  describe('static factory method', () => {
    it('should create new instance with custom URL', () => {
      const engine = SearchEngine.create('/custom-index.json')
      
      expect(engine).toBeInstanceOf(SearchEngine)
      expect(engine.searchIndexUrl).toBe('/custom-index.json')
    })
  })

  describe('excerpt generation', () => {
    beforeEach(async () => {
      await searchEngine.init()
    })

    it('should generate excerpt around search term', () => {
      // Mock item with long content
      searchEngine.searchIndex = [{
        title: 'Long Article',
        content: 'This is a very long article about programming. It contains many words and concepts. The main topic is JavaScript programming which is very important for web development. It also covers HTML and CSS topics.',
        url: '/long-article'
      }]
      
      const results = searchEngine.performSearch('JavaScript')
      
      expect(results[0].excerpt).toContain('JavaScript')
      expect(results[0].excerpt.length).toBeLessThan(200) // Should be truncated
      expect(results[0].excerpt).toMatch(/\.\.\..*JavaScript.*\.\.\./)
    })
  })
})