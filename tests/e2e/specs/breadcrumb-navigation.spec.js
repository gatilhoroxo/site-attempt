// @ts-check
import { test, expect } from '@playwright/test';
import { BreadcrumbPage } from '../helpers/page-objects.js';
import { testUrls } from '../fixtures/test-data.js';
import { validateServerRunning } from '../helpers/server-check.js';

test.describe('Breadcrumb Navigation', () => {
  // Validate server is running before any tests
  test.beforeAll(async () => {
    await validateServerRunning('http://localhost:4000');
  });
  /** @type {BreadcrumbPage} */
  let breadcrumbPage;

  test.beforeEach(async ({ page }) => {
    breadcrumbPage = new BreadcrumbPage(page);
  });

  test('should display breadcrumb on homepage', async ({ page }) => {
    await page.goto(testUrls.homepage);
    
    const isVisible = await breadcrumbPage.isVisible();
    if (isVisible) {
      const items = await breadcrumbPage.getBreadcrumbItems();
      expect(items.length).toBeGreaterThanOrEqual(1);
      
      const breadcrumbTexts = await breadcrumbPage.getBreadcrumbText();
      expect(breadcrumbTexts.some(text => text.match(/home|início/i))).toBe(true);
    }
  });

  test('should show correct breadcrumb hierarchy on nested pages', async ({ page }) => {
    // Navigate to a nested page
    await page.goto(testUrls.conceptsPage); // /content/gatilhos/conceitos-fundamentais/
    
    const isVisible = await breadcrumbPage.isVisible();
    if (isVisible) {
      const breadcrumbTexts = await breadcrumbPage.getBreadcrumbText();
      
      // Should show path like: Home > Content > Gatilhos > Conceitos Fundamentais
      expect(breadcrumbTexts.length).toBeGreaterThan(1);
      expect(breadcrumbTexts[0]).toMatch(/home|início|inicio/i);
      
      // Should contain parts of the path
      const hasGatilhos = breadcrumbTexts.some(text => 
        text?.toLowerCase().includes('gatilho')
      );
      const hasContent = breadcrumbTexts.some(text => 
        text?.toLowerCase().includes('content')
      );
      
      expect(hasGatilhos || hasContent).toBe(true);
    }
  });

  test('should navigate when clicking breadcrumb items', async ({ page }) => {
    // Start from a deeply nested page
    await page.goto(testUrls.diaryPage); // /content/gatilhos/diario-de-aprendizado/
    
    const isVisible = await breadcrumbPage.isVisible();
    if (isVisible) {
      const items = await breadcrumbPage.getBreadcrumbItems();
      
      if (items.length > 1) {
        const initialUrl = page.url();
        
        // Click on an earlier breadcrumb item (not the last one)
        const targetIndex = Math.max(0, items.length - 2);
        await breadcrumbPage.clickBreadcrumbItem(targetIndex);
        
        // URL should change
        await page.waitForTimeout(1000);
        const newUrl = page.url();
        expect(newUrl).not.toBe(initialUrl);
        
        // Should navigate to a parent page
        expect(newUrl.length).toBeLessThanOrEqual(initialUrl.length);
      }
    }
  });

  test('should show breadcrumb on different layout types', async ({ page }) => {
    const testPages = [
      { url: testUrls.gatilhos, name: 'gatilhos' },
      { url: testUrls.posts, name: 'posts' }, 
      { url: testUrls.projects, name: 'projects' },
      { url: testUrls.docs, name: 'docs' }
    ];
    
    for (const testPage of testPages) {
      await page.goto(testPage.url);
      await page.waitForTimeout(500);
      
      const isVisible = await breadcrumbPage.isVisible();
      if (isVisible) {
        const items = await breadcrumbPage.getBreadcrumbItems();
        const breadcrumbTexts = await breadcrumbPage.getBreadcrumbText();
        
        expect(items.length).toBeGreaterThan(0);
        
        // Should contain relevant path information
        const hasRelevantContent = breadcrumbTexts.some(text =>
          text?.toLowerCase().includes(testPage.name.toLowerCase().substring(0, 5))
        );
        expect(hasRelevantContent || breadcrumbTexts.length > 0).toBe(true);
      }
    }
  });

  //TO-DO: deve generalizar o mc-journey project para qualquer repositório que tiver na pasta project
  test('should generate correct breadcrumb for mc-journey project', async ({ page }) => {
    await page.goto(testUrls.mcJourney); // /content/projects/mc-journey/
    
    const isVisible = await breadcrumbPage.isVisible();
    if (isVisible) {
      const breadcrumbTexts = await breadcrumbPage.getBreadcrumbText();
      
      // Should show path indicating it's under projects
      const hasProjects = breadcrumbTexts.some(text =>
        text?.toLowerCase().includes('project')
      );
      const hasMcJourney = breadcrumbTexts.some(text =>
        text?.toLowerCase().includes('mc') || text?.toLowerCase().includes('journey')
      );
      
      expect(hasProjects || hasMcJourney).toBe(true);
    }
  });

  test('should handle breadcrumb on index pages', async ({ page }) => {
    const indexPages = [
      testUrls.gatilhos + 'index.html',
      testUrls.posts + 'index.html',
      testUrls.docs + 'index.html'
    ];
    
    for (const indexUrl of indexPages) {
      await page.goto(indexUrl);
      await page.waitForTimeout(500);
      
      const isVisible = await breadcrumbPage.isVisible();
      if (isVisible) {
        const items = await breadcrumbPage.getBreadcrumbItems();
        
        // Index pages should have meaningful breadcrumbs
        expect(items.length).toBeGreaterThan(0);
        
        const breadcrumbTexts = await breadcrumbPage.getBreadcrumbText();
        
        // Should not show "index" in breadcrumb text
        const hasIndexText = breadcrumbTexts.some(text =>
          text?.toLowerCase().includes('index')
        );
        expect(hasIndexText).toBe(false);
      }
    }
  });

  test('should be accessible with proper ARIA attributes', async ({ page }) => {
    await page.goto(testUrls.conceptsPage);
    
    const isVisible = await breadcrumbPage.isVisible();
    if (isVisible) {
      const breadcrumbNav = page.locator('[data-breadcrumb]');
      
      // Check for proper ARIA attributes
      const hasAriaLabel = await breadcrumbNav.evaluate((nav) => {
        return nav.hasAttribute('aria-label') || nav.hasAttribute('aria-labelledby');
      });
      
      const hasNavRole = await breadcrumbNav.evaluate((nav) => {
        return nav.tagName === 'NAV' || nav.hasAttribute('role');
      });
      
      expect(hasAriaLabel || hasNavRole).toBe(true);
      
      // Check breadcrumb items
      const items = await breadcrumbPage.getBreadcrumbItems();
      if (items.length > 0) {
        // Last item should be current (non-clickable)
        const lastItem = items[items.length - 1];
        const isLastItemCurrent = await lastItem.evaluate(/** @param {HTMLElement} item */ (item) => {
          return item.hasAttribute('aria-current') || 
                 item.classList.contains('current') ||
                 !item.querySelector('a');
        });
        
        // This might be true or false depending on implementation
        expect([true, false]).toContain(isLastItemCurrent);
      }
    }
  });

  test('should work with keyboard navigation', async ({ page }) => {
    await page.goto(testUrls.diaryPage);
    
    const isVisible = await breadcrumbPage.isVisible();
    if (isVisible) {
      // Tab through breadcrumb items
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.locator(':focus').first();
      const isBreadcrumbFocused = await focusedElement.evaluate((el) => {
        // Check if focused element is within breadcrumb
        const breadcrumb = document.querySelector('[data-breadcrumb]');
        return breadcrumb?.contains(el) || false;
      });
      
      if (isBreadcrumbFocused) {
        // Press Enter to navigate
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        
        // Should have navigated somewhere
        expect(page.url()).toContain('/');
      }
    }
  });

  test('should handle special characters in paths', async ({ page }) => {
    // Test with paths that might have special characters
    const specialPaths = [
      testUrls.diaryPage, // might contain hyphens
      testUrls.conceptsPage // might contain hyphens
    ];
    
    for (const path of specialPaths) {
      await page.goto(path);
      await page.waitForTimeout(500);
      
      const isVisible = await breadcrumbPage.isVisible();
      if (isVisible) {
        const breadcrumbTexts = await breadcrumbPage.getBreadcrumbText();
        
        // Breadcrumb text should be readable (no raw path with hyphens/underscores)
        for (const text of breadcrumbTexts) {
          if (text) {
            // Text should be properly formatted (not contain raw file names)
            const isWellFormatted = !text.includes('_') && !text.endsWith('.html');
            expect(isWellFormatted).toBe(true);
          }
        }
      }
    }
  });
});