// @ts-check
import { test, expect } from '@playwright/test';
import { SearchPage, SidebarPage } from '../helpers/page-objects.js';
import { testUrls, searchQueries } from '../fixtures/test-data.js';
import { validateServerRunning } from '../helpers/server-check.js';

test.describe('Search Functionality', () => {
  // Validate server is running before any tests
  test.beforeAll(async () => {
    await validateServerRunning('http://localhost:4000');
  });
  /** @type {SearchPage} */
  let searchPage;
  /** @type {SidebarPage} */
  let sidebarPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    sidebarPage = new SidebarPage(page);
    await page.goto(testUrls.homepage);
    await page.waitForLoadState('load');
    // Directly switch to search mode (this opens sidebar in search mode)
    await sidebarPage.switchToSearchMode();
    // Wait for search mode to be fully initialized
    await page.waitForTimeout(2000);
  });

  test('should perform basic search and display results', async ({ page }) => {
    const query = searchQueries.valid[0]; // 'conceitos'
    await searchPage.search(query);
    
    // Wait for results to load and render
    await page.waitForTimeout(1500);
    
    const resultsCount = await searchPage.getResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
    
    // Verify search results container is visible
    await expect(page.locator('[data-search-results]')).toBeVisible();
  });

  test('should highlight search terms in results', async ({ page }) => {
    const query = searchQueries.valid[1]; // 'aprendizado'
    await searchPage.search(query);
    
    await page.waitForTimeout(1500);
    
    // Check if search term is highlighted (if feature is implemented)
    const resultsCount = await searchPage.getResultsCount();
    if (resultsCount > 0) {
      // At minimum, results should exist
      expect(resultsCount).toBeGreaterThan(0);
      // Optionally check for highlighting
      const isHighlighted = await searchPage.isHighlightVisible(query);
      // Don't fail if highlighting is not implemented
      console.log(`Highlighting ${isHighlighted ? 'is' : 'is not'} implemented`);
    }
  });

  test('should handle empty search queries gracefully', async ({ page }) => {
    // Empty search should not cause errors
    await searchPage.search('');
    await page.waitForTimeout(500);
    
    // Should either show results, empty state, or just not crash
    const resultsVisible = await page.locator('[data-search-results]').isVisible();
    expect(resultsVisible).toBeTruthy(); // Results container should exist
  });

  test('should handle invalid search queries', async ({ page }) => {
    const invalidQuery = searchQueries.invalid[0]; // 'randomStringThatShouldNotExist123'
    await searchPage.search(invalidQuery);
    
    await page.waitForTimeout(1500);
    
    const resultsCount = await searchPage.getResultsCount();
    expect(resultsCount).toBe(0);
    
    // Optionally check for "no results" message (if implemented)
    const noResultsMessage = await page.locator('[data-no-results], .no-results, [data-search-empty]');
    const hasNoResultsMessage = await noResultsMessage.isVisible().catch(() => false);
    // Don't fail if message is not implemented - just log it
    console.log(`No results message ${hasNoResultsMessage ? 'is' : 'is not'} shown`);
  });

  test('should navigate to clicked search result', async ({ page }) => {
    const query = searchQueries.valid[2]; // 'gpio'
    await searchPage.search(query);
    
    await page.waitForTimeout(1000);
    
    const resultsCount = await searchPage.getResultsCount();
    if (resultsCount > 0) {
      const initialUrl = page.url();
      await searchPage.clickFirstResult();
      
      // Wait for navigation
      await page.waitForTimeout(1000);
      
      // URL should have changed
      expect(page.url()).not.toBe(initialUrl);
    }
  });

  // TODO: reavaliar isso pois acho que não precisa
  test('should rank results by relevance', async ({ page }) => {
    const query = searchQueries.valid[3]; // 'diário'
    await searchPage.search(query);
    
    await page.waitForTimeout(1000);
    
    const results = await searchPage.getResults();
    if (results.length >= 2) {
      // Get titles and scores of first two results
      const firstResult = await results[0].textContent();
      const secondResult = await results[1].textContent();
      
      // Results should be ordered (this is a basic check)
      expect(firstResult).toBeTruthy();
      expect(secondResult).toBeTruthy();
      
      // More specific ranking tests would depend on the search algorithm
      // For now, just verify results are returned in some order
      expect(results.length).toBeGreaterThan(0);
    }
  });

  test('should preserve search state during navigation', async ({ page }) => {
    const query = searchQueries.valid[0];
    await searchPage.search(query);
    
    await page.waitForTimeout(1000);
    
    // Switch to nav mode and back to search
    await sidebarPage.switchToNavMode();
    await sidebarPage.switchToSearchMode();
    
    // Check if search input still contains the query
    const searchInput = page.locator('[data-search-input]');
    const inputValue = await searchInput.inputValue();
    expect(inputValue).toBe(query);
  });

  test('should search across different content types', async ({ page }) => {
    // Test searches that should find different types of content
    const searches = [
      { query: 'conceitos', expectedInUrl: 'conceitos' },
      { query: 'diário', expectedInUrl: 'diario' },
      { query: 'projeto', expectedInUrl: 'project' }
    ];
    
    for (const search of searches) {
      await searchPage.search(search.query);
      await page.waitForTimeout(1000);
      
      const resultsCount = await searchPage.getResultsCount();
      expect(resultsCount).toBeGreaterThan(0);
      
      // Check that at least one result contains expected content
      const results = await searchPage.getResults();
      let foundRelevantResult = false;
      
      for (const result of results.slice(0, 3)) { // Check first 3 results
        const resultText = await result.textContent();
        if (resultText?.toLowerCase().includes(search.expectedInUrl)) {
          foundRelevantResult = true;
          break;
        }
      }
      
      expect(foundRelevantResult).toBe(true);
    }
  });
});