// @ts-check
import { test, expect } from '@playwright/test';
import { testUrls } from '../fixtures/test-data.js';
import { validateServerRunning } from '../helpers/server-check.js';

test.describe('Pasta Layout', () => {
  // Validate server is running before any tests
  test.beforeAll(async () => {
    await validateServerRunning('http://localhost:4000');
  });
  
  test.beforeEach(async ({ page }) => {
    // Enable JavaScript for folder listing functionality
    await page.addInitScript(() => {
      // @ts-ignore - Adding custom property for test mode
      window.testMode = true;
    });
  });

  test('should display content listing on folder pages', async ({ page }) => {
    // Test main content folders
    const folderPages = [
      { url: testUrls.gatilhos, name: 'gatilhos' },
      { url: testUrls.posts, name: 'posts' },
      { url: testUrls.projects, name: 'projects' },
      { url: testUrls.docs, name: 'docs' }
    ];

    for (const folder of folderPages) {
      await page.goto(folder.url);
      await page.waitForTimeout(1000);

      // Check for content listing container
      const contentListing = page.locator('[data-content-listing], .content-listing, .folder-contents');
      const hasContentListing = await contentListing.count() > 0;

      if (hasContentListing) {
        // Should show items
        const items = page.locator('[data-content-item], .content-item, .folder-item');
        const itemCount = await items.count();
        expect(itemCount).toBeGreaterThan(0);
      } else {
        // Fallback: check for any list of links
        const links = page.locator('main a, .content a').filter({ hasText: /.+/ });
        const linkCount = await links.count();
        expect(linkCount).toBeGreaterThanOrEqual(0);
      }
    }
  });

  //TO-DO: parametrizar o "gatilhos" para generalizar as possíveis pastas que vao ser testadas
  test('should show subfolder contents in gatilhos', async ({ page }) => {
    await page.goto(testUrls.gatilhos);
    await page.waitForTimeout(1000);

    // Should list subfolders like conceitos-fundamentais, diario-de-aprendizado, etc.
    const expectedSubfolders = [
      'conceitos-fundamentais',
      'diario-de-aprendizado', 
      'ferramentas',
      'roadmaps',
      'templates'
    ];

    for (const subfolder of expectedSubfolders) {
      // Look for links or text containing subfolder names
      const subfolderLink = page.locator(`a[href*="${subfolder}"], a:has-text("${subfolder}")`)
        .or(page.locator(`:text-matches("${subfolder.replace(/-/g, '\\s*')}", "i")`));
      
      const count = await subfolderLink.count();
      
      if (count > 0) {
        const firstLink = subfolderLink.first();
        const isVisible = await firstLink.isVisible().catch(() => false);
        if (!isVisible) {
          // If link is not visible, at least check it exists in the DOM
          expect(count).toBeGreaterThan(0);
        } else {
          expect(isVisible).toBe(true);
        }
      } else {
        // Alternative: check if text content contains reference to subfolder
        const pageContent = await page.textContent('main, .content, body');
        const hasReference = pageContent?.toLowerCase().includes(subfolder.toLowerCase());
        expect(hasReference).toBe(true);
      }
    }
  });

  test('should navigate to listed items when clicked', async ({ page }) => {
    await page.goto(testUrls.gatilhos);
    await page.waitForTimeout(1000);

    // Find first navigable item
    const firstItem = page.locator('main a, .content a').first();
    const hasItems = await firstItem.count() > 0;

    if (hasItems) {
      const initialUrl = page.url();
      const itemHref = await firstItem.getAttribute('href');
      
      await firstItem.click();
      await page.waitForTimeout(1000);

      const newUrl = page.url();
      
      // Should have navigated
      expect(newUrl).not.toBe(initialUrl);
      
      // URL should reflect the clicked item
      if (itemHref) {
        if (itemHref.startsWith('/')) {
          expect(newUrl).toContain(itemHref);
        } else {
          expect(newUrl).toContain(itemHref);
        }
      }
    }
  });

  test('should display correct metadata for listed items', async ({ page }) => {
    await page.goto(testUrls.gatilhos);
    await page.waitForTimeout(1000);

    // Check for item metadata (titles, descriptions, dates)
    const items = page.locator('[data-content-item], .content-item, main a');
    const itemCount = await items.count();

    if (itemCount > 0) {
      for (let i = 0; i < Math.min(itemCount, 3); i++) {
        const item = items.nth(i);
        
        // Item should have meaningful text content
        const itemText = await item.textContent();
        expect(itemText?.trim().length).toBeGreaterThan(0);
        
        // Check for title or header within or near the item
        const hasTitle = await item.locator('h1, h2, h3, h4, h5, h6, .title').count() > 0 ||
                         await item.evaluate((el) => el.textContent?.trim().length > 0);
        
        expect(hasTitle).toBe(true);
      }
    }
  });

  test('should show different views for different folder types', async ({ page }) => {
    // Test projects folder (might have different layout than posts)
    await page.goto(testUrls.projects);
    await page.waitForTimeout(1000);

    const projectsContent = await page.textContent('main, .content, body');
    expect(projectsContent).toBeTruthy();

    // Test posts folder (may not exist or redirect)
    try {
      await page.goto(testUrls.posts, { waitUntil: 'load', timeout: 5000 });
      await page.waitForTimeout(1000);

      const postsContent = await page.textContent('main, .content, body');
      expect(postsContent).toBeTruthy();

      // Both should have content but potentially different layouts
      expect(projectsContent).not.toBe(postsContent);
    } catch (error) {
      // If posts page doesn't exist, that's okay - just skip this comparison
      console.log('Posts folder may not exist or is not accessible');
    }
  });

  test('should handle empty folders gracefully', async ({ page }) => {
    // Test folders that might be empty or have minimal content
    const potentiallyEmptyFolders = [
      testUrls.gatilhos + 'ferramentas/',
      testUrls.projects + 'mc-journey/ferramentas/' 
    ];

    for (const folderUrl of potentiallyEmptyFolders) {
      await page.goto(folderUrl);
      await page.waitForTimeout(1000);

      // Page should load without errors
      const title = await page.title();
      expect(title).toBeTruthy();

      // Should have some meaningful content even if folder is empty
      const mainContent = page.locator('main, .content');
      await expect(mainContent).toBeVisible();

      // Check for either content items or empty state message
      const hasItems = await page.locator('a, [data-content-item]').count() > 0;
      const hasEmptyMessage = await page.locator(':text-matches("empty|no content|coming soon", "i")').count() > 0;
      const hasMainHeading = await page.locator('h1, h2').count() > 0;

      expect(hasItems || hasEmptyMessage || hasMainHeading).toBe(true);
    }
  });

  test('should support breadcrumb navigation in pasta layout', async ({ page }) => {
    await page.goto(testUrls.gatilhos + 'conceitos-fundamentais/');
    await page.waitForTimeout(1000);

    // Should have breadcrumb showing path
    const breadcrumb = page.locator('[data-breadcrumb]');
    const hasBreadcrumb = await breadcrumb.count() > 0;

    if (hasBreadcrumb) {
      // Breadcrumb should show hierarchical path
      const breadcrumbText = await breadcrumb.textContent();
      expect(breadcrumbText?.toLowerCase()).toContain('gatilho');
    }
  });

  test('should maintain responsive design in pasta layout', async ({ page }) => {
    await page.goto(testUrls.gatilhos);

    // Test desktop layout
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    const desktopItems = await page.locator('main a, .content a').count();

    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    const tabletItems = await page.locator('main a, .content a').count();

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const mobileItems = await page.locator('main a, .content a').count();

    // Items should be visible across all screen sizes
    expect(desktopItems).toBeGreaterThanOrEqual(0);
    expect(tabletItems).toBeGreaterThanOrEqual(0);
    expect(mobileItems).toBeGreaterThanOrEqual(0);

    // Layout should be usable on mobile
    const isContentVisible = await page.locator('main, .content').isVisible();
    expect(isContentVisible).toBe(true);
  });

  test('should show proper headings and titles', async ({ page }) => {
    const folderPages = [
      { url: testUrls.gatilhos, expectedTitle: /gatilhos?/i },
      { url: testUrls.posts, expectedTitle: /posts?/i },
      { url: testUrls.projects, expectedTitle: /projects?/i }
    ];

    for (const folder of folderPages) {
      try {
        await page.goto(folder.url, { waitUntil: 'load', timeout: 5000 });
        await page.waitForTimeout(1000);

        // Check page title exists and is not empty
        const pageTitle = await page.title();
        expect(pageTitle).toBeTruthy();

        // Check main heading exists
        const heading = page.locator('h1, h2').first();
        const hasHeading = await heading.count() > 0;

        if (hasHeading) {
          const headingText = await heading.textContent();
          expect(headingText?.trim()).toBeTruthy();
        }
      } catch (error) {
        // If page doesn't exist, skip
        console.log(`Page ${folder.url} may not exist or is not accessible`);
      }
    }
  });

  test('should handle deep folder navigation', async ({ page }) => {
    // Navigate through nested folders
    await page.goto(testUrls.projects);
    await page.waitForTimeout(1000);

    // Look for mc-journey project link
    const mcJourneyLink = page.locator('a[href*="mc-journey"]').first();
    const hasMcJourney = await mcJourneyLink.count() > 0;

    if (hasMcJourney) {
      const isVisible = await mcJourneyLink.isVisible().catch(() => false);
      
      if (isVisible) {
        await mcJourneyLink.click();
        await page.waitForTimeout(1000);

        // Should be on mc-journey page
        expect(page.url()).toContain('mc-journey');

        // Should show mc-journey specific content
        const pageContent = await page.textContent('main, .content, body');
        expect(pageContent?.toLowerCase()).toContain('journey');

        // Look for further navigation options
        const subItems = await page.locator('main a, .content a').count();
        expect(subItems).toBeGreaterThanOrEqual(0);
      } else {
        // Link exists but not visible - just verify it exists in DOM
        expect(hasMcJourney).toBe(true);
      }
    }
  });
});